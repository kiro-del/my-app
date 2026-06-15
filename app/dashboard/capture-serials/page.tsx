"use client";

// app/dashboard/capture-serials/page.tsx
// Figma: fGNvex4MPWovOPAc9u7pC0
//   Step 1: 3153:119949  |  Step 2: 3173:22196, 3177:22838
//   Incomplete modal: 3170:14871  |  Alert: 215:2129

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { AppShell } from "@/components/ui/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { ApplyToProduct, type SelectedProductItem, type CatalogueProduct } from "@/components/ui/ApplyToProduct";
import { ProductImg } from "@/components/ui/ProductImg";
import { Alert } from "@/components/ui/Alert";
import { ScanInput } from "@/components/ui/ScanInput";

// ---------------------------------------------------------------------------
// Sidebar icon ids
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

// Bin / trash icon — Scannable Design System node 49:967 (red trash can)
const BIN_ICON_ID  = "49:967";
// Scan icon — Scannable Design System node 3953:13529 (phone scan, 16px)
const SCAN_ICON_ID = "3953:13529";
// NFC add icon — Scannable Design System node 2064:1089 (add/plus, 16px)
const NFC_ICON_ID  = "2064:1089";

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
// Icons
// ---------------------------------------------------------------------------
// Calendar — Figma Design System node 2150:1814 (matches create-serials)
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="17" rx="2" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    <path d="M3 10h18" stroke={tokens.color.fg.primary} strokeWidth="1.5"/>
    <path d="M8 2v4" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 2v4" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="6.5"  y="13" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="11"   y="13" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="15.5" y="13" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="6.5"  y="17" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="11"   y="17" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
    <rect x="15.5" y="17" width="2" height="2" rx="0.5" fill={tokens.color.fg.primary}/>
  </svg>
);


// Masked 16 px icon — tinted to a given colour via CSS mask-image.
// Falls back to a simple inline SVG while the Figma URL loads.
function MaskedIcon16({
  url,
  color = tokens.color.fg.primary,
  fallback,
}: {
  url?: string;
  color?: string;
  fallback: React.ReactNode;
}) {
  if (!url) return <>{fallback}</>;
  return (
    <span
      style={{
        display:            "inline-block",
        width:              "16px",
        height:             "16px",
        flexShrink:         0,
        background:         color,
        maskImage:          `url(${url})`,
        maskSize:           "contain",
        maskRepeat:         "no-repeat",
        maskPosition:       "center",
        WebkitMaskImage:    `url(${url})`,
        WebkitMaskSize:     "contain",
        WebkitMaskRepeat:   "no-repeat",
        WebkitMaskPosition: "center",
      } as React.CSSProperties}
      aria-hidden
    />
  );
}

// Fallback scan icon (barcode corners + centre line)
const ScanFallback = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M1 2.5A1.5 1.5 0 0 1 2.5 1H5v1.5H2.5V5H1V2.5zm10 0V1h2.5A1.5 1.5 0 0 1 15 2.5V5h-1.5V2.5H11zM1 11h1.5v2.5H5V15H2.5A1.5 1.5 0 0 1 1 13.5V11zm13 2.5V11h1.5v2.5A1.5 1.5 0 0 1 13.5 15H11v-1.5h2.5zM3 7.5h10V9H3V7.5z"/>
  </svg>
);

