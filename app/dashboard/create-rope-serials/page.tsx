"use client";

// app/dashboard/create-rope-serials/page.tsx
// Figma: fGNvex4MPWovOPAc9u7pC0
//   Step 1 (default):  node 3221:97878
//   Step 1 (hover):    node 3233:14348
//   Step 1 (search):   node 3223:98293
//   Step 1 (selected): node 3233:14087 / 3223:98924
//   Step 2:            node 3223:99407

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { AppShell } from "@/components/ui/AppShell";
import { Input } from "@/components/ui/Input";
import { CalendarIcon } from "@/components/ui/InputCalendar";
import { RadioIndicator, RadioInput } from "@/components/ui/Radio";
import { ProductImg } from "@/components/ui/ProductImg";
import { ListViewItem } from "@/components/ui/ListViewItem";
import { Button } from "@/components/ui/Button";
import { SearchDropdown, type SearchDropdownItem } from "@/components/ui/SearchDropdown";
import { CompositeInput, type UnitOption } from "@/components/ui/InputComposite";
import { SelectInput, type SelectOption } from "@/components/ui/InputSelect";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { Steps } from "@/components/ui/Steps";
import { ScanInput } from "@/components/ui/InputScan";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="11" cy="11" r="7" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
    <path d="M16.5 16.5L21 21" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" />
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
  id:     string;
  name:   string;
  brand:  string;
  sku:    string;
  image?: string;
}

type SerialFormat = "customer" | "scannable" | "nfc";
type ProductMode  = "existing" | "new";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

/** Recently used ropes — shown in the grid and as "Used products" in search */
const RECENT_PRODUCTS: Product[] = [
  { id: "1", name: "Arbor Elite 12.7mm 60m One Sla...", brand: "Teufelberger", sku: "7361024"       },
  { id: "2", name: "ZENITH 9.5 mm Pink 60 m",           brand: "Beal",          sku: "BC095Z.60.P"  },
  { id: "3", name: "ZENITH 9.5 mm Blue 200 m",          brand: "Beal",          sku: "BC095Z.200.B" },
  { id: "4", name: "ZENITH 9.5 mm Blue 200 m",          brand: "Beal",          sku: "BC095Z.200.B" },
  { id: "5", name: "11MM Kernmantle Marlow Static R...", brand: "Marlow",        sku: "ZTO11/11"     },
];

/** Broader catalogue — shown as "Products in global database" in search results */
const GLOBAL_PRODUCTS: Product[] = [
  { id: "6", name: "Fixe Ranger Rope – 11mm – 200m Spool", brand: "Aspiring safety", sku: "P11FRSR"       },
  { id: "7", name: "11mm Marlow Kernmantle static rope",    brand: "Marlow",          sku: "ZTO11/12"      },
  { id: "8", name: "Teufelberger XSTATIC 11mm 100m",       brand: "Teufelberger",    sku: "7361025"       },
  { id: "9", name: "Petzl PARALLEL 10.5mm 50m",            brand: "Petzl",           sku: "R075BA50"      },
];

/** Cut-rope products shown inside the "Select from existing product" card */
const CUT_ROPE_PRODUCTS: Product[] = [
  { id: "cr1", name: "link rope - 3m", brand: "Reseller-cut", sku: "RCO11/3" },
  { id: "cr2", name: "link rope - 5m", brand: "Reseller-cut", sku: "RCO11/5" },
];

/** Serial format options for card-based selection */
const SERIAL_FORMAT_OPTIONS: { id: SerialFormat; label: string; description: string }[] = [
  { id: "customer",  label: 'Format incl. "customer"',  description: "(DOM) YYMM | Customer (--) | Increments (0001)" },
  { id: "scannable", label: "Scannable Serial Format",   description: "(DOM) YYMM | Increments (0001)" },
  { id: "nfc",       label: "NFC TAG PACKING ID",        description: "(Prefix) SCAN | Increments (0001)" },
];

