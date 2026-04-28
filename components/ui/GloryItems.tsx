// components/ui/GloryItems.tsx
// Figma: Scannable Design System — node 3450:9507 (Glory Items)
//
// Border: "divider/gradient dark" — linear gradient
//   #FF4CCF 6% → #2C2258 51% (hard stop) → #CCFF00 95%
//   Implemented via nested-div padding trick (most reliable cross-browser approach).
//   background-clip shorthand is not reliable in React inline styles.
//
// Star icon: raster gradient asset in Figma (nodes 3246:2455 / 3246:2449).
//   Approximated as SVG with same gradient fill as the border.

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
// Gradient — divider/gradient dark
// Stops confirmed from Figma design panel screenshot
// ---------------------------------------------------------------------------
const GRADIENT = "linear-gradient(135deg, #FF4CCF 6%, #2C2258 51%, #2C2258 51%, #CCFF00 95%)";

// ---------------------------------------------------------------------------
// SparkleStarIcon — 24px 4-pointed sparkle
// Gradient fill matches divider/gradient dark border
// ---------------------------------------------------------------------------
function SparkleStarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, display: "block" }}
    >
      <defs>
        <linearGradient id="star-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="6%"  stopColor="#FF4CCF" />
          <stop offset="51%" stopColor="#2C2258" />
          <stop offset="51%" stopColor="#2C2258" />
          <stop offset="95%" stopColor="#CCFF00" />
        </linearGradient>
      </defs>
      {/* 4-pointed sparkle — vertical + horizontal rhombi */}
      <path
        d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
        fill="url(#star-grad)"
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
  const isButton   = type === "button";
  const borderWidth = isButton ? 3 : 2;   // px
  const outerRadius = 27;
  const innerRadius = outerRadius - borderWidth;

  return (
    // Outer div: gradient background, acts as the visible border
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      style={{
        display:        "inline-flex",
        borderRadius:   `${outerRadius}px`,
        background:     GRADIENT,
        padding:        `${borderWidth}px`,
        cursor:         onClick ? "pointer" : "default",
        flexShrink:     0,
        ...style,
      }}
    >
      {/* Inner div: white fill, slightly smaller radius so gradient peeks around edges */}
      <div
        style={{
          display:       "inline-flex",
          alignItems:    "center",
          gap:           tokens.spacing[1],       // 4px
          borderRadius:  `${innerRadius}px`,
          background:    tokens.color.base.white,
          paddingLeft:   isButton ? tokens.spacing[4]    : tokens.spacing[2],    // 16px / 8px
          paddingRight:  isButton ? tokens.spacing[4]    : tokens.spacing[2],
          paddingTop:    isButton ? tokens.spacing[2]    : tokens.spacing[0.5],  // 8px / 2px
          paddingBottom: isButton ? tokens.spacing[2]    : tokens.spacing[0.5],
          userSelect:    "none",
        }}
      >
        <SparkleStarIcon />
        {label && (
          <span
            style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,       // 14px
              fontWeight: tokens.fontWeight.medium,   // 500
              lineHeight: tokens.lineHeight.body,     // 20px
              color:      tokens.color.fg.primary,    // #111827
              whiteSpace: "nowrap",
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
