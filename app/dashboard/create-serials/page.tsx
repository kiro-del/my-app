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
import { RadioButton } from "@/components/ui/Radio";
import { ListViewItem } from "@/components/ui/ListViewItem";
import { Badge } from "@/components/ui/Badge";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

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

// Search icon fallback (shown until Figma icon loads)
const SearchIconFallback = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="8.5" cy="8.5" r="5.5" stroke={tokens.color.fg.disabled} strokeWidth="1.5"/>
    <path d="M13 13l3.5 3.5" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

function TrashIcon({ url }: { url?: string }) {
  if (url) return <img src={url} width={24} height={24} alt="" aria-hidden style={{ display: "block" }} />;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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

const MOCK_SEARCH_RESULTS = [
  { id: "p1", name: "Ultra O Locksafe - A327",   subtitle: "DMM | A327MG",  image: "/docs/product-a327.png"   },
  { id: "p2", name: "Ultra O Locksafe (Orange)", subtitle: "DMM | A327OR",  image: "/docs/product-a327or.png" },
];

// ---------------------------------------------------------------------------
// SerialFormatRow
// ---------------------------------------------------------------------------
function SerialFormatRow({
  format,
  selected,
  onSelect,
  isLast,
}: {
  format: typeof SERIAL_FORMATS[0];
  selected: boolean;
  onSelect: () => void;
  isLast?: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "12px 24px",
        gap:            "48px",
        borderBottom:   isLast ? "none" : `1px solid ${tokens.color.divider.frame}`,
        cursor:         "pointer",
        background:     selected ? tokens.color.bg.lightBg : tokens.color.base.white,
        transition:     "background 150ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <RadioButton checked={selected} onChange={onSelect} />
        <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary }}>
          {format.name}
        </span>
      </div>
      <div style={{ display: "flex", gap: "48px", flexShrink: 0 }}>
        {format.stats.map((stat) => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Badge label={stat.label} color="green" />
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.support }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SectionLabel
// ---------------------------------------------------------------------------
function SectionLabel({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2 style={{ fontFamily: tokens.fontFamily.sans, fontSize: "16px", fontWeight: tokens.fontWeight.semiBold, lineHeight: "22px", color: tokens.color.fg.primary, margin: 0 }}>
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
  const [searchQuery,      setSearchQuery]      = useState("");
  const [searchOpen,       setSearchOpen]       = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    { id: string; name: string; subtitle: string; image?: string; quantity: string }[]
  >([]);
  const [lastAddedId,  setLastAddedId]  = useState<string | null>(null);

  const dateInputRef   = useRef<HTMLInputElement>(null);
  const quantityRefs   = useRef<Record<string, HTMLInputElement | null>>({});

  // Auto-focus quantity input when a product is added
  useEffect(() => {
    if (lastAddedId && quantityRefs.current[lastAddedId]) {
      quantityRefs.current[lastAddedId]?.focus();
    }
  }, [lastAddedId, selectedProducts.length]);

  const searchResults = searchQuery.trim()
    ? MOCK_SEARCH_RESULTS.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  function addProduct(p: { id: string; name: string; subtitle: string; image?: string }) {
    if (!selectedProducts.find((sp) => sp.id === p.id)) {
      setSelectedProducts((prev) => [...prev, { ...p, quantity: "" }]);
      setLastAddedId(p.id);
    }
    setSearchOpen(false);
    setSearchQuery("");
  }

  function removeProduct(id: string) {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function setQuantity(id: string, qty: string) {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)),
    );
  }

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
          <div style={{ padding: "24px" }}>

            {/* Page title */}
            <h1
              style={{
                fontFamily:   tokens.fontFamily.sans,
                fontSize:     "18px",
                fontWeight:   tokens.fontWeight.semiBold,
                lineHeight:   "24px",
                color:        tokens.color.fg.primary,
                margin:       "0 0 24px",
                paddingBottom:"24px",
                borderBottom: `1px solid ${tokens.color.divider.frame}`,
              }}
            >
              Create Serials
            </h1>

            {/* ── Serial Details ──────────────────────────────────────── */}
            <section>
              <SectionLabel title="Serial Details" />
              <p
                style={{
                  fontFamily: tokens.fontFamily.sans,
                  fontSize:   tokens.fontSize.body,
                  fontWeight: tokens.fontWeight.medium,
                  lineHeight: tokens.lineHeight.body,
                  color:      tokens.color.fg.primary,
                  margin:     "0 0 8px",
                }}
              >
                Select a Serial Format to Use
              </p>
              <div
                style={{
                  border:       `1px solid ${tokens.color.divider.frame}`,
                  borderRadius: tokens.borderRadius.lg,
                  overflow:     "hidden",
                  background:   tokens.color.base.white,
                }}
              >
                {SERIAL_FORMATS.map((fmt, i) => (
                  <SerialFormatRow
                    key={fmt.id}
                    format={fmt}
                    selected={selectedFormat === fmt.id}
                    onSelect={() => setSelectedFormat(fmt.id)}
                    isLast={i === SERIAL_FORMATS.length - 1}
                  />
                ))}
              </div>
            </section>

            <Divider />

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

            <Divider />

            {/* ── Apply to Product ────────────────────────────────────── */}
            <section>
              <SectionLabel
                title="Apply to Product"
                subtitle="Add as many products as needed."
              />

              {/*
               * Half-width constraint — matches the form columns above.
               * The search row (input + button) and the selected-products list
               * are all contained in this 50%-wide wrapper.
               */}
              <div style={{ width: "50%", minWidth: 0 }}>

                {/* Search row — relative so the dropdown anchors to it */}
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", position: "relative" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Input
                      placeholder="Search by SKU name or code"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                      onFocus={() => setSearchOpen(true)}
                      leadingIcon={
                        icons[SIDEBAR_ICON_IDS.search] ? (
                          <span
                            style={{
                              display:            "inline-block",
                              width:              "20px",
                              height:             "20px",
                              flexShrink:         0,
                              background:         tokens.color.fg.disabled,
                              maskImage:          `url(${icons[SIDEBAR_ICON_IDS.search]})`,
                              maskSize:           "contain",
                              maskRepeat:         "no-repeat",
                              maskPosition:       "center",
                              WebkitMaskImage:    `url(${icons[SIDEBAR_ICON_IDS.search]})`,
                              WebkitMaskSize:     "contain",
                              WebkitMaskRepeat:   "no-repeat",
                              WebkitMaskPosition: "center",
                            } as React.CSSProperties}
                            aria-hidden
                          />
                        ) : (
                          <SearchIconFallback />
                        )
                      }
                      onKeyDown={(e) => { if (e.key === "Escape") setSearchOpen(false); }}
                    />
                  </div>
                  <Button
                    label="Search"
                    variant="primary"
                    onClick={() => setSearchOpen(true)}
                  />

                  {/* Dropdown — spans the full search-row width */}
                  {searchOpen && searchResults.length > 0 && (
                    <div
                      style={{
                        position:     "absolute",
                        bottom:       "calc(100% + 4px)",
                        left:         0,
                        right:        0,
                        background:   tokens.color.base.white,
                        border:       `1px solid ${tokens.color.divider.frame}`,
                        borderRadius: tokens.borderRadius.lg,
                        boxShadow:    tokens.shadows.md,
                        zIndex:       50,
                        overflow:     "hidden",
                      }}
                    >
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => addProduct(result)}
                          style={{
                            display:     "block",
                            width:       "100%",
                            background:  "none",
                            border:      "none",
                            borderBottom:`1px solid ${tokens.color.divider.border}`,
                            cursor:      "pointer",
                            padding:     0,
                            textAlign:   "left" as const,
                          }}
                        >
                          <ListViewItem title={result.name} subtitle={result.subtitle} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected products */}
                {selectedProducts.length > 0 && (
                  <div style={{ marginTop: "24px" }}>
                    <p
                      style={{
                        fontFamily:  tokens.fontFamily.sans,
                        fontSize:    tokens.fontSize.body,
                        fontWeight:  tokens.fontWeight.regular,
                        lineHeight:  tokens.lineHeight.body,
                        color:       tokens.color.fg.support,
                        margin:      "0 0 4px",
                      }}
                    >
                      Selected products
                    </p>

                    {selectedProducts.map((product, idx) => (
                      <div
                        key={product.id}
                        style={{
                          display:      "flex",
                          alignItems:   "flex-end",
                          gap:          "12px",
                          padding:      "12px 0",
                          borderBottom: idx === selectedProducts.length - 1 ? "none" : `1px solid ${tokens.color.divider.border}`,
                        }}
                      >
                        {/* Thumbnail + name — fills available space */}
                        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width:          "40px",
                              height:         "40px",
                              flexShrink:     0,
                              border:         `1px solid ${tokens.color.divider.border}`,
                              borderRadius:   tokens.borderRadius.md,
                              display:        "flex",
                              alignItems:     "center",
                              justifyContent: "center",
                              background:     tokens.color.bg.lightBg,
                              overflow:       "hidden",
                            }}
                          >
                            {product.image ? (
                              <img src={product.image} width={40} height={40} alt="" style={{ objectFit: "cover", display: "block" }} />
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="4" y="3" width="12" height="14" rx="2" stroke={tokens.color.fg.disabled} strokeWidth="1.2"/>
                              </svg>
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                              {product.name}
                            </div>
                            <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: "12px", fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                              {product.subtitle}
                            </div>
                          </div>
                        </div>

                        {/* Quantity input */}
                        <div style={{ width: "128px", flexShrink: 0 }}>
                          <Input
                            label="Quantity of serials"
                            placeholder="0"
                            type="number"
                            value={product.quantity}
                            onChange={(e) => setQuantity(product.id, e.target.value)}
                            ref={(el) => { quantityRefs.current[product.id] = el; }}
                          />
                        </div>

                        {/* Remove */}
                        <Button
                          variant="icon framed"
                          icon={<TrashIcon url={icons[BIN_ICON_ID]} />}
                          onClick={() => removeProduct(product.id)}
                          aria-label={`Remove ${product.name}`}
                          style={{ flexShrink: 0 }}
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>{/* end half-width wrapper */}
            </section>

          </div>{/* end inner padding */}

          {/* Card footer */}
          <div
            style={{
              display:        "flex",
              justifyContent: "flex-end",
              alignItems:     "center",
              padding:        "16px 24px",
              borderTop:      `1px solid ${tokens.color.divider.frame}`,
            }}
          >
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
