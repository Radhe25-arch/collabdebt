import { useState, useEffect } from 'react';

/**
 * Custom hook for mouse-based parallax effects.
 * Returns { x, y } coordinates based on mouse position relative to center.
 * @param {number} factor - Sensitivity of the movement (lower = more sensitive)
 */
export default function useParallax(factor = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / factor;
      const y = (e.clientY - innerHeight / 2) / factor;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [factor]);

  return offset;
}
