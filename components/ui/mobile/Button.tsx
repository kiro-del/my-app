"use client";
// components/ui/mobile/Button.tsx
// Mobile-specific buttons — 48px height, 8px border-radius.
// Keep separate from components/ui/Button.tsx.

import React from "react";
import tokens from "@/styles/design-tokens";

export type MobileButtonVariant = "primary" | "secondary" | "outline" | "scan-pill" | "card";

export interface MobileButtonProps {
  variant?:  MobileButtonVariant;
  label:     string;
  /** Leading icon node (16px for primary/secondary/outline, 24px for scan-pill/card) */
  icon?:     React.ReactNode;
  onClick?:  () => void;
  disabled?: boolean;
  style?:    React.CSSProperties;
  type?:     "button" | "submit" | "reset";
}

export function MobileButton({
  variant  = "primary",
  label,
  icon,
  onClick,
  disabled = false,
  style,
  type = "button",
}: MobileButtonProps) {

  if (variant === "primary") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            tokens.spacing[2],
          width:          "100%",
          height:         "48px",
          background:     disabled ? tokens.color.bg.darkBg : tokens.color.brand.lime,
          borderRadius:   tokens.borderRadius.lg,
          border:         "none",
          fontFamily:     tokens.fontFamily.sans,
          fontSize:       "16px",
          fontWeight:     500,
          lineHeight:     "22px",
          color:          disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          cursor:         disabled ? "not-allowed" : "pointer",
          paddingLeft:    tokens.spacing[4],
          paddingRight:   tokens.spacing[4],
          ...style,
        }}
      >
        {icon && <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>}
        {label}
      </button>
    );
  }

  if (variant === "secondary") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            tokens.spacing[2],
          width:          "100%",
          height:         "48px",
          background:     disabled ? tokens.color.bg.lightBg : tokens.color.base.white,
          borderRadius:   tokens.borderRadius.lg,
          border:         `1px solid ${tokens.color.divider.frame}`,
          fontFamily:     tokens.fontFamily.sans,
          fontSize:       "16px",
          fontWeight:     500,
          lineHeight:     "22px",
          color:          disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          cursor:         disabled ? "not-allowed" : "pointer",
          paddingLeft:    tokens.spacing[4],
          paddingRight:   tokens.spacing[4],
          boxShadow:      tokens.shadows.sm,
          ...style,
        }}
      >
        {icon && <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>}
        {label}
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            tokens.spacing[1],
          width:          "100%",
          height:         "48px",
          background:     tokens.color.base.white,
          border:         `1px solid ${disabled ? tokens.color.divider.border : tokens.color.fg.primary}`,
          borderRadius:   tokens.borderRadius.lg,
          fontFamily:     tokens.fontFamily.sans,
          fontSize:       "16px",
          fontWeight:     500,
          lineHeight:     "22px",
          color:          disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          cursor:         disabled ? "not-allowed" : "pointer",
          paddingLeft:    tokens.spacing[3],
          paddingRight:   tokens.spacing[4],
          ...style,
        }}
      >
        {icon && <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>}
        {label}
      </button>
    );
  }

  if (variant === "scan-pill") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          display:        "inline-flex",
          alignItems:     "center",
          justifyContent: "center",
          gap:            tokens.spacing[2],
          height:         "54px",
          background:     disabled ? tokens.color.bg.darkBg : tokens.color.brand.lime,
          borderRadius:   "999px",
          border:         "none",
          fontFamily:     tokens.fontFamily.sans,
          fontSize:       "16px",
          fontWeight:     500,
          lineHeight:     "22px",
          color:          disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          cursor:         disabled ? "not-allowed" : "pointer",
          paddingLeft:    "28px",
          paddingRight:   "28px",
          ...style,
        }}
      >
        {icon && <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>}
        {label}
      </button>
    );
  }

  // card
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          tokens.spacing[2],
        width:        "100%",
        background:   tokens.color.base.white,
        border:       `1px dashed ${tokens.color.divider.border}`,
        borderRadius: "16px",
        cursor:       disabled ? "not-allowed" : "pointer",
        padding:      tokens.spacing[4],
        fontFamily:   tokens.fontFamily.sans,
        ...style,
      }}
    >
      {icon && (
        <div style={{
          width:          "40px",
          height:         "40px",
          flexShrink:     0,
          background:     tokens.color.bg.bg,
          borderRadius:   tokens.borderRadius.lg,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}>
          {icon}
        </div>
      )}
      <span style={{ fontSize: "14px", fontWeight: 500, color: tokens.color.fg.primary }}>
        {label}
      </span>
    </button>
  );
}

export default MobileButton;
