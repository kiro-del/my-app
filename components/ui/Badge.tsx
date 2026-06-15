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

  // Padding — confirmed from Figma node 57:573:
  //   plain (no dot, no icon):  py-0.5 px-2  →  2px 8px
  //   with dot:                 py-0.5 px-2  →  2px 8px  (gap-1 between dot + label)
  //   leading icon:             py-0.5 pl-0.5 pr-2  →  2px left, 8px right
  //   trailing icon:            py-0.5 pl-2 pr-0.5  →  8px left, 2px right
  const paddingTop    = tokens.spacing[0.5];  // 2px
  const paddingBottom = tokens.spacing[0.5];  // 2px
  let   paddingLeft:  string;
  let   paddingRight: string;

  if (withDot) {
    paddingLeft = tokens.spacing[2]; paddingRight = tokens.spacing[2];   // 8px both
  } else if (icon && iconPosition === "leading") {
    paddingLeft = tokens.spacing[0.5]; paddingRight = tokens.spacing[2]; // 2px / 8px
  } else if (icon && iconPosition === "tail") {
    paddingLeft = tokens.spacing[2]; paddingRight = tokens.spacing[0.5]; // 8px / 2px
  } else {
    paddingLeft = tokens.spacing[2]; paddingRight = tokens.spacing[2];   // 8px both
  }

  return (
    <span
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            (hasLeadingContent || hasTrailingIcon) ? tokens.spacing[1] : undefined,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        borderRadius:   tokens.borderRadius.full,  // 9999px — full pill
        background:     bg,
        fontFamily:     tokens.fontFamily.sans,
        fontSize:       tokens.fontSize.bodySmall,  // 12px
        fontWeight:     tokens.fontWeight.semiBold, // 600
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

      {/* Leading icon — 16×16px (Figma: size-[16px]) */}
      {!withDot && icon && iconPosition === "leading" && (
        <span
          style={{
            width:          "16px",
            height:         "16px",
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

      {/* Trailing icon — 16×16px (Figma: size-[16px]) */}
      {!withDot && icon && iconPosition === "tail" && (
        <span
          style={{
            width:          "16px",
            height:         "16px",
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
