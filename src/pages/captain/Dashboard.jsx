import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Power, Map, Activity, TrendingUp, DollarSign, Bell, CheckCircle2 } from 'lucide-react';
import MapPlaceholder from '../../components/ui/MapPlaceholder';
import DriverBottomNavigation from '../../components/layout/DriverBottomNavigation';

const CaptainDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="h-full w-full relative flex flex-col bg-background-main">
      {/* Map Background (dimmed) */}
      <div className="absolute inset-0 z-0 opacity-40">
        <MapPlaceholder />
        
        {/* Heatmap overlay simulation */}
        <div className="absolute top-[40%] left-[30%] w-64 h-64 bg-red-500/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute top-[20%] right-[20%] w-48 h-48 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none" />
      </div>

      {/* Top Header */}
      <div className="p-6 z-20 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-accent-indigo overflow-hidden relative">
            <div className="absolute inset-0 bg-accent-indigo/20 flex items-center justify-center text-accent-indigo font-bold">
              M
            </div>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Mike Rivera</h1>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-status-success" />
              <span className="text-xs text-gray-400">Verified Captain</span>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-background-secondary/80 backdrop-blur-md flex items-center justify-center border border-white/5 relative">
          <Bell size={20} className="text-gray-300" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-status-danger rounded-full" />
        </button>
      </div>

      {/* Go Online Toggle */}
      <div className="flex justify-center z-20 mt-4 mb-8">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOnline(!isOnline);
            // Simulate incoming request shortly after going online
            if (!isOnline) {
              setTimeout(() => {
                navigate('/captain/incoming-request');
              }, 3000);
            }
          }}
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 border-[6px] shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-500 ${
            isOnline 
              ? 'bg-status-success/20 border-status-success text-status-success shadow-status-success/20' 
              : 'bg-background-secondary border-background-card text-gray-500'
          }`}
        >
          <Power size={40} strokeWidth={3} />
          <span className="font-bold uppercase tracking-wider text-sm">
            {isOnline ? 'Online' : 'Go'}
          </span>
        </motion.button>
      </div>

      <div className="flex-1 px-4 z-20 flex flex-col gap-4 overflow-y-auto pb-32 no-scrollbar">
        {/* Status Card */}
        <div className="glass-panel p-5 relative overflow-hidden">
          {isOnline ? (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-status-success animate-pulse" />
              <span className="text-white font-medium">Finding AI-optimized trips...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-gray-400 font-medium">You are currently offline</span>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium uppercase">Today's Earnings</span>
              <DollarSign size={16} className="text-accent-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-white">$142.50</h2>
            <span className="text-xs text-status-success flex items-center gap-1">
              <TrendingUp size={12} /> +12% vs yesterday
            </span>
          </div>
          
          <div className="glass-panel p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium uppercase">Ride Score</span>
              <Activity size={16} className="text-accent-indigo" />
            </div>
            <h2 className="text-2xl font-bold text-white">4.95</h2>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              Top 5% of Drivers
            </span>
          </div>
        </div>

        {/* Demand Prediction */}
        <div className="glass-panel p-5 mt-2 border-l-4 border-l-status-warning">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-bold">AI Demand Alert</h3>
            <span className="bg-status-warning/20 text-status-warning text-[10px] px-2 py-0.5 rounded uppercase font-bold">High Surge</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Events ending at Downtown Stadium in 15 mins. Head towards Sector 4 for predicted 1.5x surge pricing.
          </p>
        </div>
      </div>

      <DriverBottomNavigation />
    </div>
  );
};

export default CaptainDashboard;
