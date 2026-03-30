// components/ui/Button.tsx
// Built on top of design-tokens.ts
// Icon specs confirmed from Figma plugin API:
//   all button icons: 16×16
//   primary/secondary:  gray/900  (#111827) — fg/primary
//   tertiary:           indigo/700 (#4338ca) — fg/blue
//   destructive:        white      (#ffffff) — base.white
//   disabled/loading:   gray/400   (#9ca3af) — fg/disabled
//   icon/icon-framed:   24×24 (icon-only buttons)

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ButtonType =
  | "primary" | "secondary" | "tertiary" | "destructive"
  | "disabled" | "loading" | "icon" | "icon framed";

export type ButtonSize     = "Default" | "large";
export type ButtonWithIcon = "none" | "heading" | "tailing";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?:  ButtonType;
  size?:     ButtonSize;
  withIcon?: ButtonWithIcon;
  label?:    string;
  /** Pass 16px icon for text buttons, 24px icon for icon-only buttons */
  icon?:     React.ReactNode;
  type?:     "button" | "submit" | "reset";
}

// ---------------------------------------------------------------------------
// Icon color per variant — confirmed from Figma plugin API
// ---------------------------------------------------------------------------
const iconColor: Record<ButtonType, string> = {
  primary:       tokens.color.fg.primary,    // gray/900 #111827
  secondary:     tokens.color.fg.primary,    // gray/900 #111827
  tertiary:      tokens.color.fg.blue,       // indigo/700 #4338ca
  destructive:   tokens.color.base.white,    // white #ffffff
  disabled:      tokens.color.fg.disabled,   // gray/400 #9ca3af
  loading:       tokens.color.fg.disabled,   // gray/400 #9ca3af
  icon:          tokens.color.fg.primary,    // gray/900 #111827
  "icon framed": tokens.color.fg.primary,    // gray/900 #111827
};

