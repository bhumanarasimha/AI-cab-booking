import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  {
    path: '/user/home',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#00D8FF' : 'none'} stroke={active ? '#00D8FF' : '#4B5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9" fill={active ? '#00D8FF' : 'none'} stroke={active ? '#00D8FF' : '#4B5563'}/>
      </svg>
    ),
  },
  {
    path: '/user/rides',
    label: 'Rides',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00D8FF' : '#4B5563'} strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="10" width="22" height="9" rx="3"/>
        <path d="M6 10V7a6 6 0 0 1 12 0v3"/>
        <circle cx="8" cy="17" r="1.5" fill={active ? '#00D8FF' : '#4B5563'}/>
        <circle cx="16" cy="17" r="1.5" fill={active ? '#00D8FF' : '#4B5563'}/>
      </svg>
    ),
  },
  {
    path: '/user/parcel',
    label: 'Parcel',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00D8FF' : '#4B5563'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00D8FF' : '#4B5563'} strokeWidth="2" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    path: '/user/profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#00D8FF' : '#4B5563'} strokeWidth="2" strokeLinecap="round">
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
    <div className="bottom-nav absolute bottom-0 w-full z-50 pb-4 pt-6 px-4 pointer-events-none">
      <div
        className="pointer-events-auto flex justify-around items-center"
        style={{
          background: 'linear-gradient(135deg, rgba(20,28,46,0.95) 0%, rgba(15,22,35,0.98) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          padding: '8px 8px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
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
                background: active ? 'rgba(0,216,255,0.08)' : 'transparent',
                border: active ? '1px solid rgba(0,216,255,0.15)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {item.icon(active)}
              <span style={{ fontSize: '10px', fontWeight: 600, color: active ? '#00D8FF' : '#4B5563', letterSpacing: '0.02em' }}>
                {item.label}
              </span>
              {active && (
                <div style={{
                  position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)',
                  width: '20px', height: '2px', borderRadius: '99px',
                  background: '#00D8FF', boxShadow: '0 0 8px #00D8FF',
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
