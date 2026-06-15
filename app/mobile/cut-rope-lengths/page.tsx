// @refresh reset
"use client";
// app/mobile/cut-rope-lengths/page.tsx
// Figma: Serials file — nodes 32:4300, 34:4443, 34:2335 + states

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScanInput } from "@/components/ui/ScanInput";
import { CompositeInput } from "@/components/ui/CompositeInput";
import { SelectInput } from "@/components/ui/SelectInput";
import { Input } from "@/components/ui/Input";
import { ToggleInput } from "@/components/ui/Toggle";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ScanSimulationSheet } from "@/components/patterns/ScanSimulationSheet";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SourceRope {
  id:      string;
  name:    string;
  brand:   string;
  sku:     string;
  serial:  string;
  lengthM: number;
  image?:  string;
}

type Step = "select" | "details" | "cut-details" | "assign";

// ── Static data ────────────────────────────────────────────────────────────────

const SOURCE_ROPES: SourceRope[] = [
  { id: "r1", name: "ZENITH 9.5 mm Pink 100 m",  brand: "Beal",  sku: "BC095Z.60.P",   serial: "#132241154A", lengthM: 100, image: "/ZENITH 9.5 mm Pink 60 m.jpg" },
  { id: "r2", name: "ZENITH 9.5 mm Blue 200 m",  brand: "Beal",  sku: "BEA0034-490055", serial: "#132241154B", lengthM: 200, image: "/INDUSTRIE 11MMx150M 2 TERM BLUE.png" },
  { id: "r3", name: "LINK 10.5 mm Yellow 100 m", brand: "Petzl", sku: "PET0034-10551",  serial: "#132241156C", lengthM: 100 },
];

type ReelType = "item" | "product";

interface RecentReel {
  rope:        SourceRope;
  type:        ReelType;
  serial?:     string;
  remainingM?: number;
}

const RECENT_REELS: RecentReel[] = [
  { rope: SOURCE_ROPES[0], type: "item", serial: "#132241154A", remainingM: 70  },
  { rope: SOURCE_ROPES[1], type: "item", serial: "#132241154B", remainingM: 150 },
];

const ROPE_TRACEABILITY: Record<string, { batchNumber: string; domDate: string }> = {
  r1: { batchNumber: "BEA-2024-0134", domDate: "2024-03-15" },
  r2: { batchNumber: "BEA-2024-0135", domDate: "2024-03-15" },
  r3: { batchNumber: "PET-2024-0089", domDate: "2024-02-20" },
};

interface RopeSpec {
  manufacturer:    string;
  partNumber:      string;
  batchNumber:     string;
  diameter:        string;
  breakingStrength: string;
  sheathProportion: string;
  materials:       string;
}

const ROPE_SPECS: Record<string, RopeSpec> = {
  r1: { manufacturer: "Beal",  partNumber: "BEA0034-490055", batchNumber: "BEA0034-490055", diameter: "9.5 mm",  breakingStrength: "22 kN", sheathProportion: "38%", materials: "Polyamide / Polyamide" },
  r2: { manufacturer: "Beal",  partNumber: "BEA0034-490066", batchNumber: "BEA0034-490066", diameter: "9.5 mm",  breakingStrength: "20 kN", sheathProportion: "38%", materials: "Polyamide / Polyamide" },
  r3: { manufacturer: "Petzl", partNumber: "PET0034-10551",  batchNumber: "PET0034-10551",  diameter: "10.5 mm", breakingStrength: "25 kN", sheathProportion: "40%", materials: "Polyamide / Polyamide" },
};

const CUT_ROPE_PRODUCTS = [
  { id: "cr1", name: "link rope - 3m", brand: "Reseller-cut", sku: "RCO11/3", lengthPerSerial: 3 },
  { id: "cr2", name: "link rope - 5m", brand: "Reseller-cut", sku: "RCO11/5", lengthPerSerial: 5 },
];

const SERIAL_FORMAT_OPTIONS = [
  { id: "customer",  label: 'Format incl. "customer"',  description: "(DOM) YYMM | Customer (--) | Increments (0001)" },
  { id: "scannable", label: "Scannable Serial Format",   description: "(DOM) YYMM | Increments (0001)"                },
  { id: "nfc",       label: "NFC TAG PACKING ID",        description: "(Prefix) SCAN | Increments (0001)"             },
];

