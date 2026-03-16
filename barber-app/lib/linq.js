// Linq API helper
// Docs: https://apidocs.linqapp.com
// Sandbox: https://dashboard.linqapp.com/sandbox-signup/

const LINQ_API_URL = 'https://api.linqapp.com/v1';
const LINQ_API_KEY = 'YOUR_LINQ_API_KEY'; // Replace with your key

const linq = {
  // Send a message to a client via iMessage/RCS/SMS
  sendMessage: async (to, body, options = {}) => {
    const payload = {
      to,
      body,
      ...options
    };

    // In production, this call goes through a Supabase Edge Function
    // to keep the API key server-side. For sandbox/dev, direct calls work.
    try {
      const response = await fetch(`${LINQ_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINQ_API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to send message');
      }

      return await response.json();
    } catch (err) {
      console.error('Linq send error:', err);
      throw err;
    }
  },

  // Send appointment confirmation
  sendConfirmation: async (clientPhone, appointmentDetails) => {
    const { barberName, date, time, shopName } = appointmentDetails;
    const body = `✅ Appointment confirmed!\n\n` +
      `${barberName} at ${shopName}\n` +
      `📅 ${date}\n` +
      `🕐 ${time}\n\n` +
      `Reply CANCEL to cancel or RESCHEDULE to change your time.`;

    return linq.sendMessage(clientPhone, body);
  },

  // Send appointment reminder
  sendReminder: async (clientPhone, appointmentDetails) => {
    const { barberName, time, shopName, hoursUntil } = appointmentDetails;
    const timeLabel = hoursUntil === 1 ? 'in 1 hour' : `tomorrow at ${time}`;
    const body = `⏰ Reminder: You have an appointment ${timeLabel}\n\n` +
      `${barberName} at ${shopName}\n\n` +
      `Reply CONFIRM to confirm or CANCEL to cancel.`;

    return linq.sendMessage(clientPhone, body);
  },

  // Send follow-up after appointment
  sendFollowUp: async (clientPhone, barberName) => {
    const body = `Thanks for coming in! Hope you love the cut. 💈\n\n` +
      `— ${barberName}\n\n` +
      `Text BOOK to schedule your next appointment.`;

    return linq.sendMessage(clientPhone, body);
  },

  // Send custom message (blast or individual)
  sendCustom: async (clientPhone, message) => {
    return linq.sendMessage(clientPhone, message);
  },

  // Send booking link
  sendBookingLink: async (clientPhone, bookingUrl, shopName) => {
    const body = `Book your next appointment at ${shopName}:\n${bookingUrl}`;
    return linq.sendMessage(clientPhone, body);
  },

  // Format phone number to E.164
  formatPhone: (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
    return `+${digits}`;
  }
};

window.linq = linq;
