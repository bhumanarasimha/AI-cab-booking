import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import appIcon from '../../assets/app-icon.png';

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
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px',
          overflow: 'hidden',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-ui)'
        }}>
          <img src={appIcon} alt="SmartRide AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1 }}>
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
