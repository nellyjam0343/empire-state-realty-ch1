// Linq Blue API v3 Client
// Docs: https://apidocs.linqapp.com
// Sandbox: https://dashboard.linqapp.com/sandbox-signup/
// GitHub example: https://github.com/linq-team/ai-agent-example

// ============================================
// CONFIG — Replace with your actual values
// ============================================
const LINQ_API_BASE_URL = 'https://api.linqapp.com/api/partner/v3';
// IMPORTANT: Do NOT put your real API token here in client-side code.
// Messages are sent via Supabase Edge Functions which hold the token securely.
// This placeholder is only used if you're testing locally in sandbox mode.
const LINQ_API_TOKEN = null; // Set in Supabase secrets, not here
const LINQ_BOT_NUMBER = 'YOUR_LINQ_PHONE_NUMBER'; // e.g., '+12055551234'

// ============================================
// CORE API CLIENT
// ============================================
const linq = {
  // Internal: route all API calls through Supabase Edge Function (keeps token server-side)
  _fetch: async (action, payload = {}) => {
    // All Linq calls go through our send-message Edge Function
    // which holds the LINQ_API_TOKEN as a Supabase secret
    const supabaseUrl = window.supabaseClient?.supabaseUrl || SUPABASE_URL;
    const supabaseKey = window.supabaseClient?.supabaseKey || SUPABASE_ANON_KEY;

    const response = await fetch(`${supabaseUrl}/functions/v1/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ action, ...payload })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Send failed (${response.status}): ${text.slice(0, 200)}`);
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

  // Send a text message (routed through Supabase Edge Function)
  sendMessage: async (chatId, text, options = {}) => {
    return linq._fetch('send', { chatId, text, ...options });
  },

  // Send a message with media attachment
  sendMediaMessage: async (chatId, text, mediaUrl, mimeType) => {
    return linq._fetch('send', { chatId, text, mediaUrl, mimeType });
  },

  // Typing indicators
  startTyping: async (chatId) => {
    return linq._fetch('typing', { chatId, active: true });
  },

  stopTyping: async (chatId) => {
    return linq._fetch('typing', { chatId, active: false });
  },

  // Read receipts
  markAsRead: async (chatId) => {
    return linq._fetch('read', { chatId });
  },

  // Reactions (love, like, dislike, laugh, emphasize, question, or custom emoji)
  sendReaction: async (messageId, reaction) => {
    return linq._fetch('react', { messageId, reaction });
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
