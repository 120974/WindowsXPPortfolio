import { useEffect, useState } from 'react';

interface GlitchTransitionProps {
  onComplete: () => void;
}

export default function GlitchTransition({ onComplete }: GlitchTransitionProps) {
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    const phases = [
      { duration: 500, phase: 1 },  // Initial glitch
      { duration: 300, phase: 2 },  // Intensify
      { duration: 400, phase: 3 },  // Color corruption
      { duration: 300, phase: 4 },  // Static
      { duration: 200, phase: 5 },  // Final glitch
    ];

    let currentPhase = 0;
    const nextPhase = () => {
      if (currentPhase < phases.length) {
        setGlitchPhase(phases[currentPhase].phase);
        setTimeout(() => {
          currentPhase++;
          if (currentPhase >= phases.length) {
            onComplete();
          } else {
            nextPhase();
          }
        }, phases[currentPhase].duration);
      }
    };

    nextPhase();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      {/* Base glitch overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-100 ${
          glitchPhase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(255, 0, 0, 0.03) 1px,
              rgba(255, 0, 0, 0.03) 2px,
              transparent 3px,
              transparent 6px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(0, 255, 0, 0.03) 1px,
              rgba(0, 255, 0, 0.03) 2px,
              transparent 3px,
              transparent 6px
            )
          `,
          animation: 'glitchShake 0.1s infinite'
        }}
      />

      {/* Scanlines */}
      <div 
        className={`absolute inset-0 transition-opacity duration-100 ${
          glitchPhase >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(0, 0, 0, 0.1) 1px,
              rgba(0, 0, 0, 0.1) 2px,
              transparent 3px
            )
          `,
          animation: 'scanlines 0.2s infinite'
        }}
      />

      {/* Color corruption */}
      <div 
        className={`absolute inset-0 transition-opacity duration-100 ${
          glitchPhase >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            radial-gradient(ellipse at center, 
              rgba(255, 0, 255, 0.1) 0%, 
              rgba(0, 255, 255, 0.1) 25%, 
              rgba(255, 255, 0, 0.1) 50%, 
              transparent 75%
            )
          `,
          animation: 'colorShift 0.15s infinite'
        }}
      />

      {/* Digital noise */}
      <div 
        className={`absolute inset-0 transition-opacity duration-100 ${
          glitchPhase >= 4 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")
          `,
          animation: 'digitalNoise 0.1s infinite'
        }}
      />

      {/* Chromatic aberration strips */}
      <div 
        className={`absolute inset-0 transition-opacity duration-100 ${
          glitchPhase >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `
            linear-gradient(90deg, 
              rgba(255, 0, 0, 0.1) 0%, 
              transparent 2%, 
              transparent 98%, 
              rgba(0, 0, 255, 0.1) 100%
            )
          `,
          animation: 'chromaticShift 0.2s infinite'
        }}
      />

      {/* Final black fade */}
      <div 
        className={`absolute inset-0 transition-opacity duration-100 ${
          glitchPhase >= 5 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          animation: 'blackFade 0.2s ease-out'
        }}
      />

      {/* Glitch text overlay */}
      {glitchPhase >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="text-6xl font-mono text-red-500"
            style={{
              textShadow: `
                2px 0 #00ffff,
                -2px 0 #ff00ff,
                0 2px #ffff00,
                0 -2px #ff0000
              `,
              animation: 'glitchText 0.1s infinite'
            }}
          >
            ERROR_404_REALITY_NOT_FOUND
          </div>
        </div>
      )}
    </div>
  );
}