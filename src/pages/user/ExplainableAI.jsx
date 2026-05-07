import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import BottomNavigation from '../../components/layout/BottomNavigation';

const priceData = [
  { t:'10:00', direct:21, smart:14 },
  { t:'10:15', direct:26, smart:15 },
  { t:'10:30', direct:32, smart:13 },
  { t:'10:45', direct:28, smart:12 },
  { t:'11:00', direct:22, smart:11 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#141C2E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'10px 14px', fontSize:'0.8rem' }}>
      <p style={{ color:'#4B5563', marginBottom:'6px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.name === 'smart' ? '#00D8FF' : '#EF4444', fontWeight:600 }}>
          {p.name === 'smart' ? 'SmartRide' : 'Direct'}: ₹{p.value}
        </p>
      ))}
    </div>
  );
};

const Metric = ({ label, value, sub, accent }) => (
  <div style={{ background:'rgba(15,22,35,0.7)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'14px', padding:'14px', flex:1 }}>
    <p style={{ fontSize:'0.68rem', color:'#4B5563', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px' }}>{label}</p>
    <p style={{ fontSize:'1.3rem', fontWeight:800, color: accent || '#F1F5F9' }}>{value}</p>
    {sub && <p style={{ fontSize:'0.72rem', color:'#4B5563', marginTop:'3px' }}>{sub}</p>}
  </div>
);

const ProgressBar = ({ label, value, color }) => (
  <div>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
      <span style={{ fontSize:'0.82rem', color:'#6B7280' }}>{label}</span>
      <span style={{ fontSize:'0.82rem', fontWeight:700, color:color }}>{value}%</span>
    </div>
    <div style={{ height:'5px', background:'rgba(255,255,255,0.06)', borderRadius:'99px', overflow:'hidden' }}>
      <motion.div
        initial={{ width:0 }} animate={{ width:`${value}%` }}
        transition={{ duration:1, delay:0.4, ease:[0.16,1,0.3,1] }}
        style={{ height:'100%', background:color, borderRadius:'99px', boxShadow:`0 0 8px ${color}` }}
      />
    </div>
  </div>
);

const Section = ({ title, icon, children, accent='#00D8FF' }) => (
  <motion.div
    initial={{ y:16, opacity:0 }} animate={{ y:0, opacity:1 }}
    className="card" style={{ padding:'20px', overflow:'hidden' }}
  >
    <h2 style={{ fontSize:'1rem', fontWeight:700, color:'#F1F5F9', display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
      <span style={{ color:accent }}>{icon}</span> {title}
    </h2>
    {children}
  </motion.div>
);

const ExplainableAI = () => {
  const navigate = useNavigate();

  return (
    <div style={{ height:'100%', background:'var(--bg-base)', overflowY:'auto', display:'flex', flexDirection:'column' }} className="no-scrollbar">
      {/* Header */}
      <div style={{
        position:'sticky', top:0, zIndex:20, background:'rgba(8,12,20,0.92)',
        backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)',
        padding:'48px 20px 16px', display:'flex', alignItems:'center', gap:'12px',
      }}>
        <button onClick={() => navigate(-1)} className="btn-icon" style={{ width:'38px', height:'38px' }}>
          <ArrowLeft size={18} color="#9CA3AF" />
        </button>
        <div>
          <h1 style={{ fontSize:'1.1rem', fontWeight:800, color:'#F1F5F9', letterSpacing:'-0.01em' }}>AI Insights</h1>
          <p style={{ fontSize:'0.75rem', color:'#4B5563' }}>Why SmartRide recommended this</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'14px', paddingBottom:'100px' }}>

        {/* Cost Optimization */}
        <Section title="Cost Optimization" icon="📉">
          <p style={{ fontSize:'0.85rem', color:'#6B7280', lineHeight:1.65, marginBottom:'16px' }}>
            AI detected a <span style={{ color:'#EF4444', fontWeight:700 }}>1.8× price surge</span> for direct cabs due to traffic congestion on Main Street. Switching to a hybrid route saves you <span style={{ color:'#10B981', fontWeight:700 }}>₹130 (42%)</span>.
          </p>
          <div style={{ height:'150px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData} margin={{ top:5, right:5, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="gradSmart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D8FF" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00D8FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradDirect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" stroke="#374151" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#374151" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area dataKey="direct" stroke="#EF4444" strokeDasharray="4 3" strokeWidth={1.5} fillOpacity={1} fill="url(#gradDirect)"/>
                <Area dataKey="smart" stroke="#00D8FF" strokeWidth={2.5} fillOpacity={1} fill="url(#gradSmart)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* Ride Stability */}
        <Section title="Ride Stability Index" icon="🛡️" accent="#8B5CF6">
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'16px' }}>
            <div style={{ position:'relative', width:'80px', height:'80px' }}>
              <svg viewBox="0 0 80 80" style={{ position:'absolute', inset:0 }}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
                <motion.circle cx="40" cy="40" r="32" fill="none" stroke="#8B5CF6" strokeWidth="6"
                  strokeLinecap="round" strokeDasharray={`${2*Math.PI*32}`}
                  initial={{ strokeDashoffset: 2*Math.PI*32 }}
                  animate={{ strokeDashoffset: 2*Math.PI*32 * 0.02 }}
                  transition={{ duration:1.2, delay:0.3, ease:[0.16,1,0.3,1] }}
                  transform="rotate(-90 40 40)"
                  style={{ filter:'drop-shadow(0 0 6px #8B5CF6)' }}
                />
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'1.1rem', fontWeight:800, color:'#F1F5F9' }}>98</span>
                <span style={{ fontSize:'0.6rem', color:'#4B5563', letterSpacing:'0.04em' }}>/ 100</span>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <ProgressBar label="Driver Smoothness" value={96} color="#8B5CF6"/>
            <ProgressBar label="Road Condition" value={82} color="#6366F1"/>
            <ProgressBar label="Vehicle Health" value={99} color="#00D8FF"/>
          </div>
        </Section>

        {/* Effort Optimization */}
        <Section title="Effort Optimization" icon="⚡" accent="#10B981">
          <div style={{ display:'flex', gap:'10px' }}>
            <Metric label="Walking" value="240m" accent="#10B981"/>
            <Metric label="Transfers" value="1" />
            <Metric label="Wait" value="3 min" />
          </div>
        </Section>

        {/* Confidence Score */}
        <Section title="AI Confidence" icon="🧠" accent="#6366F1">
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <div className="ring-glow" style={{ width:'60px', height:'60px', borderRadius:'99px', background:'rgba(99,102,241,0.1)', border:'2px solid #6366F1', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:'1rem', fontWeight:800, color:'#6366F1' }}>94%</span>
            </div>
            <p style={{ fontSize:'0.83rem', color:'#6B7280', lineHeight:1.6 }}>
              High confidence — route is based on real-time traffic, historical patterns and 6 AI agent signals.
            </p>
          </div>
        </Section>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ExplainableAI;
