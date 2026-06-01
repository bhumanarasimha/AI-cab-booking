import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Sparkles, Navigation, ShieldCheck, Zap, Clock, Loader2, Train } from 'lucide-react';
import RouteMap from '../../components/ui/RouteMap';
import VehicleLoader from '../../components/ui/VehicleLoader';
import { useAuth } from '../../lib/AuthContext';
import { createRideRequest } from '../../lib/firestore';
import AIChatBot from '../../components/ui/AIChatBot';

/* ── RIDE OPTIONS ── */
const rides = [
  {
    id: 'smart', name: 'SmartRide AI', tag: 'AI Pick', tagColor: '#00D8FF',
    desc: 'Cab + Metro · Multi-modal', price: '₹210', time: '22 min',
    saving: 'Save 42%', savingColor: '#10B981',
    border: 'rgba(0, 216, 255, 0.4)', bg: 'rgba(0, 216, 255, 0.05)',
    icon: <Zap size={22} color="#00D8FF" />,
  },
  {
    id: 'ev', name: 'Premium EV', tag: 'Eco', tagColor: '#10B981',
    desc: 'Zero emission · High comfort', price: '₹340', time: '25 min',
    border: 'rgba(16, 185, 129, 0.2)', bg: 'rgba(16, 185, 129, 0.03)',
    icon: <ShieldCheck size={22} color="#10B981" />,
  },
  {
    id: 'transit', name: 'Public Transit', tag: 'Eco Pick', tagColor: '#10B981',
    desc: 'Bus · Metro · Local Train', price: '₹35', time: '32 min',
    border: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.05)',
    icon: <Train size={22} color="#10B981" />,
  },
];

