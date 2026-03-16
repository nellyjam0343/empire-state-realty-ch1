// Supabase Edge Function: Linq Webhook Handler
// Receives incoming messages from Linq (iMessage, RCS, SMS)
// Deploy: supabase functions deploy linq-webhook

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const payload = await req.json()

    // Linq webhook payload structure
    const {
      from,        // sender phone number
      to,          // your Linq number
      body,        // message content
      messageId,   // Linq message ID
      channel,     // 'imessage', 'rcs', 'sms'
      timestamp
    } = payload

    // Find the shop by Linq number
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('linq_number', to)
      .single()

    if (!shop) {
      return new Response(JSON.stringify({ error: 'Shop not found for this number' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Find or create client by phone
    let { data: clients } = await supabase
      .from('clients')
      .select('id, name, usual_preferences, preferred_service_id')
      .eq('shop_id', shop.id)
      .eq('phone', from)

    let clientId: string
    let clientData: any = null

    if (clients && clients.length > 0) {
      clientId = clients[0].id
      clientData = clients[0]
    } else {
      // Create new client
      const { data: newClient } = await supabase
        .from('clients')
        .insert({ shop_id: shop.id, name: 'New Client', phone: from })
        .select()
        .single()
      clientId = newClient!.id
    }

    // Log the inbound message
    await supabase.from('messages').insert({
      shop_id: shop.id,
      client_id: clientId,
      direction: 'inbound',
      content: body,
      channel,
      linq_message_id: messageId
    })

    // Parse commands from the message
    const normalizedBody = body.trim().toUpperCase()

    if (normalizedBody === 'CANCEL') {
      // Cancel next upcoming appointment
      const { data: nextAppt } = await supabase
        .from('appointments')
        .select('id, start_time, barbers(name)')
        .eq('client_id', clientId)
        .eq('shop_id', shop.id)
        .in('status', ['pending', 'confirmed'])
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(1)
        .single()

      if (nextAppt) {
        await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', nextAppt.id)

        // Send cancellation confirmation
        await sendLinqMessage(to, from, `Your appointment has been cancelled. Text BOOK anytime to reschedule.`)
      } else {
        await sendLinqMessage(to, from, `You don't have any upcoming appointments. Text BOOK to schedule one.`)
      }
    } else if (normalizedBody === 'CONFIRM') {
      // Confirm next upcoming appointment
      const { data: nextAppt } = await supabase
        .from('appointments')
        .select('id')
        .eq('client_id', clientId)
        .eq('shop_id', shop.id)
        .eq('status', 'pending')
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(1)
        .single()

      if (nextAppt) {
        await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', nextAppt.id)
        await sendLinqMessage(to, from, `Appointment confirmed! See you then. 💈`)
      }
    } else if (normalizedBody === 'BOOK') {
      // Send booking link with context
      const { data: shopData } = await supabase.from('shops').select('name').eq('id', shop.id).single()

      let message = `Book your appointment at ${shopData?.name || 'our shop'}:\n`

      // If returning client with preferences, mention them
      if (clientData?.usual_preferences && Object.keys(clientData.usual_preferences).length > 0) {
        const prefs = Object.entries(clientData.usual_preferences)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
        message += `\nYour usual: ${prefs}\n`
      }

      // TODO: Include actual booking URL
      message += `\nReply with the day and time you'd like, and we'll get you booked.`

      await sendLinqMessage(to, from, message)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// Helper: Send message via Linq API
async function sendLinqMessage(from: string, to: string, body: string) {
  const LINQ_API_KEY = Deno.env.get('LINQ_API_KEY')
  if (!LINQ_API_KEY) {
    console.log('LINQ_API_KEY not set, skipping send')
    return
  }

  const response = await fetch('https://api.linqapp.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINQ_API_KEY}`
    },
    body: JSON.stringify({ from, to, body })
  })

  if (!response.ok) {
    console.error('Linq send failed:', await response.text())
  }
}
