"use client";
// components/ui/ProductListItem.tsx
// Figma: Scannable Design System — node 2334:810 (ProductListItem, 5 variants)
// Icon slots accept any ReactNode — callers own fetching/sizing.

import React from "react";
import tokens from "@/styles/design-tokens";
import { Button } from "@/components/ui/Button";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProductListItemVariant =
  | "text"
  | "action"
  | "text+buttons"
  | "text+indicator+buttons"
  | "badge";

export interface ProductListItemProps {
  label:    string;
  variant:  ProductListItemVariant;

  /** Displayed text value — used in text / text+buttons / text+indicator+buttons */
  value?:     string;

  // action variant
  actionLabel?: string;
  onAction?:    () => void;

  // text+buttons / text+indicator+buttons
  addIcon?:    React.ReactNode;  // 24px add icon
  deleteIcon?: React.ReactNode;  // 24px bin icon
  onAdd?:      () => void;
  onDelete?:   () => void;

  // text+indicator+buttons only
  indicatorIcon?: React.ReactNode; // 16px info icon shown between value and buttons

  // badge variant
  badgeText?: string;
  badgeIcon?: React.ReactNode; // 16px doc icon inside the pill

  /** Suppress the bottom divider (e.g. last row in a list) */
  noDivider?: boolean;
}

// ── ProductListItem ────────────────────────────────────────────────────────────

export function ProductListItem({
  label,
  variant,
  value,
  actionLabel = "Add NFC",
  onAction,
  addIcon,
  deleteIcon,
  onAdd,
  onDelete,
  indicatorIcon,
  badgeText,
  badgeIcon,
  noDivider = false,
}: ProductListItemProps) {
  // Row vertical padding — from Figma: pt-[14px] pb-[13px] (text/action), pt-[8px] pb-[7px] (with buttons), pt-[13px] pb-[12px] (badge)
  const rowPaddingTop    = variant === "badge" ? tokens.spacing[3] : (variant === "text+buttons" || variant === "text+indicator+buttons") ? tokens.spacing[2] : "14px";
  const rowPaddingBottom = variant === "badge" ? tokens.spacing[3] : (variant === "text+buttons" || variant === "text+indicator+buttons") ? "7px"               : tokens.spacing[3];

  return (
    // Outer container — px-[16px] so the divider is also 16px inset (matches Figma)
    <div style={{
      display:     "flex",
      flexDirection: "column",
      paddingLeft:  tokens.spacing[4],
      paddingRight: tokens.spacing[4],
      width:        "100%",
      boxSizing:    "border-box",
      background:   tokens.color.base.white,
    }}>
      {/* Row content */}
      <div style={{
        display:       "flex",
        alignItems:    "center",
        gap:           tokens.spacing[3],
        paddingTop:    rowPaddingTop,
        paddingBottom: rowPaddingBottom,
      }}>

        {/* Fixed-width label */}
        <span style={{
          ...tokens.typography.bodyM,
          color:      tokens.color.fg.support,
          width:      "128px",
          flexShrink: 0,
        }}>
          {label}
        </span>

        {/* Right-side content — fills remaining space */}
        <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", gap: tokens.spacing[2], minWidth: 0 }}>

          {/* text ──────────────────────────────────────────────── */}
          {variant === "text" && (
            <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary, flex: "1 0 0" }}>
              {value}
            </span>
          )}

          {/* action ─────────────────────────────────────────────── */}
          {variant === "action" && (
            <Button
              variant="tertiary"
              withIcon="heading"
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
              label={actionLabel}
              onClick={onAction}
            />
          )}

          {/* text+buttons ───────────────────────────────────────── */}
          {variant === "text+buttons" && (
            <>
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary, flex: "1 0 0", minWidth: 0 }}>
                {value}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2], flexShrink: 0 }}>
                <Button variant="icon framed" icon={addIcon}    onClick={onAdd} />
                <Button variant="icon framed" icon={deleteIcon} onClick={onDelete} />
              </div>
            </>
          )}

          {/* text+indicator+buttons ─────────────────────────────── */}
          {variant === "text+indicator+buttons" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1], flex: "1 0 0", minWidth: 0 }}>
                <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>
                  {value}
                </span>
                {indicatorIcon && (
                  <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {indicatorIcon}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2], flexShrink: 0 }}>
                <Button variant="icon framed" icon={addIcon}    onClick={onAdd} />
                <Button variant="icon framed" icon={deleteIcon} onClick={onDelete} />
              </div>
            </>
          )}

          {/* badge ──────────────────────────────────────────────── */}
          {variant === "badge" && (
            <div style={{
              display:       "flex",
              alignItems:    "center",
              gap:           tokens.spacing[1],
              background:    tokens.color.tint.blue,
              borderRadius:  tokens.borderRadius.full,
              paddingTop:    tokens.spacing[0.5],
              paddingBottom: tokens.spacing[0.5],
              paddingLeft:   tokens.spacing[2],
              paddingRight:  tokens.spacing[0.5],
            }}>
              <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.primary }}>
                {badgeText}
              </span>
              {badgeIcon && (
                <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  {badgeIcon}
                </span>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Divider — inside px-[16px] container so it's 16px inset from each edge */}
      {!noDivider && (
        <div style={{ height: "1px", background: tokens.color.divider.border, flexShrink: 0 }} />
      )}
    </div>
  );
}
