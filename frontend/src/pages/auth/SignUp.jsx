import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Smartphone, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const socials = [
  { label:'Google',   logo:'https://www.svgrepo.com/show/475656/google-color.svg' },
  { label:'Facebook', logo:'https://www.svgrepo.com/show/475647/facebook-color.svg' },
];

const SignUp = () => {
  const navigate  = useNavigate();
  const accent    = '#00D8FF';

  const { registerWithEmail, loginWithGoogle, loginWithFacebook } = useAuth();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 10);
    setPhone(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerWithEmail(email, password, name);
      navigate('/user/welcome');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      navigate('/user/welcome');
    } catch (err) {
      setError(err.message || 'Google Sign Up failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setIsLoading(true);
      await loginWithFacebook();
      navigate('/user/welcome');
    } catch (err) {
      setError(err.message || 'Facebook Sign Up failed. Please try again.');
      setIsLoading(false);
    }
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
        maxLength={type === 'tel' ? 10 : undefined}
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar" style={{ background:'var(--bg-base)', padding:'0 24px' }}>
      <div style={{ position:'absolute', top:'0', right:'-10%', width:'250px', height:'250px', background:`radial-gradient(circle, ${accent}18 0%, transparent 70%)`, filter:'blur(50px)', pointerEvents:'none' }} />

      <AnimatePresence mode="wait">
        <motion.div
          key="signup"
          initial={{ opacity:0, x:-20 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:20 }}
          style={{ flex:1, display:'flex', flexDirection:'column' }}
        >
          {/* Header */}
          <div style={{ paddingTop:'56px', marginBottom:'32px', position:'relative', zIndex:10 }}>
            <h1 style={{ fontSize:'2rem', fontWeight:800, color:'var(--text-main)', letterSpacing:'-0.02em', marginBottom:'8px' }}>
              Create account
            </h1>
            <p style={{ fontSize:'0.9rem', color:'#4B5563' }}>
              Join SmartRide AI as a Rider today.
            </p>
          </div>

          {/* Sign In / Sign Up Switcher */}
          <div style={{ 
            display:'grid', 
            gridTemplateColumns: '1fr 1fr',
            background:'var(--bg-elevated)', 
            borderRadius:'16px', 
            padding:'6px', 
            gap:'6px', 
            marginBottom:'24px', 
            position:'relative', 
            zIndex:10,
            border: '1px solid var(--border-ui)'
          }}>
             <button 
              type="button"
              onClick={() => navigate('/login')}
              style={{ 
                height:'44px', 
                borderRadius:'12px', 
                fontSize:'0.9rem', 
                fontWeight:700, 
                cursor:'pointer', 
                transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                background:'transparent', 
                color:'var(--text-muted)', 
                border:'none'
              }}
             >
               Sign In
             </button>
             <button 
              type="button"
              onClick={() => navigate('/signup')}
              style={{ 
                height:'44px', 
                borderRadius:'12px', 
                fontSize:'0.9rem', 
                fontWeight:700, 
                cursor:'pointer', 
                transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                background:'var(--brand-cyan)', 
                color:'#080C14', 
                border:'none',
                boxShadow: '0 4px 12px rgba(0, 216, 255, 0.2)'
              }}
             >
               Sign Up
             </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ marginBottom:'16px', padding:'12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', color:'#EF4444', fontSize:'0.85rem', display:'flex', gap:'8px', alignItems:'center' }}>
              <div style={{ width:'4px', height:'4px', borderRadius:'99px', background:'#EF4444' }} />
              {error}
            </div>
          )}

          <form
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
              <Smartphone size={18} color="#4B5563" />,
              'tel', phone, e => handlePhoneChange(e.target.value), 'Phone number'
            )}
            {field(
              <Lock size={18} color="#4B5563" />,
              'password', password, e => setPassword(e.target.value), 'Create password'
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-cyan w-full h-14 mt-2" 
              style={{ gap:'8px', color:'#080C14', fontWeight:700, opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'} 
              {!isLoading && <ArrowRight size={18}/>}
            </button>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'6px 0' }}>
              <div className="divider" style={{ flex:1 }} />
              <span style={{ fontSize:'0.8rem', color:'#374151', whiteSpace:'nowrap' }}>or sign up with</span>
              <div className="divider" style={{ flex:1 }} />
            </div>

            {/* Social Grid (Google and Facebook) */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
              <button 
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                type="button" className="btn-icon" style={{ height:'48px' }}
              >
                <img src={socials[0].logo} alt="Google" style={{ width:'22px', height:'22px', objectFit:'contain' }} />
              </button>
              <button 
                onClick={handleFacebookSignUp}
                disabled={isLoading}
                type="button" className="btn-icon" style={{ height:'48px' }}
              >
                <img src={socials[1].logo} alt="Facebook" style={{ width:'22px', height:'22px', objectFit:'contain' }} />
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>

      <div style={{ textAlign:'center', marginTop:'24px', marginBottom:'24px', fontSize:'0.875rem', color:'#4B5563', position:'relative', zIndex:10 }}>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} style={{ color:accent, fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
          Sign in
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#374151', marginBottom: '32px', lineHeight: 1.6 }}>
        By continuing, you agree to our{' '}
        <span onClick={() => navigate('/terms')} style={{ color: '#6B7280', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>{' '}
        and{' '}
        <span onClick={() => navigate('/privacy')} style={{ color: '#6B7280', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
      </p>
    </div>
  );
};

export default SignUp;
