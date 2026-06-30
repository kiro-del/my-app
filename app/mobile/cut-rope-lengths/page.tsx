// @refresh reset
"use client";
// app/mobile/cut-rope-lengths/page.tsx
// Figma: Serials file — nodes 32:4300, 34:4443, 34:2335 + states

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { MobileButton as Button } from "@/components/ui/mobile/Button";
import { Badge } from "@/components/ui/Badge";
import { ScanInput } from "@/components/ui/mobile/InputScan";
import { CompositeInput } from "@/components/ui/InputComposite";
import { SelectInput } from "@/components/ui/mobile/InputSelect";
import { Input } from "@/components/ui/mobile/Input";
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

type Step = "select" | "details" | "assign";

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
  { id: "cr1", name: "link rope - blue-5", brand: "ResellerA", sku: "RP192BL-100", lengthPerSerial: 5 },
  { id: "cr2", name: "link rope - blue-3", brand: "ResellerA", sku: "RP192BL-100", lengthPerSerial: 3 },
];

const QUANTITY_PRESETS = [5, 20, 40, 60, 100];

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

function StepIndicator({ step }: { step: number }) {
  return (
    <span style={{
      fontFamily:    tokens.fontFamily.sans,
      fontSize:      "12px",
      fontWeight:    tokens.fontWeight.semiBold,
      lineHeight:    "16px",
      letterSpacing: "0.06em",
      color:         tokens.color.fg.support,
      textTransform: "uppercase",
    }}>
      Step {step}/3
    </span>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
      <h2 style={{ margin: 0, ...tokens.typography.h4, color: tokens.color.fg.primary }}>{title}</h2>
      {subtitle && (
        <p style={{ margin: 0, ...tokens.typography.bodyR, color: tokens.color.fg.support }}>{subtitle}</p>
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
        paddingTop:    "12px",
        paddingBottom: "12px",
        paddingLeft:   tokens.spacing[2.5],
        paddingRight:  tokens.spacing[2.5],
        gap:           tokens.spacing[2],
        background:    tokens.color.base.white,
        borderRadius:  tokens.borderRadius.lg,
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
        variant="primary"
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
        padding:      tokens.spacing[4],
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
            {/* Name */}
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

  // ── Step 3: Assign ───────────────────────────────────────────────────────────
  const [productMode,       setProductMode]       = useState<"existing" | "new" | null>(null);
  const [cutProductId, setSelectedProductId] = useState<string | null>(null);
  const [productSheetOpen,  setProductSheetOpen]  = useState(false);
  const [pendingProductId,  setPendingProductId]  = useState<string | null>(null);
  const [newLength,         setNewLength]         = useState("");
  const [newLengthUnit,     setNewLengthUnit]      = useState("m");
  const [newSplice,         setNewSplice]         = useState("");
  const [newPartNumber,     setNewPartNumber]     = useState("");
  const [newSkuName,        setNewSkuName]        = useState("");
  const [quantity,          setQuantity]          = useState(0);
  const [stepperFocused,    setStepperFocused]    = useState(false);

  // Insufficient length resolution
  const [addSpoolSheetOpen,   setAddSpoolSheetOpen]   = useState(false);
  const [stopTrackSheetOpen,  setStopTrackSheetOpen]  = useState(false);
  const [trackingDisabled,    setTrackingDisabled]    = useState(false);
  const [newSpoolLength,      setNewSpoolLength]      = useState("200");
  const [newSpoolUnit,        setNewSpoolUnit]        = useState("m");
  const [newSpoolSerial,      setNewSpoolSerial]      = useState("");
  const [newSpoolUseMode,     setNewSpoolUseMode]     = useState<"use-remaining" | "start-new">("use-remaining");
  const [spoolScanOpen,       setSpoolScanOpen]       = useState(false);

  const bannerRef          = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevQtyRef         = useRef(0);
  useEffect(() => {
    const wasZero = prevQtyRef.current === 0;
    prevQtyRef.current = quantity;
    if (wasZero && quantity > 0 && appliedRope) {
      const el = scrollContainerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "instant" });
    }
  }, [quantity, appliedRope]);

  // ── Remaining length calculation ─────────────────────────────────────────────
  const cutProduct =
    productMode === "existing" ? CUT_ROPE_PRODUCTS.find(p => p.id === cutProductId) ?? null : null;
  const newLengthNum = productMode === "new" && newLength ? parseFloat(newLength) : null;
  const lengthPerSerial = cutProduct?.lengthPerSerial ?? newLengthNum ?? null;

  const remainingAfterCut: number | null = (() => {
    if (!appliedRope || !quantity || !lengthPerSerial) return null;
    const total = appliedInitial !== null ? appliedInitial : appliedRope.lengthM;
    const used  = quantity * lengthPerSerial;
    if (isNaN(used)) return null;
    return total - used;
  })();

  const isInsufficient   = !trackingDisabled && remainingAfterCut !== null && remainingAfterCut < 0;
  const insufficientM    = isInsufficient && remainingAfterCut !== null ? Math.abs(Math.round(remainingAfterCut)) : 0;
  const showInfoBanner   = !trackingDisabled && quantity > 0 && appliedRope && !isInsufficient && remainingAfterCut !== null;

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
    if (step === "details") setStep("select");
    else if (step === "assign") setStep("details");
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

  const STEP_NUMBER: Record<Step, number> = { "select": 1, "details": 2, "assign": 3 };

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

  function handleAddSpool() {
    const len = parseFloat(newSpoolLength);
    if (!isNaN(len) && len > 0) {
      setAppliedInitial(prev => (prev ?? 0) + len);
    }
    setAddSpoolSheetOpen(false);
    setNewSpoolLength("200");
    setNewSpoolSerial("");
    setNewSpoolUseMode("use-remaining");
  }

  function handleStopTracking() {
    setAppliedInitial(null);
    setTrackingDisabled(true);
    setStopTrackSheetOpen(false);
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
            <StepIndicator step={STEP_NUMBER[step]} />
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
            <StepIndicator step={STEP_NUMBER[step]} />
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

          <Footer label="Continue to cut rope" onClick={() => setStep("assign")} />
        </>
      )}

      {/* ── Step 3: Finished ropes ───────────────────────────────── */}
      {step === "assign" && (
        <>
          <div ref={scrollContainerRef} style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>
            <div style={{
              padding:       tokens.spacing[4],
              display:       "flex",
              flexDirection: "column",
              gap:           tokens.spacing[6],
            }}>
              <StepIndicator step={STEP_NUMBER[step]} />
              <SectionHeading title="Finished ropes" />

              {/* Select product subsection */}
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[3] }}>
                <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                  <span style={{ ...tokens.typography.h5, color: tokens.color.fg.primary }}>Select product</span>
                  <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>
                    Select an existing product or create a new one for the cut ropes.
                  </span>
                </div>

                {/* Cards group */}
                <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>

                  {/* Select existing product card */}
                  <button
                    onClick={() => {
                      setProductMode("existing");
                      setProductSheetOpen(true);
                    }}
                    style={{
                      display:      "flex",
                      alignItems:   productMode === "existing" && cutProduct ? "flex-start" : "center",
                      gap:          tokens.spacing[2],
                      width:        "100%",
                      padding:      tokens.spacing[4],
                      background:   tokens.color.base.white,
                      borderRadius: tokens.borderRadius.md,
                      border:       productMode === "existing"
                        ? `2px solid ${tokens.color.palette.indigo[500]}`
                        : `1px solid ${tokens.color.divider.frame}`,
                      cursor:    "pointer",
                      textAlign: "left",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{
                      width:          16,
                      height:         16,
                      borderRadius:   "50%",
                      flexShrink:     0,
                      marginTop:      productMode === "existing" && cutProduct ? "2px" : 0,
                      boxSizing:      "border-box",
                      background:     productMode === "existing" ? tokens.color.palette.indigo[500] : tokens.color.base.white,
                      border:         productMode === "existing"
                        ? `1.5px solid ${tokens.color.palette.indigo[500]}`
                        : `1px solid ${tokens.color.divider.frame}`,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                    }}>
                      {productMode === "existing" && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: tokens.color.base.white }} />
                      )}
                    </div>
                    <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[0.5] }}>
                      <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary }}>Select existing product</span>
                      {productMode === "existing" && cutProduct && (
                        <>
                          <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>{cutProduct.name}</span>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setProductSheetOpen(true);
                            }}
                            style={{
                              background:     "transparent",
                              border:         "none",
                              padding:        0,
                              cursor:         "pointer",
                              fontFamily:     tokens.fontFamily.sans,
                              fontSize:       "14px",
                              fontWeight:     tokens.fontWeight.medium,
                              lineHeight:     "20px",
                              color:          tokens.color.divider.blue,
                              textAlign:      "left",
                              textDecoration: "underline",
                              alignSelf:      "flex-start",
                            }}
                          >
                            Change
                          </button>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Create a new product card */}
                  <button
                    onClick={() => { setProductMode("new"); setSelectedProductId(null); }}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          tokens.spacing[2],
                      width:        "100%",
                      padding:      tokens.spacing[4],
                      background:   tokens.color.base.white,
                      borderRadius: tokens.borderRadius.md,
                      border:       productMode === "new"
                        ? `2px solid ${tokens.color.palette.indigo[500]}`
                        : `1px solid ${tokens.color.divider.frame}`,
                      cursor:    "pointer",
                      textAlign: "left",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{
                      width:          16,
                      height:         16,
                      borderRadius:   "50%",
                      flexShrink:     0,
                      boxSizing:      "border-box",
                      background:     productMode === "new" ? tokens.color.palette.indigo[500] : tokens.color.base.white,
                      border:         productMode === "new"
                        ? `1.5px solid ${tokens.color.palette.indigo[500]}`
                        : `1px solid ${tokens.color.divider.frame}`,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                    }}>
                      {productMode === "new" && (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: tokens.color.base.white }} />
                      )}
                    </div>
                    <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary }}>Create a new product</span>
                  </button>

                  {/* Create new product sub-form */}
                  {productMode === "new" && (
                    <div style={{
                      background:    tokens.color.bg.lightBg,
                      borderRadius:  tokens.borderRadius.lg,
                      padding:       tokens.spacing[3],
                      display:       "flex",
                      flexDirection: "column",
                      gap:           tokens.spacing[3],
                    }}>
                      <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>
                        This product will be available in your catalogue after creation.
                      </span>
                      <TextField label="Length" value={newLength} onChange={setNewLength} />
                      <SelectInput

                        label="Unit"
                        options={UNIT_OPTIONS}
                        value={newLengthUnit}
                        onChange={setNewLengthUnit}
                        placeholder="Select..."
                      />
                      <TextField label="Part number" value={newPartNumber} onChange={setNewPartNumber} />
                      <TextField label="SKU name"    value={newSkuName}    onChange={setNewSkuName}    />
                      <SelectInput

                        label="Splice"
                        options={SPLICE_OPTIONS}
                        value={newSplice}
                        onChange={setNewSplice}
                        placeholder="Select..."
                      />
                    </div>
                  )}

                </div>{/* end cards group */}
              </div>{/* end select product subsection */}

              {/* Number of cut ropes */}
              <div style={{
                borderTop:     `1px solid ${tokens.color.divider.border}`,
                paddingTop:    tokens.spacing[6],
                display:       "flex",
                flexDirection: "column",
                gap:           tokens.spacing[4],
              }}>
                <span style={{ ...tokens.typography.h5, color: tokens.color.fg.primary }}>
                  Number of cut ropes
                </span>

                {/* Stepper — single container matching Figma */}
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
                    onClick={() => setQuantity(q => Math.max(0, q - 1))}
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
                    value={quantity === 0 ? "" : quantity}
                    placeholder="0"
                    onFocus={() => setStepperFocused(true)}
                    onBlur={() => setStepperFocused(false)}
                    onChange={e => {
                      const v = parseInt(e.target.value, 10);
                      setQuantity(isNaN(v) || v < 0 ? 0 : v);
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
                    onClick={() => setQuantity(q => q + 1)}
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
                      onClick={() => setQuantity(preset)}
                      style={{
                        flex:         "1 1 0",
                        height:       32,
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                        border:       quantity === preset
                          ? `1.5px solid ${tokens.color.palette.indigo[500]}`
                          : `1px solid ${tokens.color.divider.frame}`,
                        borderRadius: tokens.borderRadius.full,
                        background:   quantity === preset ? "#eef2ff" : tokens.color.base.white,
                        cursor:       "pointer",
                        fontFamily:   tokens.fontFamily.sans,
                        fontSize:     "14px",
                        fontWeight:   tokens.fontWeight.medium,
                        lineHeight:   "20px",
                        color:        quantity === preset ? tokens.color.palette.indigo[500] : tokens.color.fg.primary,
                        boxSizing:    "border-box",
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Info banner — blue if sufficient, red if insufficient */}
                {(isInsufficient || showInfoBanner) && (
                  isInsufficient ? (
                    <div ref={bannerRef} style={{
                      display:      "flex",
                      alignItems:   "flex-start",
                      gap:          tokens.spacing[3],
                      padding:      tokens.spacing[4],
                      borderRadius: tokens.borderRadius.md,
                      background:   tokens.color.tint.red,
                    }}>
                      <span style={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <circle cx="12" cy="12" r="9" stroke={tokens.color.fg.red} strokeWidth="1.5" />
                          <rect x="11.25" y="7" width="1.5" height="6" rx="0.75" fill={tokens.color.fg.red} />
                          <circle cx="12" cy="16" r="0.85" fill={tokens.color.fg.red} />
                        </svg>
                      </span>
                      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
                          <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.red }}>
                            Insufficient Length
                          </span>
                          <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.red }}>
                            You need {insufficientM}m more to complete these cuts.
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                          <button
                            type="button"
                            onClick={() => setAddSpoolSheetOpen(true)}
                            style={{
                              background:     "transparent",
                              border:         "none",
                              padding:        0,
                              cursor:         "pointer",
                              fontFamily:     tokens.fontFamily.sans,
                              fontSize:       "14px",
                              fontWeight:     tokens.fontWeight.medium,
                              lineHeight:     "20px",
                              color:          tokens.color.fg.red,
                              textDecoration: "underline",
                            }}
                          >
                            Add new spool
                          </button>
                          <button
                            type="button"
                            onClick={() => setStopTrackSheetOpen(true)}
                            style={{
                              background:     "transparent",
                              border:         "none",
                              padding:        0,
                              cursor:         "pointer",
                              fontFamily:     tokens.fontFamily.sans,
                              fontSize:       "14px",
                              fontWeight:     tokens.fontWeight.medium,
                              lineHeight:     "20px",
                              color:          tokens.color.fg.red,
                              textDecoration: "underline",
                            }}
                          >
                            Stop tracking length
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div ref={bannerRef} style={{
                      display:      "flex",
                      alignItems:   "flex-start",
                      gap:          tokens.spacing[3],
                      padding:      tokens.spacing[4],
                      borderRadius: tokens.borderRadius.md,
                      background:   tokens.color.tint.blue,
                    }}>
                      <span style={{ flexShrink: 0, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <InfoIcon color={tokens.color.fg.blue} />
                      </span>
                      <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.blue }}>
                        Source rope left after cut: {remainingAfterCut}m
                      </span>
                    </div>
                  )
                )}
              </div>
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
            <Button variant="primary"   label="Generate serials"        onClick={handleSubmit} style={{ width: "100%" }} />
            <Button variant="secondary" label="Link to existing serials" onClick={() => router.push("/mobile/link-rope-serials")} style={{ width: "100%" }} />
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

      {/* ── Product selection sheet ──────────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={productSheetOpen}
        onClose={() => setProductSheetOpen(false)}
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
          <h3 style={{ margin: 0, ...tokens.typography.h4, color: tokens.color.fg.primary }}>
            Select a product
          </h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {CUT_ROPE_PRODUCTS.map(product => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProductId(product.id);
                  setProductSheetOpen(false);
                }}
                style={{
                  display:      "flex",
                  alignItems:   "flex-start",
                  gap:          tokens.spacing[3],
                  width:        "100%",
                  background:   "transparent",
                  border:       "none",
                  borderBottom: `1px solid ${tokens.color.divider.border}`,
                  cursor:       "pointer",
                  textAlign:    "left",
                  padding:      `${tokens.spacing[3]} 0`,
                }}
              >
                <div style={{
                  width:          16,
                  height:         16,
                  borderRadius:   "50%",
                  flexShrink:     0,
                  marginTop:      "3px",
                  boxSizing:      "border-box",
                  background:     cutProductId === product.id ? tokens.color.palette.indigo[500] : tokens.color.base.white,
                  border:         cutProductId === product.id
                    ? `1.5px solid ${tokens.color.palette.indigo[500]}`
                    : `1.5px solid ${tokens.color.divider.frame}`,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}>
                  {cutProductId === product.id && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: tokens.color.base.white }} />
                  )}
                </div>
                <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[0.5] }}>
                  <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>{product.name}</span>
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>
                    {product.brand} | {product.sku}
                  </span>
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.primary }}>
                    Length: {product.lengthPerSerial}m
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

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

      {/* ── Add new source reels sheet ───────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={addSpoolSheetOpen}
        onClose={() => setAddSpoolSheetOpen(false)}
        contained
      >
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[6],
          paddingTop:    tokens.spacing[4],
          paddingLeft:   tokens.spacing[4],
          paddingRight:  tokens.spacing[4],
          paddingBottom: tokens.spacing[0],
        }}>
          <h3 style={{ margin: 0, ...tokens.typography.h3, color: tokens.color.fg.primary, textAlign: "center" }}>
            Add new source reels
          </h3>

          {/* Initial length */}
          <CompositeInput
            label="Initial length"
            value={newSpoolLength}
            onChange={setNewSpoolLength}
            unitOptions={UNIT_OPTIONS}
            unitValue={newSpoolUnit}
            onUnitChange={setNewSpoolUnit}
          />

          {/* Trace serial */}
          <ScanInput
    
            label="Trace serial of source rope"
            placeholder="Scan or enter serial number"
            value={newSpoolSerial}
            onChange={e => setNewSpoolSerial(e.target.value)}
            onScan={() => setSpoolScanOpen(true)}
          />

          {/* Use of current rope */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>
              Use of current rope
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>
              <button
                type="button"
                onClick={() => setNewSpoolUseMode("use-remaining")}
                style={{
                  display:    "flex",
                  alignItems: "flex-start",
                  gap:        tokens.spacing[2],
                  background: "transparent",
                  border:     "none",
                  padding:    0,
                  cursor:     "pointer",
                  textAlign:  "left",
                }}
              >
                <div style={{
                  width:          16,
                  height:         16,
                  borderRadius:   "50%",
                  flexShrink:     0,
                  marginTop:      "2px",
                  boxSizing:      "border-box",
                  background:     newSpoolUseMode === "use-remaining" ? tokens.color.palette.indigo[500] : tokens.color.base.white,
                  border:         newSpoolUseMode === "use-remaining"
                    ? `1.5px solid ${tokens.color.palette.indigo[500]}`
                    : `1px solid ${tokens.color.divider.frame}`,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}>
                  {newSpoolUseMode === "use-remaining" && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: tokens.color.base.white }} />
                  )}
                </div>
                <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[0.5] }}>
                  <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary }}>Use up remaining rope first</span>
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>Finish the current spool before starting the new one.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setNewSpoolUseMode("start-new")}
                style={{
                  display:    "flex",
                  alignItems: "flex-start",
                  gap:        tokens.spacing[2],
                  background: "transparent",
                  border:     "none",
                  padding:    0,
                  cursor:     "pointer",
                  textAlign:  "left",
                }}
              >
                <div style={{
                  width:          16,
                  height:         16,
                  borderRadius:   "50%",
                  flexShrink:     0,
                  marginTop:      "2px",
                  boxSizing:      "border-box",
                  background:     newSpoolUseMode === "start-new" ? tokens.color.palette.indigo[500] : tokens.color.base.white,
                  border:         newSpoolUseMode === "start-new"
                    ? `1.5px solid ${tokens.color.palette.indigo[500]}`
                    : `1px solid ${tokens.color.divider.frame}`,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}>
                  {newSpoolUseMode === "start-new" && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: tokens.color.base.white }} />
                  )}
                </div>
                <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[0.5] }}>
                  <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary }}>Start new spool now</span>
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>Mark the current spool as empty and deduct the full amount from the new one.</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div style={{
          padding:    tokens.spacing[4],
          borderTop:  `1px solid ${tokens.color.divider.border}`,
          background: tokens.color.base.white,
          flexShrink: 0,
          marginTop:  tokens.spacing[6],
        }}>
          <Button variant="primary" label="Add" onClick={handleAddSpool} style={{ width: "100%" }} />
        </div>
      </BottomSheet>

      {/* ── Stop tracking length? sheet ──────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={stopTrackSheetOpen}
        onClose={() => setStopTrackSheetOpen(false)}
        contained
      >
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[6],
          paddingTop:    tokens.spacing[4],
          paddingLeft:   tokens.spacing[4],
          paddingRight:  tokens.spacing[4],
          paddingBottom: tokens.spacing[0],
        }}>
          {/* Warning icon */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.spacing[2] }}>
            <div style={{
              width:          40,
              height:         40,
              borderRadius:   tokens.borderRadius.lg,
              background:     tokens.color.tint.red,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 8v5M12 16.5v.5" stroke={tokens.color.fg.red} strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke={tokens.color.fg.red} strokeWidth="1.5" />
              </svg>
            </div>
            <h3 style={{ margin: 0, ...tokens.typography.h3, color: tokens.color.fg.primary, textAlign: "center" }}>
              Stop tracking length?
            </h3>
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <p style={{ margin: 0, ...tokens.typography.bodyR, color: tokens.color.fg.support, textAlign: "center" }}>
              You are about to disconnect length tracking for this spool.
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
              <li style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>
                <strong style={{ fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary }}>The length record will be wiped:</strong>{" "}
                You will no longer see "remaining meters" for this spool.
              </li>
              <li style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>
                <strong style={{ fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary }}>Downgrade to SKU level:</strong>{" "}
                This rope will only be saved as a recently used product, not as a specific tracked serial.
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          padding:       tokens.spacing[4],
          borderTop:     `1px solid ${tokens.color.divider.border}`,
          background:    tokens.color.base.white,
          flexShrink:    0,
          marginTop:     tokens.spacing[6],
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[3],
        }}>
          <button
            type="button"
            onClick={handleStopTracking}
            style={{
              width:          "100%",
              height:         "44px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              background:     tokens.color.bg.red,
              border:         `1px solid ${tokens.color.bg.red}`,
              borderRadius:   tokens.borderRadius.md,
              fontFamily:     tokens.fontFamily.sans,
              fontSize:       "14px",
              fontWeight:     tokens.fontWeight.medium,
              lineHeight:     "20px",
              color:          tokens.color.base.white,
              cursor:         "pointer",
            }}
          >
            Stop tracking & wipe data
          </button>
          <Button variant="secondary" label="Keep tracking" onClick={() => setStopTrackSheetOpen(false)} style={{ width: "100%" }} />
        </div>
      </BottomSheet>

      {/* Scan sheet for new spool serial */}
      <ScanSimulationSheet
        open={spoolScanOpen}
        onClose={() => setSpoolScanOpen(false)}
        contained
        onDetected={value => {
          setNewSpoolSerial(value);
          setSpoolScanOpen(false);
        }}
      />

    </div>
  );
}
