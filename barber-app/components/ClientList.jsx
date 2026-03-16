// ClientList Component - Client management with preferences and history
const { useState, useEffect } = React;

function ClientListView({ shop, barber }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    db.getClients(shop.id)
      .then(data => { setClients(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [shop]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
            Clients
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            {clients.length} total clients
          </p>
        </div>
        <button onClick={() => setShowAddClient(true)} className="btn btn-primary btn-sm">
          <span style={{ width: 14, height: 14 }}>{Icons.plus}</span>
          Add Client
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          className="input"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Client Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {filtered.map(client => (
          <div
            key={client.id}
            className="card"
            onClick={() => setSelectedClient(client)}
            style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: utils.stringToColor(client.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 600
              }}>
                {utils.getInitials(client.name)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{client.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {utils.formatPhone(client.phone)}
                    </div>
                  </div>
                  <span className="badge badge-accent" style={{ fontSize: 11 }}>
                    {client.visit_count || 0} visits
                  </span>
                </div>

                {/* Last visit & preferences preview */}
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {client.last_visit_at && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Last: {utils.relativeTime(client.last_visit_at)}
                    </span>
                  )}
                  {client.usual_preferences && Object.keys(client.usual_preferences).length > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--imessage-blue)' }}>
                      💡 Has preferences
                    </span>
                  )}
                </div>

                {client.notes && (
                  <div style={{
                    marginTop: 6, fontSize: 12, color: 'var(--text-muted)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    📝 {client.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          {search ? 'No clients match your search.' : 'No clients yet. Add your first client!'}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          shop={shop}
          barber={barber}
          onClose={() => setSelectedClient(null)}
          onUpdate={(updated) => {
            setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
            setSelectedClient(updated);
          }}
          onDelete={(id) => {
            setClients(prev => prev.filter(c => c.id !== id));
            setSelectedClient(null);
          }}
        />
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <AddClientModal
          shop={shop}
          onClose={() => setShowAddClient(false)}
          onCreated={(client) => {
            setClients(prev => [...prev, client].sort((a, b) => a.name.localeCompare(b.name)));
            setShowAddClient(false);
          }}
        />
      )}
    </div>
  );
}

// Client Detail Modal
function ClientDetailModal({ client, shop, barber, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);
  const [email, setEmail] = useState(client.email || '');
  const [notes, setNotes] = useState(client.notes || '');
  const [preferences, setPreferences] = useState(client.usual_preferences || {});
  const [newPrefKey, setNewPrefKey] = useState('');
  const [newPrefVal, setNewPrefVal] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load appointment history for this client
    supabaseClient.from('appointments')
      .select('*, services(name), barbers(name)')
      .eq('client_id', client.id)
      .order('start_time', { ascending: false })
      .limit(20)
      .then(({ data }) => setAppointments(data || []));
  }, [client.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await db.updateClient(client.id, {
        name, phone, email: email || null,
        notes: notes || null,
        usual_preferences: preferences
      });
      onUpdate({ ...client, ...updated });
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addPreference = () => {
    if (!newPrefKey.trim()) return;
    setPreferences(prev => ({ ...prev, [newPrefKey]: newPrefVal || true }));
    setNewPrefKey('');
    setNewPrefVal('');
  };

  const removePreference = (key) => {
    setPreferences(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }} onClick={onClose}>
      <div className="card slide-up" style={{
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', padding: 28
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: utils.stringToColor(client.name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 600, flexShrink: 0
          }}>
            {utils.getInitials(client.name)}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input className="input" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 8, fontSize: 18, fontWeight: 700 }} />
            ) : (
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{client.name}</h2>
            )}
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{utils.formatPhone(client.phone)}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span className="badge badge-accent">{client.visit_count || 0} visits</span>
              {client.last_visit_at && (
                <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
                  Last: {utils.relativeTime(client.last_visit_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit fields */}
        {editing && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Phone</label>
              <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Notes</label>
              <textarea className="input" rows={2} value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* Preferences Section */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
            💡 Usual Preferences
          </h3>
          {Object.keys(preferences).length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {Object.entries(preferences).map(([key, val]) => (
                <span key={key} className="badge badge-blue" style={{ gap: 6 }}>
                  {key}: {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val}
                  {editing && (
                    <button
                      onClick={() => removePreference(key)}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 14, padding: 0 }}
                    >×</button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              No preferences saved yet. They'll auto-populate after appointments.
            </p>
          )}

          {editing && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" placeholder="e.g., braids" value={newPrefKey} onChange={e => setNewPrefKey(e.target.value)} style={{ flex: 1 }} />
              <input className="input" placeholder="e.g., 6" value={newPrefVal} onChange={e => setNewPrefVal(e.target.value)} style={{ flex: 1 }} />
              <button onClick={addPreference} className="btn btn-secondary btn-sm">Add</button>
            </div>
          )}
        </div>

        {/* Appointment History */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
            📅 Appointment History
          </h3>
          {appointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {appointments.slice(0, 10).map(appt => {
                const status = utils.appointmentStatus[appt.status] || utils.appointmentStatus.pending;
                return (
                  <div key={appt.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: 13
                  }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{utils.formatDate(appt.start_time)}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                        {utils.formatTime(appt.start_time)}
                      </span>
                      {appt.services?.name && (
                        <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
                          · {appt.services.name}
                        </span>
                      )}
                    </div>
                    <span style={{ color: status.color, fontSize: 12 }}>{status.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No appointments yet.</p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">Edit</button>
            )}
            <button
              onClick={() => { if (confirm('Delete this client?')) { db.deleteClient(client.id); onDelete(client.id); } }}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--accent)' }}
            >
              Delete
            </button>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

// Add Client Modal
function AddClientModal({ shop, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      const client = await db.createClient({
        shop_id: shop.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        notes: notes.trim() || null
      });
      onCreated(client);
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
      <div className="card slide-up" style={{ width: '100%', maxWidth: 420, padding: 28 }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Add Client</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Name *</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Phone *</label>
            <input className="input" type="tel" placeholder="(555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} placeholder="Anything to remember about this client..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

window.ClientListView = ClientListView;
