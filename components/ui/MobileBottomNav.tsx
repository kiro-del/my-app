"use client";
// components/ui/MobileBottomNav.tsx
// Figma: Scannable Design System — node 2475:7660 (Mobile / Bottom Nav)
// All values reference design-tokens — never hardcoded (except bar height 70px, mobile-only).

import React from "react";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { DecoIcon } from "./DecoIcon";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BottomNavState = "selected" | "default" | "badge";

export interface BottomNavItemDef {
  id:          string;
  label:       string;
  /** Figma 24px icon node ID — fetched via useFigmaIcons */
  iconNodeId:  string;
  state?:      BottomNavState;
  /** Count shown in badge chip when state="badge" */
  badgeCount?: number;
  onClick?:    () => void;
}

export interface MobileBottomNavProps {
  /** Exactly 4 items — 2 left of centre, 2 right of centre */
  items:          [BottomNavItemDef, BottomNavItemDef, BottomNavItemDef, BottomNavItemDef];
  onCentreClick?: () => void;
}

// ── Nav item ──────────────────────────────────────────────────────────────────

function NavItem({ def, iconUrl }: { def: BottomNavItemDef; iconUrl?: string }) {
  const isSelected = def.state === "selected";
  const isBadge    = def.state === "badge";

  // Selected: dark icon (fg.primary). Default/badge: muted gray (fg.disabled) via filter.
  const iconFilter = isSelected
    ? "brightness(0)"                                           // → near-black
    : "brightness(0) invert(73%) sepia(7%) saturate(302%) hue-rotate(182deg) brightness(97%) contrast(90%)"; // → gray-400

  return (
    <button
      onClick={def.onClick}
      style={{
        flex: "1 0 0", minWidth: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: tokens.spacing[0.5],
        background: "transparent", border: "none",
        cursor: "pointer", padding: 0,
      }}
    >
      {/* Icon + optional badge */}
      <div style={{ position: "relative", flexShrink: 0, width: 24, height: 24 }}>
        {iconUrl
          ? <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block", filter: iconFilter }} />
          : <div style={{ width: 24, height: 24, background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.sm, filter: iconFilter }} />
        }
        {isBadge && (
          <div style={{
            position: "absolute",
            top: 0,
            left: "calc(50% + 9.5px)",
            transform: "translateX(-50%)",
            background: tokens.color.bg.darkBg,
            borderRadius: tokens.borderRadius.sm,   // 4px — closest to Figma's 5px
            padding: `0 ${tokens.spacing[1.5]}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            minWidth: "16px",
          }}>
            <span style={{ ...tokens.typography.smallBodySB, color: tokens.color.fg.disabled, lineHeight: "16px" }}>
              {def.badgeCount ?? 1}
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <span style={{
        ...(isSelected ? tokens.typography.smallBodySB : tokens.typography.smallBodyM),
        color: isSelected ? tokens.color.fg.primary : tokens.color.fg.disabled,
        whiteSpace: "nowrap",
      }}>
        {def.label}
      </span>
    </button>
  );
}

// ── MobileBottomNav ───────────────────────────────────────────────────────────

export function MobileBottomNav({ items, onCentreClick }: MobileBottomNavProps) {
  const allNodeIds = items.map(i => i.iconNodeId);
  const iconUrls   = useFigmaIcons(allNodeIds);

  const [left1, left2, right1, right2] = items;

  return (
    <div style={{
      display: "flex", alignItems: "center",
      width: "100%",
      height: "70px",                             // mobile-only fixed height
      background: tokens.color.base.white,
      borderTop: `1px solid ${tokens.color.divider.border}`,
      boxSizing: "border-box",
    }}>
      <NavItem def={left1}  iconUrl={iconUrls[left1.iconNodeId]} />
      <NavItem def={left2}  iconUrl={iconUrls[left2.iconNodeId]} />

      {/* Centre: brand DecoIcon — no label */}
      <button
        onClick={onCentreClick}
        style={{
          flex: "1 0 0", minWidth: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer", padding: 0,
          height: "100%",
        }}
      >
        <DecoIcon size="40" tone="brand" />
      </button>

      <NavItem def={right1} iconUrl={iconUrls[right1.iconNodeId]} />
      <NavItem def={right2} iconUrl={iconUrls[right2.iconNodeId]} />
    </div>
  );
}
