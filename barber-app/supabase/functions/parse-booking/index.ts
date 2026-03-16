// Supabase Edge Function: Parse Natural Language Booking Requests
// Handles messages like "Book me for Saturday 2pm" or "Can I get braids next Friday at 3?"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { message, clientId, shopId } = await req.json()

    if (!message || !clientId || !shopId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    // Get client preferences for context
    const { data: client } = await supabase
      .from('clients')
      .select('*, preferred_barber_id, preferred_service_id, usual_preferences')
      .eq('id', clientId)
      .single()

    // Get available barbers and services
    const [{ data: barbers }, { data: services }] = await Promise.all([
      supabase.from('barbers').select('id, name').eq('shop_id', shopId),
      supabase.from('services').select('id, name, duration_minutes').eq('shop_id', shopId).eq('is_active', true)
    ])

    // Simple NLP: parse day, time, and service from the message
    const parsed = parseBookingMessage(message, services || [])

    // Use client's preferred barber if not specified
    const barberId = client?.preferred_barber_id || (barbers && barbers.length > 0 ? barbers[0].id : null)

    // Use client's preferred service if not parsed from message
    const serviceId = parsed.serviceId || client?.preferred_service_id || null
    const service = services?.find(s => s.id === serviceId)

    if (!parsed.date || !parsed.time || !barberId) {
      return new Response(JSON.stringify({
        success: false,
        needsInfo: true,
        parsed,
        suggestion: buildSuggestionMessage(parsed, client, services || [])
      }))
    }

    // Check availability
    const dayOfWeek = parsed.date.getDay()
    const { data: availability } = await supabase
      .from('availability')
      .select('*')
      .eq('barber_id', barberId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)

    if (!availability || availability.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        needsInfo: true,
        message: `Sorry, the barber isn't available on ${parsed.date.toLocaleDateString('en-US', { weekday: 'long' })}s. What other day works for you?`
      }))
    }

    // Create the appointment
    const duration = service?.duration_minutes || 30
    const startTime = new Date(parsed.date)
    startTime.setHours(parsed.time.hour, parsed.time.minute, 0, 0)
    const endTime = new Date(startTime.getTime() + duration * 60000)

    const { data: appointment, error } = await supabase.from('appointments').insert({
      barber_id: barberId,
      client_id: clientId,
      shop_id: shopId,
      service_id: serviceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'pending',
      client_preferences: client?.usual_preferences || {}
    }).select().single()

    if (error) throw error

    return new Response(JSON.stringify({
      success: true,
      appointment,
      confirmationMessage: `Booked! ${service?.name || 'Appointment'} on ${startTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at ${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Reply CONFIRM to lock it in.`
    }))
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})

// Simple NLP parser for booking messages
function parseBookingMessage(message: string, services: any[]) {
  const lower = message.toLowerCase()
  const result: any = { date: null, time: null, serviceId: null }

  // Parse day
  const today = new Date()
  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6
  }

  if (lower.includes('today')) {
    result.date = today
  } else if (lower.includes('tomorrow')) {
    result.date = new Date(today.getTime() + 86400000)
  } else {
    for (const [name, num] of Object.entries(dayMap)) {
      if (lower.includes(name) || lower.includes(name.slice(0, 3))) {
        const d = new Date(today)
        const diff = (num - today.getDay() + 7) % 7 || 7 // next occurrence
        d.setDate(today.getDate() + diff)
        result.date = d
        break
      }
    }
  }

  // Parse time
  const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
  if (timeMatch) {
    let hour = parseInt(timeMatch[1])
    const minute = parseInt(timeMatch[2] || '0')
    const ampm = timeMatch[3]

    if (ampm === 'pm' && hour < 12) hour += 12
    if (ampm === 'am' && hour === 12) hour = 0
    if (!ampm && hour < 7) hour += 12 // assume PM for times < 7

    result.time = { hour, minute }
  }

  // Parse service
  for (const service of services) {
    if (lower.includes(service.name.toLowerCase())) {
      result.serviceId = service.id
      break
    }
  }

  return result
}

function buildSuggestionMessage(parsed: any, client: any, services: any[]) {
  const missing = []
  if (!parsed.date) missing.push('what day')
  if (!parsed.time) missing.push('what time')

  let msg = `I'd love to book you! `

  if (missing.length > 0) {
    msg += `Could you tell me ${missing.join(' and ')} works for you?`
  }

  // Suggest their usual service
  if (client?.preferred_service_id) {
    const service = services.find(s => s.id === client.preferred_service_id)
    if (service) {
      msg += `\n\nShould I book your usual ${service.name}?`
    }
  }

  // Suggest based on preferences
  if (client?.usual_preferences && Object.keys(client.usual_preferences).length > 0) {
    const prefs = Object.entries(client.usual_preferences).map(([k, v]) => `${k}: ${v}`).join(', ')
    msg += `\n\nYour usual: ${prefs}`
  }

  return msg
}
