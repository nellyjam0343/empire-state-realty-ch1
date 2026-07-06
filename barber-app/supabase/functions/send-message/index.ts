// Supabase Edge Function: Secure Linq API Proxy
// Keeps the Linq API token server-side — frontend calls this instead of Linq directly.
//
// Set your Linq token as a Supabase secret:
//   supabase secrets set LINQ_API_TOKEN=8ca8ccae-d302-4402-a5de-8c3fa0643ba3
//
// Actions: send, typing, read, react

const LINQ_API_BASE = 'https://api.linqapp.com/api/partner/v3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const LINQ_API_TOKEN = Deno.env.get('LINQ_API_TOKEN')
  if (!LINQ_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'LINQ_API_TOKEN not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { action, chatId, text, mediaUrl, mimeType, active, messageId, reaction, effect, replyTo } = await req.json()

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINQ_API_TOKEN}`
    }

    let response: Response

    switch (action) {
      case 'send': {
        // Build message parts
        const parts: any[] = []
        if (text) parts.push({ type: 'text', text })
        if (mediaUrl) parts.push({ type: 'attachment', url: mediaUrl, mimeType: mimeType || 'image/jpeg' })

        const body: any = { parts }
        if (replyTo) body.replyTo = replyTo
        if (effect) body.effect = effect

        // Start typing
        await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/typing`, {
          method: 'POST',
          headers: authHeaders
        })

        // Brief pause for natural feel
        await new Promise(r => setTimeout(r, 400))

        // Send message
        response = await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/messages`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(body)
        })

        // Stop typing
        await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/typing`, {
          method: 'DELETE',
          headers: authHeaders
        })
        break
      }

      case 'typing': {
        response = await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/typing`, {
          method: active ? 'POST' : 'DELETE',
          headers: authHeaders
        })
        break
      }

      case 'read': {
        response = await fetch(`${LINQ_API_BASE}/chats/${encodeURIComponent(chatId)}/read`, {
          method: 'POST',
          headers: authHeaders
        })
        break
      }

      case 'react': {
        response = await fetch(`${LINQ_API_BASE}/messages/${encodeURIComponent(messageId)}/reactions`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ reaction })
        })
        break
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    const responseText = await response.text()
    let responseData
    try { responseData = JSON.parse(responseText) } catch { responseData = { raw: responseText } }

    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      data: responseData
    }), {
      status: response.ok ? 200 : response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Send-message error:', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
