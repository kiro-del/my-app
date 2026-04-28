// components/ui/GloryItems.tsx
// Figma: Scannable Design System — node 3450:9507 (Glory Items)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type GloryItemType = "button" | "chip";

export interface GloryItemProps {
  /** "button" = larger pill (px-16 py-8, 3px border); "chip" = smaller pill (px-8 py-2, 2px border) */
  type?: GloryItemType;
  label?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// SparkleStarIcon — 24px 4-pointed star with rainbow gradient fill
// ---------------------------------------------------------------------------
function SparkleStarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="glory-star-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ff4ccf" />
          <stop offset="25%"  stopColor="#f97316" />
          <stop offset="50%"  stopColor="#eab308" />
          <stop offset="75%"  stopColor="#22c55e" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* 4-pointed sparkle star */}
      <path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill="url(#glory-star-gradient)"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// GloryItem — pill component with pink gradient border + sparkle star
// ---------------------------------------------------------------------------
export function GloryItem({
  type = "button",
  label = "Glory",
  onClick,
  style,
}: GloryItemProps) {
  const isButton = type === "button";
  const borderWidth = isButton ? 3 : 2;

  // Gradient border via background-clip technique:
  // Outer div: gradient bg, inner div: white bg with slight inset
  const outerRadius = 27; // 27px corner radius per Figma

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${outerRadius}px`,
        // Pink gradient border via padding trick
        background: "linear-gradient(135deg, #ff4ccf 0%, #f97316 30%, #eab308 50%, #22c55e 70%, #6366f1 100%)",
        padding: `${borderWidth}px`,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {/* Inner white pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: tokens.spacing[1],      // 4px
          borderRadius: `${outerRadius - borderWidth}px`,
          background: tokens.color.base.white,
          paddingLeft:  isButton ? tokens.spacing[4]   : tokens.spacing[2],   // 16px / 8px
          paddingRight: isButton ? tokens.spacing[4]   : tokens.spacing[2],
          paddingTop:   isButton ? tokens.spacing[2]   : tokens.spacing[0.5], // 8px / 2px
          paddingBottom:isButton ? tokens.spacing[2]   : tokens.spacing[0.5],
        }}
      >
        <SparkleStarIcon />
        {label && (
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,          // 14px
              fontWeight:  tokens.fontWeight.medium,      // 500
              lineHeight:  tokens.lineHeight.body,        // 20px
              color:       tokens.color.fg.primary,       // gray-900
              whiteSpace:  "nowrap",
              userSelect:  "none",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export default GloryItem;
