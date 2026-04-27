"use client";

// app/dashboard/create-rope-serials/page.tsx
// Figma: fGNvex4MPWovOPAc9u7pC0
//   Step 1 (default):  node 3221:97878
//   Step 1 (hover):    node 3233:14348
//   Step 2:            node 3223:99407

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { AppShell } from "@/components/ui/AppShell";
import { Input } from "@/components/ui/Input";
import { RadioInput } from "@/components/ui/Radio";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="11" cy="11" r="7" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
    <path d="M16.5 16.5L21 21" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PhoneScanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect x="5.5" y="0.5" width="9" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M0 2L0 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M0 2C0 1 0.5 0.5 2 0.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4 0.5C5.5 0.5 5 1 5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M0 10L0 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9 3h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={tokens.color.fg.support} strokeWidth="1.5" />
    <path d="M8 3v4M16 3v4M3 9h18" stroke={tokens.color.fg.support} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1" fill={tokens.color.fg.support} />
    <circle cx="12" cy="14" r="1" fill={tokens.color.fg.support} />
    <circle cx="16" cy="14" r="1" fill={tokens.color.fg.support} />
    <circle cx="8" cy="17" r="1" fill={tokens.color.fg.support} />
    <circle cx="12" cy="17" r="1" fill={tokens.color.fg.support} />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  /** Figma placeholder color for thumbnail */
  thumbColor: string;
}

type SerialFormat = "customer" | "scannable" | "nfc";
type ProductMode = "existing" | "new";

// ---------------------------------------------------------------------------
// Mock data — 5 recent products from Figma designs
// ---------------------------------------------------------------------------
const RECENT_PRODUCTS: Product[] = [
  { id: "1", name: "Arbor Elite 12.7mm 60m One Sla...", brand: "Teufelberger", sku: "7361024",       thumbColor: "#d1d5db" },
  { id: "2", name: "ZENITH 9.5 mm Pink 60 m",           brand: "Beal",          sku: "BC095Z.60.P",  thumbColor: "#f9a8d4" },
  { id: "3", name: "ZENITH 9.5 mm Blue 200 m",          brand: "Beal",          sku: "BC095Z.200.B", thumbColor: "#93c5fd" },
  { id: "4", name: "ZENITH 9.5 mm Blue 200 m",          brand: "Beal",          sku: "BC095Z.200.B", thumbColor: "#93c5fd" },
  { id: "5", name: "11MM Kernmantle Marlow Static R...", brand: "Marlow",        sku: "ZTO11/11",     thumbColor: "#fde68a" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Lime "Scan" button — right-attached inline button for Input components */
function ScanButton({ disabled = false }: { disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display:         "flex",
        alignItems:      "center",
        gap:             tokens.spacing[1],     // 4px
        paddingLeft:     tokens.spacing[2],     // 8px
        paddingRight:    tokens.spacing[2.5],   // 10px
        paddingTop:      tokens.spacing[2.5],   // 10px
        paddingBottom:   tokens.spacing[2.5],   // 10px
        background:      disabled ? tokens.color.bg.darkBg  : tokens.color.brand.lime,
        border:          "none",
        borderRadius:    0,
        cursor:          disabled ? "not-allowed" : "pointer",
        fontFamily:      tokens.fontFamily.sans,
        fontSize:        tokens.fontSize.body,      // 14px
        fontWeight:      tokens.fontWeight.medium,  // 500
        lineHeight:      tokens.lineHeight.body,    // 20px
        color:           disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
        whiteSpace:      "nowrap",
        flexShrink:      0,
        height:          "100%",
      }}
    >
      <PhoneScanIcon />
      Scan
    </button>
  );
}

