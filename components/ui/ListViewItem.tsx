"use client";

// components/ui/ListViewItem.tsx
// Figma: Scannable Design System — node 2239:541 (list view - item)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";
import { Badge, BadgeColor } from "./Badge";
import { ProductImg } from "@/components/ui/ProductImg";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ListViewChip {
  label: string;
  color?: BadgeColor;
}

export interface ListViewItemProps {
  /** Product image URL — shows placeholder if omitted */
  imageUrl?:   string;
  /** Primary label — 14px Medium fg.primary */
  title:       string;
  /**
   * Secondary line — rendered as "Brand · SKU" with a 1px vertical divider.
   * Pass "Brand · SKU" and it splits on " · " automatically.
   * If no " · " separator is found, renders as plain text.
   */
  subtitle?:   string;
  /** Optional third line — 12px Medium fg.primary underlined (e.g. "#132241154A") */
  serialRef?:  string;
  /** Optional chip/badge inline after the title */
  chip?:       ListViewChip;
  /** Optional trailing action button */
  action?:     React.ReactNode;
  onClick?:    () => void;
  /**
   * Whether to render the bottom divider line. Defaults to true.
   * Set to false when the parent (e.g. SearchDropdown) manages dividers itself.
   */
  showDivider?: boolean;
  /**
   * Override the divider colour. Defaults to tokens.color.divider.frame.
   * Use tokens.color.divider.border for lighter dropdown contexts (Figma: gray/200).
   */
  dividerColor?: string;
}

// ---------------------------------------------------------------------------
// SubtitleWithDivider — renders "Brand" + 1px divider + "SKU"
// ---------------------------------------------------------------------------
function SubtitleWithDivider({ text }: { text: string }) {
  const parts = text.split(" · ");
  if (parts.length < 2) {
    return <>{text}</>;
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: tokens.spacing[1] }}>
      <span>{parts[0]}</span>
      {/* 1px vertical divider */}
      <span
        style={{
          display:    "inline-block",
          width:      "1px",
          height:     "12px",
          background: tokens.color.divider.frame,
          flexShrink: 0,
        }}
        aria-hidden
      />
      <span>{parts.slice(1).join(" · ")}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// ListViewItem
// Figma (lines=2 variant): py-8px px-0, gap 16px (between img and text block)
//   img:       56×56 ProductImg component
//   title:     14px Medium fg.primary
//   subtitle:  12px Regular fg.support, brand + 1px divider + SKU
//   serialRef: 12px Medium fg.primary, underlined
//   action:    40×40 icon-framed button, trailing
// ---------------------------------------------------------------------------
export function ListViewItem({
  imageUrl,
  title,
  subtitle,
  serialRef,
  chip,
  action,
  onClick,
  showDivider  = true,
  dividerColor = tokens.color.divider.frame,
}: ListViewItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display:      "flex",
        alignItems:   "center",
        padding:      `${tokens.spacing[2]} 0`,   // py-8px px-0
        gap:          tokens.spacing[4],           // 16px
        borderBottom: showDivider ? `1px solid ${dividerColor}` : "none",
        cursor:       onClick ? "pointer" : "default",
        boxSizing:    "border-box" as const,
      }}
    >
      {/* Product image — uses ProductImg component (56×56) */}
      <ProductImg size={56} image={imageUrl} />

      {/* Text block */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        {/* Title row — title + optional chip */}
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2] }}>
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

        {/* Subtitle — brand + 1px divider + SKU */}
        {subtitle && (
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.bodySmall,   // 12px
              fontWeight:  tokens.fontWeight.regular,   // 400
              lineHeight:  "16px",
              color:       tokens.color.fg.support,     // #6b7280
            }}
          >
            <SubtitleWithDivider text={subtitle} />
          </span>
        )}

        {/* Serial ref — underlined link style */}
        {serialRef && (
          <span
            style={{
              fontFamily:      tokens.fontFamily.sans,
              fontSize:        tokens.fontSize.bodySmall,   // 12px
              fontWeight:      tokens.fontWeight.medium,    // 500
              lineHeight:      tokens.lineHeight.bodySmall, // 18px
              color:           tokens.color.fg.primary,
              textDecoration:  "underline",
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
