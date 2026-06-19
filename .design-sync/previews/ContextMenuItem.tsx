import React from "react";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";

export function States() {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "4px", width: "280px" }}>
      <ContextMenuItem label="Default" />
      <ContextMenuItem label="Hover (simulated)" state="hover" />
      <ContextMenuItem label="Selected" state="selected" />
      <ContextMenuItem label="Remove from inventory" state="destructive" />
      <ContextMenuItem label="Disabled" state="disabled" />
    </div>
  );
}

export function WithIcons() {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "4px", width: "280px" }}>
      <ContextMenuItem
        label="Inspect"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        }
      />
      <ContextMenuItem
        label="Remove"
        state="destructive"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M9 6V4h6v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <ContextMenuItem
        label="Move to folder"
        trailing="arrow"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 9a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        }
      />
    </div>
  );
}

export function Trailing() {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "4px", width: "280px" }}>
      <ContextMenuItem label="Move to folder"  trailing="arrow" />
      <ContextMenuItem label="Show archived"   trailing="toggle" toggleChecked={false} />
      <ContextMenuItem label="Preview mode"    trailing="toggle" toggleChecked={true} />
      <ContextMenuItem label="Next inspection" trailing="chip"   chipLabel="Due Sep 3" />
      <ContextMenuItem label="With divider" divider />
      <ContextMenuItem label="After divider" />
    </div>
  );
}
