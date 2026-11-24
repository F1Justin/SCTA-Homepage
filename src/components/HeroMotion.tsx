'use client';

import { useEffect } from 'react';

export default function HeroMotion() {
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      hero.classList.toggle('hero-offscreen', !entry.isIntersecting);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return null;
}
