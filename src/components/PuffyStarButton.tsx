import React from 'react';

export interface PuffyStarButtonProps {
  children?: React.ReactNode;
  variant?: 'orange' | 'navy' | 'green' | 'pink' | 'yellow' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
  isStarShape?: boolean; // If true, renders the iconic puffy 5-point star polygon container
  className?: string;
  badge?: string | number;
  glow?: boolean;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export default function PuffyStarButton({
  children,
  variant = 'orange',
  size = 'md',
  isStarShape = false,
  className = '',
  badge,
  glow = false,
  id,
  type = 'button',
  onClick,
  title,
  disabled,
  'aria-label': ariaLabel,
}: PuffyStarButtonProps) {


  // Theme color maps with puffy bottom borders and rich 3D tactile depth
  const variantStyles = {
    orange: 'bg-[#E07A5F] text-white border-[#C8664C] hover:bg-[#E7866C] active:bg-[#B8573D] shadow-[0_4px_0_#A44930]',
    navy: 'bg-[#1B263B] text-white border-[#111A29] hover:bg-[#253550] active:bg-[#0D1420] shadow-[0_4px_0_#0D1420]',
    green: 'bg-[#2D6A4F] text-white border-[#214E3A] hover:bg-[#387F60] active:bg-[#1A3D2D] shadow-[0_4px_0_#173628]',
    pink: 'bg-[#D4A5A5] text-[#4A2020] border-[#C28C8C] hover:bg-[#E0B5B5] active:bg-[#B37B7B] shadow-[0_4px_0_#A86E6E]',
    yellow: 'bg-[#F4C542] text-[#5A3E00] border-[#DEAB2B] hover:bg-[#F8D264] active:bg-[#C99619] shadow-[0_4px_0_#B88307]',
    white: 'bg-white text-[#1B263B] border-[#E5E3DB] hover:bg-[#FAF9F6] active:bg-[#F0EEE6] shadow-[0_4px_0_#D5D2C8]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-2xl gap-1.5',
    md: 'px-4 py-2 text-sm rounded-2xl gap-2',
    lg: 'px-5 py-3 text-base rounded-2xl gap-2.5',
    'icon-sm': 'w-8 h-8 rounded-full p-0 flex items-center justify-center',
    icon: 'w-10 h-10 rounded-full p-0 flex items-center justify-center',
    'icon-lg': 'w-13 h-13 rounded-full p-0 flex items-center justify-center',
  };

  if (isStarShape) {
    // Render an authentic puffy 5-point star SVG wrapper with 3D drop depth and gloss highlight
    const starFillColors = {
      orange: '#E07A5F',
      navy: '#1B263B',
      green: '#2D6A4F',
      pink: '#D4A5A5',
      yellow: '#F4C542',
      white: '#FFFFFF',
    };

    const starShadowColors = {
      orange: '#B8573D',
      navy: '#0D1420',
      green: '#1A3D2D',
      pink: '#A86E6E',
      yellow: '#C99619',
      white: '#D5D2C8',
    };

    const starTextColors = {
      orange: 'text-white',
      navy: 'text-white',
      green: 'text-white',
      pink: 'text-[#4A2020]',
      yellow: 'text-[#5A3E00]',
      white: 'text-[#1B263B]',
    };

    const starDimensions = {
      sm: 'w-9 h-9',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      'icon-sm': 'w-9 h-9',
      icon: 'w-12 h-12',
      'icon-lg': 'w-16 h-16',
    };

    return (
      <button
        id={id}
        type={type}
        onClick={onClick}
        title={title}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`relative inline-flex items-center justify-center select-none cursor-pointer transition-all duration-150 transform hover:scale-110 hover:-translate-y-0.5 active:scale-95 active:translate-y-1 focus:outline-hidden ${starDimensions[size]} ${className}`}
      >
        {/* SVG Puffy Star Background with plump chubby curves & shiny highlight */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible pointer-events-none"
        >
          {/* Puffy 3D shadow layer underneath */}
          <path
            d="M 50 4 
               C 56 22, 63 29, 81 33 
               C 66 45, 63 56, 70 76 
               C 53 66, 47 66, 30 76 
               C 37 56, 34 45, 19 33 
               C 37 29, 44 22, 50 4 Z"
            fill={starShadowColors[variant]}
            transform="translate(0, 5)"
          />
          {/* Main Plump / Chubby Puffy Star Body */}
          <path
            d="M 50 4 
               C 56 22, 63 29, 81 33 
               C 66 45, 63 56, 70 76 
               C 53 66, 47 66, 30 76 
               C 37 56, 34 45, 19 33 
               C 37 29, 44 22, 50 4 Z"
            fill={starFillColors[variant]}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Puffy Gloss Highlight Dot */}
          <ellipse
            cx="42"
            cy="28"
            rx="7"
            ry="4"
            fill="white"
            opacity="0.55"
            transform="rotate(-20 42 28)"
          />
          <circle cx="58" cy="38" r="2.5" fill="white" opacity="0.45" />
        </svg>

        {/* Content Centered inside the Puffy Star */}
        <span
          className={`relative z-10 font-bold flex items-center justify-center ${starTextColors[variant]} ${
            size === 'sm' || size === 'icon-sm' ? 'text-xs' : size === 'lg' || size === 'icon-lg' ? 'text-base' : 'text-sm'
          }`}
        >
          {children}
        </span>

        {/* Optional Badge */}
        {badge !== undefined && (
          <span className="absolute -top-1 -right-1 z-20 px-1.5 py-0.5 text-[9px] font-bold bg-[#E07A5F] text-white rounded-full border border-white shadow-xs animate-bounce">
            {badge}
          </span>
        )}
      </button>
    );
  }

  // Otherwise, render a Puffy Pill Button with puffy star corners, 3D bottom depth and cute bounce
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center font-bold tracking-tight select-none cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none border ${variantStyles[variant]} ${sizeStyles[size]} ${
        glow ? 'ring-2 ring-offset-2 ring-[#F4C542]/70' : ''
      } ${className}`}
    >

      {/* Subtle Puffy Star decorative icon prefix if button has text */}
      {size !== 'icon' && size !== 'icon-sm' && size !== 'icon-lg' && (
        <span className="text-[12px] opacity-90 leading-none">⋆</span>
      )}
      {children}
      {size !== 'icon' && size !== 'icon-sm' && size !== 'icon-lg' && (
        <span className="text-[12px] opacity-90 leading-none">⋆</span>
      )}
      {badge !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-white/25 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
