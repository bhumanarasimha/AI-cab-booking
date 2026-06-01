import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Smartphone, Lock, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const socials = [
  { label:'Google',    logo:'https://www.svgrepo.com/show/475656/google-color.svg' },
  { label:'Apple',     logo:'https://www.svgrepo.com/show/511330/apple-173.svg',    invert:true },
  { label:'Facebook',  logo:'https://www.svgrepo.com/show/475647/facebook-color.svg' },
  { label:'Twitter',   logo:'https://www.svgrepo.com/show/513008/twitter-154.svg' },
  { label:'Instagram', logo:'https://www.svgrepo.com/show/475658/instagram-color.svg' },
  { label:'LinkedIn',  logo:'https://www.svgrepo.com/show/475661/linkedin-color.svg' },
];

const Login = () => {
  const navigate = useNavigate();
  const accent = '#00D8FF';

  const { user, loading, loginWithGoogle, loginWithFacebook, loginWithApple, loginWithEmail, sendOtp, confirmOtp } = useAuth();
  const [method, setMethod] = useState('password'); // 'password' | 'otp'
  const [step, setStep] = useState('entry'); // 'entry' | 'otp-verify'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      navigate('/user/welcome');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (val, idx) => {
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && idx < 5) {
      document.getElementById(`login-otp-${idx + 1}`).focus();
    }
  };

  const handlePhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, '').substring(0, 10);
    setPhone(cleaned);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (method === 'otp' && step === 'entry') {
        if (phone.length !== 10) {
          setError('Please enter a valid 10-digit phone number');
          setIsLoading(false);
          return;
        }
        await sendOtp(phone);
        setStep('otp-verify');
        setTimer(60);
        setIsLoading(false);
      } else if (method === 'password') {
        await loginWithEmail(email, password);
        navigate('/user/welcome');
      } else {
        // Handle OTP verification (real)
        const otpCode = otp.join('');
        if (otpCode.length < 6) {
          setError('Please enter all 6 digits');
          setIsLoading(false);
          return;
        }
        await confirmOtp(otpCode);
        navigate('/user/welcome');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // If redirect, this code won't run. If popup, it will.
      navigate('/user/welcome');
    } catch (err) {
      if (err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Google Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithFacebook();
      navigate('/user/welcome');
    } catch (err) {
      if (err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Facebook Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithApple();
      navigate('/user/welcome');
    } catch (err) {
      if (err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Apple Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar" style={{ background:'var(--bg-base)', padding:'0 24px' }}>
      {/* Ambient glow */}
      <div style={{ position:'absolute', top:'-5%', left:'-10%', width:'280px', height:'280px', background:`radial-gradient(circle, ${accent}22 0%, transparent 70%)`, filter:'blur(50px)', pointerEvents:'none' }} />

      <AnimatePresence mode="wait">
        {step === 'entry' ? (
          <motion.div
            key="entry"
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-12 }}
            style={{ flex:1, display:'flex', flexDirection:'column' }}
          >
            {/* Header */}
            <div style={{ paddingTop:'56px', marginBottom:'36px', position:'relative', zIndex:10 }}>
              <div className="ai-chip px-3 py-1.5 mb-4" style={{ width:'fit-content', borderColor:`${accent}40`, color:accent }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'99px', background:accent, flexShrink:0 }} />
                Rider Portal
              </div>
              <h1 style={{ fontSize:'2rem', fontWeight:800, color:'var(--text-main)', letterSpacing:'-0.02em', marginBottom:'8px' }}>
                Welcome back
              </h1>
              <p style={{ fontSize:'0.9rem', color:'#4B5563' }}>Sign in to your SmartRide AI account.</p>
            </div>

            {/* Method Switcher */}
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
                onClick={() => setMethod('password')}
                style={{ 
                  height:'44px', 
                  borderRadius:'12px', 
                  fontSize:'0.9rem', 
                  fontWeight:700, 
                  cursor:'pointer', 
                  transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                  background:method === 'password' ? 'var(--brand-cyan)' : 'transparent', 
                  color:method === 'password' ? '#080C14' : 'var(--text-muted)', 
                  border:'none',
                  boxShadow: method === 'password' ? '0 4px 12px rgba(0, 216, 255, 0.2)' : 'none'
                }}
               >
                 Password
               </button>
               <button 
                onClick={() => setMethod('otp')}
                style={{ 
                  height:'44px', 
                  borderRadius:'12px', 
                  fontSize:'0.9rem', 
                  fontWeight:700, 
                  cursor:'pointer', 
                  transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                  background:method === 'otp' ? 'var(--brand-cyan)' : 'transparent', 
                  color:method === 'otp' ? '#080C14' : 'var(--text-muted)', 
                  border:'none',
                  boxShadow: method === 'otp' ? '0 4px 12px rgba(0, 216, 255, 0.2)' : 'none'
                }}
               >
                 OTP
               </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ marginBottom:'16px', padding:'12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', color:'#EF4444', fontSize:'0.85rem', display:'flex', gap:'8px', alignItems:'center' }}>
                <div style={{ width:'4px', height:'4px', borderRadius:'99px', background:'#EF4444' }} />
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleLogin}
              style={{ display:'flex', flexDirection:'column', gap:'14px', position:'relative', zIndex:10 }}
            >
              {method === 'password' ? (
                <>
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
                      <Lock size={18} color="#4B5563" />
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
                </>
              ) : (
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)' }}>
                    <Smartphone size={18} color="#4B5563" />
                  </div>
                  <input
                    type="tel" value={phone} onChange={e => handlePhoneChange(e.target.value)}
                    className="field" placeholder="Phone number" required
                    maxLength={10}
                    style={{ padding:'15px 16px 15px 46px', fontSize:'0.95rem' }}
                  />
                </div>
              )}

              {method === 'password' && (
                <div style={{ textAlign:'right' }}>
                  <button type="button" style={{ fontSize:'0.83rem', color:accent, fontWeight:500, background:'none', border:'none', cursor:'pointer' }}>
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Sign in */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn-cyan w-full h-14" 
                style={{ gap:'8px', color:'#080C14', fontWeight:700, opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (method === 'otp' ? 'Send OTP' : 'Sign In')} 
                {!isLoading && <ArrowRight size={18}/>}
              </button>

            </form>
            
            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0 10px 0', position:'relative', zIndex:10 }}>
              <div className="divider" style={{ flex:1 }} />
              <span style={{ fontSize:'0.8rem', color:'#374151', whiteSpace:'nowrap' }}>or continue with</span>
              <div className="divider" style={{ flex:1 }} />
            </div>

            {/* Social Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', position:'relative', zIndex:10 }}>
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                type="button" className="btn-icon" style={{ height:'48px' }}
              >
                <img src={socials[0].logo} alt="Google" style={{ width:'22px', height:'22px', objectFit:'contain' }} />
              </button>
              <button 
                onClick={handleAppleLogin}
                disabled={isLoading}
                type="button" className="btn-icon" style={{ height:'48px' }}
              >
                <img src={socials[1].logo} alt="Apple" style={{ width:'22px', height:'22px', objectFit:'contain', filter:'var(--icon-invert)' }} />
              </button>
              <button 
                onClick={handleFacebookLogin}
                disabled={isLoading}
                type="button" className="btn-icon" style={{ height:'48px' }}
              >
                <img src={socials[2].logo} alt="Facebook" style={{ width:'22px', height:'22px', objectFit:'contain' }} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="otp-verify"
            initial={{ opacity:0, x:20 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-20 }}
            style={{ flex:1, display:'flex', flexDirection:'column' }}
          >
            {/* Header */}
            <div style={{ paddingTop:'56px', marginBottom:'40px', position:'relative', zIndex:10 }}>
              <div style={{ padding:'12px', background:`rgba(0, 216, 255, 0.1)`, borderRadius:'16px', border:`1px solid rgba(0, 216, 255, 0.2)`, width:'fit-content', marginBottom:'24px' }}>
                <ShieldCheck size={32} color={accent} />
              </div>
              <h1 style={{ fontSize:'2rem', fontWeight:800, color:'var(--text-main)', letterSpacing:'-0.02em', marginBottom:'8px' }}>
                Verify Phone
              </h1>
              <p style={{ fontSize:'0.9rem', color:'var(--text-muted)', lineHeight:1.5 }}>
                We've sent a 6-digit code to <br /><span style={{ color:'var(--text-main)', fontWeight:700 }}>{phone || '+91 98765 43210'}</span>
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              style={{ display:'flex', flexDirection:'column', gap:'32px', position:'relative', zIndex:10 }}
            >
              <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`login-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    style={{
                      width:'46px', height:'60px', background:'var(--bg-elevated)',
                      border:'1px solid var(--border-ui)', borderRadius:'12px',
                      fontSize:'1.25rem', fontWeight:800, color:'var(--text-main)',
                      textAlign:'center', outline:'none'
                    }}
                  />
                ))}
              </div>

              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>
                  Didn't receive code?{' '}
                  <button 
                    type="button" 
                    onClick={async () => { 
                      if (timer === 0) {
                        setError('');
                        try {
                          await sendOtp(phone);
                          setTimer(60);
                        } catch (err) {
                          setError(err.message || 'Failed to resend OTP. Please try again.');
                        }
                      }
                    }}
                    disabled={timer > 0}
                    style={{ 
                      color: timer > 0 ? 'var(--text-muted)' : accent, 
                      fontWeight:600, 
                      background:'none', 
                      border:'none', 
                      cursor: timer > 0 ? 'not-allowed' : 'pointer',
                      opacity: timer > 0 ? 0.6 : 1
                    }}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                  </button>
                </p>
              </div>

              <button type="submit" className="btn-cyan w-full h-14" style={{ gap:'8px', color:'#080C14', fontWeight:700 }}>
                Verify & Login <CheckCircle2 size={18}/>
              </button>

              <button 
                type="button" 
                onClick={() => setStep('entry')}
                style={{ fontSize:'0.9rem', color:'#6B7280', fontWeight:600, background:'none', border:'none', cursor:'pointer', alignSelf:'center' }}
              >
                Change Login Method
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign up link */}
      <div style={{ textAlign:'center', marginTop:'28px', marginBottom:'24px', fontSize:'0.875rem', color:'#4B5563', position:'relative', zIndex:10 }}>
        Don't have an account?{' '}
        <button
          onClick={() => navigate('/signup')}
          style={{ color:accent, fontWeight:600, background:'none', border:'none', cursor:'pointer' }}
        >
          Sign up
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

export default Login;