const UNIT_OPTIONS = [
  { value: "m",  label: "m"  },
  { value: "ft", label: "ft" },
];

const SPLICE_OPTIONS = [
  { value: "none",   label: "None"   },
  { value: "eye",    label: "Eye"    },
  { value: "double", label: "Double" },
];

// ── Inline SVG icons ───────────────────────────────────────────────────────────

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function ArrowRightIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.3" />
      <rect x="7.25" y="7" width="1.5" height="4.5" rx="0.75" fill={color} />
      <circle cx="8" cy="5" r="0.75" fill={color} />
    </svg>
  );
}

function LightbulbIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2a4 4 0 012.4 7.2V11H5.6V9.2A4 4 0 018 2z"
        stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M6 12.5h4M6.5 14h3"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke={color} strokeWidth="1.3" />
      <path d="M5 2v2M11 2v2M2 7h12" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
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

// ── Shared sub-components ──────────────────────────────────────────────────────

function ProductThumb({ size = 56, image }: { size?: number; image?: string }) {
  return (
    <div style={{
      width:          size,
      height:         size,
      flexShrink:     0,
      borderRadius:   tokens.borderRadius.md,
      border:         `1px solid ${tokens.color.divider.border}`,
      background:     tokens.color.bg.lightBg,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      overflow:       "hidden",
    }}>
      {image
        ? <img src={image} alt="" style={{ width: size - 8, height: size - 8, objectFit: "cover" }} />
        : <CameraIcon color={tokens.color.fg.disabled} />
      }
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
      <h2 style={{ margin: 0, ...tokens.typography.h4, color: tokens.color.fg.primary }}>{title}</h2>
      {subtitle && (
        <p style={{ margin: 0, ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{subtitle}</p>
      )}
    </div>
  );
}

function SourceRopeCard({ rope, remainingM, serial }: { rope: SourceRope; remainingM?: number; serial?: string }) {
  return (
    <div style={{
      display:      "flex",
      alignItems:   "flex-start",
      gap:          tokens.spacing[3],
      padding:      tokens.spacing[3],
      borderRadius: tokens.borderRadius.lg,
      border:       `1px solid ${tokens.color.divider.border}`,
    }}>
      <ProductThumb size={56} image={rope.image} />
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>{rope.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{rope.brand}</span>
          <div style={{ width: "1px", height: "10px", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{rope.sku}</span>
        </div>
        {serial && (
          <span style={{
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       "12px",
            fontWeight:     tokens.fontWeight.regular,
            lineHeight:     "18px",
            color:          tokens.color.fg.primary,
            textDecoration: "underline",
          }}>{serial}</span>
        )}
        {remainingM !== undefined && (
          <div style={{ marginTop: tokens.spacing[0.5] }}>
            <Badge label={`${remainingM}m remaining`} color="green" />
          </div>
        )}
      </div>
    </div>
  );
}

function RadioCard({
  selected,
  label,
  description,
  onClick,
}: {
  selected:    boolean;
  label:       string;
  description: string;
  onClick:     () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          tokens.spacing[3],
        width:        "100%",
        padding:      tokens.spacing[3],
        borderRadius: tokens.borderRadius.lg,
        border:       `${selected ? 2 : 1}px solid ${selected ? tokens.color.divider.blue : tokens.color.divider.frame}`,
        background:   tokens.color.base.white,
        cursor:       "pointer",
        textAlign:    "left",
        outline:      "none",
        boxSizing:    "border-box",
      }}
    >
      <div style={{
        width:       "16px",
        height:      "16px",
        borderRadius: "50%",
        border:      `${selected ? 5 : 1.5}px solid ${selected ? tokens.color.divider.blue : tokens.color.divider.frame}`,
        flexShrink:  0,
        marginTop:   "2px",
        boxSizing:   "border-box",
        transition:  "border 150ms ease",
      }} />
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[0.5] }}>
        <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>{label}</span>
        <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{description}</span>
      </div>
    </button>
  );
}

function InfoBanner({ message }: { message: string }) {
  return (
    <div style={{
      display:      "flex",
      alignItems:   "center",
      gap:          tokens.spacing[2],
      padding:      `${tokens.spacing[2.5]} ${tokens.spacing[3]}`,
      borderRadius: tokens.borderRadius.lg,
      background:   tokens.color.tint.blue,
      border:       `1px solid ${tokens.color.divider.blue}`,
    }}>
      <span style={{ flexShrink: 0 }}><InfoIcon color={tokens.color.fg.blue} /></span>
      <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.blue }}>{message}</span>
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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
        border:       `${focused ? 2 : 1}px solid ${focused ? tokens.color.divider.blue : tokens.color.divider.frame}`,
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
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.body,
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
        placeholder={placeholder ?? label}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

// ── Spec info row (read-only key-value) ───────────────────────────────────────

function SpecRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{
        display:    "flex",
        alignItems: "flex-start",
        paddingTop:    "14px",
        paddingBottom: "13px",
        gap:        tokens.spacing[3],
      }}>
        <span style={{
          ...tokens.typography.bodyM,
          color:    tokens.color.fg.support,
          width:    "128px",
          flexShrink: 0,
        }}>{label}</span>
        <span style={{
          ...tokens.typography.bodyR,
          color:   tokens.color.fg.primary,
          flex:    "1 0 0",
          minWidth: 0,
        }}>{value}</span>
      </div>
      {!last && <div style={{ height: "1px", background: tokens.color.divider.border, width: "100%" }} />}
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────

