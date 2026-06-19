import React from "react";
import { CheckboxInput, CheckboxGroup } from "@/components/ui/Checkbox";

export function Variants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <CheckboxInput label="Unchecked" onChange={() => {}} />
      <CheckboxInput label="Checked" checked onChange={() => {}} />
      <CheckboxInput label="With description" description="Supporting description text here" onChange={() => {}} />
      <CheckboxInput label="Disabled unchecked" disabled />
      <CheckboxInput label="Disabled checked" checked disabled />
    </div>
  );
}

export function Group() {
  return (
    <CheckboxGroup
      options={[
        { value: "a", label: "NFC scanning",   checked: true  },
        { value: "b", label: "Bulk import",     checked: false },
        { value: "c", label: "Custom reports",  checked: true  },
      ]}
      onChange={() => {}}
    />
  );
}
