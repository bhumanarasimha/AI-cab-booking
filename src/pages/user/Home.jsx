import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Clock, MapPin, Star } from 'lucide-react';
import MapPlaceholder from '../../components/ui/MapPlaceholder';
import BottomNavigation from '../../components/layout/BottomNavigation';

const quickPlaces = ['🏠 Home', '💼 Work', '✈️ Airport', '☕ Café'];

const nearbyPlaces = [
  {
    name: 'Lalbagh Botanical Garden',
    category: 'Nature & Heritage',
    specialty: '240-acre garden with 18th-century glasshouse & rare flora',
    distance: '3.2 km',
    rating: 4.7,
    reviews: '12.4k',
    eta: '9 min',
    emoji: '🌿',
    accent: '#10B981',
    tag: 'Trending',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80',
  },
  {
    name: 'Cubbon Park',
    category: 'Landmark · Park',
    specialty: "Bangalore's green lung — 300 acres of heritage trees & sculptures",
    distance: '5.8 km',
    rating: 4.5,
    reviews: '9.1k',
    eta: '14 min',
    emoji: '🌳',
    accent: '#22C55E',
    tag: null,
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400&q=80',
  },
  {
    name: 'UB City Mall',
    category: 'Luxury Shopping',
    specialty: 'Premium brands, rooftop dining & Michelin-star restaurants',
    distance: '6.1 km',
    rating: 4.6,
    reviews: '18.2k',
    eta: '16 min',
    emoji: '🛍️',
    accent: '#F59E0B',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=400&q=80',
  },
  {
    name: 'ISKCON Temple',
    category: 'Spiritual · Temple',
    specialty: "One of India's largest ISKCON temples with stunning architecture",
    distance: '8.4 km',
    rating: 4.8,
    reviews: '21.7k',
    eta: '20 min',
    emoji: '🛕',
    accent: '#F97316',
    tag: null,
    image: 'https://images.unsplash.com/photo-1609942072359-e5c6f9aeaed3?w=400&q=80',
  },
  {
    name: 'Forum Mall',
    category: 'Shopping · Food',
    specialty: 'Multiplex, gaming zone & 200+ stores in Koramangala',
    distance: '9.2 km',
    rating: 4.3,
    reviews: '7.8k',
    eta: '22 min',
    emoji: '🏬',
    accent: '#8B5CF6',
    tag: null,
    image: 'https://images.unsplash.com/photo-1519566335946-e6f65f0f4fdf?w=400&q=80',
  },
  {
    name: 'Bangalore Palace',
    category: 'Royal Heritage',
    specialty: 'Tudor-style palace built in 1887 with royal artefacts & events',
    distance: '10.5 km',
    rating: 4.4,
    reviews: '15.3k',
    eta: '26 min',
    emoji: '🏰',
    accent: '#F59E0B',
    tag: 'Must Visit',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80',
  },
  {
    name: 'Commercial Street',
    category: 'Street Shopping',
    specialty: "Bangalore's oldest shopping hub — textiles, jewellery, street food",
    distance: '12.1 km',
    rating: 4.2,
    reviews: '6.5k',
    eta: '28 min',
    emoji: '🧵',
    accent: '#EC4899',
    tag: null,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=80',
  },
  {
    name: 'Wonderla Amusement Park',
    category: 'Entertainment',
    specialty: "South India's best theme park with 60+ rides & wave pool",
    distance: '18.7 km',
    rating: 4.6,
    reviews: '31.2k',
    eta: '42 min',
    emoji: '🎢',
    accent: '#00D8FF',
    tag: 'Weekend Fun',
    image: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=400&q=80',
  },
];

const StarRow = ({ rating, accent }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i <= full ? '#F59E0B' : (i === full+1 && half ? 'url(#half)' : 'rgba(255,255,255,0.1)')}
            stroke="none"
          />
        </svg>
      ))}
    </div>
  );
};

