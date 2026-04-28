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
// SparkleStarIcon — exact SVG from Figma node 5767:2484 (star- gradient)
// Paths + gradient inlined directly; no expiring CDN URL needed.
// viewBox 0 0 21 20, rendered at 24×24 with 1px left / 2px top offset preserved.
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
      {/* Offset group matches Figma: left:1px top:2px within 24×24 */}
      <g transform="translate(1, 2)">
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" overflow="visible">
          <g>
            <mask id="glory-star-mask" fill="white">
              <path d="M10.7959 7.29883L17 10L10.7959 12.7012L8.5 20L6.2041 12.7012L0 10L6.2041 7.29883L8.5 0L10.7959 7.29883ZM18.0801 14.2842L21 15.5L18.0801 16.7158L17 20L15.9199 16.7158L13 15.5L15.9199 14.2842L17 11L18.0801 14.2842ZM18.0801 3.28418L21 4.5L18.0801 5.71582L17 9L15.9199 5.71582L13 4.5L15.9199 3.28418L17 0L18.0801 3.28418Z" />
            </mask>
            <path
              d="M10.7959 7.29883L8.88806 7.89895L9.16162 8.76863L9.99752 9.13256L10.7959 7.29883ZM17 10L17.7984 11.8337L22.0101 10L17.7984 8.16626L17 10ZM10.7959 12.7012L9.99752 10.8674L9.16162 11.2314L8.88806 12.101L10.7959 12.7012ZM8.5 20L6.59216 20.6001L8.5 26.6653L10.4078 20.6001L8.5 20ZM6.2041 12.7012L8.11194 12.101L7.83838 11.2314L7.00248 10.8674L6.2041 12.7012ZM0 10L-0.798381 8.16626L-5.01014 10L-0.798381 11.8337L0 10ZM6.2041 7.29883L7.00248 9.13256L7.83838 8.76863L8.11194 7.89895L6.2041 7.29883ZM8.5 0L10.4078 -0.600124L8.5 -6.66528L6.59216 -0.600124L8.5 0ZM18.0801 14.2842L16.1802 14.909L16.4662 15.7786L17.3113 16.1305L18.0801 14.2842ZM21 15.5L21.7688 17.3463L26.203 15.5L21.7688 13.6537L21 15.5ZM18.0801 16.7158L17.3113 14.8695L16.4662 15.2214L16.1802 16.091L18.0801 16.7158ZM17 20L15.1001 20.6248L17 26.4018L18.8999 20.6248L17 20ZM15.9199 16.7158L17.8198 16.091L17.5338 15.2214L16.6887 14.8695L15.9199 16.7158ZM13 15.5L12.2312 13.6537L7.79703 15.5L12.2312 17.3463L13 15.5ZM15.9199 14.2842L16.6887 16.1305L17.5338 15.7786L17.8198 14.909L15.9199 14.2842ZM17 11L18.8999 10.3752L17 4.59819L15.1001 10.3752L17 11ZM18.0801 3.28418L16.1802 3.909L16.4662 4.77862L17.3113 5.13052L18.0801 3.28418ZM21 4.5L21.7688 6.34634L26.203 4.5L21.7688 2.65366L21 4.5ZM18.0801 5.71582L17.3113 3.86948L16.4662 4.22138L16.1802 5.091L18.0801 5.71582ZM17 9L15.1001 9.62482L17 15.4018L18.8999 9.62482L17 9ZM15.9199 5.71582L17.8198 5.091L17.5338 4.22138L16.6887 3.86948L15.9199 5.71582ZM13 4.5L12.2312 2.65366L7.79703 4.5L12.2312 6.34634L13 4.5ZM15.9199 3.28418L16.6887 5.13052L17.5338 4.77862L17.8198 3.909L15.9199 3.28418ZM17 0L18.8999 -0.624824L17 -6.40181L15.1001 -0.624824L17 0ZM10.7959 7.29883L9.99752 9.13256L16.2016 11.8337L17 10L17.7984 8.16626L11.5943 5.46509L10.7959 7.29883ZM17 10L16.2016 8.16626L9.99752 10.8674L10.7959 12.7012L11.5943 14.5349L17.7984 11.8337L17 10ZM10.7959 12.7012L8.88806 12.101L6.59216 19.3999L8.5 20L10.4078 20.6001L12.7037 13.3013L10.7959 12.7012ZM8.5 20L10.4078 19.3999L8.11194 12.101L6.2041 12.7012L4.29626 13.3013L6.59216 20.6001L8.5 20ZM6.2041 12.7012L7.00248 10.8674L0.798381 8.16626L0 10L-0.798381 11.8337L5.40572 14.5349L6.2041 12.7012ZM0 10L0.798381 11.8337L7.00248 9.13256L6.2041 7.29883L5.40572 5.46509L-0.798381 8.16626L0 10ZM6.2041 7.29883L8.11194 7.89895L10.4078 0.600124L8.5 0L6.59216 -0.600124L4.29626 6.6987L6.2041 7.29883ZM8.5 0L6.59216 0.600124L8.88806 7.89895L10.7959 7.29883L12.7037 6.6987L10.4078 -0.600124L8.5 0ZM18.0801 14.2842L17.3113 16.1305L20.2312 17.3463L21 15.5L21.7688 13.6537L18.8489 12.4378L18.0801 14.2842ZM21 15.5L20.2312 13.6537L17.3113 14.8695L18.0801 16.7158L18.8489 18.5622L21.7688 17.3463L21 15.5ZM18.0801 16.7158L16.1802 16.091L15.1001 19.3752L17 20L18.8999 20.6248L19.98 17.3406L18.0801 16.7158ZM17 20L18.8999 19.3752L17.8198 16.091L15.9199 16.7158L14.02 17.3406L15.1001 20.6248L17 20ZM15.9199 16.7158L16.6887 14.8695L13.7688 13.6537L13 15.5L12.2312 17.3463L15.1511 18.5622L15.9199 16.7158ZM13 15.5L13.7688 17.3463L16.6887 16.1305L15.9199 14.2842L15.1511 12.4378L12.2312 13.6537L13 15.5ZM15.9199 14.2842L17.8198 14.909L18.8999 11.6248L17 11L15.1001 10.3752L14.02 13.6594L15.9199 14.2842ZM17 11L15.1001 11.6248L16.1802 14.909L18.0801 14.2842L19.98 13.6594L18.8999 10.3752L17 11ZM18.0801 3.28418L17.3113 5.13052L20.2312 6.34634L21 4.5L21.7688 2.65366L18.8489 1.43784L18.0801 3.28418ZM21 4.5L20.2312 2.65366L17.3113 3.86948L18.0801 5.71582L18.8489 7.56216L21.7688 6.34634L21 4.5ZM18.0801 5.71582L16.1802 5.091L15.1001 8.37518L17 9L18.8999 9.62482L19.98 6.34064L18.0801 5.71582ZM17 9L18.8999 8.37518L17.8198 5.091L15.9199 5.71582L14.02 6.34064L15.1001 9.62482L17 9ZM15.9199 5.71582L16.6887 3.86948L13.7688 2.65366L13 4.5L12.2312 6.34634L15.1511 7.56216L15.9199 5.71582ZM13 4.5L13.7688 6.34634L16.6887 5.13052L15.9199 3.28418L15.1511 1.43784L12.2312 2.65366L13 4.5ZM15.9199 3.28418L17.8198 3.909L18.8999 0.624824L17 0L15.1001 -0.624824L14.02 2.65936L15.9199 3.28418ZM17 0L15.1001 0.624824L16.1802 3.909L18.0801 3.28418L19.98 2.65936L18.8999 -0.624824L17 0Z"
              fill="url(#glory-star-grad)"
              mask="url(#glory-star-mask)"
            />
          </g>
          <defs>
            <linearGradient id="glory-star-grad" x1="0.477272" y1="19.5455" x2="20.0276" y2="-0.385644" gradientUnits="userSpaceOnUse">
              <stop offset="0.06" stopColor="#FF4CCF" />
              <stop offset="0.51" stopColor="#2C2258" />
              <stop offset="0.51" stopColor="#2C2258" />
              <stop offset="0.95" stopColor="#CCFF00" />
            </linearGradient>
          </defs>
        </svg>
      </g>
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
