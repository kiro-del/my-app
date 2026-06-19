import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Variants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "480px" }}>
      {[
        <SectionHeader key="1" title="Batch details" />,
        <SectionHeader key="2" title="iPhone 15 Pro Max" subtitle="Apply to product" />,
        <SectionHeader key="3" title="Capture serials" onBack={() => {}} />,
        <SectionHeader key="4" title="iPhone 15 Pro Max" subtitle="24 items · B-2024-001" onBack={() => {}} />,
        <SectionHeader key="5" title="Filters" onClose={() => {}} />,
        <SectionHeader key="6" title="Edit batch" onBack={() => {}} onClose={() => {}} />,
        <SectionHeader key="7" title="Serialisation" onMore={() => {}} onClose={() => {}} />,
      ].map((el, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
          {el}
        </div>
      ))}
    </div>
  );
}

export function WithDecoIcon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "480px" }}>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
        <SectionHeader title="iPhone 15 Pro Max" subtitle="Apply to product" decoIconTone="info" />
      </div>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
        <SectionHeader title="iPhone 15 Pro Max" subtitle="Apply to product" decoIconTone="info" onClose={() => {}} />
      </div>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
        <SectionHeader title="iPhone 15 Pro Max" subtitle="Apply to product" decoIconTone="info" onBack={() => {}} onClose={() => {}} />
      </div>
    </div>
  );
}
