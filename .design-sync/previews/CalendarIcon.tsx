import React from "react";
import { Input, CalendarIcon } from "@/components/ui/Input";

export function InDateInput() {
  return (
    <div style={{ width: "280px" }}>
      <Input
        label="Date of manufacture"
        placeholder="Select date"
        value="Apr 10, 2026"
        readOnly
        tailingIcon={
          <button
            type="button"
            style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
          >
            <CalendarIcon />
          </button>
        }
      />
    </div>
  );
}

export function EmptyDateInput() {
  return (
    <div style={{ width: "280px" }}>
      <Input
        label="Date of manufacture"
        placeholder="Select date"
        tailingIcon={
          <button
            type="button"
            style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
          >
            <CalendarIcon />
          </button>
        }
      />
    </div>
  );
}

export function IconAlone() {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "8px" }}>
      <CalendarIcon />
    </div>
  );
}
