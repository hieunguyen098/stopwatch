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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "spring",
          stiffness: 120,
        }}
      >
        {welcomeText}
      </motion.h2>
      <motion.p
        className="text-base text-pink-600 mt-4 mb-6 font-medium leading-relaxed max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.4,
          ease: "easeOut",
        }}
      >
        {welcomeDescription}
      </motion.p>
    </motion.div>
  );
};
