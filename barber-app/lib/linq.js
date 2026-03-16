// Linq Blue API v3 Client
// Docs: https://apidocs.linqapp.com
// Sandbox: https://dashboard.linqapp.com/sandbox-signup/
// GitHub example: https://github.com/linq-team/ai-agent-example

// ============================================
// CONFIG — Replace with your actual values
// ============================================
const LINQ_API_BASE_URL = 'https://api.linqapp.com/api/partner/v3';
const LINQ_API_TOKEN = 'YOUR_LINQ_API_TOKEN'; // Bearer token from Linq dashboard
const LINQ_BOT_NUMBER = 'YOUR_LINQ_PHONE_NUMBER'; // e.g., '+12055551234'

// ============================================
// CORE API CLIENT
// ============================================
const linq = {
  // Internal: make authenticated API call
  _fetch: async (path, method = 'GET', body = null) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINQ_API_TOKEN}`
      }
    };
    if (body) options.body = JSON.stringify(body);

    // In production, proxy through Supabase Edge Function to keep token server-side
    const response = await fetch(`${LINQ_API_BASE_URL}${path}`, options);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Linq API error (${response.status}): ${text.slice(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null;
  },

  // ============================================
  // MESSAGES
  // Endpoint: POST /v3/chats/{chatId}/messages
  // ============================================

  // Send a text message to a chat (phone number = chatId for 1:1)
  sendMessage: async (chatId, text, options = {}) => {
    const body = {
      parts: [{ type: 'text', text }]
    };

    // Optional: reply to a specific message
    if (options.replyTo) {
      body.replyTo = options.replyTo;
    }

    // Optional: screen effect (confetti, fireworks, balloons, heart, lasers, spotlight, echo)
    if (options.effect) {
      body.effect = options.effect;
    }

    return linq._fetch(`/chats/${encodeURIComponent(chatId)}/messages`, 'POST', body);
  },

  // Send a message with media attachment
  sendMediaMessage: async (chatId, text, mediaUrl, mimeType) => {
    const body = {
      parts: [
        { type: 'text', text },
        { type: 'attachment', url: mediaUrl, mimeType }
      ]
    };
    return linq._fetch(`/chats/${encodeURIComponent(chatId)}/messages`, 'POST', body);
  },

  // ============================================
  // TYPING INDICATORS
  // ============================================

  startTyping: async (chatId) => {
    return linq._fetch(`/chats/${encodeURIComponent(chatId)}/typing`, 'POST');
  },

  stopTyping: async (chatId) => {
    return linq._fetch(`/chats/${encodeURIComponent(chatId)}/typing`, 'DELETE');
  },

  // ============================================
  // READ RECEIPTS
  // ============================================

  markAsRead: async (chatId) => {
    return linq._fetch(`/chats/${encodeURIComponent(chatId)}/read`, 'POST');
  },

  // ============================================
  // REACTIONS (tapbacks)
  // Standard: love, like, dislike, laugh, emphasize, question
  // Also supports custom emoji reactions
  // ============================================

  sendReaction: async (messageId, reaction) => {
    return linq._fetch(`/messages/${encodeURIComponent(messageId)}/reactions`, 'POST', {
      reaction
    });
  },

  // ============================================
  // CHAT INFO
  // ============================================

  getChat: async (chatId) => {
    return linq._fetch(`/chats/${encodeURIComponent(chatId)}`, 'GET');
  },

  // ============================================
  // BARBER-SPECIFIC MESSAGE TEMPLATES
  // ============================================

  // Send appointment confirmation
  sendConfirmation: async (clientPhone, appointmentDetails) => {
    const { barberName, date, time, shopName } = appointmentDetails;
    const text = `✅ Appointment confirmed!\n\n` +
      `${barberName} at ${shopName}\n` +
      `📅 ${date}\n` +
      `🕐 ${time}\n\n` +
      `Reply CANCEL to cancel or RESCHEDULE to change your time.`;

    return linq.sendMessage(clientPhone, text);
  },

  // Send appointment reminder
  sendReminder: async (clientPhone, appointmentDetails) => {
    const { barberName, time, shopName, hoursUntil } = appointmentDetails;
    const timeLabel = hoursUntil === 1 ? 'in 1 hour' : `tomorrow at ${time}`;
    const text = `⏰ Reminder: You have an appointment ${timeLabel}\n\n` +
      `${barberName} at ${shopName}\n\n` +
      `Reply CONFIRM to confirm or CANCEL to cancel.`;

    return linq.sendMessage(clientPhone, text);
  },

  // Send follow-up after appointment
  sendFollowUp: async (clientPhone, barberName) => {
    const text = `Thanks for coming in! Hope you love the cut. 💈\n\n` +
      `— ${barberName}\n\n` +
      `Text BOOK to schedule your next appointment.`;

    return linq.sendMessage(clientPhone, text);
  },

  // Send custom message
  sendCustom: async (clientPhone, message) => {
    return linq.sendMessage(clientPhone, message);
  },

  // Send booking link
  sendBookingLink: async (clientPhone, bookingUrl, shopName) => {
    const text = `Book your next appointment at ${shopName}:\n${bookingUrl}`;
    return linq.sendMessage(clientPhone, text);
  },

  // ============================================
  // UTILITIES
  // ============================================

  // Format phone number to E.164 (used as chatId for 1:1 chats)
  formatPhone: (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
    return `+${digits}`;
  }
};

// ============================================
// WEBHOOK EVENT TYPES (for reference)
// Your Supabase Edge Function will receive these from Linq:
//
// Event: "message.received" — client sent a message
// Event: "message.sent" — your message was sent
// Event: "message.delivered" — your message was delivered
//
// Webhook payload structure:
// {
//   event: "message.received",
//   data: {
//     chatId: "+15551234567",       // client phone number
//     messageId: "msg_abc123",      // unique message ID
//     sender: "+15551234567",       // who sent it
//     recipient: "+12055551234",    // your Linq number
//     parts: [
//       { type: "text", text: "Book me for Saturday 2pm" },
//       { type: "attachment", url: "...", mimeType: "image/jpeg" }
//     ],
//     service: "iMessage",          // "iMessage", "SMS", or "RCS"
//     timestamp: "2026-03-16T..."
//   }
// }
// ============================================

window.linq = linq;
window.LINQ_BOT_NUMBER = LINQ_BOT_NUMBER;