// Fallback NFC/add icon (plus shape)
const AddFallback = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CloseModalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M5 5l10 10M15 5L5 15" stroke={tokens.color.fg.support} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Red trash icon
const TrashRedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={tokens.color.fg.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Info circle icon for the IncompleteModal — matches Figma node 3170:14871
const ModalInfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke={tokens.color.fg.blue} strokeWidth="1.5"/>
    <circle cx="12" cy="8.5" r="1" fill={tokens.color.fg.blue}/>
    <path d="M12 11.5v5" stroke={tokens.color.fg.blue} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface BatchForm {
  purchaseOrder:      string;
  salesOrderNumber:   string;
  customerReference:  string;
  batchNumber:        string;
  dateOfManufacture:  string;  // YYYY-MM-DD
}

// SelectedProductItem and CatalogueProduct are imported from ApplyToProduct.
// Use SelectedProductItem as the local SelectedProduct alias.
type SelectedProduct = SelectedProductItem;

interface LoggedSerial {
  value:  string;
  hasNfc: boolean;
}

interface ProductCapture {
  productId:     string;
  activeInput:   string;
  loggedSerials: LoggedSerial[];
  isExpanded:    boolean;
}

// ---------------------------------------------------------------------------
// Mock product catalogue
// ---------------------------------------------------------------------------
const ALL_PRODUCTS: CatalogueProduct[] = [
  { id: "p1", name: "Ultra O Locksafe - A327",   sku: "DMM | A327MG"  },
  { id: "p2", name: "Ultra O Locksafe (Orange)",  sku: "DMM | A327OR"  },
  { id: "p3", name: "Belay Device Pro",           sku: "DMM | BD01"    },
  { id: "p4", name: "Safety Rope 60m",            sku: "EDELRID | RP60" },
  { id: "p5", name: "Helmet Alpha",               sku: "PETZL | HA01"  },
];

// ---------------------------------------------------------------------------
// Step 1 — Batch Details + Apply to Product
// Rendered inside the parent card — no own card wrapper.
// ---------------------------------------------------------------------------
function Step1Content({
  batchForm,
  onBatchChange,
  selectedProducts,
  onProductsChange,
  binIconUrl,
}: {
  batchForm:         BatchForm;
  onBatchChange:     (f: BatchForm) => void;
  selectedProducts:  SelectedProduct[];
  onProductsChange:  (p: SelectedProduct[]) => void;
  binIconUrl?:       string;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const field = (label: string, key: keyof BatchForm, placeholder: string) => (
    <Input
      label={label}
      placeholder={placeholder}
      value={batchForm[key]}
      onChange={(e) => onBatchChange({ ...batchForm, [key]: e.target.value })}
    />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[6], padding: "24px" }}>

      {/* ── Serial details heading ───────────────────────────────────────── */}
      <h2 style={{
        fontFamily:  tokens.fontFamily.sans,
        fontSize:    tokens.fontSize.h4,
        fontWeight:  tokens.fontWeight.medium,
        lineHeight:  tokens.lineHeight.h4,
        color:       tokens.color.fg.primary,
        margin:      0,
      }}>
        Serial details
      </h2>

      {/* ── Batch Details ──────────────────────────────────────────────────── */}
      <section>
        {/* 2-col grid — date of manufacture sits in one column (half-width) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {field("Purchase order",     "purchaseOrder",     "Enter a reference number")}
          {field("Sales order number", "salesOrderNumber",  "Enter a sales order number")}
          {field("Customer reference", "customerReference", "Enter a customer reference number")}
          {field("Batch number",       "batchNumber",       "Enter a batch number")}

          {/* Date of manufacture — half-width grid column, calendar icon opens picker */}
          <div style={{ position: "relative" }}>
            <Input
              label="Date of manufacture"
              placeholder="Select a date"
              value={batchForm.dateOfManufacture}
              onChange={(e) => onBatchChange({ ...batchForm, dateOfManufacture: e.target.value })}
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
            {/* Hidden native date input — provides the OS date-picker UI */}
            <input
              ref={dateInputRef}
              type="date"
              value={batchForm.dateOfManufacture}
              onChange={(e) => onBatchChange({ ...batchForm, dateOfManufacture: e.target.value })}
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

      {/* ── Assign to products ─────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${tokens.color.divider.border}`, paddingTop: tokens.spacing[6] }}>
        <h2 style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    tokens.fontSize.h4,
          fontWeight:  tokens.fontWeight.medium,
          lineHeight:  tokens.lineHeight.h4,
          color:       tokens.color.fg.primary,
          margin:      `0 0 ${tokens.spacing[2]}`,
        }}>
          Assign to products
        </h2>
        <p style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    tokens.fontSize.body,
          fontWeight:  tokens.fontWeight.regular,
          lineHeight:  tokens.lineHeight.body,
          color:       tokens.color.fg.support,
          margin:      `0 0 ${tokens.spacing[6]}`,
        }}>
          Select one or more products to assign these serials to. Note: This tool is not available for Assembly product types.
        </p>

        {/* Half-width wrapper — mirrors create-serials layout */}
        <div style={{ width: "50%", minWidth: 0 }}>
          <ApplyToProduct
            catalogue={ALL_PRODUCTS}
            selectedProducts={selectedProducts}
            onProductsChange={onProductsChange}
            binIconUrl={binIconUrl}
          />
        </div>
      </section>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — accordion content only (rendered inside the parent card)
// ---------------------------------------------------------------------------
function Step2Content({
  selectedProducts,
  captures,
  onCapturesChange,
  binIconUrl,
  nfcIconUrl,
}: {
  selectedProducts:  SelectedProduct[];
  captures:          ProductCapture[];
  onCapturesChange:  (c: ProductCapture[]) => void;
  binIconUrl?:       string;
  nfcIconUrl?:       string;
}) {
  const [showTowerBanner, setShowTowerBanner] = useState(true);

  function patch(productId: string, update: Partial<ProductCapture>) {
    onCapturesChange(captures.map((c) => (c.productId === productId ? { ...c, ...update } : c)));
  }

  function toggleExpanded(productId: string) {
    const c = captures.find((x) => x.productId === productId)!;
    patch(productId, { isExpanded: !c.isExpanded });
  }

  function updateActiveInput(productId: string, value: string) {
    patch(productId, { activeInput: value });
  }

  function confirmSerial(productId: string, hasNfc: boolean) {
    const c = captures.find((x) => x.productId === productId)!;
    const trimmed = c.activeInput.trim();
    if (!trimmed) return;
    patch(productId, {
      loggedSerials: [...c.loggedSerials, { value: trimmed, hasNfc }],
      activeInput:   "",
    });
  }

  function removeLoggedSerial(productId: string, index: number) {
    const c = captures.find((x) => x.productId === productId)!;
    patch(productId, { loggedSerials: c.loggedSerials.filter((_, i) => i !== index) });
  }

  return (
    <>
      {/* Section title + product cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4], padding: "24px" }}>

        {/* ── Section heading ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
          <h2 style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.h4,
            fontWeight: tokens.fontWeight.medium,
            lineHeight: tokens.lineHeight.h4,
            color:      tokens.color.fg.primary,
            margin:     0,
          }}>
            Serial entry
          </h2>
          <p style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.body,
            color:      tokens.color.fg.support,
            margin:     0,
          }}>
            Scan or type the serial numbers for this batch.
          </p>
        </div>

        {/* ── Product capture cards ────────────────────────────────────────── */}
        {captures.map((capture) => {
          const product = selectedProducts.find((p) => p.id === capture.productId)!;
          const logged  = capture.loggedSerials.length;
          const needed  = product.quantity;

          return (
            <div
              key={capture.productId}
              style={{
                width:        "50%",
                border:       `1px solid ${tokens.color.divider.border}`,
                borderRadius: tokens.borderRadius.lg,
                padding:      "16px 24px 24px",
                boxSizing:    "border-box" as const,
                display:      "flex",
                flexDirection:"column",
                gap:          tokens.spacing[4],   // 16px between rows — Figma gap-4
              }}
            >
              {/* ── Accordion header block — border-bottom when expanded ─── */}
              <div style={{
                display:       "flex",
                flexDirection: "column",
                gap:           tokens.spacing[2],
                paddingBottom: capture.isExpanded ? tokens.spacing[4] : 0,
                borderBottom:  capture.isExpanded ? `1px solid ${tokens.color.divider.border}` : "none",
              }}>
                {/* Product row + toggle */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[4], minWidth: 0 }}>
                    <ProductImg size={56} image={product.image} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                        {product.name}
                      </div>
                      <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
                        {product.sku}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpanded(capture.productId)}
                    style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.blue, padding: 0, flexShrink: 0 }}
                  >
                    {capture.isExpanded
                      ? <><span>Collapse list</span><ChevronUpIcon /></>
                      : <><span>Capture serials</span><ChevronDownIcon /></>
                    }
                  </button>
                </div>

                {/* Serials to capture progress */}
                <div>
                  <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support }}>
                    Serials to capture:{"  "}
                  </span>
                  <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: logged >= needed && needed > 0 ? tokens.color.fg.green : tokens.color.fg.primary }}>
                    {logged > 0 ? `${logged} / ${needed}` : needed}
                  </span>
                </div>
              </div>

              {/* ── Expanded body ────────────────────────────────────────── */}
              {capture.isExpanded && (
                <>
                  {/* Input row — label handled by Input, NFC aligns to bottom */}
                  <div style={{ display: "flex", gap: tokens.spacing[2], alignItems: "flex-end" }}>
                    <ScanInput
                      label="Capture serials"
                      placeholder="Serial Number"
                      value={capture.activeInput}
                      onChange={(e) => updateActiveInput(capture.productId, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") confirmSerial(capture.productId, false); }}
                      onScan={() => confirmSerial(capture.productId, false)}
                    />
                    <button
                      onClick={() => confirmSerial(capture.productId, true)}
                      style={{ display: "flex", alignItems: "center", gap: "6px", height: "40px", padding: "0 14px", background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.md, fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" as const }}
                    >
                      <MaskedIcon16 url={nfcIconUrl} color={tokens.color.fg.primary} fallback={<AddFallback />} />
                      NFC
                    </button>
                  </div>

                  {/* Add another — immediately below input row */}
                  <button
                    onClick={() => confirmSerial(capture.productId, false)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.blue, padding: 0, display: "inline-block", textDecoration: "underline", alignSelf: "flex-start" }}
                  >
                    Add another
                  </button>

                  {/* Items to Add list */}
                  {capture.loggedSerials.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                      <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, margin: 0 }}>
                        Items to Add ({capture.loggedSerials.length}):
                      </p>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {capture.loggedSerials.map((serial, idx) => (
                          <div
                            key={idx}
                            style={{
                              display:      "flex",
                              alignItems:   "center",
                              gap:          tokens.spacing[4],
                              paddingTop:   tokens.spacing[2],
                              paddingBottom:tokens.spacing[2],
                              borderBottom: idx < capture.loggedSerials.length - 1
                                ? `1px solid ${tokens.color.divider.border}` : "none",
                            }}
                          >
                            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, flex: 1, minWidth: 0 }}>
                              #{serial.value}
                            </span>
                            {serial.hasNfc && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, flexShrink: 0 }}>
                                NFC added
                              </span>
                            )}
                            <button
                              onClick={() => removeLoggedSerial(capture.productId, idx)}
                              style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.md, padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                              aria-label="Remove serial"
                            >
                              {binIconUrl
                                ? <img src={binIconUrl} width={24} height={24} alt="" aria-hidden style={{ display: "block" }} />
                                : <TrashRedIcon />
                              }
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Tower machine info alert */}
      {showTowerBanner && (
        <div style={{ padding: "0 24px 24px" }}>
          <Alert
            tone="info"
            title="Or you can capture serials via tower machine"
            body="Find this task from your linked tower machine, so you can pick up the task from there."
            withCloseButton
            onClose={() => setShowTowerBanner(false)}
          />
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Incomplete Captures modal
// ---------------------------------------------------------------------------
function IncompleteModal({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: tokens.color.base.overlay, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div style={{ background: tokens.color.base.white, borderRadius: tokens.borderRadius.lg, padding: "24px", width: "360px", boxShadow: tokens.shadows.lg, position: "relative" }}>
        <button onClick={onStay} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }} aria-label="Close">
          <CloseModalIcon />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <ModalInfoIcon />
          <h2 style={{ fontFamily: tokens.fontFamily.sans, fontSize: "16px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, margin: 0 }}>
            Incomplete Captures
          </h2>
        </div>
        <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.support, margin: "0 0 24px" }}>
          You haven&apos;t captured the number of serials as what suppose to capture in setups. You can come back and continue to capture later on
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <Button label="Cancel"         variant="secondary" onClick={onStay}  />
          <Button label="Leave Task Now" variant="primary"   onClick={onLeave} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CaptureSerials() {
  const router = useRouter();
  const icons  = useFigmaIcons([...Object.values(SIDEBAR_ICON_IDS), BIN_ICON_ID, SCAN_ICON_ID, NFC_ICON_ID]);

  const [step,      setStep]      = useState<1 | 2>(1);
  const [showModal, setShowModal] = useState(false);

  const [batchForm, setBatchForm] = useState<BatchForm>({
    purchaseOrder:     "",
    salesOrderNumber:  "",
    customerReference: "",
    batchNumber:       "",
    dateOfManufacture: "2026-04-10",
  });

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [captures,         setCaptures]         = useState<ProductCapture[]>([]);

  function handleNext() {
    setCaptures(
      selectedProducts.map((p, i) => ({
        productId:     p.id,
        activeInput:   "",
        loggedSerials: [],
        isExpanded:    i === 0,
      })),
    );
    setStep(2);
  }

  // A capture is incomplete when ANY product has fewer logged serials than its quantity.
  // We also treat an in-progress activeInput as a signal that capture has started.
  function isIncomplete(): boolean {
    if (captures.length === 0) return false;
    return captures.some((c) => {
      const product = selectedProducts.find((p) => p.id === c.productId);
      if (!product) return false;
      // count logged + any in-progress input
      const confirmed = c.loggedSerials.length;
      const inProgress = c.activeInput.trim() ? 1 : 0;
      return (confirmed + inProgress) < product.quantity;
    });
  }

  // Cancel from Step 2 → show incomplete modal if captures are in progress
  function tryCancel() {
    if (step === 2 && (captures.length > 0) && isIncomplete()) {
      setShowModal(true);
    } else {
      router.push("/dashboard/serialisation");
    }
  }

  function handleSave() {
    localStorage.setItem(
      "newSerialCreated",
      JSON.stringify({
        source:        "External",
        date:          new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        format:        "",
        salesOrder:    batchForm.salesOrderNumber,
        purchaseOrder: batchForm.purchaseOrder,
        batch:         batchForm.batchNumber,
        dom:           batchForm.dateOfManufacture,
      }),
    );
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
    <>
      <AppShell
        appBar={{
          breadcrumbs: [
            { label: "Home",          href: "/"                        },
            { label: "Serialisation", href: "/dashboard/serialisation" },
            { label: "Capture serials" },
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
        {/* Page padding */}
        <div style={{ padding: "24px" }}>

          {/* ── Single white card ───────────────────────────────────────────── */}
          <div
            style={{
              background:    tokens.color.base.white,
              border:        `1px solid ${tokens.color.divider.border}`,
              borderRadius:  tokens.borderRadius.lg,
              display:       "flex",
              flexDirection: "column",
            }}
          >
            {/* Card header — title + subtitle (always visible) */}
            <div
              style={{
                padding:      "24px",
                borderBottom: `1px solid ${tokens.color.divider.border}`,
              }}
            >
              <h1 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h3, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h3, color: tokens.color.fg.primary, margin: "0 0 4px" }}>
                Capture Serials
              </h1>
              <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support, margin: 0 }}>
                {step === 1
                  ? "Use this tool to capture serials created outside of Scannable"
                  : "Scan or type serials to add them to the list. You can save your progress and finish the remaining units later."
                }
              </p>
            </div>

            {/* Card body — step-specific content */}
            {step === 1 && (
              <div style={{ flex: 1 }}>
                <Step1Content
                  batchForm={batchForm}
                  onBatchChange={setBatchForm}
                  selectedProducts={selectedProducts}
                  onProductsChange={setSelectedProducts}
                  binIconUrl={icons[BIN_ICON_ID]}
                />
              </div>
            )}

            {step === 2 && (
              <div style={{ flex: 1 }}>
                <Step2Content
                  selectedProducts={selectedProducts}
                  captures={captures}
                  onCapturesChange={setCaptures}
                  binIconUrl={icons[BIN_ICON_ID]}
                  nfcIconUrl={icons[NFC_ICON_ID]}
                />
              </div>
            )}

            {/* Card footer — actions always inside the card */}
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: step === 2 ? "space-between" : "flex-end",
                padding:        "16px 24px",
                borderTop:      `1px solid ${tokens.color.divider.border}`,
              }}
            >
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, padding: 0 }}
                >
                  <BackIcon />Back
                </button>
              )}
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  label="Cancel"
                  variant="secondary"
                  onClick={step === 1 ? () => router.push("/dashboard/serialisation") : tryCancel}
                />
                {step === 1
                  ? <Button label="Next Step" variant="primary" onClick={handleNext} />
                  : <Button label="Save"      variant="primary" onClick={handleSave} />
                }
              </div>
            </div>

          </div>{/* end card */}
        </div>{/* end padding */}
      </AppShell>

      {/* Incomplete Captures modal */}
      {showModal && (
        <IncompleteModal
          onStay={() => setShowModal(false)}
          onLeave={() => { setShowModal(false); router.push("/dashboard/serialisation"); }}
        />
      )}
    </>
  );
}
