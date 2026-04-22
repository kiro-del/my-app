// components/ui/SidebarNavItem.tsx
// Figma: Scannable Design System — node 92:1281 (/Side bar navigation/ nave menu item)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SidebarNavItemProps {
  label:       string;
  /**
   * Pass a URL string to an SVG file and SidebarNavItem will render it via
   * CSS mask-image, automatically tinting it fg.primary (selected) or
   * fg.disabled (default).  This is the preferred approach for Figma icons.
   */
  iconUrl?:    string;
  /**
   * Inline SVG React node — use when you need a hand-crafted SVG.
   * Colour the paths with `stroke="currentColor"` / `fill="currentColor"`;
   * the wrapper sets CSS `color` to fg.primary / fg.disabled automatically.
   */
  icon?:       React.ReactNode;
  selected?:   boolean;
  /** Shows a "Pro" chip on the trailing side */
  showProChip?: boolean;
  /** Shows a 16×16 info icon inline after the label */
  showInfo?:   boolean;
  href?:       string;
  onClick?:    () => void;
}

// ---------------------------------------------------------------------------
// Inline info icon — 16px
// ---------------------------------------------------------------------------
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.5" stroke={tokens.color.fg.disabled} strokeWidth="1.2" />
    <rect x="7.25" y="7" width="1.5" height="4" rx="0.75" fill={tokens.color.fg.disabled} />
    <circle cx="8" cy="5.5" r="0.75" fill={tokens.color.fg.disabled} />
  </svg>
);

// ---------------------------------------------------------------------------
// SidebarNavItem
// Figma: h=40px, pad 8/12/8/8, r=6
//   default:  transparent bg, icon gray-400, label 14px Medium fg.primary
//   selected: tint.blue bg, icon fg.primary (dark)
// ---------------------------------------------------------------------------
export function SidebarNavItem({
  label,
  iconUrl,
  icon,
  selected = false,
  showProChip = false,
  showInfo = false,
  href,
  onClick,
}: SidebarNavItemProps) {
  const [hovered, setHovered] = React.useState(false);

  const bg = selected
    ? tokens.color.tint.blue                                        // indigo-50 #eef2ff
    : hovered
    ? tokens.color.base.white                                       // white — visible against lightBg sidebar
    : "transparent";

  const inner = (
    <div
      style={{
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        height:          "40px",
        padding:         "8px 12px 8px 8px",
        borderRadius:    tokens.borderRadius.md,    // 6px
        background:      bg,
        cursor:          "pointer",
        transition:      "background 150ms ease",
        userSelect:      "none" as const,
        textDecoration:  "none",
        color:           "inherit",
        width:           "100%",
        boxSizing:       "border-box" as const,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left: icon + label */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        {/* Icon — 24×24 */}
        {iconUrl ? (
          /* URL-based icon: CSS mask-image so we control the colour directly */
          <span
            style={{
              display:              "inline-block",
              width:                "24px",
              height:               "24px",
              flexShrink:           0,
              background:           selected ? tokens.color.fg.primary : tokens.color.fg.disabled,
              maskImage:            `url(${iconUrl})`,
              maskSize:             "contain",
              maskRepeat:           "no-repeat",
              maskPosition:         "center",
              WebkitMaskImage:      `url(${iconUrl})`,
              WebkitMaskSize:       "contain",
              WebkitMaskRepeat:     "no-repeat",
              WebkitMaskPosition:   "center",
              transition:           "background 150ms ease",
            } as React.CSSProperties}
            aria-hidden
          />
        ) : icon ? (
          /* Inline SVG node: set CSS color so currentColor paths pick it up */
          <span
            style={{
              width:          "24px",
              height:         "24px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
              color:          selected ? tokens.color.fg.primary : tokens.color.fg.disabled,
              transition:     "color 150ms ease",
            }}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}

        {/* Label + optional info icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0 }}>
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,       // 14px
              fontWeight:  tokens.fontWeight.regular,  // 400 — fix #7
              lineHeight:  tokens.lineHeight.body,     // 20px
              color:       tokens.color.fg.primary,
              overflow:    "hidden",
              textOverflow: "ellipsis",
              whiteSpace:  "nowrap" as const,
            }}
          >
            {label}
          </span>
          {showInfo && <InfoIcon />}
        </div>
      </div>

      {/* Pro chip */}
      {showProChip && (
        <span
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            padding:      "0 4px",
            height:       "16px",
            borderRadius: "4px",
            border:       `1px solid ${tokens.color.divider.frame}`,
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     "12px",
            fontWeight:   tokens.fontWeight.semiBold,
            lineHeight:   "16px",
            color:        tokens.color.fg.primary,
            flexShrink:   0,
          }}
        >
          Pro
        </span>
      )}
    </div>
  );

  if (href) {
    return <a href={href} style={{ display: "block", textDecoration: "none" }} onClick={onClick}>{inner}</a>;
  }

  return (
    <button
      onClick={onClick}
      style={{ display: "block", width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer" }}
      aria-current={selected ? "page" : undefined}
    >
      {inner}
    </button>
  );
}

export default SidebarNavItem;
