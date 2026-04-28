// components/ui/GloryItems.tsx
// Figma: Scannable Design System — node 3450:9507 (Glory Items)
// Border: solid #ff4ccf (confirmed from Figma — not a gradient).
// Star icon: raster asset in Figma; approximated here as a 4-pointed sparkle SVG.
// All other values reference design-tokens.

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
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// SparkleStarIcon — 24px 4-pointed sparkle star
// The fill is a raster gradient in Figma; approximated with a CSS linear-gradient
// applied via an SVG foreignObject fill is not supported, so we use a radial/linear
// gradient defs approach inside the SVG itself.
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
        <linearGradient id="glory-star-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#a855f7" />  {/* purple */}
          <stop offset="50%"  stopColor="#ff4ccf" />  {/* pink */}
          <stop offset="100%" stopColor="#ccff00" />  {/* lime */}
        </linearGradient>
      </defs>
      {/* 4-pointed sparkle — two overlapping rhombi */}
      <path
        d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
        fill="url(#glory-star-grad)"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// GloryItem
// ---------------------------------------------------------------------------
export function GloryItem({
  type = "button",
  label = "How to Add Items",
  onClick,
  style,
}: GloryItemProps) {
  const isButton = type === "button";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           tokens.spacing[1],          // 4px
        borderRadius:  "27px",
        background:    tokens.color.base.white,
        border:        `${isButton ? "3px" : "2px"} solid #ff4ccf`,  // solid pink — confirmed Figma
        paddingLeft:   isButton ? tokens.spacing[4]    : tokens.spacing[2],    // 16px / 8px
        paddingRight:  isButton ? tokens.spacing[4]    : tokens.spacing[2],
        paddingTop:    isButton ? tokens.spacing[2]    : tokens.spacing[0.5],  // 8px / 2px
        paddingBottom: isButton ? tokens.spacing[2]    : tokens.spacing[0.5],
        cursor:        onClick ? "pointer" : "default",
        boxSizing:     "border-box" as const,
        ...style,
      }}
    >
      <SparkleStarIcon />
      {label && (
        <span
          style={{
            fontFamily:  tokens.fontFamily.sans,
            fontSize:    tokens.fontSize.body,       // 14px
            fontWeight:  tokens.fontWeight.medium,   // 500
            lineHeight:  tokens.lineHeight.body,     // 20px
            color:       tokens.color.fg.primary,    // #111827
            whiteSpace:  "nowrap",
            userSelect:  "none",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default GloryItem;
