"use client";

// components/ui/InputScan.tsx
// Convenience wrapper: Input + ScanButton pre-wired.
// Owns the inlineButton, onClear, and disabled forwarding so callers
// only need to think about value, onChange, and onScan.

import React from "react";
import { Input, type InputProps } from "@/components/ui/Input";
import { ScanButton } from "@/components/patterns/ScanSimulationSheet";

export interface ScanInputProps
  extends Omit<InputProps, "inlineButton" | "onClear" | "tailingIcon"> {
  /** Called when the Scan button is clicked */
  onScan?: () => void;
}

export function ScanInput({ onScan, value, onChange, disabled, ...rest }: ScanInputProps) {
  const [internalValue, setInternalValue] = React.useState("");

  // Support both controlled (value + onChange) and uncontrolled usage
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as string) : internalValue;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  }

  function handleClear() {
    if (!isControlled) setInternalValue("");
    // Fire a synthetic change event so controlled parents can reset their state
    const nativeInput = document.createElement("input");
    Object.defineProperty(nativeInput, "value", { value: "" });
    onChange?.({ target: nativeInput } as React.ChangeEvent<HTMLInputElement>);
  }

  return (
    <Input
      value={currentValue}
      onChange={handleChange}
      onClear={handleClear}
      disabled={disabled}
      inlineButton={<ScanButton onClick={onScan} disabled={disabled} />}
      {...rest}
    />
  );
}

export default ScanInput;
