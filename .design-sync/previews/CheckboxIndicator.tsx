import React from "react";
import { CheckboxIndicator } from "@/components/ui/Checkbox";

export function AllStates() {
  const rows = [
    { label: "default",  hovered: false, focused: false, disabled: false },
    { label: "hover",    hovered: true,  focused: false, disabled: false },
    { label: "focus",    hovered: false, focused: true,  disabled: false },
    { label: "disabled", hovered: false, focused: false, disabled: true  },
  ];
  const cols = [
    { label: "unselected",    checked: false, indeterminate: false },
    { label: "selected",      checked: true,  indeterminate: false },
    { label: "indeterminate", checked: false, indeterminate: true  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {rows.map((row) => (
        <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "system-ui", width: "56px", flexShrink: 0 }}>{row.label}</span>
          {cols.map((col) => (
            <div key={col.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <CheckboxIndicator
                checked={col.checked}
                indeterminate={col.indeterminate}
                hovered={row.hovered}
                focused={row.focused}
                disabled={row.disabled}
              />
              <span style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "system-ui" }}>{col.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
