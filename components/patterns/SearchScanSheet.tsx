"use client";
// components/patterns/SearchScanSheet.tsx
// Figma: Serials file — nodes 58:7626 (Scan tab), 58:9067 (Scan results),
//                        58:9337 (Search tab), 58:9694 (Search results)
//
// Universal search/scan overlay triggered by the lime centre button in MobileBottomNav.
// Exports:
//   SearchScanSheet  — full sheet with NFC + Scan + Search tabs

import React, { useRef, useState } from "react";
import tokens from "@/styles/design-tokens";
import { ContextMenu } from "@/components/patterns/ContextMenu";
import { ScanView, SCAN_KEYFRAMES } from "@/components/patterns/ScanSimulation";

// ── Types ──────────────────────────────────────────────────────────────────────

type ActiveTab    = "nfc" | "scan" | "search";
type FilterChip   = "all" | "products" | "items";

export interface SearchScanSheetProps {
  open: boolean;
  onClose: () => void;
  /** Which tab opens first. Default: "scan". */
  defaultTab?: "scan" | "search";
  /** Called when user selects a result from the scan results list (non-productOnly mode). */
  onScanDetected?: (value: string) => void;
  /**
   * When true the sheet uses position:absolute rather than fixed — for use
   * inside the 100dvh mobile prototype wrapper (same as ContextMenu contained).
   */
  contained?: boolean;
  /** Show products only — no filter chips, no items. For product-picker contexts. */
  productOnly?: boolean;
  /** Called when a product is selected in productOnly mode. Sheet auto-closes after. */
  onProductSelected?: (p: ScanResult) => void;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

export interface ScanResult {
  id: string;
  name: string;
  brand: string;
  sku: string;
}

interface MockItem {
  id: string;
  name: string;
  brand: string;
  sku: string;
  serial: string;
  status: "Safe" | "Item";
  inspection?: string;
  nextDue?: string;
  expiry?: string;
}

interface MockProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
}

// Scan detection results — simple list shown after scanning (fig 58:9067)
const MOCK_SCAN_RESULTS: ScanResult[] = [
  { id: "sr1", name: "Ultra O Locksafe",        brand: "DMM", sku: "A327"    },
  { id: "sr2", name: "Ultra O Locksafe Orange",  brand: "DMM", sku: "A327OR"  },
  { id: "sr3", name: "Ultra O Locksafe Grey",    brand: "DMM", sku: "A327MG"  },
  { id: "sr4", name: "Ultra O Captive Bar",      brand: "DMM", sku: "A322-ID" },
  { id: "sr5", name: "Ultra O Black Kwiklock",   brand: "DMM", sku: "A323BLK" },
];

// Search results — full detail shown when typing (fig 58:9694)
const MOCK_ITEMS: MockItem[] = [
  {
    id: "i1",
    name: "11MM Kernmantle Ma...",
    brand: "Marlow",
    sku: "ZTO11/11",
    serial: "#132241154A",
    status: "Safe",
    inspection: "Passed",
    nextDue: "10 Dec 2024",
    expiry: "10 Dec 2030",
  },
  {
    id: "i2",
    name: "Ultra O Locksafe",
    brand: "DMM",
    sku: "A327",
    serial: "#132241154A",
    status: "Item",
  },
];

const MOCK_PRODUCTS: MockProduct[] = [
  { id: "p1", name: "Ultra O Locksafe - A327",         brand: "DMM", sku: "A327MG" },
  { id: "p2", name: "Ultra O Locksafe Orange - A327OR", brand: "DMM", sku: "A327OR" },
];

// ── Inline icons ───────────────────────────────────────────────────────────────

