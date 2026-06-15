// components/ui/DashboardStatCard.tsx
// Figma: Scannable Design System — node 2159:1775 (Dashboard item)
// Strip: Manufactures data — node 3343:25930
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DashboardStatCardProps {
  /**
   * Pass a Figma icon URL (from useFigmaIcons) — rendered via CSS mask at
   * brand.darkPurple so the icon reads correctly on the lime bg.
   * Preferred over `icon`.
   */
  iconUrl?:      string;
  /**
   * Fallback React node — use when iconUrl is not yet available or for
   * custom SVG icons. Color your SVG with tokens.color.brand.darkPurple.
   */
  icon?:         React.ReactNode;
  label:         string;
  count:         string | number;
  /** Optional "Create →" style action link / button */
  actionLabel?:  string;
  actionHref?:   string;
  onActionClick?: () => void;
  /** @internal — set by DashboardStatStrip to add right-side divider */
  _showDivider?: boolean;
}

// ---------------------------------------------------------------------------
// DashboardStatCard
// Figma: dark bg (brand.darkPurple #2c2258), pad 16/24/8, gap 16
//   deco icon box: 40×40, lime bg, r=8, 24px icon inside (darkPurple)
//   label:  14px SemiBold white
//   count:  18px Medium white
//   action: 14px Medium fgReverse.support (#9ca3af)
//   divider between cards: 1px solid divider.reverse (#374151)
// ---------------------------------------------------------------------------
export function DashboardStatCard({
  iconUrl,
  icon,
  label,
  count,
  actionLabel,
  actionHref,
  onActionClick,
  _showDivider = false,
}: DashboardStatCardProps) {
  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        padding:       actionLabel
          ? `${tokens.spacing[4]} ${tokens.spacing[6]} ${tokens.spacing[2]}`
          : `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        gap:           tokens.spacing[2],   // 8px between icon-row and action
        background:    tokens.color.brand.darkPurple,   // #2c2258
        borderRight:   _showDivider ? `1px solid ${tokens.color.divider.reverse}` : undefined,
        minWidth:      "160px",
        flex:          1,
        boxSizing:     "border-box" as const,
      }}
    >
      {/* Icon + text row */}
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[4] }}>
        {/* Deco icon box — 40×40, lime bg, r=8 */}
        <div
          style={{
            position:       "relative",
            width:          "40px",
            height:         "40px",
            borderRadius:   tokens.borderRadius.lg,    // 8px
            background:     tokens.color.brand.lime,   // #ccff00
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
          aria-hidden
        >
          {/* 24×24 icon slot — CSS mask for URL icons, raw node for ReactNode */}
          {iconUrl ? (
            <div
              style={{
                width:                  "24px",
                height:                 "24px",
                background:             tokens.color.brand.darkPurple,  // icon fill
                maskImage:              `url(${iconUrl})`,
                maskSize:               "contain",
                maskRepeat:             "no-repeat",
                maskPosition:           "center",
                WebkitMaskImage:        `url(${iconUrl})`,
                WebkitMaskSize:         "contain",
                WebkitMaskRepeat:       "no-repeat",
                WebkitMaskPosition:     "center",
                flexShrink:             0,
              } as React.CSSProperties}
            />
          ) : (
            <span
              style={{
                width:          "24px",
                height:         "24px",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </span>
          )}
        </div>

        {/* Label + count */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,        // 14px
              fontWeight:  tokens.fontWeight.semiBold,  // 600
              lineHeight:  tokens.lineHeight.body,      // 20px
              color:       tokens.color.fgReverse.primary,  // white
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.h4,          // 18px
              fontWeight:  tokens.fontWeight.medium,    // 500
              lineHeight:  tokens.lineHeight.h4,        // 24px
              color:       tokens.color.fgReverse.primary,
            }}
          >
            {typeof count === "number" ? count.toLocaleString() : count}
          </span>
        </div>
      </div>

      {/* Action link */}
      {actionLabel && (
        <a
          href={actionHref ?? "#"}
          onClick={onActionClick ? (e) => { e.preventDefault(); onActionClick(); } : undefined}
          style={{
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,        // 14px
            fontWeight:     tokens.fontWeight.medium,    // 500
            lineHeight:     tokens.lineHeight.body,
            color:          tokens.color.fgReverse.support,  // #9ca3af
            textDecoration: "none",
            cursor:         "pointer",
            display:        "inline-flex",
            alignItems:     "center",
            gap:            tokens.spacing[1],   // 4px
            paddingBottom:  tokens.spacing[2],   // 8px
          }}
        >
          {actionLabel} →
        </a>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DashboardStatStrip — horizontal row of stat cards
// Figma: node 3343:25930
//   bg: brand.darkPurple, rounded-2xl (16px), no gap between cards
//   vertical dividers: 1px solid divider.reverse between each card
// ---------------------------------------------------------------------------
export interface DashboardStatStripProps {
  cards: DashboardStatCardProps[];
}

export function DashboardStatStrip({ cards }: DashboardStatStripProps) {
  return (
    <div
      style={{
        display:        "flex",
        overflowX:      "auto" as const,
        background:     tokens.color.brand.darkPurple,
        borderRadius:   tokens.borderRadius["2xl"],   // 16px
        overflow:       "hidden",
      }}
    >
      {cards.map((card, i) => (
        <DashboardStatCard
          key={i}
          {...card}
          _showDivider={i < cards.length - 1}
        />
      ))}
    </div>
  );
}

export default DashboardStatCard;
