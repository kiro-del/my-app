import React from "react";
import { Checkbox } from "@/components/ui/Checkbox";

export function States() {
  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <Checkbox checked={false} onChange={() => {}} />
        <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "system-ui" }}>unchecked</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <Checkbox checked={true} onChange={() => {}} />
        <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "system-ui" }}>checked</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <Checkbox indeterminate={true} onChange={() => {}} />
        <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "system-ui" }}>indeterminate</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <Checkbox checked={false} disabled />
        <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "system-ui" }}>disabled</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <Checkbox checked={true} disabled />
        <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "system-ui" }}>disabled checked</span>
      </div>
    </div>
  );
}
