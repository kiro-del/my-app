"use client";
// @refresh reset
// app/mobile/serials-home/page.tsx
// Figma: Serials file — node 68:6713 (MF - Home)

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { SearchScanSheet } from "@/components/patterns/SearchScanSheet";
import type { BottomNavItemDef } from "@/components/ui/MobileBottomNav";

// ── DS icon node IDs (design system file j8hy0yzSKPyh1yRKOh4tuU) ───────────────
const SQUIRCLE_ID      = "2307:2312"; // Scannable squircle brand logo 24px
const SELECTOR_ID      = "46:2945";   // Org selector — up/down arrows 24px
const BELL_ID          = "92:1260";   // Notifications bell
const CHEVRON_RIGHT_ID = "46:2941";   // Chevron right — stat card nav 24px
const ARROW_UP_ID      = "151:1503";  // Arrow up — trend indicator 16px
const INSPECT_ID       = "92:1150";   // Quick action — Inspect
const CREATE_SER_ID    = "94:554";    // Quick action — Create serials
const PRINT_LABELS_ID  = "2171:2524"; // Quick action — Print labels
const ICON_CAPTURE_SER = "6258:3868"; // Quick action — Capture serials
const ISSUE_RECALL_ID  = "6040:1824"; // Quick action — Issue Recall
const ICON_ROPE_SER    = "2119:4324"; // Quick action — Cut rope lengths
const HOME_ID          = "2307:2449"; // Bottom nav — Home
const SERIALS_ID       = "94:553";    // Bottom nav — Serial runs
const PRODUCTS_ID      = "3628:9949"; // Bottom nav — Products
const ME_ID            = "1613:107";  // Bottom nav — Me

const ALL_ICON_IDS = [
  SQUIRCLE_ID, SELECTOR_ID, BELL_ID, CHEVRON_RIGHT_ID, ARROW_UP_ID,
  INSPECT_ID, CREATE_SER_ID, PRINT_LABELS_ID,
  ICON_CAPTURE_SER, ISSUE_RECALL_ID, ICON_ROPE_SER,
  HOME_ID, SERIALS_ID, PRODUCTS_ID, ME_ID,
];

// ── Static data ────────────────────────────────────────────────────────────────

interface StatCard {
  id:      string;
  label:   string;
  value:   string;
  trend?:  { value: string; label: string };
  chevron?: boolean;
}

const STAT_CARDS: StatCard[] = [
  { id: "ppe-produced", label: "Smart PPE produced", value: "12345", trend: { value: "765", label: "last week" }, chevron: true },
  { id: "ppe-claimed",  label: "Smart PPE claimed",  value: "1543",  trend: { value: "69",  label: "last week" } },
  { id: "scans",        label: "Scans",              value: "6557",  trend: { value: "21",  label: "last week" } },
  { id: "recalls",      label: "Active recalls",     value: "3" },
];

const QUICK_ACTIONS: { id: string; label: string; iconId: string }[] = [
  { id: "rope",           label: "Cut rope\nlengths",   iconId: ICON_ROPE_SER    },
  { id: "capture-serial", label: "Capture serials",     iconId: ICON_CAPTURE_SER },
  { id: "create-serial",  label: "Create serials",      iconId: CREATE_SER_ID    },
  { id: "inspect",        label: "Inspect",             iconId: INSPECT_ID       },
  { id: "print",          label: "Print labels",        iconId: ISSUE_RECALL_ID  },
  { id: "recall",         label: "Issue Recall",        iconId: PRINT_LABELS_ID  },
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

function ChevronRightIcon({ url, color }: { url?: string; color: string }) {
  if (!url) return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <span aria-hidden style={{
      display: "inline-block", width: 24, height: 24, flexShrink: 0,
      background: color,
      maskImage: `url(${url})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
      WebkitMaskImage: `url(${url})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
    } as React.CSSProperties} />
  );
}

