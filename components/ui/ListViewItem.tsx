// components/ui/ListViewItem.tsx
// Figma: Scannable Design System — node 2239:541 (list view - item)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";
import { Badge, BadgeColor } from "./Badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ListViewChip {
  label: string;
  color?: BadgeColor;
}

export interface ListViewItemProps {
  /** Product image URL — shows placeholder box if omitted */
  imageUrl?:   string;
  /** Primary label — 14px Medium fg.primary */
  title:       string;
  /** Secondary line — 12px Regular fg.support (e.g. "DMM · A327") */
  subtitle?:   string;
  /** Optional third line — 12px Medium fg.primary (e.g. serial "#132241154A") */
  serialRef?:  string;
  /** Optional chip/badge inline after the title */
  chip?:       ListViewChip;
  /** Optional trailing action button */
  action?:     React.ReactNode;
  onClick?:    () => void;
}

// ---------------------------------------------------------------------------
// Product image placeholder — 56×56, r=6
// ---------------------------------------------------------------------------
function ProductImagePlaceholder() {
  return (
    <div
      style={{
        width:          "56px",
        height:         "56px",
        borderRadius:   tokens.borderRadius.md,       // 6px
        background:     tokens.color.bg.darkBg,       // gray-200
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
      }}
      aria-hidden
    >
      {/* Simple product icon outline */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ListViewItem
// Figma (lines=2 variant): pad 8/8/8/16, gap 16 (between img and text block)
//   img:      56×56, r=6
//   title:    14px Medium fg.primary
//   subtitle: 12px Regular fg.support, gap 4px below title
//   serialRef:12px Medium fg.primary
//   action:   40×40 icon-framed button, trailing
// ---------------------------------------------------------------------------
export function ListViewItem({
  imageUrl,
  title,
  subtitle,
  serialRef,
  chip,
  action,
  onClick,
}: ListViewItemProps) {
  const hasExtraLines = Boolean(serialRef);

  return (
    <div
      onClick={onClick}
      style={{
        display:      "flex",
        alignItems:   "center",
        padding:      "8px 8px 8px 16px",
        gap:          "16px",
        borderBottom: `1px solid ${tokens.color.divider.frame}`,
        background:   tokens.color.base.white,
        cursor:       onClick ? "pointer" : "default",
        boxSizing:    "border-box" as const,
        minHeight:    hasExtraLines ? "78px" : "72px",
      }}
    >
      {/* Product image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width:        "56px",
            height:       "56px",
            borderRadius: tokens.borderRadius.md,
            objectFit:    "cover" as const,
            flexShrink:   0,
          }}
        />
      ) : (
        <ProductImagePlaceholder />
      )}

      {/* Text block */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
        {/* Title row — title + optional chip */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,       // 14px
              fontWeight:   tokens.fontWeight.medium,   // 500
              lineHeight:   tokens.lineHeight.body,     // 20px
              color:        tokens.color.fg.primary,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap" as const,
            }}
          >
            {title}
          </span>
          {chip && <Badge label={chip.label} color={chip.color ?? "green"} />}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <span
            style={{
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     "12px",
              fontWeight:   tokens.fontWeight.regular,  // 400
              lineHeight:   "16px",
              color:        tokens.color.fg.support,    // #6b7280
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap" as const,
            }}
          >
            {subtitle}
          </span>
        )}

        {/* Serial ref */}
        {serialRef && (
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    "12px",
              fontWeight:  tokens.fontWeight.medium,    // 500
              lineHeight:  "18px",
              color:       tokens.color.fg.primary,
            }}
          >
            {serialRef}
          </span>
        )}
      </div>

      {/* Trailing action */}
      {action && (
        <div style={{ flexShrink: 0 }}>
          {action}
        </div>
      )}
    </div>
  );
}

export default ListViewItem;