function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.6" />
      <path d="M13.5 13.5L17 17" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseSmIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" fill={color} />
      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraPlaceholderIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function MenuHorizIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="4"  cy="10" r="1.5" fill={color} />
      <circle cx="10" cy="10" r="1.5" fill={color} />
      <circle cx="16" cy="10" r="1.5" fill={color} />
    </svg>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: ActiveTab; onChange: (t: ActiveTab) => void }) {
  const tabs: { key: ActiveTab; label: string; disabled?: boolean }[] = [
    { key: "nfc",    label: "NFC",    disabled: true },
    { key: "scan",   label: "Scan"   },
    { key: "search", label: "Search" },
  ];

  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "stretch",
        gap:            tokens.spacing[1],
        paddingLeft:    tokens.spacing[1],
        paddingRight:   tokens.spacing[1],
        paddingTop:     tokens.spacing[3],
        borderBottom:   `1px solid ${tokens.color.divider.border}`,
        background:     tokens.color.base.white,
        flexShrink:     0,
        zIndex:         2,
      }}
    >
      {tabs.map(({ key, label, disabled }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            disabled={disabled}
            onClick={() => !disabled && onChange(key)}
            style={{
              flex:            "1 1 0",
              display:         "flex",
              flexDirection:   "column",
              alignItems:      "center",
              gap:             tokens.spacing[3],
              border:          "none",
              background:      "transparent",
              padding:         0,
              cursor:          disabled ? "not-allowed" : "pointer",
              outline:         "none",
            }}
          >
            <span
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                paddingLeft:    tokens.spacing[4],
                paddingRight:   tokens.spacing[4],
                fontFamily:     tokens.fontFamily.sans,
                fontSize:       tokens.fontSize.body,
                fontWeight:     isActive ? tokens.fontWeight.semiBold : tokens.fontWeight.medium,
                lineHeight:     tokens.lineHeight.body,
                color:          isActive ? tokens.color.fg.blue : tokens.color.fg.support,
                whiteSpace:     "nowrap",
              }}
            >
              {label}
            </span>
            <div
              style={{
                height:               "2px",
                width:                "100%",
                background:           isActive ? "#6366f1" : "transparent",
                borderTopLeftRadius:  "2px",
                borderTopRightRadius: "2px",
                flexShrink:           0,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Scan result row — simple format shown after a successful scan ───────────────
// Figma: 58:9067

function ScanResultRow({ result, onClick }: { result: ScanResult; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           tokens.spacing[3],
        paddingTop:    tokens.spacing[3],
        paddingBottom: tokens.spacing[3],
        borderBottom:  `1px solid ${tokens.color.divider.border}`,
        cursor:        "pointer",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width:          "48px",
          height:         "48px",
          flexShrink:     0,
          borderRadius:   tokens.borderRadius.md,
          border:         `1px solid ${tokens.color.divider.border}`,
          background:     tokens.color.bg.lightBg,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <CameraPlaceholderIcon color={tokens.color.fg.disabled} />
      </div>

      {/* Name + brand/sku */}
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        <span
          style={{
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.body,
            fontWeight:   tokens.fontWeight.medium,
            lineHeight:   tokens.lineHeight.body,
            color:        tokens.color.fg.primary,
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}
        >
          {result.name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
            {result.brand}
          </span>
          <div style={{ width: "1px", height: "12px", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
            {result.sku}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Scan tab content ───────────────────────────────────────────────────────────
// State 1 (scanning): camera view fills the area — ScanView with auto-timer.
// State 2 (detected): camera replaced in-place by results list. "Clear" resets.

function ScanTabContent({ onResultSelect }: { onResultSelect: (r: ScanResult) => void }) {
  const [scanState, setScanState] = useState<"scanning" | "detected">("scanning");
  // Increment to remount ScanView (restarts the auto-timer) when user taps Clear.
  const [scanKey, setScanKey] = useState(0);

  const handleClear = () => {
    setScanState("scanning");
    setScanKey(k => k + 1);
  };

  if (scanState === "scanning") {
    return (
      <div style={{ flex: "1 1 0", minHeight: 0, position: "relative", overflow: "hidden" }}>
        <style>{SCAN_KEYFRAMES}</style>
        <ScanView
          key={scanKey}
          scanLabel={null}
          hint="Looking for QR or barcode…"
          subHint="Hold steady · keep label flat"
          mockValue="12344433-43"
          frameSize={190}
          onDetected={() => setScanState("detected")}
        />
      </div>
    );
  }

  // Detected state — camera replaced by results list
  return (
    <div
      style={{
        flex:          "1 1 0",
        minHeight:     0,
        display:       "flex",
        flexDirection: "column",
        overflowY:     "auto",
        background:    tokens.color.base.white,
      }}
    >
      {/* Results header */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        `${tokens.spacing[3]} ${tokens.spacing[4]}`,
          borderBottom:   `1px solid ${tokens.color.divider.border}`,
          flexShrink:     0,
        }}
      >
        <span
          style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular,
            color:      tokens.color.fg.support,
          }}
        >
          {MOCK_SCAN_RESULTS.length} Results Found
        </span>
        <button
          onClick={handleClear}
          style={{
            border:         "none",
            background:     "transparent",
            cursor:         "pointer",
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,
            fontWeight:     tokens.fontWeight.medium,
            color:          tokens.color.fg.primary,
            textDecoration: "underline",
            padding:        0,
          }}
        >
          Clear
        </button>
      </div>

      {/* Result rows */}
      <div style={{ paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[4] }}>
        {MOCK_SCAN_RESULTS.map((result) => (
          <ScanResultRow
            key={result.id}
            result={result}
            onClick={() => onResultSelect(result)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Filter chips ───────────────────────────────────────────────────────────────

function FilterChips({ active, onChange }: { active: FilterChip; onChange: (c: FilterChip) => void }) {
  const chips: { key: FilterChip; label: string }[] = [
    { key: "all",      label: "All"      },
    { key: "products", label: "Products" },
    { key: "items",    label: "Items"    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[4], flexShrink: 0, height: "36px" }}>
      <span
        style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize:   tokens.fontSize.body,
          fontWeight: tokens.fontWeight.regular,
          lineHeight: tokens.lineHeight.body,
          color:      tokens.color.fg.support,
          whiteSpace: "nowrap",
        }}
      >
        Search:
      </span>
      <div style={{ display: "flex", gap: tokens.spacing[2], alignItems: "center" }}>
        {chips.map(({ key, label }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        `${tokens.spacing[2]} ${tokens.spacing[2]}`,
                borderRadius:   tokens.borderRadius.md,
                border:         `1px solid ${isActive ? "#6366f1" : tokens.color.divider.frame}`,
                background:     isActive ? "#EEF2FF" : tokens.color.base.white,
                fontFamily:     tokens.fontFamily.sans,
                fontSize:       tokens.fontSize.body,
                fontWeight:     isActive ? tokens.fontWeight.medium : tokens.fontWeight.regular,
                lineHeight:     tokens.lineHeight.body,
                color:          isActive ? tokens.color.fg.blue : tokens.color.fg.primary,
                cursor:         "pointer",
                outline:        "none",
                whiteSpace:     "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Product thumbnail ──────────────────────────────────────────────────────────

function ProductThumb() {
  return (
    <div
      style={{
        width:          "56px",
        height:         "56px",
        flexShrink:     0,
        borderRadius:   tokens.borderRadius.md,
        border:         `1px solid ${tokens.color.divider.border}`,
        background:     tokens.color.bg.lightBg,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        overflow:       "hidden",
      }}
    >
      <CameraPlaceholderIcon color={tokens.color.fg.disabled} />
    </div>
  );
}

// ── Safe / Item / Product status badge ─────────────────────────────────────────

function StatusBadge({ label, type }: { label: string; type: "safe" | "item" | "product" }) {
  const styles: Record<string, { bg: string; text: string }> = {
    safe:    { bg: "#DCFCE7", text: "#166534" },
    item:    { bg: "#DCFCE7", text: "#166534" },
    product: { bg: "#F3F4F6", text: "#111827" },
  };
  const { bg, text } = styles[type];
  return (
    <span
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          "2px",
        padding:      `2px ${tokens.spacing[2]}`,
        borderRadius: tokens.borderRadius.full,
        background:   bg,
        fontFamily:   tokens.fontFamily.sans,
        fontSize:     tokens.fontSize.bodySmall,
        fontWeight:   tokens.fontWeight.semiBold,
        lineHeight:   tokens.lineHeight.bodySmall,
        color:        text,
        whiteSpace:   "nowrap",
        flexShrink:   0,
      }}
    >
      {type === "safe" && <CheckCircleIcon color="#22C55E" />}
      {label}
    </span>
  );
}

// ── Item result card ───────────────────────────────────────────────────────────

function ItemCard({ item }: { item: MockItem }) {
  const isItem = item.status === "Item";

  return (
    <div
      style={{
        display:      "flex",
        gap:          tokens.spacing[4],
        alignItems:   "center",
        padding:      tokens.spacing[2],
        borderRadius: tokens.borderRadius.md,
        border:       `1px solid ${tokens.color.divider.border}`,
        background:   tokens.color.base.white,
      }}
    >
      <ProductThumb />

      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", gap: tokens.spacing[1], alignItems: "flex-start", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,
              fontWeight:   tokens.fontWeight.medium,
              lineHeight:   tokens.lineHeight.body,
              color:        tokens.color.fg.primary,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
              flex:         "1 1 0",
              minWidth:     0,
            }}
          >
            {item.name}
          </span>
          <StatusBadge label={item.status} type={item.status === "Safe" ? "safe" : "item"} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
            {item.brand}
          </span>
          <div style={{ width: "1px", height: "12px", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
            {item.sku}
          </span>
        </div>

        <span
          style={{
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.bodySmall,
            fontWeight:     tokens.fontWeight.regular,
            lineHeight:     tokens.lineHeight.bodySmall,
            color:          tokens.color.fg.primary,
            textDecoration: "underline",
          }}
        >
          {item.serial}
        </span>

        {!isItem && item.inspection && (
          <div style={{ display: "flex", gap: tokens.spacing[5], alignItems: "center" }}>
            {[
              { label: "Inspection", value: item.inspection },
              { label: "Next Due",   value: item.nextDue    },
              { label: "Expiry",     value: item.expiry     },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, lineHeight: "16px" }}>
                  {label}
                </span>
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, lineHeight: "16px" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        style={{
          width:          "36px",
          height:         "36px",
          flexShrink:     0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          border:         `1px solid ${tokens.color.divider.frame}`,
          borderRadius:   tokens.borderRadius.md,
          background:     tokens.color.base.white,
          cursor:         "pointer",
          outline:        "none",
        }}
      >
        <MenuHorizIcon color={tokens.color.fg.primary} />
      </button>
    </div>
  );
}

// ── Product result row ─────────────────────────────────────────────────────────

function ProductRow({ product, onSelect }: { product: MockProduct; onSelect?: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        display:       "flex",
        gap:           tokens.spacing[4],
        alignItems:    "center",
        width:         "100%",
        background:    "transparent",
        border:        "none",
        borderBottom:  `1px solid ${tokens.color.divider.border}`,
        cursor:        onSelect ? "pointer" : "default",
        textAlign:     "left",
        outline:       "none",
        padding:       `${tokens.spacing[2]} 0`,
      }}
    >
      <ProductThumb />

      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", gap: tokens.spacing[1], alignItems: "flex-start", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,
              fontWeight:   tokens.fontWeight.medium,
              lineHeight:   tokens.lineHeight.body,
              color:        tokens.color.fg.primary,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
              flex:         "1 1 0",
              minWidth:     0,
            }}
          >
            {product.name}
          </span>
          <StatusBadge label="Product" type="product" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
            {product.brand}
          </span>
          <div style={{ width: "1px", height: "12px", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
            {product.sku}
          </span>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          width:          "36px",
          height:         "36px",
          flexShrink:     0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          border:         `1px solid ${tokens.color.divider.frame}`,
          borderRadius:   tokens.borderRadius.md,
          background:     tokens.color.base.white,
        }}
      >
        <ChevronRightIcon color={tokens.color.fg.primary} />
      </div>
    </button>
  );
}

// ── Search tab content ─────────────────────────────────────────────────────────

function SearchTabContent({
  productOnly       = false,
  onProductSelected,
  onClose,
}: {
  productOnly?:       boolean;
  onProductSelected?: (p: ScanResult) => void;
  onClose?:           () => void;
}) {
  const [query,   setQuery]   = useState("");
  const [chip,    setChip]    = useState<FilterChip>("all");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasQuery     = query.trim().length > 0;
  const showItems    = hasQuery && !productOnly && (chip === "all" || chip === "items");
  const showProducts = hasQuery && (productOnly || chip === "all" || chip === "products");

  return (
    <div
      style={{
        flex:          "1 1 0",
        minHeight:     0,
        display:       "flex",
        flexDirection: "column",
        overflowY:     "auto",
        padding:       `${tokens.spacing[4]} ${tokens.spacing[4]}`,
        gap:           tokens.spacing[2],
      }}
    >
      {/* Search input */}
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          tokens.spacing[2],
          padding:      `${tokens.spacing[2]} ${tokens.spacing[2.5]}`,
          borderRadius: tokens.borderRadius.md,
          border:       `${focused ? 2 : 1}px solid ${focused ? "#6366f1" : tokens.color.divider.frame}`,
          background:   tokens.color.base.white,
          boxShadow:    "0 1px 4px rgba(0,0,0,0.05)",
          flexShrink:   0,
        }}
      >
        <SearchIcon color={tokens.color.fg.support} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={productOnly ? "Search by name or part number..." : "Search by name, part or serial number..."}
          style={{
            flex:       "1 1 0",
            border:     "none",
            outline:    "none",
            background: "transparent",
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.body,
            color:      tokens.color.fg.primary,
            minWidth:   0,
          }}
        />
        {hasQuery && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              width:          "24px",
              height:         "24px",
              border:         "none",
              background:     "transparent",
              cursor:         "pointer",
              padding:        0,
              flexShrink:     0,
            }}
          >
            <CloseSmIcon color={tokens.color.fg.support} />
          </button>
        )}
      </div>

      {/* Filter chips — hidden in product-only mode */}
      {!productOnly && <FilterChips active={chip} onChange={setChip} />}

      {/* Results */}
      {hasQuery && (
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4], marginTop: tokens.spacing[2] }}>

          {showItems && (
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
              <div
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  paddingBottom:  tokens.spacing[2],
                  paddingTop:     tokens.spacing[1],
                }}
              >
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support }}>
                  {MOCK_ITEMS.length} items
                </span>
                <button
                  onClick={() => setQuery("")}
                  style={{
                    border:         "none",
                    background:     "transparent",
                    cursor:         "pointer",
                    fontFamily:     tokens.fontFamily.sans,
                    fontSize:       tokens.fontSize.body,
                    fontWeight:     tokens.fontWeight.medium,
                    color:          tokens.color.fg.primary,
                    textDecoration: "underline",
                    paddingLeft:    tokens.spacing[4],
                    borderLeft:     `1px solid ${tokens.color.divider.border}`,
                  }}
                >
                  Clear
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
                {MOCK_ITEMS.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
            </div>
          )}

          {showProducts && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, marginBottom: tokens.spacing[1] }}>
                {MOCK_PRODUCTS.length} products:
              </span>
              {MOCK_PRODUCTS.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onSelect={productOnly ? () => { onProductSelected?.(product); onClose?.(); } : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── SearchScanSheet ────────────────────────────────────────────────────────────

export function SearchScanSheet({
  open,
  onClose,
  defaultTab    = "scan",
  onScanDetected,
  contained     = false,
  productOnly   = false,
  onProductSelected,
}: SearchScanSheetProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(defaultTab);

  // Reset to default tab when sheet closes (after slide-out animation).
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setActiveTab(defaultTab), 350);
      return () => clearTimeout(t);
    }
  }, [open, defaultTab]);

  return (
    <ContextMenu
      variant="bottom-sheet-mobile"
      open={open}
      onClose={onClose}
      contained={contained}
    >
      {/*
       * Fixed 650px content height → total sheet panel ≈ 680px
       * (650px content + ~22px drag handle + ~8px panel paddingBottom)
       */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          height:        "650px",
          overflow:      "hidden",
        }}
      >
        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === "scan" && (
          <ScanTabContent
            onResultSelect={(result) => {
              if (productOnly && onProductSelected) {
                onProductSelected(result);
              } else {
                onScanDetected?.(result.id);
              }
              onClose();
            }}
          />
        )}

        {activeTab === "search" && (
          <SearchTabContent
            productOnly={productOnly}
            onProductSelected={onProductSelected}
            onClose={onClose}
          />
        )}

        {activeTab === "nfc" && (
          <div
            style={{
              flex:           "1 1 0",
              minHeight:      0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              padding:        tokens.spacing[8],
            }}
          >
            <span
              style={{
                fontFamily: tokens.fontFamily.sans,
                fontSize:   tokens.fontSize.body,
                color:      tokens.color.fg.disabled,
                textAlign:  "center",
              }}
            >
              NFC scanning coming soon
            </span>
          </div>
        )}
      </div>
    </ContextMenu>
  );
}

export default SearchScanSheet;
