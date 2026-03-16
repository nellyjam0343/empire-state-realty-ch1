// Utility functions

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const utils = {
  // Date formatting
  formatDate: (date) => {
    const d = new Date(date);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  },

  formatDateShort: (date) => {
    const d = new Date(date);
    return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
  },

  formatTime: (date) => {
    const d = new Date(date);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  },

  formatTimeSlot: (startTime, endTime) => {
    return `${utils.formatTime(startTime)} - ${utils.formatTime(endTime)}`;
  },

  formatDayOfWeek: (dayNum) => DAYS[dayNum],
  formatDayShort: (dayNum) => DAYS_SHORT[dayNum],

  // Get start/end of week
  getWeekRange: (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },

  // Get start/end of day
  getDayRange: (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },

  // Generate time slots for a day
  generateTimeSlots: (startHour = 8, endHour = 20, intervalMin = 30) => {
    const slots = [];
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += intervalMin) {
        const label = `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
        slots.push({ hour: h, minute: m, label, value: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` });
      }
    }
    return slots;
  },

  // Check if a date is today
  isToday: (date) => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  // Check if a date is in the past
  isPast: (date) => new Date(date) < new Date(),

  // Relative time (e.g., "2 hours ago", "in 30 minutes")
  relativeTime: (date) => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = d - now;
    const diffMin = Math.round(diffMs / 60000);
    const diffHr = Math.round(diffMs / 3600000);
    const diffDay = Math.round(diffMs / 86400000);

    if (Math.abs(diffMin) < 1) return 'just now';
    if (diffMin > 0 && diffMin < 60) return `in ${diffMin}m`;
    if (diffMin < 0 && diffMin > -60) return `${Math.abs(diffMin)}m ago`;
    if (diffHr > 0 && diffHr < 24) return `in ${diffHr}h`;
    if (diffHr < 0 && diffHr > -24) return `${Math.abs(diffHr)}h ago`;
    if (diffDay > 0 && diffDay < 7) return `in ${diffDay}d`;
    if (diffDay < 0 && diffDay > -7) return `${Math.abs(diffDay)}d ago`;
    return utils.formatDateShort(date);
  },

  // Phone formatting
  formatPhone: (phone) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits[0] === '1') {
      return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
    }
    return phone;
  },

  // Validate phone
  isValidPhone: (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
  },

  // Validate email
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

  // Generate initials from name
  getInitials: (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  // Generate a color from a string (for avatars)
  stringToColor: (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#e94560', '#0b93f6', '#00d68f', '#ffaa00', '#a78bfa', '#f472b6', '#34d399', '#fb923c'];
    return colors[Math.abs(hash) % colors.length];
  },

  // Debounce
  debounce: (fn, ms = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  },

  // Status labels and colors
  appointmentStatus: {
    confirmed: { label: 'Confirmed', color: 'var(--success)', bg: 'rgba(0,214,143,0.15)' },
    pending: { label: 'Pending', color: 'var(--warning)', bg: 'rgba(255,170,0,0.15)' },
    cancelled: { label: 'Cancelled', color: 'var(--accent)', bg: 'var(--accent-subtle)' },
    completed: { label: 'Completed', color: 'var(--text-secondary)', bg: 'var(--bg-input)' },
    no_show: { label: 'No Show', color: 'var(--accent)', bg: 'var(--accent-subtle)' }
  }
};

window.utils = utils;
window.DAYS = DAYS;
window.DAYS_SHORT = DAYS_SHORT;
