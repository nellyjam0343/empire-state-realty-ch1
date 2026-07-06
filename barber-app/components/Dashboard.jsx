// Dashboard Component - Main layout with sidebar navigation
const { useState, useEffect } = React;

// SVG Icons
const Icons = {
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  message: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  shop: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  scissors: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
};

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: Icons.scissors },
  { id: 'calendar', label: 'Calendar', icon: Icons.calendar },
  { id: 'clients', label: 'Clients', icon: Icons.users },
  { id: 'messages', label: 'Messages', icon: Icons.message },
  { id: 'booking', label: 'Booking Link', icon: Icons.link },
  { id: 'shop', label: 'Shop', icon: Icons.shop },
  { id: 'settings', label: 'Settings', icon: Icons.settings },
];

function DashboardLayout({ barber, shop, children, activePage, onNavigate, onLogout }) {
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    if (!shop) return;
    const today = new Date();
    const { start, end } = utils.getDayRange(today);
    db.getAppointments(shop.id, start.toISOString(), end.toISOString())
      .then(appts => setTodayCount(appts.filter(a => a.status !== 'cancelled').length))
      .catch(() => {});
  }, [shop]);

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <nav className="sidebar">
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>✂️</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20, fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>ClipBook</span>
          </div>
          {shop && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 34 }}>{shop.name}</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card" style={{ padding: '12px 14px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Today</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {todayCount} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-secondary)' }}>appointments</span>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '10px 12px', marginBottom: 4,
                border: 'none', borderRadius: 'var(--radius-sm)',
                background: activePage === item.id ? 'var(--accent-subtle)' : 'transparent',
                color: activePage === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
              }}
            >
              <span style={{ width: 20, height: 20 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* User */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 16,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: utils.stringToColor(barber?.name || ''),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 600
          }}>
            {utils.getInitials(barber?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {barber?.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {barber?.is_owner ? 'Owner' : 'Barber'}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="btn-ghost btn-icon"
            title="Log out"
            style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'var(--text-muted)' }}
          >
            <span style={{ width: 18, height: 18 }}>{Icons.logout}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          {NAV_ITEMS.slice(0, 5).map(item => (
            <button
              key={item.id}
              className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span style={{ width: 22, height: 22 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DashboardLayout = DashboardLayout;
window.Icons = Icons;
