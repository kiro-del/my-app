"use client";

import React from "react";
import tokens from "@/styles/design-tokens";

// ── Types ─────────────────────────────────────────────────────────────────────

export type MobileButtonVariant = "primary" | "outline" | "scan-pill" | "card";

interface BaseProps {
  label:     string;
  onClick?:  () => void;
  disabled?: boolean;
  style?:    React.CSSProperties;
  type?:     "button" | "submit" | "reset";
}

export interface MobileButtonProps extends BaseProps {
  variant?: MobileButtonVariant;
  /** Leading icon node (16px for primary/outline, 24px for scan-pill/card) */
  icon?:    React.ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────

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
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          gap:             tokens.spacing[2],
          width:           "100%",
          height:          "48px",
          background:      disabled ? tokens.color.bg.darkBg : tokens.color.brand.lime,
          borderRadius:    "8px",
          border:          "none",
          fontFamily:      tokens.fontFamily.sans,
          fontSize:        "16px",
          fontWeight:      500,
          lineHeight:      "22px",
          color:           disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          cursor:          disabled ? "not-allowed" : "pointer",
          paddingLeft:     "16px",
          paddingRight:    "16px",
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
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          gap:             "4px",
          width:           "100%",
          height:          "48px",
          background:      tokens.color.base.white,
          border:          `1px solid ${disabled ? tokens.color.divider.border : tokens.color.fg.primary}`,
          borderRadius:    "8px",
          fontFamily:      tokens.fontFamily.sans,
          fontSize:        "16px",
          fontWeight:      500,
          lineHeight:      "22px",
          color:           disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          cursor:          disabled ? "not-allowed" : "pointer",
          paddingLeft:     "12px",
          paddingRight:    "16px",
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
          display:         "inline-flex",
          alignItems:      "center",
          justifyContent:  "center",
          gap:             "8px",
          height:          "54px",
          background:      disabled ? tokens.color.bg.darkBg : tokens.color.brand.lime,
          borderRadius:    "999px",
          border:          "none",
          fontFamily:      tokens.fontFamily.sans,
          fontSize:        "16px",
          fontWeight:      500,
          lineHeight:      "22px",
          color:           disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          cursor:          disabled ? "not-allowed" : "pointer",
          paddingLeft:     "28px",
          paddingRight:    "28px",
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
        gap:          "8px",
        width:        "100%",
        background:   tokens.color.base.white,
        border:       `1px dashed ${tokens.color.divider.border}`,
        borderRadius: "16px",
        cursor:       disabled ? "not-allowed" : "pointer",
        padding:      "16px",
        fontFamily:   tokens.fontFamily.sans,
        ...style,
      }}
    >
      {icon && (
        <div style={{
          width:           "40px",
          height:          "40px",
          flexShrink:      0,
          background:      tokens.color.bg.bg,
          borderRadius:    "8px",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
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
