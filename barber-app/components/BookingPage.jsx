// BookingPage Component - Public-facing booking page (shareable link)
const { useState, useEffect, useMemo } = React;

function BookingPageView({ shop, barber }) {
  const [bookingUrl, setBookingUrl] = useState('');

  useEffect(() => {
    // Generate booking URL based on shop ID
    if (shop) {
      const base = window.location.origin + window.location.pathname;
      setBookingUrl(`${base}?book=${shop.id}`);
    }
  }, [shop]);

  const copyUrl = () => {
    navigator.clipboard.writeText(bookingUrl).then(() => {
      alert('Booking link copied!');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = bookingUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    });
  };

  const sendToAll = async () => {
    if (!confirm('Send booking link to all clients via text?')) return;
    try {
      const clients = await db.getClients(shop.id);
      for (const client of clients) {
        if (client.phone) {
          try {
            await linq.sendBookingLink(linq.formatPhone(client.phone), bookingUrl, shop.name);
          } catch (e) {
            console.log('Send failed for', client.name, e);
          }
        }
      }
      alert(`Booking link sent to ${clients.length} clients!`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 8 }}>
        Booking Link
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Share this link with clients so they can book appointments online.
      </p>

      {/* Link Card */}
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <label className="label">Your booking link</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input className="input" value={bookingUrl} readOnly style={{ flex: 1, fontSize: 13 }} />
          <button onClick={copyUrl} className="btn btn-primary btn-sm">Copy</button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={sendToAll} className="btn btn-secondary btn-sm">
            📱 Text to All Clients
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="card" style={{ maxWidth: 560 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>
          Preview — What clients see
        </h3>
        <div style={{
          background: 'var(--bg-primary)', borderRadius: 'var(--radius)',
          padding: 24, border: '1px solid var(--border)'
        }}>
          <PublicBookingForm shopId={shop?.id} preview={true} />
        </div>
      </div>
    </div>
  );
}

// Public Booking Form (also used standalone at ?book=SHOP_ID)
function PublicBookingForm({ shopId, preview = false }) {
  const [shop, setShop] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatFreq, setRepeatFreq] = useState('biweekly');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [step, setStep] = useState(1); // 1: service, 2: barber, 3: time, 4: info
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;
    Promise.all([
      supabaseClient.from('shops').select('*').eq('id', shopId).single(),
      supabaseClient.from('barbers').select('*').eq('shop_id', shopId),
      supabaseClient.from('services').select('*').eq('shop_id', shopId).eq('is_active', true).order('name')
    ]).then(([shopRes, barbersRes, servicesRes]) => {
      setShop(shopRes.data);
      setBarbers(barbersRes.data || []);
      setServices(servicesRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [shopId]);

  // Load available slots when barber and date change
  useEffect(() => {
    if (!selectedBarber || !date) return;
    const dayOfWeek = new Date(date + 'T12:00').getDay();

    // Get barber's availability for this day
    supabaseClient.from('availability')
      .select('*')
      .eq('barber_id', selectedBarber)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setAvailableSlots([]);
          return;
        }
        // Generate 30-min slots within availability
        const slot = data[0];
        const [startH, startM] = slot.start_time.split(':').map(Number);
        const [endH, endM] = slot.end_time.split(':').map(Number);
        const slots = [];
        for (let h = startH; h < endH || (h === endH && 0 < endM); h++) {
          for (let m = (h === startH ? startM : 0); m < 60; m += 30) {
            if (h > endH || (h === endH && m >= endM)) break;
            const label = `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
            slots.push({ label, value: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` });
          }
        }
        setAvailableSlots(slots);
      });
  }, [selectedBarber, date]);

  const handleBook = async () => {
    if (!name || !phone || !selectedBarber || !date || !time) return;
    setLoading(true);

    try {
      // Find or create client
      let { data: existingClients } = await supabaseClient.from('clients')
        .select('*').eq('shop_id', shopId).eq('phone', phone);

      let clientId;
      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].id;
      } else {
        const { data: newClient } = await supabaseClient.from('clients').insert({
          shop_id: shopId, name, phone, notes: notes || null
        }).select().single();
        clientId = newClient.id;
      }

      const service = services.find(s => s.id === selectedService);
      const duration = service?.duration_minutes || 30;
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      await supabaseClient.from('appointments').insert({
        barber_id: selectedBarber,
        client_id: clientId,
        shop_id: shopId,
        service_id: selectedService || null,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'pending',
        notes: notes || null,
        is_repeat: isRepeat,
        repeat_rule: isRepeat ? { frequency: repeatFreq } : null
      });

      setBooked(true);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !shop) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>;
  }

  if (booked) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Booked!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
          You'll receive a confirmation text shortly.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {utils.formatDate(`${date}T${time}`)} at {availableSlots.find(s => s.value === time)?.label || time}
        </p>
      </div>
    );
  }

  // Minimum date is today
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 32, marginBottom: 4 }}>✂️</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          {shop?.name || 'Book an Appointment'}
        </h2>
        {shop?.address && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{shop.address}</p>
        )}
      </div>

      {/* Step 1: Service */}
      <div style={{ marginBottom: 20 }}>
        <label className="label">Service</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {services.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedService(s.id); if (!selectedBarber) setStep(2); }}
              style={{
                padding: '10px 16px', border: '1px solid',
                borderColor: selectedService === s.id ? 'var(--accent)' : 'var(--border)',
                background: selectedService === s.id ? 'var(--accent-subtle)' : 'var(--bg-input)',
                color: selectedService === s.id ? 'var(--accent)' : 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 14
              }}
            >
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                {s.duration_minutes}min{s.price ? ` · $${Number(s.price).toFixed(2)}` : ''}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Barber */}
      {barbers.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <label className="label">Barber</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {barbers.map(b => (
              <button
                key={b.id}
                onClick={() => { setSelectedBarber(b.id); setStep(3); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', border: '1px solid',
                  borderColor: selectedBarber === b.id ? 'var(--accent)' : 'var(--border)',
                  background: selectedBarber === b.id ? 'var(--accent-subtle)' : 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: utils.stringToColor(b.name),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600
                }}>
                  {utils.getInitials(b.name)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                  {b.specialties?.length > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.specialties.join(', ')}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Auto-select single barber */}
      {barbers.length === 1 && !selectedBarber && barbers[0] && (() => { setSelectedBarber(barbers[0].id); return null; })()}

      {/* Step 3: Date & Time */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label className="label">Date</label>
          <input className="input" type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="label">Time</label>
          {availableSlots.length > 0 ? (
            <select className="input" value={time} onChange={e => setTime(e.target.value)}>
              <option value="">Pick a time...</option>
              {availableSlots.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          ) : (
            <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          )}
        </div>
      </div>

      {/* Step 4: Client Info */}
      <div style={{ marginBottom: 16 }}>
        <label className="label">Your Name</label>
        <input className="input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="label">Phone Number</label>
        <input className="input" type="tel" placeholder="(555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="label">Notes (optional)</label>
        <input className="input" placeholder="Any special requests..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      {/* Repeat booking */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
        padding: '12px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
          <input type="checkbox" checked={isRepeat} onChange={e => setIsRepeat(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: 'var(--accent)' }} />
          Make this a recurring appointment
        </label>
        {isRepeat && (
          <select className="input" value={repeatFreq} onChange={e => setRepeatFreq(e.target.value)}
            style={{ width: 'auto', padding: '6px 10px' }}>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every 2 weeks</option>
            <option value="triweekly">Every 3 weeks</option>
            <option value="monthly">Monthly</option>
          </select>
        )}
      </div>

      <button
        onClick={preview ? undefined : handleBook}
        className="btn btn-primary"
        disabled={preview || !name || !phone || !date || !time}
        style={{ width: '100%', padding: '14px 0', fontSize: 15 }}
      >
        {preview ? 'Book Appointment (Preview)' : 'Book Appointment'}
      </button>
    </div>
  );
}

window.BookingPageView = BookingPageView;
window.PublicBookingForm = PublicBookingForm;
