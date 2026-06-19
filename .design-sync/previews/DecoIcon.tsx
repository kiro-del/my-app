import React from "react";
import { DecoIcon } from "@/components/ui/DecoIcon";

export function FortyPx() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
      <DecoIcon size="40" tone="info" />
      <DecoIcon size="40" tone="success" />
      <DecoIcon size="40" tone="error" />
      <DecoIcon size="40" tone="warning" />
      <DecoIcon size="40" tone="brand" />
      <DecoIcon size="40" tone="disabled" />
      <DecoIcon size="40" tone="highlight" />
    </div>
  );
}

export function SixtyFourPx() {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <DecoIcon size="64" tone="brand" />
      <DecoIcon size="64" tone="info" />
      <DecoIcon size="64" tone="loading" />
    </div>
  );
}

export function NinetySixPx() {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <DecoIcon size="96" tone="info" />
      <DecoIcon size="96" tone="success" />
      <DecoIcon size="96" tone="disabled" />
    </div>
  );
}