const PlaceCard = ({ place, navigate, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 * index, duration: 0.4 }}
    onClick={() => navigate('/user/ride-comparison')}
    style={{
      flexShrink: 0,
      width: '192px',
      background: 'rgba(12,18,30,0.95)',
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: '18px',
      overflow: 'hidden',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.25s',
      backdropFilter: 'blur(16px)',
    }}
    whileHover={{ y: -4, borderColor: `${place.accent}50` }}
  >
    {/* Photo with overlays */}
    <div style={{ position: 'relative', width: '100%', height: '108px', overflow: 'hidden' }}>
      <img
        src={place.image}
        alt={place.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.82) saturate(1.1)' }}
        onError={e => { e.target.style.display='none'; }}
      />
      {/* Dark gradient overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />

      {/* Distance badge — top right */}
      <div style={{ position:'absolute', top:'8px', right:'8px', background:'rgba(8,12,20,0.82)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'3px 7px', display:'flex', alignItems:'center', gap:'3px' }}>
        <MapPin size={9} color="#00D8FF" />
        <span style={{ fontSize:'0.67rem', fontWeight:700, color:'#F1F5F9' }}>{place.distance}</span>
      </div>

      {/* Tag — top left */}
      {place.tag && (
        <div style={{ position:'absolute', top:'8px', left:'8px', background:`${place.accent}CC`, borderRadius:'7px', padding:'3px 8px' }}>
          <span style={{ fontSize:'0.6rem', fontWeight:800, color:'#fff', letterSpacing:'0.06em', textTransform:'uppercase' }}>{place.tag}</span>
        </div>
      )}

      {/* Rating overlay on photo bottom */}
      <div style={{ position:'absolute', bottom:'8px', left:'10px', display:'flex', alignItems:'center', gap:'5px' }}>
        <div style={{ background:'rgba(8,12,20,0.78)', backdropFilter:'blur(8px)', borderRadius:'8px', padding:'3px 7px', display:'flex', alignItems:'center', gap:'4px', border:'1px solid rgba(255,255,255,0.1)' }}>
          <Star size={10} color="#F59E0B" fill="#F59E0B" />
          <span style={{ fontSize:'0.75rem', fontWeight:800, color:'#F1F5F9' }}>{place.rating}</span>
          <span style={{ fontSize:'0.65rem', color:'#9CA3AF' }}>({place.reviews})</span>
        </div>
      </div>
    </div>

    {/* Card Body */}
    <div style={{ padding:'12px' }}>
      {/* Emoji + Category row */}
      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'5px' }}>
        <span style={{ fontSize:'0.95rem' }}>{place.emoji}</span>
        <span style={{ fontSize:'0.68rem', fontWeight:700, color:place.accent, letterSpacing:'0.04em', textTransform:'uppercase' }}>{place.category}</span>
      </div>

      {/* Name */}
      <p style={{ fontSize:'0.88rem', fontWeight:800, color:'#F1F5F9', marginBottom:'4px', lineHeight:1.25 }}>
        {place.name}
      </p>

      {/* Star row */}
      <div style={{ marginBottom:'6px' }}>
        <StarRow rating={place.rating} accent={place.accent} />
      </div>

      {/* Specialty */}
      <p style={{ fontSize:'0.71rem', color:'#4B5563', lineHeight:1.5, marginBottom:'10px' }}>
        {place.specialty}
      </p>

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'0.7rem', color:'#6B7280', display:'flex', alignItems:'center', gap:'3px' }}>
          🕐 {place.eta}
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:'3px', background:`${place.accent}15`, border:`1px solid ${place.accent}30`, borderRadius:'8px', padding:'4px 9px', fontSize:'0.7rem', fontWeight:700, color:place.accent }}>
          Book <ChevronRight size={11} />
        </div>
      </div>
    </div>
  </motion.button>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <MapPlaceholder />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '48px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'all' }}>
          <p style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Good Morning</p>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.01em' }}>Alex Rider</h1>
        </div>
        <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15,22,35,0.8)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', pointerEvents: 'all' }}>
          <div style={{ position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '99px', border: '1.5px solid #080C14' }} />
          </div>
        </button>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom overlay content — scrollable */}
      <div style={{ position: 'relative', zIndex: 20, overflowY: 'auto', maxHeight: '72%', paddingBottom: '104px' }} className="no-scrollbar">

        {/* AI Recommendation Card */}
        <div style={{ padding: '0 16px', marginBottom: '12px' }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(135deg, rgba(0,216,255,0.08) 0%, rgba(99,102,241,0.12) 100%)',
              border: '1px solid rgba(0,216,255,0.2)', borderRadius: '20px', padding: '20px',
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,216,255,0.08)',
            }}
            onClick={() => navigate('/user/ride-comparison')}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: 'linear-gradient(135deg, rgba(0,216,255,0.06), transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative' }}>
              <div className="ai-chip px-2.5 py-1.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="#00D8FF"><circle cx="5" cy="5" r="3" /></svg>
                AI Recommendation
              </div>
              <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>
                Save 42%
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px', paddingBottom: '4px', gap: '2px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '99px', background: '#00D8FF', boxShadow: '0 0 8px #00D8FF' }} />
                <div style={{ width: '1px', flex: 1, background: 'linear-gradient(to bottom, #00D8FF60, #6366F160)', minHeight: '28px' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '99px', background: '#6366F1', boxShadow: '0 0 8px #6366F1' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pickup</p>
                  <p style={{ fontSize: '0.95rem', color: '#F1F5F9', fontWeight: 600, marginTop: '2px' }}>Tech Park, Sector 4</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Destination</p>
                  <p style={{ fontSize: '0.95rem', color: '#F1F5F9', fontWeight: 600, marginTop: '2px' }}>Downtown Metro Station</p>
                </div>
              </div>
              <button className="btn-primary" style={{ width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, alignSelf: 'flex-end', boxShadow: '0 4px 16px rgba(99,102,241,0.5)' }}>
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '0 16px', marginBottom: '10px' }}>
          <motion.button
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
            onClick={() => navigate('/user/ride-comparison')}
            style={{
              width: '100%', background: 'rgba(15,22,35,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
              backdropFilter: 'blur(16px)', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <Search size={18} color="#4B5563" />
            <span style={{ fontSize: '0.95rem', color: '#4B5563', flex: 1 }}>Where do you want to go?</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '4px 8px' }}>
              <Clock size={12} color="#6B7280" />
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Now</span>
            </div>
          </motion.button>
        </div>

        {/* Quick Places */}
        <div style={{ padding: '0 16px', marginBottom: '20px' }}>
          <motion.div
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}
            className="no-scrollbar"
          >
            {quickPlaces.map(p => (
              <button key={p} style={{
                background: 'rgba(15,22,35,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px',
                padding: '9px 14px', fontSize: '0.83rem', color: '#9CA3AF', whiteSpace: 'nowrap',
                backdropFilter: 'blur(12px)', cursor: 'pointer', flexShrink: 0, fontWeight: 500, transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,216,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                {p}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ─── Nearby Famous Places ─── */}
        <div>
          {/* Section Header */}
          <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                <MapPin size={14} color="#00D8FF" />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
                  Nearby Famous Places
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4B5563' }}>8 places within 20 km · Tap to book a ride</p>
            </div>
            <button style={{ fontSize: '0.75rem', color: '#6366F1', fontWeight: 600, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}>
              See all
            </button>
          </div>

          {/* Horizontal scroll cards */}
          <div
            style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '6px' }}
            className="no-scrollbar"
          >
            {nearbyPlaces.map((place, i) => (
              <PlaceCard key={place.name} place={place} navigate={navigate} index={i} />
            ))}
          </div>
        </div>

      </div>

      <BottomNavigation />
    </div>
  );
};

export default Home;
