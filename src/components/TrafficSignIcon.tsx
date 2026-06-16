/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface TrafficSignIconProps {
  type: string;
  size?: number | string;
  className?: string;
}

export const TrafficSignIcon: React.FC<TrafficSignIconProps> = ({
  type,
  size = 120,
  className = ""
}) => {
  const width = size;
  const height = size;

  // Render specific content depending on sign SVG type
  const renderSignContent = () => {
    switch (type) {
      case "stop":
        // Octagon shape
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Red Octagon */}
            <polygon
              points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
              fill="#DC2626"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
            {/* White inner border */}
            <polygon
              points="31.5,8 68.5,8 92,31.5 92,68.5 68.5,92 31.5,92 8,68.5 8,31.5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Text Khmer */}
            <text
              x="50"
              y="44"
              fill="#FFFFFF"
              fontSize="15"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="Inter, system-ui-sans"
            >
              ឈប់
            </text>
            {/* Text English */}
            <text
              x="50"
              y="68"
              fill="#FFFFFF"
              fontSize="16"
              fontWeight="900"
              letterSpacing="0.5"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              STOP
            </text>
          </svg>
        );

      case "no_entry":
        // Circle shape
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
            {/* Central white horizontal bar */}
            <rect x="15" y="42" width="70" height="16" fill="#FFFFFF" rx="2" />
          </svg>
        );

      case "no_left_turn":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="8" />
            {/* Black Arrow */}
            <path
              d="M65 65 L65 42 M65 42 L42 42 M42 42 L42 52 M46 42 L33 42 L42 33 L45 42"
              fill="none"
              stroke="#111827"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Left point arrow extra */}
            <polygon points="32,42 45,32 45,52" fill="#111827" />
            {/* Diagonal Red Slash */}
            <line x1="22" y1="22" x2="78" y2="78" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case "no_right_turn":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="8" />
            {/* Black Arrow */}
            <path
              d="M35 65 L35 42 M35 42 L58 42 M58 42 L58 52 M54 42 L67 42 L58 33 L55 42"
              fill="none"
              stroke="#111827"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right point arrow extra */}
            <polygon points="68,42 55,32 55,52" fill="#111827" />
            {/* Diagonal Red Slash */}
            <line x1="78" y1="22" x2="22" y2="78" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case "speed_30":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="8" />
            <text
              x="50"
              y="58"
              fill="#111827"
              fontSize="30"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              30
            </text>
            <text
              x="50"
              y="74"
              fill="#6B7280"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              km/h
            </text>
          </svg>
        );

      case "speed_50":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="8" />
            <text
              x="50"
              y="58"
              fill="#111827"
              fontSize="30"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              50
            </text>
            <text
              x="50"
              y="74"
              fill="#6B7280"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              km/h
            </text>
          </svg>
        );

      case "no_overtaking":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="8" />
            {/* Left car: Black */}
            <g transform="translate(26, 38) scale(0.6)">
              <rect x="5" y="10" width="22" height="15" fill="#111827" rx="4" />
              <rect x="8" y="2" width="16" height="8" fill="#111827" rx="3" />
              <rect x="6" y="25" width="20" height="4" fill="#111827" />
              <circle cx="9" cy="27" r="3" fill="#D1D5DB" />
              <circle cx="23" cy="27" r="3" fill="#D1D5DB" />
            </g>
            {/* Right car: Red */}
            <g transform="translate(46, 34) scale(0.6)">
              <rect x="5" y="10" width="22" height="15" fill="#DC2626" rx="4" />
              <rect x="8" y="2" width="16" height="8" fill="#DC2626" rx="3" />
              <rect x="6" y="25" width="20" height="4" fill="#DC2626" />
              <circle cx="9" cy="27" r="3" fill="#374151" />
              <circle cx="23" cy="27" r="3" fill="#374151" />
            </g>
          </svg>
        );

      case "warning_pedestrian":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Yellow warning triangle */}
            <polygon points="50,6 94,84 6,84" fill="#FBBF24" stroke="#111827" strokeWidth="6" strokeLinejoin="round" />
            {/* Zebra path */}
            <line x1="30" y1="70" x2="70" y2="70" stroke="#111827" strokeWidth="4" />
            <line x1="35" y1="74" x2="65" y2="74" stroke="#111827" strokeWidth="2" />
            {/* Pedestrian icon */}
            <circle cx="50" cy="38" r="4.5" fill="#111827" />
            <path d="M50 43 L50 54 M50 47 L42 44 M50 47 L58 48 M50 54 L44 64 M50 54 L54 64" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case "warning_school":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Yellow warning triangle */}
            <polygon points="50,6 94,84 6,84" fill="#FBBF24" stroke="#111827" strokeWidth="6" strokeLinejoin="round" />
            {/* Vector figures of children */}
            {/* Big child */}
            <g transform="translate(-4, 0)">
              <circle cx="46" cy="38" r="3.5" fill="#111827" />
              <path d="M46 42.5 L46 56 M46 45 L38 48 M46 45 L52 48 M46 56 L41 68 M46 56 L51 68" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Small child */}
            <g transform="translate(10, 6)">
              <circle cx="48" cy="40" r="2.5" fill="#111827" />
              <path d="M48 43 L48 54 M48 45 L42 51 M48 45 L54 48 M48 54 L44 62 M48 54 L51 62" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case "warning_roundabout":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Yellow warning triangle */}
            <polygon points="50,6 94,84 6,84" fill="#FBBF24" stroke="#111827" strokeWidth="6" strokeLinejoin="round" />
            {/* Rotating arrows */}
            <g transform="translate(50, 52) scale(0.7)">
              {/* Arrow 1 */}
              <path d="M-10,-12 A 16,16 0 0,1 14,-6" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="14,-6 5,-13 14,-15" fill="#111827" transform="rotate(22, 14, -6)" />
              {/* Arrow 2 */}
              <path d="M12,10 A 16,16 0 0,1 -12,10" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="-12,10 -15,1 -8,1" fill="#111827" transform="rotate(-40, -12, 10)" />
              {/* Arrow 3 */}
              <path d="M-14,4 A 16,16 0 0,1 -4,-14" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="-4,-14 -11,-18 -7,-9" fill="#111827" transform="rotate(30, -4, -14)" />
            </g>
          </svg>
        );

      case "one_way":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="25" y="10" width="50" height="80" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" rx="4" />
            {/* Thick white arrow pointing up */}
            <line x1="50" y1="78" x2="50" y2="28" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <polygon points="50,18 34,35 66,35" fill="#FFFFFF" />
          </svg>
        );

      case "parking":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="15" y="15" width="70" height="70" fill="#2563EB" stroke="#FFFFFF" strokeWidth="3.5" rx="8" />
            <text
              x="50"
              y="65"
              fill="#FFFFFF"
              fontSize="45"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="sans-serif, Arial"
            >
              P
            </text>
          </svg>
        );

      default:
        // Fallback standard sign info
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="44" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="6" />
            <text
              x="50"
              y="56"
              fill="#3B82F6"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              SIGN
            </text>
          </svg>
        );
    }
  };

  return (
    <div
      id={`svg_sign_container_${type}`}
      style={{ width, height }}
      className={`relative inline-block select-none ${className}`}
    >
      {renderSignContent()}
    </div>
  );
};
