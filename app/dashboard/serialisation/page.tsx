"use client";

// app/dashboard/serialisation/page.tsx

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { AppShell } from "@/components/ui/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, DataTableColumn } from "@/components/ui/DataTable";
import { TableFooter } from "@/components/ui/Pagination";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { Toggle } from "@/components/ui/Toggle";
import { Toast } from "@/components/ui/Toast";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

// ---------------------------------------------------------------------------
// Sidebar icon nodeIds
// ---------------------------------------------------------------------------
const SIDEBAR_ICON_IDS = {
  overview:   "91:746",
  team:       "92:1154",
  search:     "52:1245",
  settings:   "46:2929",
  updates:    "2508:760",
  knowledge:  "91:739",
  products:   "3628:9947",
  serials:    "94:554",
  inspection: "92:1150",
  checklists: "92:1270",
  inventory:  "92:758",
  myInv:      "92:778",
  multiScan:  "92:796",
} as const;

// Context-menu action icons — from Scannable Design System (j8hy0yzSKPyh1yRKOh4tuU)
const MENU_ICON_IDS = {
  createSerials:  "46:2936",   // + add icon
  captureSerials: "94:553",    // barcode / serials icon
  ropeSerials:    "2119:4324", // rope carabiner icon
} as const;

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function ChecklistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
      <path d="M7.5 4H7C5.34315 4 4 5.34315 4 7V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V7C20 5.34315 18.6569 4 17 4H16.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="7" y="1" width="10" height="5" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="7" y="9" width="10" height="2" rx="1" fill="currentColor"/>
      <rect x="7" y="13" width="7" height="2" rx="1" fill="currentColor"/>
    </svg>
  );
}

// Stat strip icons
const CreateSerialsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3"  y="4" width="2" height="16" rx="1" fill={tokens.color.fg.primary}/>
    <rect x="7"  y="4" width="1" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="10" y="4" width="2" height="16" rx="1" fill={tokens.color.fg.primary}/>
    <rect x="14" y="4" width="1" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="17" y="4" width="1" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="20" y="4" width="1" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
  </svg>
);
const CaptureIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    <path d="M14 17h7M17.5 13.5v7" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const RopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 12c0-3.866 3.134-7 7-7s7 3.134 7 7-3.134 7-7 7" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 8v4l3 3" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const FormatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    <path d="M7 9h10M7 12h7M7 15h5" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Sliders / adjustments filter icon
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="1.5" y1="3.5" x2="14.5" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="5" cy="3.5" r="1.5" fill={tokens.color.base.white} stroke="currentColor" strokeWidth="1.3"/>
    <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="10" cy="8" r="1.5" fill={tokens.color.base.white} stroke="currentColor" strokeWidth="1.3"/>
    <line x1="1.5" y1="12.5" x2="14.5" y2="12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="6" cy="12.5" r="1.5" fill={tokens.color.base.white} stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

// Add / plus icon — 16×16, Union fill (two rectangles forming a plus)
// Figma: node I3153:147558;59:426, 12×12 mark at left:2px top:2px inside 16×16
const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path fillRule="evenodd" d="M9 2H7v5H2v2h5v5h2V9h5V7H9V2z" />
  </svg>
);

// Download: tray-with-arrow-down (24px for framed icon button)
const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 4v10M8 10l4 4 4-4" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
// More (vertical ellipsis, 24px)
const MoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5"  r="1.4" fill={tokens.color.fg.primary}/>
    <circle cx="12" cy="12" r="1.4" fill={tokens.color.fg.primary}/>
    <circle cx="12" cy="19" r="1.4" fill={tokens.color.fg.primary}/>
  </svg>
);

// Panel close (X) icon — 20px
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Options menu icons — 24px, use currentColor
const CaptureSerialIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 17h7M17.5 13.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const PrintIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 9V4h12v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="9" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 13v7h12v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ReloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 12a8 8 0 0 1 14.93-4H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 12a8 8 0 0 1-14.93 4H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 4v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 20v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SerialRow {
  id:            string;
  source:        string;   // "Internal" | "External" | "Internal (Rope)"
  created:       string;
  sessionStatus: "Active" | "Inactive" | "Pending";
  printStatus:   string;
  serialFormat:  string;
  salesOrder:    string;
  purchaseOrder: string;
  batch:         string;
  dom:           string;
}

