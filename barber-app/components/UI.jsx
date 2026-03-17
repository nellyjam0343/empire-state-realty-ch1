// Shared UI Components: Toast, ErrorBoundary, Skeletons
const { useState, useEffect, useCallback, createContext, useContext, Component } = React;

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
const ToastContext = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ success: (msg) => addToast(msg, 'success'), error: (msg) => addToast(msg, 'error'), info: (msg) => addToast(msg, 'info'), warning: (msg) => addToast(msg, 'warning') }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : 'ℹ'}</span>
              <span>{t.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: 40, margin: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// LOADING SKELETONS
// ============================================
function Skeleton({ width, height, borderRadius, style }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width || '100%',
        height: height || 16,
        borderRadius: borderRadius || 'var(--radius-sm)',
        background: 'linear-gradient(90deg, var(--bg-input) 25%, var(--bg-card) 50%, var(--bg-input) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style
      }}
    />
  );
}

function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Skeleton width={40} height={40} borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={`${90 - i * 15}%`} height={12} style={{ marginBottom: 8 }} />
      ))}
    </div>
  );
}

function SkeletonList({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}

// ============================================
// STAT CARD (for dashboard analytics)
// ============================================
function StatCard({ label, value, icon, trend, color }) {
  return (
    <div className="card fade-in" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
          {trend !== undefined && (
            <p style={{ fontSize: 12, marginTop: 4, color: trend >= 0 ? 'var(--success)' : 'var(--accent)' }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last week
            </p>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-sm)',
          background: color || 'var(--accent-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon || '📋'}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: action ? 20 : 0 }}>
        {description}
      </p>
      {action && (
        <button className="btn btn-primary" onClick={onAction}>{action}</button>
      )}
    </div>
  );
}

// Export to window
window.ToastProvider = ToastProvider;
window.useToast = useToast;
window.ErrorBoundary = ErrorBoundary;
window.Skeleton = Skeleton;
window.SkeletonCard = SkeletonCard;
window.SkeletonList = SkeletonList;
window.StatCard = StatCard;
window.EmptyState = EmptyState;
