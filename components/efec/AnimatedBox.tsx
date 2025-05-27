// components/SplitTextAnimation.js
'use client';

import React from 'react';
import { useTrail, animated } from '@react-spring/web';

const SplitTextAnimation = ({
  text = "Texto Animado",
  delay = 0,
  initialConfig = {},
  trailConfig = {},
  // Nueva prop para las clases de Tailwind
  textClassName = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
}) => {
  const characters = text.split('');

  const trail = useTrail(characters.length, {
    config: { mass: 16, tension: 2000, friction: 200, ...trailConfig },
    from: { opacity: 0, y: 50, transform: 'scale(20)', ...initialConfig },
    to: { opacity: 1, y: 0, transform: 'scale(1.5)' },
    delay: delay,
  });

  return (
    <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
      {trail.map((props, index) => (
        <animated.span
          key={index}
          style={{
            ...props,
            display: 'inline-block',
            marginRight: '0.2em'
          }}
          // Aplicamos las clases de Tailwind aquí
          // También puedes añadir clases fijas como el tamaño de fuente y el peso
          className={`
            text-4xl sm:text-5xl md:text-6xl font-extrabold
            ${textClassName}
          `}
        >
          {characters[index] === ' ' ? '\u00A0' : characters[index]}
        </animated.span>
      ))}
    </div>
  );
};

export default SplitTextAnimation;