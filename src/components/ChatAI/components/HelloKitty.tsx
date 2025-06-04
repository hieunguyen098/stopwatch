import React from "react";

interface HelloKittyProps {
  className?: string;
}

export const HelloKitty: React.FC<HelloKittyProps> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
  >
    {/* Face */}
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="white"
      stroke="#ffb6c1"
      strokeWidth="2"
    />
    {/* Left Ear */}
    <circle
      cx="20"
      cy="30"
      r="15"
      fill="white"
      stroke="#ffb6c1"
      strokeWidth="2"
    />
    {/* Right Ear */}
    <circle
      cx="80"
      cy="30"
      r="15"
      fill="white"
      stroke="#ffb6c1"
      strokeWidth="2"
    />
    {/* Left Eye */}
    <ellipse cx="35" cy="45" rx="5" ry="7" fill="black" />
    {/* Right Eye */}
    <ellipse cx="65" cy="45" rx="5" ry="7" fill="black" />
    {/* Nose */}
    <ellipse cx="50" cy="55" rx="3" ry="2" fill="#ffb6c1" />
    {/* Whiskers */}
    <line x1="25" y1="55" x2="10" y2="50" stroke="#ffb6c1" strokeWidth="2" />
    <line x1="25" y1="60" x2="10" y2="60" stroke="#ffb6c1" strokeWidth="2" />
    <line x1="75" y1="55" x2="90" y2="50" stroke="#ffb6c1" strokeWidth="2" />
    <line x1="75" y1="60" x2="90" y2="60" stroke="#ffb6c1" strokeWidth="2" />
    {/* Bow */}
    <path
      d="M50 25 Q60 15 70 25 Q80 35 70 45 Q60 55 50 45 Q40 55 30 45 Q20 35 30 25 Q40 15 50 25"
      fill="#ff69b4"
      stroke="#ff1493"
      strokeWidth="1"
    />
  </svg>
);
