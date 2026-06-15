"use client";

// components/ui/ApplyToProduct.tsx
// Reusable "Apply to Product" section — search, select, and quantify products.
// Used by: create-serials/page.tsx, capture-serials/page.tsx
//
// Figma: fGNvex4MPWovOPAc9u7pC0
//   Search state:   3153:119972
//   Selected state: 3153:119998
//   Full frame:     2914:6231

import React, { useState, useRef, useEffect } from "react";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductImg } from "@/components/ui/ProductImg";
import { SearchDropdown, type SearchDropdownItem } from "@/components/ui/SearchDropdown";

// Search icon — Scannable Design System node 52:1245
const SEARCH_ICON_ID = "52:1245";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface CatalogueProduct {
  id: string;
  name: string;
  /** "Brand | SKU" format e.g. "DMM | A327MG" */
  sku: string;
  image?: string;
}

export interface SelectedProductItem extends CatalogueProduct {
  /** Number of serials requested / to capture for this product */
  quantity: number;
}

export interface ApplyToProductProps {
  /** Full searchable catalogue — component filters out already-selected items */
  catalogue: CatalogueProduct[];
  /** Controlled list of selected products with quantities */
  selectedProducts: SelectedProductItem[];
  /** Called whenever selected products or quantities change */
  onProductsChange: (products: SelectedProductItem[]) => void;
  /** URL of the bin/trash icon from useFigmaIcons (node 49:967) */
  binIconUrl?: string;
  /** Quantity assigned when a product is first added. Default: 0 */
  defaultQuantity?: number;
  /** Label above the quantity input. Default: "Quantity of serials" */
  quantityLabel?: string;
}

