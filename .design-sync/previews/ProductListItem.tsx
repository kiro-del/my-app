import React from "react";
import { ProductListItem } from "@/components/ui/ProductListItem";

const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16M9 6V4h6v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="#9ca3af" strokeWidth="1.2"/>
    <rect x="7.25" y="7" width="1.5" height="4" rx="0.75" fill="#9ca3af"/>
    <circle cx="8" cy="5.5" r="0.75" fill="#9ca3af"/>
  </svg>
);

export function AllVariants() {
  return (
    <div style={{ width: "360px", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
      <ProductListItem label="Product name" variant="text" value="ZENITH 9.5mm Dry" />
      <ProductListItem label="Standard" variant="action" actionLabel="Add NFC" />
      <ProductListItem
        label="Batch number"
        variant="text+buttons"
        value="B-2024-001"
        addIcon={<AddIcon />}
        deleteIcon={<DeleteIcon />}
      />
      <ProductListItem
        label="Serial number"
        variant="text+indicator+buttons"
        value="SN-001234"
        indicatorIcon={<InfoIcon />}
        addIcon={<AddIcon />}
        deleteIcon={<DeleteIcon />}
      />
      <ProductListItem
        label="Status"
        variant="badge"
        badgeText="Pending review"
        noDivider
      />
    </div>
  );
}
