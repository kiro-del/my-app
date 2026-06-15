"use client";

// app/dashboard/create-serials/page.tsx
// Prototype of the Create Serials flow
// Figma: fGNvex4MPWovOPAc9u7pC0 — frames 2914:6228 → 2916:9113

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { AppShell } from "@/components/ui/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SelectionCardGroup } from "@/components/ui/SelectionCard";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { ApplyToProduct, type SelectedProductItem, type CatalogueProduct } from "@/components/ui/ApplyToProduct";

// Bin icon — Scannable Design System node 49:967 (red trash can)
const BIN_ICON_ID = "49:967";

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

// ---------------------------------------------------------------------------
// Utility icons
// ---------------------------------------------------------------------------

// Calendar — Figma Design System node 2150:1814
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    {/* Body */}
    <rect x="3" y="4" width="18" height="17" rx="2" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    {/* Header separator */}
    <path d="M3 10h18" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    {/* Left binding pin */}
    <path d="M8 2v4" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Right binding pin */}
    <path d="M16 2v4" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Date squares — row 1 */}
    <rect x="6.5" y="13" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="11"  y="13" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="15.5" y="13" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    {/* Date squares — row 2 */}
    <rect x="6.5" y="17" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="11"  y="17" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="15.5" y="17" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
  </svg>
);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const SERIAL_FORMATS = [
  {
    id: "customer",
    name: "Format incl. \"customer\"",
    stats: [
      { label: "DOM",        value: "YYMM" },
      { label: "Customer",   value: "--"   },
      { label: "Increments", value: "0001" },
    ],
  },
  {
    id: "scannable",
    name: "Scannable Serial Format",
    stats: [
      { label: "Prefix",     value: "SCAN" },
      { label: "Increments", value: "0001" },
    ],
  },
  {
    id: "nfc",
    name: "NFC TAG PACKING ID",
    stats: [
      { label: "Prefix",     value: "NFC"  },
      { label: "Increments", value: "0001" },
    ],
  },
];

const MOCK_CATALOGUE: CatalogueProduct[] = [
  { id: "p1", name: "Ultra O Locksafe - A327",   sku: "DMM | A327MG",  image: "/docs/product-a327.png"   },
  { id: "p2", name: "Ultra O Locksafe (Orange)", sku: "DMM | A327OR",  image: "/docs/product-a327or.png" },
];

// ---------------------------------------------------------------------------
// SectionLabel
// ---------------------------------------------------------------------------
function SectionLabel({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: tokens.spacing[6] }}>
      <h2 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4, color: tokens.color.fg.primary, margin: 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.support, margin: "4px 0 0" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
