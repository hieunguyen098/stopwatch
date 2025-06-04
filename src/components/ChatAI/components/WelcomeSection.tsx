import React from "react";
import * as motion from "motion/react-client";

interface WelcomeSectionProps {
  welcomeText: string;
  welcomeDescription: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  welcomeText,
  welcomeDescription,
}) => {
  return (
    <motion.div
      className="text-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.h2
        className="text-4xl font-bold font-serif text-white bg-clip-text mb-4 tracking-wide"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          type: "spring",
          stiffness: 200,
        }}
      >
        {welcomeText.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5 + index * 0.05,
              type: "spring",
              stiffness: 200,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h2>
      <motion.p
        className="text-base text-pink-600 mt-4 mb-6 font-medium leading-relaxed max-w-4xl mx-auto"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.2,
          type: "spring",
          stiffness: 100,
        }}
      >
        {welcomeDescription.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: 1.4 + index * 0.03,
              type: "spring",
              stiffness: 200,
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.p>
    </motion.div>
  );
};
