// components/ui/Radio.tsx
// Figma: Scannable Design System — node 35:1161 (Radio buttons) · 2172:2525 (Radio inputs)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RadioButtonProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  id?: string;
  /** aria-label for icon-only usage */
  "aria-label"?: string;
}

export interface RadioInputProps extends RadioButtonProps {
  label?: string;
  description?: string;
  /** Secondary metadata line — Inter Regular 12px / 16px · fg.primary */
  meta?: string;
  /** Optional badge/chip rendered inline after the label — indigo-50 bg, indigo-700 text */
  badge?: string;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string; meta?: string; badge?: string; disabled?: boolean }>;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// RadioIndicator — purely visual circle, no native input
// Used internally by RadioButton and by SelectionCard.
// ---------------------------------------------------------------------------
export function RadioIndicator({
  checked = false,
  disabled = false,
  hovered = false,
  focused = false,
}: {
  checked?: boolean;
  disabled?: boolean;
  hovered?: boolean;
  focused?: boolean;
}) {
  // States confirmed from Figma node 35:1161:
  // disabled+checked  → gray-400 fill (#9ca3af), white inner dot
  // disabled+unchecked → gray-100 bg (#f3f4f6), gray-300 border, opacity 50%
  // checked+focus     → indigo-500 fill, blue focus ring
  // checked default/hover → indigo-500 fill, no ring
  // unchecked hover/focus → white bg, gray-300 border, grey focus ring
  // unchecked default → white bg, gray-300 border

  const bg = (disabled && checked)
    ? tokens.color.fg.disabled       // gray-400 #9ca3af — full circle
    : disabled
    ? tokens.color.bg.bg             // gray-100 #f3f4f6
    : checked
    ? tokens.color.bg.blue           // indigo-500 #6366f1
    : tokens.color.base.white;

  // Figma 35:1161 — disabled+unchecked still shows gray-300 border (opacity 0.5 on whole indicator)
  const border = checked ? "none" : `1.5px solid ${tokens.color.divider.frame}`;
  const opacity = (disabled && !checked) ? 0.5 : 1;

  // Focus ring
  let shadow: string | undefined;
  if (!disabled) {
    if (checked && focused)           shadow = tokens.shadows.focusBlue;
    else if (!checked && (hovered || focused)) shadow = tokens.shadows.focusGrey;
  }

  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "16px",
        height: "16px",
        borderRadius: "8px",          // 8px = half of 16px → circle
        background: bg,
        border,
        boxShadow: shadow,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 150ms ease, box-shadow 150ms ease, opacity 150ms ease",
        flexShrink: 0,
        pointerEvents: "none",
      }}
    >
      {checked && (
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "3px",
            background: tokens.color.base.white,  // always white dot (visible on gray-400 or indigo-500)
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RadioButton — self-contained accessible radio control
// ---------------------------------------------------------------------------
export function RadioButton({
  checked = false,
  disabled = false,
  onChange,
  name,
  value,
  id,
  "aria-label": ariaLabel,
}: RadioButtonProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  return (
    <div
      style={{ position: "relative", width: "16px", height: "16px", flexShrink: 0 }}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Native input — invisible, handles a11y + browser semantics */}
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange?.(e.target.checked)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: disabled ? "not-allowed" : "pointer",
          margin: 0,
          zIndex: 1,
        }}
      />
      {/* Visual */}
      <RadioIndicator checked={checked} disabled={disabled} hovered={hovered} focused={focused} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// RadioInput — RadioButton + label + optional description
// ---------------------------------------------------------------------------
export function RadioInput({
  label,
  description,
  meta,
  badge,
  checked = false,
  disabled = false,
  onChange,
  name,
  value,
  id,
}: RadioInputProps) {
  const inputId = id || `radio-${name}-${value}`;
  const hasDesc = Boolean(description);

  return (
    <div
      style={{
        display: "flex",
        alignItems: hasDesc ? "flex-start" : "center",
        gap: tokens.spacing[2],         // 8px
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {/* Offset the indicator to align with first line of text */}
      <div style={{ paddingTop: hasDesc ? "2px" : "0", flexShrink: 0 }}>
        <RadioButton
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          name={name}
          value={value}
          id={inputId}
        />
      </div>

      {label && (
        <label
          htmlFor={inputId}
          style={{ cursor: disabled ? "not-allowed" : "pointer", userSelect: "none", flex: 1, minWidth: 0 }}
        >
          {/* Label row — badge floats to the right when present */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: badge ? "space-between" : undefined, gap: badge ? tokens.spacing[2] : undefined }}>
            <span
              style={{
                fontFamily: tokens.fontFamily.sans,
                fontSize: tokens.fontSize.body,        // 14px
                fontWeight: tokens.fontWeight.regular, // 400
                lineHeight: tokens.lineHeight.body,    // 20px
                color: disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
              }}
            >
              {label}
            </span>
            {badge && (
              <span
                style={{
                  fontFamily: tokens.fontFamily.sans,
                  fontSize: "12px",
                  fontWeight: tokens.fontWeight.semiBold,   // 600
                  lineHeight: "16px",
                  color: tokens.color.fg.blue,              // indigo-700 #4338ca
                  background: tokens.color.tint.blue,       // indigo-50 #eef2ff
                  padding: "2px 8px",
                  borderRadius: "13px",
                  flexShrink: 0,
                  whiteSpace: "nowrap" as const,
                }}
              >
                {badge}
              </span>
            )}
          </div>
          {description && (
            <span
              style={{
                display: "block",
                fontFamily: tokens.fontFamily.sans,
                fontSize: tokens.fontSize.bodySmall,      // 12px
                fontWeight: tokens.fontWeight.regular,    // 400
                lineHeight: tokens.lineHeight.bodySmall,  // 16px
                color: disabled ? tokens.color.fg.disabled : tokens.color.fg.support,
                marginTop: tokens.spacing[1],             // 4px
              }}
            >
              {description}
            </span>
          )}
          {meta && (
            <span
              style={{
                display: "block",
                fontFamily: tokens.fontFamily.sans,
                fontSize: "12px",                         // smaller than description
                fontWeight: tokens.fontWeight.regular,    // 400
                lineHeight: "16px",
                color: disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
                marginTop: "2px",
              }}
            >
              {meta}
            </span>
          )}
        </label>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RadioGroup — managed group of RadioInputs
// ---------------------------------------------------------------------------
export function RadioGroup({
  name,
  value,
  onChange,
  options,
  direction = "vertical",
  disabled: groupDisabled = false,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        gap: direction === "horizontal" ? tokens.spacing[6] : tokens.spacing[3],  // 24px / 12px
        flexWrap: direction === "horizontal" ? "wrap" : undefined,
      }}
    >
      {options.map((opt) => (
        <RadioInput
          key={opt.value}
          name={name}
          value={opt.value}
          checked={value === opt.value}
          disabled={groupDisabled || opt.disabled}
          label={opt.label}
          description={opt.description}
          meta={opt.meta}
          badge={opt.badge}
          onChange={() => onChange?.(opt.value)}
        />
      ))}
    </div>
  );
}

export default RadioInput;
