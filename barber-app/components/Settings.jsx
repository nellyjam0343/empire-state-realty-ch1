// Settings Component - Barber profile, services, and availability
const { useState, useEffect } = React;

function SettingsView({ shop, barber, onUpdate }) {
  const [tab, setTab] = useState('profile'); // 'profile' | 'services' | 'availability'

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 24 }}>
        Settings
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: 4, width: 'fit-content' }}>
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'services', label: 'Services' },
          { id: 'availability', label: 'Availability' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 20px', border: 'none', borderRadius: 6,
              background: tab === t.id ? 'var(--accent)' : 'transparent',
              color: tab === t.id ? 'white' : 'var(--text-secondary)',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && <ProfileSettings barber={barber} shop={shop} onUpdate={onUpdate} />}
      {tab === 'services' && <ServicesSettings shop={shop} />}
      {tab === 'availability' && <AvailabilitySettings barber={barber} />}
    </div>
  );
}

// Profile Settings
function ProfileSettings({ barber, shop, onUpdate }) {
  const [name, setName] = useState(barber?.name || '');
  const [phone, setPhone] = useState(barber?.phone || '');
  const [specialties, setSpecialties] = useState((barber?.specialties || []).join(', '));
  const [shopName, setShopName] = useState(shop?.name || '');
  const [shopAddress, setShopAddress] = useState(shop?.address || '');
  const [shopPhone, setShopPhone] = useState(shop?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (barber) {
        await db.updateBarber(barber.id, {
          name,
          phone,
          specialties: specialties.split(',').map(s => s.trim()).filter(Boolean)
        });
      }
      if (shop && barber?.is_owner) {
        await db.updateShop(shop.id, { name: shopName, address: shopAddress, phone: shopPhone });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Your Profile</h3>

      <div style={{ marginBottom: 16 }}>
        <label className="label">Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="label">Phone</label>
        <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label className="label">Specialties (comma separated)</label>
        <input className="input" placeholder="e.g., braids, fades, beards, lineups" value={specialties} onChange={e => setSpecialties(e.target.value)} />
      </div>

      {barber?.is_owner && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            Shop Info
          </h3>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Shop Name</label>
            <input className="input" value={shopName} onChange={e => setShopName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Address</label>
            <input className="input" value={shopAddress} onChange={e => setShopAddress(e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label">Shop Phone</label>
            <input className="input" type="tel" value={shopPhone} onChange={e => setShopPhone(e.target.value)} />
          </div>
        </>
      )}

      <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}

// Services Management
function ServicesSettings({ shop }) {
  const [services, setServices] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    if (!shop) return;
    supabaseClient.from('services').select('*').eq('shop_id', shop.id).order('name')
      .then(({ data }) => setServices(data || []));
  }, [shop]);

  const addService = async () => {
    if (!newName.trim()) return;
    try {
      const { data, error } = await supabaseClient.from('services').insert({
        shop_id: shop.id,
        name: newName,
        duration_minutes: newDuration,
        price: newPrice ? parseFloat(newPrice) : null,
        description: newDesc || null
      }).select().single();
      if (error) throw error;
      setServices(prev => [...prev, data]);
      setNewName(''); setNewDuration(30); setNewPrice(''); setNewDesc('');
      setShowAdd(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleService = async (id, isActive) => {
    await supabaseClient.from('services').update({ is_active: !isActive }).eq('id', id);
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !isActive } : s));
  };

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    await supabaseClient.from('services').delete().eq('id', id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Common barber services for quick-add
  const quickAdd = ['Haircut', 'Skin Fade', 'Taper Fade', 'Lineup', 'Beard Trim', 'Braids', 'Cornrows', 'Twists', 'Locs Retwist', 'Shampoo & Style', 'Hot Towel Shave', 'Kids Cut'];

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Services ({services.length})</h3>
          <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary btn-sm">
            <span style={{ width: 14, height: 14 }}>{Icons.plus}</span>
            Add Service
          </button>
        </div>

        {showAdd && (
          <div style={{
            padding: 16, marginBottom: 16, background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
          }}>
            {/* Quick add chips */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Quick add:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {quickAdd.filter(q => !services.some(s => s.name === q)).map(q => (
                  <button key={q} onClick={() => setNewName(q)} className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 10px', fontSize: 12 }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input className="input" placeholder="Service name" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 2 }} />
              <input className="input" type="number" placeholder="Min" value={newDuration} onChange={e => setNewDuration(parseInt(e.target.value))} style={{ flex: 1 }} />
              <input className="input" type="number" placeholder="Price $" value={newPrice} onChange={e => setNewPrice(e.target.value)} step="0.01" style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ flex: 1 }} />
              <button onClick={addService} className="btn btn-primary btn-sm">Add</button>
            </div>
          </div>
        )}

        {/* Service list */}
        {services.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: 20 }}>
            No services yet. Add your first service above.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {services.map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
                opacity: s.is_active ? 1 : 0.5
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {s.duration_minutes}min{s.price ? ` · $${Number(s.price).toFixed(2)}` : ''}
                  </div>
                </div>
                <button onClick={() => toggleService(s.id, s.is_active)} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                  {s.is_active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deleteService(s.id)} className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--accent)' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Availability Settings
function AvailabilitySettings({ barber }) {
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!barber) return;
    db.getAvailability(barber.id).then(data => {
      if (data.length > 0) {
        setSlots(data);
      } else {
        // Default: Mon-Sat 9am-6pm
        setSlots([1,2,3,4,5,6].map(d => ({
          day_of_week: d,
          start_time: '09:00',
          end_time: '18:00',
          is_active: true
        })));
      }
    });
  }, [barber]);

  const toggleDay = (day) => {
    const existing = slots.find(s => s.day_of_week === day);
    if (existing) {
      setSlots(prev => prev.map(s => s.day_of_week === day ? { ...s, is_active: !s.is_active } : s));
    } else {
      setSlots(prev => [...prev, { day_of_week: day, start_time: '09:00', end_time: '18:00', is_active: true }]);
    }
  };

  const updateSlot = (day, field, value) => {
    setSlots(prev => prev.map(s => s.day_of_week === day ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const activeSlots = slots.filter(s => s.is_active).map(s => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        is_active: true
      }));
      await db.setAvailability(barber.id, activeSlots);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Weekly Schedule</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {DAYS.map((day, i) => {
          const slot = slots.find(s => s.day_of_week === i);
          const isActive = slot?.is_active || false;

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
              opacity: isActive ? 1 : 0.5
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleDay(i)}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
                />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{day}</span>
              </label>

              {isActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    className="input"
                    type="time"
                    value={slot?.start_time || '09:00'}
                    onChange={e => updateSlot(i, 'start_time', e.target.value)}
                    style={{ width: 120, padding: '6px 10px' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>to</span>
                  <input
                    className="input"
                    type="time"
                    value={slot?.end_time || '18:00'}
                    onChange={e => updateSlot(i, 'end_time', e.target.value)}
                    style={{ width: 120, padding: '6px 10px' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Schedule'}
      </button>
    </div>
  );
}

window.SettingsView = SettingsView;
