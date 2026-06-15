"use client";
// app/mobile/capture-serials/page.tsx
// Figma: Serials — nodes 30:3055, 60:11551, 60:11684, 60:11852, 31:4162, 30:3177, 31:4075, 60:12395

import React, { useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { SelectionCard } from "@/components/ui/SelectionCard";
import { Input } from "@/components/ui/Input";
import { ScanInput } from "@/components/ui/ScanInput";
import { ProductImg } from "@/components/ui/ProductImg";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { GloryItem } from "@/components/ui/GloryItems";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ScanSimulationSheet } from "@/components/patterns/ScanSimulationSheet";
import { SearchScanSheet, type ScanResult } from "@/components/patterns/SearchScanSheet";

// ── Data ───────────────────────────────────────────────────────────────────────

const SERIAL_FORMATS = [
  { id: "customer", name: 'Format incl. "customer"', description: "(DOM) YYMM  |  Customer (--)  |  Increments (0001)" },
  { id: "scannable", name: "Scannable Serial Format",  description: "(DOM) YYMM  |  Increments (0001)" },
  { id: "nfc",      name: "NFC TAG PACKING ID",        description: "(Prefix) SCAN  |  Increments (0001)" },
];

// Figma DS icon IDs
const SCAN_NFC_ID = "3460:9895"; // 64px multi-colour — <img>
const SCAN_ID     = "3953:13529"; // 16px — mask
const NFC_ADD_ID  = "2064:1089";  // 16px — mask
const BIN_ID      = "49:967";     // 24px — mask red
const TRASH_ID    = "49:967";     // same, used for product remove
const CALENDAR_ID = "2150:1814";  // 20px — mask

type Scene = "details" | "capture";

interface SelectedProduct extends ScanResult { quantity: number }
interface LoggedSerial   { value: string }

// ── Shared icon helpers ────────────────────────────────────────────────────────

function MaskIcon({ url, color, size = 16, fallback }: {
  url?: string; color: string; size?: number; fallback: React.ReactNode;
}) {
  if (!url) return <>{fallback}</>;
  return (
    <span aria-hidden style={{
      display: "inline-block", width: size, height: size, flexShrink: 0,
      background: color,
      maskImage: `url(${url})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
      WebkitMaskImage: `url(${url})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
    } as React.CSSProperties} />
  );
}

function SearchIconSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke={tokens.color.fg.disabled} strokeWidth="1.3"/>
      <path d="M10.5 10.5L14 14" stroke={tokens.color.fg.disabled} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

const BinFallback = () => (
  <svg width="16" height="16" viewBox="0 0 16 18" fill="none" aria-hidden>
    <path d="M15 4L14.133 16.142C14.058 17.189 13.187 18 12.138 18H3.862C2.813 18 1.942 17.189 1.867 16.142L1 4M6 8V14M10 8V14M11 4V1C11 0.448 10.552 0 10 0H6C5.448 0 5 0.448 5 1V4M0 4H16"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const CalendarFallback = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden>
    <rect x="1" y="1" width="16" height="16" rx="1" stroke={tokens.color.fg.support} strokeWidth="1.3"/>
    <path d="M0 5h18" stroke={tokens.color.fg.support} strokeWidth="1.3"/>
    <path d="M5 0v4M13 0v4" stroke={tokens.color.fg.support} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const ScanNfcFallback = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
    <rect x="20" y="8" width="24" height="40" rx="4" stroke={tokens.color.fg.disabled} strokeWidth="2"/>
    <rect x="24" y="14" width="16" height="24" rx="2" stroke={tokens.color.fg.disabled} strokeWidth="1.5" fill="none"/>
    <path d="M44 22c3 3 3 9 0 12" stroke={tokens.color.bg.blue} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M47 19c5 5 5 13 0 18" stroke={tokens.color.bg.blue} strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.5"/>
    <circle cx="32" cy="52" r="2" fill={tokens.color.fg.disabled}/>
  </svg>
);

const NfcFallback = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── FieldLabel ─────────────────────────────────────────────────────────────────