const LENGTH_UNITS: UnitOption[] = [
  { value: "m",  label: "m"  },
  { value: "cm", label: "cm" },
  { value: "ft", label: "ft" },
  { value: "in", label: "in" },
];

const SPLICE_OPTIONS: SelectOption[] = [
  { value: "none",      label: "No splice"  },
  { value: "one_end",   label: "One end"    },
  { value: "both_ends", label: "Both ends"  },
];

function productToDropdownItem(p: Product): SearchDropdownItem {
  return { id: p.id, title: p.name, subtitle: `${p.brand} · ${p.sku}`, image: p.image };
}

function findProduct(id: string): Product | undefined {
  return [...RECENT_PRODUCTS, ...GLOBAL_PRODUCTS].find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Flow steps — used by the Steps indicator at the top of each step's content
// ---------------------------------------------------------------------------
const FLOW_STEPS = [
  { label: "Source rope detail" },
  { label: "Cut rope details"   },
];

// ---------------------------------------------------------------------------
// Sidebar config
// ---------------------------------------------------------------------------
const SIDEBAR_SECTIONS = [
  {
    items: [
      { label: "Overview",          href: "/dashboard",                iconNodeId: "91:746"   as const },
      { label: "Team",              href: "/dashboard/team",           iconNodeId: "92:1154"  as const },
      { label: "Product Search",    href: "/dashboard/product-search", iconNodeId: "52:1245"  as const },
      { label: "Settings",          href: "/dashboard/settings",       iconNodeId: "46:2929"  as const },
      { label: "Scannable Updates", href: "/dashboard/updates",        iconNodeId: "2508:760" as const },
      { label: "Knowledge Base",    href: "/dashboard/knowledge",      iconNodeId: "91:739"   as const },
    ],
  },
  {
    title: "Manufacturers/Resellers",
    collapsible: true,
    items: [
      { label: "Products/SKUs", href: "/dashboard/products",      iconNodeId: "3628:9947" as const },
      { label: "Serialisation", href: "/dashboard/serialisation", iconNodeId: "94:554"    as const, active: true },
      { label: "Inspections",   href: "/dashboard/inspections",   iconNodeId: "92:1150"   as const },
      { label: "Checklists",    href: "/dashboard/checklists",    iconNodeId: "92:1270"   as const },
    ],
  },
  {
    title: "Equipment Owners",
    collapsible: true,
    items: [
      { label: "Inventory",    href: "/dashboard/inventory",    iconNodeId: "92:758"  as const },
      { label: "My inventory", href: "/dashboard/my-inventory", iconNodeId: "92:778"  as const },
      { label: "Multi-scan",   href: "/dashboard/multi-scan",   iconNodeId: "92:796"  as const },
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
  const [search,        setSearch]        = useState("");
  const [searchResults, setSearchResults] = useState<{ used: SearchDropdownItem[]; global: SearchDropdownItem[] } | null>(null);
  const [dropAbove,     setDropAbove]     = useState(false);
  const [selectedRope,  setSelectedRope]  = useState<Product | null>(null);
  const [hoveredId,     setHoveredId]     = useState<string | null>(null);
  const [sourceBatch,   setSourceBatch]   = useState("");
  const [sourceDom,     setSourceDom]     = useState("");

  // ── Step 2 state ─────────────────────────────────────────────────────────
  const [productMode,   setProductMode]         = useState<ProductMode | null>(null);
  const [selectedExistingProduct, setSelectedExistingProduct] = useState<string | null>(null);
  // "Create a new product" form fields
  const [newLength,     setNewLength]     = useState("");
  const [newLengthUnit, setNewLengthUnit] = useState("");
  const [newSplice,     setNewSplice]     = useState("");
  const [newPartNumber, setNewPartNumber] = useState("");
  const [newSkuName,    setNewSkuName]    = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [quantity,      setQuantity]      = useState("");
  const [serialFormat,  setSerialFormat]  = useState<SerialFormat>("customer");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [salesOrder,    setSalesOrder]    = useState("");
  const [customerRef,   setCustomerRef]   = useState("");
  const [cutBatch,      setCutBatch]      = useState("");
  const [cutDom,        setCutDom]        = useState("");

  // ── Refs ─────────────────────────────────────────────────────────────────
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const sourceDomInputRef  = useRef<HTMLInputElement>(null);
  const cutDomInputRef     = useRef<HTMLInputElement>(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const canProceed   = selectedRope !== null;
  const sourceActive = selectedRope !== null;

  // ── Outside-click: close dropdown ────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchResults(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Viewport flip: show dropdown above when too close to bottom ───────────
  useEffect(() => {
    if (searchResults !== null && searchContainerRef.current) {
      const rect            = searchContainerRef.current.getBoundingClientRect();
      const spaceBelow      = window.innerHeight - rect.bottom;
      const totalItems      = searchResults.used.length + searchResults.global.length;
      const estimatedHeight = totalItems * 72 + 80;
      setDropAbove(spaceBelow < estimatedHeight + 8);
    }
  }, [searchResults]);

  // ── Search handler ───────────────────────────────────────────────────────
  function runSearch(q: string) {
    const query = q.trim().toLowerCase();
    const filter = (list: Product[]) =>
      query
        ? list.filter((p) =>
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query),
          )
        : list;
    setSearchResults({
      used:   filter(RECENT_PRODUCTS).map(productToDropdownItem),
      global: filter(GLOBAL_PRODUCTS).map(productToDropdownItem),
    });
  }

  function handleDropdownSelect(item: SearchDropdownItem) {
    const product = findProduct(item.id);
    if (product) setSelectedRope(product);
    setSearch("");
    setSearchResults(null);
  }

  // ---------------------------------------------------------------------------
  // AppShell props
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
    userName:     "Danny Smith",
    userSubtitle: "real mf",
    userInitials: "SW",
    sections:     SIDEBAR_SECTIONS,
  };

  // ---------------------------------------------------------------------------
  // Shared text styles
  // ---------------------------------------------------------------------------
  const h3Style: React.CSSProperties = {
    fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4,
    fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4,
    color: tokens.color.fg.primary, margin: 0,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
    fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
    color: tokens.color.fg.support, margin: 0,
  };

  // ---------------------------------------------------------------------------
  // Step 1
  // ---------------------------------------------------------------------------
  const renderStep1 = () => {
    // Build dropdown sections — only include non-empty
    const dropdownSections = searchResults
      ? [
          ...(searchResults.used.length   > 0 ? [{ label: "Used products:",               items: searchResults.used   }] : []),
          ...(searchResults.global.length > 0 ? [{ label: "Products in global database:", items: searchResults.global }] : []),
        ]
      : [];

    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* Section header */}
        <div style={{
          background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.border}`,
          padding: tokens.spacing[6], flexShrink: 0,
        }}>
          <h2 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h3, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h3, color: tokens.color.fg.primary, margin: 0 }}>
            Create Serials for Cut Ropes
          </h2>
          <p style={{ ...bodyStyle, marginTop: tokens.spacing[1] }}>
            Convert a source rope into tracked cut lengths with individual serial numbers.
          </p>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: tokens.spacing[6], display: "flex", flexDirection: "column", gap: tokens.spacing[6] }}>

          {/* ── Step indicator ─────────────────────────────────────────────── */}
          <Steps steps={FLOW_STEPS} currentStep={step} variant="labeled" />

          {/* ── Select source rope ─────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <h3 style={h3Style}>Select source rope</h3>
            <p style={bodyStyle}>
              Search and select the original rope from Scannable database. This is the source material being cut.
            </p>
          </div>

          {selectedRope ? (
            /* ── Selected rope compact row — half width, uses ListViewItem ─── */
            <div style={{ width: "50%" }}>
              <ListViewItem
                imageUrl={selectedRope.image}
                title={selectedRope.name}
                subtitle={`${selectedRope.brand} · ${selectedRope.sku}`}
                showDivider={false}
                action={
                  <Button
                    variant="secondary"
                    label="Change"
                    onClick={() => { setSelectedRope(null); setSearch(""); setSearchResults(null); }}
                  />
                }
              />
            </div>
          ) : (
            /* ── Search + dropdown + grid ──────────────────────────────────── */
            <>
              {/* Search row with dropdown */}
              <div
                ref={searchContainerRef}
                style={{ position: "relative", width: "520px" }}
              >
                <div style={{ display: "flex", gap: tokens.spacing[2], alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="Search by SKU name or code"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        runSearch(e.target.value);
                      }}
                      onClear={() => { setSearch(""); setSearchResults(null); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")  runSearch(search);
                        if (e.key === "Escape") setSearchResults(null);
                      }}
                      leadingIcon={<SearchIcon />}
                    />
                  </div>
                  <Button
                    variant="primary"
                    label="Search"
                    onClick={() => runSearch(search)}
                  />
                </div>

                {/* Dropdown */}
                {searchResults !== null && (
                  <div style={{
                    position: "absolute",
                    ...(dropAbove
                      ? { bottom: "calc(100% + 4px)", top: "auto" }
                      : { top:    "calc(100% + 4px)", bottom: "auto" }),
                    left: 0, right: 0, zIndex: 30,
                  }}>
                    {dropdownSections.length > 0 ? (
                      <SearchDropdown
                        sections={dropdownSections}
                        onSelect={handleDropdownSelect}
                      />
                    ) : (
                      /* Empty state */
                      <div style={{
                        background: tokens.color.base.white,
                        border: `1px solid ${tokens.color.divider.border}`,
                        borderRadius: tokens.borderRadius.lg,
                        boxShadow: tokens.shadows.ringMd,
                        padding: `${tokens.spacing[4]} ${tokens.spacing[4]}`,
                        fontFamily: tokens.fontFamily.sans,
                        fontSize: tokens.fontSize.body,
                        color: tokens.color.fg.support,
                        textAlign: "center" as const,
                      }}>
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recent products grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
                <p style={bodyStyle}>Recent used products:</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: tokens.spacing[6] }}>
                  {RECENT_PRODUCTS.map((product) => {
                    // selectedRope is null in this branch — nothing is selected
                    const isSelected = false;
                    const isHovered  = hoveredId === product.id;

                    return (
                      <div
                        key={product.id}
                        onMouseEnter={() => setHoveredId(product.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedRope(isSelected ? null : product)}
                        style={{
                          display: "flex", alignItems: "center", gap: tokens.spacing[4],
                          padding: tokens.spacing[4], borderRadius: tokens.borderRadius.md,
                          border: isSelected
                            ? `1.5px solid ${tokens.color.bg.blue}`
                            : `1px solid ${tokens.color.divider.frame}`,
                          background: isSelected || isHovered
                            ? tokens.color.bg.lightBg
                            : tokens.color.base.white,
                          cursor: "pointer",
                          transition: "background 120ms ease, border-color 120ms ease",
                        }}
                      >
                        <ProductImg size={56} image={product.image} />

                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                          <span style={{
                            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
                            fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body,
                            color: tokens.color.fg.primary, whiteSpace: "nowrap" as const,
                            overflow: "hidden", textOverflow: "ellipsis",
                          }}>
                            {product.name}
                          </span>
                          <div style={{ display: "flex", gap: tokens.spacing[1], alignItems: "center" }}>
                            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, whiteSpace: "nowrap" as const }}>
                              {product.brand}
                            </span>
                            <div style={{ width: "1px", height: "12px", background: tokens.color.divider.frame }} />
                            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, whiteSpace: "nowrap" as const }}>
                              {product.sku}
                            </span>
                          </div>
                        </div>

                        {/* Select button — visibility held to prevent layout shift */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedRope(isSelected ? null : product); }}
                          style={{
                            flexShrink: 0, padding: `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
                            borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.color.divider.frame}`,
                            background: tokens.color.base.white, cursor: "pointer",
                            fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
                            fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body,
                            color: tokens.color.fg.primary, whiteSpace: "nowrap" as const,
                            visibility: (isHovered || isSelected) ? "visible" : "hidden",
                          }}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Source rope details ─────────────────────────────────────────── */}
          <div style={{
            borderTop: `1px solid ${tokens.color.divider.border}`, paddingTop: tokens.spacing[6],
            opacity: sourceActive ? 1 : 0.3, transition: "opacity 200ms ease",
            display: "flex", flexDirection: "column", gap: tokens.spacing[2],
          }}>
            <h3 style={h3Style}>Source rope details</h3>
            <p style={bodyStyle}>
              Enter traceability details for the original rope. These values will be linked to all cut rope items created from it.
            </p>
          </div>

          <div style={{
            display: "flex", alignItems: "flex-start", gap: tokens.spacing[6],
            opacity: sourceActive ? 1 : 0.3, transition: "opacity 200ms ease",
            pointerEvents: sourceActive ? "auto" : "none",
          }}>
            <div style={{ flex: 1 }}>
              <ScanInput
                label="Source batch number"
                placeholder="e.g. SRC-2024-00142"
                value={sourceBatch}
                onChange={(e) => setSourceBatch(e.target.value)}
                disabled={!sourceActive}
              />
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <Input
                label="Date of manufacture"
                placeholder="Select date"
                value={sourceDom}
                onChange={(e) => setSourceDom(e.target.value)}
                disabled={!sourceActive}
                tailingIcon={
                  <button
                    type="button"
                    onClick={() =>
                      (sourceDomInputRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()
                    }
                    disabled={!sourceActive}
                    style={{ background: "none", border: "none", cursor: sourceActive ? "pointer" : "not-allowed", padding: 0, display: "flex", alignItems: "center" }}
                    aria-label="Open date picker"
                  >
                    <CalendarIcon />
                  </button>
                }
              />
              {/* Hidden native date input — provides the OS date picker */}
              <input
                ref={sourceDomInputRef}
                type="date"
                value={sourceDom}
                onChange={(e) => setSourceDom(e.target.value)}
                style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
                tabIndex={-1}
                aria-hidden
              />
            </div>
          </div>

        </div>{/* end scrollable body */}

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${tokens.color.divider.border}`,
          padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
          display: "flex", justifyContent: "flex-end", gap: tokens.spacing[2],
          background: tokens.color.base.white, flexShrink: 0,
        }}>
          <Button variant="secondary" label="Exit" onClick={() => router.push("/dashboard/serialisation")} />
          <Button variant={canProceed ? "primary" : "disabled"} label="Next" onClick={() => setStep(2)} />
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Step 2
  // ---------------------------------------------------------------------------
  const renderStep2 = () => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* Section header */}
      <div style={{
        background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.border}`,
        padding: tokens.spacing[6], flexShrink: 0,
      }}>
        <h2 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h3, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h3, color: tokens.color.fg.primary, margin: 0 }}>
          Create Serials for Cut Ropes
        </h2>
        <p style={{ ...bodyStyle, marginTop: tokens.spacing[1] }}>
          Convert a source rope into tracked cut lengths with individual serial numbers.
        </p>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: tokens.spacing[6], display: "flex", flexDirection: "column", gap: tokens.spacing[6] }}>

        {/* ── Step indicator ─────────────────────────────────────────────── */}
        <Steps steps={FLOW_STEPS} currentStep={step} variant="labeled" />

        {/* ── Assign cut ropes to product ─────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
          <h3 style={h3Style}>Assign cut ropes to product</h3>
          <p style={bodyStyle}>
            Set the product details for the rope you are creating from this cut. You can select an existing product or create a new one.
          </p>
        </div>

        {/* Product selection cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>

          {/* ── Card 1: Select from existing product ─────────────────────── */}
          <div
            onClick={() => setProductMode("existing")}
            style={{
              width:        "520px",
              border:       productMode === "existing"
                ? `2px solid ${tokens.color.divider.blue}`
                : `1px solid ${tokens.color.divider.frame}`,
              borderRadius: tokens.borderRadius.md,
              padding:      tokens.spacing[4],
              display:      "flex",
              flexDirection:"column",
              gap:          tokens.spacing[2],
              cursor:       "pointer",
              boxSizing:    "border-box" as const,
            }}
          >
            {/* Radio header row */}
            <div style={{ display: "flex", gap: tokens.spacing[2], alignItems: "center" }}>
              <RadioIndicator checked={productMode === "existing"} />
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary }}>
                Select from existing product
              </span>
            </div>

            {/* Product list — only visible when this card is active */}
            {productMode === "existing" && (
              <div style={{ paddingLeft: tokens.spacing[6], display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
                {CUT_ROPE_PRODUCTS.map((p, idx) => {
                  const isLast    = idx === CUT_ROPE_PRODUCTS.length - 1;
                  const isChecked = selectedExistingProduct === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedExistingProduct(p.id); }}
                      style={{
                        display:       "flex",
                        gap:           tokens.spacing[4],
                        alignItems:    "center",
                        paddingBottom: !isLast ? tokens.spacing[2] : 0,
                        borderBottom:  !isLast ? `1px solid ${tokens.color.divider.border}` : "none",
                        cursor:        "pointer",
                      }}
                    >
                      <RadioIndicator checked={isChecked} />
                      <div style={{ display: "flex", gap: tokens.spacing[4], alignItems: "center", flex: 1, paddingTop: tokens.spacing[2], paddingBottom: tokens.spacing[2] }}>
                        <ProductImg size={56} image={p.image} />
                        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                          <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary }}>
                            {p.name}
                          </span>
                          <div style={{ display: "flex", gap: tokens.spacing[1], alignItems: "center" }}>
                            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support }}>
                              {p.brand}
                            </span>
                            <div style={{ width: "1px", height: "12px", background: tokens.color.divider.frame }} />
                            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support }}>
                              {p.sku}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Card 2: Create a new product ──────────────────────────────── */}
          <div
            onClick={() => setProductMode("new")}
            style={{
              width:        "520px",
              border:       productMode === "new"
                ? `2px solid ${tokens.color.divider.blue}`
                : `1px solid ${tokens.color.divider.frame}`,
              borderRadius: tokens.borderRadius.md,
              padding:      tokens.spacing[4],
              cursor:       "pointer",
              boxSizing:    "border-box" as const,
              display:      "flex",
              flexDirection:"column",
              gap:          tokens.spacing[6],   // 24px between header and form grid
            }}
          >
            {/* Radio header */}
            <div style={{ display: "flex", gap: tokens.spacing[2], alignItems: "flex-start" }}>
              <div style={{ paddingTop: "2px", flexShrink: 0 }}>
                <RadioIndicator checked={productMode === "new"} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary }}>
                  Create a new product
                </span>
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.support }}>
                  This product will be available in your catalogue after creation.
                </span>
              </div>
            </div>

            {/* Expanded form — only visible when selected */}
            {productMode === "new" && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.spacing[4] }}
              >
                <div style={{ minWidth: 0 }}>
                  <CompositeInput
                    label="Length"
                    placeholder="Enter..."
                    value={newLength}
                    onChange={setNewLength}
                    unitOptions={LENGTH_UNITS}
                    unitValue={newLengthUnit}
                    onUnitChange={setNewLengthUnit}
                    unitPlaceholder="select unit"
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <SelectInput
                    label="Splice"
                    placeholder="Select..."
                    options={SPLICE_OPTIONS}
                    value={newSplice}
                    onChange={setNewSplice}
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <Input
                    label="Part number"
                    placeholder=""
                    value={newPartNumber}
                    onChange={(e) => setNewPartNumber(e.target.value)}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <Input
                    label="SKU name"
                    placeholder=""
                    value={newSkuName}
                    onChange={(e) => setNewSkuName(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── Cut rope details ─────────────────────────────────────────────── */}
        <div style={{ borderTop: `1px solid ${tokens.color.divider.border}`, paddingTop: tokens.spacing[6], display: "flex", alignItems: "center" }}>
          <h3 style={{ ...h3Style, flex: 1 }}>Cut rope details</h3>
        </div>

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

        {/* Serial format — card-based selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2], width: "400px" }}>
          <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary, margin: 0 }}>
            Select a serial format
          </p>
          {SERIAL_FORMAT_OPTIONS.map((fmt) => (
            <div
              key={fmt.id}
              onClick={() => setSerialFormat(fmt.id as SerialFormat)}
              style={{
                border:       serialFormat === fmt.id
                  ? `2px solid ${tokens.color.divider.blue}`
                  : `1px solid ${tokens.color.divider.frame}`,
                borderRadius: tokens.borderRadius.md,
                padding:      tokens.spacing[4],
                cursor:       "pointer",
                display:      "flex",
                gap:          tokens.spacing[2],
                alignItems:   "flex-start",
                boxSizing:    "border-box" as const,
              }}
            >
              <div style={{ paddingTop: "2px", flexShrink: 0 }}>
                <RadioIndicator checked={serialFormat === fmt.id} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary }}>
                  {fmt.label}
                </span>
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.support }}>
                  {fmt.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cut rope fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: tokens.spacing[6] }}>
          <Input label="Purchase order"       placeholder="e.g. PO-2024-001"    value={purchaseOrder} onChange={(e) => setPurchaseOrder(e.target.value)} />
          <Input label="Sales order number"   placeholder="e.g. SO-2024-001"    value={salesOrder}    onChange={(e) => setSalesOrder(e.target.value)} />
          <Input label="Customer reference"   placeholder="e.g. CUST-REF-001"   value={customerRef}   onChange={(e) => setCustomerRef(e.target.value)} />
          <Input label="Cut rope batch number" placeholder="e.g. CUT-2024-00142" value={cutBatch}      onChange={(e) => setCutBatch(e.target.value)} />
          <div style={{ position: "relative" }}>
            <Input
              label="Date of manufacture"
              placeholder="Select date"
              value={cutDom}
              onChange={(e) => setCutDom(e.target.value)}
              tailingIcon={
                <button
                  type="button"
                  onClick={() =>
                    (cutDomInputRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.()
                  }
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                  aria-label="Open date picker"
                >
                  <CalendarIcon />
                </button>
              }
            />
            <input
              ref={cutDomInputRef}
              type="date"
              value={cutDom}
              onChange={(e) => setCutDom(e.target.value)}
              style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
              tabIndex={-1}
              aria-hidden
            />
          </div>
        </div>

      </div>{/* end scrollable body */}

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${tokens.color.divider.border}`,
        padding: `${tokens.spacing[4]} ${tokens.spacing[6]}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: tokens.color.base.white, flexShrink: 0,
      }}>
        <Button
          variant="tertiary"
          withIcon="heading"
          icon={<ChevronLeftIcon />}
          label="Back"
          onClick={() => setStep(1)}
        />
        <div style={{ display: "flex", gap: tokens.spacing[2] }}>
          <Button variant="secondary" label="Exit"                   onClick={() => router.push("/dashboard/serialisation")} />
          <Button variant="primary"   label="Create Cut Rope Serials" onClick={() => {
            const today = new Date();
            const dateLabel = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            localStorage.setItem("newSerialCreated", JSON.stringify({
              date:          dateLabel,
              source:        "Scannable (cut rope)",
              format:        SERIAL_FORMAT_OPTIONS.find((f) => f.id === serialFormat)?.label ?? "",
              salesOrder,
              purchaseOrder,
              batch:         cutBatch,
              dom:           dateLabel,
            }));
            router.push("/dashboard/serialisation");
          }} />
        </div>
      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AppShell appBar={appBarProps} sidebar={sidebarProps}>
      <div style={{ padding: tokens.spacing[4], height: "100%", boxSizing: "border-box" }}>
        <div style={{
          background: tokens.color.base.white, borderRadius: tokens.borderRadius["2xl"],
          boxShadow: tokens.shadows.ringMd, height: "100%",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </AppShell>
  );
}
