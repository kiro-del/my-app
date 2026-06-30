"use client";
// components/ui/mobile/InputScanDark.tsx
// Dark-background variant of mobile/InputScan.
// Same layout and ScanButton, colours flipped for dark gradient backgrounds.

import React, { useState } from "react";
import tokens from "@/styles/design-tokens";
import { IconClose } from "@/components/icons";
import { ScanButton } from "@/components/patterns/ScanSimulationSheet";

const DARK_BG     = "rgba(255,255,255,0.12)";
const DARK_BORDER = "1px solid rgba(255,255,255,0.2)";
const TEXT_WHITE  = "#ffffff";
const TEXT_DIM    = "rgba(255,255,255,0.45)";

export interface InputScanDarkProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onScan?: () => void;
  disabled?: boolean;
}

export function InputScanDark({
  value,
  onChange,
  placeholder = "Search by name, SKU or brand…",
  onScan,
  disabled,
}: InputScanDarkProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled  = value !== undefined;
  const currentValue  = isControlled ? value! : internalValue;
  const showClear     = currentValue.length > 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  }

  function handleClear() {
    if (!isControlled) setInternalValue("");
    const el = document.createElement("input");
    Object.defineProperty(el, "value", { value: "" });
    onChange?.({ target: el } as React.ChangeEvent<HTMLInputElement>);
  }

  const searchIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke={TEXT_DIM} strokeWidth="1.5" />
      <path d="M16.5 16.5l3.5 3.5" stroke={TEXT_DIM} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  const scanBtn = React.isValidElement(<ScanButton onClick={onScan} disabled={disabled} />)
    ? React.cloneElement(
        <ScanButton onClick={onScan} disabled={disabled} />,
        {
          style: {
            borderTopRightRadius:    tokens.borderRadius.lg,
            borderBottomRightRadius: tokens.borderRadius.lg,
          },
        } as { style: React.CSSProperties }
      )
    : <ScanButton onClick={onScan} disabled={disabled} />;

  return (
    <div style={{
      display:   "flex",
      width:     "100%",
      height:    "48px",
      boxSizing: "border-box",
    }}>
      {/* Left: input area */}
      <div style={{
        display:                "flex",
        flex:                   1,
        alignItems:             "center",
        gap:                    tokens.spacing[2],
        paddingLeft:            tokens.spacing[2.5],
        paddingRight:           tokens.spacing[2.5],
        borderTopLeftRadius:    tokens.borderRadius.lg,
        borderBottomLeftRadius: tokens.borderRadius.lg,
        background:             DARK_BG,
        border:                 DARK_BORDER,
        borderRight:            "none",
        overflow:               "hidden",
        minWidth:               0,
        boxSizing:              "border-box",
      }}>
        <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden>
          {searchIcon}
        </span>
        <input
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex:       1,
            minWidth:   0,
            background: "transparent",
            border:     "none",
            outline:    "none",
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.body,
            color:      TEXT_WHITE,
          }}
        />
        {showClear && (
          <button type="button" onClick={handleClear} aria-label="Clear"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}
          >
            <IconClose size={24} color={TEXT_DIM} />
          </button>
        )}
      </div>

      {/* Right: ScanButton */}
      <div style={{ display: "flex", alignItems: "stretch", flexShrink: 0 }}>
        {scanBtn}
      </div>
    </div>
  );
}

export default InputScanDark;
