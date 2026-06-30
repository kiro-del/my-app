"use client";
// components/ui/InputCalendar.tsx
// CalendarIcon + InputCalendar wrapper (40px default height, 6px border-radius).

import React, { useRef } from "react";
import tokens from "@/styles/design-tokens";
import { Input, type InputProps } from "@/components/ui/Input";

// ── CalendarIcon — 24px (Figma node 2150:1814) ───────────────────────────────

export function CalendarIcon({ color = tokens.color.fg.primary }: { color?: string }) {
  return (
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
}

// ── InputCalendar ─────────────────────────────────────────────────────────────

export interface InputCalendarProps extends Omit<InputProps, "inputSize" | "type" | "tailingIcon"> {}

export function InputCalendar({ disabled, ...rest }: InputCalendarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const iconColor = disabled ? tokens.color.fg.disabled : tokens.color.fg.primary;

  const tailingIcon = (
    <span
      style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "not-allowed" : "pointer" }}
      onClick={() => inputRef.current?.showPicker?.()}
      aria-hidden
    >
      <CalendarIcon color={iconColor} />
    </span>
  );

  return (
    <Input
      ref={inputRef}
      type="date"
      inputSize="Default"
      tailingIcon={tailingIcon}
      disabled={disabled}
      {...rest}
    />
  );
}

export default InputCalendar;
