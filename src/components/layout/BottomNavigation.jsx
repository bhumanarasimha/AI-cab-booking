import { useNavigate, useLocation } from 'react-router-dom';


const navItems = [
  {
    path: '/user/home',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--brand-cyan)' : 'none'} stroke={active ? 'var(--brand-cyan)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9" fill={active ? 'var(--brand-cyan)' : 'none'} stroke={active ? 'var(--brand-cyan)' : 'var(--text-muted)'}/>
      </svg>
    ),
  },
  {
    path: '/user/commute',
    label: 'Commute',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--brand-cyan)' : 'none'} stroke={active ? 'var(--brand-cyan)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    path: '/user/parcel',
    label: 'Parcel',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--brand-cyan)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="17"/>
        <line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/>
      </svg>
    ),
  },
  {
    path: '/user/activity',
    label: 'Activity',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--brand-cyan)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    path: '/user/profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--brand-cyan)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
];

const BottomNavigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="bottom-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-[1000] pb-4 pt-6 px-4 pointer-events-none" style={{ maxWidth: '390px' }}>
      <div
        className="pointer-events-auto flex justify-around items-center"
        style={{
          background: 'var(--bg-surface)',
          backdropFilter: 'blur(24px)',
          border: '1px solid var(--border-ui)',
          borderRadius: '24px',
          padding: '8px 8px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        }}
      >
        {navItems.map(item => {
          const active = pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', padding: '8px 12px', borderRadius: '16px',
                background: active ? 'rgba(var(--brand-cyan-rgb), 0.08)' : 'transparent',
                border: active ? '1px solid rgba(var(--brand-cyan-rgb), 0.15)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {item.icon(active)}
              <span style={{ fontSize: '10px', fontWeight: 600, color: active ? 'var(--brand-cyan)' : 'var(--text-muted)', letterSpacing: '0.02em' }}>
                {item.label}
              </span>
              {active && (
                <div style={{
                  position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)',
                  width: '20px', height: '2px', borderRadius: '99px',
                  background: 'var(--brand-cyan)', boxShadow: '0 0 8px var(--brand-cyan)',
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
