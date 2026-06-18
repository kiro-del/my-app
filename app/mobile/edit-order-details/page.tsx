// @refresh reset
"use client";
// app/mobile/edit-order-details/page.tsx
// Figma: Serials file — node 92:9052

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CalendarIcon } from "@/components/ui/Input";

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
      <label style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>{label}</label>
      <div style={{
        display:      "flex",
        alignItems:   "center",
        height:       "40px",
        paddingLeft:  tokens.spacing[2.5],
        paddingRight: tokens.spacing[2.5],
        gap:          tokens.spacing[2],
        background:   tokens.color.base.white,
        borderRadius: tokens.borderRadius.md,
        boxShadow:    tokens.shadows.sm,
        border:       focused
          ? `2px solid ${tokens.color.divider.blue}`
          : `1px solid ${tokens.color.divider.frame}`,
        boxSizing:    "border-box",
      }}>
        <input
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex:       "1 1 0",
            border:     "none",
            outline:    "none",
            background: "transparent",
            fontFamily: tokens.fontFamily.sans,
            fontSize:   "14px",
            fontWeight: tokens.fontWeight.regular,
            lineHeight: "20px",
            color:      tokens.color.fg.primary,
          }}
        />
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <CalendarIcon color={tokens.color.fg.support} />
        </span>
      </div>
    </div>
  );
}

function TextField({ label, placeholder, value, onChange }: {
  label:        string;
  placeholder?: string;
  value:        string;
  onChange:     (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
      <label style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>{label}</label>
      <Input
        placeholder={placeholder ?? ""}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default function EditOrderDetailsPage() {
  const router = useRouter();

  const [purchaseOrder,     setPurchaseOrder]     = useState("");
  const [salesOrderNumber,  setSalesOrderNumber]  = useState("");
  const [customerReference, setCustomerReference] = useState("");
  const [batchNumber,       setBatchNumber]       = useState("");
  const [dateOfManufacture, setDateOfManufacture] = useState("");

  return (
    <div style={{
      height:        "100dvh",
      display:       "flex",
      flexDirection: "column",
      background:    tokens.color.base.white,
      overflow:      "hidden",
    }}>
      <MobileAppBar
        page="task"
        title="Edit order details"
        taskNavIcon="close"
        onClose={() => router.back()}
      />

      {/* Scrollable content */}
      <div style={{
        flex:          "1 0 0",
        minHeight:     0,
        overflowY:     "auto",
        padding:       tokens.spacing[4],
        display:       "flex",
        flexDirection: "column",
        gap:           tokens.spacing[6],
      }}>
        {/* Section heading */}
        <h2 style={{
          margin:     0,
          fontFamily: tokens.fontFamily.sans,
          fontSize:   "18px",
          fontWeight: tokens.fontWeight.medium,
          lineHeight: "24px",
          color:      tokens.color.fg.primary,
        }}>
          Cut rope details
        </h2>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>
          <TextField
            label="Purchase order"
            value={purchaseOrder}
            onChange={setPurchaseOrder}
          />
          <TextField
            label="Sales order number"
            value={salesOrderNumber}
            onChange={setSalesOrderNumber}
          />
          <TextField
            label="Customer reference"
            value={customerReference}
            onChange={setCustomerReference}
          />
          <TextField
            label="Cut rope batch number"
            value={batchNumber}
            onChange={setBatchNumber}
          />
          <DateField
            label="Date of manufacture"
            value={dateOfManufacture}
            onChange={setDateOfManufacture}
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding:    tokens.spacing[4],
        borderTop:  `1px solid ${tokens.color.divider.border}`,
        background: tokens.color.base.white,
        flexShrink: 0,
      }}>
        <Button
          variant="primary"
          label="Confirm"
          onClick={() => router.push("/mobile/serialisation")}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
