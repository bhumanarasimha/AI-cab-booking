import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding'), 2800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(0,216,255,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center relative z-10"
      >
        <div style={{
          width: '88px', height: '88px', borderRadius: '28px',
          background: 'linear-gradient(135deg, #6366F1 0%, #00D8FF 100%)',
          boxShadow: '0 20px 60px rgba(99,102,241,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px'
        }}>
          {/* Custom AI Icon */}
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path d="M22 4L38 13V31L22 40L6 31V13L22 4Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,255,255,0.1)"/>
            <circle cx="22" cy="22" r="6" fill="white"/>
            <circle cx="22" cy="10" r="2.5" fill="rgba(255,255,255,0.7)"/>
            <circle cx="22" cy="34" r="2.5" fill="rgba(255,255,255,0.7)"/>
            <circle cx="10" cy="16" r="2.5" fill="rgba(255,255,255,0.7)"/>
            <circle cx="34" cy="16" r="2.5" fill="rgba(255,255,255,0.7)"/>
            <circle cx="10" cy="28" r="2.5" fill="rgba(255,255,255,0.7)"/>
            <circle cx="34" cy="28" r="2.5" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F1F5F9', lineHeight: 1 }}>
            SmartRide
            <span style={{ background: 'linear-gradient(90deg, #00D8FF, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
          </h1>
          <p style={{ fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.22em', color: '#4B5563', marginTop: '10px', textTransform: 'uppercase' }}>
            Intelligent Mobility
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom loading bar */}
      <motion.div
        className="absolute bottom-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
          style={{ height: '100%', width: '50%', background: 'linear-gradient(90deg, transparent, #6366F1, transparent)', borderRadius: '99px' }}
        />
      </motion.div>
    </div>
  );
};

export default Splash;
