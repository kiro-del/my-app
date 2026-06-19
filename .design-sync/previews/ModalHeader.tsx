import React from "react";
import { ModalHeader } from "@/components/ui/ModalHeader";

export function TitleOnly() {
  return (
    <div style={{ width: "480px", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
      <ModalHeader title="Delete serial" onClose={() => {}} />
    </div>
  );
}

export function TitleWithBody() {
  return (
    <div style={{ width: "480px", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
      <ModalHeader
        title="Delete serial"
        bodyText="This action cannot be undone. The serial will be permanently removed from this batch."
        onClose={() => {}} />
    </div>
  );
}

export function WithBadge() {
  return (
    <div style={{ width: "480px", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
      <ModalHeader
        title="AI-powered inspection"
        bodyText="Automatically detect issues across your inventory using machine learning."
        withBadge
        badgeLabel="New"
        onClose={() => {}} />
    </div>
  );
}

export function NoClose() {
  return (
    <div style={{ width: "480px", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
      <ModalHeader title="Confirm action" bodyText="Are you sure you want to proceed?" />
    </div>
  );
}
