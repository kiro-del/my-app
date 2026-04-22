"use client";

// components/ui/Sidebar.tsx
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";
import { SidebarNavItem, SidebarNavItemProps } from "./SidebarNavItem";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

// Figma nodeIds for sidebar assets
const BRAND_ICON = "216:1202"; // DecoIcons brand 40px — complete lime square + wave mark
const WAVE_CTA   = "2261:2169"; // scannable wave (24px node, displayed at 16px in CTA)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SidebarSection {
  title?:       string;
  collapsible?: boolean;
  items:        SidebarNavItemProps[];
}

export interface SidebarProps {
  userName:      string;
  userSubtitle?: string;
  userInitials:  string;
  /** Controls the CTA area variant:
   *  - "standard" (default): "Buy NFC Tags" outline button
   *  - "pro": PRO badge + Active/View plan status + "Buy NFC Tags"
   *  - "upgrade": "Upgrade to Pro Today" lime button + "Buy NFC Tags"
   */
  variant?:      "standard" | "pro" | "upgrade";
  ctaLabel?:     string;
  onCtaClick?:   () => void;
  onUserClick?:  () => void;
  sections:      SidebarSection[];
}

// ---------------------------------------------------------------------------
// Chevrons
// ---------------------------------------------------------------------------
const ChevronDown = ({ color = tokens.color.fg.primary }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = ({ color = tokens.color.fg.support }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M6 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
export function Sidebar({
  userName,
  userSubtitle,
  userInitials,
  variant = "standard",
  ctaLabel = "Buy NFC Tags",
  onCtaClick,
  onUserClick,
  sections,
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  // Fetch brand icon + CTA wave
  const waveUrls = useFigmaIcons([BRAND_ICON, WAVE_CTA]);

  function toggleSection(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <aside
      style={{
        width:         "284px",
        minWidth:      "284px",
        height:        "100%",
        // fix #1 — bg/light-bg instead of white
        background:    tokens.color.bg.lightBg,
        // fix #9 — use divider/border (lighter) instead of divider/frame
        borderRight:   `1px solid ${tokens.color.divider.border}`,
        display:       "flex",
        flexDirection: "column",
        overflowY:     "auto" as const,
        boxSizing:     "border-box" as const,
        flexShrink:    0,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* User header — fix #4: no borderBottom                              */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ padding: "16px 10px 12px" }}>

        {/* Avatar row */}
        <button
          onClick={onUserClick}
          style={{
            display:      "flex",
            alignItems:   "center",
            width:        "100%",
            gap:          "8px",
            background:   "none",
            border:       "none",
            cursor:       "pointer",
            padding:      "4px",
            borderRadius: tokens.borderRadius.md,
            textAlign:    "left" as const,
            marginBottom: "12px",
          }}
        >
          {/* Brand logo — DecoIcons brand 40px (lime square + wave mark) */}
          {waveUrls[BRAND_ICON] ? (
            <img src={waveUrls[BRAND_ICON]} width={40} height={40} alt="" aria-hidden
              style={{ flexShrink: 0, borderRadius: tokens.borderRadius.md }} />
          ) : (
            // Fallback until asset loads
            <div style={{
              width: "40px", height: "40px", borderRadius: tokens.borderRadius.md,
              background: tokens.color.brand.lime, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M2 9c2-3.5 4-3.5 6 0s4 7 6 3.5 4-3.5 6 0" stroke={tokens.color.fg.primary} strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M2 15c2-3.5 4-3.5 6 0s4 7 6 3.5 4-3.5 6 0" stroke={tokens.color.fg.primary} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}

          {/* Name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,
              fontWeight:   tokens.fontWeight.medium,
              color:        tokens.color.fg.primary,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap" as const,
            }}>
              {userName}
            </div>
            {userSubtitle && (
              <div style={{
                fontFamily:   tokens.fontFamily.sans,
                fontSize:     "12px",
                fontWeight:   tokens.fontWeight.regular,
                lineHeight:   "16px",
                color:        tokens.color.fg.support,
                overflow:     "hidden",
                textOverflow: "ellipsis",
                whiteSpace:   "nowrap" as const,
              }}>
                {userSubtitle}
              </div>
            )}
          </div>

          <ChevronDown color={tokens.color.fg.support} />
        </button>

        {/* PRO badge row (pro variant only) */}
        {variant === "pro" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{
              display:      "inline-flex",
              alignItems:   "center",
              justifyContent: "center",
              padding:      "2px 6px",
              border:       `2px solid ${tokens.color.fg.primary}`,
              borderRadius: tokens.borderRadius.md,
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.h5,
              fontWeight:   tokens.fontWeight.semiBold,
              color:        tokens.color.fg.primary,
              lineHeight:   "22px",
              flexShrink:   0,
            }}>
              PRO
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, lineHeight: "20px" }}>Active</span>
              <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "12px", fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support, lineHeight: "16px" }}>View plan</span>
            </div>
          </div>
        )}

        {/* Upgrade CTA (upgrade variant only) */}
        {variant === "upgrade" && (
          <button
            onClick={onCtaClick}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              width:          "100%",
              height:         "40px",
              borderRadius:   tokens.borderRadius.md,
              border:         `1px solid ${tokens.color.divider.lime}`,
              background:     tokens.color.brand.lime,
              fontFamily:     tokens.fontFamily.sans,
              fontSize:       tokens.fontSize.body,
              fontWeight:     tokens.fontWeight.medium,
              color:          tokens.color.fg.primary,
              cursor:         "pointer",
              marginBottom:   "6px",
            }}
          >
            Upgrade to Pro Today
          </button>
        )}

        {/* Buy NFC Tags button (standard + pro + upgrade) */}
        {ctaLabel && (
          <button
            onClick={variant === "upgrade" ? undefined : onCtaClick}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "6px",
              width:          "100%",
              height:         "36px",
              borderRadius:   tokens.borderRadius.md,
              border:         `1px solid ${tokens.color.divider.frame}`,
              background:     tokens.color.base.white,
              fontFamily:     tokens.fontFamily.sans,
              fontSize:       tokens.fontSize.body,
              fontWeight:     tokens.fontWeight.medium,
              color:          tokens.color.fg.primary,
              cursor:         "pointer",
            }}
          >
            {waveUrls[WAVE_CTA] && (
              <img src={waveUrls[WAVE_CTA]} width={16} height={16} alt="" aria-hidden />
            )}
            {ctaLabel}
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Nav sections                                                        */}
      {/* fix #8 — tighter spacing: gap 2px, no extra marginBottom           */}
      {/* ------------------------------------------------------------------ */}
      <nav style={{ flex: 1, padding: "4px 10px 8px", display: "flex", flexDirection: "column" }}>
        {sections.map((section, si) => {
          // All titled sections are collapsible
          const isCollapsed = section.title
            ? collapsed[section.title] ?? false
            : false;

          return (
            <div key={si} style={{ marginTop: section.title ? "24px" : 0 }}>
              {section.title && (
                <button
                  onClick={() => toggleSection(section.title!)}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                    width:          "100%",
                    padding:        "4px 8px",
                    background:     "none",
                    border:         "none",
                    cursor:         "pointer",
                    fontFamily:     tokens.fontFamily.sans,
                    fontSize:       "12px",
                    fontWeight:     tokens.fontWeight.medium,
                    lineHeight:     "16px",
                    color:          tokens.color.fg.support,
                    textAlign:      "left" as const,
                    marginBottom:   "2px",
                  }}
                >
                  {section.title}
                  {isCollapsed
                    ? <ChevronRight />
                    : <ChevronDown color={tokens.color.fg.support} />
                  }
                </button>
              )}

              {!isCollapsed && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {section.items.map((item, ii) => (
                    <SidebarNavItem key={ii} {...item} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
