"use client";
// @refresh reset
// app/mobile/serials-home/page.tsx
// Figma: MF-serialisations node 315-16537

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { SearchScanSheet } from "@/components/patterns/SearchScanSheet";
import { Toast } from "@/components/ui/Toast";
import type { BottomNavItemDef } from "@/components/ui/MobileBottomNav";

// ── DS icon node IDs (design system file j8hy0yzSKPyh1yRKOh4tuU) ───────────────
const SQUIRCLE_ID      = "2307:2312"; // Scannable squircle brand logo 24px
const SELECTOR_ID      = "46:2945";   // Org selector — up/down arrows 24px
const BELL_ID          = "92:1260";   // Notifications bell
const BOOK_ICON_ID     = "220:2722";  // Book icon — Tips and Guides
const INSPECT_ID       = "92:1150";   // Quick action — Inspect
const ICON_CAPTURE_SER = "6258:3868"; // Quick action — Capture serials
const ICON_ROPE_SER    = "6458:905";  // Quick action — Cut rope lengths
const HOME_ID          = "2307:2449"; // Bottom nav — Home
const INVENTORY_ID     = "92:2266";   // Bottom nav — inventory (specs icon)
const SERIALS_ID       = "94:553";    // Bottom nav — Serialisations
const ME_ID            = "1613:107";  // Bottom nav — Me

const ALL_ICON_IDS = [
  SQUIRCLE_ID, SELECTOR_ID, BELL_ID, BOOK_ICON_ID,
  INSPECT_ID, ICON_CAPTURE_SER, ICON_ROPE_SER,
  HOME_ID, INVENTORY_ID, SERIALS_ID, ME_ID,
];

