// components/ui/Checkbox.tsx
// Figma: Scannable Design System — node 35:1151 (Checkbox) · 35:1462 (Checkbox input)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  id?: string;
  "aria-label"?: string;
}

export interface CheckboxInputProps extends CheckboxProps {
  label?: string;
  description?: string;
}

export interface CheckboxGroupProps {
  name?: string;
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean; checked?: boolean }>;
  onChange?: (value: string, checked: boolean) => void;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Built-in SVG marks — 16px viewport to match control size
// ---------------------------------------------------------------------------
const CheckMark = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
    <path
      d="M1 4L3.5 6.5L9 1"
      stroke={tokens.color.base.white}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DashMark = () => (
  <svg width="8" height="2" viewBox="0 0 8 2" fill="none" aria-hidden>
    <path
      d="M1 1H7"
      stroke={tokens.color.base.white}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// CheckboxIndicator — purely visual box, no native input
// Used internally by Checkbox and by SelectionCard.
// ---------------------------------------------------------------------------
export function CheckboxIndicator({
  checked = false,
  indeterminate = false,
  disabled = false,
  hovered = false,
  focused = false,
}: {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  hovered?: boolean;
  focused?: boolean;
}) {
  const isActive = checked || indeterminate;

  // States from Figma node 35:1151:
  // disabled+checked/indeterminate → gray-400 bg + border (white mark on top)
  // disabled+unchecked             → gray-200 bg, gray-300 border, opacity 0.5
  // checked/indeterminate          → indigo-500 bg + border
  // hover/focus unchecked          → white bg, gray-300 border
  // default unchecked              → white bg, gray-300 border
  const bg = (disabled && isActive)
    ? tokens.color.fg.disabled       // gray-400 #9ca3af
    : disabled
    ? tokens.color.bg.darkBg         // gray-200 #e5e7eb
    : isActive
    ? tokens.color.bg.blue           // indigo-500 #6366f1
    : tokens.color.base.white;

  const border = (disabled && isActive)
    ? tokens.color.fg.disabled       // gray-400 — matches bg
    : disabled
    ? tokens.color.divider.frame     // gray-300
    : isActive
    ? tokens.color.bg.blue           // indigo-500
    : tokens.color.divider.frame;    // gray-300 (default, hover, focus)

  const opacity = (disabled && !isActive) ? 0.5 : 1;

  // Focus ring: checked+focused → blue ring, unchecked+(hover||focus) → grey ring
  let shadow: string | undefined;
  if (!disabled) {
    if (isActive && focused)                    shadow = tokens.shadows.focusBlue;
    else if (!isActive && (hovered || focused)) shadow = tokens.shadows.focusGrey;
  }

  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "16px",
        height: "16px",
        borderRadius: tokens.borderRadius.sm,  // 4px
        background: bg,
        border: `1.5px solid ${border}`,
        boxShadow: shadow,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
        flexShrink: 0,
        pointerEvents: "none",
      }}
    >
      {!disabled && indeterminate && <DashMark />}
      {!disabled && checked && !indeterminate && <CheckMark />}
      {/* Disabled+active: white mark on gray-400 bg (same SVG paths as active state) */}
      {disabled && isActive && (
        <svg width={indeterminate ? 8 : 10} height={indeterminate ? 2 : 8} viewBox={indeterminate ? "0 0 8 2" : "0 0 10 8"} fill="none" aria-hidden>
          {indeterminate ? (
            <path d="M1 1H7" stroke={tokens.color.base.white} strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M1 4L3.5 6.5L9 1" stroke={tokens.color.base.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkbox — self-contained accessible checkbox control
// ---------------------------------------------------------------------------
export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  name,
  value,
  id,
  "aria-label": ariaLabel,
}: CheckboxProps) {
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
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-checked={indeterminate ? "mixed" : checked}
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
      <CheckboxIndicator
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        hovered={hovered}
        focused={focused}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CheckboxInput — Checkbox + label + optional description
// ---------------------------------------------------------------------------
export function CheckboxInput({
  label,
  description,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  name,
  value,
  id,
}: CheckboxInputProps) {
  const inputId = id || `checkbox-${name || ""}-${value || label || Math.random().toString(36).slice(2)}`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: description ? "flex-start" : "center",
        gap: tokens.spacing[2],          // 8px
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {/* Align control to first text baseline */}
      <div style={{ paddingTop: description ? "2px" : "0", flexShrink: 0 }}>
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
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
          style={{ cursor: disabled ? "not-allowed" : "pointer", userSelect: "none" }}
        >
          <span
            style={{
              display: "block",
              fontFamily: tokens.fontFamily.sans,
              fontSize: tokens.fontSize.body,        // 14px
              fontWeight: tokens.fontWeight.regular,  // 400
              lineHeight: tokens.lineHeight.body,    // 20px
              color: disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
            }}
          >
            {label}
          </span>
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
        </label>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CheckboxGroup — managed list of CheckboxInputs
// ---------------------------------------------------------------------------
export function CheckboxGroup({
  name,
  options,
  onChange,
  direction = "vertical",
  disabled: groupDisabled = false,
}: CheckboxGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        gap: direction === "horizontal" ? tokens.spacing[6] : tokens.spacing[3],  // 24px / 12px
        flexWrap: direction === "horizontal" ? "wrap" : undefined,
      }}
    >
      {options.map((opt) => (
        <CheckboxInput
          key={opt.value}
          name={name}
          value={opt.value}
          checked={opt.checked ?? false}
          disabled={groupDisabled || opt.disabled}
          label={opt.label}
          description={opt.description}
          onChange={(c) => onChange?.(opt.value, c)}
        />
      ))}
    </div>
  );
}

export default CheckboxInput;