/** Gray-200 "Search" button for the source rope search bar */
function SearchButton() {
  return (
    <button
      type="button"
      style={{
        display:       "flex",
        alignItems:    "center",
        justifyContent: "center",
        padding:       `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
        background:    tokens.color.brand.lime,
        border:        `1px solid ${tokens.color.divider.lime}`,
        borderRadius:  tokens.borderRadius.md,
        cursor:        "pointer",
        fontFamily:    tokens.fontFamily.sans,
        fontSize:      tokens.fontSize.body,
        fontWeight:    tokens.fontWeight.medium,
        lineHeight:    tokens.lineHeight.body,
        color:         tokens.color.fg.primary,
        whiteSpace:    "nowrap",
        flexShrink:    0,
      }}
    >
      Search
    </button>
  );
}

/** Product thumbnail placeholder */
function ProductThumb({ color }: { color: string }) {
  return (
    <div style={{
      width:        "56px",
      height:       "56px",
      borderRadius: tokens.borderRadius.md,
      border:       `1px solid ${tokens.color.divider.border}`,
      background:   tokens.color.base.white,
      flexShrink:   0,
      overflow:     "hidden",
      display:      "flex",
      alignItems:   "center",
      justifyContent: "center",
    }}>
      <div style={{
        width:        "48px",
        height:       "48px",
        borderRadius: "4px",
        background:   color,
        opacity:      0.6,
      }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar config — reused across steps
// ---------------------------------------------------------------------------
const SIDEBAR_SECTIONS = [
  {
    items: [
      { label: "Overview",          href: "/dashboard",                 iconNodeId: "91:746"  as const },
      { label: "Team",              href: "/dashboard/team",            iconNodeId: "92:1154" as const },
      { label: "Product Search",    href: "/dashboard/product-search",  iconNodeId: "52:1245" as const },
      { label: "Settings",          href: "/dashboard/settings",        iconNodeId: "46:2929" as const },
      { label: "Scannable Updates", href: "/dashboard/updates",         iconNodeId: "2508:760" as const },
      { label: "Knowledge Base",    href: "/dashboard/knowledge",       iconNodeId: "91:739"  as const },
    ],
  },
  {
    title: "Manufacturers/Resellers",
    collapsible: true,
    items: [
      { label: "Products/SKUs",  href: "/dashboard/products",          iconNodeId: "3628:9947" as const },
      { label: "Serialisation",  href: "/dashboard/serialisation",     iconNodeId: "94:554"    as const, active: true },
      { label: "Inspections",    href: "/dashboard/inspections",       iconNodeId: "92:1150"   as const },
      { label: "Checklists",     href: "/dashboard/checklists",        iconNodeId: "92:1270"   as const },
    ],
  },
  {
    title: "Equipment Owners",
    collapsible: true,
    items: [
      { label: "Inventory",    href: "/dashboard/inventory",    iconNodeId: "92:758" as const },
      { label: "My inventory", href: "/dashboard/my-inventory", iconNodeId: "92:778" as const },
      { label: "Multi-scan",   href: "/dashboard/multi-scan",   iconNodeId: "92:796" as const },
      { label: "Inspections",  href: "/dashboard/inspections2", iconNodeId: "92:1150" as const },
    ],
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CreateRopeSerialsPage() {
  const router = useRouter();

  // ── Wizard step ──────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2>(1);

  // ── Step 1 state ─────────────────────────────────────────────────────────
  const [search, setSearch]                     = useState("");
  const [selectedRope, setSelectedRope]         = useState<Product | null>(null);
  const [hoveredId, setHoveredId]               = useState<string | null>(null);
  const [sourceBatch, setSourceBatch]           = useState("");
  const [sourceDom, setSourceDom]               = useState("");   // date of manufacture

  // ── Step 2 state ─────────────────────────────────────────────────────────
  const [productMode, setProductMode]           = useState<ProductMode>("existing");
  const [productSearch, setProductSearch]       = useState("");
  const [quantity, setQuantity]                 = useState("");
  const [serialFormat, setSerialFormat]         = useState<SerialFormat>("customer");
  const [purchaseOrder, setPurchaseOrder]       = useState("");
  const [salesOrder, setSalesOrder]             = useState("");
  const [customerRef, setCustomerRef]           = useState("");
  const [cutBatch, setCutBatch]                 = useState("");
  const [cutDom, setCutDom]                     = useState("");

  // ── Derived ──────────────────────────────────────────────────────────────
  const canProceed   = selectedRope !== null;
  const sourceActive = selectedRope !== null;

  // ---------------------------------------------------------------------------
  // Shared AppShell props
  // ---------------------------------------------------------------------------
  const appBarProps = {
    breadcrumbs: [
      { label: "Home",                href: "/" },
      { label: "Serialisation",       href: "/dashboard/serialisation" },
      { label: "Create rope serials", href: "/dashboard/create-rope-serials" },
    ],
    userInitials: "SW",
  };

  const sidebarProps = {
    userName:    "Danny Smith",
    userSubtitle: "real mf",
    userInitials: "SW",
    sections:    SIDEBAR_SECTIONS,
  };

  // ---------------------------------------------------------------------------
  // Step 1 render
  // ---------------------------------------------------------------------------
  const renderStep1 = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Section header */}
      <div style={{
        background:   tokens.color.base.white,
        borderBottom: `1px solid ${tokens.color.divider.border}`,
        padding:      tokens.spacing[6],
        flexShrink:   0,
      }}>
        <h2 style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    tokens.fontSize.h3,      // 20px
          fontWeight:  tokens.fontWeight.medium, // 500
          lineHeight:  tokens.lineHeight.h3,     // 28px
          color:       tokens.color.fg.primary,
          margin:      0,
        }}>
          Create Serials for Cut Ropes
        </h2>
        <p style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize:   tokens.fontSize.body,
          fontWeight: tokens.fontWeight.regular,
          lineHeight: tokens.lineHeight.body,
          color:      tokens.color.fg.support,
          marginTop:  tokens.spacing[1],
          marginBottom: 0,
        }}>
          Convert a source rope into tracked cut lengths with individual serial numbers.
        </p>
      </div>

      {/* Scrollable body */}
      <div style={{
        flex:       1,
        overflowY:  "auto",
        padding:    tokens.spacing[6],
        display:    "flex",
        flexDirection: "column",
        gap:        tokens.spacing[6],
      }}>

        {/* ── Select source rope ─────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
          <h3 style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4,
            fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4,
            color: tokens.color.fg.primary, margin: 0,
          }}>
            Select source rope
          </h3>
          <p style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
            color: tokens.color.fg.support, margin: 0,
          }}>
            Search and select the original rope from Scannable database. This is the source material being cut.
          </p>
        </div>

        {/* Search row */}
        <div style={{ display: "flex", gap: tokens.spacing[2], alignItems: "flex-end", width: "520px" }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search by SKU name or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leadingIcon={<SearchIcon />}
            />
          </div>
          <SearchButton />
        </div>

        {/* Recent products grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
          <p style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
            color: tokens.color.fg.support, margin: 0,
          }}>
            Recent used products:
          </p>

          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap:                 tokens.spacing[6],
          }}>
            {RECENT_PRODUCTS.map((product) => {
              const isSelected = selectedRope?.id === product.id;
              const isHovered  = hoveredId === product.id;

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          tokens.spacing[4],
                    padding:      tokens.spacing[4],
                    borderRadius: tokens.borderRadius.md,
                    border:       isSelected
                      ? `1.5px solid ${tokens.color.bg.blue}`
                      : `1px solid ${tokens.color.divider.frame}`,
                    background:   isSelected || isHovered
                      ? tokens.color.bg.lightBg
                      : tokens.color.base.white,
                    cursor:       "pointer",
                    transition:   "background 120ms ease, border-color 120ms ease",
                  }}
                  onClick={() => setSelectedRope(isSelected ? null : product)}
                >
                  <ProductThumb color={product.thumbColor} />

                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                    <span style={{
                      fontFamily:   tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
                      fontWeight:   tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body,
                      color:        tokens.color.fg.primary, whiteSpace: "nowrap",
                      overflow:     "hidden", textOverflow: "ellipsis",
                    }}>
                      {product.name}
                    </span>
                    <div style={{ display: "flex", gap: tokens.spacing[1], alignItems: "center" }}>
                      <span style={{
                        fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall,
                        fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support,
                        whiteSpace: "nowrap",
                      }}>
                        {product.brand}
                      </span>
                      <div style={{ width: "1px", height: "12px", background: tokens.color.divider.frame }} />
                      <span style={{
                        fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall,
                        fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support,
                        whiteSpace: "nowrap",
                      }}>
                        {product.sku}
                      </span>
                    </div>
                  </div>

                  {/* Select button — visible on hover or when selected */}
                  {(isHovered || isSelected) && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedRope(isSelected ? null : product); }}
                      style={{
                        flexShrink:  0,
                        padding:     `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
                        borderRadius: tokens.borderRadius.md,
                        border:      `1px solid ${tokens.color.divider.frame}`,
                        background:  tokens.color.base.white,
                        cursor:      "pointer",
                        fontFamily:  tokens.fontFamily.sans,
                        fontSize:    tokens.fontSize.body,
                        fontWeight:  tokens.fontWeight.medium,
                        lineHeight:  tokens.lineHeight.body,
                        color:       tokens.color.fg.primary,
                        whiteSpace:  "nowrap",
                      }}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Source rope details — always visible, dimmed until rope selected ── */}
        <div style={{
          borderTop:  `1px solid ${tokens.color.divider.border}`,
          paddingTop: tokens.spacing[6],
          opacity:    sourceActive ? 1 : 0.3,
          transition: "opacity 200ms ease",
          display:    "flex",
          flexDirection: "column",
          gap:        tokens.spacing[2],
        }}>
          <h3 style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4,
            fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4,
            color: tokens.color.fg.primary, margin: 0,
          }}>
            Source rope details
          </h3>
          <p style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
            color: tokens.color.fg.support, margin: 0,
          }}>
            Enter traceability details for the original rope. These values will be linked to all cut rope items created from it.
          </p>
        </div>

        {/* Source rope fields */}
        <div style={{
          display:        "flex",
          alignItems:     "flex-start",
          gap:            tokens.spacing[6],
          opacity:        sourceActive ? 1 : 0.3,
          transition:     "opacity 200ms ease",
          pointerEvents:  sourceActive ? "auto" : "none",
        }}>
          {/* Source batch number — ScanInput */}
          <div style={{ flex: 1 }}>
            <Input
              label="Source batch number"
              placeholder="e.g. SRC-2024-00142"
              value={sourceBatch}
              onChange={(e) => setSourceBatch(e.target.value)}
              disabled={!sourceActive}
              inlineButton={<ScanButton disabled={!sourceActive} />}
            />
          </div>

          {/* Date of manufacture — DateInput */}
          <div style={{ flex: 1 }}>
            <Input
              label="Date of manufacture"
              placeholder="Select date"
              value={sourceDom}
              onChange={(e) => setSourceDom(e.target.value)}
              disabled={!sourceActive}
              tailingIcon={<CalendarIcon />}
            />
          </div>
        </div>

      </div>{/* end scrollable body */}

      {/* Footer */}
      <div style={{
        borderTop:      `1px solid ${tokens.color.divider.border}`,
        padding:        `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        display:        "flex",
        justifyContent: "flex-end",
        gap:            tokens.spacing[2],
        background:     tokens.color.base.white,
        flexShrink:     0,
      }}>
        {/* Exit */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/serialisation")}
          style={{
            padding:      `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border:       `1px solid ${tokens.color.divider.frame}`,
            background:   tokens.color.base.white,
            cursor:       "pointer",
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.body,
            fontWeight:   tokens.fontWeight.medium,
            lineHeight:   tokens.lineHeight.body,
            color:        tokens.color.fg.primary,
          }}
        >
          Exit
        </button>

        {/* Next — disabled until rope is selected */}
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => setStep(2)}
          style={{
            padding:      `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border:       `1px solid ${canProceed ? tokens.color.divider.lime : tokens.color.divider.frame}`,
            background:   canProceed ? tokens.color.brand.lime : tokens.color.bg.darkBg,
            cursor:       canProceed ? "pointer" : "not-allowed",
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.body,
            fontWeight:   tokens.fontWeight.medium,
            lineHeight:   tokens.lineHeight.body,
            color:        canProceed ? tokens.color.fg.primary : tokens.color.fg.disabled,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Step 2 render
  // ---------------------------------------------------------------------------
  const renderStep2 = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Section header */}
      <div style={{
        background:   tokens.color.base.white,
        borderBottom: `1px solid ${tokens.color.divider.border}`,
        padding:      tokens.spacing[6],
        flexShrink:   0,
      }}>
        <h2 style={{
          fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h3,
          fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h3,
          color: tokens.color.fg.primary, margin: 0,
        }}>
          Create Serials for Cut Ropes
        </h2>
        <p style={{
          fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
          fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
          color: tokens.color.fg.support, marginTop: tokens.spacing[1], marginBottom: 0,
        }}>
          Convert a source rope into tracked cut lengths with individual serial numbers.
        </p>
      </div>

      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: "auto", padding: tokens.spacing[6],
        display: "flex", flexDirection: "column", gap: tokens.spacing[6],
      }}>

        {/* ── Assign cut ropes to product ──────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
          <h3 style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4,
            fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4,
            color: tokens.color.fg.primary, margin: 0,
          }}>
            Assign cut ropes to product
          </h3>
          <p style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
            color: tokens.color.fg.support, margin: 0,
          }}>
            Set the product details for the rope you are creating from this cut. You can select an existing product or create a new one.
          </p>
        </div>

        {/* Product mode radios */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>

          {/* Option 1 — Select from existing product */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2], width: "520px" }}>
            <RadioInput
              label="Select from existing product"
              checked={productMode === "existing"}
              onChange={() => setProductMode("existing")}
              name="productMode"
              value="existing"
            />

            {/* Inline search — only shown when "existing" is selected */}
            {productMode === "existing" && (
              <div style={{ paddingLeft: tokens.spacing[6] }}>
                <Input
                  placeholder="Search by SKU name or code"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  leadingIcon={<SearchIcon />}
                  inlineButton={<ScanButton />}
                />
              </div>
            )}
          </div>

          {/* Option 2 — Create a new product */}
          <RadioInput
            label="Create a new product"
            description="This product will be available in your catalogue after creation."
            checked={productMode === "new"}
            onChange={() => setProductMode("new")}
            name="productMode"
            value="new"
          />
        </div>

        {/* ── Cut rope details ─────────────────────────────────────────────── */}
        <div style={{
          borderTop:  `1px solid ${tokens.color.divider.border}`,
          paddingTop: tokens.spacing[6],
          display:    "flex",
          alignItems: "center",
        }}>
          <h3 style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4,
            fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4,
            color: tokens.color.fg.primary, margin: 0, flex: 1,
          }}>
            Cut rope details
          </h3>
        </div>

        {/* Quantity */}
        <div style={{ width: "520px" }}>
          <Input
            label="Quantity of serials"
            placeholder="e.g. 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            min="1"
          />
        </div>

        {/* Serial format */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
          <p style={{
            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
            fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body,
            color: tokens.color.fg.primary, margin: 0,
          }}>
            Select a serial format
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>
            <RadioInput
              label='Format incl. "customer"'
              description="(DOM) YYMM | Customer (--) | Increments (0001)"
              checked={serialFormat === "customer"}
              onChange={() => setSerialFormat("customer")}
              name="serialFormat"
              value="customer"
            />
            <RadioInput
              label="Scannable Serial Format"
              description="(DOM) YYMM | Increments (0001)"
              checked={serialFormat === "scannable"}
              onChange={() => setSerialFormat("scannable")}
              name="serialFormat"
              value="scannable"
            />
            <RadioInput
              label="NFC TAG PACKING ID"
              description="(Prefix) SCAN | Increments (0001)"
              checked={serialFormat === "nfc"}
              onChange={() => setSerialFormat("nfc")}
              name="serialFormat"
              value="nfc"
            />
          </div>
        </div>

        {/* Cut rope fields — 2-column grid */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 tokens.spacing[6],
        }}>
          <Input
            label="Purchase order"
            placeholder="e.g. PO-2024-001"
            value={purchaseOrder}
            onChange={(e) => setPurchaseOrder(e.target.value)}
          />
          <Input
            label="Sales order number"
            placeholder="e.g. SO-2024-001"
            value={salesOrder}
            onChange={(e) => setSalesOrder(e.target.value)}
          />
          <Input
            label="Customer reference"
            placeholder="e.g. CUST-REF-001"
            value={customerRef}
            onChange={(e) => setCustomerRef(e.target.value)}
          />
          <Input
            label="Cut rope batch number"
            placeholder="e.g. CUT-2024-00142"
            value={cutBatch}
            onChange={(e) => setCutBatch(e.target.value)}
          />
          <Input
            label="Date of manufacture"
            placeholder="Select date"
            value={cutDom}
            onChange={(e) => setCutDom(e.target.value)}
            tailingIcon={<CalendarIcon />}
          />
        </div>

      </div>{/* end scrollable body */}

      {/* Footer */}
      <div style={{
        borderTop:      `1px solid ${tokens.color.divider.border}`,
        padding:        `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        background:     tokens.color.base.white,
        flexShrink:     0,
      }}>
        {/* Back — indigo ghost link with chevron */}
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        tokens.spacing[1],
            padding:    `${tokens.spacing[2.5]} 0`,
            background: "transparent",
            border:     "none",
            cursor:     "pointer",
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.medium,
            lineHeight: tokens.lineHeight.body,
            color:      tokens.color.fg.blue,     // indigo-700 #4338ca
          }}
        >
          <ChevronLeftIcon />
          Back
        </button>

        {/* Right group: Exit + Create Cut Rope Serials */}
        <div style={{ display: "flex", gap: tokens.spacing[2] }}>
          <button
            type="button"
            onClick={() => router.push("/dashboard/serialisation")}
            style={{
              padding:      `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
              borderRadius: tokens.borderRadius.md,
              border:       `1px solid ${tokens.color.divider.frame}`,
              background:   tokens.color.base.white,
              cursor:       "pointer",
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,
              fontWeight:   tokens.fontWeight.medium,
              lineHeight:   tokens.lineHeight.body,
              color:        tokens.color.fg.primary,
            }}
          >
            Exit
          </button>

          <button
            type="button"
            onClick={() => {
              // TODO: submit handler — navigate to serialisation on success
              router.push("/dashboard/serialisation");
            }}
            style={{
              padding:      `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
              borderRadius: tokens.borderRadius.md,
              border:       `1px solid ${tokens.color.divider.lime}`,
              background:   tokens.color.brand.lime,
              cursor:       "pointer",
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,
              fontWeight:   tokens.fontWeight.medium,
              lineHeight:   tokens.lineHeight.body,
              color:        tokens.color.fg.primary,
              whiteSpace:   "nowrap",
            }}
          >
            Create Cut Rope Serials
          </button>
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AppShell appBar={appBarProps} sidebar={sidebarProps}>
      {/* White card — Figma: rounded-2xl, ring shadow, fills available space */}
      <div style={{ padding: tokens.spacing[4], height: "100%", boxSizing: "border-box" }}>
        <div style={{
          background:    tokens.color.base.white,
          borderRadius:  tokens.borderRadius["2xl"],   // 16px
          boxShadow:     tokens.shadows.ringMd,
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          overflow:      "hidden",
        }}>
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </AppShell>
  );
}
