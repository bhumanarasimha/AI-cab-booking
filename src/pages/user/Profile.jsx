import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import BottomNavigation from '../../components/layout/BottomNavigation';

const menuSections = [
  {
    title: 'Rides & Wallet',
    items: [
      { icon: '🚗', label: 'My Rides', sub: '42 total trips', path: '/user/rides' },
      { icon: '💳', label: 'Wallet & Payments', sub: '₹450 balance', path: '/user/rides' },
      { icon: '📍', label: 'Saved Places', sub: '3 places saved', path: '/user/rides' },
    ]
  },
  {
    title: 'AI & Personalization',
    items: [
      { icon: '🧠', label: 'AI Preferences', sub: 'Customize recommendations', path: '/user/ai-insights' },
      { icon: '🎨', label: 'Theme & App Mood', sub: 'Dark AI · Energetic', path: '/user/theme' },
    ]
  },
  {
    title: 'Safety',
    items: [
      { icon: '🛡️', label: 'Safety & Privacy', sub: 'Biometric on · Location shared', path: '/user/safety' },
      { icon: '🆘', label: 'Emergency Contacts', sub: '2 contacts added', path: '/user/emergency', accent: '#EF4444' },
    ]
  },
  {
    title: 'Social',
    items: [
      { icon: '🎁', label: 'Invite a Friend', sub: 'Earn ₹150 per referral', path: '/user/invite', accent: '#A855F7' },
      { icon: '⭐', label: 'Ratings & Reviews', sub: '4.92 average' },
    ]
  },
  {
    title: 'Support',
    items: [
      { icon: '🛟', label: 'Help Center', sub: 'FAQs & Support' },
      { icon: '⚙️', label: 'App Settings', sub: 'Notifications, Language' },
    ]
  },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100%', background: 'var(--bg-base)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="no-scrollbar">
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.09) 0%, transparent 100%)', padding: '52px 20px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '22px', background: 'linear-gradient(135deg, #6366F1, #00D8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'white', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>A</div>
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '18px', height: '18px', background: '#10B981', borderRadius: '6px', border: '2px solid var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.01em' }}>Alex Rider</h1>
            <p style={{ fontSize: '0.83rem', color: '#4B5563', marginTop: '2px' }}>alex@smartride.ai</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '99px', background: '#00D8FF' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00D8FF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Verified Rider</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {[['42', 'Total Rides'], ['4.92', 'Rating'], ['₹1,240', 'Saved']].map(([v, l]) => (
            <div key={l} className="card" style={{ flex: 1, padding: '12px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F1F5F9' }}>{v}</p>
              <p style={{ fontSize: '0.7rem', color: '#4B5563', marginTop: '2px' }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Menu Sections */}
      <div style={{ padding: '8px 16px 100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {menuSections.map((section, si) => (
          <section key={section.title}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#374151', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '4px' }}>{section.title}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {section.items.map((item, ii) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * (si * 3 + ii) }}
                  onClick={() => item.path && navigate(item.path)}
                  className="card"
                  style={{ width: '100%', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: '13px', cursor: 'pointer', textAlign: 'left' }}
                  whileHover={{ x: 2 }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: item.accent ? `${item.accent}12` : 'rgba(255,255,255,0.04)', border: `1px solid ${item.accent ? item.accent + '25' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: item.accent || '#F1F5F9' }}>{item.label}</p>
                    {item.sub && <p style={{ fontSize: '0.73rem', color: '#4B5563', marginTop: '1px' }}>{item.sub}</p>}
                  </div>
                  <ChevronRight size={15} color="#2D3748" />
                </motion.button>
              ))}
            </div>
          </section>
        ))}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={() => navigate('/splash')}
          style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '14px', color: '#EF4444', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Sign Out
        </motion.button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
