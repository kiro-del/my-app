"use client";

// components/ui/Toggle.tsx
// Figma: Scannable Design System — node 4088:2130 (ToggleInput) · 2044:2532 (Toggle)
// All values reference design-tokens — never hardcoded.

import React, { useId } from "react";
import tokens from "@/styles/design-tokens";

export interface ToggleProps {
  checked:   boolean;
  onChange:  (checked: boolean) => void;
  disabled?: boolean;
  id?:       string;
}

// ---------------------------------------------------------------------------
// ToggleInput — Toggle + label + optional description
// Figma: Scannable Design System — node 4088:2130
// ---------------------------------------------------------------------------
export interface ToggleInputProps {
  label:        string;
  /** Support text — Inter Regular 12px / 16px · fg.support (Figma: Text-sm) */
  description?: string;
  checked:      boolean;
  onChange:     (checked: boolean) => void;
  disabled?:    boolean;
  id?:          string;
}

export function ToggleInput({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  id,
}: ToggleInputProps) {
  return (
    <div
      style={{
        display:    "flex",
        gap:        tokens.spacing[2],     // 8px
        alignItems: description ? "flex-start" : "center",
      }}
    >
      {/* Label + description */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        <span
          style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,       // 14px
            fontWeight: tokens.fontWeight.regular,  // 400
            lineHeight: tokens.lineHeight.body,     // 20px
            color:      disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
          }}
        >
          {label}
        </span>
        {description && (
          <span
            style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.bodySmall,      // 12px — Figma: Text-sm
              fontWeight: tokens.fontWeight.regular,      // 400
              lineHeight: tokens.lineHeight.bodySmall,    // 16px
              color:      disabled ? tokens.color.fg.disabled : tokens.color.fg.support,
            }}
          >
            {description}
          </span>
        )}
      </div>

      {/* Toggle control */}
      <Toggle checked={checked} onChange={onChange} disabled={disabled} id={id} />
    </div>
  );
}

export function Toggle({ checked, onChange, disabled = false, id }: ToggleProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      htmlFor={inputId}
      style={{
        display:  "inline-flex",
        cursor:   disabled ? "not-allowed" : "pointer",
        opacity:  disabled ? 0.5 : 1,
      }}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        aria-checked={checked}
      />
      {/* Track */}
      <span
        style={{
          position:        "relative",
          display:         "inline-block",
          width:           "44px",
          height:          "24px",
          borderRadius:    tokens.borderRadius.full,
          background:      checked ? tokens.color.bg.blue : tokens.color.bg.darkBg,
          transition:      "background 150ms ease",
          flexShrink:      0,
        }}
      >
        {/* Thumb */}
        <span
          style={{
            position:     "absolute",
            top:          "2px",
            left:         checked ? "22px" : "2px",
            width:        "20px",
            height:       "20px",
            borderRadius: tokens.borderRadius.full,
            background:   tokens.color.base.white,
            boxShadow:    tokens.shadows.sm,
            transition:   "left 150ms ease",
          }}
        />
      </span>
    </label>
  );
}
