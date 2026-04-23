"use client";

// components/ui/ToggleInput.tsx
// Label + optional description row with Toggle on the right.

import React, { useId } from "react";
import tokens from "@/styles/design-tokens";
import { Toggle } from "./Toggle";

export interface ToggleInputProps {
  label:        string;
  description?: string;
  checked:      boolean;
  onChange:     (checked: boolean) => void;
  disabled?:    boolean;
}

export function ToggleInput({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleInputProps) {
  const id = useId();

  return (
    <div
      style={{
        display:        "flex",
        alignItems:     description ? "flex-start" : "center",
        justifyContent: "space-between",
        gap:            "16px",
        padding:        "12px 0",
      }}
    >
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
        <label
          htmlFor={id}
          style={{
            display:    "block",
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.body,
            color:      disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
            cursor:     disabled ? "not-allowed" : "pointer",
          }}
        >
          {label}
        </label>
        {description && (
          <p
            style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.bodySmall,   // 12px
              fontWeight: tokens.fontWeight.regular,
              lineHeight: tokens.lineHeight.bodySmall, // 16px
              color:      disabled ? tokens.color.fg.disabled : tokens.color.fg.support,
              margin:     0,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Toggle */}
      <Toggle id={id} checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}
