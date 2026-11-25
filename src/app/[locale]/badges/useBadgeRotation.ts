'use client';

import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

export function useBadgeRotation() {
  const target = useMotionValue(0);
  const spring = useSpring(target, { stiffness: 300, damping: 30, mass: 1.2 });
  const reduceMotion = useReducedMotion();
  const stage = useRef<HTMLElement>(null);
  const drag = useRef<{ id: number; x: number; angle: number; bounds: DOMRect } | null>(null);
  const [angle, setAngle] = useState(0);

  function commitAngle() {
    setAngle(((Math.round(target.get()) % 360) + 360) % 360);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || !stage.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, angle: target.get(), bounds: stage.current.getBoundingClientRect() };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const origin = drag.current;
    if (origin?.id !== event.pointerId) return;

    target.set(origin.angle + (event.clientX - origin.x) * 0.5);
    const { left, top, width, height } = origin.bounds;
    event.currentTarget.style.setProperty('--shine-x', `${(event.clientX - left) * 100 / width}%`);
    event.currentTarget.style.setProperty('--shine-y', `${(event.clientY - top) * 100 / height}%`);
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    commitAngle();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Home') target.set(0);
    else if (event.key === 'End') target.set(359);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') target.set(target.get() - 15);
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') target.set(target.get() + 15);
    else return;

    event.preventDefault();
    commitAngle();
  }

  return {
    stage,
    rotateY: reduceMotion ? target : spring,
    controls: {
      tabIndex: 0,
      role: 'slider',
      'aria-valuemin': 0,
      'aria-valuemax': 359,
      'aria-valuenow': angle,
      onKeyDown,
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onLostPointerCapture: finishDrag,
    },
  };
}