const QUICK_ACTIONS: { id: string; label: string; iconId: string }[] = [
  { id: "rope",           label: "Cut rope\nlengths", iconId: ICON_ROPE_SER    },
  { id: "capture-serial", label: "Capture serials",   iconId: ICON_CAPTURE_SER },
  { id: "inspect",        label: "Inspect",           iconId: INSPECT_ID       },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function MaskIcon({
  url,
  color,
  size = 24,
  fallback,
}: {
  url?: string;
  color: string;
  size?: number;
  fallback: React.ReactNode;
}) {
  if (!url) return <>{fallback}</>;
  return (
    <span
      aria-hidden
      style={{
        display:            "inline-block",
        width:              size,
        height:             size,
        flexShrink:         0,
        background:         color,
        maskImage:          `url(${url})`,
        maskSize:           "contain",
        maskRepeat:         "no-repeat",
        maskPosition:       "center",
        WebkitMaskImage:    `url(${url})`,
        WebkitMaskSize:     "contain",
        WebkitMaskRepeat:   "no-repeat",
        WebkitMaskPosition: "center",
      } as React.CSSProperties}
    />
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SerialsHomePage() {
  const router = useRouter();
  const icons  = useFigmaIcons(ALL_ICON_IDS);
  const [scanSheetOpen,    setScanSheetOpen]    = useState(false);
  const [inspectScanOpen,  setInspectScanOpen]  = useState(false);
  const [showInspectedBanner, setShowInspectedBanner] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "inspected") {
      setShowInspectedBanner(true);
      window.history.replaceState({}, "", window.location.pathname);
      const t = setTimeout(() => setShowInspectedBanner(false), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const bottomNavItems: [BottomNavItemDef, BottomNavItemDef, BottomNavItemDef, BottomNavItemDef] = [
    { id: "home",            label: "Home",           iconNodeId: HOME_ID,      state: "selected"                                    },
    { id: "inventory",       label: "inventory",      iconNodeId: INVENTORY_ID                                                       },
    { id: "serialisations",  label: "Serialisations", iconNodeId: SERIALS_ID,   onClick: () => router.push("/mobile/serialisation") },
    { id: "me",              label: "Me",             iconNodeId: ME_ID                                                               },
  ];

  return (
    <div
      style={{
        height:        "100dvh",
        display:       "flex",
        flexDirection: "column",
        background:    tokens.color.bg.linearBg,
        overflow:      "hidden",
        position:      "relative",
      }}
    >
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          padding:    `${tokens.spacing[2]} ${tokens.spacing[1]} ${tokens.spacing[2]} ${tokens.spacing[4]}`,
          gap:        tokens.spacing[2],
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        tokens.spacing[2],
            flex:       "1 0 0",
            minWidth:   0,
          }}
        >
          {icons[SQUIRCLE_ID]
            ? (
              <img
                src={icons[SQUIRCLE_ID]}
                alt="Scannable"
                width={24}
                height={24}
                style={{ display: "block", flexShrink: 0 }}
              />
            )
            : (
              <div
                style={{
                  width:        24,
                  height:       24,
                  background:   tokens.color.brand.lime,
                  borderRadius: tokens.borderRadius.sm,
                  flexShrink:   0,
                }}
              />
            )
          }
          <span
            style={{
              ...tokens.typography.h5,
              color:      tokens.color.base.white,
              whiteSpace: "nowrap",
            }}
          >
            MF supplier A
          </span>
          <MaskIcon
            url={icons[SELECTOR_ID]}
            color={tokens.color.fgReverse.primary}
            size={24}
            fallback={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M7 10l5-5 5 5M7 14l5 5 5-5" stroke={tokens.color.fgReverse.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "40px",
            height:         "40px",
            background:     "transparent",
            border:         "none",
            cursor:         "pointer",
            flexShrink:     0,
            borderRadius:   tokens.borderRadius.full,
          }}
        >
          <MaskIcon
            url={icons[BELL_ID]}
            color={tokens.color.brand.lime}
            size={24}
            fallback={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={tokens.color.brand.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={tokens.color.brand.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </button>
      </div>

      {/* ── Content area — pushes to bottom ──────────────────────────────────── */}
      <div
        style={{
          flex:           "1 0 0",
          minHeight:      0,
          overflowY:      "auto",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "flex-end",
          gap:            tokens.spacing[6],
          padding:        `0 ${tokens.spacing[4]} ${tokens.spacing[10]}`,
        }}
      >
        {/* ── Tips and Guides banner ─────────────────────────────────────────── */}
        <div
          style={{
            background:    tokens.color.brand.darkGrey,
            borderRadius:  tokens.borderRadius["2xl"],
            padding:       "20px",
            display:       "flex",
            alignItems:    "center",
            gap:           tokens.spacing[4],
          }}
        >
          <div
            style={{
              width:          40,
              height:         40,
              borderRadius:   tokens.borderRadius.lg,
              background:     tokens.color.brand.lime,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
            }}
          >
            <MaskIcon
              url={icons[BOOK_ICON_ID]}
              color={tokens.color.brand.darkGrey}
              size={24}
              fallback={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={tokens.color.brand.darkGrey} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={tokens.color.brand.darkGrey} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "14px", fontWeight: 500, lineHeight: "20px", color: tokens.color.base.white }}>
              Tips and Guides
            </span>
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "14px", fontWeight: 400, lineHeight: "20px", color: tokens.color.fgReverse.support }}>
              Learn how to use Scannable
            </span>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
            <path d="M6 4l4 4-4 4" stroke={tokens.color.fgReverse.support} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ── Quick actions ─────────────────────────────────────────────────── */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[2],
          }}
        >
          <span
            style={{
              fontFamily:    tokens.fontFamily.sans,
              fontSize:      "12px",
              fontWeight:    500,
              lineHeight:    "16px",
              color:         tokens.color.fg.support,
              textTransform: "uppercase" as const,
              letterSpacing: "0.04em",
            }}
          >
            Quick actions
          </span>
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",
              gap:                 tokens.spacing[3],
            }}
          >
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={
                  action.id === "rope"           ? () => router.push("/mobile/cut-rope-lengths-v2")
                  : action.id === "capture-serial" ? () => router.push("/mobile/capture-serials")
                  : action.id === "inspect"        ? () => setInspectScanOpen(true)
                  : undefined
                }
                style={{
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            tokens.spacing[2],
                  padding:        tokens.spacing[4],
                  background:     "rgba(46,38,71,0.7)",
                  borderRadius:   tokens.borderRadius.xl,
                  border:         "none",
                  cursor:         "pointer",
                  minHeight:      "96px",
                }}
              >
                <MaskIcon
                  url={icons[action.iconId]}
                  color={tokens.color.brand.lime}
                  size={24}
                  fallback={
                    <div
                      style={{
                        width:        24,
                        height:       24,
                        background:   tokens.color.brand.lime,
                        borderRadius: tokens.borderRadius.sm,
                        opacity:      0.4,
                      }}
                    />
                  }
                />
                <span
                  style={{
                    fontFamily:  tokens.fontFamily.sans,
                    fontSize:    "14px",
                    fontWeight:  500,
                    lineHeight:  "20px",
                    color:       tokens.color.fgReverse.primary,
                    textAlign:   "center",
                    whiteSpace:  "pre-line",
                  }}
                >
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom nav ───────────────────────────────────────────────────────── */}
      <MobileBottomNav items={bottomNavItems} onCentreClick={() => setScanSheetOpen(true)} />

      {/* ── Item inspected banner ────────────────────────────────────────────── */}
      {showInspectedBanner && (
        <div style={{
          position: "absolute",
          bottom:   "80px",
          left:     tokens.spacing[4],
          right:    tokens.spacing[4],
          zIndex:   30,
        }}>
          <Toast variant="success" message="Item inspected" />
        </div>
      )}

      {/* ── Search / scan sheet (centre button) ─────────────────────────────── */}
      <SearchScanSheet
        open={scanSheetOpen}
        onClose={() => setScanSheetOpen(false)}
        contained
      />

      {/* ── Inspect scan sheet ────────────────────────────────────────────────── */}
      <SearchScanSheet
        open={inspectScanOpen}
        onClose={() => setInspectScanOpen(false)}
        contained
        onScanDetected={() => {
          setInspectScanOpen(false);
          router.push("/mobile/inspect");
        }}
      />
    </div>
  );
}
