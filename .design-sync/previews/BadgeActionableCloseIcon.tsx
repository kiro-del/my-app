import React from "react";
import { BadgeActionableCloseIcon } from "@/components/ui/BadgeActionable";

export function Default() {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "14px", display: "flex", alignItems: "center" }}>
        <BadgeActionableCloseIcon color="#6b7280" />
      </div>
      <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "6px", padding: "14px", display: "flex", alignItems: "center" }}>
        <BadgeActionableCloseIcon color="#6366f1" />
      </div>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "14px", display: "flex", alignItems: "center" }}>
        <BadgeActionableCloseIcon color="#ef4444" />
      </div>
    </div>
  );
}
