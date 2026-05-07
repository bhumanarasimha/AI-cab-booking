import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

const themes = [
  { id: 'dark-ai',     name: 'Dark AI',       desc: 'Deep space futuristic',   preview: ['#080C14', '#00D8FF', '#6366F1'] },
  { id: 'midnight',    name: 'Midnight',       desc: 'Pure black minimal',      preview: ['#000000', '#FFFFFF', '#6B7280'] },
  { id: 'aurora',      name: 'Aurora',         desc: 'Teal & violet northern',  preview: ['#0D1B2A', '#00FFC8', '#A855F7'] },
  { id: 'ocean',       name: 'Ocean Depth',    desc: 'Deep blue calm',          preview: ['#0A1929', '#38BDF8', '#0EA5E9'] },
  { id: 'sunset',      name: 'Sunset Drive',   desc: 'Warm amber & rose',       preview: ['#1A0A0A', '#F97316', '#EC4899'] },
];

const moods = [
  { id: 'calm',       emoji: '🌙', label: 'Calm',       desc: 'Reduced animations, softer tones' },
  { id: 'energetic',  emoji: '⚡', label: 'Energetic',  desc: 'Vibrant, fast transitions' },
  { id: 'focus',      emoji: '🎯', label: 'Focus',      desc: 'Minimal, distraction-free' },
  { id: 'explorer',   emoji: '🚀', label: 'Explorer',   desc: 'All features visible' },
];

const ThemeSettings = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('dark-ai');
  const [selectedMood, setSelectedMood] = useState('energetic');
  const [textSize, setTextSize] = useState(2);

  return (
    <div style={{ height: '100%', background: 'var(--bg-base)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="no-scrollbar">
      {/* Header */}
      <div style={{ padding: '52px 20px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate(-1)} className="btn-icon" style={{ width: '38px', height: '38px' }}>
          <ArrowLeft size={18} color="#9CA3AF" />
        </button>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F1F5F9' }}>Theme & Mood</h1>
          <p style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '2px' }}>Personalize your app experience</p>
        </div>
      </div>

      <div style={{ padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Color Theme */}
        <section>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Color Theme</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {themes.map((t, i) => (
              <motion.button key={t.id} onClick={() => setSelectedTheme(t.id)}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                className="card"
                style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', border: selectedTheme === t.id ? '1px solid rgba(99,102,241,0.4)' : undefined, background: selectedTheme === t.id ? 'rgba(99,102,241,0.05)' : undefined }}
              >
                {/* Color preview */}
                <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', width: '48px', height: '32px', flexShrink: 0 }}>
                  {t.preview.map(c => <div key={c} style={{ flex: 1, background: c }} />)}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F1F5F9' }}>{t.name}</p>
                  <p style={{ fontSize: '0.74rem', color: '#4B5563', marginTop: '1px' }}>{t.desc}</p>
                </div>
                {selectedTheme === t.id && (
                  <div style={{ width: '22px', height: '22px', borderRadius: '99px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} color="white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* App Mood */}
        <section>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>App Mood</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {moods.map((m) => (
              <button key={m.id} onClick={() => setSelectedMood(m.id)}
                className="card"
                style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', border: selectedMood === m.id ? '1px solid rgba(0,216,255,0.35)' : undefined, background: selectedMood === m.id ? 'rgba(0,216,255,0.05)' : undefined, position: 'relative' }}
              >
                {selectedMood === m.id && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', borderRadius: '99px', background: '#00D8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={11} color="#080C14" />
                  </div>
                )}
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{m.emoji}</div>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '3px' }}>{m.label}</p>
                <p style={{ fontSize: '0.72rem', color: '#4B5563' }}>{m.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Text Size */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Text Size</p>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366F1' }}>{['S','M','L','XL'][textSize - 1]}</span>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <input type="range" min={1} max={4} value={textSize} onChange={e => setTextSize(+e.target.value)} style={{ width: '100%', accentColor: '#6366F1' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {['S','M','L','XL'].map(s => <span key={s} style={{ fontSize: '0.72rem', color: '#4B5563' }}>{s}</span>)}
            </div>
          </div>
        </section>

        {/* Apply */}
        <button className="btn-primary" style={{ width: '100%', height: '52px', gap: '8px', fontSize: '0.95rem' }}>
          Apply Theme
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
