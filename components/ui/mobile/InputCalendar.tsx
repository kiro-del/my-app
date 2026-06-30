"use client";
// components/ui/mobile/InputCalendar.tsx
// Mobile date input — 48px height (12px top+bottom + 24px icon), 8px border-radius.
// Keep separate from components/ui/InputCalendar.tsx.

import React, { useRef, useState } from "react";
import tokens from "@/styles/design-tokens";

const CalendarIcon = ({ color = tokens.color.fg.primary }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M8 3V7M16 3V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 10H21" stroke={color} strokeWidth="1.5" />
    <circle cx="8"  cy="14" r="1" fill={color} />
    <circle cx="12" cy="14" r="1" fill={color} />
    <circle cx="16" cy="14" r="1" fill={color} />
    <circle cx="8"  cy="18" r="1" fill={color} />
    <circle cx="12" cy="18" r="1" fill={color} />
    <circle cx="16" cy="18" r="1" fill={color} />
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

export interface InputCalendarProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  errorMessage?: string;
  supportMessage?: string;
  showSupportIcon?: boolean;
}

export function InputCalendar({
  label,
  placeholder = "Select date",
  value,
  onChange,
  disabled,
  errorMessage,
  supportMessage,
  showSupportIcon = false,
}: InputCalendarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const isError = !!errorMessage;
  const iconColor = disabled ? tokens.color.fg.disabled : tokens.color.fg.primary;

  const borderStyle: React.CSSProperties = isError
    ? { border: `2px solid ${tokens.color.bg.red}` }
    : disabled
    ? { border: `1px solid ${tokens.color.divider.frame}`, background: tokens.color.bg.lightBg }
    : isFocused
    ? { border: `2px solid ${tokens.color.divider.blue}` }
    : { border: `1px solid ${tokens.color.divider.frame}` };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1], width: "100%" }}>
      <style>{`.mobile-cal-input::-webkit-calendar-picker-indicator { display: none; }`}</style>
      {label && (
        <label style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize: tokens.fontSize.body,
          fontWeight: tokens.fontWeight.medium,
          lineHeight: tokens.lineHeight.body,
          color: tokens.color.fg.primary,
        }}>
          {label}
        </label>
      )}

      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: tokens.spacing[2],
        paddingLeft: tokens.spacing[2.5],
        paddingRight: tokens.spacing[2.5],
        paddingTop: "12px",
        paddingBottom: "12px",
        alignItems: "center",
        borderRadius: tokens.borderRadius.lg,
        background: borderStyle.background || tokens.color.base.white,
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box" as const,
        boxShadow: tokens.shadows.sm,
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        ...borderStyle,
      }}>
        <input
          ref={inputRef}
          type="date"
          className="mobile-cal-input"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: tokens.fontFamily.sans,
            fontSize: tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.body,
            color: disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        <span
          style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "not-allowed" : "pointer" }}
          onClick={() => inputRef.current?.showPicker?.()}
          aria-hidden
        >
          <CalendarIcon color={iconColor} />
        </span>
      </div>

      {(errorMessage || supportMessage) && (
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
          {showSupportIcon && !isError && (
            <span style={{ flexShrink: 0 }} aria-hidden>
              <LightbulbIcon />
            </span>
          )}
          <p style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize: tokens.fontSize.bodySmall,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.bodySmall,
            color: isError ? tokens.color.fg.red : tokens.color.fg.support,
            margin: 0,
          }}>
            {isError ? errorMessage : supportMessage}
          </p>
        </div>
      )}
    </div>
  );
}

export default InputCalendar;