function FieldLabel({ text }: { text: string }) {
  return (
    <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary }}>
      {text}
    </span>
  );
}

function TextInput({ value, onChange, placeholder = "" }: { value: string; onChange?: (v: string) => void; placeholder?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: `${tokens.spacing[2.5]} ${tokens.spacing[3]}`,
        border: `${focused ? 2 : 1}px solid ${focused ? "#6366f1" : tokens.color.divider.frame}`,
        borderRadius: tokens.borderRadius.md, fontFamily: tokens.fontFamily.sans,
        fontSize: tokens.fontSize.body, lineHeight: tokens.lineHeight.body,
        color: tokens.color.fg.primary, background: tokens.color.base.white,
        outline: "none", boxSizing: "border-box",
      } as React.CSSProperties}
    />
  );
}

function SectionDivider() {
  return <div style={{ height: "1px", background: tokens.color.divider.frame, margin: `${tokens.spacing[6]} 0` }} />;
}

// ── Selected product row (Phase 1) ────────────────────────────────────────────

function ProductRow({ product, trashIconUrl, onRemove, onQuantityChange }: {
  product: SelectedProduct; trashIconUrl?: string;
  onRemove: () => void; onQuantityChange: (q: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[3] }}>
        <ProductImg size={56} />
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>{product.brand}</span>
            <div style={{ width: "1px", height: "10px", background: tokens.color.divider.frame, flexShrink: 0 }} />
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>{product.sku}</span>
          </div>
        </div>
        <button type="button" onClick={onRemove} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", flexShrink: 0, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.md, background: tokens.color.base.white, cursor: "pointer" }}>
          <MaskIcon url={trashIconUrl} color={tokens.color.fg.red} size={16} fallback={<BinFallback />} />
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.support }}>Quantity of serials</span>
        <input type="number" min={1} value={product.quantity}
          onChange={e => { const n = parseInt(e.target.value, 10); if (!isNaN(n) && n > 0) onQuantityChange(n); }}
          style={{ width: "100%", padding: `${tokens.spacing[2.5]} ${tokens.spacing[3]}`, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.md, fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.primary, background: tokens.color.base.white, outline: "none", boxSizing: "border-box" } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

// ── Serial row (Phase 2) ───────────────────────────────────────────────────────

function SerialRow({ serial, onRemove, binUrl }: { serial: LoggedSerial; onRemove: () => void; binUrl?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2], padding: `${tokens.spacing[2.5]} ${tokens.spacing[3]}`, background: tokens.color.bg.lightBg, borderRadius: tokens.borderRadius.md }}>
      <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
        #{serial.value}
      </span>
      <button type="button" onClick={onRemove} aria-label="Remove serial" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", padding: tokens.spacing[1], cursor: "pointer", flexShrink: 0, borderRadius: tokens.borderRadius.md }}>
        <MaskIcon url={binUrl} color={tokens.color.fg.red} size={20} fallback={<BinFallback />} />
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

function CaptureSerialsMobilePageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const isLinkMode   = searchParams.get("mode") === "link";
  const icons    = useFigmaIcons([SCAN_NFC_ID, SCAN_ID, NFC_ADD_ID, BIN_ID, TRASH_ID, CALENDAR_ID]);
  const dateRef  = useRef<HTMLInputElement>(null);
  const serialRef = useRef<HTMLInputElement>(null);

  const [scene, setScene] = useState<Scene>(isLinkMode ? "capture" : "details");

  // Phase 1 state
  const [selectedFormat,   setSelectedFormat]   = useState<string | null>(null);
  const [purchaseOrder,    setPurchaseOrder]    = useState("Black");
  const [orderNumber,      setOrderNumber]      = useState("B213456");
  const [customerRef,      setCustomerRef]      = useState("");
  const [batchNumber,      setBatchNumber]      = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [batchScanOpen,    setBatchScanOpen]    = useState(false);
  const [productScanOpen,  setProductScanOpen]  = useState(false);
  const [productSheetTab,  setProductSheetTab]  = useState<"scan" | "search">("scan");

  // Phase 2 state
  const [serialInput,   setSerialInput]   = useState("");
  const [serials,       setSerials]       = useState<LoggedSerial[]>([]);

  // Save progress dialog (X close only)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Helpers
  const totalQuantity    = selectedProducts.reduce((s, p) => s + p.quantity, 0);
  const firstProductName = selectedProducts[0]?.name ?? "product";
  const captureEnabled   = serials.length > 0;

  function openProductScan()   { setProductSheetTab("scan");   setProductScanOpen(true); }
  function openProductSearch() { setProductSheetTab("search"); setProductScanOpen(true); }

  function handleProductSelected(p: ScanResult) {
    setSelectedProducts(prev => prev.find(x => x.id === p.id) ? prev : [...prev, { ...p, quantity: 1 }]);
  }

  function addSerial(value?: string) {
    const v = (value ?? serialInput).trim();
    if (!v) return;
    setSerials(prev => [...prev, { value: v }]);
    setSerialInput("");
    setTimeout(() => serialRef.current?.focus(), 0);
  }

  function handleComplete() {
    localStorage.setItem(isLinkMode ? "mobileCutRopeCreated" : "mobileSerialCreated", "1");
    router.push("/mobile/serialisation");
  }

  function handleSaveAndExit() {
    setSaveDialogOpen(false);
    router.push("/mobile/serialisation");
  }

  function handleDiscard() {
    setSaveDialogOpen(false);
    router.push("/mobile/serialisation");
  }

  // Shared styles
  const pageWrapper: React.CSSProperties = {
    height: "100dvh", display: "flex", flexDirection: "column",
    background: tokens.color.base.white, overflow: "hidden", position: "relative",
  };

  const footerStyle: React.CSSProperties = {
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
    borderTop: `1px solid ${tokens.color.divider.border}`,
    flexShrink: 0, background: tokens.color.base.white,
  };

  const CalendarTailingIcon = (
    <MaskIcon url={icons[CALENDAR_ID]} color={tokens.color.fg.support} size={20} fallback={<CalendarFallback />} />
  );

  // ── Phase 1: Serial details ──────────────────────────────────────────────────

  if (scene === "details") {
    return (
      <div style={pageWrapper}>
        <style>{`input[type="date"]::-webkit-calendar-picker-indicator { position:absolute;right:0;width:40px;height:100%;opacity:0;cursor:pointer; }`}</style>

        <MobileAppBar
          page="task"
          title={isLinkMode ? "Link serials" : "Capture serials"}
          onClose={() => setSaveDialogOpen(true)}
        />

        <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto", padding: `${tokens.spacing[4]} ${tokens.spacing[4]} ${tokens.spacing[6]}` }}>

          {/* Serial details heading */}
          <h2 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.semiBold, lineHeight: tokens.lineHeight.h4, color: tokens.color.fg.primary, margin: `0 0 ${tokens.spacing[4]}` }}>
            Serial details
          </h2>

          {/* Format */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4], marginBottom: tokens.spacing[5] }}>
            <FieldLabel text="Select a serial format (required)" />
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
              {SERIAL_FORMATS.map(fmt => (
                <SelectionCard key={fmt.id} type="radio" label={fmt.name} description={fmt.description}
                  checked={selectedFormat === fmt.id} onChange={() => setSelectedFormat(fmt.id)} />
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
            <TextInput value={customerRef} onChange={setCustomerRef} placeholder="Enter a customer reference number" />
          </div>

          {/* Batch number */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5], marginBottom: tokens.spacing[4] }}>
            <FieldLabel text="Batch number" />
            <ScanInput value={batchNumber} onChange={e => setBatchNumber(e.target.value)} onScan={() => setBatchScanOpen(true)} />
          </div>

          {/* Date of manufacture */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5], marginBottom: tokens.spacing[2], position: "relative" }}>
            <FieldLabel text="Date of manufacture" />
            <Input ref={dateRef} type="date" placeholder="--/--/--" tailingIcon={CalendarTailingIcon} />
          </div>

          <SectionDivider />

          {/* Assign to products */}
          <div style={{ marginBottom: tokens.spacing[3] }}>
            <h2 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.semiBold, lineHeight: tokens.lineHeight.h4, color: tokens.color.fg.primary, margin: `0 0 ${tokens.spacing[2]}` }}>
              Assign to products
            </h2>
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, margin: 0, lineHeight: "1.5" }}>
              Select one or more products to assign these serials to. Note: This tool is not available for Assembly product types.
            </p>
          </div>

          <div style={{ marginBottom: tokens.spacing[4] }}>
            <ScanInput placeholder="Search by SKU name or code" leadingIcon={<SearchIconSVG />}
              value="" readOnly onClick={openProductSearch} onScan={openProductScan} />
          </div>

          {selectedProducts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.support }}>
                Selected products
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[5] }}>
                {selectedProducts.map(p => (
                  <ProductRow key={p.id} product={p} trashIconUrl={icons[TRASH_ID]}
                    onRemove={() => setSelectedProducts(prev => prev.filter(x => x.id !== p.id))}
                    onQuantityChange={q => setSelectedProducts(prev => prev.map(x => x.id === p.id ? { ...x, quantity: q } : x))}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={footerStyle}>
          <button type="button" onClick={() => setScene("capture")} style={{ width: "100%", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: tokens.color.brand.lime, border: `1px solid ${tokens.color.divider.lime}`, borderRadius: tokens.borderRadius.md, fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, cursor: "pointer" }}>
            Continue to capture
          </button>
        </div>

        {/* Batch scan */}
        <ScanSimulationSheet open={batchScanOpen} onClose={() => setBatchScanOpen(false)}
          onDetected={v => { setBatchNumber(v); setBatchScanOpen(false); }} contained />

        {/* Product search/scan */}
        <SearchScanSheet open={productScanOpen} onClose={() => setProductScanOpen(false)}
          defaultTab={productSheetTab} productOnly onProductSelected={handleProductSelected} contained />

        {/* Save progress dialog (X close) */}
        <BottomSheet variant="bottom-sheet-mobile" open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} contained>
          <div style={{ padding: `${tokens.spacing[2]} ${tokens.spacing[4]} ${tokens.spacing[8]}` }}>
            <h3 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, margin: `0 0 ${tokens.spacing[2]}` }}>
              Save progress?
            </h3>
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support, margin: `0 0 ${tokens.spacing[5]}`, lineHeight: "1.5" }}>
              Would you like to save your progress or discard these changes?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
              <Button variant="primary" label="Save and exit" style={{ width: "100%" }} onClick={handleSaveAndExit} />
              <Button variant="secondary" label="Discard changes" style={{ width: "100%" }} onClick={handleDiscard} />
            </div>
          </div>
        </BottomSheet>
      </div>
    );
  }

  // ── Phase 2: Capture serials ─────────────────────────────────────────────────

  return (
    <div style={pageWrapper}>
      <MobileAppBar
        page="task"
        taskNavIcon="back"
        title={isLinkMode ? "Cut rope lengths" : "Capture Serials"}
        subText={!isLinkMode}
        subTextContent={isLinkMode ? undefined : `to ${firstProductName}`}
        onBack={() => isLinkMode ? router.back() : setScene("details")}
        onClose={isLinkMode ? undefined : () => setSaveDialogOpen(true)}
      />

      {/* Input area */}
      <div style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[4]} 0`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: tokens.spacing[2] }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Input
              ref={serialRef}
              label={isLinkMode ? "Link serials" : "Capture serials"}
              placeholder="Serial Number"
              value={serialInput}
              onChange={e => setSerialInput(e.target.value)}
              onClear={serialInput ? () => setSerialInput("") : undefined}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") addSerial(); }}
              inlineButton={
                <button type="button" onClick={() => addSerial()}
                  style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1], height: "100%", paddingTop: tokens.spacing[2.5], paddingBottom: tokens.spacing[2.5], paddingLeft: tokens.spacing[2], paddingRight: tokens.spacing[3], background: tokens.color.brand.lime, border: `1px solid ${tokens.color.divider.lime}`, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, whiteSpace: "nowrap", flexShrink: 0 } as React.CSSProperties}
                >
                  <MaskIcon url={icons[SCAN_ID]} color={tokens.color.fg.primary} size={16} fallback={<NfcFallback />} />
                  Scan
                </button>
              }
            />
          </div>

          {/* NFC button */}
          <button type="button"
            onClick={() => addSerial(serialInput || "NFC-" + Math.floor(Math.random() * 9000 + 1000))}
            style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1.5], height: "40px", paddingLeft: tokens.spacing[3], paddingRight: tokens.spacing[3], background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.md, fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", boxShadow: tokens.shadows.sm } as React.CSSProperties}
          >
            <MaskIcon url={icons[NFC_ADD_ID]} color={tokens.color.fg.primary} size={16} fallback={<NfcFallback />} />
            NFC
          </button>
        </div>

        {/* Add another */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: tokens.spacing[2], paddingBottom: tokens.spacing[3] }}>
          <button type="button" onClick={() => addSerial()}
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.blue, textDecoration: "underline" }}>
            Add another
          </button>
        </div>

        <div style={{ height: "1px", background: tokens.color.divider.border }} />
      </div>

      {/* Content */}
      <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>
        {serials.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: `${tokens.spacing[8]} ${tokens.spacing[6]}`, minHeight: "100%", boxSizing: "border-box" as const }}>
            <EmptyState
              size="large"
              icon={icons[SCAN_NFC_ID]
                ? <img src={icons[SCAN_NFC_ID]} width={64} height={64} alt="" aria-hidden style={{ display: "block" }} />
                : <ScanNfcFallback />}
              title="Capture multiple serials"
              description="Begin by scanning or typing the first Serial Number. Use the 'Add NFC' button to link a tag, then repeat the process for all items of this product model."
              action={<GloryItem type="chip" label="About continuous mode" onClick={() => {}} />}
            />
          </div>
        ) : (
          <div style={{ padding: `${tokens.spacing[4]} ${tokens.spacing[4]} ${tokens.spacing[2]}` }}>
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, margin: `0 0 ${tokens.spacing[2]}` }}>
              {isLinkMode ? `Serials to link (${serials.length}):` : `Serials to capture (${serials.length}):`}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5] }}>
              {serials.map((s, i) => (
                <SerialRow key={i} serial={s} onRemove={() => setSerials(prev => prev.filter((_, j) => j !== i))} binUrl={icons[BIN_ID]} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer — two stacked CTAs */}
      <div style={{ ...footerStyle, display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
        <Button
          variant={captureEnabled ? "primary" : "disabled"}
          label={isLinkMode ? "Complete linking" : "Complete capturing"}
          style={{ width: "100%" }}
          onClick={() => { if (captureEnabled) handleComplete(); }}
        />
        <Button
          variant="secondary"
          label="Save and finish later"
          style={{ width: "100%" }}
          onClick={() => router.push("/mobile/serialisation")}
        />
      </div>

      {/* Save progress dialog (X close only) */}
      <BottomSheet variant="bottom-sheet-mobile" open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} contained>
        <div style={{ padding: `${tokens.spacing[2]} ${tokens.spacing[4]} ${tokens.spacing[8]}` }}>
          <h3 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, margin: `0 0 ${tokens.spacing[2]}` }}>
            Save progress?
          </h3>
          <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support, margin: `0 0 ${tokens.spacing[5]}`, lineHeight: "1.5" }}>
            You have captured {serials.length} of {totalQuantity || "–"} serials. Would you like to save these to the task or discard them?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <Button variant="primary" label="Save and exit" style={{ width: "100%" }} onClick={handleSaveAndExit} />
            <Button variant="secondary" label="Discard changes" style={{ width: "100%" }} onClick={handleDiscard} />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export default function CaptureSerialsMobilePage() {
  return (
    <Suspense>
      <CaptureSerialsMobilePageInner />
    </Suspense>
  );
}
