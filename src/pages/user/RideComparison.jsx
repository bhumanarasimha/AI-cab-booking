import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Package, Weight, Ruler, Info } from 'lucide-react';
import MapPlaceholder from '../../components/ui/MapPlaceholder';

/* ── RIDE OPTIONS ── */
const rides = [
  {
    id: 'smart', name: 'SmartRide AI', tag: 'AI Pick', tagColor: '#00D8FF',
    desc: 'Cab + Metro · Multi-modal', price: '₹210', time: '22 min',
    saving: 'Save 42%', savingColor: '#10B981',
    border: 'rgba(0,216,255,0.3)', bg: 'rgba(0,216,255,0.04)',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00D8FF" strokeWidth="2" strokeLinecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h4M12 8v4" strokeWidth="2.5"/><circle cx="16" cy="12" r="2" fill="#00D8FF" stroke="none"/></svg>,
  },
  {
    id: 'ev', name: 'Premium EV', tag: 'Eco', tagColor: '#10B981',
    desc: 'Zero emission · High comfort', price: '₹340', time: '25 min',
    border: 'rgba(255,255,255,0.07)', bg: 'transparent',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  },
  {
    id: 'eco', name: 'Economy', tag: null,
    desc: 'Standard sedan · 4 seats', price: '₹280', time: '30 min',
    border: 'rgba(255,255,255,0.07)', bg: 'transparent',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"><rect x="1" y="10" width="22" height="9" rx="3"/><path d="M6 10V7a6 6 0 0 1 12 0v3"/><circle cx="8" cy="17" r="1.5" fill="#6B7280" stroke="none"/><circle cx="16" cy="17" r="1.5" fill="#6B7280" stroke="none"/></svg>,
  },
];

