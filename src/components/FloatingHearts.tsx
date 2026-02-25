import React from "react";
import { motion } from "framer-motion";

const FloatingHearts: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  if (!enabled) return null;

  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    size: 10 + Math.random() * 20,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-accent"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            bottom: -30,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, heart.opacity, heart.opacity, 0],
            rotate: [0, Math.random() > 0.5 ? 20 : -20, 0],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
