"use client";

import React, { useCallback, useRef } from "react";

export function useTilt(active: boolean = true) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active || !ref.current) return;
      
      const card = ref.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [active]
  );

  const handleMouseLeave = useCallback(() => {
    if (!active || !ref.current) return;
    const card = ref.current;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }, [active]);

  return { ref, handleMouseMove, handleMouseLeave };
}

export function GlassCard({ children, className = "", tilt = true }: { children: React.ReactNode, className?: string, tilt?: boolean }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt(tilt);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative z-10 w-full h-full transform-gpu" style={{ transform: 'translateZ(30px)' }}>
        {children}
      </div>
    </div>
  );
}
