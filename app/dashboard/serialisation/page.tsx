"use client";

// app/dashboard/serialisation/page.tsx

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { AppShell } from "@/components/ui/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardStatStrip } from "@/components/ui/DashboardStatCard";
import { DataTable, DataTableColumn } from "@/components/ui/DataTable";
import { TableFooter } from "@/components/ui/Pagination";
import { ContextMenu } from "@/components/patterns/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { ListViewItem } from "@/components/ui/ListViewItem";
import { ProductListItem } from "@/components/ui/ProductListItem";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Toast } from "@/components/ui/Toast";
import { SelectInput } from "@/components/ui/SelectInput";
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
  createSerials:  "46:2936",    // + add icon
  captureSerials: "94:553",     // barcode / serials icon
  ropeSerials:    "2119:4324",  // rope carabiner icon
  importSerials:  "2974:11454", // import / download tray icon
} as const;

// Stat strip icon node IDs — one unique icon per card (Figma node 3371:24897)
const STAT_ICON_IDS = {
  serialsCreate:   "94:554",     // serials create  — Created serials card
  serialsCapture:  "5846:2623",  // serials capture — Captured serials card
  rope:            "2119:4324",  // rope carabiner  — Cut rope serials card
  inventory:       "92:758",     // kit list        — Serial formats card
} as const;

// Panel icon node IDs
const CAPTURED_STATUS_ICON_NODE = "5530:29916"; // NFC tag round — 16px composite icon

