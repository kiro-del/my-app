// @refresh reset
"use client";
// app/mobile/cut-rope-lengths-v2/page.tsx
// Figma: nodes 263:60201, 263:60124, 263:60925, 263:60840, 263:60884, 263:62442, 263:60954, 263:60968

import React, { useState, useEffect, Suspense } from "react";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { useRouter, useSearchParams } from "next/navigation";
import { getReels } from "@/lib/reels-store";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { MobileButton } from "@/components/ui/mobile/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/mobile/Input";
import { ScanInput } from "@/components/ui/mobile/InputScan";
import { SelectInput } from "@/components/ui/mobile/InputSelect";
import { InputCalendar } from "@/components/ui/mobile/InputCalendar";
import { ScanSimulationSheet } from "@/components/patterns/ScanSimulationSheet";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Reel {
  id:      string;
  name:    string;
  brand:   string;
  barcode: string;
  serial:  string;
  image?:  string;
}

interface CutConfig {
  id:          string;
  name:        string;
  spliceLabel: string;
  length:      string;
}

type Step = "select" | "details" | "cut" | "order";

// ── Static data ────────────────────────────────────────────────────────────────

const REELS: Reel[] = [
  {
    id:      "r1",
    name:    "PERFORMANCE STATIC 10.0mm 200m",
    brand:   "Edelrid",
    barcode: "832042000470",
    serial:  "#132241154A",
    image:   "/edelrid-performance-static-10.0-mm-rope.webp",
  },
  {
    id:      "r2",
    name:    'Braided Safety Blue 12.7mm 1/2" 182m HiVee',
    brand:   "Teufelberger",
    barcode: "C3250-16-00600",
    serial:  "#593-4890",
    image:   "/Braided Safety Blue.webp",
  },
  {
    id:      "r3",
    name:    'Braided Safety Blue 12.7mm 1/2" 365m HiVee',
    brand:   "Teufelberger",
    barcode: "C3250-16-01200",
    serial:  "#593-4847",
    image:   "/Braided Safety Blue.webp",
  },
  {
    id:      "r4",
    name:    'Braided Safety Blue 12.7mm 1/2" 365m HiVee',
    brand:   "Teufelberger",
    barcode: "C3250-16-01200",
    serial:  "#593-4852",
    image:   "/Braided Safety Blue.webp",
  },
];

function profileRows(serial: string) {
  return [
    { label: "Manufacturer",   value: "Teufelberger"  },
    { label: "Part number",    value: "C3250-16-00600" },
    { label: "Serial number",  value: serial           },
  ];
}

const SPEC_ROWS = [
  { label: "Product category",          value: "Climbing Equipment"  },
  { label: "Product subcategory",       value: "Ropes and Webbing"   },
  { label: "Attribute",                 value: "Ropes"               },
  { label: "Rope type",                 value: "Single Rope"         },
  { label: "Diameter",                  value: "9.5 mm"              },
  { label: "Weight",                    value: "59 g/m"              },
  { label: "Impact force (Factor 1.77)",value: "7.5 kN"              },
  { label: "UIAA falls (Factor 1.77)",  value: "6"                   },
  { label: "Dynamic elongation",        value: "38 %"                },
  { label: "Static elongation (80 kg)", value: "8 %"                 },
  { label: "Sheath slippage",           value: "0 mm"                },
  { label: "Percentage of sheath",      value: "38 %"                },
];

const CUT_CONFIGS: CutConfig[] = [
  { id: "c1", name: "Drenaline Red 11.5mm 20m", spliceLabel: "Eye Splice × 2",              length: "20m" },
  { id: "c2", name: "Drenaline Red 11.5mm 15m", spliceLabel: "Whipped End",                 length: "15m" },
  { id: "c3", name: "Drenaline Red 11.5mm 5m",  spliceLabel: "Eye Splice + Back Splice",    length: "5m"  },
  { id: "c4", name: "Drenaline Red 11.5mm 3m",  spliceLabel: "Eye Splice",                  length: "3m"  },
  { id: "c5", name: "Drenaline Red 11.5mm 10m", spliceLabel: "Heat Sealed",                 length: "10m" },
];

const FILTER_LENGTHS = ["3m", "5m", "10m", "12m", "15m", "18m"];
const FILTER_SPLICES = ["Eye Splice", "Back Splice", "Whipped End", "Heat Sealed"];

