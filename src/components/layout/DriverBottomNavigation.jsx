import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, CalendarDays, Settings } from 'lucide-react';

const DriverBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/captain/dashboard' },
    { icon: Wallet, label: 'Earnings', path: '/captain/earnings' },
    { icon: CalendarDays, label: 'History', path: '/captain/history' },
    { icon: Settings, label: 'Settings', path: '/captain/settings' },
  ];

  return (
    <div className="absolute bottom-0 w-full px-4 pb-6 pt-2 z-50 pointer-events-none">
      <div className="glass-panel py-3 px-6 flex justify-between items-center pointer-events-auto">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 relative group w-16"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-accent-indigo' : 'text-gray-500 group-hover:text-gray-300'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-accent-indigo' : 'text-gray-500 group-hover:text-gray-300'}`}>
                {item.label}
              </span>
              
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute -bottom-1 w-1/2 h-1 bg-accent-indigo rounded-full blur-[2px]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DriverBottomNavigation;
