import React from "react";
import * as motion from "motion/react-client";

export const HelloKittyIcon: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1.5 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="flex flex-col items-center mb-8"
    >
      {/* Hello Kitty Face */}
      <motion.div
        animate={{
          rotate: [0, -3, 3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Main Head */}
        <div className="relative bg-white w-24 h-20 rounded-full border-4 border-pink-300 shadow-lg">
          {/* Ears */}
          <div className="absolute -top-3 left-2 w-6 h-8 bg-white border-2 border-pink-300 rounded-full transform -rotate-12"></div>
          <div className="absolute -top-3 right-2 w-6 h-8 bg-white border-2 border-pink-300 rounded-full transform rotate-12"></div>

          {/* Inner Ears */}
          <div className="absolute -top-1 left-3 w-3 h-4 bg-pink-200 rounded-full transform -rotate-12"></div>
          <div className="absolute -top-1 right-3 w-3 h-4 bg-pink-200 rounded-full transform rotate-12"></div>

          {/* Eyes */}
          <motion.div
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-6 left-4 w-2 h-2 bg-black rounded-full"
          ></motion.div>
          <motion.div
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
            className="absolute top-6 right-4 w-2 h-2 bg-black rounded-full"
          ></motion.div>

          {/* Nose */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full"></div>

          {/* Mouth */}
          <div className="absolute top-9 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-1 border-b-2 border-black rounded-full"></div>
          </div>

          {/* Whiskers */}
          <div className="absolute top-7 left-1 w-4 h-0.5 bg-black rounded-full transform -rotate-12"></div>
          <div className="absolute top-9 left-0 w-5 h-0.5 bg-black rounded-full transform rotate-6"></div>
          <div className="absolute top-7 right-1 w-4 h-0.5 bg-black rounded-full transform rotate-12"></div>
          <div className="absolute top-9 right-0 w-5 h-0.5 bg-black rounded-full transform -rotate-6"></div>

          {/* Bow */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 translate-x-3"
          >
            <div className="relative">
              {/* Bow Base */}
              <div className="w-6 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg shadow-md"></div>
              {/* Bow Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-3 bg-pink-600 rounded-sm"></div>
              {/* Bow Shine */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-pink-200 rounded-full"></div>
            </div>
          </motion.div>
        </div>

        {/* Floating Hearts */}
        <motion.div
          animate={{
            y: [-10, -20, -10],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-8 -left-6 text-pink-400 text-sm"
        >
          💖
        </motion.div>
        <motion.div
          animate={{
            y: [-15, -25, -15],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -top-6 -right-8 text-pink-300 text-xs"
        >
          💕
        </motion.div>
      </motion.div>

      {/* Hello Kitty Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-4 text-center"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Hello Kitty Chat
        </h1>
      </motion.div>
    </motion.div>
  );
};
