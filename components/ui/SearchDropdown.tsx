"use client";

// components/ui/SearchDropdown.tsx
// Reusable search-result dropdown — renders product rows using ListViewItem.
// Supports two layout variants (Figma: fGNvex4MPWovOPAc9u7pC0):
//   Flat      (node 3250:19886) — single section, no label → "N products:" count header
//   Sectioned (node 3250:19845) — multiple named sections separated by labelled headers
//
// Items are always rendered via <ListViewItem> so callers get all its variants
// (2-line, 3-line with serialRef, chip, action) for free.

import React, { useState } from "react";
import tokens from "@/styles/design-tokens";
import { ListViewItem, ListViewChip } from "@/components/ui/ListViewItem";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SearchDropdownItem {
  id:         string;
  /** Primary label (title) */
  title:      string;
  /**
   * Secondary line — passed directly to ListViewItem as `subtitle`.
   * Use "Brand · SKU" format to get the 1px divider separator automatically.
   */
  subtitle?:  string;
  /** Product image URL — falls back to camera placeholder */
  image?:     string;
  /** Optional third underlined line (e.g. serial reference) */
  serialRef?: string;
  /** Optional inline badge after the title */
  chip?:      ListViewChip;
}

export interface SearchDropdownSection {
  /**
   * Section header label shown above the section's items.
   * - Omit (or leave falsy) on a single section → flat "N products:" count header.
   * - Provide on each section → named section headers (sectioned variant).
   */
  label?: string;
  items:  SearchDropdownItem[];
}

export interface SearchDropdownProps {
  sections: SearchDropdownSection[];
  onSelect: (item: SearchDropdownItem) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isSectioned(sections: SearchDropdownSection[]): boolean {
  return sections.some((s) => !!s.label);
}

function totalCount(sections: SearchDropdownSection[]): number {
  return sections.reduce((acc, s) => acc + s.items.length, 0);
}

// Section header text style — 14px Regular fg/support (Figma node 3250:19846)
// No whiteSpace:nowrap — "Products in global database:" must be allowed to wrap.
const sectionLabelStyle: React.CSSProperties = {
  fontFamily: tokens.fontFamily.sans,
  fontSize:   tokens.fontSize.body,       // 14px
  fontWeight: tokens.fontWeight.regular,  // 400 — Figma: font-normal
  lineHeight: tokens.lineHeight.body,     // 20px
  color:      tokens.color.fg.support,    // #6b7280
};

// ---------------------------------------------------------------------------
// SearchDropdown
// ---------------------------------------------------------------------------
export function SearchDropdown({ sections, onSelect }: SearchDropdownProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sectioned = isSectioned(sections);
  const count     = totalCount(sections);

  // ID of the very last item across all sections — used to suppress its divider
  const allItems = sections.flatMap((s) => s.items);
  const lastId   = allItems[allItems.length - 1]?.id;

  return (
    <div
      style={{
        background:    tokens.color.base.white,
        border:        `1px solid ${tokens.color.divider.border}`,
        borderRadius:  tokens.borderRadius.lg,  // 8px — Figma rounded-lg
        boxShadow:     tokens.shadows.ringMd,
        overflow:      "hidden",
        // Issue 4: 8px bottom padding so the last item doesn't sit flush at the edge.
        // Top spacing comes from the section header's paddingTop (8px).
        paddingBottom: tokens.spacing[2],
      }}
    >
      {/* ── Flat variant: "N products:" count header ────────────────────── */}
      {!sectioned && (
        <div
          style={{
            // Issue 1: pt-8px only — no bottom padding. Item's py-8px supplies the gap.
            paddingTop:   tokens.spacing[2],   // 8px
            paddingLeft:  tokens.spacing[4],   // 16px
            paddingRight: tokens.spacing[4],   // 16px
            ...sectionLabelStyle,
          }}
        >
          {count} product{count !== 1 ? "s" : ""}:
        </div>
      )}

      {/* ── Sections ─────────────────────────────────────────────────────── */}
      {sections.map((section, sIdx) => {
        const isFirstSection = sIdx === 0;

        return (
          <div key={sIdx}>
            {/* Section label — only in sectioned variant */}
            {sectioned && section.label && (
              <div
                style={{
                  // Issue 1: no bottom padding — item's py-8px supplies the gap.
                  // Non-first sections get extra 16px top to visually separate groups.
                  paddingTop:   isFirstSection ? tokens.spacing[2] : tokens.spacing[4],
                  paddingLeft:  tokens.spacing[4],
                  paddingRight: tokens.spacing[4],
                  paddingBottom: 0,
                  ...sectionLabelStyle,
                }}
              >
                {section.label}
              </div>
            )}

            {/* Items */}
            {section.items.map((item) => {
              const isLast    = item.id === lastId;
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelect(item)}
                  style={{
                    // Issue 3: horizontal padding only — divider lives on ListViewItem
                    // (inside this wrapper) so it's inset from the card edges.
                    paddingLeft:  tokens.spacing[4],   // 16px
                    paddingRight: tokens.spacing[4],   // 16px
                    background:  isHovered ? tokens.color.tint.blue : "transparent",
                    cursor:      "pointer",
                    transition:  "background 100ms ease",
                    boxSizing:   "border-box" as const,
                  }}
                >
                  {/* Issue 2+3: divider is on ListViewItem (inset) with correct gray/200 color */}
                  <ListViewItem
                    title={item.title}
                    subtitle={item.subtitle}
                    imageUrl={item.image}
                    serialRef={item.serialRef}
                    chip={item.chip}
                    showDivider={!isLast}
                    dividerColor={tokens.color.divider.border}  // gray/200 #e5e7eb
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default SearchDropdown;
