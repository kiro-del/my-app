import React from "react";
import { Badge } from "@/components/ui/Badge";

export function StatusDots() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <Badge color="green"  label="Active"   withDot />
      <Badge color="yellow" label="Pending"  withDot />
      <Badge color="red"    label="Failed"   withDot />
      <Badge color="gray"   label="Inactive" withDot />
      <Badge color="blue"   label="Draft"    withDot />
      <Badge color="lime"   label="New"      withDot />
    </div>
  );
}

export function PlainColors() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <Badge color="green"  label="Green"  />
      <Badge color="red"    label="Red"    />
      <Badge color="blue"   label="Blue"   />
      <Badge color="yellow" label="Yellow" />
      <Badge color="gray"   label="Gray"   />
      <Badge color="lime"   label="Lime"   />
    </div>
  );
}

export function Labels() {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <Badge color="blue" label="Beta" />
      <Badge color="lime" label="New" />
      <Badge color="gray" label="Deprecated" />
      <Badge color="green" label="Live" />
      <Badge color="red" label="Expired" />
    </div>
  );
}
