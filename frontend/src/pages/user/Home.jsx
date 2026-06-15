
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Clock, MapPin, Star, Users, Navigation, ShieldCheck } from 'lucide-react';
import InteractiveMap from '../../components/ui/InteractiveMap';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { useAuth } from '../../lib/AuthContext';
import { useGPSLocation } from '../../hooks/useLocation';
import { matches } from './commute/matches';

const quickPlaces = ['🏠 Home', '💼 Work', '✈️ Airport', '☕ Cafe'];

const nearbyPlaces = [
  {
    name: 'Marina Beach',
    category: 'Beach · Landmark',
    specialty: "World's second longest urban beach, perfect for a breezy evening walk",
    distance: '2.5 km',
    rating: 4.6,
    reviews: '45.2k',
    eta: '8 min',
    emoji: '🏖️',
    accent: '#00D8FF',
    tag: 'Must Visit',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  },
  {
    name: 'Kapaleeshwarar Temple',
    category: 'Heritage · Spiritual',
    specialty: 'Iconic 7th-century Dravidian architecture with a stunning Gopuram',
    distance: '4.8 km',
    rating: 4.8,
    reviews: '12.4k',
    eta: '12 min',
    emoji: '🛕',
    accent: '#F59E0B',
    tag: 'Cultural',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80',
  },
  {
    name: 'Phoenix Marketcity',
    category: 'Shopping · Dining',
    specialty: 'Chennai\'s premier luxury mall with international brands & IMAX',
    distance: '8.2 km',
    rating: 4.5,
    reviews: '28.1k',
    eta: '18 min',
    emoji: '🛍️',
    accent: 'var(--brand-indigo)',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=400&q=80',
  },
  {
    name: 'Guindy National Park',
    category: 'Nature · Wildlife',
    specialty: 'One of the few national parks situated inside a city limits',
    distance: '6.4 km',
    rating: 4.3,
    reviews: '8.7k',
    eta: '15 min',
    emoji: '🦌',
    accent: '#10B981',
    tag: null,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80',
  },
  {
    name: 'Anna Centenary Library',
    category: 'Education · Modern',
    specialty: 'One of the largest libraries in Asia with futuristic architecture',
    distance: '5.1 km',
    rating: 4.7,
    reviews: '15.2k',
    eta: '11 min',
    emoji: '📚',
    accent: 'var(--brand-violet)',
    tag: 'Quiet Zone',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
  },
];

