import { useEffect, useRef, useState } from 'react';

const FADE_RANGE = 100;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function useStickyHeaderProgress() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        if (wrapperRef.current) {
          const { bottom } = wrapperRef.current.getBoundingClientRect();

          setProgress(clamp01((FADE_RANGE - bottom) / FADE_RANGE));
        }

        ticking = false;
      });
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return {
    wrapperRef,
    progress,
  };
}
