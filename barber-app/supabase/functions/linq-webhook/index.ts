// Supabase Edge Function: Linq Blue v3 Webhook Handler
// Receives incoming messages from Linq (iMessage, RCS, SMS)
// Deploy: supabase functions deploy linq-webhook
//
// Set these secrets in Supabase:
//   supabase secrets set LINQ_API_TOKEN=your_token
//   supabase secrets set LINQ_VERIFY_TOKEN=your_verify_token
//
// Configure webhook URL in Linq dashboard:
//   https://YOUR_PROJECT.supabase.co/functions/v1/linq-webhook

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LINQ_API_BASE = 'https://api.linqapp.com/api/partner/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Webhook verification (GET request from Linq)
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const verifyToken = url.searchParams.get('verify_token')
    const challenge = url.searchParams.get('challenge')

    if (verifyToken === Deno.env.get('LINQ_VERIFY_TOKEN')) {
      return new Response(challenge || 'ok', { headers: corsHeaders })
    }
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const payload = await req.json()
    const { event, data } = payload

    // Only handle incoming messages
    if (event !== 'message.received') {
      console.log(`Ignoring event: ${event}`)
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Extract from Linq v3 webhook payload
    const {
      chatId,      // sender phone number (e.g., "+15551234567")
      messageId,   // Linq message ID
      sender,      // sender phone
      recipient,   // your Linq number
      parts,       // message parts: [{type: "text", text: "..."}, {type: "attachment", ...}]
      service,     // "iMessage", "SMS", or "RCS"
      timestamp
    } = data

    // Extract text content from message parts
    const textParts = (parts || []).filter((p: any) => p.type === 'text')
    const body = textParts.map((p: any) => p.text).join(' ').trim()

    if (!body) {
      console.log('Empty message, skipping')
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const fromPhone = sender || chatId

    // Find the shop by Linq number
    const { data: shop } = await supabase
      .from('shops')
      .select('id, name')
      .eq('linq_number', recipient)
      .single()

    if (!shop) {
      console.error('No shop found for Linq number:', recipient)
      return new Response(JSON.stringify({ error: 'Shop not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Find or create client by phone
    let { data: clients } = await supabase
      .from('clients')
      .select('id, name, usual_preferences, preferred_service_id, preferred_barber_id')
      .eq('shop_id', shop.id)
      .eq('phone', fromPhone)

    let clientId: string
    let clientData: any = null

    if (clients && clients.length > 0) {
      clientId = clients[0].id
      clientData = clients[0]
    } else {
      const { data: newClient } = await supabase
        .from('clients')
        .insert({ shop_id: shop.id, name: 'New Client', phone: fromPhone })
        .select()
        .single()
      clientId = newClient!.id
    }

    // Mark chat as read
    await markAsRead(chatId)

    // Log the inbound message
    await supabase.from('messages').insert({
      shop_id: shop.id,
      client_id: clientId,
      direction: 'inbound',
      content: body,
      channel: (service || 'sms').toLowerCase(),
      linq_message_id: messageId
    })

    // Process commands
    const normalizedBody = body.trim().toUpperCase()

    if (normalizedBody === 'CANCEL') {
      await handleCancel(supabase, clientId, shop, chatId)
    } else if (normalizedBody === 'CONFIRM') {
      await handleConfirm(supabase, clientId, shop, chatId)
    } else if (normalizedBody === 'BOOK') {
      await handleBook(supabase, clientId, clientData, shop, chatId)
    } else {
      // For unrecognized messages, try to parse as a booking request
      // or just acknowledge receipt
      console.log(`Unhandled message from ${fromPhone}: ${body}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// ============================================
// COMMAND HANDLERS
// ============================================

async function handleCancel(supabase: any, clientId: string, shop: any, chatId: string) {
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
    await sendLinqMessage(chatId, `Your appointment has been cancelled. Text BOOK anytime to reschedule.`)
  } else {
    await sendLinqMessage(chatId, `You don't have any upcoming appointments. Text BOOK to schedule one.`)
  }
}

async function handleConfirm(supabase: any, clientId: string, shop: any, chatId: string) {
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
    await sendLinqMessage(chatId, `Appointment confirmed! See you then. 💈`)
  } else {
    await sendLinqMessage(chatId, `No pending appointments to confirm. Text BOOK to schedule one.`)
  }
}

async function handleBook(supabase: any, clientId: string, clientData: any, shop: any, chatId: string) {
  let message = `Book your appointment at ${shop.name}:\n`

  // If returning client with preferences, mention them
  if (clientData?.usual_preferences && Object.keys(clientData.usual_preferences).length > 0) {
    const prefs = Object.entries(clientData.usual_preferences)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    message += `\nYour usual: ${prefs}\n`
  }

  message += `\nReply with the day and time you'd like, and we'll get you booked.`
  message += `\nOr visit our booking page to pick a time.`

  await sendLinqMessage(chatId, message)
}

// ============================================
// LINQ API HELPERS
// ============================================

async function sendLinqMessage(chatId: string, text: string) {
  const LINQ_API_TOKEN = Deno.env.get('LINQ_API_TOKEN')
  if (!LINQ_API_TOKEN) {
    console.log('LINQ_API_TOKEN not set, skipping send')
    return
  }

  try {
    // Start typing indicator
    await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/typing`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LINQ_API_TOKEN}` }
    })

    // Brief pause for realistic typing feel
    await new Promise(resolve => setTimeout(resolve, 500))

    // Send message using v3 endpoint
    const response = await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINQ_API_TOKEN}`
      },
      body: JSON.stringify({
        parts: [{ type: 'text', text }]
      })
    })

    // Stop typing
    await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/typing`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${LINQ_API_TOKEN}` }
    })

    if (!response.ok) {
      console.error('Linq send failed:', await response.text())
    }
  } catch (err) {
    console.error('Linq send error:', err)
  }
}

async function markAsRead(chatId: string) {
  const LINQ_API_TOKEN = Deno.env.get('LINQ_API_TOKEN')
  if (!LINQ_API_TOKEN) return

  try {
    await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LINQ_API_TOKEN}` }
    })
  } catch (err) {
    console.error('Mark read error:', err)
  }
}