const StarRow = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i <= full ? '#F59E0B' : (i === full+1 && half ? 'url(#half)' : 'var(--border-ui)')}
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
    onClick={() => navigate('/user/ride-comparison', { state: { dropoff: place.name } })}
    style={{
      flexShrink: 0,
      width: '192px',
      background: 'var(--bg-card)',
      border: `1px solid var(--border-ui)`,
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
      {/* Bottom gradient overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, var(--bg-card) 100%)' }} />

      {/* Distance badge — top right */}
      <div style={{ position:'absolute', top:'8px', right:'8px', background:'var(--bg-surface)', backdropFilter:'blur(8px)', border:'1px solid var(--border-ui)', borderRadius:'8px', padding:'3px 7px', display:'flex', alignItems:'center', gap:'3px' }}>
        <MapPin size={9} color="var(--brand-cyan)" />
        <span style={{ fontSize:'0.67rem', fontWeight:700, color:'var(--text-main)' }}>{place.distance}</span>
      </div>

      {/* Tag — top left */}
      {place.tag && (
        <div style={{ position:'absolute', top:'8px', left:'8px', background:`${place.accent}CC`, borderRadius:'7px', padding:'3px 8px' }}>
          <span style={{ fontSize:'0.6rem', fontWeight:800, color:'#fff', letterSpacing:'0.06em', textTransform:'uppercase' }}>{place.tag}</span>
        </div>
      )}

      {/* Rating overlay on photo bottom */}
      <div style={{ position:'absolute', bottom:'8px', left:'10px', display:'flex', alignItems:'center', gap:'5px' }}>
        <div style={{ background:'var(--bg-surface)', backdropFilter:'blur(8px)', borderRadius:'8px', padding:'3px 7px', display:'flex', alignItems:'center', gap:'4px', border:'1px solid var(--border-ui)' }}>
          <Star size={10} color="#F59E0B" fill="#F59E0B" />
          <span style={{ fontSize:'0.75rem', fontWeight:800, color:'var(--text-main)' }}>{place.rating}</span>
          <span style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>({place.reviews})</span>
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
      <p style={{ fontSize:'0.88rem', fontWeight:800, color:'var(--text-main)', marginBottom:'4px', lineHeight:1.25 }}>
        {place.name}
      </p>

      {/* Star row */}
      <div style={{ marginBottom:'6px' }}>
        <StarRow rating={place.rating} accent={place.accent} />
      </div>

      {/* Specialty */}
      <p style={{ fontSize:'0.71rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'10px' }}>
        {place.specialty}
      </p>

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'3px' }}>
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
  const { user } = useAuth();
  const location = useGPSLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentCity = matches.find(m => location.address?.toLowerCase().includes(m.city.toLowerCase()))?.city || 'Chennai';
  const commuteMatch = matches.find(m => m.city.toLowerCase() === currentCity.toLowerCase());

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <InteractiveMap 
          center={location.coords} 
          userLocation={location.coords}
        />
      </div>

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '48px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'all' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{getGreeting()}</p>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{user?.name || user?.displayName || 'Rider'}</h1>
        </div>
        
        {/* Location Badge */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            pointerEvents: 'all',
            background: 'var(--bg-surface)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-ui)',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '180px',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/user/map-picker')}
        >
          <div 
            style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              background: location.loading ? 'rgba(var(--brand-cyan-rgb), 0.1)' : 'rgba(var(--brand-cyan-rgb), 0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              location.refresh();
            }}
          >
            <MapPin size={14} color="var(--brand-cyan)" className={location.loading ? 'animate-pulse' : ''} />
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Current Area</p>
            <p style={{ 
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', 
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              opacity: location.loading ? 0.5 : 1
            }}>
              {location.address}
            </p>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </motion.div>
      </div>

      {/* Floating Recenter Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'absolute',
          top: '220px',
          right: '20px',
          zIndex: 15,
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-ui)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer'
        }}
        onClick={() => location.refresh()}
      >
        <Navigation size={18} color="var(--brand-cyan)" className={location.loading ? 'animate-spin' : ''} />
      </motion.button>

      {/* Spacer to push sheet below header */}
      <div style={{ height: '160px', flexShrink: 0 }} />

      {/* Bottom Sheet Container */}
      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: 450 }}
        dragElastic={0.05}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
        initial={{ y: 0 }}
        style={{ 
          position: 'relative', 
          zIndex: 20, 
          background: 'var(--bg-surface)', 
          borderTopLeftRadius: '32px', 
          borderTopRightRadius: '32px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 160px)',
          touchAction: 'none'
        }}
      >
        {/* Drag Handle & Area */}
        <div style={{ width: '100%', height: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', cursor: 'grab', position: 'relative' }}>
          <div style={{ width: '40px', height: '5px', background: 'var(--border-ui)', borderRadius: '3px', opacity: 0.6 }} />
        </div>

        {/* Scrollable content area */}
        <div style={{ overflowY: 'auto', paddingBottom: '120px', width: '100%' }} className="no-scrollbar">
          
          {/* Smart Commute Entry Point */}
          <div style={{ padding: '16px 16px 0' }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(commuteMatch ? '/user/commute/results' : '/user/commute')}
              style={{
                background: 'linear-gradient(135deg, rgba(var(--brand-indigo-rgb), 0.15), rgba(var(--brand-cyan-rgb), 0.1))',
                borderRadius: '24px',
                padding: '20px',
                border: '1px solid rgba(var(--brand-indigo-rgb), 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--brand-indigo)', filter: 'blur(40px)', opacity: 0.2 }} />
              <div style={{ width: '48px', height: '48px', background: 'var(--bg-surface)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-ui)', position: 'relative' }}>
                {commuteMatch ? (
                  <img src={commuteMatch.image} style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                ) : (
                  <Users size={22} color="var(--brand-cyan)" />
                )}
                {commuteMatch && (
                   <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'var(--brand-cyan)', borderRadius: '50%', padding: '2px', border: '1.5px solid var(--bg-surface)' }}>
                    <ShieldCheck size={8} color="white" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px' }}>
                  {commuteMatch ? `Ride with ${commuteMatch.name.split(' ')[0]}` : 'Smart Commute'}
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {commuteMatch ? `Headed to ${commuteMatch.company}` : 'Share rides with verified office colleagues'}
                </p>
              </div>
              <div style={{ background: 'var(--brand-indigo)', borderRadius: '10px', padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, color: 'white' }}>
                {commuteMatch ? 'Match Now' : 'Join'}
              </div>
            </motion.div>
          </div>

          {/* AI Recommendation Card */}
          <div style={{ padding: '16px', marginBottom: '16px' }}>
            <motion.div
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
              className="glass-panel"
              style={{
                borderRadius: '24px', padding: '24px',
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(var(--brand-cyan-rgb), 0.08), rgba(var(--brand-indigo-rgb), 0.05))',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
              onClick={() => navigate('/user/ride-comparison')}
              whileHover={{ scale: 1.01 }}
            >
              <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: 'linear-gradient(135deg, rgba(var(--brand-cyan-rgb), 0.05), transparent 80%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative' }}>
                <div className="chip-premium px-3 py-1.5 rounded-full flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="var(--brand-cyan)"><circle cx="5" cy="5" r="3" /></svg>
                  Ask Chubby
                </div>
                <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>
                  Save 42%
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px', paddingBottom: '4px', gap: '2px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '99px', background: 'var(--brand-cyan)', boxShadow: '0 0 8px var(--brand-cyan)' }} />
                  <div style={{ width: '1px', flex: 1, background: 'linear-gradient(to bottom, var(--brand-cyan)60, var(--brand-indigo)60)', minHeight: '28px' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '99px', background: 'var(--brand-indigo)', boxShadow: '0 0 8px var(--brand-indigo)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div 
                    style={{ marginBottom: '12px', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/user/map-picker');
                    }}
                  >
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pickup</p>
                    <p style={{ 
                      fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      opacity: location.loading ? 0.6 : 1
                    }}>
                      {location.address}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Destination</p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                      {currentCity.toLowerCase() === 'bangalore' ? 'Google BLR HQ' : 
                       currentCity.toLowerCase() === 'chennai' ? 'Marina Beach Office Hub' : 
                       'Central Business District'}
                    </p>
                  </div>
                </div>
                <button className="btn-primary" style={{ width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, alignSelf: 'flex-end', boxShadow: '0 4px 16px rgba(var(--brand-indigo-rgb), 0.5)' }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div style={{ padding: '0 16px', marginBottom: '10px' }}>
            <motion.button
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
              onClick={() => navigate('/user/search')}
              style={{
                width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-ui)', borderRadius: '16px',
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                backdropFilter: 'blur(16px)', cursor: 'pointer', textAlign: 'left',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Search size={18} color="var(--text-muted)" />
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', flex: 1 }}>Where do you want to go?</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(var(--brand-indigo-rgb), 0.05)', border: '1px solid var(--border-ui)', borderRadius: '8px', padding: '4px 8px' }}>
                <Clock size={12} color="var(--text-muted)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Now</span>
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
                <button 
                  key={p} 
                  onClick={() => navigate('/user/ride-comparison', { state: { dropoff: p.split(' ')[1] || p } })}
                  style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border-ui)', borderRadius: '12px',
                    padding: '9px 14px', fontSize: '0.83rem', color: 'var(--text-muted)', whiteSpace: 'nowrap',
                    backdropFilter: 'blur(12px)', cursor: 'pointer', flexShrink: 0, fontWeight: 500, transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(var(--brand-cyan-rgb), 0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-ui)'}
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
                  <MapPin size={14} color="var(--brand-cyan)" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                    Nearby Famous Places
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>8 places within 20 km · Tap to book a ride</p>
              </div>
              <button onClick={() => navigate('/user/famous-places')} style={{ fontSize: '0.75rem', color: 'var(--brand-indigo)', fontWeight: 600, background: 'rgba(var(--brand-indigo-rgb), 0.08)', border: '1px solid rgba(var(--brand-indigo-rgb), 0.2)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}>
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
      </motion.div>
      <BottomNavigation />
    </div>
  );
};

export default Home;
