// Calendar Component - Weekly/Daily view with appointments
const { useState, useEffect, useMemo } = React;

function CalendarView({ shop, barber, barbers }) {
  const [view, setView] = useState('day'); // 'day' | 'week'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filterBarber, setFilterBarber] = useState('all');
  const [loading, setLoading] = useState(true);

  const hours = useMemo(() => {
    const h = [];
    for (let i = 7; i <= 21; i++) h.push(i);
    return h;
  }, []);

  const weekDays = useMemo(() => {
    const { start } = utils.getWeekRange(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  // Load appointments
  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    const range = view === 'week' ? utils.getWeekRange(currentDate) : utils.getDayRange(currentDate);
    db.getAppointments(shop.id, range.start.toISOString(), range.end.toISOString())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shop, currentDate, view]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!shop) return;
    const channel = db.subscribeToAppointments(shop.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        setAppointments(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setAppointments(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a));
      } else if (payload.eventType === 'DELETE') {
        setAppointments(prev => prev.filter(a => a.id !== payload.old.id));
      }
    });
    return () => channel.unsubscribe();
  }, [shop]);

  const filteredAppts = filterBarber === 'all'
    ? appointments
    : appointments.filter(a => a.barber_id === filterBarber);

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const getApptPosition = (appt) => {
    const start = new Date(appt.start_time);
    const end = new Date(appt.end_time);
    const top = (start.getHours() - 7) * 60 + start.getMinutes();
    const height = Math.max(20, (end - start) / 60000);
    return { top, height };
  };

  const getApptColor = (appt) => {
    const status = utils.appointmentStatus[appt.status] || utils.appointmentStatus.pending;
    return status;
  };

  const headerLabel = view === 'week'
    ? `${utils.formatDateShort(weekDays[0])} - ${utils.formatDateShort(weekDays[6])}, ${weekDays[0].getFullYear()}`
    : utils.formatDate(currentDate);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Calendar</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{headerLabel}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Barber filter */}
          {barbers && barbers.length > 1 && (
            <select
              value={filterBarber}
              onChange={e => setFilterBarber(e.target.value)}
              className="input"
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="all">All Barbers</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}

          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: 2 }}>
            {['day', 'week'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="btn-sm"
                style={{
                  border: 'none', borderRadius: 6, padding: '6px 14px',
                  background: view === v ? 'var(--accent)' : 'transparent',
                  color: view === v ? 'white' : 'var(--text-secondary)',
                  fontFamily: 'inherit', fontSize: 13, cursor: 'pointer'
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">&lt;</button>
          <button onClick={goToday} className="btn btn-secondary btn-sm">Today</button>
          <button onClick={() => navigate(1)} className="btn btn-secondary btn-sm">&gt;</button>

          <button onClick={() => setShowNewAppt(true)} className="btn btn-primary btn-sm">
            <span style={{ width: 16, height: 16 }}>{Icons.plus}</span>
            New
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {view === 'week' ? (
          /* Week View */
          <div style={{ display: 'flex' }}>
            {/* Time column */}
            <div style={{ width: 60, borderRight: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ height: 48, borderBottom: '1px solid var(--border)' }} />
              {hours.map(h => (
                <div key={h} style={{
                  height: 60, borderBottom: '1px solid var(--border)',
                  padding: '4px 8px', fontSize: 11, color: 'var(--text-muted)'
                }}>
                  {h % 12 || 12}{h >= 12 ? 'p' : 'a'}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, i) => {
              const isToday = utils.isToday(day);
              const dayAppts = filteredAppts.filter(a => {
                const d = new Date(a.start_time);
                return d.toDateString() === day.toDateString();
              });

              return (
                <div key={i} style={{ flex: 1, borderRight: i < 6 ? '1px solid var(--border)' : 'none', minWidth: 0 }}>
                  {/* Day header */}
                  <div style={{
                    height: 48, borderBottom: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: isToday ? 'var(--accent-subtle)' : 'transparent'
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {DAYS_SHORT[day.getDay()]}
                    </div>
                    <div style={{
                      fontSize: 16, fontWeight: 700,
                      color: isToday ? 'var(--accent)' : 'var(--text-primary)',
                      width: 28, height: 28, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isToday ? 'var(--accent)' : 'transparent',
                      color: isToday ? 'white' : 'var(--text-primary)'
                    }}>
                      {day.getDate()}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div style={{ position: 'relative' }}>
                    {hours.map(h => (
                      <div key={h} style={{
                        height: 60, borderBottom: '1px solid var(--border)',
                        cursor: 'pointer'
                      }}
                        onClick={() => {
                          const slot = new Date(day);
                          slot.setHours(h, 0, 0, 0);
                          setSelectedSlot(slot);
                          setShowNewAppt(true);
                        }}
                      />
                    ))}

                    {/* Appointments */}
                    {dayAppts.map(appt => {
                      const { top, height } = getApptPosition(appt);
                      const status = getApptColor(appt);
                      return (
                        <div key={appt.id} style={{
                          position: 'absolute',
                          top: top, left: 2, right: 2,
                          height: Math.max(height, 24),
                          background: status.bg,
                          borderLeft: `3px solid ${status.color}`,
                          borderRadius: 4, padding: '2px 6px',
                          fontSize: 11, overflow: 'hidden',
                          cursor: 'pointer'
                        }}>
                          <div style={{ fontWeight: 600, color: status.color }}>
                            {appt.clients?.name || 'Client'}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                            {utils.formatTime(appt.start_time)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Day View */
          <div style={{ display: 'flex' }}>
            {/* Time column */}
            <div style={{ width: 70, borderRight: '1px solid var(--border)', flexShrink: 0 }}>
              {hours.map(h => (
                <div key={h} style={{
                  height: 80, borderBottom: '1px solid var(--border)',
                  padding: '8px 12px', fontSize: 12, color: 'var(--text-muted)'
                }}>
                  {h % 12 || 12}:00 {h >= 12 ? 'PM' : 'AM'}
                </div>
              ))}
            </div>

            {/* Appointments column */}
            <div style={{ flex: 1, position: 'relative' }}>
              {hours.map(h => (
                <div key={h} style={{
                  height: 80, borderBottom: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
                  onClick={() => {
                    const slot = new Date(currentDate);
                    slot.setHours(h, 0, 0, 0);
                    setSelectedSlot(slot);
                    setShowNewAppt(true);
                  }}
                />
              ))}

              {/* Appointments */}
              {filteredAppts.filter(a => a.status !== 'cancelled').map(appt => {
                const start = new Date(appt.start_time);
                const end = new Date(appt.end_time);
                const top = (start.getHours() - 7) * 80 + (start.getMinutes() / 60) * 80;
                const height = Math.max(((end - start) / 3600000) * 80, 36);
                const status = getApptColor(appt);

                return (
                  <div key={appt.id} style={{
                    position: 'absolute',
                    top, left: 8, right: 8,
                    height,
                    background: status.bg,
                    borderLeft: `4px solid ${status.color}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{appt.clients?.name || 'Client'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                          {utils.formatTime(appt.start_time)} - {utils.formatTime(appt.end_time)}
                        </div>
                        {appt.notes && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            {appt.notes}
                          </div>
                        )}
                      </div>
                      <span className="badge" style={{ background: status.bg, color: status.color, fontSize: 10 }}>
                        {status.label}
                      </span>
                    </div>
                    {appt.is_repeat && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                        🔄 Repeats {appt.repeat_rule?.frequency || ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      {showNewAppt && (
        <NewAppointmentModal
          shop={shop}
          barber={barber}
          barbers={barbers}
          initialTime={selectedSlot}
          onClose={() => { setShowNewAppt(false); setSelectedSlot(null); }}
          onCreated={(appt) => {
            setAppointments(prev => [...prev, appt]);
            setShowNewAppt(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}

// New Appointment Modal
function NewAppointmentModal({ shop, barber, barbers, initialTime, onClose, onCreated }) {
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [barberId, setBarberId] = useState(barber?.id || '');
  const [date, setDate] = useState(initialTime ? initialTime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialTime ? `${initialTime.getHours().toString().padStart(2,'0')}:${initialTime.getMinutes().toString().padStart(2,'0')}` : '10:00');
  const [notes, setNotes] = useState('');
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatFreq, setRepeatFreq] = useState('biweekly');
  const [loading, setLoading] = useState(false);
  const [clientSuggestion, setClientSuggestion] = useState(null);

  useEffect(() => {
    if (!shop) return;
    db.getClients(shop.id).then(setClients).catch(() => {});
    supabaseClient.from('services').select('*').eq('shop_id', shop.id).eq('is_active', true)
      .then(({ data }) => setServices(data || []));
  }, [shop]);

  // Smart suggestion: when client is selected, show their usual preferences
  useEffect(() => {
    if (!clientId) { setClientSuggestion(null); return; }
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const suggestion = {};
      if (client.preferred_service_id) {
        suggestion.service = client.preferred_service_id;
        if (!serviceId) setServiceId(client.preferred_service_id);
      }
      if (client.preferred_barber_id) {
        suggestion.barber = client.preferred_barber_id;
      }
      if (client.usual_preferences && Object.keys(client.usual_preferences).length > 0) {
        suggestion.preferences = client.usual_preferences;
      }
      if (client.visit_count > 0) {
        suggestion.visitCount = client.visit_count;
      }
      setClientSuggestion(Object.keys(suggestion).length > 0 ? suggestion : null);
    }
  }, [clientId, clients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || !barberId) return;
    setLoading(true);

    try {
      const service = services.find(s => s.id === serviceId);
      const duration = service?.duration_minutes || 30;
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const client = clients.find(c => c.id === clientId);

      const appt = await db.createAppointment({
        barber_id: barberId,
        client_id: clientId,
        shop_id: shop.id,
        service_id: serviceId || null,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'confirmed',
        notes: notes || null,
        client_preferences: client?.usual_preferences || {},
        is_repeat: isRepeat,
        repeat_rule: isRepeat ? { frequency: repeatFreq } : null
      });

      // Send confirmation via Linq
      if (client?.phone) {
        try {
          await linq.sendConfirmation(linq.formatPhone(client.phone), {
            barberName: barber?.name || 'Your barber',
            date: utils.formatDate(startTime),
            time: utils.formatTime(startTime),
            shopName: shop.name
          });
        } catch (e) {
          console.log('Linq send failed (sandbox mode):', e);
        }
      }

      onCreated(appt);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }} onClick={onClose}>
      <div className="card slide-up" style={{
        width: '100%', maxWidth: 480, maxHeight: '90vh', overflow: 'auto', padding: 28
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>New Appointment</h2>

        <form onSubmit={handleSubmit}>
          {/* Client select */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Client</label>
            <select className="input" value={clientId} onChange={e => setClientId(e.target.value)} required>
              <option value="">Select client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.visit_count > 0 ? `(${c.visit_count} visits)` : '(new)'}
                </option>
              ))}
            </select>
          </div>

          {/* Smart Suggestion Banner */}
          {clientSuggestion && (
            <div style={{
              padding: '10px 14px', marginBottom: 16,
              background: 'rgba(11,147,246,0.1)', border: '1px solid rgba(11,147,246,0.3)',
              borderRadius: 'var(--radius-sm)', fontSize: 13
            }}>
              <div style={{ fontWeight: 600, color: 'var(--imessage-blue)', marginBottom: 4 }}>
                💡 Smart Suggestion
              </div>
              {clientSuggestion.visitCount && (
                <div style={{ color: 'var(--text-secondary)' }}>
                  {clientSuggestion.visitCount} previous visits
                </div>
              )}
              {clientSuggestion.preferences && Object.entries(clientSuggestion.preferences).map(([key, val]) => (
                <div key={key} style={{ color: 'var(--text-secondary)' }}>
                  Usual: {key} — {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val}
                </div>
              ))}
            </div>
          )}

          {/* Service select */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Service</label>
            <select className="input" value={serviceId} onChange={e => setServiceId(e.target.value)}>
              <option value="">Select service...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration_minutes}min{s.price ? ` · $${s.price}` : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Barber select (for multi-barber shops) */}
          {barbers && barbers.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <label className="label">Barber</label>
              <select className="input" value={barberId} onChange={e => setBarberId(e.target.value)} required>
                {barbers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date & Time */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Date</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Time</label>
              <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} required />
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Any special requests..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Repeat Booking */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
            padding: '12px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input
                type="checkbox"
                checked={isRepeat}
                onChange={e => setIsRepeat(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
              />
              Repeat booking
            </label>
            {isRepeat && (
              <select
                className="input"
                value={repeatFreq}
                onChange={e => setRepeatFreq(e.target.value)}
                style={{ width: 'auto', padding: '6px 10px' }}
              >
                <option value="weekly">Every week</option>
                <option value="biweekly">Every 2 weeks</option>
                <option value="triweekly">Every 3 weeks</option>
                <option value="monthly">Every month</option>
              </select>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

window.CalendarView = CalendarView;
