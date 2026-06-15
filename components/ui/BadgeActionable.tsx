"use client";
// components/ui/BadgeActionable.tsx
// Figma: Scannable Design System — node 147:805 (badge - actionable)
// Interactive pill/chip for filters, tags, and dropdown triggers.
// All values reference design-tokens — never hardcoded.

import React, { useState } from "react";
import tokens from "@/styles/design-tokens";

// ── Types ──────────────────────────────────────────────────────────────────────

export type BadgeActionableSize = "small" | "big";

export interface BadgeActionableProps {
  label:        string;
  /**
   * "small" = pill (rounded-full, 12px body-S-R).
   * "big"   = chip (rounded-md, 14px body-R / body-M when selected).
   * Default: "small"
   */
  size?:        BadgeActionableSize;
  selected?:    boolean;
  disabled?:    boolean;
  /** 16×16 icon before the label */
  leadingIcon?: React.ReactNode;
  /**
   * 16×16 icon after the label.
   * - When dismissible=false: always shown.
   * - When dismissible=true + selected=false + small (with tailingIcon): shown (e.g. ∨ chevron).
   * - When dismissible=true + selected=true, OR small with no tailingIcon: replaced by ×.
   */
  tailingIcon?: React.ReactNode;
  /**
   * Enables a × dismiss button.
   * — small, no tailingIcon: × shown always (removable tag chip).
   * — small, with tailingIcon: × shown only when selected (dropdown filter chip).
   * — big: × shown only when selected (replaces tailingIcon).
   */
  dismissible?: boolean;
  onClick?:     () => void;
  /** Called when the × is clicked. Prevents the outer onClick from firing. */
  onDismiss?:   () => void;
  style?:       React.CSSProperties;
}

// ── Built-in icons (exported for use in demos and consumer code) ───────────────

export function BadgeActionableCloseIcon({ color }: { color: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path
        d="M1 1l6 6M7 1L1 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BadgeActionableChevronIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── 16×16 icon wrapper ────────────────────────────────────────────────────────

function IconSlot({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          "16px",
        height:         "16px",
        flexShrink:     0,
      }}
    >
      {children}
    </span>
  );
}

// ── BadgeActionable ───────────────────────────────────────────────────────────

export function BadgeActionable({
  label,
  size        = "small",
  selected    = false,
  disabled    = false,
  leadingIcon,
  tailingIcon,
  dismissible = false,
  onClick,
  onDismiss,
  style,
}: BadgeActionableProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isSmall = size === "small";

  // ── Tailing content visibility ────────────────────────────────────────────
  // × shows when: dismissible AND (selected OR small-with-no-tailingIcon)
  const showClose:   boolean = dismissible && (selected || (isSmall && !tailingIcon));
  const showTailing: boolean = !!tailingIcon && !showClose;

  // ── Colors ────────────────────────────────────────────────────────────────
  const textColor    = selected ? tokens.color.fg.blue : tokens.color.fg.primary;
  const closeColor   = selected ? tokens.color.fg.blue : tokens.color.fg.support;

  // ── Container styles ──────────────────────────────────────────────────────
  let bg:     string        = tokens.color.base.white;
  let border: string        = `1px solid ${tokens.color.divider.frame}`;
  let shadow: string | undefined;

  if (selected) {
    bg     = tokens.color.tint.blue;
    border = `1px solid ${tokens.color.bg.blue}`;   // action/500 = #6366f1
  } else if (hovered && !disabled) {
    bg = tokens.color.bg.lightBg;
  } else if (focused && !disabled) {
    shadow = tokens.shadows.focusGrey;
  }

  const containerStyle: React.CSSProperties = {
    display:       "inline-flex",
    alignItems:    "center",
    gap:           isSmall ? tokens.spacing[1] : tokens.spacing[2],
    paddingTop:    isSmall ? tokens.spacing[1] : tokens.spacing[2],
    paddingBottom: isSmall ? tokens.spacing[1] : tokens.spacing[2],
    paddingLeft:   tokens.spacing[2],
    paddingRight:  tokens.spacing[2],
    borderRadius:  isSmall ? tokens.borderRadius.full : tokens.borderRadius.md,
    background:    bg,
    border,
    boxShadow:     shadow,
    opacity:       disabled ? 0.3 : 1,
    cursor:        disabled ? "not-allowed" : "pointer",
    fontFamily:    tokens.fontFamily.sans,
    userSelect:    "none" as const,
    // Reset button defaults
    outline:       "none",
    ...style,
  };

  // ── Label typography ──────────────────────────────────────────────────────
  // small:          body-S-R (12px / 400 / 16px)
  // big default:    body-R   (14px / 400 / 20px)
  // big selected:   body-M   (14px / 500 / 20px)
  const textStyle: React.CSSProperties = isSmall
    ? { ...tokens.typography.smallBodyR, color: textColor }
    : selected
      ? { ...tokens.typography.bodyM,    color: textColor }
      : { ...tokens.typography.bodyR,    color: textColor };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleClick = () => { if (!disabled) onClick?.(); };
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onDismiss?.();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={containerStyle}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={()     => setFocused(true)}
      onBlur={()      => setFocused(false)}
    >
      {/* Leading icon slot */}
      {leadingIcon && <IconSlot>{leadingIcon}</IconSlot>}

      {/* Label */}
      <span style={textStyle}>{label}</span>

      {/* Tailing icon (chevron, filter, etc.) */}
      {showTailing && <IconSlot>{tailingIcon}</IconSlot>}

      {/* Close × */}
      {showClose && (
        <span
          onClick={onDismiss ? handleDismiss : undefined}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "16px",
            height:         "16px",
            flexShrink:     0,
            cursor:         disabled ? "not-allowed" : "pointer",
          }}
          aria-label={`Remove ${label}`}
        >
          <BadgeActionableCloseIcon color={closeColor} />
        </span>
      )}
    </button>
  );
}

export default BadgeActionable;
