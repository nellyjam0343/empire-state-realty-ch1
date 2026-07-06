// ShopManager Component - Multi-barber shop management
const { useState, useEffect } = React;

function ShopManagerView({ shop, barber, onUpdate }) {
  const [barbers, setBarbers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalClients: 0, totalAppointments: 0, monthRevenue: 0 });

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    db.getBarbersByShop(shop.id)
      .then(data => { setBarbers(data); setLoading(false); })
      .catch(() => setLoading(false));

    // Load stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    Promise.all([
      db.getClients(shop.id),
      db.getAppointments(shop.id, monthStart, monthEnd)
    ]).then(([clients, appts]) => {
      setStats({
        totalClients: clients.length,
        totalAppointments: appts.filter(a => a.status !== 'cancelled').length,
        monthRevenue: 0 // Would calculate from services & completed appointments
      });
    }).catch(() => {});
  }, [shop]);

  const inviteBarber = async () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    // In a real app, this would send an invite email
    // For now, we create the barber record linked to the shop
    try {
      const { data, error } = await supabaseClient.from('barbers').insert({
        shop_id: shop.id,
        name: inviteName,
        email: inviteEmail,
        is_owner: false
      }).select().single();

      if (error) throw error;
      setBarbers(prev => [...prev, data]);
      setInviteEmail('');
      setInviteName('');
      setShowInvite(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const removeBarber = async (barberId) => {
    if (!confirm('Remove this barber from your shop?')) return;
    try {
      await supabaseClient.from('barbers').update({ shop_id: null }).eq('id', barberId);
      setBarbers(prev => prev.filter(b => b.id !== barberId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 8 }}>
        Shop Management
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        {shop?.name || 'Your Shop'}
      </p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Barbers', value: barbers.length, icon: '💈' },
          { label: 'Total Clients', value: stats.totalClients, icon: '👥' },
          { label: 'This Month', value: `${stats.totalAppointments} appts`, icon: '📅' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
              </div>
              <span style={{ fontSize: 24 }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Barber List */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Team ({barbers.length})</h3>
          {barber?.is_owner && (
            <button onClick={() => setShowInvite(!showInvite)} className="btn btn-primary btn-sm">
              <span style={{ width: 14, height: 14 }}>{Icons.plus}</span>
              Add Barber
            </button>
          )}
        </div>

        {showInvite && (
          <div style={{
            padding: 16, marginBottom: 16, background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input className="input" placeholder="Barber name" value={inviteName} onChange={e => setInviteName(e.target.value)} style={{ flex: 1 }} />
              <input className="input" type="email" placeholder="Email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ flex: 1 }} />
              <button onClick={inviteBarber} className="btn btn-primary btn-sm">Add</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              They'll need to sign up with this email to link their account.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {barbers.map(b => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: utils.stringToColor(b.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600
              }}>
                {utils.getInitials(b.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {b.name}
                  {b.is_owner && <span className="badge badge-accent" style={{ marginLeft: 8, fontSize: 10 }}>Owner</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {b.email || b.phone || 'No contact info'}
                </div>
                {b.specialties?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {b.specialties.map(s => (
                      <span key={s} className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 10, padding: '2px 8px' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {barber?.is_owner && !b.is_owner && (
                <button onClick={() => removeBarber(b.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)', fontSize: 12 }}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Linq Config */}
      {barber?.is_owner && (
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Messaging (Linq)</h3>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Linq Phone Number</label>
            <input
              className="input"
              placeholder="Your Linq-provisioned number"
              value={shop?.linq_number || ''}
              onChange={async (e) => {
                try {
                  await db.updateShop(shop.id, { linq_number: e.target.value });
                } catch (err) {}
              }}
              style={{ maxWidth: 300 }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Get your Linq number at <a href="https://dashboard.linqapp.com" target="_blank" style={{ color: 'var(--imessage-blue)' }}>dashboard.linqapp.com</a>.
            Messages sent from your shop will come from this number via iMessage (iPhone) or RCS/SMS (Android).
          </p>
        </div>
      )}
    </div>
  );
}

window.ShopManagerView = ShopManagerView;
