import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden font-rajdhani uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 px-4 py-2 border";
  
  const variants = {
    primary: "bg-cyan-950/30 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]",
    secondary: "bg-purple-950/30 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]",
    danger: "bg-red-950/30 border-red-500 text-red-400 hover:bg-red-500 hover:text-black hover:shadow-[0_0_15px_rgba(239,68,68,0.6)]",
    ghost: "border-transparent text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed clip-path-slant`}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};
