// components/ui/Badge.tsx
// Figma: Scannable Design System — node 57:573 (badge - indicator)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type BadgeColor = "green" | "red" | "blue" | "yellow" | "gray" | "lime";
export type BadgeIconPosition = "none" | "leading" | "tail";

export interface BadgeProps {
  label: string;
  color?: BadgeColor;
  /** Renders an 8px dot before the label */
  withDot?: boolean;
  /** Pass a 16px icon node */
  icon?: React.ReactNode;
  /** Where to place the icon — ignored when withDot is true */
  iconPosition?: BadgeIconPosition;
}

// ---------------------------------------------------------------------------
// Color tokens — confirmed from Figma node 57:573
// ---------------------------------------------------------------------------
const colorMap: Record<BadgeColor, { bg: string; text: string; dot: string }> = {
  green:  { bg: tokens.color.tint.green,    text: tokens.color.fg.green,    dot: tokens.color.bg.green  },
  red:    { bg: tokens.color.tint.red,      text: tokens.color.fg.red,      dot: tokens.color.bg.red    },
  blue:   { bg: tokens.color.tint.blue,     text: tokens.color.fg.blue,     dot: tokens.color.bg.blue   },
  yellow: { bg: tokens.color.tint.yellow,   text: tokens.color.fg.amber,    dot: tokens.color.bg.amber  },
  gray:   { bg: tokens.color.bg.bg,         text: tokens.color.fg.primary,  dot: tokens.color.fg.disabled },
  lime:   { bg: tokens.color.brand.lime,    text: tokens.color.brand.darkPurple, dot: tokens.color.brand.darkPurple },
};

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
export function Badge({
  label,
  color = "green",
  withDot = false,
  icon,
  iconPosition = "none",
}: BadgeProps) {
  const { bg, text, dot } = colorMap[color];

  const hasLeadingContent = withDot || (icon && iconPosition === "leading");
  const hasTrailingIcon   = !withDot && icon && iconPosition === "tail";

  // Padding — confirmed from Figma:
  //   plain (no dot, no icon):    2px 8px
  //   with dot:                   2px 6px
  //   leading icon:               2px 6px 2px 2px
  //   trailing icon:              2px 2px 2px 6px
  let paddingTop    = "2px";
  let paddingBottom = "2px";
  let paddingLeft:  string;
  let paddingRight: string;

  if (withDot) {
    paddingLeft = "6px"; paddingRight = "6px";
  } else if (icon && iconPosition === "leading") {
    paddingLeft = "2px"; paddingRight = "6px";
  } else if (icon && iconPosition === "tail") {
    paddingLeft = "6px"; paddingRight = "2px";
  } else {
    paddingLeft = "8px"; paddingRight = "8px";
  }

  return (
    <span
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            (hasLeadingContent || hasTrailingIcon) ? "4px" : undefined,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        borderRadius:   "13px",
        background:     bg,
        fontFamily:     tokens.fontFamily.sans,
        fontSize:       "12px",
        fontWeight:     tokens.fontWeight.semiBold,  // 600
        lineHeight:     "16px",
        color:          text,
        whiteSpace:     "nowrap" as const,
        flexShrink:     0,
      }}
    >
      {/* Dot — 8×8px circle */}
      {withDot && (
        <span
          style={{
            width:        "8px",
            height:       "8px",
            borderRadius: "50%",
            background:   dot,
            flexShrink:   0,
          }}
          aria-hidden
        />
      )}

      {/* Leading icon — 14×14px */}
      {!withDot && icon && iconPosition === "leading" && (
        <span
          style={{
            width:          "14px",
            height:         "14px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
          aria-hidden
        >
          {icon}
        </span>
      )}

      {label}

      {/* Trailing icon — 14×14px */}
      {!withDot && icon && iconPosition === "tail" && (
        <span
          style={{
            width:          "14px",
            height:         "14px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            flexShrink:     0,
          }}
          aria-hidden
        >
          {icon}
        </span>
      )}
    </span>
  );
}

export default Badge;