function Divider() {
  return <div style={{ height: "1px", background: tokens.color.divider.frame, margin: "32px 0" }} />;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CreateSerialsPage() {
  const router = useRouter();
  const allIconIds = [...Object.values(SIDEBAR_ICON_IDS), BIN_ICON_ID];
  const icons = useFigmaIcons(allIconIds);

  const [selectedFormat,   setSelectedFormat]   = useState<string | null>(null);
  const [purchaseOrder,    setPurchaseOrder]    = useState("");
  const [salesOrder,       setSalesOrder]       = useState("");
  const [customerRef,      setCustomerRef]      = useState("");
  const [batchNumber,      setBatchNumber]      = useState("");
  const [dateManufactured, setDateManufactured] = useState("2026-04-10");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductItem[]>([]);

  const dateInputRef = useRef<HTMLInputElement>(null);

  function handleCreateSerials() {
    const selectedFmt = SERIAL_FORMATS.find((f) => f.id === selectedFormat);
    const today = new Date();
    const dateLabel = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    localStorage.setItem("newSerialCreated", JSON.stringify({
      date:          dateLabel,
      format:        selectedFmt?.name ?? "",
      salesOrder,
      purchaseOrder,
      batch:         batchNumber,
      dom:           dateLabel,
    }));
    router.push("/dashboard/serialisation");
  }

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
    <AppShell
      appBar={{
        breadcrumbs: [
          { label: "Home",          href: "/" },
          { label: "Serialisation", href: "/dashboard/serialisation" },
          { label: "Create" },
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
        <div
          style={{
            background:   tokens.color.base.white,
            border:       `1px solid ${tokens.color.divider.border}`,
            borderRadius: tokens.borderRadius.lg,
          }}
        >
          {/* Page title */}
          <div style={{
            padding:      "24px",
            borderBottom: `1px solid ${tokens.color.divider.border}`,
          }}>
            <h1 style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.h3,       // 20px
              fontWeight:  tokens.fontWeight.medium,
              lineHeight:  tokens.lineHeight.h3,     // 28px
              color:       tokens.color.fg.primary,
              margin:      0,
            }}>
              Create serials
            </h1>
          </div>

          {/* Content */}
          <div style={{
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[6],   // 24px between all sections
            padding:       "24px",
          }}>

            {/* ── Serial details heading ──────────────────────────────── */}
            <h2 style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.h4,       // 18px
              fontWeight:  tokens.fontWeight.medium,
              lineHeight:  tokens.lineHeight.h4,     // 24px
              color:       tokens.color.fg.primary,
              margin:      0,
            }}>
              Serial details
            </h2>

            {/* ── Serial format selection ──────────────────────────────── */}
            <section>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2], maxWidth: "360px" }}>
                <p style={{
                  fontFamily:  tokens.fontFamily.sans,
                  fontSize:    tokens.fontSize.body,       // 14px
                  fontWeight:  tokens.fontWeight.medium,   // 500 — Figma: Inter Medium
                  lineHeight:  tokens.lineHeight.body,     // 20px
                  color:       tokens.color.fg.primary,
                  margin:      0,
                }}>
                  Select a serial format to use
                </p>
                <SelectionCardGroup
                  type="radio"
                  name="serial-format"
                  value={selectedFormat ?? undefined}
                  onChange={(val) => setSelectedFormat(val)}
                  options={SERIAL_FORMATS.map((fmt) => ({
                    value:       fmt.id,
                    label:       fmt.name,
                    description: fmt.stats.map((s) => `${s.label}: ${s.value}`).join(" | "),
                  }))}
                />
              </div>
            </section>

            {/* ── Batch Details ───────────────────────────────────────── */}
            <section>
              {/* 2-col grid — date field sits in one column (half width) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <Input
                  label="Purchase Order"
                  placeholder="Enter a reference number"
                  value={purchaseOrder}
                  onChange={(e) => setPurchaseOrder(e.target.value)}
                />
                <Input
                  label="Sales Order Number"
                  placeholder="Enter a sales order number"
                  value={salesOrder}
                  onChange={(e) => setSalesOrder(e.target.value)}
                />
                <Input
                  label="Customer Reference"
                  placeholder="Enter a customer reference number"
                  value={customerRef}
                  onChange={(e) => setCustomerRef(e.target.value)}
                />
                <Input
                  label="Batch Number"
                  placeholder="Enter a batch number"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                />

                {/* Date of manufacture — half-width column, calendar icon opens picker */}
                <div style={{ position: "relative" }}>
                  <Input
                    label="Date of manufacture"
                    placeholder="Select a date"
                    value={dateManufactured}
                    onChange={(e) => setDateManufactured(e.target.value)}
                    tailingIcon={
                      <button
                        type="button"
                        onClick={() =>
                          (dateInputRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()
                        }
                        style={{
                          background: "none",
                          border:     "none",
                          cursor:     "pointer",
                          padding:    0,
                          display:    "flex",
                          alignItems: "center",
                        }}
                        aria-label="Open date picker"
                      >
                        <CalendarIcon />
                      </button>
                    }
                  />
                  {/* Hidden native date input provides the OS picker */}
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={dateManufactured}
                    onChange={(e) => setDateManufactured(e.target.value)}
                    style={{
                      position:      "absolute",
                      top:           0,
                      left:          0,
                      opacity:       0,
                      pointerEvents: "none",
                      width:         0,
                      height:        0,
                      border:        "none",
                    }}
                    aria-hidden
                  />
                </div>
              </div>
            </section>

            {/* ── Apply to Product ────────────────────────────────────── */}
            <section style={{
              borderTop:   `1px solid ${tokens.color.divider.border}`,
              paddingTop:  tokens.spacing[6],
            }}>
              <SectionLabel
                title="Assign to products"
                subtitle="Select one or more products to assign these serials to. Note: This tool is not available for Assembly product types."
              />

              {/*
               * Half-width constraint — matches the form columns above.
               * The search row (input + button) and the selected-products list
               * are all contained in this 50%-wide wrapper.
               */}
              <div style={{ width: "50%", minWidth: 0 }}>
                <ApplyToProduct
                  catalogue={MOCK_CATALOGUE}
                  selectedProducts={selectedProducts}
                  onProductsChange={setSelectedProducts}
                  binIconUrl={icons[BIN_ICON_ID]}
                />
              </div>{/* end half-width wrapper */}
            </section>

          </div>{/* end content */}

          {/* Card footer */}
          <div
            style={{
              display:        "flex",
              justifyContent: "flex-end",
              alignItems:     "center",
              gap:            tokens.spacing[3],
              padding:        "16px 24px",
              borderTop:      `1px solid ${tokens.color.divider.frame}`,
            }}
          >
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => router.push("/dashboard/serialisation")}
            />
            <Button
              label="Create Serials"
              variant={selectedFormat && selectedProducts.length > 0 ? "primary" : "disabled"}
              onClick={handleCreateSerials}
            />
          </div>

        </div>{/* end white card */}
      </div>{/* end page padding */}
    </AppShell>
  );
}
