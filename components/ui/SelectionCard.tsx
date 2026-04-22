// components/ui/SelectionCard.tsx
// Figma: Scannable Design System — node 2448:1886 (Radio and checkbox input cards)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";
import { RadioIndicator } from "./Radio";
import { CheckboxIndicator } from "./Checkbox";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type SelectionCardType = "radio" | "checkbox";

export interface SelectionCardProps {
  /** "radio" renders a 20px circle indicator; "checkbox" renders a 16px square */
  type?: SelectionCardType;
  checked?: boolean;
  /** Indeterminate state — checkbox only */
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  id?: string;
  /** Primary card label — Inter Medium 14px */
  label: string;
  /** Optional secondary description — Inter Regular 14px fg.support */
  description?: string;
  /** Optional metadata line — Inter Regular 12px fg.primary (below description) */
  meta?: string;
  /** Optional badge/chip rendered at the right of the label row — indigo-50 bg, indigo-700 text */
  badge?: string;
  /** Optional icon rendered to the right of the text area */
  trailingIcon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// SelectionCard
// ---------------------------------------------------------------------------
export function SelectionCard({
  type = "radio",
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  name,
  value,
  id,
  label,
  description,
  meta,
  badge,
  trailingIcon,
}: SelectionCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const inputId = id || `selection-card-${name || ""}-${value || label}`;

  // ---------------------------------------------------------------------------
  // Card states — confirmed from Figma nodes 2448:1907 (default selected)
  //   and 2448:1918 (hover selected):
  // default unchecked  → white bg,        1px gray-300 border
  // hover unchecked    → gray-50 bg,       1px gray-300 border
  // default checked    → white bg,         2px indigo-500 border
  // hover checked      → indigo-50 bg,     2px indigo-500 border
  // disabled           → gray-50 bg,       1px gray-200 border
  // ---------------------------------------------------------------------------
  const borderColor = disabled
    ? tokens.color.divider.border   // gray-200 #e5e7eb
    : checked
    ? tokens.color.divider.blue     // indigo-500 #6366f1
    : tokens.color.divider.frame;   // gray-300 #d1d5db (all unchecked states)

  const borderWidth = checked ? "2px" : "1px";

  const bg = disabled
    ? tokens.color.bg.lightBg                     // gray-50 #f9fafb
    : checked && hovered
    ? tokens.color.tint.blue                      // indigo-50 #eef2ff (hover+checked)
    : checked
    ? tokens.color.base.white                     // white (default checked)
    : hovered
    ? tokens.color.bg.lightBg                     // gray-50 (hover unchecked)
    : tokens.color.base.white;

  return (
    <label
      htmlFor={inputId}
      style={{
        display: "flex",
        alignItems: (description || meta) ? "flex-start" : "center",
        gap: tokens.spacing[3],            // 12px between control and text
        padding: tokens.spacing[4],        // 16px all sides
        borderRadius: tokens.borderRadius.lg,  // 8px
        border: `${borderWidth} solid ${borderColor}`,
        background: bg,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 150ms ease, border-color 150ms ease, border-width 150ms ease",
        width: "100%",
        boxSizing: "border-box" as const,
        userSelect: "none" as const,
        position: "relative" as const,
      }}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Native input — invisible, handles a11y + browser form semantics */}
      {type === "radio" ? (
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
        />
      ) : (
        <input
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : checked}
          onChange={(e) => onChange?.(e.target.checked)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Visual control indicator — pure visual, no inner input */}
      <div
        style={{
          flexShrink: 0,
          // Align indicator to text baseline when description is present
          paddingTop: description ? "2px" : "0",
        }}
      >
        {type === "radio" ? (
          <RadioIndicator
            checked={checked}
            disabled={disabled}
            hovered={hovered}
            focused={focused}
          />
        ) : (
          <CheckboxIndicator
            checked={checked}
            indeterminate={indeterminate}
            disabled={disabled}
            hovered={hovered}
            focused={focused}
          />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label row — badge floats to the right when present */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: badge ? "space-between" : undefined, gap: badge ? tokens.spacing[2] : undefined }}>
          <span
            style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize: tokens.fontSize.body,        // 14px
              fontWeight: tokens.fontWeight.medium,  // 500
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
              fontSize: tokens.fontSize.body,           // 14px
              fontWeight: tokens.fontWeight.regular,    // 400
              lineHeight: tokens.lineHeight.body,       // 20px
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
      </div>

      {/* Optional trailing icon */}
      {trailingIcon && (
        <div
          style={{
            flexShrink: 0,
            opacity: disabled ? 0.4 : 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {trailingIcon}
        </div>
      )}
    </label>
  );
}

// ---------------------------------------------------------------------------
// SelectionCardGroup — convenience wrapper for a set of cards
// ---------------------------------------------------------------------------
export interface SelectionCardGroupProps {
  type?: SelectionCardType;
  name: string;
  value?: string | string[];       // string for radio, string[] for checkbox
  onChange?: (value: string, checked: boolean) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    meta?: string;
    badge?: string;
    trailingIcon?: React.ReactNode;
    disabled?: boolean;
  }>;
  columns?: 1 | 2 | 3;
  disabled?: boolean;
}

export function SelectionCardGroup({
  type = "radio",
  name,
  value,
  onChange,
  options,
  columns = 1,
  disabled: groupDisabled = false,
}: SelectionCardGroupProps) {
  function isChecked(optValue: string) {
    if (type === "radio") return value === optValue;
    return Array.isArray(value) ? value.includes(optValue) : false;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: tokens.spacing[3],   // 12px
      }}
    >
      {options.map((opt) => (
        <SelectionCard
          key={opt.value}
          type={type}
          name={name}
          value={opt.value}
          checked={isChecked(opt.value)}
          disabled={groupDisabled || opt.disabled}
          label={opt.label}
          description={opt.description}
          meta={opt.meta}
          badge={opt.badge}
          trailingIcon={opt.trailingIcon}
          onChange={(checked) => onChange?.(opt.value, checked)}
        />
      ))}
    </div>
  );
}

export default SelectionCard;
