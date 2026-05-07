import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col px-6 pt-16 pb-10" style={{ background: 'var(--bg-base)' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:'absolute', top:'5%', left:'-10%', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter:'blur(40px)' }} />
      </div>

      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="z-10">
        <div className="ai-chip px-3 py-1.5 mb-5" style={{ width:'fit-content' }}>
          <div style={{ width:'6px', height:'6px', borderRadius:'99px', background:'var(--brand-cyan)', flexShrink:0 }} />
          Welcome to SmartRide AI
        </div>
        <h1 style={{ fontSize:'2rem', fontWeight:800, letterSpacing:'-0.02em', color:'#F1F5F9', lineHeight:1.2, marginBottom:'8px' }}>
          How will you<br/>be using the app?
        </h1>
        <p style={{ fontSize:'0.9rem', color:'#4B5563', lineHeight:1.6 }}>
          Choose your role to get a personalized experience.
        </p>
      </motion.div>

      <div className="flex-1 flex flex-col justify-center gap-4 z-10">
        {/* User Card */}
        <motion.button
          initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15, duration:0.5 }}
          onClick={() => navigate('/login', { state:{ role:'user' } })}
          className="card text-left w-full group"
          style={{ padding:'24px', cursor:'pointer', transition:'all 0.25s ease' }}
          whileHover={{ y:-2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div style={{
                width:'48px', height:'48px', borderRadius:'14px',
                background:'linear-gradient(135deg, rgba(0,216,255,0.15), rgba(0,216,255,0.05))',
                border:'1px solid rgba(0,216,255,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'16px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#00D8FF" strokeWidth="2"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#00D8FF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize:'1.15rem', fontWeight:700, color:'#F1F5F9', marginBottom:'4px' }}>Continue as Rider</h2>
              <p style={{ fontSize:'0.85rem', color:'#4B5563' }}>Book AI-optimized routes</p>
            </div>
            <div style={{
              width:'36px', height:'36px', borderRadius:'10px',
              background:'rgba(0,216,255,0.08)', border:'1px solid rgba(0,216,255,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, marginLeft:'16px',
            }}>
              <ArrowRight size={18} color="#00D8FF" />
            </div>
          </div>
        </motion.button>

        {/* Captain Card */}
        <motion.button
          initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25, duration:0.5 }}
          onClick={() => navigate('/login', { state:{ role:'captain' } })}
          className="card text-left w-full group"
          style={{ padding:'24px', cursor:'pointer', transition:'all 0.25s ease' }}
          whileHover={{ y:-2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div style={{
                width:'48px', height:'48px', borderRadius:'14px',
                background:'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
                border:'1px solid rgba(99,102,241,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'16px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="11" width="20" height="8" rx="3" stroke="#6366F1" strokeWidth="2"/>
                  <path d="M5 11V9a7 7 0 0114 0v2" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="8" cy="17" r="2" stroke="#6366F1" strokeWidth="1.5"/>
                  <circle cx="16" cy="17" r="2" stroke="#6366F1" strokeWidth="1.5"/>
                </svg>
              </div>
              <h2 style={{ fontSize:'1.15rem', fontWeight:700, color:'#F1F5F9', marginBottom:'4px' }}>Continue as Captain</h2>
              <p style={{ fontSize:'0.85rem', color:'#4B5563' }}>Drive smart, earn more</p>
            </div>
            <div style={{
              width:'36px', height:'36px', borderRadius:'10px',
              background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, marginLeft:'16px',
            }}>
              <ArrowRight size={18} color="#6366F1" />
            </div>
          </div>
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
        className="text-center z-10"
        style={{ fontSize:'0.75rem', color:'#374151', lineHeight:1.6 }}
      >
        By continuing, you agree to our{' '}
        <span style={{ color:'#6B7280', textDecoration:'underline', cursor:'pointer' }}>Terms of Service</span>{' '}and{' '}
        <span style={{ color:'#6B7280', textDecoration:'underline', cursor:'pointer' }}>Privacy Policy</span>.
      </motion.p>
    </div>
  );
};

export default RoleSelection;
