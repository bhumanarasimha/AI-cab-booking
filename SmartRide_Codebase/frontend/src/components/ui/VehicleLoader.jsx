import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const vehicles = [
  { id: 'bike', emoji: '🏍️', name: 'Bike', color: 'var(--brand-cyan)' },
  { id: 'auto', emoji: '🛺', name: 'Auto', color: '#F59E0B' },
  { id: 'cab', emoji: '🚕', name: 'Cab', color: 'var(--brand-indigo)' },
];

const VehicleLoader = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % vehicles.length);
    }, 1200); // Slightly slower for better visibility
    return () => clearInterval(timer);
  }, []);

  const current = vehicles[idx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 20px', width: '100%' }}>
      <div style={{ position: 'relative', width: '280px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'rgba(15,22,35,0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
        
        {/* Sky / Ambient background */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${current.color}05 0%, transparent 100%)`, opacity: 0.5 }} />

        {/* Speed Lines (Flowing Left to Right because vehicle is moving Right to Left) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 300, opacity: [0, 0.4, 0] }}
              transition={{
                duration: 0.35,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "linear"
              }}
              style={{
                position: 'absolute',
                top: `${15 + i * 10}%`,
                width: '60px',
                height: '1px',
                background: `linear-gradient(to left, transparent, ${current.color}40, transparent)`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        {/* Vehicle Animation (Right to Left) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ x: 160, opacity: 0, scale: 0.9, scaleX: -1, rotate: 2 }}
            animate={{ 
              x: [ 160, 0, 0, -160 ], 
              opacity: [ 0, 1, 1, 0 ],
              scale: [ 0.9, 1.1, 1.1, 0.9 ],
              scaleX: -1, // Keep it flipped
              rotate: [ 2, 0, 0, -2 ]
            }}
            transition={{ 
              duration: 1.2,
              times: [ 0, 0.3, 0.7, 1 ],
              ease: "easeInOut"
            }}
            style={{ 
              fontSize: '4.2rem', 
              zIndex: 10, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: `drop-shadow(0 15px 25px ${current.color}40)` 
            }}
          >
            {current.emoji}
            
            {/* Subtle Engine Vibration */}
            <motion.div
              animate={{ y: [0, -1, 0] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              style={{ position: 'absolute', inset: 0 }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Professional Road Surface */}
        <div style={{ position: 'absolute', bottom: '25px', left: '20px', right: '20px', height: '40px', perspective: '100px' }}>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03) 50%, transparent)', 
            transform: 'rotateX(60deg)',
            borderBottom: '2px solid rgba(255,255,255,0.05)'
          }}>
            {/* Animated Road Lines (Moving Left to Right) */}
            <motion.div
              animate={{ x: [-60, 0] }}
              transition={{ repeat: Infinity, duration: 0.25, ease: "linear" }}
              style={{ display: 'flex', gap: '30px', padding: '15px 0' }}
            >
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{ width: '25px', height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Ambient Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`p-${i}`}
            animate={{ 
              x: [-50, 300], 
              y: [20, 30, 20],
              opacity: [0, 0.3, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.4,
              ease: "linear" 
            }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: current.color,
              filter: 'blur(2px)',
              zIndex: 5
            }}
          />
        ))}
      </div>
      
      {/* Loading Status */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <motion.p 
          key={current.name}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' }}
        >
          AI-Powered {current.name} Search
        </motion.p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1, 
                delay: i * 0.2 
              }}
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: current.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleLoader;