function Footer({
  label,
  disabled = false,
  onClick,
}: {
  label:     string;
  disabled?: boolean;
  onClick:   () => void;
}) {
  return (
    <div style={{
      padding:    tokens.spacing[4],
      borderTop:  `1px solid ${tokens.color.divider.border}`,
      background: tokens.color.base.white,
      flexShrink: 0,
    }}>
      <Button
        variant={disabled ? "disabled" : "primary"}
        label={label}
        disabled={disabled}
        onClick={onClick}
        style={{ width: "100%" }}
      />
    </div>
  );
}

// ── Source rope search result row ──────────────────────────────────────────────

function SourceRopeRow({ rope, onSelect }: { rope: SourceRope; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:                tokens.spacing[3],
        width:              "100%",
        background:         "transparent",
        border:             "none",
        borderBottom:       `1px solid ${tokens.color.divider.border}`,
        cursor:             "pointer",
        textAlign:          "left",
        outline:            "none",
        padding:            `${tokens.spacing[3]} 0`,
      }}
    >
      <ProductThumb size={56} image={rope.image} />
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{
          ...tokens.typography.bodyM,
          color:        tokens.color.fg.primary,
          overflow:     "hidden",
          textOverflow: "ellipsis",
          whiteSpace:   "nowrap",
        }}>
          {rope.name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{rope.brand}</span>
          <div style={{ width: "1px", height: "10px", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{rope.sku}</span>
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
        <ArrowRightIcon color={tokens.color.fg.primary} />
      </div>
    </button>
  );
}

// ── Recent reel card ───────────────────────────────────────────────────────────

function RecentReelCard({ reel, onSelect }: { reel: RecentReel; onSelect: () => void }) {
  const isItem = reel.type === "item";
  return (
    <button
      onClick={onSelect}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          tokens.spacing[2],
        padding:      tokens.spacing[2],
        border:       `1px solid ${tokens.color.divider.frame}`,
        borderRadius: tokens.borderRadius.lg,
        background:   tokens.color.base.white,
        cursor:       "pointer",
        width:        "100%",
        textAlign:    "left",
        outline:      "none",
        boxSizing:    "border-box",
      }}
    >
      {/* Left: product info + remaining badge */}
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
        {/* Product info row */}
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[4] }}>
          <ProductThumb size={56} image={reel.rope.image} />
          <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
            {/* Name + type badge */}
            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
              <span style={{
                ...tokens.typography.bodyM,
                color:        tokens.color.fg.primary,
                flex:         "1 1 0",
                minWidth:     0,
                overflow:     "hidden",
                textOverflow: "ellipsis",
                whiteSpace:   "nowrap",
              }}>
                {reel.rope.name}
              </span>
              <span style={{
                ...tokens.typography.smallBodySB,
                color:        isItem ? tokens.color.fg.green : tokens.color.fg.primary,
                background:   isItem ? tokens.color.tint.green : "#F3F4F6",
                padding:      `2px ${tokens.spacing[2]}`,
                borderRadius: tokens.borderRadius.full,
                whiteSpace:   "nowrap",
                flexShrink:   0,
              }}>
                {isItem ? "Item" : "Product"}
              </span>
            </div>
            {/* Brand | SKU */}
            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
              <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{reel.rope.brand}</span>
              <div style={{ width: "1px", height: "10px", background: tokens.color.divider.frame, flexShrink: 0 }} />
              <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{reel.rope.sku}</span>
            </div>
            {/* Serial (item only) */}
            {isItem && reel.serial && (
              <span style={{
                fontFamily:     tokens.fontFamily.sans,
                fontSize:       "12px",
                lineHeight:     "18px",
                color:          tokens.color.fg.primary,
                textDecoration: "underline",
              }}>
                {reel.serial}
              </span>
            )}
          </div>
        </div>
        {/* Remaining badge (item only) */}
        {isItem && reel.remainingM !== undefined && (
          <div style={{ alignSelf: "flex-start" }}>
            <Badge label={`${reel.remainingM}m remaining`} color="green" />
          </div>
        )}
      </div>

      {/* Arrow button */}
      <div
        aria-hidden
        style={{
          width:          "40px",
          height:         "40px",
          flexShrink:     0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          border:         `1px solid ${tokens.color.divider.frame}`,
          borderRadius:   tokens.borderRadius.md,
          background:     tokens.color.base.white,
        }}
      >
        <ArrowRightIcon color={tokens.color.fg.primary} />
      </div>
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CutRopeLengthsPage() {
  const router = useRouter();

  // ── Step ─────────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("select");

  // ── Step 1: Select source reel ───────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [scanSheetOpen,  setScanSheetOpen]  = useState(false);
  const [applySheetOpen, setApplySheetOpen] = useState(false);
  const [applyingRope,   setApplyingRope]   = useState<SourceRope | null>(null);
  const [trackLength,    setTrackLength]    = useState(false);
  const [initialLength,  setInitialLength]  = useState("");
  const [initialUnit,    setInitialUnit]    = useState("m");
  const [traceSerial,    setTraceSerial]    = useState("");
  const [appliedRope,    setAppliedRope]    = useState<SourceRope | null>(null);
  const [appliedInitial, setAppliedInitial] = useState<number | null>(null);
  const [appliedSerial,  setAppliedSerial]  = useState<string>("");

  // ── Step 2: Source reel details ──────────────────────────────────────────────
  const [batchNumber,  setBatchNumber]  = useState("");
  const [detailsDate,  setDetailsDate]  = useState("");

  // ── Step 3: Form ─────────────────────────────────────────────────────────────
  const [productMode,       setProductMode]       = useState<"existing" | "new" | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [newLength,         setNewLength]         = useState("");
  const [newLengthUnit,     setNewLengthUnit]      = useState("m");
  const [newSplice,         setNewSplice]         = useState("");
  const [newPartNumber,     setNewPartNumber]     = useState("");
  const [newSkuName,        setNewSkuName]        = useState("");
  const [quantity,          setQuantity]          = useState("");
  const [serialFormat,      setSerialFormat]      = useState("customer");
  const [purchaseOrder,     setPurchaseOrder]     = useState("");
  const [salesOrder,        setSalesOrder]        = useState("");
  const [customerRef,       setCustomerRef]       = useState("");
  const [formBatch,         setFormBatch]         = useState("");
  const [formDate,          setFormDate]          = useState("");
  const [successSheetOpen,  setSuccessSheetOpen]  = useState(false);

  // ── Remaining length calculation ─────────────────────────────────────────────
  const cutProduct =
    productMode === "existing" ? CUT_ROPE_PRODUCTS.find(p => p.id === selectedProductId) ?? null : null;
  const newLengthNum = productMode === "new" && newLength ? parseFloat(newLength) : null;
  const lengthPerSerial = cutProduct?.lengthPerSerial ?? newLengthNum ?? null;

  const remainingAfterCut: number | null = (() => {
    if (!appliedRope || !quantity || !lengthPerSerial) return null;
    const total = appliedInitial !== null ? appliedInitial : appliedRope.lengthM;
    const used  = parseFloat(quantity) * lengthPerSerial;
    if (isNaN(used)) return null;
    return total - used;
  })();

  // ── Filtered search results ──────────────────────────────────────────────────
  const q = searchQuery.trim().toLowerCase();
  const filteredRopes = q
    ? SOURCE_ROPES.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q)  ||
        r.serial.toLowerCase().includes(q)
      )
    : [];

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleClose() {
    router.push("/mobile/serialisation");
  }

  function handleBack() {
    if (step === "details")     setStep("select");
    else if (step === "cut-details") setStep("details");
    else if (step === "assign") setStep("cut-details");
  }

  function openApplySheet(rope: SourceRope) {
    setApplyingRope(rope);
    setTrackLength(false);
    setInitialLength(rope.lengthM.toString());
    setTraceSerial("");
    setApplySheetOpen(true);
  }

  function handleApply() {
    if (!applyingRope) return;
    setAppliedRope(applyingRope);
    setAppliedInitial(trackLength && initialLength ? parseFloat(initialLength) : null);
    setAppliedSerial(traceSerial);
    if (traceSerial) {
      const trace = ROPE_TRACEABILITY[applyingRope.id];
      if (trace) {
        setBatchNumber(trace.batchNumber);
        setDetailsDate(trace.domDate);
      }
    }
    setApplySheetOpen(false);
    setStep("details");
  }

  const STEP_NUMBER: Record<Step, number> = { "select": 1, "details": 2, "cut-details": 3, "assign": 4 };

  function handleSelectRecentReel(reel: RecentReel) {
    const rope = reel.rope;
    if (reel.type === "item") {
      setAppliedRope(rope);
      setAppliedSerial(reel.serial ?? "");
      setTrackLength(true);
      setAppliedInitial(reel.remainingM !== undefined ? reel.remainingM : rope.lengthM);
      // Pre-fill batch/date from traceability lookup
      const trace = ROPE_TRACEABILITY[rope.id];
      if (trace) {
        setBatchNumber(trace.batchNumber);
        setDetailsDate(trace.domDate);
      }
      setStep("details");
    } else {
      setAppliedRope(rope);
      setAppliedSerial("");
      setTrackLength(false);
      setAppliedInitial(null);
      setBatchNumber("");
      setDetailsDate("");
      setStep("details");
    }
  }

  function handleSubmit() {
    localStorage.setItem("mobileCutRopeCreated", "1");
    router.push("/mobile/serialisation");
  }

  const remainingM = appliedRope
    ? (appliedInitial !== null ? appliedInitial : appliedRope.lengthM)
    : null;

  // ── Render ────────────────────────────────────────────────────────────────────
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
        title="Cut rope lengths"
        taskNavIcon={step === "select" ? "close" : "back"}
        onClose={handleClose}
        onBack={handleBack}
      />

      {/* Step indicator */}
      <div style={{
        padding:        `${tokens.spacing[2]} ${tokens.spacing[4]} 0`,
        flexShrink:     0,
      }}>
        <span style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    "12px",
          fontWeight:  tokens.fontWeight.semiBold,
          lineHeight:  "16px",
          letterSpacing: "0.06em",
          color:       tokens.color.fg.support,
          textTransform: "uppercase",
        }}>
          Step {STEP_NUMBER[step]}/4
        </span>
      </div>

      {/* ── Step 1: Select source reel ─────────────────────────────────────── */}
      {step === "select" && (
        <>
          <div style={{
            flex:          "1 0 0",
            minHeight:     0,
            overflowY:     "auto",
            padding:       tokens.spacing[4],
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[4],
          }}>
            <SectionHeading
              title="Select source reel"
              subtitle="Search and select the source reel being cut."
            />

            <ScanInput
              placeholder="Search by serial, SKU name or code"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onScan={() => setScanSheetOpen(true)}
            />

            {/* Applied rope confirmation */}
            {appliedRope && !filteredRopes.length && (
              <div style={{
                display:      "flex",
                alignItems:   "center",
                gap:          tokens.spacing[2],
                padding:      `${tokens.spacing[2.5]} ${tokens.spacing[3]}`,
                borderRadius: tokens.borderRadius.lg,
                background:   tokens.color.tint.green,
                border:       `1px solid ${tokens.color.bg.green}`,
              }}>
                <CheckCircleIcon color={tokens.color.bg.green} />
                <span style={{ ...tokens.typography.smallBodyM, color: tokens.color.fg.green }}>
                  {appliedRope.name}
                </span>
              </div>
            )}

            {/* Search results */}
            {filteredRopes.length > 0 && (
              <div>
                <span style={{
                  ...tokens.typography.bodyR,
                  color:        tokens.color.fg.support,
                  display:      "block",
                  marginBottom: tokens.spacing[1],
                }}>
                  Products:
                </span>
                {filteredRopes.map(rope => (
                  <SourceRopeRow
                    key={rope.id}
                    rope={rope}
                    onSelect={() => openApplySheet(rope)}
                  />
                ))}
              </div>
            )}

            {/* Recent reels (shown when search is empty) */}
            {!searchQuery && RECENT_REELS.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
                <span style={{
                  ...tokens.typography.bodyR,
                  color: tokens.color.fg.support,
                }}>
                  Recent reels:
                </span>
                {RECENT_REELS.map((reel, i) => (
                  <RecentReelCard
                    key={i}
                    reel={reel}
                    onSelect={() => handleSelectRecentReel(reel)}
                  />
                ))}
              </div>
            )}
          </div>

        </>
      )}

      {/* ── Step 2: Source reel details ───────────────────────────────────── */}
      {step === "details" && appliedRope && (
        <>
          <div style={{
            flex:          "1 0 0",
            minHeight:     0,
            overflowY:     "auto",
            padding:       tokens.spacing[4],
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[4],
          }}>
            <SectionHeading
              title="Source reel details"
              subtitle="Enter traceability details for the source reel. These will be linked to all cut rope items created from it."
            />

            <SourceRopeCard
              rope={appliedRope}
              remainingM={(trackLength && !appliedSerial && remainingM !== null) ? remainingM : undefined}
              serial={appliedSerial || undefined}
            />

            {/* Serial lookup mode: read-only spec view */}
            {trackLength && appliedSerial ? (() => {
              const spec = ROPE_SPECS[appliedRope.id];
              const lengthLabel = remainingM !== null ? `${remainingM.toFixed(1)} m` : `${appliedRope.lengthM.toFixed(1)} m`;
              return (
                <>
                  <div style={{
                    display:      "flex",
                    alignItems:   "center",
                    padding:      tokens.spacing[4],
                    borderRadius: tokens.borderRadius.lg,
                    background:   tokens.color.tint.blue,
                  }}>
                    <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.blue }}>
                      {"Length on reel: "}
                      <strong style={{ fontWeight: tokens.fontWeight.semiBold }}>{lengthLabel}</strong>
                    </span>
                  </div>

                  {spec && (
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      <SpecRow label="Manufacturer"     value={spec.manufacturer}    />
                      <SpecRow label="Part number"      value={spec.partNumber}      />
                      <SpecRow label="Batch number"     value={spec.batchNumber}     />
                      <SpecRow label="Diameter"         value={spec.diameter}        />
                      <SpecRow label="Breaking strength" value={spec.breakingStrength} />
                      <SpecRow label="Sheath proportion" value={spec.sheathProportion} />
                      <SpecRow label="Materials"        value={spec.materials}       last />
                    </div>
                  )}
                </>
              );
            })() : (
              <>
                <ScanInput
                  label="Source batch number"
                  placeholder="Search or scan batch number"
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                />

                <DateInput
                  label="Date of manufacture"
                  value={detailsDate}
                  onChange={setDetailsDate}
                />
              </>
            )}
          </div>

          <Footer label="Next step" onClick={() => setStep("cut-details")} />
        </>
      )}

      {/* ── Step 3: Cut rope details ──────────────────────────────────────── */}
      {step === "cut-details" && (
        <>
          <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>
            <div style={{
              padding:       tokens.spacing[4],
              display:       "flex",
              flexDirection: "column",
              gap:           tokens.spacing[4],
            }}>
              <SectionHeading title="Cut rope details" />

              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
                <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>
                  Select a serial format (required)
                </span>
                {SERIAL_FORMAT_OPTIONS.map(opt => (
                  <RadioCard
                    key={opt.id}
                    selected={serialFormat === opt.id}
                    label={opt.label}
                    description={opt.description}
                    onClick={() => setSerialFormat(opt.id)}
                  />
                ))}
              </div>

              <TextField label="Purchase order"        value={purchaseOrder} onChange={setPurchaseOrder} />
              <TextField label="Sales order number"    value={salesOrder}    onChange={setSalesOrder}    />
              <TextField label="Customer reference"    value={customerRef}   onChange={setCustomerRef}   />
              <TextField label="Cut rope batch number" value={formBatch}     onChange={setFormBatch}     />
              <DateInput label="Date of manufacture"   value={formDate}      onChange={setFormDate}      />
            </div>
          </div>

          <Footer label="Next step" onClick={() => setStep("assign")} />
        </>
      )}

      {/* ── Step 4: Assign cut ropes to product ──────────────────────────── */}
      {step === "assign" && (
        <>
          <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>
            <div style={{
              padding:       tokens.spacing[4],
              display:       "flex",
              flexDirection: "column",
              gap:           tokens.spacing[4],
            }}>
              <SectionHeading
                title="Assign cut ropes to product"
                subtitle="Set the product details for the rope you are creating from this cut."
              />

              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
                <RadioCard
                  selected={productMode === "existing"}
                  label="Select from existing product"
                  description="Search your catalog for the finished product SKU"
                  onClick={() => setProductMode("existing")}
                />

                {productMode === "existing" && (
                  <div style={{
                    background:    tokens.color.bg.lightBg,
                    borderRadius:  tokens.borderRadius.lg,
                    paddingTop:    tokens.spacing[2],
                    paddingBottom: tokens.spacing[2],
                    display:       "flex",
                    flexDirection: "column",
                  }}>
                    {CUT_ROPE_PRODUCTS.map((product, idx) => {
                      const isSelected = selectedProductId === product.id;
                      return (
                        <button
                          key={product.id}
                          onClick={() => setSelectedProductId(product.id)}
                          style={{
                            display:      "flex",
                            alignItems:   "center",
                            gap:          tokens.spacing[3],
                            width:        "100%",
                            padding:      `${tokens.spacing[2.5]} ${tokens.spacing[3]}`,
                            background:   "transparent",
                            border:       "none",
                            borderBottom: idx < CUT_ROPE_PRODUCTS.length - 1
                              ? `1px solid ${tokens.color.divider.border}` : "none",
                            cursor:    "pointer",
                            textAlign: "left",
                          }}
                        >
                          <div style={{
                            width:        "16px",
                            height:       "16px",
                            borderRadius: "50%",
                            border:       `${isSelected ? 5 : 1.5}px solid ${isSelected ? tokens.color.divider.blue : tokens.color.divider.frame}`,
                            flexShrink:   0,
                            boxSizing:    "border-box",
                            transition:   "border 150ms ease",
                          }} />
                          <div style={{ flex: "1 1 0", minWidth: 0 }}>
                            <div style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>{product.name}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1], marginTop: "2px" }}>
                              <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{product.brand}</span>
                              <div style={{ width: "1px", height: "10px", background: tokens.color.divider.frame }} />
                              <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{product.sku}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <RadioCard
                  selected={productMode === "new"}
                  label="Create a new product"
                  description="This product will be available in your catalogue after creation."
                  onClick={() => setProductMode("new")}
                />

                {productMode === "new" && (
                  <div style={{
                    background:    tokens.color.bg.lightBg,
                    borderRadius:  tokens.borderRadius.lg,
                    padding:       tokens.spacing[3],
                    display:       "flex",
                    flexDirection: "column",
                    gap:           tokens.spacing[3],
                  }}>
                    <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>New product info</span>
                    <CompositeInput
                      label="Length"
                      value={newLength}
                      onChange={setNewLength}
                      unitOptions={UNIT_OPTIONS}
                      unitValue={newLengthUnit}
                      onUnitChange={setNewLengthUnit}
                    />
                    <SelectInput
                      label="Splice"
                      options={SPLICE_OPTIONS}
                      value={newSplice}
                      onChange={setNewSplice}
                      placeholder="Select..."
                    />
                    <TextField label="Part number" value={newPartNumber} onChange={setNewPartNumber} />
                    <TextField label="SKU name"    value={newSkuName}    onChange={setNewSkuName}    />
                  </div>
                )}
              </div>

              {/* Number of cut ropes */}
              <div style={{ borderTop: `1px solid ${tokens.color.divider.border}`, paddingTop: tokens.spacing[6] }}>
                <SectionHeading title="Number of cut ropes" />
              </div>

              <TextField
                label="Number of pieces (required)"
                placeholder="Enter number of pieces"
                value={quantity}
                onChange={setQuantity}
              />

              {remainingAfterCut !== null && (
                <InfoBanner message={`Source reel left after cut: ${remainingAfterCut}m`} />
              )}
            </div>
          </div>

          <div style={{
            padding:       tokens.spacing[4],
            borderTop:     `1px solid ${tokens.color.divider.border}`,
            background:    tokens.color.base.white,
            flexShrink:    0,
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[3],
          }}>
            <Button variant="primary"   label="Generate serials"         onClick={() => setSuccessSheetOpen(true)} style={{ width: "100%" }} />
            <Button variant="secondary" label="Link to existing serials"  onClick={() => router.push("/mobile/capture-serials?mode=link")} style={{ width: "100%" }} />
          </div>
        </>
      )}

      {/* ── Scan sheet — fills ScanInput with detected value ─────────────── */}
      <ScanSimulationSheet
        open={scanSheetOpen}
        onClose={() => setScanSheetOpen(false)}
        contained
        mockValue="0034-49"
        onDetected={value => {
          setSearchQuery(value);
          setScanSheetOpen(false);
        }}
      />

      {/* ── Apply new source reel sheet ───────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={applySheetOpen}
        onClose={() => setApplySheetOpen(false)}
        contained
      >
        {applyingRope && (
          <div style={{
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[4],
            paddingTop:    tokens.spacing[2],
            paddingLeft:   tokens.spacing[4],
            paddingRight:  tokens.spacing[4],
            paddingBottom: tokens.spacing[6],
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
              <h3 style={{ margin: 0, ...tokens.typography.h3, color: tokens.color.fg.primary }}>
                Select source reel
              </h3>
              <p style={{ margin: 0, ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>
                The details below will be used to track the source reel usage.
              </p>
            </div>

            <SourceRopeCard rope={applyingRope} />

            <ToggleInput
              label="Track Length"
              description="Track how much rope remains on this spool."
              checked={trackLength}
              onChange={setTrackLength}
            />

            {trackLength && (
              <>
                <CompositeInput
                  label="Initial length (required)"
                  value={initialLength}
                  onChange={setInitialLength}
                  unitOptions={UNIT_OPTIONS}
                  unitValue={initialUnit}
                  onUnitChange={setInitialUnit}
                />
                <div style={{ display: "flex", alignItems: "flex-start", gap: tokens.spacing[2] }}>
                  <span style={{ flexShrink: 0, marginTop: "1px" }}>
                    <LightbulbIcon color={tokens.color.fg.support} />
                  </span>
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>
                    Based on product specs, a full spool is {applyingRope.lengthM}m
                  </span>
                </div>
                <ScanInput
                  label="Trace serial of source reel"
                  placeholder="Scan or enter serial number"
                  value={traceSerial}
                  onChange={e => setTraceSerial(e.target.value)}
                />
              </>
            )}

            <Button
              variant="primary"
              label="Select reel"
              onClick={handleApply}
              style={{ width: "100%" }}
            />
          </div>
        )}
      </BottomSheet>

      {/* ── Serials generated success sheet ──────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={successSheetOpen}
        onClose={() => setSuccessSheetOpen(false)}
        contained
      >
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[4],
          paddingTop:    tokens.spacing[2],
          paddingLeft:   tokens.spacing[4],
          paddingRight:  tokens.spacing[4],
          paddingBottom: tokens.spacing[6],
        }}>
          {/* Success icon */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: tokens.spacing[2] }}>
            <div style={{
              width:          56,
              height:         56,
              borderRadius:   tokens.borderRadius.full,
              background:     tokens.color.tint.green,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M6 14l6 6 10-12" stroke={tokens.color.fg.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 style={{ margin: 0, ...tokens.typography.h3, color: tokens.color.fg.primary, textAlign: "center" }}>
            Serials generated!
          </h2>

          {/* Label preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>Label preview</span>
            <div style={{
              display:        "flex",
              justifyContent: "center",
              padding:        tokens.spacing[4],
              background:     tokens.color.bg.lightBg,
              borderRadius:   tokens.borderRadius.lg,
            }}>
              <img
                src="/label.png"
                alt="Label preview"
                style={{ height: 200, width: "auto", display: "block" }}
              />
            </div>
          </div>

          {/* Printer row */}
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2] }}>
            <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support, flex: "0 0 auto" }}>Printer:</span>
            <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>Sato CT4-LX</span>
          </div>

          {/* CTAs */}
          <Button variant="primary"   label="Print NFC rope label" onClick={handleSubmit} style={{ width: "100%" }} />
          <button
            onClick={handleSubmit}
            style={{
              background:  "transparent",
              border:      "none",
              cursor:      "pointer",
              ...tokens.typography.bodyR,
              color:       tokens.color.fg.blue,
              textDecoration: "underline",
              textAlign:   "center",
              width:       "100%",
            }}
          >
            Not now
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
