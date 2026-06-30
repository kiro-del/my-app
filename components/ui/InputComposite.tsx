"use client";
// components/ui/InputComposite.tsx
// Figma: Scannable Design System — node 52:1355 / 5837:15854 (Composite / unit input)
// Text input + inline unit selector — no divider between them.

import React, { useState, useRef, useEffect } from "react";
import tokens from "@/styles/design-tokens";
import { ContextMenu } from "@/components/patterns/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UnitOption {
  value: string;
  label: string;
}

export interface CompositeInputProps {
  label?: string;
  placeholder?: string;
  /** Numeric / text value for the left input */
  value?: string;
  onChange?: (value: string) => void;
  /** Unit options */
  unitOptions: UnitOption[];
  /** Controlled selected unit value */
  unitValue?: string;
  onUnitChange?: (value: string) => void;
  /** Placeholder text shown in the unit selector when nothing selected */
  unitPlaceholder?: string;
  errorMessage?: string;
  supportMessage?: string;
  showSupportIcon?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const ChevronDownIcon = ({ color = tokens.color.fg.support }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.5" stroke={tokens.color.bg.red} strokeWidth="1.3" />
    <rect x="7.25" y="4.5" width="1.5" height="4.5" rx="0.75" fill={tokens.color.bg.red} />
    <circle cx="8" cy="11" r="0.75" fill={tokens.color.bg.red} />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 2a4 4 0 0 1 2.4 7.2V11H5.6V9.2A4 4 0 0 1 8 2z"
      stroke={tokens.color.fg.support} strokeWidth="1.2" fill="none" />
    <path d="M6 12.5h4M6.5 14h3"
      stroke={tokens.color.fg.support} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// CompositeInput
// ---------------------------------------------------------------------------

export function CompositeInput({
  label,
  placeholder = "0",
  value,
  onChange,
  unitOptions,
  unitValue,
  onUnitChange,
  unitPlaceholder = "Select unit",
  errorMessage,
  supportMessage,
  showSupportIcon = false,
  disabled = false,
  style,
}: CompositeInputProps) {
  const [isFocused,  setIsFocused]  = useState(false);
  const [unitOpen,   setUnitOpen]   = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isError       = !!errorMessage;
  const selectedUnit  = unitOptions.find(o => o.value === unitValue);
  const isActive      = isFocused || unitOpen;

  // Close unit dropdown on outside click
  useEffect(() => {
    if (!unitOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setUnitOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [unitOpen]);

  // Border — same rules as Input.tsx / SelectInput.tsx
  const borderStyle: React.CSSProperties = isError
    ? { border: `2px solid ${tokens.color.bg.red}` }
    : disabled
    ? { border: `1px solid ${tokens.color.divider.frame}`, background: tokens.color.bg.lightBg }
    : isActive
    ? { border: `2px solid ${tokens.color.divider.blue}` }
    : { border: `1px solid ${tokens.color.divider.frame}` };

  const chevronColor = disabled
    ? tokens.color.fg.disabled
    : isError
    ? tokens.color.fg.red
    : tokens.color.fg.support;

  const unitLabelColor = disabled
    ? tokens.color.fg.disabled
    : selectedUnit
    ? (isError ? tokens.color.fg.red : tokens.color.fg.primary)
    : tokens.color.fg.disabled;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1], width: "100%", ...style }}>

      {/* Label */}
      {label && (
        <label style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    tokens.fontSize.body,
          fontWeight:  tokens.fontWeight.medium,
          lineHeight:  tokens.lineHeight.body,
          color:       tokens.color.fg.primary,
        }}>
          {label}
        </label>
      )}

      {/* Input row — positioned relative for the dropdown */}
      <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            display:      "flex",
            alignItems:   "center",
            width:        "100%",
            height:       "40px",
            paddingLeft:  tokens.spacing[2.5],
            paddingRight: tokens.spacing[2.5],
            gap:          tokens.spacing[2],   // 8px gap between text input + unit group
            background:   (borderStyle.background as string) || tokens.color.base.white,
            borderRadius: tokens.borderRadius.md,
            boxShadow:    tokens.shadows.sm,
            boxSizing:    "border-box" as const,
            transition:   "border-color 150ms ease, box-shadow 150ms ease",
            ...borderStyle,
          }}
        >
          {/* Left: text input */}
          <input
            type="text"
            disabled={disabled}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={e => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              flex:        "1 1 0",
              minWidth:    0,
              border:      "none",
              outline:     "none",
              background:  "transparent",
              padding:     0,
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,
              fontWeight:  tokens.fontWeight.regular,
              lineHeight:  tokens.lineHeight.body,
              color:       disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
              cursor:      disabled ? "not-allowed" : "text",
            }}
          />

          {/* Error icon — shown before unit selector on error */}
          {isError && (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ErrorIcon />
            </span>
          )}

          {/* Right: unit selector button — no divider */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => { if (!disabled) setUnitOpen(o => !o); }}
            style={{
              display:     "flex",
              alignItems:  "center",
              gap:         tokens.spacing[1],   // 4px between label + chevron
              flexShrink:  0,
              border:      "none",
              background:  "transparent",
              padding:     0,
              cursor:      disabled ? "not-allowed" : "pointer",
            }}
          >
            <span style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,
              fontWeight:  tokens.fontWeight.regular,
              lineHeight:  tokens.lineHeight.body,
              color:       unitLabelColor,
              whiteSpace:  "nowrap" as const,
            }}>
              {selectedUnit ? selectedUnit.label : unitPlaceholder}
            </span>
            <ChevronDownIcon color={chevronColor} />
          </button>
        </div>

        {/* Unit dropdown — 148px wide, right-aligned */}
        <ContextMenu
          variant="floating"
          open={unitOpen}
          onClose={() => setUnitOpen(false)}
          width={148}
          floatingStyle={{
            top:   "calc(100% + 4px)",
            right: 0,
            left:  "auto",
            width: "148px",
          }}
        >
          {unitOptions.map(option => (
            <ContextMenuItem
              key={option.value}
              label={option.label}
              state={option.value === unitValue ? "selected" : "default"}
              onClick={() => {
                onUnitChange?.(option.value);
                setUnitOpen(false);
              }}
            />
          ))}
        </ContextMenu>
      </div>

      {/* Support / error message */}
      {(errorMessage || supportMessage) && (
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
          {showSupportIcon && !isError && (
            <span style={{ flexShrink: 0 }} aria-hidden>
              <LightbulbIcon />
            </span>
          )}
          <p style={{
            fontFamily:  tokens.fontFamily.sans,
            fontSize:    tokens.fontSize.bodySmall,
            fontWeight:  tokens.fontWeight.regular,
            lineHeight:  tokens.lineHeight.bodySmall,
            color:       isError ? tokens.color.fg.red : tokens.color.fg.support,
            margin:      0,
          }}>
            {isError ? errorMessage : supportMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default CompositeInput;