// Options bottom-sheet icon node IDs
const OPTIONS_ICON_IDS = {
  copy:  "149:362",
  print: "46:2312",
  bin:   "46:2282",
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

// (Options menu icons are loaded via useFigmaIcons — see OPTIONS_ICON_IDS above)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SerialRow {
  id:            string;
  source:        string;   // "Internal" | "External" | "Internal (Rope)"
  created:       string;
  printStatus:   string;   // "Active" | "Closed task" | "" — shown as subtext for External rows
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
  { id: "1", source: "External",        created: "Mar 10, 2026", printStatus: "Active",      serialFormat: "",                        salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Apr 11, 2026" },
  { id: "2", source: "Internal",        created: "Apr 2, 2026",  printStatus: "",            serialFormat: "Scannable Serial For...", salesOrder: "1223",  purchaseOrder: "1234",  batch: "1234",  dom: "Apr 10, 2026" },
  { id: "3", source: "External",        created: "Mar 10, 2026", printStatus: "Closed task", serialFormat: "",                        salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Apr 1, 2026"  },
  { id: "4", source: "Internal",        created: "Apr 2, 2026",  printStatus: "",            serialFormat: "Scannable Serial For...", salesOrder: "76543", purchaseOrder: "76543", batch: "76543", dom: "Apr 10, 2026" },
  { id: "5", source: "Internal (Rop.)", created: "Apr 1, 2026",  printStatus: "",            serialFormat: "Scannable Serial For...", salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Apr 2, 2026"  },
  { id: "6", source: "Internal",        created: "Feb 4, 2026",  printStatus: "",            serialFormat: "",                        salesOrder: "",      purchaseOrder: "",      batch: "",      dom: "Mar 10, 2026" },
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
// ---------------------------------------------------------------------------
// CapturedStatusIcon — orange leading icon for captured serial badges
// Uses CSS mask to recolour the DS icon in orange.
// Falls back to an orange dot while the Figma URL loads.
// ---------------------------------------------------------------------------
// CapturedStatusIcon — "NFC tag round" (Figma node 5530:29916)
// Composite icon (lime circle + NFC wave) — rendered as <img>, NOT CSS-masked.
// Falls back to a lime circle pill while the URL is loading.
function CapturedStatusIcon({ iconUrl }: { iconUrl?: string }) {
  if (!iconUrl) {
    // Fallback: lime circle matches the icon's dominant shape
    return (
      <span
        style={{
          display:      "inline-block",
          width:        "16px",
          height:       "16px",
          borderRadius: "9999px",
          background:   tokens.color.brand.lime,
          flexShrink:   0,
        }}
        aria-hidden
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={iconUrl}
      width={16}
      height={16}
      alt=""
      aria-hidden
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}

// Figma-icon helper for Options menu items — renders via CSS mask at 24px
function OptionsIcon({ iconUrl, color = tokens.color.fg.disabled }: { iconUrl?: string; color?: string }) {
  if (!iconUrl) return null;
  return (
    <span
      style={{
        display:            "inline-block",
        width:              "24px",
        height:             "24px",
        background:         color,
        maskImage:          `url(${iconUrl})`,
        maskSize:           "contain",
        maskRepeat:         "no-repeat",
        maskPosition:       "center",
        WebkitMaskImage:    `url(${iconUrl})`,
        WebkitMaskSize:     "contain",
        WebkitMaskRepeat:   "no-repeat",
        WebkitMaskPosition: "center",
        flexShrink:         0,
      } as React.CSSProperties}
      aria-hidden
    />
  );
}

// Fallback reload icon used in cut-rope Options menu
function ReloadIcon({ color = tokens.color.fg.disabled }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: "block", flexShrink: 0 }}>
      <path
        d="M4 4v5h5M20 20v-5h-5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 9A8 8 0 0 0 5.64 5.64L4 9m16 6-1.64 3.36A8 8 0 0 1 4 15"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// View Serials panel
// ---------------------------------------------------------------------------
function ViewSerialsPanel({
  data,
  source,
  onClose,
}: {
  data:     BatchDetail;
  source?:  string;
  onClose:  () => void;
}) {
  const panelIcons      = useFigmaIcons([CAPTURED_STATUS_ICON_NODE, ...Object.values(OPTIONS_ICON_IDS)]);
  const capturedIconUrl = panelIcons[CAPTURED_STATUS_ICON_NODE];

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

  // Meta rows — labels match Figma node 3341:77076, no trailing colons
  const metaRows: [string, string][] = [
    ["Purchase order",     data.purchaseOrder     || "—"],
    ["Sales order",        data.salesOrder        || "—"],
    ["Source",             source                 || "—"],
    ["Date of manufacture",data.dateOfManufacture || "—"],
    ["Batch number",       data.batchNumber       || "—"],
    ["Total Item count",   String(data.totalItemCount)],
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
      <SectionHeader title="View Serials" onClose={onClose} style={{ flexShrink: 0 }} />

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Batch metadata — ProductListItem variant="text" */}
        <div style={{ marginBottom: tokens.spacing[2] }}>
          {metaRows.map(([label, value]) => (
            <ProductListItem
              key={label}
              variant="text"
              label={label}
              value={value}
            />
          ))}
        </div>

        {/* Products — Figma node 3341:77080
            Container: px-4, border-bottom per product block
            ListViewItem: py-2
            Serial quantity row: py-2, body-M (14px/500), two-span label + number
            Badge group: py-2, flex-wrap, gap-2 (8px)
        */}
        <div style={{ paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[4] }}>
          {data.products.map((product) => (
            <div
              key={product.id}
              style={{
                borderBottom: `1px solid ${tokens.color.divider.border}`,
                paddingBottom: tokens.spacing[2],
              }}
            >
              {/* Product row — ListViewItem */}
              <ListViewItem
                title={product.name}
                subtitle={product.sku}
                showDivider={false}
              />

              {/* Serial quantity row — body-M, two spans */}
              <div
                style={{
                  display:    "flex",
                  gap:        tokens.spacing[1],  // 4px between label and number
                  alignItems: "center",
                  paddingTop:    tokens.spacing[2],  // 8px
                  paddingBottom: tokens.spacing[2],  // 8px
                  fontFamily:  tokens.fontFamily.sans,
                  fontSize:    tokens.fontSize.body,   // 14px
                  fontWeight:  tokens.fontWeight.medium, // 500
                  lineHeight:  tokens.lineHeight.body,  // 20px
                }}
              >
                <span style={{ color: tokens.color.fg.support }}>Serial quantity:</span>
                <span style={{ color: tokens.color.fg.primary }}>{product.serialQuantity}</span>
              </div>

              {/* Serial chips — Badge color="gray", flex-wrap, gap-2 */}
              <div
                style={{
                  display:       "flex",
                  flexWrap:      "wrap" as const,
                  gap:           tokens.spacing[2],   // 8px
                  paddingTop:    tokens.spacing[2],   // 8px
                  paddingBottom: tokens.spacing[2],   // 8px
                }}
              >
                {product.serials.map((serial) => {
                  const isCaptured = serial.status === "captured";
                  return (
                    <Badge
                      key={serial.code}
                      color="gray"
                      label={serial.code}
                      icon={isCaptured ? <CapturedStatusIcon iconUrl={capturedIconUrl} /> : undefined}
                      iconPosition={isCaptured ? "leading" : "none"}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>{/* /products */}
      </div>{/* /scrollable body */}

      {/* ── Footer: Options button + bottom sheet ── */}
      <div
        ref={footerRef}
        style={{
          padding:    "12px 16px",
          borderTop:  `1px solid ${tokens.color.divider.border}`,
          position:   "relative",
          flexShrink: 0,
          boxSizing:  "border-box" as const,
        }}
      >
        {/* Bottom sheet — contents depend on source
            Cut rope serials (source contains "cut rope"):
              1. Print packaging  — print icon (46:2312)
              2. Reload           — reload icon (SVG fallback), divider
              3. Delete serials   — bin icon (46:2282), destructive
            Default:
              1. Copy url for preview  — copy icon (149:362),  divider
              2. Print one(first) label — print icon (46:2312)
              3. Print all labels      — print icon (46:2312)
              4. Print one serial      — print icon (46:2312)
              5. Print packaging       — print icon (46:2312),  divider
              6. Delete serials        — bin icon  (46:2282),  destructive
        */}
        <ContextMenu
          variant="bottom-sheet-web"
          open={optionsOpen}
          onClose={() => setOptionsOpen(false)}
          width={400}
          contained
          noBackdrop
        >
          {source?.toLowerCase().includes("cut rope") ? (
            <>
              <ContextMenuItem
                label="Print packaging"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.print]} />}
                divider
                onClick={() => setOptionsOpen(false)}
              />
              <ContextMenuItem
                label="Reload"
                icon={<ReloadIcon />}
                divider
                onClick={() => setOptionsOpen(false)}
              />
              <ContextMenuItem
                label="Delete serials"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.bin]} color={tokens.color.fg.red} />}
                state="destructive"
                onClick={() => setOptionsOpen(false)}
              />
            </>
          ) : (
            <>
              <ContextMenuItem
                label="Copy url for preview"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.copy]} />}
                divider
                onClick={() => setOptionsOpen(false)}
              />
              <ContextMenuItem
                label="Print one(first) label"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.print]} />}
                onClick={() => setOptionsOpen(false)}
              />
              <ContextMenuItem
                label="Print all labels"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.print]} />}
                onClick={() => setOptionsOpen(false)}
              />
              <ContextMenuItem
                label="Print one serial"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.print]} />}
                onClick={() => setOptionsOpen(false)}
              />
              <ContextMenuItem
                label="Print packaging"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.print]} />}
                divider
                onClick={() => setOptionsOpen(false)}
              />
              <ContextMenuItem
                label="Delete serials"
                icon={<OptionsIcon iconUrl={panelIcons[OPTIONS_ICON_IDS.bin]} color={tokens.color.fg.red} />}
                state="destructive"
                onClick={() => setOptionsOpen(false)}
              />
            </>
          )}
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
// Manage Printer Queue panel
// Figma: Manufactures data — node 3208:80300
// ---------------------------------------------------------------------------
const PRINTER_OPTIONS = [
  { value: "CL4", label: "CL4" },
  { value: "CL3", label: "CL3" },
  { value: "CL2", label: "CL2" },
  { value: "CL1", label: "CL1" },
];

