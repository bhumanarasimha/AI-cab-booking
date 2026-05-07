import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const socials = [
  { label:'Google',    logo:'https://www.svgrepo.com/show/475656/google-color.svg' },
  { label:'Apple',     logo:'https://www.svgrepo.com/show/511330/apple-173.svg',    invert:true },
  { label:'Facebook',  logo:'https://www.svgrepo.com/show/475647/facebook-color.svg' },
  { label:'Twitter',   logo:'https://www.svgrepo.com/show/513008/twitter-154.svg' },
  { label:'Instagram', logo:'https://www.svgrepo.com/show/475658/instagram-color.svg' },
  { label:'LinkedIn',  logo:'https://www.svgrepo.com/show/475661/linkedin-color.svg' },
];

const Login = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state?.role || 'user';
  const isCaptain = role === 'captain';
  const accent = isCaptain ? '#6366F1' : '#00D8FF';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(isCaptain ? '/captain/dashboard' : '/user/home');
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar" style={{ background:'var(--bg-base)', padding:'0 24px' }}>
      {/* Ambient glow */}
      <div style={{ position:'absolute', top:'-5%', left:'-10%', width:'280px', height:'280px', background:`radial-gradient(circle, ${accent}22 0%, transparent 70%)`, filter:'blur(50px)', pointerEvents:'none' }} />

      {/* Header */}
      <div style={{ paddingTop:'56px', marginBottom:'36px', position:'relative', zIndex:10 }}>
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
          <div className="ai-chip px-3 py-1.5 mb-4" style={{ width:'fit-content', borderColor:`${accent}40`, color:accent }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'99px', background:accent, flexShrink:0 }} />
            {isCaptain ? 'Captain Portal' : 'Rider Portal'}
          </div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#F1F5F9', letterSpacing:'-0.02em', marginBottom:'8px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize:'0.9rem', color:'#4B5563' }}>Sign in to your SmartRide AI account.</p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        onSubmit={handleLogin}
        style={{ display:'flex', flexDirection:'column', gap:'14px', position:'relative', zIndex:10 }}
      >
        {/* Email */}
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="field" placeholder="Email address" required
            style={{ padding:'15px 16px 15px 46px', fontSize:'0.95rem' }}
          />
        </div>

        {/* Password */}
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <input
            type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            className="field" placeholder="Password" required
            style={{ padding:'15px 46px 15px 46px', fontSize:'0.95rem' }}
          />
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:'16px', top:'50%', transform:'translateY(-50%)', color:'#4B5563', background:'none', border:'none', cursor:'pointer' }}>
            {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>

        <div style={{ textAlign:'right' }}>
          <button type="button" style={{ fontSize:'0.83rem', color:accent, fontWeight:500, background:'none', border:'none', cursor:'pointer' }}>
            Forgot password?
          </button>
        </div>

        {/* Sign in */}
        {isCaptain
          ? <button type="submit" className="btn-primary w-full h-14" style={{ gap:'8px' }}>Sign In <ArrowRight size={18}/></button>
          : <button type="submit" className="btn-cyan w-full h-14" style={{ gap:'8px', color:'#080C14', fontWeight:700 }}>Sign In <ArrowRight size={18}/></button>
        }

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'4px 0' }}>
          <div className="divider" style={{ flex:1 }} />
          <span style={{ fontSize:'0.8rem', color:'#374151', whiteSpace:'nowrap' }}>or continue with</span>
          <div className="divider" style={{ flex:1 }} />
        </div>

        {/* Social Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
          {socials.map(s => (
            <button key={s.label} type="button" className="btn-icon" style={{ height:'48px' }}>
              <img src={s.logo} alt={s.label} style={{ width:'22px', height:'22px', objectFit:'contain', filter:s.invert?'invert(1)':undefined }} />
            </button>
          ))}
        </div>
      </motion.form>

      {/* Sign up link */}
      <div style={{ textAlign:'center', marginTop:'28px', marginBottom:'24px', fontSize:'0.875rem', color:'#4B5563', position:'relative', zIndex:10 }}>
        Don't have an account?{' '}
        <button
          onClick={() => navigate('/signup', { state:{ role } })}
          style={{ color:accent, fontWeight:600, background:'none', border:'none', cursor:'pointer' }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
