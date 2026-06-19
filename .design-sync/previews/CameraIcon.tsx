import React from "react";
import { CameraIcon } from "@/components/ui/ProductImg";

export function Default() {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px" }}>
      <div style={{ background: "#f3f4f6", borderRadius: "8px", padding: "12px", display: "flex" }}>
        <CameraIcon />
      </div>
      <div style={{ background: "#e5e7eb", borderRadius: "8px", padding: "12px", display: "flex" }}>
        <CameraIcon color="#374151" />
      </div>
    </div>
  );
}