function ManagePrinterQueuePanel({ onClose }: { onClose: () => void }) {
  const [selectedPrinter, setSelectedPrinter] = useState("CL4");

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
      {/* Header */}
      <SectionHeader title="Manage Printer Queue" onClose={onClose} style={{ flexShrink: 0 }} />

      {/* Body */}
      <div
        style={{
          flex:          "1 0 0",
          minHeight:     0,
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[4],
          padding:       tokens.spacing[4],
          overflowY:     "auto",
        }}
      >
        {/* Select printer */}
        <SelectInput
          label="Select printer"
          options={PRINTER_OPTIONS}
          value={selectedPrinter}
          onChange={setSelectedPrinter}
        />

        {/* Clear Printer Queue — red underline link */}
        <button
          type="button"
          onClick={() => {}}
          style={{
            alignSelf:       "flex-start",
            background:      "none",
            border:          "none",
            padding:         0,
            cursor:          "pointer",
            fontFamily:      tokens.fontFamily.sans,
            fontSize:        tokens.fontSize.body,       // 14px
            fontWeight:      tokens.fontWeight.medium,   // 500
            lineHeight:      tokens.lineHeight.body,     // 20px
            color:           tokens.color.fg.red,
            textDecoration:  "underline",
            textDecorationSkipInk: "none" as const,
          } as React.CSSProperties}
        >
          Clear Printer Queue
        </button>
      </div>
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
    ...Object.values(STAT_ICON_IDS),
  ]);

  const [rows,            setRows]            = useState<SerialRow[]>(MOCK_DATA);
  const [batchDetails,    setBatchDetails]    = useState<Record<string, BatchDetail>>(MOCK_BATCH_DETAILS);
  const [sortKey,         setSortKey]         = useState("created");
  const [sortDir,         setSortDir]         = useState<"asc"|"desc"|"none">("desc");
  const [currentPage,     setCurrentPage]     = useState(1);
  const [showBanner,        setShowBanner]        = useState(false);
  const [serialsMenuOpen,   setSerialsMenuOpen]   = useState(false);
  const [selectedRowId,     setSelectedRowId]     = useState<string | null>(null);
  const [showPrinterQueue,  setShowPrinterQueue]  = useState(false);
  const serialsBtnRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;

  // Load newly created serial from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("newSerialCreated");
    if (stored) {
      try {
        const data = JSON.parse(stored) as {
          date: string; format: string; salesOrder: string;
          purchaseOrder: string; batch: string; dom: string; source?: string;
        };
        localStorage.removeItem("newSerialCreated");
        const newId  = String(Date.now());
        const newRow: SerialRow = {
          id:           newId,
          source:       data.source ?? "Internal",
          created:      data.date,
          printStatus:  data.source === "External" ? "Active" : "",
          serialFormat: data.format,
          salesOrder:    data.salesOrder,
          purchaseOrder: data.purchaseOrder,
          batch:         data.batch,
          dom:           data.dom,
        };
        const newDetail: BatchDetail = {
          purchaseOrder:     data.purchaseOrder ?? "",
          salesOrder:        data.salesOrder    ?? "",
          dateOfManufacture: data.dom           ?? "",
          batchNumber:       data.batch         ?? "",
          totalItemCount:    0,
          products:          [],
        };
        setRows((prev) => [newRow, ...prev]);
        setBatchDetails((prev) => ({ ...prev, [newId]: newDetail }));
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
      key:   "source",
      label: "Source",
      width: "140px",
      render: (v, row) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: tokens.spacing[1] }}>
          <span
            style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,
              fontWeight: tokens.fontWeight.regular,
              color:      tokens.color.fg.primary,
            }}
          >
            {String(v)}
          </span>
          {row.source === "External" && row.printStatus && (
            <Badge
              label={row.printStatus}
              color={row.printStatus === "Active" ? "green" : "gray"}
            />
          )}
        </div>
      ),
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
          <div style={{ marginBottom: "24px" }}>
            <DashboardStatStrip cards={[
              { iconUrl: icons[STAT_ICON_IDS.serialsCreate],   icon: <CreateSerialsIcon />, label: "Created serials",  count: 12676, actionLabel: "Create",       onActionClick: () => router.push("/dashboard/create-serials") },
              { iconUrl: icons[STAT_ICON_IDS.serialsCapture],  icon: <CaptureIcon />,       label: "Captured serials", count: 93,    actionLabel: "Create",       onActionClick: () => router.push("/dashboard/capture-serials") },
              { iconUrl: icons[STAT_ICON_IDS.rope],            icon: <RopeIcon />,          label: "Cut rope serials", count: 443,   actionLabel: "Create",       onActionClick: () => router.push("/dashboard/create-rope-serials") },
              { iconUrl: icons[STAT_ICON_IDS.inventory],       icon: <FormatIcon />,        label: "Serial formats",   count: 13,    actionLabel: "View formats", actionHref: "#" },
            ]} />
          </div>

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
                <Button label="Manage Printer Queue" variant="secondary" onClick={() => setShowPrinterQueue(true)} />

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
                    width={280}
                    floatingStyle={{ top: "calc(100% + 4px)", right: 0 }}
                  >
                    <ContextMenuItem
                      label="Create serials"
                      supportText="Generate IDs using Scannable's sequencer."
                      iconUrl={icons[MENU_ICON_IDS.createSerials]}
                      divider
                      onClick={() => {
                        setSerialsMenuOpen(false);
                        router.push("/dashboard/create-serials");
                      }}
                    />
                    <ContextMenuItem
                      label="Capture serials"
                      supportText="Capture existing IDs from external sources."
                      iconUrl={icons[MENU_ICON_IDS.captureSerials]}
                      divider
                      onClick={() => {
                        setSerialsMenuOpen(false);
                        router.push("/dashboard/capture-serials");
                      }}
                    />
                    <ContextMenuItem
                      label="Create rope serials"
                      supportText="Convert bulk rope into serialised lengths."
                      iconUrl={icons[MENU_ICON_IDS.ropeSerials]}
                      divider
                      onClick={() => {
                        setSerialsMenuOpen(false);
                        router.push("/dashboard/create-rope-serials");
                      }}
                    />
                    <ContextMenuItem
                      label="Create rope serials ver.2"
                      supportText="Convert bulk rope into serialised lengths — record rope lengths."
                      iconUrl={icons[MENU_ICON_IDS.ropeSerials]}
                      divider
                      onClick={() => {
                        setSerialsMenuOpen(false);
                        router.push("/dashboard/create-rope-serials-v2");
                      }}
                    />
                    <ContextMenuItem
                      label="Import serials"
                      iconUrl={icons[MENU_ICON_IDS.importSerials]}
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
              <Button
                variant="secondary"
                label="Filters"
                withIcon="heading"
                icon={<FilterIcon />}
              />
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
        {selectedRowId && batchDetails[selectedRowId] && (
          <ViewSerialsPanel
            data={batchDetails[selectedRowId]}
            source={rows.find((r) => r.id === selectedRowId)?.source}
            onClose={() => setSelectedRowId(null)}
          />
        )}

        {/* Manage Printer Queue panel */}
        {showPrinterQueue && (
          <ManagePrinterQueuePanel onClose={() => setShowPrinterQueue(false)} />
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