// ---------------------------------------------------------------------------
// Batch detail types (for View Serials panel)
// ---------------------------------------------------------------------------
interface SerialItem {
  code:    string;
  status?: "captured";
}
interface BatchProduct {
  id:             string;
  name:           string;
  sku:            string;
  serialQuantity: number;
  serials:        SerialItem[];
}
interface BatchDetail {
  purchaseOrder:     string;
  salesOrder:        string;
  dateOfManufacture: string;
  batchNumber:       string;
  totalItemCount:    number;
  products:          BatchProduct[];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_DATA: SerialRow[] = [
  { id: "1", source: "External",        created: "Mar 10, 2026", sessionStatus: "Active", printStatus: "Active",      serialFormat: "",                        salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Apr 11, 2026" },
  { id: "2", source: "Internal",        created: "Apr 2, 2026",  sessionStatus: "Active", printStatus: "",            serialFormat: "Scannable Serial For...", salesOrder: "1223",  purchaseOrder: "1234",  batch: "1234",  dom: "Apr 10, 2026" },
  { id: "3", source: "External",        created: "Mar 10, 2026", sessionStatus: "Active", printStatus: "Closed task", serialFormat: "",                        salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Apr 1, 2026"  },
  { id: "4", source: "Internal",        created: "Apr 2, 2026",  sessionStatus: "Active", printStatus: "",            serialFormat: "Scannable Serial For...", salesOrder: "76543", purchaseOrder: "76543", batch: "76543", dom: "Apr 10, 2026" },
  { id: "5", source: "Internal (Rop.)", created: "Apr 1, 2026",  sessionStatus: "Active", printStatus: "",            serialFormat: "Scannable Serial For...", salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Apr 2, 2026"  },
  { id: "6", source: "Internal",        created: "Feb 4, 2026",  sessionStatus: "Active", printStatus: "",            serialFormat: "",                        salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Mar 10, 2026" },
];

// Mock batch details per row id — shown in the View Serials panel
const MOCK_BATCH_DETAILS: Record<string, BatchDetail> = {
  "1": {
    purchaseOrder:     "1234-44",
    salesOrder:        "1234-44",
    dateOfManufacture: "Apr 10, 2026",
    batchNumber:       "323",
    totalItemCount:    15,
    products: [
      {
        id: "p1", name: "Ultra O Locksafe", sku: "DMM | A327",
        serialQuantity: 6,
        serials: [
          { code: "23060000" }, { code: "23060001" }, { code: "23060002" },
          { code: "23060003" }, { code: "23060004" }, { code: "23060005" },
        ],
      },
      {
        id: "p2", name: "Ultra O Locksafe (Orange)", sku: "DMM | A327OR",
        serialQuantity: 9,
        serials: [
          { code: "23060006", status: "captured" }, { code: "23060007" }, { code: "23060008" },
          { code: "23060009" }, { code: "23060010" }, { code: "23060011" },
          { code: "23060012" }, { code: "23060013" }, { code: "23060014" },
        ],
      },
    ],
  },
  "2": {
    purchaseOrder: "", salesOrder: "", dateOfManufacture: "Apr 1, 2026",
    batchNumber: "101", totalItemCount: 4,
    products: [
      {
        id: "p3", name: "Belay Device Pro", sku: "DMM | BD01",
        serialQuantity: 4,
        serials: [
          { code: "23040001", status: "captured" }, { code: "23040002", status: "captured" },
          { code: "23040003" }, { code: "23040004" },
        ],
      },
    ],
  },
  "3": {
    purchaseOrder: "76543", salesOrder: "76543", dateOfManufacture: "Apr 10, 2026",
    batchNumber: "76543", totalItemCount: 3,
    products: [
      {
        id: "p4", name: "Ultra O Locksafe", sku: "DMM | A327",
        serialQuantity: 3,
        serials: [
          { code: "23060015" }, { code: "23060016" }, { code: "23060017" },
        ],
      },
    ],
  },
  "4": {
    purchaseOrder: "", salesOrder: "", dateOfManufacture: "Apr 2, 2026",
    batchNumber: "", totalItemCount: 1,
    products: [
      {
        id: "p5", name: "Safety Rope 60m", sku: "EDELRID | RP60",
        serialQuantity: 1,
        serials: [{ code: "23050001" }],
      },
    ],
  },
  "5": {
    purchaseOrder: "", salesOrder: "", dateOfManufacture: "Mar 10, 2026",
    batchNumber: "", totalItemCount: 2,
    products: [
      {
        id: "p6", name: "Helmet Alpha", sku: "PETZL | HA01",
        serialQuantity: 2,
        serials: [{ code: "23030001" }, { code: "23030002" }],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// View Serials panel
// ---------------------------------------------------------------------------
function ViewSerialsPanel({
  data,
  onClose,
}: {
  data:    BatchDetail;
  onClose: () => void;
}) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Close options menu on outside click
  useEffect(() => {
    if (!optionsOpen) return;
    function handleClick(e: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(e.target as Node)) {
        setOptionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [optionsOpen]);

  const [availableToCapture, setAvailableToCapture] = useState(true);

  const metaRows: [string, string][] = [
    ["Purchase order:",      data.purchaseOrder     || "—"],
    ["Sales order:",         data.salesOrder        || "—"],
    ["Date of manufacture:", data.dateOfManufacture || "—"],
    ["Batch number:",        data.batchNumber       || "—"],
    ["Total serials needed:", String(data.totalItemCount)],
  ];

  return (
    <div
      style={{
        position:      "fixed",
        top:           0,
        right:         0,
        width:         "400px",
        height:        "100vh",
        background:    tokens.color.base.white,
        boxShadow:     "-4px 0 16px rgba(0,0,0,0.08)",
        display:       "flex",
        flexDirection: "column",
        zIndex:        50,
        borderLeft:    `1px solid ${tokens.color.divider.border}`,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          padding:         "15px 16px",
          height:          "72px",
          borderBottom:    `1px solid ${tokens.color.divider.border}`,
          flexShrink:      0,
          boxSizing:       "border-box" as const,
        }}
      >
        <span
          style={{
            fontFamily:  tokens.fontFamily.sans,
            fontSize:    "18px",
            fontWeight:  tokens.fontWeight.medium,
            lineHeight:  "24px",
            color:       tokens.color.fg.primary,
          }}
        >
          View Serials
        </span>
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            width:           "32px",
            height:          "32px",
            background:      "none",
            border:          "none",
            cursor:          "pointer",
            color:           tokens.color.fg.support,
            borderRadius:    tokens.borderRadius.md,
            flexShrink:      0,
          }}
        >
          <XIcon />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* Batch metadata */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {metaRows.map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <span
                style={{
                  fontFamily:  tokens.fontFamily.sans,
                  fontSize:    tokens.fontSize.body,
                  fontWeight:  tokens.fontWeight.regular,
                  lineHeight:  tokens.lineHeight.body,
                  color:       tokens.color.fg.support,
                  flexShrink:  0,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily:  tokens.fontFamily.sans,
                  fontSize:    tokens.fontSize.body,
                  fontWeight:  tokens.fontWeight.medium,
                  lineHeight:  tokens.lineHeight.body,
                  color:       tokens.color.fg.primary,
                  textAlign:   "right" as const,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Products */}
        {data.products.map((product, pi) => (
          <div
            key={product.id}
            style={{
              borderTop:  pi > 0 ? `1px solid ${tokens.color.divider.border}` : undefined,
              paddingTop: pi > 0 ? "16px" : undefined,
              marginTop:  pi > 0 ? "16px" : undefined,
            }}
          >
            {/* Product row */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
              {/* Image placeholder */}
              <div
                style={{
                  width:          "56px",
                  height:         "56px",
                  borderRadius:   tokens.borderRadius.md,
                  background:     tokens.color.bg.lightBg,
                  border:         `1px solid ${tokens.color.divider.border}`,
                  flexShrink:     0,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}
              >
                {/* Simple product silhouette */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
                  <circle cx="16" cy="16" r="10" stroke={tokens.color.fg.disabled} strokeWidth="1.5"/>
                  <circle cx="16" cy="16" r="5"  stroke={tokens.color.fg.disabled} strokeWidth="1.5"/>
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily:   tokens.fontFamily.sans,
                    fontSize:     tokens.fontSize.body,
                    fontWeight:   tokens.fontWeight.medium,
                    lineHeight:   tokens.lineHeight.body,
                    color:        tokens.color.fg.primary,
                    overflow:     "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace:   "nowrap" as const,
                  }}
                >
                  {product.name}
                </div>
                <div
                  style={{
                    fontFamily: tokens.fontFamily.sans,
                    fontSize:   tokens.fontSize.bodySmall,
                    fontWeight: tokens.fontWeight.regular,
                    lineHeight: tokens.lineHeight.bodySmall,
                    color:      tokens.color.fg.support,
                  }}
                >
                  {product.sku}
                </div>
              </div>
            </div>

            {/* Captured serials label */}
            <div
              style={{
                fontFamily:  tokens.fontFamily.sans,
                fontSize:    tokens.fontSize.bodySmall,
                fontWeight:  tokens.fontWeight.regular,
                lineHeight:  tokens.lineHeight.bodySmall,
                color:       tokens.color.fg.support,
                marginBottom: "8px",
              }}
            >
              Captured serials: {product.serialQuantity}
            </div>

            {/* Serial chips */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "4px" }}>
              {product.serials.map((serial) => (
                <span
                  key={serial.code}
                  style={{
                    display:      "inline-flex",
                    alignItems:   "center",
                    gap:          "4px",
                    padding:      "2px 8px",
                    borderRadius: "9999px",              // pill — Figma rounded-all
                    background:   tokens.color.bg.bg,    // gray-100 #f3f4f6
                    fontFamily:   tokens.fontFamily.sans,
                    fontSize:     "12px",
                    fontWeight:   tokens.fontWeight.semiBold,
                    lineHeight:   "16px",
                    color:        tokens.color.fg.primary,
                    whiteSpace:   "nowrap" as const,
                  }}
                >
                  {serial.status === "captured" && (
                    <span
                      style={{
                        width:        "6px",
                        height:       "6px",
                        borderRadius: "50%",
                        background:   "#f97316",   // orange-500 — captured indicator
                        flexShrink:   0,
                        display:      "inline-block",
                      }}
                    />
                  )}
                  {serial.code}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Inline actions ── */}
      <div
        style={{
          borderTop:  `1px solid ${tokens.color.divider.border}`,
          flexShrink: 0,
        }}
      >
        {/* Available to capture toggle */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "12px 16px",
            borderBottom:   `1px solid ${tokens.color.divider.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CaptureSerialIcon />
            <span
              style={{
                fontFamily: tokens.fontFamily.sans,
                fontSize:   tokens.fontSize.body,
                fontWeight: tokens.fontWeight.regular,
                color:      tokens.color.fg.primary,
              }}
            >
              Available to capture
            </span>
          </div>
          <Toggle
            checked={availableToCapture}
            onChange={setAvailableToCapture}
          />
        </div>

        {/* Capture serials */}
        <ContextMenuItem
          label="Capture serials"
          icon={<CaptureSerialIcon />}
          onClick={() => {}}
        />
        <ContextMenuItem
          label="Copy ID"
          icon={<CopyIcon />}
          onClick={() => {}}
        />
        <ContextMenuItem
          label="Print package"
          icon={<PrintIcon />}
          onClick={() => {}}
        />
        <ContextMenuItem
          label="Reload"
          icon={<ReloadIcon />}
          divider
          onClick={() => {}}
        />
        <ContextMenuItem
          label="Delete"
          icon={<TrashIcon />}
          state="destructive"
          onClick={() => {}}
        />
      </div>

      {/* ── Options button → bottom sheet ── */}
      <div
        ref={footerRef}
        style={{
          padding:    "15px 16px",
          height:     "64px",
          borderTop:  `1px solid ${tokens.color.divider.border}`,
          position:   "relative",
          flexShrink: 0,
          boxSizing:  "border-box" as const,
        }}
      >
        {/* Bottom sheet */}
        <ContextMenu
          variant="bottom-sheet-web"
          open={optionsOpen}
          onClose={() => setOptionsOpen(false)}
          width={400}
        >
          <ContextMenuItem
            label="Available to capture"
            icon={<CaptureSerialIcon />}
            trailing="toggle"
            toggleChecked={availableToCapture}
            onToggleChange={setAvailableToCapture}
          />
          <ContextMenuItem
            label="Capture serials"
            icon={<CaptureSerialIcon />}
            onClick={() => setOptionsOpen(false)}
          />
          <ContextMenuItem
            label="Copy ID"
            icon={<CopyIcon />}
            onClick={() => setOptionsOpen(false)}
          />
          <ContextMenuItem
            label="Print package"
            icon={<PrintIcon />}
            onClick={() => setOptionsOpen(false)}
          />
          <ContextMenuItem
            label="Reload"
            icon={<ReloadIcon />}
            divider
            onClick={() => setOptionsOpen(false)}
          />
          <ContextMenuItem
            label="Delete"
            icon={<TrashIcon />}
            state="destructive"
            onClick={() => setOptionsOpen(false)}
          />
        </ContextMenu>

        <button
          onClick={() => setOptionsOpen((o) => !o)}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "100%",
            padding:        "10px",
            background:     tokens.color.brand.lime,
            border:         "none",
            borderRadius:   tokens.borderRadius.md,
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,
            fontWeight:     tokens.fontWeight.medium,
            lineHeight:     tokens.lineHeight.body,
            color:          tokens.color.fg.primary,
            cursor:         "pointer",
          }}
        >
          Options
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat strip — 4 cards (Create Assembly removed), dark purple bg
// ---------------------------------------------------------------------------
const STAT_CARDS = [
  { icon: <CreateSerialsIcon />, label: "Create Serials",     count: 12676, action: "Create →",       key: "create"  },
  { icon: <CaptureIcon />,       label: "Capture Serials",    count: 93,    action: "Create →",       key: "capture" },
  { icon: <RopeIcon />,          label: "Create Rope Length", count: 443,   action: "Create →",       key: "rope"    },
  { icon: <FormatIcon />,        label: "Serial Formats",     count: 13,    action: "View formats →", key: "formats" },
];

function StatStrip({ onCreateSerials }: { onCreateSerials: () => void }) {
  return (
    <div
      style={{
        display:      "flex",
        background:   tokens.color.brand.darkPurple,   // #2c2258 — brand dark purple
        borderRadius: tokens.borderRadius.lg,
        overflow:     "hidden",
        marginBottom: "24px",
      }}
    >
      {STAT_CARDS.map((card, i) => (
        <div
          key={card.key}
          style={{
            flex:           1,
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "space-between",
            padding:        "16px 24px 8px",
            borderRight:    i < STAT_CARDS.length - 1
              ? `1px solid rgba(255,255,255,0.08)`
              : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width:          "40px",
                height:         "40px",
                borderRadius:   tokens.borderRadius.lg,
                background:     tokens.color.brand.lime,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                flexShrink:     0,
              }}
            >
              {card.icon}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fgReverse.primary, lineHeight: tokens.lineHeight.body }}>
                {card.label}
              </span>
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "18px", fontWeight: tokens.fontWeight.medium, color: tokens.color.fgReverse.primary, lineHeight: "24px" }}>
                {card.count.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={card.key === "create" ? onCreateSerials : undefined}
            style={{
              background: "none",
              border:     "none",
              padding:    "8px 0",
              cursor:     "pointer",
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,
              fontWeight: tokens.fontWeight.regular,
              color:      tokens.color.fgReverse.support,
              textAlign:  "left" as const,
            }}
          >
            {card.action}
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SerialisationPage() {
  const router = useRouter();
  const icons  = useFigmaIcons([
    ...Object.values(SIDEBAR_ICON_IDS),
    ...Object.values(MENU_ICON_IDS),
  ]);

  const [rows,            setRows]            = useState<SerialRow[]>(MOCK_DATA);
  const [sortKey,         setSortKey]         = useState("created");
  const [sortDir,         setSortDir]         = useState<"asc"|"desc"|"none">("desc");
  const [currentPage,     setCurrentPage]     = useState(1);
  const [showBanner,      setShowBanner]      = useState(false);
  const [serialsMenuOpen, setSerialsMenuOpen] = useState(false);
  const [selectedRowId,   setSelectedRowId]   = useState<string | null>(null);
  const serialsBtnRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;

  // Load newly created serial from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("newSerialCreated");
    if (stored) {
      try {
        const data = JSON.parse(stored) as {
          date: string; format: string; salesOrder: string;
          purchaseOrder: string; batch: string; dom: string;
        };
        localStorage.removeItem("newSerialCreated");
        const newRow: SerialRow = {
          id:            String(Date.now()),
          source:        (data as Record<string, string>).source ?? "Internal",
          created:       data.date,
          sessionStatus: "Active",
          printStatus:   (data as Record<string, string>).source === "External" ? "Active" : "",
          serialFormat:  data.format,
          salesOrder:    data.salesOrder,
          purchaseOrder: data.purchaseOrder,
          batch:         data.batch,
          dom:           data.dom,
        };
        setRows((prev) => [newRow, ...prev]);
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 5000);
      } catch {}
    }
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    if (!serialsMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (serialsBtnRef.current && !serialsBtnRef.current.contains(e.target as Node)) {
        setSerialsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [serialsMenuOpen]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered   = rows;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Column widths from Figma node 3153:147551
  const columns: DataTableColumn<SerialRow>[] = [
    {
      key:      "created",
      label:    "Created",
      sortable: true,
      width:    "113px",
    },
    {
      key:   "sessionStatus",
      label: "Session Status",
      width: "140px",
      render: (v) => (
        <Badge
          label={String(v)}
          color={v === "Active" ? "green" : v === "Pending" ? "yellow" : "gray"}
          withDot
        />
      ),
    },
    {
      key:    "printStatus",
      label:  "Print Status",
      width:  "105px",
      render: (v) =>
        v === "Active" ? (
          <Badge label="Active" color="green" withDot />
        ) : (
          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support }}>
            {String(v ?? "")}
          </span>
        ),
    },
    {
      key:   "source",
      label: "Source",
      width: "140px",
    },
    { key: "serialFormat", label: "Serial Format",   width: "160px" },
    {
      key:      "salesOrder",
      label:    "Sales Orders",
      sortable: true,
      width:    "133px",
    },
    {
      key:      "purchaseOrder",
      label:    "Purchase Order",
      sortable: true,
      width:    "148px",
    },
    { key: "batch", label: "Batch#", width: "82px"  },
    { key: "dom",   label: "DOM",    width: "148px" },
  ];

  const sidebarSections = [
    {
      items: [
        { label: "Overview",          iconUrl: icons[SIDEBAR_ICON_IDS.overview],  href: "#" },
        { label: "Team",              iconUrl: icons[SIDEBAR_ICON_IDS.team],       href: "#" },
        { label: "Product Search",    iconUrl: icons[SIDEBAR_ICON_IDS.search],     href: "#" },
        { label: "Settings",          iconUrl: icons[SIDEBAR_ICON_IDS.settings],   href: "#" },
        { label: "Scannable Updates", iconUrl: icons[SIDEBAR_ICON_IDS.updates],    href: "#", showInfo: true },
        { label: "Knowledge Base",    iconUrl: icons[SIDEBAR_ICON_IDS.knowledge],  href: "#", showInfo: true },
      ],
    },
    {
      title: "Manufacturers/Resellers",
      collapsible: true,
      items: [
        { label: "Products/SKUs", iconUrl: icons[SIDEBAR_ICON_IDS.products],   href: "#" },
        { label: "Serialisation", iconUrl: icons[SIDEBAR_ICON_IDS.serials],    href: "/dashboard/serialisation", selected: true, showInfo: true },
        { label: "Inspections",   iconUrl: icons[SIDEBAR_ICON_IDS.inspection], href: "#" },
        { label: "Checklists",    icon: <ChecklistIcon />,                     href: "#" },
      ],
    },
    {
      title: "Equipment Owners",
      collapsible: true,
      items: [
        { label: "Inventory",    iconUrl: icons[SIDEBAR_ICON_IDS.inventory],  href: "#" },
        { label: "My inventory", iconUrl: icons[SIDEBAR_ICON_IDS.myInv],      href: "#" },
        { label: "Multi-scan",   iconUrl: icons[SIDEBAR_ICON_IDS.multiScan],  href: "#" },
        { label: "Inspections",  iconUrl: icons[SIDEBAR_ICON_IDS.inspection], href: "#" },
      ],
    },
  ];

  return (
    <>
      <AppShell
        appBar={{
          breadcrumbs: [
            { label: "Home", href: "/" },
            { label: "Serialisation" },
          ],
          userInitials: "SW",
        }}
        sidebar={{
          userName:     "Danny Smith",
          userSubtitle: "real mf",
          userInitials: "SW",
          ctaLabel:     "Buy NFC Tags",
          sections:     sidebarSections,
        }}
      >
        <div style={{ padding: "24px" }}>
          {/* Stat banner */}
          <StatStrip onCreateSerials={() => router.push("/dashboard/create-serials")} />

          {/* Table container */}
          <div
            style={{
              border:       `1px solid ${tokens.color.divider.border}`,
              borderRadius: tokens.borderRadius.lg,   // 8px
              background:   tokens.color.base.white,
              // No overflow:hidden here — lets the +Serials context menu escape.
              // The table scroll overflow is handled inside DataTable's own wrapper.
            }}
          >
            {/* Container header — 80px height per Figma */}
            <div
              style={{
                display:             "flex",
                alignItems:          "center",
                justifyContent:      "space-between",
                padding:             "0 16px",
                height:              "80px",
                gap:                 "12px",
                borderBottom:        `1px solid ${tokens.color.divider.border}`,
                flexShrink:          0,
                borderTopLeftRadius:  tokens.borderRadius.lg,
                borderTopRightRadius: tokens.borderRadius.lg,
                background:           tokens.color.base.white,
              }}
            >
              {/* Left: icon + title */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width:          "40px",
                    height:         "40px",
                    borderRadius:   tokens.borderRadius.lg,
                    background:     tokens.color.bg.darkBg,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                  }}
                >
                  {icons[SIDEBAR_ICON_IDS.serials] ? (
                    <div
                      style={{
                        width:                  "24px",
                        height:                 "24px",
                        WebkitMaskImage:        `url(${icons[SIDEBAR_ICON_IDS.serials]})`,
                        maskImage:              `url(${icons[SIDEBAR_ICON_IDS.serials]})`,
                        WebkitMaskSize:         "contain",
                        maskSize:               "contain",
                        WebkitMaskRepeat:       "no-repeat",
                        maskRepeat:             "no-repeat",
                        WebkitMaskPosition:     "center",
                        maskPosition:           "center",
                        background:             tokens.color.fg.primary,
                      }}
                    />
                  ) : (
                    // Fallback barcode icon
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3"  y="4" width="2" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
                      <rect x="7"  y="4" width="1" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
                      <rect x="10" y="4" width="2" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
                      <rect x="14" y="4" width="1" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
                      <rect x="17" y="4" width="2" height="16" rx="0.5" fill={tokens.color.fg.primary}/>
                    </svg>
                  )}
                </div>
                <h1
                  style={{
                    fontFamily: tokens.fontFamily.sans,
                    fontSize:   "18px",
                    fontWeight: tokens.fontWeight.semiBold,
                    lineHeight: "24px",
                    color:      tokens.color.fg.primary,
                    margin:     0,
                  }}
                >
                  Serialisation
                </h1>
              </div>

              {/* Right: Manage Printer Queue + +Serials (with context menu) */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Button label="Manage Printer Queue" variant="secondary" />

                {/* +Serials with context menu */}
                <div style={{ position: "relative" }} ref={serialsBtnRef}>
                  <Button
                    label="Serials"
                    variant="primary"
                    withIcon="heading"
                    icon={<AddIcon />}
                    onClick={() => setSerialsMenuOpen((o) => !o)}
                  />
                  <ContextMenu
                    variant="floating"
                    open={serialsMenuOpen}
                    onClose={() => setSerialsMenuOpen(false)}
                    width={240}
                    floatingStyle={{ top: "calc(100% + 4px)", right: 0 }}
                  >
                    <ContextMenuItem
                      label="Create serials"
                      supportText="Generate IDs using Scannable's sequencer."
                      iconUrl={icons[MENU_ICON_IDS.createSerials]}
                      onClick={() => {
                        setSerialsMenuOpen(false);
                        router.push("/dashboard/create-serials");
                      }}
                    />
                    <ContextMenuItem
                      label="Capture serials"
                      supportText="Scan or enter existing IDs from external sources."
                      iconUrl={icons[MENU_ICON_IDS.captureSerials]}
                      onClick={() => {
                        setSerialsMenuOpen(false);
                        router.push("/dashboard/capture-serials");
                      }}
                    />
                    <ContextMenuItem
                      label="Create rope serials"
                      iconUrl={icons[MENU_ICON_IDS.ropeSerials]}
                      onClick={() => setSerialsMenuOpen(false)}
                    />
                  </ContextMenu>
                </div>
              </div>
            </div>

            {/* Filter row — separate row, right-aligned, py:8px px:16px */}
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "flex-end",
                gap:            "8px",
                padding:        "8px 16px",
                borderBottom:   `1px solid ${tokens.color.divider.border}`,
              }}
            >
              <button
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "8px",
                  padding:      "8px",
                  borderRadius: tokens.borderRadius.md,
                  border:       `1px solid ${tokens.color.divider.frame}`,
                  background:   tokens.color.base.white,
                  fontFamily:   tokens.fontFamily.sans,
                  fontSize:     tokens.fontSize.body,
                  fontWeight:   tokens.fontWeight.regular,
                  color:        tokens.color.fg.primary,
                  cursor:       "pointer",
                  lineHeight:   tokens.lineHeight.body,
                }}
              >
                <FilterIcon />
                Filters
              </button>
            </div>

            {/* Table — fixed column widths, actions column sticky-right */}
            <DataTable<SerialRow>
              columns={columns}
              rows={pageRows}
              sortKey={sortKey}
              sortDirection={sortDir}
              onSort={handleSort}
              getRowKey={(row) => row.id}
              layout="fixed"
              stickyActions
              onRowClick={(row) => setSelectedRowId((prev) => prev === row.id ? null : row.id)}
              selectedRowKey={selectedRowId ?? undefined}
              renderRowActions={(row) => (
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <Button
                    variant="icon framed"
                    icon={<DownloadIcon />}
                    aria-label="Download"
                  />
                  <Button
                    variant="icon framed"
                    icon={<MoreIcon />}
                    aria-label="More actions"
                  />
                </div>
              )}
            />

            {/* Footer */}
            <TableFooter
              from={(currentPage - 1) * PAGE_SIZE + 1}
              to={Math.min(currentPage * PAGE_SIZE, filtered.length)}
              total={filtered.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* View Serials panel — fixed, full screen height, right edge */}
        {selectedRowId && MOCK_BATCH_DETAILS[selectedRowId] && (
          <ViewSerialsPanel
            data={MOCK_BATCH_DETAILS[selectedRowId]}
            onClose={() => setSelectedRowId(null)}
          />
        )}
      </AppShell>

      {/* "Serials added" toast */}
      {showBanner && (
        <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 200 }}>
          <Toast message="Serials added" variant="success" />
        </div>
      )}
    </>
  );
}
