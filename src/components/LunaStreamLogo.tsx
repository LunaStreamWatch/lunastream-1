import React from 'react';

export const LunaStreamLogo = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f472b6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect 
      className="logo-bg" 
      width="18" 
      height="18" 
      x="3" 
      y="3" 
      fill="url(#logoGradient)" 
      rx="2" 
      style={{
        transformOrigin: 'center',
        animation: 'fill-in 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards'
      }}
    />
    <path
      className="logo-lines"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 3v18M17 3v18M3 7.5h4M17 7.5h4M3 12h18M3 16.5h4M17 16.5h4"
      style={{
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        animation: 'draw-lines 1s ease-in-out 0.4s forwards'
      }}
    />
  </svg>
);