import React from "react";
import { BadgeActionableChevronIcon } from "@/components/ui/BadgeActionable";

export function Default() {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px", display: "flex", alignItems: "center" }}>
        <BadgeActionableChevronIcon color="#6b7280" />
      </div>
      <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: "6px", padding: "12px", display: "flex", alignItems: "center" }}>
        <BadgeActionableChevronIcon color="#6366f1" />
      </div>
      <div style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px", display: "flex", alignItems: "center" }}>
        <BadgeActionableChevronIcon color="#111827" />
      </div>
    </div>
  );
}
