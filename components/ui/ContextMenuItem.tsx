// components/ui/ContextMenuItem.tsx
// Figma: Scannable Design System — node 165:930 (/context menu/context menu item)
// All values reference design-tokens — never hardcoded.
"use client";

import React from "react";
import tokens from "@/styles/design-tokens";
import { Toggle } from "@/components/ui/Toggle";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ContextMenuItemState =
  | "default"
  | "hover"
  | "selected"
  | "destructive"
  | "disabled";

export type ContextMenuItemTrailing = "none" | "arrow" | "toggle" | "chip";

export interface ContextMenuItemProps {
  label: string;
  /** Secondary line below label — 14px fg.disabled */
  supportText?: string;
  /**
   * URL-based SVG icon (data URL from /api/figma-icons or public path).
   * Rendered via CSS mask-image, automatically tinted fg.disabled (normal)
   * or fg.red (destructive).
   */
  iconUrl?: string;
  /**
   * Inline SVG React node — paths should use stroke/fill="currentColor".
   * The wrapper sets CSS `color` automatically.
   */
  icon?: React.ReactNode;
  state?: ContextMenuItemState;
  /** Adds a 1 px divider line below the row */
  divider?: boolean;
  trailing?: ContextMenuItemTrailing;
  /** Label text shown inside the chip badge (amber style) */
  chipLabel?: string;
  /** Current on/off value for the toggle trailing item */
  toggleChecked?: boolean;
  onToggleChange?: (checked: boolean) => void;
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Inline micro-icons — no fetch required
// ---------------------------------------------------------------------------
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 12l5 5L19 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// ContextMenuItem
// ---------------------------------------------------------------------------
export function ContextMenuItem({
  label,
  supportText,
  iconUrl,
  icon,
  state = "default",
  divider = false,
  trailing = "none",
  chipLabel,
  toggleChecked = false,
  onToggleChange,
  onClick,
}: ContextMenuItemProps) {
  const [hovered, setHovered] = React.useState(false);

  const isDestructive = state === "destructive";
  const isDisabled    = state === "disabled";
  const isSelected    = state === "selected";

  const effectiveHover = hovered && !isDisabled;
  const hasIcon        = !!(iconUrl || icon);
  const hasTrailing    = trailing !== "none" || isSelected;

  // --- Colours ---------------------------------------------------------------
  const bg        = effectiveHover ? tokens.color.tint.blue : "transparent";
  const textColor = isDestructive ? tokens.color.fg.red : tokens.color.fg.primary;
  const iconColor = isDestructive ? tokens.color.fg.red : tokens.color.fg.disabled;

  // --- Padding ---------------------------------------------------------------
  // Vertical: 8px with support text, 10px with icon, 12px plain
  const vertPad = supportText ? tokens.spacing[2] : hasIcon ? tokens.spacing[2.5] : tokens.spacing[3];
  // Horizontal right: 8px when there is a trailing element
  const rightPad = hasTrailing ? tokens.spacing[2] : tokens.spacing[4];

  // ---------------------------------------------------------------------------
  // Row
  // ---------------------------------------------------------------------------
  const row = (
    <div
      role={onClick ? "menuitem" : undefined}
      tabIndex={onClick && !isDisabled ? 0 : undefined}
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            tokens.spacing[3],
        padding:        `${vertPad} ${rightPad} ${vertPad} ${tokens.spacing[4]}`,
        background:     bg,
        borderRadius:   tokens.borderRadius.md,    // 6px
        transition:     "background 150ms ease",
        opacity:        isDisabled ? 0.3 : 1,
        cursor:         isDisabled ? "not-allowed" : onClick ? "pointer" : "default",
        userSelect:     "none" as const,
        boxSizing:      "border-box" as const,
        width:          "100%",
        outline:        "none",
      }}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={isDisabled ? undefined : onClick}
      onKeyDown={
        onClick && !isDisabled
          ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }
          : undefined
      }
    >
      {/* ── Left: icon + label column ─────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: supportText && hasIcon ? "flex-start" : "center", gap: tokens.spacing[3], flex: "1 1 0", minWidth: 0 }}>

        {/* Icon */}
        {iconUrl ? (
          <span
            style={{
              display:            "inline-block",
              width:              "24px",
              height:             "24px",
              flexShrink:         0,
              background:         iconColor,
              maskImage:          `url(${iconUrl})`,
              maskSize:           "contain",
              maskRepeat:         "no-repeat",
              maskPosition:       "center",
              WebkitMaskImage:    `url(${iconUrl})`,
              WebkitMaskSize:     "contain",
              WebkitMaskRepeat:   "no-repeat",
              WebkitMaskPosition: "center",
              transition:         "background 150ms ease",
            } as React.CSSProperties}
            aria-hidden
          />
        ) : icon ? (
          <span
            style={{
              width:          "24px",
              height:         "24px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
              color:          iconColor,
              transition:     "color 150ms ease",
            }}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}

        {/* Text column */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <span
            style={{
              display:      "block",
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,      // 14px
              fontWeight:   tokens.fontWeight.regular, // 400
              lineHeight:   tokens.lineHeight.body,    // 20px
              color:        textColor,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap" as const,
            }}
          >
            {label}
          </span>
          {supportText && (
            <span
              style={{
                display:    "block",
                fontFamily: tokens.fontFamily.sans,
                fontSize:   tokens.fontSize.bodySmall,   // 12px
                fontWeight: tokens.fontWeight.regular,
                lineHeight: tokens.lineHeight.bodySmall,
                color:      tokens.color.fg.disabled,
                whiteSpace: "normal" as const,           // allow 2-line wrap
                marginTop:  tokens.spacing[0.5],
              }}
            >
              {supportText}
            </span>
          )}
        </div>
      </div>

      {/* ── Right: trailing item ──────────────────────────────────────────── */}

      {/* Selected check — only when no other trailing specified */}
      {isSelected && trailing === "none" && (
        <span style={{ color: tokens.color.fg.primary, flexShrink: 0, display: "flex" }}>
          <CheckOnIcon />
        </span>
      )}

      {/* Arrow chevron */}
      {trailing === "arrow" && (
        <span style={{ color: tokens.color.fg.disabled, flexShrink: 0, display: "flex" }}>
          <ChevronRightIcon />
        </span>
      )}

      {/* Toggle switch — stopPropagation so the row onClick isn't fired */}
      {trailing === "toggle" && (
        <span
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <Toggle
            checked={toggleChecked}
            onChange={onToggleChange ?? (() => {})}
            disabled={isDisabled}
          />
        </span>
      )}

      {/* Chip badge (amber) */}
      {trailing === "chip" && chipLabel && (
        <span
          style={{
            display:      "inline-flex",
            alignItems:   "center",
            padding:      `${tokens.spacing[0.5]} ${tokens.spacing[2]}`,
            borderRadius: tokens.borderRadius.full,
            background:   tokens.color.tint.yellow,   // #fffbeb
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.bodySmall,  // 12px
            fontWeight:   tokens.fontWeight.semiBold,
            lineHeight:   tokens.lineHeight.bodySmall, // 16px
            color:        tokens.color.fg.amber,       // #b45309
            flexShrink:   0,
            whiteSpace:   "nowrap" as const,
          }}
        >
          {chipLabel}
        </span>
      )}
    </div>
  );

  // ---------------------------------------------------------------------------
  // With divider
  // ---------------------------------------------------------------------------
  if (divider) {
    return (
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[1],
          paddingBottom: tokens.spacing[1],
          width:         "100%",
        }}
      >
        {row}
        <div
          style={{
            height:     "1px",
            background: tokens.color.divider.border,  // #e5e7eb
            width:      "100%",
            flexShrink: 0,
          }}
        />
      </div>
    );
  }

  return row;
}

export default ContextMenuItem;