// ---------------------------------------------------------------------------
// Spinner — uses fg/disabled token
// ---------------------------------------------------------------------------
const SpinnerIcon = () => (
  <svg
    style={{ animation: "spin 1s linear infinite", width: "16px", height: "16px", flexShrink: 0 }}
    viewBox="0 0 16 16" fill="none" aria-hidden
  >
    <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    <circle cx="8" cy="8" r="5.5"
      stroke={tokens.color.fg.disabled}
      strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="8" strokeLinecap="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Base style
// ---------------------------------------------------------------------------
const baseStyle: React.CSSProperties = {
  display:        "inline-flex",
  alignItems:     "center",
  justifyContent: "center",
  fontFamily:     tokens.fontFamily.sans,
  fontSize:       tokens.fontSize.body,       // 14px
  fontWeight:     tokens.fontWeight.medium,   // 500
  lineHeight:     tokens.lineHeight.body,     // 20px
  borderRadius:   tokens.borderRadius.md,     // 6px
  transition:     "all 150ms ease",
  cursor:         "pointer",
  border:         "none",
  outline:        "none",
  userSelect:     "none" as const,
  whiteSpace:     "nowrap" as const,
  textDecoration: "none",
};

// ---------------------------------------------------------------------------
// Per-variant styles
// ---------------------------------------------------------------------------
type VariantStyle = { default: React.CSSProperties; hover: React.CSSProperties; focus: React.CSSProperties; };

const variantStyles: Record<ButtonType, VariantStyle> = {
  primary: {
    default: { background: tokens.color.brand.lime, border: `1px solid ${tokens.color.divider.lime}`, color: tokens.color.fg.primary },
    hover:   { background: tokens.color.hover.lime, boxShadow: tokens.shadows.sm },
    focus:   { background: tokens.color.brand.lime, boxShadow: tokens.shadows.focusLime },
  },
  secondary: {
    default: { background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, color: tokens.color.fg.primary },
    hover:   { background: tokens.color.bg.lightBg, boxShadow: tokens.shadows.sm },
    focus:   { background: tokens.color.base.white, boxShadow: tokens.shadows.focusGrey },
  },
  tertiary: {
    default: { background: "transparent", color: tokens.color.fg.blue },
    hover:   { color: tokens.color.hover.blue },
    focus:   { color: tokens.color.pressed.blue },
  },
  destructive: {
    default: { background: tokens.color.bg.red, color: tokens.color.base.white },
    hover:   { background: tokens.color.hover.red, boxShadow: tokens.shadows.sm },
    focus:   { background: tokens.color.bg.red, boxShadow: tokens.shadows.focusRed },
  },
  disabled: {
    default: { background: tokens.color.bg.darkBg, border: `1px solid ${tokens.color.divider.frame}`, color: tokens.color.fg.disabled, cursor: "not-allowed", pointerEvents: "none" as const },
    hover:   {},
    focus:   {},
  },
  loading: {
    default: { background: tokens.color.bg.darkBg, border: `1px solid ${tokens.color.divider.frame}`, color: tokens.color.fg.disabled, cursor: "not-allowed", pointerEvents: "none" as const, gap: tokens.spacing[1] },
    hover:   {},
    focus:   {},
  },
  icon: {
    default: { background: "transparent", color: tokens.color.fg.primary },
    hover:   { background: tokens.color.bg.lightBg },
    focus:   { background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, boxShadow: tokens.shadows.focusGrey },
  },
  "icon framed": {
    default: { background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, color: tokens.color.fg.primary },
    hover:   { background: tokens.color.bg.lightBg },
    focus:   { boxShadow: tokens.shadows.focusGrey },
  },
};

// ---------------------------------------------------------------------------
// Padding
// ---------------------------------------------------------------------------
const textPadding: Record<ButtonWithIcon, React.CSSProperties> = {
  none:    { padding: `${tokens.spacing[2.5]} ${tokens.spacing[4]}` },
  heading: { paddingTop: tokens.spacing[2.5], paddingBottom: tokens.spacing[2.5], paddingLeft: tokens.spacing[3], paddingRight: tokens.spacing[4], gap: tokens.spacing[1] },
  tailing: { paddingTop: tokens.spacing[2.5], paddingBottom: tokens.spacing[2.5], paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[3], gap: tokens.spacing[1] },
};

const iconPadding: Record<ButtonSize, React.CSSProperties> = {
  Default: { padding: tokens.spacing[1] },  // 4px
  large:   { padding: tokens.spacing[2] },  // 8px
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Button({
  variant  = "primary",
  size     = "Default",
  withIcon = "none",
  label    = "Button",
  icon,
  type     = "button",
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const isIconOnly = variant === "icon" || variant === "icon framed";
  const isLoading  = variant === "loading";
  const isDisabled = variant === "disabled" || isLoading;
  const isTertiary = variant === "tertiary";

  const vStyle  = variantStyles[variant];
  const padding = isIconOnly ? iconPadding[size] : textPadding[withIcon];

  const computedStyle: React.CSSProperties = {
    ...baseStyle,
    ...padding,
    ...vStyle.default,
    ...(hovered && !isDisabled ? vStyle.hover : {}),
    ...(focused && !isDisabled ? vStyle.focus : {}),
    ...style,
  };

  // Icon wrapper — 16px for text buttons, 24px for icon-only
  // color is baked into SVG exports from Figma library but we set it
  // here for inline SVG fallbacks
  const textIconStyle: React.CSSProperties = {
    width:          "16px",
    height:         "16px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
    color:          iconColor[variant],
  };

  const iconOnlyStyle: React.CSSProperties = {
    width:          "24px",
    height:         "24px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
    color:          iconColor[variant],
  };

  return (
    <button
      type={type}
      style={computedStyle}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onMouseEnter={(e) => { setHovered(true);  onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
      onFocus={(e)      => { setFocused(true);  onFocus?.(e); }}
      onBlur={(e)       => { setFocused(false); onBlur?.(e); }}
      onClick={isDisabled ? undefined : onClick}
      {...rest}
    >
      {/* Loading */}
      {isLoading && <><SpinnerIcon /><span>Loading...</span></>}

      {/* Icon-only buttons — 24px */}
      {!isLoading && isIconOnly && icon && (
        <span style={iconOnlyStyle} aria-hidden>{icon}</span>
      )}

      {/* Text buttons */}
      {!isLoading && !isIconOnly && (
        <>
          {/* Leading icon — 16px */}
          {withIcon === "heading" && icon && (
            <span style={textIconStyle} aria-hidden>{icon}</span>
          )}

          {/* Label — underline only for tertiary with no icon */}
          <span style={isTertiary && withIcon === "none" ? { textDecoration: "underline", textDecorationSkipInk: "none" } : {}}>
            {label}
          </span>

          {/* Tailing icon — 16px */}
          {withIcon === "tailing" && icon && (
            <span style={textIconStyle} aria-hidden>{icon}</span>
          )}
        </>
      )}
    </button>
  );
}

export default Button;