const SERIAL_FORMAT_OPTIONS = [
  { value: "standard",   label: "Standard"   },
  { value: "custom",     label: "Custom"     },
  { value: "sequential", label: "Sequential" },
];

const SETTINGS_ICON_ID  = "6434:881";
const PHONE_SCAN_ID     = "4094:8844";
const EXPAND_ICON_ID    = "2529:5043";
const ADD_ICON_ID       = "46:2936";

// ── Icons ──────────────────────────────────────────────────────────────────────

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function FilterIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 4h12M4 8h8M6 12h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 10l4-4 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScanIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="5" width="16" height="11" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M6 9h2M6 11h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="13" y="8.5" width="3" height="4" rx="0.5" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function ProductThumb({ size = 64, image }: { size?: number; image?: string }) {
  const innerSize = Math.round(size * 0.75); // 48px inside a 64px container (Figma: left:7px, size:48px)
  return (
    <div style={{
      width:          size,
      height:         size,
      flexShrink:     0,
      borderRadius:   tokens.borderRadius.md,
      border:         `1px solid ${tokens.color.divider.border}`,
      background:     tokens.color.base.white,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      overflow:       "hidden",
    }}>
      {image
        ? <img src={image} alt="" style={{ width: innerSize, height: innerSize, objectFit: "cover" }} />
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
      Step {step}/4
    </span>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <span style={{
      fontFamily:    tokens.fontFamily.sans,
      fontSize:      "11px",
      fontWeight:    tokens.fontWeight.semiBold,
      lineHeight:    "16px",
      letterSpacing: "0.08em",
      color:         tokens.color.fg.support,
      textTransform: "uppercase",
    }}>
      {title}
    </span>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display:    "flex",
      alignItems: "flex-start",
      padding:    `${tokens.spacing[2]} 0`,
    }}>
      <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support, flexShrink: 0, width: "144px" }}>{label}</span>
      <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary, flex: "1 0 0", minWidth: 0 }}>{value}</span>
    </div>
  );
}

