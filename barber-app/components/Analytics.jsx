// Analytics Dashboard - Real-time stats and insights
const { useState, useEffect, useMemo } = React;

function AnalyticsDashboard({ shop, barber, barbers }) {
  const [todayAppts, setTodayAppts] = useState([]);
  const [weekAppts, setWeekAppts] = useState([]);
  const [lastWeekAppts, setLastWeekAppts] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    loadAnalytics();

    // Real-time updates
    const sub = db.subscribeToAppointments(shop.id, () => loadAnalytics());
    return () => sub.unsubscribe();
  }, [shop]);

  const loadAnalytics = async () => {
    try {
      const today = new Date();
      const { start: dayStart, end: dayEnd } = utils.getDayRange(today);
      const { start: weekStart, end: weekEnd } = utils.getWeekRange(today);

      // Last week range
      const lastWeekStart = new Date(weekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(weekStart);

      const [todayData, weekData, lastWeekData, clientData] = await Promise.all([
        db.getAppointments(shop.id, dayStart.toISOString(), dayEnd.toISOString()),
        db.getAppointments(shop.id, weekStart.toISOString(), weekEnd.toISOString()),
        db.getAppointments(shop.id, lastWeekStart.toISOString(), lastWeekEnd.toISOString()),
        db.getClients(shop.id),
      ]);

      // Load services
      const { data: svcData } = await window.supabaseClient
        .from('services').select('*').eq('shop_id', shop.id).eq('is_active', true);

      setTodayAppts(todayData || []);
      setWeekAppts(weekData || []);
      setLastWeekAppts(lastWeekData || []);
      setClients(clientData || []);
      setServices(svcData || []);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Computed stats
  const stats = useMemo(() => {
    const activeToday = todayAppts.filter(a => a.status !== 'cancelled');
    const completedToday = todayAppts.filter(a => a.status === 'completed');
    const activeWeek = weekAppts.filter(a => a.status !== 'cancelled');
    const activeLastWeek = lastWeekAppts.filter(a => a.status !== 'cancelled');
    const completedWeek = weekAppts.filter(a => a.status === 'completed');

    // Revenue estimate (from services)
    const weekRevenue = completedWeek.reduce((sum, a) => {
      const svc = services.find(s => s.id === a.service_id);
      return sum + (svc?.price || 0);
    }, 0);

    const lastWeekRevenue = lastWeekAppts.filter(a => a.status === 'completed').reduce((sum, a) => {
      const svc = services.find(s => s.id === a.service_id);
      return sum + (svc?.price || 0);
    }, 0);

    // Trends
    const apptTrend = activeLastWeek.length > 0
      ? Math.round(((activeWeek.length - activeLastWeek.length) / activeLastWeek.length) * 100)
      : 0;

    const revTrend = lastWeekRevenue > 0
      ? Math.round(((weekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)
      : 0;

    // New clients this week
    const weekStartDate = utils.getWeekRange(new Date()).start;
    const newClients = clients.filter(c => new Date(c.created_at) >= weekStartDate);

    // No-show rate
    const noShows = weekAppts.filter(a => a.status === 'no_show').length;
    const noShowRate = activeWeek.length > 0 ? Math.round((noShows / activeWeek.length) * 100) : 0;

    return {
      todayCount: activeToday.length,
      todayCompleted: completedToday.length,
      weekCount: activeWeek.length,
      weekRevenue,
      apptTrend,
      revTrend,
      totalClients: clients.length,
      newClients: newClients.length,
      noShowRate,
      cancelledWeek: weekAppts.filter(a => a.status === 'cancelled').length
    };
  }, [todayAppts, weekAppts, lastWeekAppts, clients, services]);

  // Hourly distribution for today
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 14 }, (_, i) => ({ hour: i + 7, count: 0 }));
    todayAppts.filter(a => a.status !== 'cancelled').forEach(a => {
      const h = new Date(a.start_time).getHours();
      const slot = hours.find(s => s.hour === h);
      if (slot) slot.count++;
    });
    return hours;
  }, [todayAppts]);

  // Daily distribution for this week
  const dailyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map((name, i) => ({ name, count: 0 }));
    weekAppts.filter(a => a.status !== 'cancelled').forEach(a => {
      const d = new Date(a.start_time).getDay();
      data[d].count++;
    });
    return data;
  }, [weekAppts]);

  // Upcoming appointments today
  const upcoming = useMemo(() => {
    const now = new Date();
    return todayAppts
      .filter(a => a.status !== 'cancelled' && new Date(a.start_time) > now)
      .slice(0, 5);
  }, [todayAppts]);

  // Top services this week
  const topServices = useMemo(() => {
    const counts = {};
    weekAppts.filter(a => a.status !== 'cancelled' && a.service_id).forEach(a => {
      counts[a.service_id] = (counts[a.service_id] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({ service: services.find(s => s.id === id), count }))
      .filter(s => s.service)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [weekAppts, services]);

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
          Dashboard
        </h1>
        <div className="stats-grid">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} lines={1} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SkeletonCard lines={6} />
          <SkeletonCard lines={6} />
        </div>
      </div>
    );
  }

  const maxHourly = Math.max(...hourlyData.map(h => h.count), 1);
  const maxDaily = Math.max(...dailyData.map(d => d.count), 1);
  const todayDayOfWeek = new Date().getDay();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="badge badge-success" style={{ fontSize: 13, padding: '6px 14px' }}>
          {shop?.name}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="Today's Appointments"
          value={stats.todayCount}
          icon="📅"
          color="var(--accent-subtle)"
        />
        <StatCard
          label="This Week"
          value={stats.weekCount}
          icon="📊"
          trend={stats.apptTrend}
          color="rgba(11,147,246,0.15)"
        />
        <StatCard
          label="Week Revenue"
          value={`$${stats.weekRevenue.toLocaleString()}`}
          icon="💰"
          trend={stats.revTrend}
          color="rgba(0,214,143,0.15)"
        />
        <StatCard
          label="Total Clients"
          value={stats.totalClients}
          icon="👥"
          color="rgba(255,170,0,0.15)"
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Today's Schedule Heatmap */}
        <div className="card fade-in" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Today's Schedule</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
            {hourlyData.map(h => {
              const pct = (h.count / maxHourly) * 100;
              const now = new Date().getHours();
              const isCurrent = h.hour === now;
              return (
                <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    className="chart-bar"
                    style={{
                      width: '100%',
                      height: `${Math.max(pct, 3)}%`,
                      background: isCurrent
                        ? 'var(--accent)'
                        : h.count > 0
                          ? 'var(--imessage-blue)'
                          : 'var(--bg-input)',
                      opacity: isCurrent ? 1 : 0.7
                    }}
                    title={`${h.hour > 12 ? h.hour - 12 : h.hour}${h.hour >= 12 ? 'PM' : 'AM'}: ${h.count} appts`}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>7AM</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>12PM</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>5PM</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>8PM</span>
          </div>
        </div>

        {/* Weekly Distribution */}
        <div className="card fade-in" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>This Week</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
            {dailyData.map((d, i) => {
              const pct = (d.count / maxDaily) * 100;
              return (
                <div key={d.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {d.count || ''}
                  </span>
                  <div
                    className="chart-bar"
                    style={{
                      width: '100%',
                      height: `${Math.max(pct, 3)}%`,
                      background: i === todayDayOfWeek
                        ? 'var(--accent)'
                        : d.count > 0
                          ? 'var(--success)'
                          : 'var(--bg-input)',
                      opacity: i === todayDayOfWeek ? 1 : 0.7
                    }}
                  />
                  <span style={{ fontSize: 10, color: i === todayDayOfWeek ? 'var(--accent)' : 'var(--text-muted)', marginTop: 4, fontWeight: i === todayDayOfWeek ? 600 : 400 }}>
                    {d.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Upcoming Today */}
        <div className="card fade-in" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Upcoming Today</h3>
          {upcoming.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {stats.todayCompleted > 0
                ? `All done! ${stats.todayCompleted} completed today.`
                : 'No more appointments today.'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcoming.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${a.status === 'confirmed' ? 'var(--success)' : 'var(--warning)'}`
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{a.clients?.name || 'Walk-in'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {utils.formatTime(a.start_time)}
                      {a.barbers?.name ? ` · ${a.barbers.name}` : ''}
                    </div>
                  </div>
                  <span className={`badge ${a.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats / Top Services */}
        <div className="card fade-in" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Quick Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>New clients this week</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{stats.newClients}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Cancellations</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: stats.cancelledWeek > 0 ? 'var(--accent)' : 'inherit' }}>
                {stats.cancelledWeek}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No-show rate</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: stats.noShowRate > 10 ? 'var(--accent)' : 'var(--success)' }}>
                {stats.noShowRate}%
              </span>
            </div>

            {topServices.length > 0 && (
              <>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Top Services</span>
                </div>
                {topServices.map(({ service, count }) => (
                  <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13 }}>{service.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: Math.max((count / topServices[0].count) * 60, 12), height: 6,
                        background: 'var(--accent)', borderRadius: 3
                      }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 20 }}>{count}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.AnalyticsDashboard = AnalyticsDashboard;
