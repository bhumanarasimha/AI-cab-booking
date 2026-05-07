import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Package, Weight, Ruler, Clock } from 'lucide-react';
import MapPlaceholder from '../../components/ui/MapPlaceholder';
import BottomNavigation from '../../components/layout/BottomNavigation';

const parcelTypes = [
  {
    id: 'express',
    name: 'Express Bike',
    tag: 'Fastest',
    tagColor: '#F59E0B',
    desc: 'Bike courier · Up to 5 kg',
    price: '₹90',
    eta: '18 min',
    maxWeight: '5 kg',
    maxSize: '40×30 cm',
    border: 'rgba(245,158,11,0.35)',
    bg: 'rgba(245,158,11,0.05)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/>
        <path d="M15 6h2l2 5H5l2-5h2"/><path d="M8 6V4h8v2"/>
      </svg>
    ),
  },
  {
    id: 'standard',
    name: 'Standard Cab',
    tag: null,
    desc: 'Car delivery · Up to 20 kg',
    price: '₹160',
    eta: '35 min',
    maxWeight: '20 kg',
    maxSize: '60×50 cm',
    border: 'rgba(255,255,255,0.07)',
    bg: 'transparent',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
  },
  {
    id: 'heavy',
    name: 'Heavy Van',
    tag: 'New',
    tagColor: '#A855F7',
    desc: 'Van · Up to 100 kg · Fragile ok',
    price: '₹320',
    eta: '50 min',
    maxWeight: '100 kg',
    maxSize: '120×80 cm',
    border: 'rgba(168,85,247,0.3)',
    bg: 'rgba(168,85,247,0.05)',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

const Parcel = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('express');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [fragile, setFragile] = useState(false);
  const [step, setStep] = useState(1); // 1 = type, 2 = details

  const sel = parcelTypes.find(p => p.id === selected);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', position: 'relative' }}>
      {/* Map */}
      <div style={{ height: '38%', position: 'relative' }}>
        <MapPlaceholder />

        {/* Top label */}
        <div style={{ position: 'absolute', top: '48px', left: '20px', right: '20px', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="ai-chip px-3 py-1.5" style={{ fontSize: '0.72rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '99px', background: '#00D8FF' }} />
            SmartParcel AI
          </div>
        </div>

        {/* Route Pill */}
        <div style={{ position: 'absolute', bottom: '24px', left: '16px', right: '16px', zIndex: 20 }}>
          <div style={{
            background: 'rgba(15,22,35,0.93)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px',
            padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '99px', background: '#00D8FF' }} />
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: '#A855F7' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.78rem', color: '#4B5563', marginBottom: '3px' }}>Pickup · Tech Park, Sector 4</p>
              <p style={{ fontSize: '0.88rem', color: '#F1F5F9', fontWeight: 600 }}>Drop · Downtown Metro Station</p>
            </div>
            <button style={{ fontSize: '0.75rem', color: '#00D8FF', fontWeight: 600, background: 'rgba(0,216,255,0.08)', border: '1px solid rgba(0,216,255,0.2)', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer' }}>
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div style={{
        flex: 1, background: 'var(--bg-surface)',
        borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
        marginTop: '-20px', zIndex: 30, display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '99px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Step indicator */}
        <div style={{ padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
            {step === 1 ? 'Select Parcel Type' : 'Package Details'}
          </h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ width: s === step ? '20px' : '6px', height: '6px', borderRadius: '99px', background: s === step ? '#6366F1' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '6px' }} className="no-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                {parcelTypes.map(p => {
                  const active = selected === p.id;
                  return (
                    <motion.button key={p.id} onClick={() => setSelected(p.id)} whileHover={{ y: -1 }}
                      style={{ width: '100%', textAlign: 'left', cursor: 'pointer', background: active ? p.bg : 'rgba(15,22,35,0.5)', border: `1px solid ${active ? p.border : 'rgba(255,255,255,0.06)'}`, borderRadius: '16px', padding: '14px', transition: 'all 0.2s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '13px', background: 'rgba(15,22,35,0.8)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {p.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F1F5F9' }}>{p.name}</span>
                            {p.tag && <span style={{ fontSize: '0.62rem', fontWeight: 800, color: p.tagColor, background: `${p.tagColor}18`, border: `1px solid ${p.tagColor}30`, borderRadius: '99px', padding: '2px 7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.tag}</span>}
                          </div>
                          <p style={{ fontSize: '0.78rem', color: '#4B5563', marginBottom: '5px' }}>{p.desc}</p>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '3px' }}><Weight size={11} />{p.maxWeight}</span>
                            <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '3px' }}><Ruler size={11} />{p.maxSize}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: '1.05rem', fontWeight: 800, color: active ? '#F1F5F9' : '#9CA3AF', marginBottom: '2px' }}>{p.price}</p>
                          <p style={{ fontSize: '0.75rem', color: active ? (p.tagColor || '#00D8FF') : '#4B5563', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                            <Clock size={11} />{p.eta}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                {/* Selected summary */}
                <div style={{ background: `${sel?.border?.replace('0.35', '0.05')}`, border: `1px solid ${sel?.border}`, borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'rgba(15,22,35,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{sel?.icon}</div>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F1F5F9' }}>{sel?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#4B5563' }}>{sel?.price} · {sel?.eta}</p>
                  </div>
                  <button onClick={() => setStep(1)} style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#6366F1', fontWeight: 600, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer' }}>Change</button>
                </div>

                {/* Weight */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Weight size={17} color="#4B5563" />
                  </div>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder={`Weight in kg (max ${sel?.maxWeight})`} className="field" style={{ padding: '13px 14px 13px 42px', fontSize: '0.88rem' }} />
                </div>

                {/* Instructions */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <Package size={17} color="#4B5563" />
                  </div>
                  <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special instructions (optional)" className="field" style={{ padding: '13px 14px 13px 42px', fontSize: '0.88rem' }} />
                </div>

                {/* Fragile toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px 16px', background: fragile ? 'rgba(245,158,11,0.06)' : 'rgba(15,22,35,0.5)', border: `1px solid ${fragile ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '14px', transition: 'all 0.2s' }} onClick={() => setFragile(!fragile)}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '7px', border: `2px solid ${fragile ? '#F59E0B' : 'rgba(255,255,255,0.15)'}`, background: fragile ? '#F59E0B' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                    {fragile && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" /></svg>}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: fragile ? '#F59E0B' : '#F1F5F9' }}>⚠️ Fragile Item</p>
                    <p style={{ fontSize: '0.74rem', color: '#4B5563', marginTop: '2px' }}>Extra careful handling · +₹20</p>
                  </div>
                </label>

                {/* Price summary */}
                <div style={{ background: 'rgba(15,22,35,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Fare Estimate</p>
                  {[
                    ['Base fare', sel?.price],
                    ['Fragile handling', fragile ? '+₹20' : '—'],
                    ['Platform fee', '₹5'],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                      <span style={{ fontSize: '0.83rem', color: '#6B7280' }}>{l}</span>
                      <span style={{ fontSize: '0.83rem', fontWeight: 600, color: '#9CA3AF' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '9px', marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F1F5F9' }}>Total</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00D8FF' }}>
                      {sel ? `₹${parseInt(sel.price.replace('₹', '')) + (fragile ? 20 : 0) + 5}` : '—'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {step === 1 ? (
            <button className="btn-primary w-full" onClick={() => setStep(2)} style={{ height: '52px', width: '100%', fontSize: '0.97rem', gap: '8px' }}>
              Continue with {sel?.name} <ChevronRight size={18} />
            </button>
          ) : (
            <button className="btn-cyan w-full" style={{ height: '52px', width: '100%', fontSize: '0.97rem', gap: '8px', color: '#080C14', fontWeight: 700 }}>
              Schedule Pickup <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Parcel;
