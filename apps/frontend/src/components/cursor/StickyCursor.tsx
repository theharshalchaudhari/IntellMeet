'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function StickyCursor() {
  const [isHovered, setIsHovered] = useState(false);
  
  const mainSize = 10;
  const trailSize = 28;

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const trailX = useSpring(mouseX, { damping: 25, stiffness: 400, mass: 0.2 });
  const trailY = useSpring(mouseY, { damping: 25, stiffness: 400, mass: 0.2 });

  useEffect(() => {
    const manageMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const target = e.target as Element;
      
      const magneticEl = target.closest('[data-magnetic]');

      if (magneticEl) {
        if (!isHovered) setIsHovered(true);

        const rect = magneticEl.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        const distanceX = clientX - center.x;
        const distanceY = clientY - center.y;

        mouseX.set(center.x + distanceX * 0.15);
        mouseY.set(center.y + distanceY * 0.15);
        
      } else {
        if (isHovered) setIsHovered(false);

        mouseX.set(clientX);
        mouseY.set(clientY);
      }
    };

    window.addEventListener("mousemove", manageMouseMove);
    return () => window.removeEventListener("mousemove", manageMouseMove);
  }, [isHovered, mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="cursor-trail"
        animate={{
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0.3 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          left: trailX,
          top: trailY,
          x: "-50%",
          y: "-50%",
          width: trailSize,
          height: trailSize,
        }}
      />

      <motion.div
        className="cursor-main"
        animate={{
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0.3 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          width: mainSize,
          height: mainSize,
        }}
      />
    </>
  );
}