"use client";
// components/ui/mobile/InputScan.tsx
// Mobile ScanInput — wraps mobile/Input with ScanButton (48px, 8px radius).
// Keep separate from components/ui/InputScan.tsx.

import React from "react";
import { Input, type InputProps } from "@/components/ui/mobile/Input";
import { ScanButton } from "@/components/patterns/ScanSimulationSheet";

export interface ScanInputProps extends Omit<InputProps, "inlineButton" | "onClear" | "tailingIcon"> {
  onScan?: () => void;
}

export function ScanInput({ onScan, value, onChange, disabled, ...rest }: ScanInputProps) {
  const [internalValue, setInternalValue] = React.useState("");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as string) : internalValue;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  }

  function handleClear() {
    if (!isControlled) setInternalValue("");
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
