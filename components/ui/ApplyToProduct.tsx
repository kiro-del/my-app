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
// ProductThumbnail — 40 × 40 px, lightBg, 1 px border, rect SVG fallback
// Matches create-serials exactly.
// ---------------------------------------------------------------------------
function ProductThumbnail({ image }: { image?: string }) {
  return (
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
      {image ? (
        <img src={image} width={40} height={40} alt="" style={{ objectFit: "cover", display: "block" }} />
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="4" y="3" width="12" height="14" rx="2" stroke={tokens.color.fg.disabled} strokeWidth="1.2"/>
        </svg>
      )}
    </div>
  );
}

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

  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<CatalogueProduct[] | null>(null);

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
    padding:      "0 12px",
    gap:          "8px",
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
    <div>
      {/* ── Search row ─────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{ display: "flex", gap: "12px", alignItems: "flex-end", position: "relative" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
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
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          style={{
            height:       "40px",
            padding:      "0 16px",
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

        {/* ── Dropdown ───────────────────────────────────────────────────── */}
        {searchResults !== null && (
          <div
            style={{
              position:     "absolute",
              top:          "calc(100% + 4px)",
              left:         0,
              right:        0,
              background:   tokens.color.base.white,
              border:       `1px solid ${tokens.color.divider.border}`,
              borderRadius: tokens.borderRadius.md,
              boxShadow:    tokens.shadows.ringMd,
              zIndex:       30,
              overflow:     "hidden",
            }}
          >
            <div
              style={{
                padding:      "8px 12px",
                fontFamily:   tokens.fontFamily.sans,
                fontSize:     tokens.fontSize.bodySmall,
                fontWeight:   tokens.fontWeight.regular,
                color:        tokens.color.fg.support,
                borderBottom: `1px solid ${tokens.color.divider.border}`,
              }}
            >
              {searchResults.length} product{searchResults.length !== 1 ? "s" : ""}
            </div>

            {searchResults.length === 0 ? (
              <div style={{ padding: "16px 12px", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support, textAlign: "center" as const }}>
                No products found
              </div>
            ) : (
              searchResults.map((product, idx) => (
                <DropdownRow
                  key={product.id}
                  product={product}
                  isLast={idx === searchResults.length - 1}
                  onSelect={() => selectProduct(product)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Selected Products ──────────────────────────────────────────────── */}
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
// DropdownRow
// ---------------------------------------------------------------------------
function DropdownRow({
  product,
  isLast,
  onSelect,
}: {
  product:  CatalogueProduct;
  isLast:   boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="option"
      aria-selected={false}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "12px",
        padding:      "8px 12px",
        cursor:       "pointer",
        background:   hovered ? tokens.color.tint.blue : "transparent",
        borderBottom: isLast ? "none" : `1px solid ${tokens.color.divider.border}`,
        transition:   "background 100ms ease",
      }}
    >
      <ProductThumbnail image={product.image} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          {product.name}
        </div>
        <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          {product.sku}
        </div>
      </div>
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
        alignItems:   "flex-end",
        gap:          "12px",
        padding:      "12px 0",
        borderBottom: isLast ? "none" : `1px solid ${tokens.color.divider.border}`,
      }}
    >
      {/* Thumbnail + name/sku — flex:1 fills available space */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "12px" }}>
        <ProductThumbnail image={product.image} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
            {product.name}
          </div>
          <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: "12px", fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
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
