// Not currently in use

import { useState, useEffect } from 'react';

export function useElementPosition(elementRef: React.RefObject<HTMLElement>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
      }
    };

    // sets the initial position
    updatePosition();

    window.addEventListener('resize', updatePosition);

    return () => window.removeEventListener('resize', updatePosition);
  }, [elementRef]);

  return position;
}
