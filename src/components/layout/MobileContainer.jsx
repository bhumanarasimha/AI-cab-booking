import React from 'react';
import { Outlet } from 'react-router-dom';

const MobileContainer = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, #040608 60%)' }}
  >
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        width: '100%',
        maxWidth: '390px',
        height: '100dvh',
        maxHeight: '844px',
        background: 'var(--bg-base)',
        borderRadius: window.innerWidth > 640 ? '48px' : '0',
        boxShadow: window.innerWidth > 640 ? '0 0 0 10px #0A0D16, 0 40px 80px rgba(0,0,0,0.8)' : 'none',
      }}
    >
      {/* Notch bar for desktop preview */}
      <div className="hidden sm:flex absolute top-0 inset-x-0 h-7 z-50 justify-center pt-2 pointer-events-none">
        <div style={{ width: '120px', height: '20px', background: '#0A0D16', borderRadius: '0 0 16px 16px' }} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar w-full h-full">
        <Outlet />
      </div>
    </div>
  </div>
);

export default MobileContainer;
