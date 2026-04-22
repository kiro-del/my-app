// components/ui/DashboardStatCard.tsx
// Figma: Scannable Design System — node 2159:1775 (Dashboard item)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface DashboardStatCardProps {
  /** 24×24 icon rendered inside the 40×40 lime icon box */
  icon:          React.ReactNode;
  label:         string;
  count:         string | number;
  /** Optional "View Inventory →" style action link */
  actionLabel?:  string;
  actionHref?:   string;
  onActionClick?: () => void;
}

// ---------------------------------------------------------------------------
// DashboardStatCard
// Figma: dark bg (brand.darkGrey), pad 16/24, gap 16
//   deco icon box: 40×40, lime bg, r=8, 24px icon inside
//   label:  14px SemiBold white
//   count:  18px Medium white
//   action: 14px Regular fgReverse.support (→ link)
// ---------------------------------------------------------------------------
export function DashboardStatCard({
  icon,
  label,
  count,
  actionLabel,
  actionHref,
  onActionClick,
}: DashboardStatCardProps) {
  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        padding:       actionLabel ? "16px 24px 8px" : "16px 24px",
        gap:           "16px",
        background:    tokens.color.brand.darkGrey,   // #201b30
        borderRadius:  tokens.borderRadius.lg,        // 8px
        minWidth:      "160px",
        flex:          1,
        boxSizing:     "border-box" as const,
      }}
    >
      {/* Icon + text row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Deco icon box — 40×40, lime bg, r=8 */}
        <div
          style={{
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
          {/* 24×24 icon slot */}
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
        </div>

        {/* Label + count */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,        // 14px
              fontWeight:  tokens.fontWeight.semiBold,  // 600
              lineHeight:  tokens.lineHeight.body,      // 20px
              color:       tokens.color.fgReverse.primary,  // #f9fafb
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    "18px",
              fontWeight:  tokens.fontWeight.medium,    // 500
              lineHeight:  "24px",
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
          href={actionHref}
          onClick={onActionClick}
          style={{
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,        // 14px
            fontWeight:     tokens.fontWeight.regular,   // 400
            lineHeight:     tokens.lineHeight.body,
            color:          tokens.color.fgReverse.support,  // #e5e7eb
            textDecoration: "none",
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "4px",
            paddingBottom:  "8px",
          }}
        >
          {actionLabel} →
        </a>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DashboardStatStrip — horizontal scrollable row of stat cards
// ---------------------------------------------------------------------------
export interface DashboardStatStripProps {
  cards: DashboardStatCardProps[];
}

export function DashboardStatStrip({ cards }: DashboardStatStripProps) {
  return (
    <div
      style={{
        display:        "flex",
        gap:            "2px",
        overflowX:      "auto" as const,
        background:     tokens.color.brand.darkGrey,
        borderRadius:   tokens.borderRadius.lg,
      }}
    >
      {cards.map((card, i) => (
        <DashboardStatCard key={i} {...card} />
      ))}
    </div>
  );
}

export default DashboardStatCard;
