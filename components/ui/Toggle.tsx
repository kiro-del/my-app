"use client";

// components/ui/Toggle.tsx

import React, { useId } from "react";
import tokens from "@/styles/design-tokens";

export interface ToggleProps {
  checked:   boolean;
  onChange:  (checked: boolean) => void;
  disabled?: boolean;
  id?:       string;
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
