import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.displayName || 'Rider';
  const accent = '#00D8FF';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/user/home');
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-base)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Background Ambient Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ 
          position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', 
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' 
        }} 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.6, 0.4] 
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ 
          position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px', 
          background: `radial-gradient(circle, #6366F122 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' 
        }} 
      />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180, y: 20 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          style={{ 
            width: '110px', height: '110px', borderRadius: '32px', 
            background: 'rgba(var(--brand-cyan-rgb), 0.05)', 
            border: `1px solid rgba(var(--brand-cyan-rgb), 0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '36px',
            boxShadow: `0 0 60px rgba(var(--brand-cyan-rgb), 0.15)`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={52} color={accent} />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: '0.9rem', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '16px' }}
          >
            Identity Verified
          </motion.h2>
        </div>

        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '12px', lineHeight: 1.1 }}
        >
          Welcome back,<br />
          <span style={{ 
            background: `linear-gradient(135deg, ${accent}, #6366F1)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 20px rgba(var(--brand-cyan-rgb), 0.3))`
          }}>
            {userName}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}
        >
          Preparing your AI-optimized commute experience...
        </motion.p>

        {/* Loading Progress Bar Container */}
        <div style={{ marginTop: '54px', position: 'relative' }}>
          <div style={{ width: '220px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.8, ease: "circOut" }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${accent}, #6366F1)`, boxShadow: `0 0 15px ${accent}` }}
            />
          </div>
          
          {/* Subtle percentage counter */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2.8, times: [0, 0.1, 1] }}
            style={{ position: 'absolute', top: '-25px', right: 0, fontSize: '0.7rem', fontWeight: 700, color: accent }}
          >
            Optimizing...
          </motion.div>
        </div>

        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Loader2 size={14} color={accent} className="animate-spin" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>Syncing neural preferences...</span>
        </motion.div>
      </div>

      {/* Floating Particles Overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, -120],
              x: [0, (i % 2 === 0 ? 30 : -30)],
              opacity: [0, 0.4, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 3 + i, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "linear"
            }}
            style={{ 
              position: 'absolute',
              bottom: '20%',
              left: `${15 + i * 15}%`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: i % 2 === 0 ? accent : '#6366F1',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div style={{ 
        position: 'absolute', inset: 0, 
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, 
        backgroundSize: '40px 40px', pointerEvents: 'none' 
      }} />
    </div>
  );
};

export default Welcome;
