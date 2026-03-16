// ClipBook - Main Application
const { useState, useEffect } = React;

function App() {
  const [user, setUser] = useState(null);
  const [barber, setBarber] = useState(null);
  const [shop, setShop] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [activePage, setActivePage] = useState('calendar');
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);

  // Check for public booking page
  const urlParams = new URLSearchParams(window.location.search);
  const bookingShopId = urlParams.get('book');

  if (bookingShopId) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', padding: 20
      }}>
        <div className="card" style={{ width: '100%', maxWidth: 520, padding: 32 }}>
          <PublicBookingForm shopId={bookingShopId} />
        </div>
      </div>
    );
  }

  // Auth state
  useEffect(() => {
    // Check current session
    auth.getUser().then(u => {
      setUser(u);
      if (u) loadUserData(u.id);
      else setLoading(false);
    }).catch(() => setLoading(false));

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthChange((event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (u) loadUserData(u.id);
      else {
        setBarber(null);
        setShop(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    try {
      // Get barber profile
      const barberData = await db.getBarber(userId);

      if (!barberData) {
        // New user — needs setup
        setSetupMode(true);
        setLoading(false);
        return;
      }

      setBarber(barberData);

      // Get shop
      if (barberData.shop_id) {
        const shopData = await db.getShop(barberData.shop_id);
        setShop(shopData);

        // Get all barbers in the shop
        const shopBarbers = await db.getBarbersByShop(barberData.shop_id);
        setBarbers(shopBarbers);
      } else if (barberData.is_owner) {
        // Owner might need to create a shop
        const shops = await db.getShopByOwner(userId);
        if (shops.length > 0) {
          setShop(shops[0]);
          const shopBarbers = await db.getBarbersByShop(shops[0].id);
          setBarbers(shopBarbers);
        } else {
          setSetupMode(true);
        }
      }
    } catch (err) {
      console.error('Load user data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setBarber(null);
    setShop(null);
  };

  const refreshData = () => {
    if (user) loadUserData(user.id);
  };

  // Loading screen
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: 'pulse 1.5s infinite' }}>✂️</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading ClipBook...</p>
        </div>
      </div>
    );
  }

  // Auth screen
  if (!user) {
    return <AuthScreen onAuth={refreshData} />;
  }

  // Setup screen (new user or no shop)
  if (setupMode) {
    return <SetupWizard user={user} onComplete={() => { setSetupMode(false); loadUserData(user.id); }} />;
  }

  // Main app
  const renderPage = () => {
    switch (activePage) {
      case 'calendar':
        return <CalendarView shop={shop} barber={barber} barbers={barbers} />;
      case 'clients':
        return <ClientListView shop={shop} barber={barber} />;
      case 'messages':
        return <MessagesView shop={shop} barber={barber} />;
      case 'booking':
        return <BookingPageView shop={shop} barber={barber} />;
      case 'shop':
        return <ShopManagerView shop={shop} barber={barber} onUpdate={refreshData} />;
      case 'settings':
        return <SettingsView shop={shop} barber={barber} onUpdate={refreshData} />;
      default:
        return <CalendarView shop={shop} barber={barber} barbers={barbers} />;
    }
  };

  return (
    <DashboardLayout
      barber={barber}
      shop={shop}
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </DashboardLayout>
  );
}

// Setup Wizard (first-time user)
function SetupWizard({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(''); // 'owner' | 'barber'
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (role === 'owner') {
        // Create shop first
        const shop = await db.createShop({
          name: shopName,
          address: shopAddress || null,
          owner_id: user.id
        });

        // Create barber profile
        await db.createBarber({
          user_id: user.id,
          shop_id: shop.id,
          name,
          email: user.email,
          is_owner: true
        });
      } else {
        // Just create barber profile (will join a shop later)
        await db.createBarber({
          user_id: user.id,
          name,
          email: user.email,
          is_owner: false
        });
      }

      onComplete();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 20
    }}>
      <div className="card slide-up" style={{ width: '100%', maxWidth: 480, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✂️</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome to ClipBook
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Let's get you set up</p>
        </div>

        {step === 1 && (
          <div className="fade-in">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>What's your role?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { id: 'owner', label: 'Shop Owner', desc: "I own or manage a barbershop", icon: '🏪' },
                { id: 'barber', label: 'Barber', desc: "I'm a barber at an existing shop", icon: '💈' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRole(r.id); setStep(2); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', border: '1px solid',
                    borderColor: role === r.id ? 'var(--accent)' : 'var(--border)',
                    background: role === r.id ? 'var(--accent-subtle)' : 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit'
                  }}
                >
                  <span style={{ fontSize: 28 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{r.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <div style={{ marginBottom: 16 }}>
              <label className="label">Your Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            </div>

            {role === 'owner' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Shop Name</label>
                  <input className="input" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="e.g., Fresh Cuts Barbershop" />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label className="label">Shop Address (optional)</label>
                  <input className="input" value={shopAddress} onChange={e => setShopAddress(e.target.value)} placeholder="123 Main St, City, State" />
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
              <button
                onClick={handleComplete}
                className="btn btn-primary"
                disabled={loading || !name || (role === 'owner' && !shopName)}
                style={{ flex: 1 }}
              >
                {loading ? 'Setting up...' : 'Get Started'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
