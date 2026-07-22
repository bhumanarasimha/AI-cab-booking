import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Sparkles, Navigation, ShieldCheck, Zap, Clock, Loader2, Train, Bike, Car } from 'lucide-react';
import RouteMap from '../../components/ui/RouteMap';
import VehicleLoader from '../../components/ui/VehicleLoader';
import { useAuth } from '../../lib/AuthContext';
import { createRideRequest } from '../../lib/firestore';
import AIChatBot from '../../components/ui/AIChatBot';

const CATEGORIES = [
  { id: 'bike', label: 'Bike', emoji: '🏍️' },
  { id: 'auto', label: 'Auto', emoji: '🛺' },
  { id: 'cab4', label: 'Cab (4-Seater)', emoji: '🚗' },
  { id: 'cab7', label: 'SUV (7-Seater)', emoji: '🚐' },
  { id: 'transit', label: 'Transit', emoji: '🚇' },
];

const RideComparison = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, currentLocation } = useAuth();

  const [activeCategory, setActiveCategory] = useState('cab4');
  const [selectedOptionId, setSelectedOptionId] = useState('smartride_cab');
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const destination = location.state?.dropoff || 'Downtown Metro Station';

  const categoryOptions = useMemo(() => {
    switch (activeCategory) {
      case 'bike':
        return [
          { id: 'smartride_bike', name: 'SmartRide Bike', price: 55, time: '10 min', tag: 'Cheapest', tagColor: '#10B981', url: null, isSmart: true },
          { id: 'rapido_bike', name: 'Rapido Bike', price: 60, time: '12 min', tag: 'Popular', tagColor: '#F59E0B', url: 'https://rapido.bike/', isSmart: false },
          { id: 'uber_moto', name: 'Uber Moto', price: 75, time: '14 min', tag: null, url: 'https://m.uber.com/', isSmart: false },
          { id: 'ola_bike', name: 'Ola Bike', price: 80, time: '15 min', tag: null, url: 'https://book.olacabs.com/', isSmart: false },
        ];
      case 'auto':
        return [
          { id: 'smartride_auto', name: 'SmartRide Auto', price: 98, time: '8 min', tag: 'Cheapest', tagColor: '#10B981', url: null, isSmart: true },
          { id: 'rapido_auto', name: 'Rapido Auto', price: 110, time: '10 min', tag: 'Popular', tagColor: '#F59E0B', url: 'https://rapido.bike/', isSmart: false },
          { id: 'uber_auto', name: 'Uber Auto', price: 125, time: '12 min', tag: null, url: 'https://m.uber.com/', isSmart: false },
          { id: 'ola_auto', name: 'Ola Auto', price: 130, time: '14 min', tag: null, url: 'https://book.olacabs.com/', isSmart: false },
        ];
      case 'cab4':
        return [
          { id: 'smartride_cab', name: 'SmartRide AI (Cab+Metro)', price: 210, time: '22 min', tag: 'AI Pick', tagColor: '#00D8FF', desc: 'Multi-modal fare saver', url: null, isSmart: true },
          { id: 'rapido_cab', name: 'Rapido Cab', price: 220, time: '25 min', tag: null, url: 'https://rapido.bike/', isSmart: false },
          { id: 'uber_go', name: 'Uber Go', price: 265, time: '26 min', tag: null, url: 'https://m.uber.com/', isSmart: false },
          { id: 'ola_mini', name: 'Ola Mini', price: 280, time: '28 min', tag: null, url: 'https://book.olacabs.com/', isSmart: false },
          { id: 'premium_ev', name: 'Premium EV', price: 340, time: '25 min', tag: 'Eco Pick', tagColor: '#10B981', desc: 'Zero Emission Comfort', url: null, isSmart: true },
        ];
      case 'cab7':
        return [
          { id: 'smartride_xl', name: 'SmartRide XL', price: 380, time: '24 min', tag: 'Cheapest SUV', tagColor: '#10B981', desc: '7 Seats AC', url: null, isSmart: true },
          { id: 'uber_xl', name: 'Uber XL', price: 450, time: '28 min', tag: null, url: 'https://m.uber.com/', isSmart: false },
          { id: 'ola_prime_suv', name: 'Ola Prime SUV', price: 480, time: '30 min', tag: null, url: 'https://book.olacabs.com/', isSmart: false },
        ];
      case 'transit':
        return [
          { id: 'public_transit', name: 'Public Transit (Metro + Bus)', price: 35, time: '32 min', tag: 'Lowest Cost', tagColor: '#10B981', desc: 'Bus · Metro · Suburban Train', url: null, isSmart: true },
        ];
      default:
        return [];
    }
  }, [activeCategory]);

  // Select first option when changing category if current selection is not in new category
  useEffect(() => {
    if (categoryOptions.length > 0) {
      const match = categoryOptions.find(o => o.id === selectedOptionId);
      if (!match) {
        setSelectedOptionId(categoryOptions[0].id);
      }
    }
  }, [activeCategory, categoryOptions, selectedOptionId]);

  const selectedOption = useMemo(() => {
    return categoryOptions.find(o => o.id === selectedOptionId) || categoryOptions[0];
  }, [categoryOptions, selectedOptionId]);

  const getAiInsight = () => {
    switch (activeCategory) {
      case 'bike':
        return <>SmartRide Bike is <strong>₹5 cheaper</strong> than Rapido & <strong>₹20 cheaper</strong> than Uber Moto!</>;
      case 'auto':
        return <>SmartRide Auto saves you <strong>₹12 vs Rapido</strong> and <strong>₹27 vs Uber Auto</strong> with direct pickup.</>;
      case 'cab4':
        return <>SmartRide AI saves you <strong>₹55 vs Uber Go</strong> by combining a short walk with a direct pickup.</>;
      case 'cab7':
        return <>SmartRide XL saves you <strong>₹70 vs Uber XL</strong> for 7-seater group travel.</>;
      case 'transit':
        return <>Public Transit saves <strong>₹175 vs Cabs</strong> and has zero traffic delay.</>;
      default:
        return null;
    }
  };

  const handleBooking = async () => {
    if (!selectedOption) return;
    if (selectedOption.isSmart) {
      try {
        setIsBooking(true);
        const rideId = await createRideRequest(user?.uid || 'demo-user-123', {
          rideType: selectedOption.name,
          price: selectedOption.price,
          pickup: currentLocation?.address || "Current Location",
          dropoff: destination,
          eta: selectedOption.time
        });
        navigate('/user/activity', { state: { rideId, confirmed: true } });
      } catch {
        setIsBooking(false);
      }
    } else if (selectedOption.url) {
      window.open(selectedOption.url, '_blank');
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

      {/* Map Section */}
      <div style={{ height: '38%', position: 'relative', overflow: 'hidden' }}>
        <RouteMap origin={currentLocation?.coords} destination={destination} travelMode={activeCategory === 'transit' ? 'TRANSIT' : 'DRIVING'} />
        <div style={{ position: 'absolute', top: '56px', left: '20px', zIndex: 50 }}>
          <button onClick={() => navigate(-1)} className="btn-icon" style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--bg-surface)', backdropFilter: 'blur(20px)' }}>
            <ArrowLeft size={20} color="var(--text-main)" />
          </button>
        </div>

        {/* Floating Destination Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ position: 'absolute', bottom: '28px', left: '20px', right: '20px', zIndex: 50 }}
        >
          <div style={{ 
            background: 'var(--bg-surface)', 
            backdropFilter: 'blur(24px)', 
            border: '1px solid var(--border-ui)', 
            borderRadius: '20px', 
            padding: '14px 18px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px', 
            boxShadow: '0 12px 48px rgba(0,0,0,0.2)' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #00D8FF', background: 'var(--bg-base)' }} />
              <div style={{ width: '1px', height: '18px', background: 'linear-gradient(180deg, #00D8FF, #6366F1)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 10px #6366F1' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Current Route</p>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{destination}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Sheet UI */}
      <div style={{ 
        flex: 1, 
        background: 'var(--bg-surface)', 
        backdropFilter: 'blur(30px) saturate(180%)',
        borderTopLeftRadius: '32px', 
        borderTopRightRadius: '32px', 
        marginTop: '-20px', 
        zIndex: 100, 
        display: 'flex', 
        flexDirection: 'column', 
        border: '1px solid var(--border-ui)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.2)'
      }}>
        {/* Pull Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '99px', background: 'var(--border-ui)' }} />
        </div>

        {/* Tab Selector (Ride / Parcel) */}
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '4px', gap: '4px' }}>
             <button style={{ flex: 1, height: '40px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', background: 'var(--brand-indigo)', color: 'white', border: 'none', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
               🚗 Ride
             </button>
             <button onClick={() => navigate('/user/parcel')} style={{ flex: 1, height: '40px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', background: 'transparent', color: '#6B7280', border: 'none' }}>
               📦 Parcel
             </button>
          </div>
        </div>

        {/* Contextual Header */}
        <div style={{ padding: '0 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Choose Ride
          </h2>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatOpen(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              background: 'rgba(0, 216, 255, 0.1)', 
              border: '1px solid rgba(0, 216, 255, 0.25)', 
              borderRadius: '12px', padding: '6px 12px', 
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, color: '#00D8FF' 
            }}
          >
            <Sparkles size={14} /> Chubby AI
          </motion.button>
        </div>

        {/* Vehicle Category Pills Bar */}
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '14px',
                    border: isActive ? '1px solid #00D8FF' : '1px solid var(--border-ui)',
                    background: isActive ? 'rgba(0, 216, 255, 0.12)' : 'var(--bg-card)',
                    color: isActive ? '#00D8FF' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 0 14px rgba(0, 216, 255, 0.2)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Options List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }} className="no-scrollbar">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <VehicleLoader />
              </motion.div>
            ) : (
              <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categoryOptions.map(opt => {
                  const isActive = selectedOptionId === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ 
                        width: '100%', textAlign: 'left', cursor: 'pointer', 
                        background: isActive ? 'rgba(0, 216, 255, 0.08)' : 'var(--bg-card)', 
                        border: `1px solid ${isActive ? (opt.tagColor || '#00D8FF') : 'var(--border-ui)'}`, 
                        borderRadius: '20px', padding: '16px 18px', position: 'relative', overflow: 'hidden',
                        transition: 'all 0.25s',
                        boxShadow: isActive ? '0 4px 18px rgba(0, 216, 255, 0.12)' : 'none'
                      }}
                    >
                      {isActive && (
                        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top right, ${opt.tagColor || '#00D8FF'}15, transparent 70%)` }} />
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                          width: '46px', height: '46px', borderRadius: '14px', 
                          background: isActive ? (opt.tagColor || '#00D8FF') : 'var(--bg-elevated)', 
                          border: '1px solid var(--border-ui)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {activeCategory === 'bike' ? (
                            <Bike size={20} color={isActive ? '#05070A' : 'var(--brand-cyan)'} />
                          ) : activeCategory === 'transit' ? (
                            <Train size={20} color={isActive ? '#05070A' : '#10B981'} />
                          ) : (
                            <Car size={20} color={isActive ? '#05070A' : 'var(--brand-cyan)'} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt.name}</span>
                            {opt.tag && (
                              <span style={{ fontSize: '0.6rem', fontWeight: 900, color: opt.tagColor || '#00D8FF', background: `${opt.tagColor || '#00D8FF'}15`, border: `1px solid ${opt.tagColor || '#00D8FF'}30`, borderRadius: '6px', padding: '2px 6px', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>
                                {opt.tag}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            {opt.desc || `${opt.time} · ${opt.isSmart ? 'Instant SmartRide dispatch' : 'Competitor app rate'}`}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '1.2rem', fontWeight: 900, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>₹{opt.price}</p>
                          <p style={{ fontSize: '0.72rem', color: isActive ? (opt.tagColor || '#00D8FF') : 'var(--text-muted)', fontWeight: 700 }}>{opt.time}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Ask Chubby AI Insights Banner */}
                <motion.div 
                  onClick={() => setChatOpen(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(0,216,255,0.08) 100%)',
                    border: '1px solid rgba(0,216,255,0.2)', borderRadius: '20px', padding: '16px 18px', cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ padding: '6px', background: 'rgba(0,216,255,0.15)', borderRadius: '10px' }}>
                      <Sparkles size={16} color="#00D8FF" />
                    </div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--text-main)' }}>Chubby AI Analysis</h4>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {getAiInsight()}
                    <span style={{ color: '#00D8FF', fontWeight: 700, marginLeft: '6px' }}>Ask Chubby →</span>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div style={{ padding: '16px 20px 28px', borderTop: '1px solid var(--border-ui)' }}>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            disabled={isBooking || isLoading || !selectedOption}
            onClick={handleBooking}
            className="btn-primary" 
            style={{ 
              width: '100%', height: '54px', fontSize: '1.05rem', fontWeight: 900, 
              borderRadius: '18px', gap: '10px', 
              opacity: (isBooking || isLoading || !selectedOption) ? 0.7 : 1 
            }}
          >
            {(isBooking || isLoading) ? (
              <Loader2 className="animate-spin" size={20} />
            ) : selectedOption?.isSmart ? (
              <>Book {selectedOption.name} · ₹{selectedOption.price} <ChevronRight size={20} /></>
            ) : (
              <>Open {selectedOption?.name} · ₹{selectedOption?.price} <Navigation size={18} /></>
            )}
          </motion.button>
        </div>
      </div>

      <AIChatBot 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        pickup={currentLocation?.address || 'Current Location'} 
        dropoff={destination} 
        competitors={categoryOptions}
        selectedRide={selectedOption}
        onSelectTransitMode={(mode = 'transit') => {
          setActiveCategory(mode);
          setChatOpen(false);
        }}
      />
    </div>
  );
};

export default RideComparison;