// Chip used inside the "View all cut ropes" sheet — matches Figma active/inactive badge styles
function SheetFilterChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          selected ? "8px" : 0,
        padding:      selected ? "8px" : `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        borderRadius: selected ? tokens.borderRadius.md : tokens.borderRadius.lg,
        border:       `1px solid ${selected ? tokens.color.divider.blue : tokens.color.divider.frame}`,
        background:   selected ? tokens.color.tint.blue : tokens.color.base.white,
        color:        selected ? tokens.color.fg.blue : tokens.color.fg.primary,
        cursor:       "pointer",
        outline:      "none",
        ...tokens.typography.bodyM,
        fontWeight:   selected ? 400 : 300,
      }}
    >
      {label}
      {selected && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 4l8 8M12 4l-8 8" stroke={tokens.color.fg.blue} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function FilterChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        padding:      `${tokens.spacing[1.5]} ${tokens.spacing[3]}`,
        borderRadius: tokens.borderRadius.full,
        border:       `1px solid ${selected ? tokens.color.divider.blue : tokens.color.divider.frame}`,
        background:   selected ? tokens.color.tint.blue : tokens.color.base.white,
        color:        selected ? tokens.color.fg.blue : tokens.color.fg.primary,
        cursor:       "pointer",
        outline:      "none",
        ...tokens.typography.bodyM,
      }}
    >
      {label}
    </button>
  );
}

// ── Step 1: Reel list item ─────────────────────────────────────────────────────

function ReelListItem({ reel, onSelect }: { reel: Reel; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        tokens.spacing[4],
        width:      "100%",
        padding:    0,
        background: "none",
        border:     "none",
        cursor:     "pointer",
        textAlign:  "left",
        outline:    "none",
      }}
    >
      <ProductThumb size={64} image={reel.image} />
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>{reel.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{reel.brand}</span>
          <div style={{ width: "1px", height: "10px", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{reel.barcode}</span>
        </div>
        <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.primary, textDecoration: "underline" }}>
          {reel.serial}
        </span>
      </div>
    </button>
  );
}

// ── Step 3: Cut config card ────────────────────────────────────────────────────

function CutConfigRow({ config, selected, divider, onClick }: { config: CutConfig; selected: boolean; divider: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:     "flex",
        alignItems:  "flex-start",
        gap:         tokens.spacing[4],
        width:       "100%",
        background:  "none",
        border:      "none",
        borderBottom: divider ? `1px solid ${tokens.color.divider.border}` : "none",
        paddingBottom: divider ? tokens.spacing[4] : 0,
        cursor:      "pointer",
        textAlign:   "left",
        outline:     "none",
        boxSizing:   "border-box",
        padding:     divider ? `0 0 ${tokens.spacing[4]}` : "0",
      }}
    >
      <div style={{
        width:        16,
        height:       16,
        borderRadius: "50%",
        border:       `${selected ? 5 : 1.5}px solid ${selected ? tokens.color.divider.blue : tokens.color.divider.frame}`,
        flexShrink:   0,
        marginTop:    2,
        boxSizing:    "border-box",
        transition:   "border 150ms ease",
      }} />
      <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary }}>{config.name}</span>
        <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>{config.spliceLabel}</span>
        <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "12px", fontWeight: 600, lineHeight: "16px", color: tokens.color.fg.green }}>
          Length: {config.length}
        </span>
      </div>
    </button>
  );
}

// ── Step 3: Quantity stepper ───────────────────────────────────────────────────

function QuantityStepper({ value, onChange, addIconUrl }: { value: number; onChange: (v: number) => void; addIconUrl?: string }) {
  const btnStyle: React.CSSProperties = {
    width:          48,
    height:         48,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    background:     tokens.color.base.white,
    border:         `1px solid ${tokens.color.divider.frame}`,
    borderRadius:   tokens.borderRadius.md,
    cursor:         "pointer",
    outline:        "none",
    flexShrink:     0,
  };

  // DS minus icon (node 56:261): horizontal 2×14px bar, inset 45.83% 20.83% in 24×24
  const MinusDS = (
    <div style={{ width: 24, height: 24, position: "relative", overflow: "hidden", flexShrink: 0 }} aria-hidden>
      <div style={{
        position: "absolute",
        top: "45.83%", bottom: "45.83%",
        left: "20.83%", right: "20.83%",
        background: tokens.color.fg.primary,
        borderRadius: "2px",
      }} />
    </div>
  );

  // DS add icon (node 46:2936): CSS mask when URL available, SVG fallback
  const AddDS = addIconUrl ? (
    <span aria-hidden style={{
      display: "inline-block", width: 24, height: 24, flexShrink: 0,
      background: tokens.color.fg.primary,
      maskImage: `url(${addIconUrl})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
      WebkitMaskImage: `url(${addIconUrl})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
    } as React.CSSProperties} />
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke={tokens.color.fg.primary} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      width:          "100%",
      padding:        tokens.spacing[6],
      borderRadius:   "16px",
      border:         `1px solid ${tokens.color.divider.border}`,
      background:     tokens.color.base.white,
      boxSizing:      "border-box",
    }}>
      <button onClick={() => onChange(Math.max(1, value - 1))} style={btnStyle}>{MinusDS}</button>
      <input
        type="number"
        value={value}
        min={1}
        onChange={e => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n) && n >= 1) onChange(n);
        }}
        onBlur={e => {
          const n = parseInt(e.target.value, 10);
          if (isNaN(n) || n < 1) onChange(1);
        }}
        style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    "24px",
          fontWeight:  500,
          lineHeight:  "1.4",
          color:       tokens.color.fg.primary,
          border:      "none",
          outline:     "none",
          background:  "transparent",
          textAlign:   "center",
          width:       "64px",
          MozAppearance: "textfield",
        } as React.CSSProperties}
      />
      <button onClick={() => onChange(value + 1)} style={btnStyle}>{AddDS}</button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function CutRopeLengthsV2Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const figmaIcons = useFigmaIcons([SETTINGS_ICON_ID, PHONE_SCAN_ID, EXPAND_ICON_ID, ADD_ICON_ID]);
  const settingsIconUrl = figmaIcons[SETTINGS_ICON_ID];
  const phoneScanUrl    = figmaIcons[PHONE_SCAN_ID];
  const expandIconUrl   = figmaIcons[EXPAND_ICON_ID];
  const addIconUrl      = figmaIcons[ADD_ICON_ID];

  const [step, setStep]                   = useState<Step>("select");
  const [selectedReel, setSelectedReel]   = useState<Reel | null>(null);
  const [scanOpen, setScanOpen]           = useState(false);
  const [myReels, setMyReels]             = useState<Reel[]>([]);

  function loadReels() {
    setMyReels(getReels().map(r => ({ id: r.id, name: r.name, brand: r.brand, barcode: r.sku, serial: `#${r.serial}`, image: r.image })));
  }

  useEffect(() => {
    loadReels();
    const onVisibility = () => { if (document.visibilityState === "visible") loadReels(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const reelId = searchParams.get("reelId");
    if (!reelId) return;
    const stored = getReels().find(r => r.id === reelId);
    if (!stored) return;
    setSelectedReel({ id: stored.id, name: stored.name, brand: stored.brand, barcode: stored.sku, serial: `#${stored.serial}`, image: stored.image });
    setStep("details");
  }, [searchParams]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [quantity, setQuantity]           = useState(1);
  const [showAll, setShowAll]             = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filterLengths, setFilterLengths] = useState<string[]>([]);
  const [filterSplices, setFilterSplices] = useState<string[]>([]);
  const [viewAllSheetOpen, setViewAllSheetOpen] = useState(false);
  const [viewAllLengths, setViewAllLengths] = useState<string[]>([]);
  const [viewAllSplices, setViewAllSplices] = useState<string[]>([]);
  const [stagingLengths, setStagingLengths] = useState<string[]>([]);
  const [stagingSplices, setStagingSplices] = useState<string[]>([]);
  const [purchaseOrder, setPurchaseOrder]   = useState("");
  const [batchNumber, setBatchNumber]       = useState("");
  const [dateOfManufacture, setDateOfManufacture] = useState("");
  const [salesOrderNumber, setSalesOrderNumber]   = useState("");
  const [customerReference, setCustomerReference] = useState("");
  const [serialFormat, setSerialFormat]           = useState("");
  const [advancedExpanded, setAdvancedExpanded]   = useState(false);

  function openFilterSheet() {
    setStagingLengths([...filterLengths]);
    setStagingSplices([...filterSplices]);
    setFilterSheetOpen(true);
  }

  function applyFilters() {
    setFilterLengths([...stagingLengths]);
    setFilterSplices([...stagingSplices]);
    setFilterSheetOpen(false);
  }

  const activeFilterCount = filterLengths.length + filterSplices.length;

  const filteredConfigs = CUT_CONFIGS.filter(c => {
    const lengthMatch = filterLengths.length === 0 || filterLengths.includes(c.length);
    const spliceMatch = filterSplices.length === 0 || filterSplices.some(s => c.spliceLabel.toLowerCase().includes(s.toLowerCase()));
    return lengthMatch && spliceMatch;
  });
  const visibleConfigs = showAll ? filteredConfigs : filteredConfigs.slice(0, 3);

  // Selected config floats to top of the main step-3 card
  const mainCardConfigs = [
    ...CUT_CONFIGS.filter(c => c.id === selectedConfigId),
    ...CUT_CONFIGS.filter(c => c.id !== selectedConfigId),
  ].slice(0, 2);

  const viewAllFiltered = CUT_CONFIGS.filter(c => {
    const lengthMatch = viewAllLengths.length === 0 || viewAllLengths.includes(c.length);
    const spliceMatch = viewAllSplices.length === 0 || viewAllSplices.some(s => c.spliceLabel.toLowerCase().includes(s.toLowerCase()));
    return lengthMatch && spliceMatch;
  });

  function goBack() {
    if (step === "select")  router.back();
    if (step === "details") setStep("select");
    if (step === "cut")     setStep("details");
    if (step === "order")   setStep("cut");
  }

  function appBarTitle() {
    return "Cut rope lengths";
  }

  function stepNumber() {
    if (step === "select")  return 1;
    if (step === "details") return 2;
    if (step === "cut")     return 3;
    return 4;
  }

  return (
    <div style={{
      position:      "relative",
      height:        "100dvh",
      width:         "100%",
      overflow:      "hidden",
      background:    tokens.color.bg.bg,
      display:       "flex",
      flexDirection: "column",
      fontFamily:    tokens.fontFamily.sans,
    }}>
      <MobileAppBar
        page="task"
        transparent
        lightBg
        title={appBarTitle()}
        taskNavIcon={step === "select" ? "close" : "back"}
        onClose={goBack}
        onBack={goBack}
      />

      {/* Scrollable content */}
      <div style={{ flex: "1 1 0", overflowY: "auto", overflowX: "hidden" }}>

        {/* ── STEP 1: SELECT SOURCE REEL ──────────────────────────────────── */}
        {step === "select" && (
          <div style={{ padding: `${tokens.spacing[4]} ${tokens.spacing[4]} ${tokens.spacing[6]}` }}>
            {/* Step indicator + H1 */}
            <div style={{ marginBottom: tokens.spacing[6] }}>
              <StepIndicator step={1} />
              <h2 style={{
                margin:        `${tokens.spacing[1]} 0 0`,
                fontFamily:    tokens.fontFamily.sans,
                fontSize:      "24px",
                fontWeight:    tokens.fontWeight.semiBold,
                lineHeight:    "1.4",
                letterSpacing: "0",
                color:         tokens.color.fg.primary,
              }}>
                Select source reel
              </h2>
            </div>

            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing[3] }}>
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "12px", fontWeight: 500, lineHeight: "16px", color: tokens.color.fg.support, letterSpacing: "0.06em" }}>MY REELS:</span>
              <button onClick={() => router.push("/mobile/manage-reels")} style={{
                display:    "flex",
                alignItems: "center",
                gap:        tokens.spacing[1],
                background: "none",
                border:     "none",
                cursor:     "pointer",
                padding:    0,
                outline:    "none",
                fontFamily:     tokens.fontFamily.sans,
                fontSize:       "14px",
                fontWeight:     "400",
                lineHeight:     "20px",
                textDecoration: "none",
                color:          tokens.color.fg.blue,
              }}>
                {settingsIconUrl ? (
                  <span aria-hidden style={{
                    display:              "inline-block",
                    width:                "16px",
                    height:               "16px",
                    flexShrink:           0,
                    background:           tokens.color.fg.blue,
                    maskImage:            `url(${settingsIconUrl})`,
                    maskSize:             "contain",
                    maskRepeat:           "no-repeat",
                    maskPosition:         "center",
                    WebkitMaskImage:      `url(${settingsIconUrl})`,
                    WebkitMaskSize:       "contain",
                    WebkitMaskRepeat:     "no-repeat",
                    WebkitMaskPosition:   "center",
                  } as React.CSSProperties} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <circle cx="8" cy="8" r="2.5" stroke={tokens.color.fg.blue} strokeWidth="1.2" />
                    <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" stroke={tokens.color.fg.blue} strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
                Manage my reels
              </button>
            </div>

            {/* Individual reel cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[3] }}>
              {myReels.map(reel => (
                <div
                  key={reel.id}
                  style={{
                    background:   tokens.color.base.white,
                    borderRadius: "12px",
                    padding:      tokens.spacing[4],
                  }}
                >
                  <ReelListItem reel={reel} onSelect={() => { setSelectedReel(reel); setStep("details"); }} />
                </div>
              ))}
            </div>

            <div style={{ marginTop: tokens.spacing[5], display: "flex", justifyContent: "center" }}>
              <MobileButton
                variant="scan-pill"
                label="Scan reel code"
                onClick={() => setScanOpen(true)}
                icon={phoneScanUrl
                  ? <img src={phoneScanUrl} width={24} height={24} alt="" aria-hidden style={{ display: "block" }} />
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="6" y="2.5" width="12" height="19" rx="3" stroke={tokens.color.fg.primary} strokeWidth="2" />
                      <line x1="0" y1="9"  x2="5" y2="9"  stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="0" y1="14" x2="4" y2="14" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                }
              />
            </div>
          </div>
        )}

        {/* ── STEP 2: SOURCE REEL DETAILS ─────────────────────────────────── */}
        {step === "details" && selectedReel && (
          <div>
            {/* Heading block */}
            <div style={{ padding: `${tokens.spacing[4]} ${tokens.spacing[4]} 0`, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
              <StepIndicator step={2} />
              <h2 style={{
                margin:        0,
                fontFamily:    tokens.fontFamily.sans,
                fontSize:      "24px",
                fontWeight:    tokens.fontWeight.semiBold,
                lineHeight:    "1.4",
                letterSpacing: "0",
                color:         tokens.color.fg.primary,
              }}>
                Source reel details
              </h2>
              <p style={{ margin: 0, ...tokens.typography.bodyR, color: tokens.color.fg.support }}>
                This info will be linked to all cut rope items created from it.
              </p>
            </div>

            {/* Image + name — full-width white panel, no border-radius */}
            <div style={{
              background:    tokens.color.base.white,
              marginTop:     tokens.spacing[4],
              padding:       tokens.spacing[4],
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              gap:           tokens.spacing[4],
            }}>
              {selectedReel.image
                ? <img src={selectedReel.image} alt="" style={{ width: "138px", height: "138px", objectFit: "contain" }} />
                : <CameraIcon color={tokens.color.fg.disabled} />
              }
              <span style={{
                fontFamily:  tokens.fontFamily.sans,
                fontSize:    "16px",
                fontWeight:  "400",
                lineHeight:  "22px",
                color:       tokens.color.fg.primary,
                textAlign:   "center",
              }}>
                {selectedReel.name}
              </span>
            </div>

            {/* Separator */}
            <div style={{ height: "12px", background: tokens.color.bg.lightBg }} />

            {/* PROFILE section — full-width white panel */}
            <div style={{ background: tokens.color.base.white, padding: tokens.spacing[4] }}>
              <p style={{
                margin:        `0 0 ${tokens.spacing[1]}`,
                fontFamily:    tokens.fontFamily.sans,
                fontSize:      "14px",
                fontWeight:    "500",
                lineHeight:    "20px",
                color:         tokens.color.fg.primary,
              }}>
                PROFILE
              </p>
              {profileRows(selectedReel.serial).map(row => (
                <SpecRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>

            {/* Separator */}
            <div style={{ height: "12px", background: tokens.color.bg.lightBg }} />

            {/* SPEC section — full-width white panel */}
            <div style={{ background: tokens.color.base.white, padding: tokens.spacing[4], paddingBottom: "120px" }}>
              <p style={{
                margin:        `0 0 ${tokens.spacing[1]}`,
                fontFamily:    tokens.fontFamily.sans,
                fontSize:      "14px",
                fontWeight:    "500",
                lineHeight:    "20px",
                color:         tokens.color.fg.primary,
              }}>
                SPEC
              </p>
              {SPEC_ROWS.map(row => (
                <SpecRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: CONFIGURE CUT ROPES ─────────────────────────────────── */}
        {step === "cut" && (
          <div style={{ padding: `16px ${tokens.spacing[4]} 120px`, display: "flex", flexDirection: "column", gap: tokens.spacing[6] }}>

            {/* Heading */}
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
              <StepIndicator step={3} />
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 300, lineHeight: "1.4", color: tokens.color.fg.primary }}>
                Configure cut ropes
              </h2>
            </div>

            {/* Select section */}
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>Select</span>

              {/* Single card with all options */}
              <div style={{
                background:   tokens.color.base.white,
                border:       `1px solid ${tokens.color.divider.border}`,
                borderRadius: "16px",
                padding:      tokens.spacing[6],
                display:      "flex",
                flexDirection: "column",
                gap:          tokens.spacing[4],
              }}>
                {mainCardConfigs.map((config, i) => (
                  <CutConfigRow
                    key={config.id}
                    config={config}
                    selected={selectedConfigId === config.id}
                    divider={i < mainCardConfigs.length - 1}
                    onClick={() => setSelectedConfigId(config.id)}
                  />
                ))}

                {/* Divider + View all link */}
                <div style={{ height: "1px", background: tokens.color.divider.border, margin: `0 -${tokens.spacing[6]}` }} />
                <button
                  onClick={() => setViewAllSheetOpen(true)}
                  style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        tokens.spacing[1],
                  background: "none",
                  border:     "none",
                  padding:    0,
                  cursor:     "pointer",
                  outline:    "none",
                  ...tokens.typography.bodyM,
                  color:      tokens.color.fg.blue,
                }}>
                  {expandIconUrl ? (
                    <span aria-hidden style={{
                      display: "inline-block", width: "16px", height: "16px", flexShrink: 0,
                      background: tokens.color.fg.blue,
                      maskImage: `url(${expandIconUrl})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
                      WebkitMaskImage: `url(${expandIconUrl})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
                    } as React.CSSProperties} />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 13L13 3M13 3H7M13 3V9" stroke={tokens.color.fg.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  View all cut ropes
                </button>
              </div>

              {/* + Add custom one */}
              <button style={{
                display:    "flex",
                alignItems: "center",
                gap:        tokens.spacing[1],
                background: "none",
                border:     "none",
                padding:    `${tokens.spacing[3]} 0`,
                cursor:     "pointer",
                outline:    "none",
                ...tokens.typography.bodyM,
                color:      tokens.color.fg.blue,
              }}>
                <PlusIcon color={tokens.color.fg.blue} />
                Add custom one
              </button>
            </div>

            {/* Number of ropes to cut */}
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>Number of ropes to cut</span>
              <QuantityStepper value={quantity} onChange={setQuantity} addIconUrl={addIconUrl} />
            </div>

          </div>
        )}

        {/* ── STEP 4: EDIT ORDER DETAILS ──────────────────────────────────── */}
        {step === "order" && (
          <div style={{ padding: `16px ${tokens.spacing[4]} 120px`, display: "flex", flexDirection: "column", gap: tokens.spacing[6] }}>

            {/* Heading */}
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
              <StepIndicator step={4} />
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 300, lineHeight: "1.4", color: tokens.color.fg.primary }}>
                Edit order details
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>
              <Input
                label="Purchase order"
                placeholder="e.g. PO-2024-0012"
                value={purchaseOrder}
                onChange={e => setPurchaseOrder(e.target.value)}
              />

              <ScanInput
                label="Batch Number"
                placeholder="Scan or type batch number"
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
              />

              <InputCalendar
                label="Date of manufacture"
                value={dateOfManufacture}
                onChange={setDateOfManufacture}
              />

              <button
                onClick={() => setAdvancedExpanded(v => !v)}
                style={{
                  display:     "flex",
                  alignItems:  "center",
                  gap:         tokens.spacing[1],
                  padding:     `${tokens.spacing[2.5]} 0`,
                  background:  "transparent",
                  border:      "none",
                  cursor:      "pointer",
                  outline:     "none",
                  alignSelf:   "flex-start",
                }}
              >
                {advancedExpanded
                  ? <ChevronUpIcon color={tokens.color.fg.blue} />
                  : <ChevronDownIcon color={tokens.color.fg.blue} />
                }
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: 300, lineHeight: "20px", color: tokens.color.fg.blue }}>
                  advanced options
                </span>
              </button>

              {advancedExpanded && (
                <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>
                  <div style={{ display: "flex", flexDirection: "row", gap: tokens.spacing[3] }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Input
                        label="Sales order number"
                        placeholder="e.g. SO-2024-0008"
                        value={salesOrderNumber}
                        onChange={e => setSalesOrderNumber(e.target.value)}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Input
                        label="Customer reference"
                        placeholder="e.g. CUST-REF-001"
                        value={customerReference}
                        onChange={e => setCustomerReference(e.target.value)}
                      />
                    </div>
                  </div>
                  <SelectInput
                    label="Select a serial format"
                    placeholder="Choose format…"
                    options={SERIAL_FORMAT_OPTIONS}
                    value={serialFormat}
                    onChange={setSerialFormat}
                  />
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── STICKY FOOTER ──────────────────────────────────────────────────── */}
      {step !== "select" && <div style={{
        position:      "absolute",
        bottom:        0,
        left:          0,
        right:         0,
        padding:       `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
        background:    tokens.color.base.white,
        boxShadow:     tokens.shadows.upMd,
      }}>
        {step === "details" && (
          <MobileButton variant="primary" label="Continue" onClick={() => setStep("cut")} />
        )}
        {step === "cut" && (
          <MobileButton variant="primary" label="Continue" onClick={() => setStep("order")} disabled={!selectedConfigId} />
        )}
        {step === "order" && (
          <MobileButton variant="primary" label="Print labels" onClick={() => router.push("/mobile/print-labels")} />
        )}
      </div>}

      {/* ── FILTER BOTTOM SHEET ────────────────────────────────────────────── */}
      {/* ── VIEW ALL CUT ROPES SHEET ───────────────────────────────────────── */}
      <BottomSheet variant="bottom-sheet-mobile" open={viewAllSheetOpen} onClose={() => setViewAllSheetOpen(false)} contained>
        {/* Outer scrollable — marginTop:-22px + paddingTop:22px extends lightBg over the DragHandle */}
        <div style={{ height: "85vh", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", background: tokens.color.bg.lightBg, marginTop: "-22px", paddingTop: "22px" }}>
          {/* Filter section — inherits lightBg */}
          <div style={{
            padding:       `${tokens.spacing[4]} ${tokens.spacing[4]} ${tokens.spacing[3]}`,
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[2],
            flexShrink:    0,
          }}>
            <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>Select cut ropes:</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>Filter by lengths:</span>
                <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", width: "calc(100vw - 32px)", gap: tokens.spacing[2], paddingBottom: "2px" }}>
                  {FILTER_LENGTHS.map(l => (
                    <SheetFilterChip
                      key={l}
                      label={l}
                      selected={viewAllLengths.includes(l)}
                      onClick={() => setViewAllLengths(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>Filter by splices:</span>
                <div style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", width: "calc(100vw - 32px)", gap: tokens.spacing[2], paddingBottom: "2px" }}>
                  {FILTER_SPLICES.map(s => (
                    <SheetFilterChip
                      key={s}
                      label={s}
                      selected={viewAllSplices.includes(s)}
                      onClick={() => setViewAllSplices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* List section — white, continues in the same scroll */}
          <div style={{
            background:    tokens.color.base.white,
            padding:       tokens.spacing[4],
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[3],
            flex:          "1 1 auto",
          }}>
            {viewAllFiltered.length === 0 ? (
              <p style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support, textAlign: "center", padding: tokens.spacing[6] }}>
                No options match your filters.
              </p>
            ) : viewAllFiltered.map(config => (
              <button
                key={config.id}
                onClick={() => { setSelectedConfigId(config.id); setViewAllSheetOpen(false); }}
                style={{
                  display:      "flex",
                  alignItems:   "flex-start",
                  gap:          tokens.spacing[2],
                  width:        "100%",
                  padding:      tokens.spacing[4],
                  border:       `1px solid ${selectedConfigId === config.id ? tokens.color.divider.blue : tokens.color.divider.frame}`,
                  borderRadius: tokens.borderRadius.lg,
                  background:   tokens.color.base.white,
                  cursor:       "pointer",
                  textAlign:    "left",
                  outline:      "none",
                  boxSizing:    "border-box",
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0, marginTop: 2, boxSizing: "border-box",
                  border: `${selectedConfigId === config.id ? 5 : 1.5}px solid ${selectedConfigId === config.id ? tokens.color.divider.blue : tokens.color.divider.frame}`,
                  transition: "border 150ms ease",
                }} />
                <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                  <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary }}>{config.name}</span>
                  <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>{config.spliceLabel}</span>
                  <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "12px", fontWeight: 300, lineHeight: "16px", color: tokens.color.fg.green }}>
                    Length: {config.length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ── FILTER BOTTOM SHEET ────────────────────────────────────────────── */}
      <BottomSheet variant="bottom-sheet-mobile" open={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} contained>
        <div style={{ padding: `${tokens.spacing[1]} ${tokens.spacing[4]} ${tokens.spacing[6]}` }}>
          <h3 style={{ margin: `0 0 ${tokens.spacing[5]}`, ...tokens.typography.h5, color: tokens.color.fg.primary }}>
            Filter by
          </h3>

          <div style={{ marginBottom: tokens.spacing[5] }}>
            <div style={{ marginBottom: tokens.spacing[2] }}><SectionLabel title="Length" /></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacing[2] }}>
              {FILTER_LENGTHS.map(l => (
                <FilterChip
                  key={l}
                  label={l}
                  selected={stagingLengths.includes(l)}
                  onClick={() => setStagingLengths(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: tokens.spacing[6] }}>
            <div style={{ marginBottom: tokens.spacing[2] }}><SectionLabel title="Splices" /></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacing[2] }}>
              {FILTER_SPLICES.map(s => (
                <FilterChip
                  key={s}
                  label={s}
                  selected={stagingSplices.includes(s)}
                  onClick={() => setStagingSplices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                />
              ))}
            </div>
          </div>

          <MobileButton
            label={stagingLengths.length + stagingSplices.length > 0
              ? `Show results (${stagingLengths.length + stagingSplices.length} filters)`
              : "Show results"}
            variant="primary"
            style={{ width: "100%" }}
            onClick={applyFilters}
          />
        </div>
      </BottomSheet>

      {/* Scan reel code sheet — step 1 entry point */}
      <ScanSimulationSheet
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        contained
        hint="Scan reel barcode or QR code"
        onDetected={(value) => {
          setScanOpen(false);
          const reels = getReels();
          const match = reels.find(r => r.serial === value || r.sku === value) ?? reels[0];
          if (match) {
            setSelectedReel({ id: match.id, name: match.name, brand: match.brand, barcode: match.sku, serial: `#${match.serial}`, image: match.image });
            setStep("details");
          }
        }}
      />
    </div>
  );
}

export default function CutRopeLengthsV2Page() {
  return (
    <Suspense>
      <CutRopeLengthsV2Inner />
    </Suspense>
  );
}