// ---------------------------------------------------------------------------
// Masked icon helper — renders a Figma URL icon tinted to fg.disabled
// ---------------------------------------------------------------------------
function MaskedIcon({ url, size = 20 }: { url: string; size?: number }) {
  return (
    <span
      style={{
        display:            "inline-block",
        width:              `${size}px`,
        height:             `${size}px`,
        flexShrink:         0,
        background:         tokens.color.fg.disabled,
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

const SearchIconFallback = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="6.5" cy="6.5" r="4.5" stroke={tokens.color.fg.disabled} strokeWidth="1.3" />
    <path d="M10 10l3 3" stroke={tokens.color.fg.disabled} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// TrashRedIcon — fallback until binIconUrl loads
// ---------------------------------------------------------------------------
const TrashRedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke={tokens.color.fg.red}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


// ---------------------------------------------------------------------------
// ApplyToProduct
// ---------------------------------------------------------------------------
export function ApplyToProduct({
  catalogue,
  selectedProducts,
  onProductsChange,
  binIconUrl,
  defaultQuantity = 0,
  quantityLabel   = "Quantity of serials",
}: ApplyToProductProps) {
  // Search icon — module-level cache avoids duplicate API calls.
  const iconUrls      = useFigmaIcons([SEARCH_ICON_ID]);
  const searchIconUrl = iconUrls[SEARCH_ICON_ID];

  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchFocused,  setSearchFocused]  = useState(false);
  const [searchResults,  setSearchResults]  = useState<CatalogueProduct[] | null>(null);
  const [dropAbove,      setDropAbove]      = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchResults(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Flip dropdown above when too close to the bottom of the viewport
  useEffect(() => {
    if (searchResults !== null && containerRef.current) {
      const rect            = containerRef.current.getBoundingClientRect();
      const spaceBelow      = window.innerHeight - rect.bottom;
      const estimatedHeight = (searchResults.length * 64) + 40; // rows + header
      setDropAbove(spaceBelow < estimatedHeight + 8);
    }
  }, [searchResults]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  function handleSearch() {
    const q      = searchQuery.trim().toLowerCase();
    const already = new Set(selectedProducts.map((p) => p.id));
    const results = q
      ? catalogue.filter(
          (p) =>
            !already.has(p.id) &&
            (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)),
        )
      : catalogue.filter((p) => !already.has(p.id));
    setSearchResults(results);
  }

  function selectProduct(product: CatalogueProduct) {
    onProductsChange([...selectedProducts, { ...product, quantity: defaultQuantity }]);
    setSearchQuery("");
    setSearchResults(null);
    setSearchFocused(false);
  }

  function removeProduct(id: string) {
    onProductsChange(selectedProducts.filter((p) => p.id !== id));
  }

  function updateQuantity(id: string, raw: string) {
    const qty = parseInt(raw, 10);
    onProductsChange(
      selectedProducts.map((p) =>
        p.id === id ? { ...p, quantity: isNaN(qty) ? 0 : Math.max(0, qty) } : p,
      ),
    );
  }

  // Search input border: 1 px frame idle → 2 px indigo when focused or open
  const searchActive = searchFocused || searchResults !== null;

  const searchInputWrapStyle: React.CSSProperties = {
    position:     "relative",
    display:      "flex",
    alignItems:   "center",
    height:       "40px",
    padding:      `0 ${tokens.spacing[3]}`,
    gap:          tokens.spacing[2],
    border:       searchActive
      ? `2px solid ${tokens.color.divider.blue}`
      : `1px solid ${tokens.color.divider.frame}`,
    borderRadius: tokens.borderRadius.md,
    background:   tokens.color.base.white,
    boxSizing:    "border-box",
    transition:   "border-color 150ms ease",
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[6] }}>
      {/* ── Search row ─────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ display: "flex", gap: tokens.spacing[3], alignItems: "flex-end" }}
      >
        {/* Input — position:relative so dropdown anchors to its width */}
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          <div style={searchInputWrapStyle}>
            {searchIconUrl ? <MaskedIcon url={searchIconUrl} size={20} /> : <SearchIconFallback />}
            <input
              type="text"
              placeholder="Search by SKU name or code"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (searchResults !== null) setSearchResults(null);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter")  handleSearch();
                if (e.key === "Escape") setSearchResults(null);
              }}
              style={{
                flex:       1,
                border:     "none",
                outline:    "none",
                fontFamily: tokens.fontFamily.sans,
                fontSize:   tokens.fontSize.body,
                fontWeight: tokens.fontWeight.regular,
                color:      tokens.color.fg.primary,
                background: "transparent",
                minWidth:   0,
              }}
            />
          </div>

          {/* ── Dropdown — same width as input ─────────────────────────── */}
          {searchResults !== null && (
            <div
              style={{
                position: "absolute",
                ...(dropAbove
                  ? { bottom: "calc(100% + 4px)", top: "auto" }
                  : { top:    "calc(100% + 4px)", bottom: "auto" }),
                left:    0,
                right:   0,
                zIndex:  30,
              }}
            >
              {searchResults.length === 0 ? (
                <div
                  style={{
                    background:   tokens.color.base.white,
                    border:       `1px solid ${tokens.color.divider.border}`,
                    borderRadius: tokens.borderRadius.lg,
                    boxShadow:    tokens.shadows.ringMd,
                    padding:      `${tokens.spacing[4]} ${tokens.spacing[3]}`,
                    fontFamily:   tokens.fontFamily.sans,
                    fontSize:     tokens.fontSize.body,
                    color:        tokens.color.fg.support,
                    textAlign:    "center" as const,
                  }}
                >
                  No products found
                </div>
              ) : (
                <SearchDropdown
                  sections={[{
                    items: searchResults.map((p) => ({
                      id:       p.id,
                      title:    p.name,
                      subtitle: p.sku,
                      image:    p.image,
                    })),
                  }]}
                  onSelect={(item: SearchDropdownItem) => {
                    const product = catalogue.find((p) => p.id === item.id);
                    if (product) selectProduct(product);
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          style={{
            height:       "40px",
            padding:      `0 ${tokens.spacing[4]}`,
            background:   tokens.color.brand.lime,
            border:       `1px solid ${tokens.color.divider.lime}`,
            borderRadius: tokens.borderRadius.md,
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.body,
            fontWeight:   tokens.fontWeight.medium,
            color:        tokens.color.fg.primary,
            cursor:       "pointer",
            flexShrink:   0,
            whiteSpace:   "nowrap" as const,
          }}
        >
          Search
        </button>
      </div>

      {/* ── Selected Products ──────────────────────────────────────────────── */}
      {selectedProducts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
          <p
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,
              fontWeight:  tokens.fontWeight.regular,
              lineHeight:  tokens.lineHeight.body,
              color:       tokens.color.fg.support,
              margin:      0,
            }}
          >
            Selected products
          </p>

          {selectedProducts.map((product, idx) => (
            <SelectedRow
              key={product.id}
              product={product}
              isLast={idx === selectedProducts.length - 1}
              quantityLabel={quantityLabel}
              binIconUrl={binIconUrl}
              onRemove={() => removeProduct(product.id)}
              onQuantityChange={(v) => updateQuantity(product.id, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SelectedRow — matches create-serials layout exactly
// ---------------------------------------------------------------------------
function SelectedRow({
  product,
  isLast,
  quantityLabel,
  binIconUrl,
  onRemove,
  onQuantityChange,
}: {
  product:          SelectedProductItem;
  isLast:           boolean;
  quantityLabel:    string;
  binIconUrl?:      string;
  onRemove:         () => void;
  onQuantityChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display:      "flex",
        alignItems:    "flex-end",
        gap:           tokens.spacing[4],   // 16px — Figma gap-4
        paddingTop:    0,
        paddingBottom: tokens.spacing[4],   // 16px — Figma pb-4, no top padding
        borderBottom:  isLast ? "none" : `1px solid ${tokens.color.divider.border}`,
      }}
    >
      {/* Thumbnail + name/sku — flex:1 fills available space */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: tokens.spacing[3] }}>
        <ProductImg size={40} image={product.image} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
            {product.name}
          </div>
          <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
            {product.sku}
          </div>
        </div>
      </div>

      {/* Quantity — uses Input component to match create-serials */}
      <div style={{ width: "128px", flexShrink: 0 }}>
        <Input
          label={quantityLabel}
          placeholder="0"
          type="number"
          value={product.quantity === 0 ? "" : String(product.quantity)}
          onChange={(e) => onQuantityChange(e.target.value)}
        />
      </div>

      {/* Remove button */}
      <Button
        variant="icon framed"
        icon={
          binIconUrl
            ? <img src={binIconUrl} width={24} height={24} alt="" aria-hidden style={{ display: "block" }} />
            : <TrashRedIcon />
        }
        onClick={onRemove}
        aria-label={`Remove ${product.name}`}
        style={{ flexShrink: 0 }}
      />
    </div>
  );
}

export default ApplyToProduct;
