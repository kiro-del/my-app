"use client";
// app/mobile/create-serials/page.tsx
// Figma: Serials — nodes 20:8041, 56:4836, 58:7173, 58:10145, 50:3258, 56:5910, 59:10623, 60:11187

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { ScanInput } from "@/components/ui/mobile/InputScan";
import { InputCalendar } from "@/components/ui/mobile/InputCalendar";
import { ProductImg } from "@/components/ui/ProductImg";
import { ScanSimulationSheet } from "@/components/patterns/ScanSimulationSheet";
import { SearchScanSheet, type ScanResult } from "@/components/patterns/SearchScanSheet";

// ── Data ───────────────────────────────────────────────────────────────────────

const QUANTITY_PRESETS = [5, 20, 40, 60, 100];

const SERIAL_FORMATS = [
  {
    id:          "customer",
    name:        'Format incl. "customer"',
    description: "(DOM) YYMM  |  Customer (--)  |  Increments (0001)",
  },
  {
    id:          "scannable",
    name:        "Scannable Serial Format",
    description: "(DOM) YYMM  |  Increments (0001)",
  },
  {
    id:          "nfc",
    name:        "NFC TAG PACKING ID",
    description: "(Prefix) SCAN  |  Increments (0001)",
  },
];

// Figma DS icon node IDs
const TRASH_ICON_ID    = "49:967";
interface SelectedProduct extends ScanResult {
  quantity: number;
}

// ── Inline icons ───────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke={tokens.color.fg.disabled} strokeWidth="1.3"/>
      <path d="M10.5 10.5L14 14" stroke={tokens.color.fg.disabled} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

// ── CSS-mask icon helper (same pattern as serialisation page) ─────────────────