/* ── PARCEL OPTIONS ── */
const parcels = [
  {
    id: 'express', name: 'Express Delivery', tag: 'Fastest', tagColor: '#F59E0B',
    desc: 'Bike courier · Upto 5kg', price: '₹90', eta: '18 min',
    maxWeight: '5 kg', maxSize: '40×30cm',
    border: 'rgba(245,158,11,0.3)', bg: 'rgba(245,158,11,0.04)',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg>,
  },
  {
    id: 'standard', name: 'Standard Parcel', tag: null,
    desc: 'Car delivery · Upto 20kg', price: '₹160', eta: '35 min',
    maxWeight: '20 kg', maxSize: '60×50cm',
    border: 'rgba(255,255,255,0.07)', bg: 'transparent',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
  {
    id: 'heavy', name: 'Heavy Freight', tag: 'New',  tagColor: '#A855F7',
    desc: 'Van · Upto 100kg · Fragile ok', price: '₹320', eta: '50 min',
    maxWeight: '100 kg', maxSize: '120×80cm',
    border: 'rgba(168,85,247,0.25)', bg: 'rgba(168,85,247,0.04)',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
];

/* ── Parcel Detail Form ── */
const ParcelDetailsForm = ({ parcels, selected, setSelected }) => {
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [fragile, setFragile] = useState(false);
  const sel = parcels.find(p => p.id === selected);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Options */}
      {parcels.map(p => {
        const active = selected === p.id;
        return (
          <motion.button key={p.id} onClick={() => setSelected(p.id)} whileHover={{ y: -1 }}
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: active ? p.bg : 'rgba(15,22,35,0.5)', border: `1px solid ${active ? p.border : 'rgba(255,255,255,0.06)'}`, borderRadius: '16px', padding: '14px', transition: 'all 0.2s ease' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '13px', background: 'rgba(15,22,35,0.8)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F1F5F9' }}>{p.name}</span>
                  {p.tag && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: p.tagColor, background: `${p.tagColor}18`, border: `1px solid ${p.tagColor}30`, borderRadius: '99px', padding: '2px 7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.tag}</span>}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#4B5563' }}>{p.desc}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '3px' }}><Weight size={11} />{p.maxWeight}</span>
                  <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '3px' }}><Ruler size={11} />{p.maxSize}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 800, color: active ? '#F1F5F9' : '#9CA3AF', marginBottom: '2px' }}>{p.price}</p>
                <p style={{ fontSize: '0.75rem', color: active ? p.tagColor || '#00D8FF' : '#4B5563' }}>{p.eta}</p>
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Package Details */}
      <div style={{ background: 'rgba(15,22,35,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Package Details</p>
        <input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder={`Weight in kg (max ${sel?.maxWeight})`} className="field" style={{ padding: '12px 14px', fontSize: '0.88rem' }} />
        <input value={notes} onChange={e => setNotes(e.target.value)} type="text" placeholder="Special instructions (optional)" className="field" style={{ padding: '12px 14px', fontSize: '0.88rem' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 14px', background: fragile ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)', border: fragile ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', transition: 'all 0.2s' }} onClick={() => setFragile(!fragile)}>
          <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${fragile ? '#F59E0B' : 'rgba(255,255,255,0.15)'}`, background: fragile ? '#F59E0B' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
            {fragile && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: fragile ? '#F59E0B' : '#F1F5F9' }}>⚠️ Fragile Item</p>
            <p style={{ fontSize: '0.72rem', color: '#4B5563', marginTop: '1px' }}>Extra care handling · +₹20</p>
          </div>
        </label>
      </div>
    </div>
  );
};

/* ── MAIN SCREEN ── */
const RideComparison = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('ride');          // 'ride' | 'parcel'
  const [selRide, setSelRide] = useState('smart');
  const [selParcel, setSelParcel] = useState('express');

  const confirmLabel = tab === 'ride'
    ? `Confirm ${rides.find(r => r.id === selRide)?.name}`
    : `Schedule ${parcels.find(p => p.id === selParcel)?.name}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', position: 'relative' }}>
      {/* Map */}
      <div style={{ height: '38%', position: 'relative' }}>
        <MapPlaceholder />
        <div style={{ position: 'absolute', top: '48px', left: '20px', zIndex: 20 }}>
          <button onClick={() => navigate(-1)} className="btn-icon" style={{ width: '40px', height: '40px' }}>
            <ArrowLeft size={18} color="#9CA3AF" />
          </button>
        </div>
        {/* Route Pill */}
        <div style={{ position: 'absolute', bottom: '24px', left: '16px', right: '16px', zIndex: 20 }}>
          <div style={{ background: 'rgba(15,22,35,0.93)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '99px', background: '#00D8FF' }} />
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '99px', background: '#6366F1' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.78rem', color: '#4B5563', marginBottom: '3px' }}>Tech Park, Sector 4</p>
              <p style={{ fontSize: '0.88rem', color: '#F1F5F9', fontWeight: 600 }}>Downtown Metro Station</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div style={{ flex: 1, background: 'var(--bg-surface)', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', marginTop: '-20px', zIndex: 30, display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Tab Switcher */}
        <div style={{ padding: '14px 16px 0' }}>
          <div style={{ display: 'flex', background: 'rgba(15,22,35,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '4px', gap: '4px' }}>
            {[
              { id: 'ride',   label: '🚗 Ride' },
              { id: 'parcel', label: '📦 Parcel' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, height: '38px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s', background: tab === t.id ? '#6366F1' : 'transparent', color: tab === t.id ? 'white' : '#6B7280', border: 'none', boxShadow: tab === t.id ? '0 4px 16px rgba(99,102,241,0.4)' : 'none' }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Header row */}
        <div style={{ padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
            {tab === 'ride' ? 'Choose a Ride' : 'Send a Parcel'}
          </h2>
          {tab === 'ride' && (
            <button onClick={() => navigate('/user/ai-insights')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(0,216,255,0.08)', border: '1px solid rgba(0,216,255,0.2)', borderRadius: '10px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: '#00D8FF' }}
            >
              <Info size={12} /> Why this?
            </button>
          )}
          {tab === 'parcel' && (
            <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Package size={13} /> Real-time tracking
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '6px' }} className="no-scrollbar">
          <AnimatePresence mode="wait">
            {tab === 'ride' ? (
              <motion.div key="ride" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rides.map(r => {
                  const active = selRide === r.id;
                  return (
                    <motion.button key={r.id} onClick={() => setSelRide(r.id)} whileHover={{ y: -1 }}
                      style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: active ? r.bg : 'rgba(15,22,35,0.5)', border: `1px solid ${active ? r.border : 'rgba(255,255,255,0.06)'}`, borderRadius: '16px', padding: '14px', transition: 'all 0.2s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '13px', background: 'rgba(15,22,35,0.8)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F1F5F9' }}>{r.name}</span>
                            {r.tag && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: r.tagColor, background: `${r.tagColor}18`, border: `1px solid ${r.tagColor}30`, borderRadius: '99px', padding: '2px 7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{r.tag}</span>}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#4B5563' }}>{r.desc}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '1.05rem', fontWeight: 800, color: active ? '#F1F5F9' : '#9CA3AF', marginBottom: '2px' }}>{r.price}</p>
                          <p style={{ fontSize: '0.75rem', color: active ? '#00D8FF' : '#4B5563' }}>{r.time}</p>
                          {r.saving && active && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: r.savingColor, background: `${r.savingColor}15`, borderRadius: '6px', padding: '2px 6px', display: 'inline-block', marginTop: '3px' }}>{r.saving}</span>}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div key="parcel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <ParcelDetailsForm parcels={parcels} selected={selParcel} setSelected={setSelParcel} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Button */}
        <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="btn-primary w-full" style={{ height: '52px', fontSize: '0.97rem', gap: '8px', width: '100%' }}>
            {confirmLabel}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideComparison;
