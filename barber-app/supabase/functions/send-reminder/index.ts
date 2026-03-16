// Supabase Edge Function: Send Appointment Reminders
// Should be called by a cron job (Supabase pg_cron or external scheduler)
// Sends 24-hour and 1-hour reminders for upcoming appointments

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const LINQ_API_KEY = Deno.env.get('LINQ_API_KEY')
    const now = new Date()
    let sentCount = 0

    // --- 24-hour reminders ---
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000)

    const { data: reminders24 } = await supabase
      .from('appointments')
      .select('id, start_time, barbers(name), clients(name, phone), shops(name, linq_number)')
      .in('status', ['pending', 'confirmed'])
      .eq('reminder_24h_sent', false)
      .gte('start_time', in23h.toISOString())
      .lte('start_time', in24h.toISOString())

    for (const appt of reminders24 || []) {
      const client = (appt as any).clients
      const barberName = (appt as any).barbers?.name || 'Your barber'
      const shopName = (appt as any).shops?.name || 'the shop'
      const linqNumber = (appt as any).shops?.linq_number

      if (client?.phone && linqNumber && LINQ_API_KEY) {
        const startTime = new Date(appt.start_time)
        const timeStr = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

        await sendMessage(LINQ_API_KEY, linqNumber, client.phone,
          `⏰ Reminder: You have an appointment tomorrow at ${timeStr}\n\n` +
          `${barberName} at ${shopName}\n\n` +
          `Reply CONFIRM to confirm or CANCEL to cancel.`
        )

        await supabase.from('appointments').update({ reminder_24h_sent: true }).eq('id', appt.id)
        sentCount++
      }
    }

    // --- 1-hour reminders ---
    const in1h = new Date(now.getTime() + 60 * 60 * 1000)
    const in50m = new Date(now.getTime() + 50 * 60 * 1000)

    const { data: reminders1 } = await supabase
      .from('appointments')
      .select('id, start_time, barbers(name), clients(name, phone), shops(name, linq_number)')
      .in('status', ['pending', 'confirmed'])
      .eq('reminder_1h_sent', false)
      .gte('start_time', in50m.toISOString())
      .lte('start_time', in1h.toISOString())

    for (const appt of reminders1 || []) {
      const client = (appt as any).clients
      const barberName = (appt as any).barbers?.name || 'Your barber'
      const shopName = (appt as any).shops?.name || 'the shop'
      const linqNumber = (appt as any).shops?.linq_number

      if (client?.phone && linqNumber && LINQ_API_KEY) {
        await sendMessage(LINQ_API_KEY, linqNumber, client.phone,
          `⏰ Heads up! Your appointment is in about 1 hour.\n\n` +
          `${barberName} at ${shopName}\n\n` +
          `See you soon! 💈`
        )

        await supabase.from('appointments').update({ reminder_1h_sent: true }).eq('id', appt.id)
        sentCount++
      }
    }

    return new Response(JSON.stringify({
      success: true,
      reminders_sent: sentCount,
      checked_at: now.toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Reminder error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

async function sendMessage(apiKey: string, from: string, to: string, body: string) {
  try {
    const response = await fetch('https://api.linqapp.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ from, to, body })
    })
    if (!response.ok) {
      console.error('Linq send failed:', await response.text())
    }
  } catch (err) {
    console.error('Send error:', err)
  }
}