function MaskIcon({ url, color, size = 16, fallback }: {
  url?:     string;
  color:    string;
  size?:    number;
  fallback: React.ReactNode;
}) {
  if (!url) return <>{fallback}</>;
  return (
    <span
      aria-hidden
      style={{
        display:            "inline-block",
        width:              size,
        height:             size,
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
    />
  );
}

// Fallback trash SVG using the exact Figma path data (node 49:967, 16×18 canvas)
function TrashFallback({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 18" fill="none" aria-hidden>
      <path
        d="M15 4L14.133 16.142C14.058 17.189 13.187 18 12.138 18H3.862C2.813 18 1.942 17.189 1.867 16.142L1 4M6 8V14M10 8V14M11 4V1C11 0.448 10.552 0 10 0H6C5.448 0 5 0.448 5 1V4M0 4H16"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}


// ── Shared sub-components ──────────────────────────────────────────────────────

function FieldLabel({ text }: { text: string }) {
  return (
    <span style={{
      fontFamily: tokens.fontFamily.sans,
      fontSize:   tokens.fontSize.body,
      fontWeight: tokens.fontWeight.medium,
      lineHeight: tokens.lineHeight.body,
      color:      tokens.color.fg.primary,
    }}>
      {text}
    </span>
  );
}

function TextInput({
  value,
  onChange,
  placeholder = "",
}: {
  value:        string;
  onChange?:    (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width:         "100%",
        padding:       `${tokens.spacing[2.5]} ${tokens.spacing[3]}`,
        border:        `${focused ? 2 : 1}px solid ${focused ? "#6366f1" : tokens.color.divider.frame}`,
        borderRadius:  tokens.borderRadius.md,
        fontFamily:    tokens.fontFamily.sans,
        fontSize:      tokens.fontSize.body,
        lineHeight:    tokens.lineHeight.body,
        color:         tokens.color.fg.primary,
        background:    tokens.color.base.white,
        outline:       "none",
        boxSizing:     "border-box",
      } as React.CSSProperties}
    />
  );
}

function SectionDivider() {
  return <div style={{ height: "1px", background: tokens.color.divider.frame, margin: `${tokens.spacing[6]} 0` }} />;
}

// ── Selected product row ───────────────────────────────────────────────────────

function SelectedProductRow({
  product,
  trashIconUrl,
  onRemove,
  onQuantityChange,
}: {
  product:          SelectedProduct;
  trashIconUrl?:    string;
  onRemove:         () => void;
  onQuantityChange: (q: number) => void;
}) {
  const [stepperFocused, setStepperFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
      {/* Product info row */}
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[3] }}>
        <ProductImg size={56} />

        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.body,
            fontWeight:   tokens.fontWeight.medium,
            lineHeight:   tokens.lineHeight.body,
            color:        tokens.color.fg.primary,
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}>
            {product.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
              {product.brand}
            </span>
            <div style={{ width: "1px", height: "10px", background: tokens.color.divider.frame, flexShrink: 0 }} />
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
              {product.sku}
            </span>
          </div>
        </div>

        {/* Remove button — 24px icon, 4px padding */}
        <button
          type="button"
          onClick={onRemove}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "4px",
            flexShrink:     0,
            border:         `1px solid ${tokens.color.divider.frame}`,
            borderRadius:   tokens.borderRadius.md,
            background:     tokens.color.base.white,
            cursor:         "pointer",
          }}
        >
          <MaskIcon
            url={trashIconUrl}
            color={tokens.color.fg.red}
            size={24}
            fallback={<TrashFallback color={tokens.color.fg.red} />}
          />
        </button>
      </div>

      {/* Quantity of serials — stepper */}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
        <span style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize:   "14px",
          fontWeight: tokens.fontWeight.medium,
          lineHeight: "20px",
          color:      tokens.color.fg.primary,
        }}>
          Quantity of serials
        </span>

        {/* Stepper container */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          background:     tokens.color.base.white,
          border:         stepperFocused
            ? `2px solid ${tokens.color.divider.blue}`
            : `1px solid ${tokens.color.divider.frame}`,
          borderRadius:   "8px",
          padding:        tokens.spacing[2],
          boxShadow:      tokens.shadows.sm,
          boxSizing:      "border-box",
        }}>
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(0, product.quantity - 1))}
            style={{
              width:          40,
              height:         40,
              flexShrink:     0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              border:         `1px solid ${tokens.color.divider.frame}`,
              borderRadius:   tokens.borderRadius.md,
              background:     tokens.color.base.white,
              cursor:         "pointer",
              fontSize:       20,
              color:          tokens.color.fg.primary,
              boxSizing:      "border-box",
            }}
          >−</button>
          <input
            type="number"
            min={0}
            value={product.quantity === 0 ? "" : product.quantity}
            placeholder="0"
            onFocus={() => setStepperFocused(true)}
            onBlur={() => setStepperFocused(false)}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              onQuantityChange(isNaN(v) || v < 0 ? 0 : v);
            }}
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    "18px",
              fontWeight:  tokens.fontWeight.medium,
              lineHeight:  "24px",
              color:       tokens.color.fg.primary,
              textAlign:   "center",
              flex:        "1 1 0",
              border:      "none",
              outline:     "none",
              background:  "transparent",
              minWidth:    0,
            }}
          />
          <button
            type="button"
            onClick={() => onQuantityChange(product.quantity + 1)}
            style={{
              width:          40,
              height:         40,
              flexShrink:     0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              border:         `1px solid ${tokens.color.divider.frame}`,
              borderRadius:   tokens.borderRadius.md,
              background:     tokens.color.base.white,
              cursor:         "pointer",
              fontSize:       20,
              color:          tokens.color.fg.primary,
              boxSizing:      "border-box",
            }}
          >+</button>
        </div>

        {/* Quick-select chips */}
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2] }}>
          {QUANTITY_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => onQuantityChange(preset)}
              style={{
                flex:           "1 1 0",
                height:         32,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                border:         product.quantity === preset
                  ? `1.5px solid ${tokens.color.palette.indigo[500]}`
                  : `1px solid ${tokens.color.divider.frame}`,
                borderRadius:   tokens.borderRadius.full,
                background:     product.quantity === preset ? "#eef2ff" : tokens.color.base.white,
                cursor:         "pointer",
                fontFamily:     tokens.fontFamily.sans,
                fontSize:       "14px",
                fontWeight:     tokens.fontWeight.medium,
                lineHeight:     "20px",
                color:          product.quantity === preset ? tokens.color.palette.indigo[500] : tokens.color.fg.primary,
                boxSizing:      "border-box",
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreateSerialsPage() {
  const router  = useRouter();
  const icons   = useFigmaIcons([TRASH_ICON_ID]);
  const [dateOfManufacture, setDateOfManufacture] = useState("");
  const [selectedFormat,   setSelectedFormat]   = useState<string | null>(null);
  const [purchaseOrder,    setPurchaseOrder]    = useState("Black");
  const [orderNumber,      setOrderNumber]      = useState("B213456");
  const [customerRef,      setCustomerRef]      = useState("");
  const [batchNumber,      setBatchNumber]      = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const [batchScanOpen,   setBatchScanOpen]   = useState(false);
  const [productScanOpen, setProductScanOpen] = useState(false);
  const [productSheetTab, setProductSheetTab] = useState<"scan" | "search">("scan");

  function openProductScan() {
    setProductSheetTab("scan");
    setProductScanOpen(true);
  }

  function openProductSearch() {
    setProductSheetTab("search");
    setProductScanOpen(true);
  }

  function handleProductSelected(p: ScanResult) {
    setSelectedProducts(prev => {
      if (prev.find(x => x.id === p.id)) return prev;
      return [...prev, { ...p, quantity: 1 }];
    });
  }

  function handleRemoveProduct(id: string) {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  }

  function handleQuantityChange(id: string, q: number) {
    setSelectedProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: q } : p));
  }

  function handleCreateSerials() {
    localStorage.setItem("mobileSerialCreated", "1");
    router.push("/mobile/serialisation");
  }


  return (
    <div style={{
      height:        "100dvh",
      display:       "flex",
      flexDirection: "column",
      background:    tokens.color.base.white,
      overflow:      "hidden",
      position:      "relative",
    }}>
      {/* App bar */}
      <MobileAppBar
        page="task"
        title="Create serials"
        onClose={() => router.push("/mobile/serialisation")}
      />

      {/* Scrollable form */}
      <div style={{
        flex:      "1 0 0",
        minHeight: 0,
        overflowY: "auto",
        padding:   `${tokens.spacing[4]} ${tokens.spacing[4]} ${tokens.spacing[6]}`,
      }}>

        {/* ── Serial details ── */}
        <h2 style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize:   tokens.fontSize.h4,
          fontWeight: tokens.fontWeight.semiBold,
          lineHeight: tokens.lineHeight.h4,
          color:      tokens.color.fg.primary,
          margin:     `0 0 ${tokens.spacing[4]}`,
        }}>
          Serial details
        </h2>

        {/* Format selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4], marginBottom: tokens.spacing[5] }}>
          <FieldLabel text="Select a serial format (required)" />
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            {SERIAL_FORMATS.map(fmt => (
              <SelectionCard
                key={fmt.id}
                type="radio"
                label={fmt.name}
                description={fmt.description}
                checked={selectedFormat === fmt.id}
                onChange={() => setSelectedFormat(fmt.id)}
              />
            ))}
          </div>
        </div>

        {/* Purchase order */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5], marginBottom: tokens.spacing[4] }}>
          <FieldLabel text="Purchase order" />
          <TextInput value={purchaseOrder} onChange={setPurchaseOrder} />
        </div>

        {/* Order number */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5], marginBottom: tokens.spacing[4] }}>
          <FieldLabel text="Order number" />
          <TextInput value={orderNumber} onChange={setOrderNumber} />
        </div>

        {/* Customer reference */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5], marginBottom: tokens.spacing[4] }}>
          <FieldLabel text="Customer reference" />
          <TextInput
            value={customerRef}
            onChange={setCustomerRef}
            placeholder="Enter a customer reference number"
          />
        </div>

        {/* Batch number — with scan button */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5], marginBottom: tokens.spacing[4] }}>
          <FieldLabel text="Batch number" />
          <ScanInput
            value={batchNumber}
            onChange={e => setBatchNumber(e.target.value)}
            onScan={() => setBatchScanOpen(true)}
          />
        </div>

        {/* Date of manufacture */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5], marginBottom: tokens.spacing[2] }}>
          <FieldLabel text="Date of manufacture" />
          <InputCalendar
            value={dateOfManufacture}
            onChange={setDateOfManufacture}
            placeholder="Select date"
          />
        </div>

        <SectionDivider />

        {/* ── Assign to products ── */}
        <div style={{ marginBottom: tokens.spacing[3] }}>
          <h2 style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.h4,
            fontWeight: tokens.fontWeight.semiBold,
            lineHeight: tokens.lineHeight.h4,
            color:      tokens.color.fg.primary,
            margin:     `0 0 ${tokens.spacing[2]}`,
          }}>
            Assign to products
          </h2>
          <p style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.bodySmall,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: "1.5",
            color:      tokens.color.fg.support,
            margin:     0,
          }}>
            Select one or more products to assign these serials to. Note: This tool is not available for Assembly product types.
          </p>
        </div>

        {/* Search + Scan bar */}
        <div style={{ marginBottom: tokens.spacing[6] }}>
          <ScanInput
            placeholder="Search by SKU name or code"
            leadingIcon={<SearchIcon />}
            value=""
            readOnly
            onClick={openProductSearch}
            onScan={openProductScan}
          />
        </div>

        {/* Selected products */}
        {selectedProducts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[5] }}>
              {selectedProducts.map(p => (
                <SelectedProductRow
                  key={p.id}
                  product={p}
                  trashIconUrl={icons[TRASH_ICON_ID]}
                  onRemove={() => handleRemoveProduct(p.id)}
                  onQuantityChange={q => handleQuantityChange(p.id, q)}
                />
              ))}
          </div>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div style={{
        padding:    `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        borderTop:  `1px solid ${tokens.color.divider.border}`,
        background: tokens.color.base.white,
        flexShrink: 0,
      }}>
        <button
          type="button"
          onClick={handleCreateSerials}
          style={{
            width:          "100%",
            height:         "44px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     tokens.color.brand.lime,
            border:         `1px solid ${tokens.color.divider.lime}`,
            borderRadius:   tokens.borderRadius.md,
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,
            fontWeight:     tokens.fontWeight.semiBold,
            color:          tokens.color.fg.primary,
            cursor:         "pointer",
          }}
        >
          Create serials
        </button>
      </div>

      {/* ── Batch number scan sheet ── */}
      <ScanSimulationSheet
        open={batchScanOpen}
        onClose={() => setBatchScanOpen(false)}
        onDetected={(v) => { setBatchNumber(v); setBatchScanOpen(false); }}
        contained
      />

      {/* ── Product search / scan sheet ── */}
      <SearchScanSheet
        open={productScanOpen}
        onClose={() => setProductScanOpen(false)}
        defaultTab={productSheetTab}
        productOnly
        onProductSelected={handleProductSelected}
        contained
      />
    </div>
  );
}
