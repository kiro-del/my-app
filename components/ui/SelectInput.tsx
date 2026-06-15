"use client";
// components/ui/SelectInput.tsx
// Figma: Scannable Design System — node 51:1093 (Dropdown / Select)
// Shares border-state logic with Input.tsx — all values from design-tokens.

import React, { useState, useRef, useEffect } from "react";
import tokens from "@/styles/design-tokens";
import { ContextMenu } from "@/components/patterns/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputProps {
  label?: string;
  placeholder?: string;
  /** Option list — {value, label} pairs */
  options: SelectOption[];
  /** Controlled selected value */
  value?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  supportMessage?: string;
  showSupportIcon?: boolean;
  disabled?: boolean;
  /** Extra style on the root wrapper */
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Icons (inline — same shapes as Input.tsx)
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
// SelectInput
// ---------------------------------------------------------------------------

export function SelectInput({
  label,
  placeholder = "Placeholder",
  options,
  value,
  onChange,
  errorMessage,
  supportMessage,
  showSupportIcon = false,
  disabled = false,
  style,
}: SelectInputProps) {
  const [open,      setOpen]      = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isError        = !!errorMessage;
  const selectedOption = options.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Border — identical rules to Input.tsx
  const borderStyle: React.CSSProperties = isError
    ? { border: `2px solid ${tokens.color.bg.red}` }
    : disabled
    ? { border: `1px solid ${tokens.color.divider.frame}`, background: tokens.color.bg.lightBg }
    : (isFocused || open)
    ? { border: `2px solid ${tokens.color.divider.blue}` }
    : { border: `1px solid ${tokens.color.divider.frame}` };

  const chevronColor = disabled ? tokens.color.fg.disabled : tokens.color.fg.support;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1], width: "100%", ...style }}>

      {/* Label — body-M, fg/primary */}
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

      {/* Trigger + floating dropdown — positioned relative */}
      <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => { if (!disabled) { setOpen(o => !o); setIsFocused(true); } }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { if (!open) setIsFocused(false); }}
          style={{
            display:       "flex",
            alignItems:    "center",
            width:         "100%",
            height:        "40px",
            paddingLeft:   tokens.spacing[2.5],
            paddingRight:  0,
            background:    (borderStyle.background as string) || tokens.color.base.white,
            borderRadius:  tokens.borderRadius.md,
            boxShadow:     tokens.shadows.sm,
            cursor:        disabled ? "not-allowed" : "pointer",
            boxSizing:     "border-box" as const,
            transition:    "border-color 150ms ease, box-shadow 150ms ease",
            ...borderStyle,
          }}
        >
          {/* Value or placeholder */}
          <span style={{
            flex:         "1 1 0",
            minWidth:     0,
            textAlign:    "left",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap" as const,
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.body,
            fontWeight:   tokens.fontWeight.regular,
            lineHeight:   tokens.lineHeight.body,
            color:        selectedOption
              ? (disabled ? tokens.color.fg.disabled : tokens.color.fg.primary)
              : tokens.color.fg.disabled,
          }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {/* Right side: [error icon?] [1px divider] [chevron] */}
          {/* Figma: divider = bg/gray-200, 1px wide, full height; chevron 16px */}
          <div style={{
            display:      "flex",
            alignItems:   "center",
            alignSelf:    "stretch",
            paddingRight: tokens.spacing[2.5],
            gap:          tokens.spacing[2],
          }}>
            {isError && (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ErrorIcon />
              </span>
            )}
            {/* 1px vertical divider — Figma: bg-[var(--gray/200,#e5e7eb)] h-full w-px */}
            <div style={{
              width:      "1px",
              alignSelf:  "stretch",
              background: tokens.color.divider.frame,
              flexShrink: 0,
            }} />
            <ChevronDownIcon color={chevronColor} />
          </div>
        </button>

        {/* Dropdown list — floatingStyle overrides ContextMenu's fixed width */}
        <ContextMenu
          variant="floating"
          open={open}
          onClose={() => { setOpen(false); setIsFocused(false); }}
          floatingStyle={{
            top:   "calc(100% + 4px)",
            left:  0,
            right: 0,
            width: "auto",
          }}
        >
          {options.map(option => (
            <ContextMenuItem
              key={option.value}
              label={option.label}
              state={option.value === value ? "selected" : "default"}
              onClick={() => {
                onChange?.(option.value);
                setOpen(false);
                setIsFocused(false);
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

export default SelectInput;
