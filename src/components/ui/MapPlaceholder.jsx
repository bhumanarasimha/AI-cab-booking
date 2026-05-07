import React from 'react';
import { motion } from 'framer-motion';

const MapPlaceholder = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#0E1621' }}>

    <svg
      viewBox="0 0 390 480"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        {/* Road glow filter */}
        <filter id="roadGlow">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Route glow filter */}
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D8FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="pickupGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D8FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00D8FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ─── BASE LAND ─── */}
      <rect width="390" height="480" fill="#0E1621" />

      {/* ─── WATER BODY (river / lake shape) ─── */}
      <path d="M0 310 Q40 290 80 315 Q120 340 160 320 Q200 300 230 320 Q260 340 300 310 Q340 280 390 295 L390 360 Q350 340 300 360 Q260 380 220 360 Q180 340 140 355 Q100 370 60 350 Q30 335 0 345 Z"
        fill="#0D1F35" opacity="0.9" />

      {/* ─── PARK / GREEN AREAS ─── */}
      <rect x="20" y="60" width="60" height="40" rx="4" fill="#0F2018" />
      <rect x="22" y="62" width="56" height="36" rx="3" fill="#112219" />

      <rect x="240" y="150" width="80" height="55" rx="5" fill="#0F2018" />
      <rect x="242" y="152" width="76" height="51" rx="4" fill="#122319" />

      <rect x="100" y="370" width="70" height="45" rx="4" fill="#0F2018" />

      {/* ─── CITY BLOCKS / BUILDINGS ─── */}
      {/* Left column blocks */}
      <rect x="5"  y="120" width="38" height="28" rx="3" fill="#141E2D" />
      <rect x="5"  y="155" width="38" height="22" rx="3" fill="#131C2A" />
      <rect x="5"  y="185" width="38" height="35" rx="3" fill="#141E2D" />
      <rect x="5"  y="230" width="38" height="25" rx="3" fill="#131C2A" />

      {/* Center-left blocks */}
      <rect x="80"  y="108" width="50" height="32" rx="3" fill="#141E2D" />
      <rect x="80"  y="148" width="50" height="28" rx="3" fill="#131C2A" />
      <rect x="80"  y="185" width="50" height="38" rx="3" fill="#141E2D" />
      <rect x="80"  y="232" width="50" height="24" rx="3" fill="#131C2A" />
      <rect x="80"  y="265" width="50" height="30" rx="3" fill="#141E2D" />

      {/* Center blocks */}
      <rect x="175" y="68"  width="55" height="35" rx="3" fill="#141E2D" />
      <rect x="175" y="112" width="55" height="28" rx="3" fill="#131C2A" />
      <rect x="175" y="225" width="55" height="38" rx="3" fill="#141E2D" />
      <rect x="175" y="273" width="55" height="26" rx="3" fill="#131C2A" />

      {/* Right-side blocks */}
      <rect x="335" y="100" width="48" height="36" rx="3" fill="#141E2D" />
      <rect x="335" y="145" width="48" height="25" rx="3" fill="#131C2A" />
      <rect x="335" y="200" width="48" height="42" rx="3" fill="#141E2D" />
      <rect x="335" y="252" width="48" height="28" rx="3" fill="#131C2A" />
      <rect x="335" y="290" width="48" height="22" rx="3" fill="#141E2D" />

      {/* Lower blocks */}
      <rect x="30"  y="390" width="60" height="35" rx="3" fill="#141E2D" />
      <rect x="200" y="385" width="70" height="40" rx="3" fill="#141E2D" />
      <rect x="280" y="380" width="55" height="32" rx="3" fill="#131C2A" />

      {/* ─── HIGHWAYS / MAJOR ROADS ─── */}
      {/* Horizontal highway */}
      <rect x="0" y="98" width="390" height="8" rx="0" fill="#192538" />
      <rect x="0" y="100" width="390" height="4" rx="0" fill="#1D2E44" />
      {/* Center dash */}
      <line x1="0" y1="102" x2="390" y2="102" stroke="#263850" strokeWidth="0.5" strokeDasharray="12 8" />

      {/* Vertical highway */}
      <rect x="152" y="0" width="10" height="480" fill="#192538" />
      <rect x="154" y="0" width="6" height="480" fill="#1D2E44" />
      <line x1="157" y1="0" x2="157" y2="480" stroke="#263850" strokeWidth="0.5" strokeDasharray="12 8" />

      {/* ─── MAIN ROADS ─── */}
      {/* Horizontal main roads */}
      <rect x="0"   y="170" width="390" height="5" fill="#172030" />
      <rect x="0"   y="250" width="390" height="5" fill="#172030" />
      <rect x="0"   y="360" width="390" height="5" fill="#172030" />
      <rect x="0"   y="430" width="390" height="5" fill="#172030" />

      {/* Vertical main roads */}
      <rect x="50"  y="0" width="5" height="480" fill="#172030" />
      <rect x="240" y="0" width="5" height="480" fill="#172030" />
      <rect x="330" y="0" width="5" height="480" fill="#172030" />

      {/* ─── SECONDARY ROADS ─── */}
      <line x1="0"   y1="135" x2="390" y2="135" stroke="#152030" strokeWidth="2.5" />
      <line x1="0"   y1="210" x2="390" y2="210" stroke="#152030" strokeWidth="2.5" />
      <line x1="0"   y1="290" x2="390" y2="290" stroke="#152030" strokeWidth="2.5" />
      <line x1="0"   y1="415" x2="390" y2="415" stroke="#152030" strokeWidth="2.5" />

      <line x1="20"  y1="0" x2="20"  y2="480" stroke="#152030" strokeWidth="2.5" />
      <line x1="110" y1="0" x2="110" y2="480" stroke="#152030" strokeWidth="2.5" />
      <line x1="200" y1="0" x2="200" y2="480" stroke="#152030" strokeWidth="2.5" />
      <line x1="280" y1="0" x2="280" y2="480" stroke="#152030" strokeWidth="2.5" />
      <line x1="355" y1="0" x2="355" y2="480" stroke="#152030" strokeWidth="2.5" />

      {/* ─── DIAGONAL / CURVED ROADS (adds realism) ─── */}
      <path d="M0 380 Q60 355 120 365 Q180 375 240 345 Q300 315 390 330"
        stroke="#152030" strokeWidth="3" fill="none" />
      <path d="M150 0 Q175 50 200 98"
        stroke="#172030" strokeWidth="4" fill="none" />

      {/* ─── ROUNDABOUT ─── */}
      <circle cx="157" cy="172" r="12" fill="#192538" stroke="#1D2E44" strokeWidth="2" />
      <circle cx="157" cy="172" r="7" fill="#0E1621" />
      <circle cx="157" cy="172" r="4" fill="#1A2840" />

      {/* ─── POI MARKERS (small buildings of interest) ─── */}
      {/* Shopping */}
      <rect x="86" y="112" width="14" height="14" rx="2" fill="#1E3050" />
      <text x="93" y="123" textAnchor="middle" fontSize="8" fill="#4A7BB5">🛍</text>
      {/* Hospital */}
      <rect x="181" y="72" width="14" height="14" rx="2" fill="#1E3540" />
      <text x="188" y="83" textAnchor="middle" fontSize="8" fill="#4AB592">+</text>
      {/* Park */}
      <text x="50"  y="88"  textAnchor="middle" fontSize="9" fill="#2A5C35" opacity="0.8">🌿</text>
      <text x="280" y="185" textAnchor="middle" fontSize="9" fill="#2A5C35" opacity="0.8">🌿</text>

      {/* ─── ROAD LABELS ─── */}
      <text x="195" y="96"  textAnchor="middle" fontSize="7.5" fill="#2A4060" letterSpacing="0.5" transform="rotate(0,195,96)">MG ROAD</text>
      <text x="40"  y="168" textAnchor="middle" fontSize="6.5" fill="#243550">RESIDENCY RD</text>
      <text x="305" y="248" textAnchor="middle" fontSize="6.5" fill="#243550">BRIGADE ROAD</text>

      {/* ─── ANIMATED ROUTE PATH ─── */}
      {/* Glow shadow */}
      <motion.path
        d="M 60 400 Q 80 370 110 345 Q 140 320 157 290 Q 157 250 157 210 Q 157 170 200 148 Q 230 132 270 120"
        fill="none" stroke="#00D8FF" strokeWidth="8" strokeLinecap="round" opacity="0.15"
        style={{ filter: 'blur(6px)' }}
      />
      {/* Main route */}
      <motion.path
        d="M 60 400 Q 80 370 110 345 Q 140 320 157 290 Q 157 250 157 210 Q 157 170 200 148 Q 230 132 270 120"
        fill="none" stroke="url(#routeGrad)" strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray="10 6"
        initial={{ strokeDashoffset: 900 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* ─── PICKUP MARKER ─── */}
      {/* Pulse ring */}
      <motion.circle cx="60" cy="400" r="18" fill="#00D8FF" fillOpacity="0"
        stroke="#00D8FF" strokeWidth="1.5"
        animate={{ r: [14, 22, 14], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="60" cy="400" r="12" fill="url(#pickupGlow)" />
      {/* Marker pin */}
      <path d="M 60 388 C 56 388 52 392 52 396 C 52 403 60 412 60 412 C 60 412 68 403 68 396 C 68 392 64 388 60 388 Z"
        fill="#00D8FF" stroke="#080C14" strokeWidth="1.5" />
      <circle cx="60" cy="396" r="3.5" fill="#080C14" />

      {/* ─── DESTINATION MARKER ─── */}
      <motion.circle cx="270" cy="120" r="18" fill="#6366F1" fillOpacity="0"
        stroke="#6366F1" strokeWidth="1.5"
        animate={{ r: [14, 22, 14], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />
      <circle cx="270" cy="120" r="12" fill="url(#destGlow)" />
      <path d="M 270 108 C 266 108 262 112 262 116 C 262 123 270 132 270 132 C 270 132 278 123 278 116 C 278 112 274 108 270 108 Z"
        fill="#6366F1" stroke="#080C14" strokeWidth="1.5" />
      <circle cx="270" cy="116" r="3.5" fill="#080C14" />

      {/* ─── DRIVER MARKER (animated moving cab) ─── */}
      <motion.g
        animate={{ x: [0, 30, 60, 90, 120], y: [0, -20, -50, -80, -100] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="60" cy="400" r="8" fill="#0F1C2E" stroke="#00D8FF" strokeWidth="1.5" />
        <text x="60" y="404" textAnchor="middle" fontSize="9">🚗</text>
      </motion.g>

      {/* ─── COMPASS ROSE ─── */}
      <g transform="translate(356, 56)">
        <circle cx="0" cy="0" r="16" fill="rgba(15,22,35,0.85)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <text x="0" y="-7"  textAnchor="middle" fontSize="7" fill="#00D8FF" fontWeight="bold">N</text>
        <text x="0" y="12"  textAnchor="middle" fontSize="6" fill="#4B5563">S</text>
        <text x="-9" y="3"  textAnchor="middle" fontSize="6" fill="#4B5563">W</text>
        <text x="9"  y="3"  textAnchor="middle" fontSize="6" fill="#4B5563">E</text>
        <polygon points="0,-5 1.5,0 0,2 -1.5,0" fill="#00D8FF" />
        <polygon points="0,5 1.5,0 0,-2 -1.5,0" fill="#374151" />
      </g>

      {/* ─── SCALE BAR ─── */}
      <g transform="translate(20, 460)">
        <rect x="0" y="0" width="60" height="3" fill="#243550" rx="1" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#243550" strokeWidth="1.5" />
        <line x1="60" y1="0" x2="60" y2="6" stroke="#243550" strokeWidth="1.5" />
        <text x="30" y="14" textAnchor="middle" fontSize="7" fill="#374151">1 km</text>
      </g>
    </svg>

    {/* Top gradient fade */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '130px', background: 'linear-gradient(to bottom, #0E1621 0%, transparent 100%)', pointerEvents: 'none' }} />
    {/* Bottom gradient fade */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, #080C14 0%, transparent 100%)', pointerEvents: 'none' }} />
  </div>
);

export default MapPlaceholder;