function ArrowUpIcon({ url, color }: { url?: string; color: string }) {
  if (!url) return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 12V4M4.5 7.5L8 4l3.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <span aria-hidden style={{
      display: "inline-block", width: 16, height: 16, flexShrink: 0,
      background: color,
      maskImage: `url(${url})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
      WebkitMaskImage: `url(${url})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
    } as React.CSSProperties} />
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SerialsHomePage() {
  const router = useRouter();
  const icons  = useFigmaIcons(ALL_ICON_IDS);
  const [addMenuOpen,   setAddMenuOpen]   = useState(false);
  const [scanSheetOpen, setScanSheetOpen] = useState(false);

  const bottomNavItems: [BottomNavItemDef, BottomNavItemDef, BottomNavItemDef, BottomNavItemDef] = [
    { id: "home",     label: "Home",        iconNodeId: HOME_ID,     state: "selected"                                   },
    { id: "serials",  label: "Serial runs", iconNodeId: SERIALS_ID,  onClick: () => router.push("/mobile/serialisation") },
    { id: "products", label: "Products",    iconNodeId: PRODUCTS_ID                                                      },
    { id: "me",       label: "Me",          iconNodeId: ME_ID                                                            },
  ];

  return (
    <div
      style={{
        height:        "100dvh",
        display:       "flex",
        flexDirection: "column",
        background:    "linear-gradient(149.26deg, #332562 11.24%, #171717 97.76%)",
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
        {/* Left: squircle + org name + selector chevron */}
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

        {/* Right: notifications bell */}
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

      {/* ── Scrollable content area ───────────────────────────────────────── */}
      <div
        style={{
          flex:          "1 0 0",
          minHeight:     0,
          overflowY:     "auto",
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[6],
          padding:       `0 ${tokens.spacing[4]} ${tokens.spacing[4]}`,
        }}
      >

        {/* ── Stats 2×2 grid ───────────────────────────────────────────────── */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap:                 tokens.spacing[4],
          }}
        >
          {STAT_CARDS.map((card) => (
            <div
              key={card.id}
              style={{
                background:    "rgba(255,255,255,0.05)",
                borderRadius:  tokens.borderRadius.lg,
                padding:       "12px 10px 12px 16px",
                display:       "flex",
                flexDirection: "column",
                gap:           "10px",
              }}
            >
              {/* Label */}
              <span style={{ ...tokens.typography.bodyR, color: tokens.color.fgReverse.primary }}>
                {card.label}
              </span>

              {/* Value + trend group */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {/* Number row */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{
                    fontFamily:    tokens.fontFamily.sans,
                    fontSize:      "24px",
                    fontWeight:    tokens.fontWeight.medium,
                    lineHeight:    "1.4",
                    letterSpacing: "0.03em",
                    color:         tokens.color.fgReverse.primary,
                    flex:          "1 0 0",
                    minWidth:      0,
                  }}>
                    {card.value}
                  </span>
                  {card.chevron && (
                    <MaskIcon url={icons[CHEVRON_RIGHT_ID]} color={tokens.color.fgReverse.support} size={16} fallback={
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M6 4l4 4-4 4" stroke={tokens.color.fgReverse.support} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    } />
                  )}
                </div>

                {/* Trend row (optional) */}
                {card.trend && (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{
                      fontFamily: tokens.fontFamily.sans,
                      fontSize:   tokens.fontSize.body,
                      fontWeight: tokens.fontWeight.semiBold,
                      lineHeight: tokens.lineHeight.body,
                      color:      "#a5b4fc",
                    }}>
                      {card.trend.value}
                    </span>
                    <span style={{
                      fontFamily: tokens.fontFamily.sans,
                      fontSize:   tokens.fontSize.bodySmall,
                      fontWeight: tokens.fontWeight.regular,
                      lineHeight: "16px",
                      color:      tokens.color.fgReverse.support,
                    }}>
                      {card.trend.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
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
              ...tokens.typography.bodyR,
              color: tokens.color.fgReverse.primary,
            }}
          >
            Quick actions
          </span>
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",
              gap:                 tokens.spacing[4],
            }}
          >
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={
                  action.id === "rope"           ? () => router.push("/mobile/cut-rope-lengths")
                  : action.id === "capture-serial" ? () => router.push("/mobile/capture-serials")
                  : action.id === "create-serial"  ? () => router.push("/mobile/create-serials")
                  : undefined
                }
                style={{
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            tokens.spacing[2],
                  padding:        tokens.spacing[4],
                  background:     "rgba(255,255,255,0.5)",
                  borderRadius:   tokens.borderRadius.lg,
                  border:         "none",
                  cursor:         "pointer",
                  minHeight:      "96px",
                }}
              >
                <MaskIcon
                  url={icons[action.iconId]}
                  color={tokens.color.brand.darkPurple}
                  size={24}
                  fallback={
                    <div
                      style={{
                        width:        24,
                        height:       24,
                        background:   tokens.color.brand.darkPurple,
                        borderRadius: tokens.borderRadius.sm,
                        opacity:      0.3,
                      }}
                    />
                  }
                />
                <span
                  style={{
                    ...tokens.typography.smallBodyM,
                    color:     tokens.color.brand.darkPurple,
                    textAlign: "center",
                    whiteSpace: "pre-line",
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

      {/* ── Add menu sheet ───────────────────────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={addMenuOpen}
        onClose={() => setAddMenuOpen(false)}
        contained
      >
        <div style={{ paddingTop: tokens.spacing[2], paddingBottom: tokens.spacing[4] }}>
          <ContextMenuItem
            label="Create serials"
            supportText="Generate serials using Scannable's sequencer."
            iconUrl={icons[CREATE_SER_ID]}
            divider
            onClick={() => { setAddMenuOpen(false); router.push("/mobile/create-serials"); }}
          />
          <ContextMenuItem
            label="Capture serials"
            supportText="Capture existing serials from external sources."
            iconUrl={icons[ICON_CAPTURE_SER]}
            divider
            onClick={() => { setAddMenuOpen(false); router.push("/mobile/capture-serials"); }}
          />
          <ContextMenuItem
            label="Cut rope lengths"
            supportText="Convert source reel into serialised lengths."
            iconUrl={icons[ICON_ROPE_SER]}
            onClick={() => setAddMenuOpen(false)}
          />
        </div>
      </BottomSheet>

      {/* ── Search / scan sheet ──────────────────────────────────────────────── */}
      <SearchScanSheet
        open={scanSheetOpen}
        onClose={() => setScanSheetOpen(false)}
        contained
      />
    </div>
  );
}
