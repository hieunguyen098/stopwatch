import React from "react";
import * as motion from "motion/react-client";

export const BackgroundElements: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0c27.614 0 50 22.386 50 50s-22.386 50-50 50S0 77.614 0 50 22.386 0 50 0zm0 10c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zm0 20c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20z' fill='%23ffb6c1' fill-opacity='0.2'/%3E%3C/svg%3E")`,
        backgroundSize: "100px 100px",
      }}
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          >
            <span className="text-3xl">
              {i % 3 === 0 ? "🎀" : i % 3 === 1 ? "🌸" : "⭐"}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