const RideComparison = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, currentLocation } = useAuth();
  const [selRide, setSelRide] = useState('smart');
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [viewState, setViewState] = useState('select'); // 'select' | 'compare'
  const [selectedComp, setSelectedComp] = useState('smartride');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const destination = location.state?.dropoff || 'Downtown Metro Station';

  const competitorApps = [
    { id: 'smartride', name: 'SmartRide AI', price: parseInt(rides.find(r => r.id === selRide)?.price.replace('₹', '') || 0), time: rides.find(r => r.id === selRide)?.time || '0 min', url: null, color: '#00D8FF' },
    { id: 'rapido', name: 'Rapido Auto', price: 220, time: '25 min', url: 'https://rapido.bike/', color: '#FFD700' },
    { id: 'uber', name: 'Uber Go', price: 265, time: '26 min', url: 'https://m.uber.com/', color: '#FFFFFF' },
    { id: 'ola', name: 'Ola Mini', price: 280, time: '28 min', url: 'https://book.olacabs.com/', color: '#A5C933' },
  ].sort((a, b) => a.price - b.price);

  const confirmLabel = `Confirm ${rides.find(r => r.id === selRide)?.name}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

      {/* Map Section */}
      <div style={{ height: '40%', position: 'relative', overflow: 'hidden' }}>
        <RouteMap origin={currentLocation?.coords} destination={destination} travelMode={selRide === 'transit' ? 'TRANSIT' : 'DRIVING'} />
        <div style={{ position: 'absolute', top: '56px', left: '20px', zIndex: 50 }}>
          <button onClick={() => navigate(-1)} className="btn-icon" style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--bg-surface)', backdropFilter: 'blur(20px)' }}>
            <ArrowLeft size={20} color="var(--text-main)" />
          </button>
        </div>

        {/* Floating Destination Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ position: 'absolute', bottom: '32px', left: '20px', right: '20px', zIndex: 50 }}
        >
          <div style={{ 
            background: 'var(--bg-surface)', 
            backdropFilter: 'blur(24px)', 
            border: '1px solid var(--border-ui)', 
            borderRadius: '20px', 
            padding: '16px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px', 
            boxShadow: '0 12px 48px rgba(0,0,0,0.2)' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #00D8FF', background: 'var(--bg-base)' }} />
              <div style={{ width: '1px', height: '20px', background: 'linear-gradient(180deg, #00D8FF, #6366F1)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366F1', boxShadow: '0 0 10px #6366F1' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Current Route</p>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800 }}>{destination}</h3>
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
        marginTop: '-24px', 
        zIndex: 100, 
        display: 'flex', 
        flexDirection: 'column', 
        border: '1px solid var(--border-ui)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.2)'
      }}>
        {/* Pull Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '99px', background: 'var(--border-ui)' }} />
        </div>

        {/* Tab Selector */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '5px', gap: '5px' }}>
             <button style={{ flex: 1, height: '42px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', background: 'var(--brand-indigo)', color: 'white', border: 'none', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
               🚗 Ride
             </button>
             <button onClick={() => navigate('/user/parcel')} style={{ flex: 1, height: '42px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', background: 'transparent', color: '#6B7280', border: 'none' }}>
               📦 Parcel
             </button>
          </div>
        </div>

        {/* Contextual Header */}
        <div style={{ padding: '0 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {viewState === 'select' ? 'Choose Ride' : 'Live Comparison'}
          </h2>
          {viewState === 'select' && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setChatOpen(true)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                background: 'rgba(0, 216, 255, 0.1)', 
                border: '1px solid rgba(0, 216, 255, 0.2)', 
                borderRadius: '12px', padding: '6px 12px', 
                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, color: '#00D8FF' 
              }}
            >
              <Sparkles size={14} /> Chubby AI
            </motion.button>
          )}
        </div>

        {/* Dynamic Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="no-scrollbar">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <VehicleLoader />
              </motion.div>
            ) : viewState === 'select' ? (
              <motion.div key="select" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {rides.map(r => {
                   const isActive = selRide === r.id;
                   return (
                     <motion.button
                       key={r.id}
                       onClick={() => setSelRide(r.id)}
                       whileHover={{ scale: 1.01 }}
                       whileTap={{ scale: 0.98 }}
                        style={{ 
                          width: '100%', textAlign: 'left', cursor: 'pointer', 
                          background: isActive ? r.bg : 'var(--bg-card)', 
                          border: `1px solid ${isActive ? r.tagColor : 'var(--border-ui)'}`, 
                          borderRadius: '24px', padding: '20px', position: 'relative', overflow: 'hidden',
                          transition: 'all 0.3s'
                        }}
                     >
                        {isActive && (
                          <motion.div 
                            layoutId="activeGlow"
                            style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top right, ${r.tagColor}15, transparent 70%)` }}
                          />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                          <div style={{ 
                            width: '52px', height: '52px', borderRadius: '16px', 
                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                          }}>{r.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{r.name}</span>
                              {r.tag && <span style={{ fontSize: '0.65rem', fontWeight: 900, color: r.tagColor, background: `${r.tagColor}15`, border: `1px solid ${r.tagColor}30`, borderRadius: '6px', padding: '3px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.tag}</span>}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{r.desc}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '1.25rem', fontWeight: 900, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{r.price}</p>
                            <p style={{ fontSize: '0.75rem', color: isActive ? r.tagColor : 'var(--text-muted)', fontWeight: 700 }}>{r.time}</p>
                          </div>
                        </div>
                     </motion.button>
                   );
                 })}
              </motion.div>
            ) : (
              <motion.div key="compare" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {/* Premium Comparison Grid */}
                 <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-ui)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    {competitorApps.map((comp, idx) => {
                      const isActive = selectedComp === comp.id;
                      return (
                        <div 
                          key={comp.id} 
                          onClick={() => setSelectedComp(comp.id)}
                           style={{ 
                            padding: '20px 24px', 
                            borderBottom: idx !== competitorApps.length - 1 ? '1px solid var(--border-ui)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: isActive ? 'rgba(var(--brand-cyan-rgb), 0.08)' : 'transparent',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                               <div style={{ 
                                width: '48px', height: '48px', borderRadius: '14px', 
                                background: isActive ? comp.color : 'var(--bg-elevated)',
                                border: '1px solid var(--border-ui)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                {comp.id === 'smartride' ? (
                                  <Zap size={20} color={isActive ? "#05070A" : "var(--brand-cyan)"} />
                                ) : (
                                  <Navigation size={20} color={isActive ? "#05070A" : "#6B7280"} />
                                )}
                              </div>
                               <div>
                                 <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{comp.name}</h4>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                   <Clock size={12} color="var(--text-muted)" />
                                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ETA {comp.time}</span>
                                 </div>
                               </div>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: '1.25rem', fontWeight: 900, color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>₹{comp.price}</p>
                              {idx === 0 && <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Cheapest</span>}
                           </div>
                        </div>
                      );
                    })}
                 </div>

                 {/* AI Insights Card */}
                 <motion.div 
                   onClick={() => setChatOpen(true)}
                   whileHover={{ scale: 1.02 }}
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(0,216,255,0.1) 100%)',
                     border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '24px', cursor: 'pointer'
                   }}
                 >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                       <div style={{ padding: '8px', background: 'rgba(99,102,241,0.2)', borderRadius: '12px' }}>
                         <Sparkles size={20} color="#6366F1" />
                       </div>
                       <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>Ask Chubby</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Choosing <strong>SmartRide AI</strong> saves you <strong>₹55</strong> by combining a short walk with a direct pickup. 
                      <span style={{ color: '#00D8FF', fontWeight: 700, marginLeft: '6px' }}>View Analysis →</span>
                    </p>
                 </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Final Action Button */}
        <div style={{ padding: '20px 24px 32px', borderTop: '1px solid var(--border-ui)' }}>
           <div style={{ display: 'flex', gap: '12px' }}>
              {viewState === 'compare' && (
                <button onClick={() => setViewState('select')} className="btn-icon" style={{ width: '56px', height: '56px', borderRadius: '18px' }}>
                  <ArrowLeft size={24} color="#F1F5F9" />
                </button>
              )}
              <motion.button 
                whileTap={{ scale: 0.98 }}
                disabled={isBooking || isLoading}
                onClick={async () => {
                  if (viewState === 'select') setViewState('compare');
                  else {
                    const target = competitorApps.find(c => c.id === selectedComp);
                    if (target) {
                      if (target.id === 'smartride') {
                        try {
                          setIsBooking(true);
                          const rideId = await createRideRequest(user.uid, {
                            rideType: selRide,
                            price: target.price,
                            pickup: "Current Location",
                            dropoff: destination,
                            eta: target.time
                          });
                          navigate('/user/activity', { state: { rideId, confirmed: true } });
                        } catch {
                          setIsBooking(false);
                        }
                      } else if (target.url) {
                        window.open(target.url, '_blank');
                      }
                    }
                  }
                }}
                className="btn-primary" 
                style={{ flex: 1, height: '56px', fontSize: '1.1rem', fontWeight: 900, borderRadius: '18px', gap: '10px', opacity: (isBooking || isLoading) ? 0.7 : 1 }}
              >
                {(isBooking || isLoading) ? <Loader2 className="animate-spin" size={20} /> : (viewState === 'select' ? confirmLabel : `Book on ${competitorApps.find(c => c.id === selectedComp)?.name}`)}
                {!(isBooking || isLoading) && (viewState === 'select' ? <ChevronRight size={20} /> : <Navigation size={20} />)}
              </motion.button>
            </div>
        </div>
      </div>
      <AIChatBot 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        pickup={currentLocation?.address || 'Current Location'} 
        dropoff={destination} 
        onSelectTransitMode={(mode = 'transit') => {
          setSelRide(mode);
          setChatOpen(false);
        }}
      />
    </div>
  );
};

export default RideComparison;
