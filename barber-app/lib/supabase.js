// Supabase client initialization
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
const auth = {
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
const db = {
  // Shops
  createShop: async (shop) => {
    const { data, error } = await supabase.from('shops').insert(shop).select().single();
    if (error) throw error;
    return data;
  },

  getShop: async (id) => {
    const { data, error } = await supabase.from('shops').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  getShopByOwner: async (ownerId) => {
    const { data, error } = await supabase.from('shops').select('*').eq('owner_id', ownerId);
    if (error) throw error;
    return data;
  },

  updateShop: async (id, updates) => {
    const { data, error } = await supabase.from('shops').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // Barbers
  createBarber: async (barber) => {
    const { data, error } = await supabase.from('barbers').insert(barber).select().single();
    if (error) throw error;
    return data;
  },

  getBarber: async (userId) => {
    const { data, error } = await supabase.from('barbers').select('*, shops(*)').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  getBarbersByShop: async (shopId) => {
    const { data, error } = await supabase.from('barbers').select('*').eq('shop_id', shopId);
    if (error) throw error;
    return data;
  },

  updateBarber: async (id, updates) => {
    const { data, error } = await supabase.from('barbers').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // Clients
  getClients: async (shopId) => {
    const { data, error } = await supabase.from('clients').select('*').eq('shop_id', shopId).order('name');
    if (error) throw error;
    return data;
  },

  createClient: async (client) => {
    const { data, error } = await supabase.from('clients').insert(client).select().single();
    if (error) throw error;
    return data;
  },

  updateClient: async (id, updates) => {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  deleteClient: async (id) => {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },

  // Availability
  getAvailability: async (barberId) => {
    const { data, error } = await supabase.from('availability').select('*').eq('barber_id', barberId).order('day_of_week');
    if (error) throw error;
    return data;
  },

  setAvailability: async (barberId, slots) => {
    // Replace all availability for this barber
    await supabase.from('availability').delete().eq('barber_id', barberId);
    if (slots.length === 0) return [];
    const { data, error } = await supabase.from('availability').insert(
      slots.map(s => ({ ...s, barber_id: barberId }))
    ).select();
    if (error) throw error;
    return data;
  },

  // Appointments
  getAppointments: async (shopId, startDate, endDate) => {
    let query = supabase.from('appointments')
      .select('*, clients(name, phone), barbers(name)')
      .eq('shop_id', shopId)
      .order('start_time');
    if (startDate) query = query.gte('start_time', startDate);
    if (endDate) query = query.lte('start_time', endDate);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  getAppointmentsByBarber: async (barberId, startDate, endDate) => {
    let query = supabase.from('appointments')
      .select('*, clients(name, phone)')
      .eq('barber_id', barberId)
      .order('start_time');
    if (startDate) query = query.gte('start_time', startDate);
    if (endDate) query = query.lte('start_time', endDate);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  createAppointment: async (appointment) => {
    const { data, error } = await supabase.from('appointments').insert(appointment).select('*, clients(name, phone)').single();
    if (error) throw error;
    return data;
  },

  updateAppointment: async (id, updates) => {
    const { data, error } = await supabase.from('appointments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  cancelAppointment: async (id) => {
    return db.updateAppointment(id, { status: 'cancelled' });
  },

  // Messages
  getMessages: async (shopId, clientId, limit = 50) => {
    const { data, error } = await supabase.from('messages')
      .select('*')
      .eq('shop_id', shopId)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).reverse();
  },

  getConversations: async (shopId) => {
    // Get latest message per client
    const { data, error } = await supabase.rpc('get_conversations', { p_shop_id: shopId });
    if (error) {
      // Fallback: get all clients with their last message
      const { data: clients } = await supabase.from('clients').select('*').eq('shop_id', shopId);
      return clients || [];
    }
    return data;
  },

  logMessage: async (message) => {
    const { data, error } = await supabase.from('messages').insert(message).select().single();
    if (error) throw error;
    return data;
  },

  // Real-time subscriptions
  subscribeToAppointments: (shopId, callback) => {
    return supabase
      .channel(`appointments-${shopId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `shop_id=eq.${shopId}`
      }, callback)
      .subscribe();
  },

  subscribeToMessages: (shopId, callback) => {
    return supabase
      .channel(`messages-${shopId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `shop_id=eq.${shopId}`
      }, callback)
      .subscribe();
  }
};

window.supabaseClient = supabase;
window.auth = auth;
window.db = db;
