'use client';

import { domAnimation, LazyMotion, m } from 'framer-motion';
import type { ReactNode } from 'react';

export const MotionDiv = m.div;
export const MotionHeading = m.h1;
export const MotionLink = m.a;
export const MotionButton = m.button;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
