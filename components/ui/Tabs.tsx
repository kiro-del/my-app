"use client";
// components/ui/Tabs.tsx
// Figma: Scannable Design System — node 71:1391 (tab item), 71:1496 (Tabs container)
// All values from design-tokens. Icon slot accepts any ReactNode — callers own the icon.

import React from "react";
import tokens from "@/styles/design-tokens";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TabItem {
  id:       string;
  label:    string;
  /**
   * Optional 24×24 icon.
   * Prefer `iconUrl` (data: or http URL) for precise fg/blue ↔ fg/support tinting via CSS mask.
   * `icon` (ReactNode) falls back to the CSS filter approach and may be slightly off-colour.
   */
  icon?:    React.ReactNode;
  /** DS icon URL — renders via CSS mask for exact active/inactive colour */
  iconUrl?: string;
  /** Badge count shown top-right of the icon */
  badge?:   number;
}

export interface TabsProps {
  items:     TabItem[];
  activeId:  string;
  onChange:  (id: string) => void;
  /** Stretch tabs to fill the container width equally */
  fullWidth?: boolean;
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

export function Tabs({ items, activeId, onChange, fullWidth = false }: TabsProps) {
  return (
    <div style={{
      display:       "flex",
      alignItems:    "flex-end",
      gap:           tokens.spacing[1],
      background:    tokens.color.base.white,
      borderBottom:  `1px solid ${tokens.color.divider.border}`,
      paddingTop:    tokens.spacing[6],
      paddingLeft:   tokens.spacing[1],
      paddingRight:  tokens.spacing[1],
      boxSizing:     "border-box",
    }}>
      {items.map(item => {
        const isSelected = item.id === activeId;
        const hasIcon    = !!item.icon || !!item.iconUrl;

        // Precise colour for mask-based icons; filter fallback for ReactNode icons
        const iconColor  = isSelected ? tokens.color.fg.blue : tokens.color.fg.support;
        // CSS filter to tint mono icons: selected → indigo/700 (#4338CA), unselected → gray/500 (#6B7280)
        const iconFilter = isSelected
          ? "brightness(0) saturate(100%) invert(23%) sepia(96%) saturate(650%) hue-rotate(228deg) brightness(98%) contrast(97%)"
          : "brightness(0) saturate(20%) invert(47%) sepia(6%) saturate(350%) hue-rotate(192deg) brightness(98%) contrast(88%)";

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              gap:            tokens.spacing[3],
              flex:           fullWidth ? "1 0 0" : "0 0 auto",
              minWidth:       0,
              padding:        0,
              background:     "transparent",
              border:         "none",
              cursor:         "pointer",
            }}
          >
            {/* Content: icon+label stacked vertically, or label only */}
            <div style={{
              display:        "flex",
              flexDirection:  hasIcon ? "column" : "row",
              alignItems:     "center",
              gap:            hasIcon ? tokens.spacing[1] : 0,
              paddingLeft:    hasIcon ? tokens.spacing[2] : tokens.spacing[4],
              paddingRight:   hasIcon ? tokens.spacing[2] : tokens.spacing[4],
              position:       "relative",
            }}>
              {hasIcon && (
                <div style={{ position: "relative", width: "24px", height: "24px", flexShrink: 0 }}>
                  {/* iconUrl → CSS mask for exact fg/blue or fg/support */}
                  {item.iconUrl ? (
                    <span
                      aria-hidden
                      style={{
                        display:            "block",
                        width:              "24px",
                        height:             "24px",
                        background:         iconColor,
                        maskImage:          `url(${item.iconUrl})`,
                        maskSize:           "contain",
                        maskRepeat:         "no-repeat",
                        maskPosition:       "center",
                        WebkitMaskImage:    `url(${item.iconUrl})`,
                        WebkitMaskSize:     "contain",
                        WebkitMaskRepeat:   "no-repeat",
                        WebkitMaskPosition: "center",
                      } as React.CSSProperties}
                    />
                  ) : (
                  /* icon ReactNode → CSS filter fallback */
                  <div style={{ width: "24px", height: "24px", filter: iconFilter }}>
                    {item.icon}
                  </div>
                  )}
                  {item.badge !== undefined && (
                    // Figma: unselected → left:19px top:0 · selected → right:-13px top:0
                    <div style={{
                      position:        "absolute",
                      top:             0,
                      ...(isSelected ? { right: "-13px" } : { left: "19px" }),
                      background:      isSelected ? tokens.color.tint.blue : tokens.color.bg.darkBg,
                      borderRadius:    tokens.borderRadius.sm,
                      padding:         `0 ${tokens.spacing[0.5]}`,
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      minWidth:        "16px",
                    }}>
                      <span style={{
                        ...tokens.typography.smallBodySB,
                        color:      isSelected ? tokens.color.fg.blue : tokens.color.fg.disabled,
                        lineHeight: "16px",
                      }}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <span style={{
                ...(isSelected ? tokens.typography.bodySB : tokens.typography.bodyM),
                fontWeight: isSelected ? "600" : tokens.typography.bodyM.fontWeight,
                color:      isSelected ? tokens.color.fg.blue : tokens.color.fg.support,
                whiteSpace: "nowrap",
              }}>
                {item.label}
              </span>
            </div>

            {/* Active indicator */}
            <div style={{
              height:     "2px",
              width:      "100%",
              flexShrink: 0,
              background: isSelected ? tokens.color.divider.blue : "transparent",
            }} />
          </button>
        );
      })}
    </div>
  );
}
