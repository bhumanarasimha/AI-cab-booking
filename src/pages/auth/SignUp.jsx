import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const socials = [
  { label:'Google',    logo:'https://www.svgrepo.com/show/475656/google-color.svg' },
  { label:'Apple',     logo:'https://www.svgrepo.com/show/511330/apple-173.svg',    invert:true },
  { label:'Facebook',  logo:'https://www.svgrepo.com/show/475647/facebook-color.svg' },
  { label:'Twitter',   logo:'https://www.svgrepo.com/show/513008/twitter-154.svg' },
  { label:'Instagram', logo:'https://www.svgrepo.com/show/475658/instagram-color.svg' },
  { label:'LinkedIn',  logo:'https://www.svgrepo.com/show/475661/linkedin-color.svg' },
];

const SignUp = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const role      = state?.role || 'user';
  const isCaptain = role === 'captain';
  const accent    = isCaptain ? '#6366F1' : '#00D8FF';

  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(isCaptain ? '/captain/dashboard' : '/user/home');
  };

  const field = (icon, type, value, onChange, placeholder, required=true) => (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
        {icon}
      </div>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="field"
        style={{ padding:'15px 16px 15px 46px', fontSize:'0.95rem' }}
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar" style={{ background:'var(--bg-base)', padding:'0 24px' }}>
      <div style={{ position:'absolute', top:'0', right:'-10%', width:'250px', height:'250px', background:`radial-gradient(circle, ${accent}18 0%, transparent 70%)`, filter:'blur(50px)', pointerEvents:'none' }} />

      {/* Header */}
      <div style={{ paddingTop:'56px', marginBottom:'32px', position:'relative', zIndex:10 }}>
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#F1F5F9', letterSpacing:'-0.02em', marginBottom:'8px' }}>
            Create account
          </h1>
          <p style={{ fontSize:'0.9rem', color:'#4B5563' }}>
            Join as a {isCaptain ? 'Captain' : 'Rider'} today.
          </p>
        </motion.div>
      </div>

      <motion.form
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        onSubmit={handleSubmit}
        style={{ display:'flex', flexDirection:'column', gap:'12px', position:'relative', zIndex:10 }}
      >
        {field(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
          'text', name, e => setName(e.target.value), 'Full Name'
        )}
        {field(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
          'email', email, e => setEmail(e.target.value), 'Email address'
        )}
        {field(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3 4.18 2 2 0 0 1 5 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 23 17z"/></svg>,
          'tel', phone, e => setPhone(e.target.value), 'Phone number'
        )}
        {field(
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
          'password', password, e => setPassword(e.target.value), 'Create password'
        )}

        {isCaptain
          ? <button type="submit" className="btn-primary w-full h-14 mt-2" style={{ gap:'8px' }}>Create Account <ArrowRight size={18}/></button>
          : <button type="submit" className="btn-cyan w-full h-14 mt-2" style={{ gap:'8px', color:'#080C14', fontWeight:700 }}>Create Account <ArrowRight size={18}/></button>
        }

        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'6px 0' }}>
          <div className="divider" style={{ flex:1 }} />
          <span style={{ fontSize:'0.8rem', color:'#374151', whiteSpace:'nowrap' }}>or sign up with</span>
          <div className="divider" style={{ flex:1 }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
          {socials.map(s => (
            <button key={s.label} type="button" className="btn-icon" style={{ height:'48px' }}>
              <img src={s.logo} alt={s.label} style={{ width:'22px', height:'22px', objectFit:'contain', filter:s.invert?'invert(1)':undefined }} />
            </button>
          ))}
        </div>
      </motion.form>

      <div style={{ textAlign:'center', marginTop:'24px', marginBottom:'24px', fontSize:'0.875rem', color:'#4B5563', position:'relative', zIndex:10 }}>
        Already have an account?{' '}
        <button onClick={() => navigate('/login', { state:{ role } })} style={{ color:accent, fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignUp;
