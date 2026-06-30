"use client";
// app/mobile/serialisation/view-serial-run/page.tsx
// Figma: MF-Serialisations — nodes 327-57136 (collapsed), 329-58511 (expanded), 329-59184 (sort sheet)

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { MobileButton as Button } from "@/components/ui/mobile/Button";
import { ScanInput } from "@/components/ui/InputScan";

// ── DS icon node IDs (design system file j8hy0yzSKPyh1yRKOh4tuU) ─────────────
const SORT_ICON_ID = "55:223";   // switch-vertical / sort icon
const NFC_ICON_ID  = "3550:863"; // NFC tag icon
const ICON_COPY        = "149:364";   // Copy
const ICON_EDIT        = "46:2933";   // Edit / pencil
const ICON_PRINT_LABEL = "6040:1824"; // Printer label
const ICON_BIN         = "49:967";    // Bin / Delete

const ALL_ICON_IDS = [SORT_ICON_ID, NFC_ICON_ID, ICON_COPY, ICON_EDIT, ICON_PRINT_LABEL, ICON_BIN];

// ── Static data ────────────────────────────────────────────────────────────────

interface ViewSerial {
  id:       string;
  number:   string;
  nfcAdded: boolean;
  claimed:  boolean;
}

const VIEW_SERIALS: ViewSerial[] = [
  { id: "1", number: "#201320801030301", nfcAdded: true,  claimed: false },
  { id: "2", number: "#201320801030301", nfcAdded: true,  claimed: true  },
  { id: "3", number: "#201320801030301", nfcAdded: true,  claimed: false },
  { id: "4", number: "#201320801030301", nfcAdded: false, claimed: false },
  { id: "5", number: "#201320801030301", nfcAdded: true,  claimed: true  },
];

const DETAIL_FIELDS = [
  { label: "Purchase order",    value: "1234-44"     },
  { label: "Sales order",       value: "1234-44"     },
  { label: "Date of manufacture", value: "Apr 10, 2026" },
  { label: "Batch number",      value: "323"         },
  { label: "Type",              value: "Created"     },
];

// ── Inline icons ───────────────────────────────────────────────────────────────

function ChevronDownIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 10l4-4 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MaskIcon({ url, color, size = 24, fallback }: { url?: string; color: string; size?: number; fallback: React.ReactNode }) {
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

// NFC tag icon fallback — used while useFigmaIcons resolves DS node 3550:863
function NfcIconFallback() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect width="16" height="16" rx="3.5" fill="#2C2258" />
      <path d="M5.5 8a2.5 2.5 0 0 1 2.5-2.5" stroke="#CCFF00" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 8a4 4 0 0 1 4-4"           stroke="#CCFF00" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 8a1 1 0 0 1 1-1"           stroke="#CCFF00" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Sort fallback icon (two vertical arrows)
function SortFallbackIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 9l4-4 4 4"  stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15l4 4 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ViewSerialRunPage() {
  const router  = useRouter();
  const icons   = useFigmaIcons(ALL_ICON_IDS);

  const [detailsExpanded,  setDetailsExpanded]  = useState(false);
  const [sortSheetOpen,    setSortSheetOpen]    = useState(false);
  const [optionsSheetOpen, setOptionsSheetOpen] = useState(false);

  return (
    <div
      style={{
        height:        "100dvh",
        display:       "flex",
        flexDirection: "column",
        background:    tokens.color.base.white,
        overflow:      "hidden",
        position:      "relative",
      }}
    >
      {/* ── App bar ────────────────────────────────────────────────────────── */}
      <MobileAppBar
        page="task"
        taskNavIcon="back"
        title="View serial runs"
        onBack={() => router.back()}
      />

      {/* ── Serial details header ────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: `1px solid ${tokens.color.divider.border}`,
          flexShrink:   0,
        }}
      >
        {/* Collapsed / header row */}
        <div
          style={{
            display:     "flex",
            alignItems:  "center",
            padding:     `4px ${tokens.spacing[4]} 3px`,
          }}
        >
          <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary, flex: "1 0 0" }}>
            Serial details
          </span>
          <button
            type="button"
            onClick={() => setDetailsExpanded(e => !e)}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            tokens.spacing[1],
              background:     "transparent",
              border:         "none",
              cursor:         "pointer",
              padding:        `${tokens.spacing[2]} 0`,
              borderRadius:   tokens.borderRadius.md,
            }}
          >
            {detailsExpanded
              ? <ChevronUpIcon color={tokens.color.fg.blue} />
              : <ChevronDownIcon color={tokens.color.fg.blue} />
            }
            <span
              style={{
                fontFamily:  tokens.fontFamily.sans,
                fontSize:    "14px",
                fontWeight:  tokens.fontWeight.medium,
                lineHeight:  "20px",
                color:       tokens.color.fg.blue,
                whiteSpace:  "nowrap",
              }}
            >
              {detailsExpanded ? "Collapse" : "View details"}
            </span>
          </button>
        </div>

        {/* Expanded detail fields */}
        {detailsExpanded && (
          <div
            style={{
              paddingLeft:   tokens.spacing[4],
              paddingRight:  tokens.spacing[4],
              paddingBottom: tokens.spacing[2],
            }}
          >
            {DETAIL_FIELDS.map((field) => (
              <div
                key={field.label}
                style={{
                  display:    "flex",
                  alignItems: "flex-start",
                  padding:    `${tokens.spacing[2]} 0`,
                }}
              >
                <span
                  style={{
                    ...tokens.typography.bodyM,
                    color:   tokens.color.fg.support,
                    width:   160,
                    flexShrink: 0,
                  }}
                >
                  {field.label}
                </span>
                <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary, flex: "1 0 0" }}>
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Gray scrollable content area ─────────────────────────────────────── */}
      <div
        style={{
          flex:          "1 0 0",
          minHeight:     0,
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[2],
          background:    tokens.color.bg.lightBg,
          paddingTop:    tokens.spacing[1],
          paddingBottom: tokens.spacing[1],
          overflowY:     "auto",
        }}
      >
        {/* Product card */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        tokens.spacing[4],
            padding:    `${tokens.spacing[2]} ${tokens.spacing[4]}`,
          }}
        >
          <div
            style={{
              width:        56,
              height:       56,
              borderRadius: tokens.borderRadius.md,
              border:       `1px solid ${tokens.color.divider.border}`,
              overflow:     "hidden",
              flexShrink:   0,
              background:   tokens.color.base.white,
            }}
          >
            <img
              src="/Braided Safety Blue.webp"
              alt="Product"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 0 0", minWidth: 0 }}>
            <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Braided Safety Blue 12.7mm 1/2...
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
              <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>Teufelberger</span>
              <span aria-hidden style={{ display: "inline-block", width: "1px", height: "10px", background: tokens.color.divider.frame, flexShrink: 0 }} />
              <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>C3250-16-00600</span>
            </div>
          </div>
        </div>

        {/* Search + Scan + Sort row */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        tokens.spacing[2],
            padding:    `0 ${tokens.spacing[4]}`,
          }}
        >
          <div style={{ flex: "1 0 0", minWidth: 0 }}>
            <ScanInput placeholder="Search items" />
          </div>
          {/* Sort button */}
          <button
            type="button"
            onClick={() => setSortSheetOpen(true)}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              width:          40,
              height:         40,
              border:         `1px solid ${tokens.color.divider.frame}`,
              borderRadius:   tokens.borderRadius.md,
              background:     tokens.color.base.white,
              cursor:         "pointer",
              flexShrink:     0,
              boxShadow:      tokens.shadows.sm,
            }}
          >
            <MaskIcon
              url={icons[SORT_ICON_ID]}
              color={tokens.color.fg.primary}
              size={24}
              fallback={<SortFallbackIcon color={tokens.color.fg.primary} />}
            />
          </button>
        </div>

        {/* Serial quantity */}
        <div style={{ padding: `${tokens.spacing[2]} ${tokens.spacing[4]} 0` }}>
          <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.support }}>
            Serial quantity:{" "}
            <span style={{ color: tokens.color.fg.primary }}>5</span>
          </span>
        </div>

        {/* Serials list */}
        <div>
          {VIEW_SERIALS.map((serial) => (
            <div
              key={serial.id}
              style={{
                display:      "flex",
                alignItems:   "center",
                padding:      `${tokens.spacing[2]} ${tokens.spacing[4]}`,
                borderBottom: `1px solid ${tokens.color.divider.border}`,
              }}
            >
              {/* Serial number */}
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary, flex: "1 0 0", minWidth: 0 }}>
                {serial.number}
              </span>

              {/* Badge area: fixed width so NFC always starts at the same column */}
              {(serial.nfcAdded || serial.claimed) && (
                <div
                  style={{
                    display:     "flex",
                    alignItems:  "center",
                    gap:         tokens.spacing[4],
                    marginLeft:  tokens.spacing[4],
                    width:       180,
                    flexShrink:  0,
                  }}
                >
                  {serial.nfcAdded && (
                    <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1], flexShrink: 0 }}>
                      {icons[NFC_ICON_ID]
                        ? <img src={icons[NFC_ICON_ID]} alt="" aria-hidden width={16} height={16} style={{ display: "block", flexShrink: 0 }} />
                        : <NfcIconFallback />
                      }
                      <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>NFC added</span>
                    </div>
                  )}

                  {serial.claimed && (
                    <div style={{ background: tokens.color.tint.green, borderRadius: tokens.borderRadius.full, padding: "2px 8px", flexShrink: 0 }}>
                      <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: "12px", fontWeight: tokens.fontWeight.semiBold, lineHeight: "16px", color: tokens.color.fg.green }}>
                        Claimed
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Options CTA ──────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop:  `1px solid ${tokens.color.divider.border}`,
          padding:    tokens.spacing[4],
          background: tokens.color.base.white,
          flexShrink: 0,
        }}
      >
        <Button variant="primary" label="Options" style={{ width: "100%" }} onClick={() => setOptionsSheetOpen(true)} />
      </div>

      {/* ── Options menu sheet ───────────────────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={optionsSheetOpen}
        onClose={() => setOptionsSheetOpen(false)}
        contained
      >
        <div style={{ paddingTop: tokens.spacing[2], paddingBottom: tokens.spacing[4] }}>
          <ContextMenuItem label="Copy url for preview" iconUrl={icons[ICON_COPY]} onClick={() => setOptionsSheetOpen(false)} />
          <ContextMenuItem label="Edit order details"   iconUrl={icons[ICON_EDIT]} onClick={() => setOptionsSheetOpen(false)} />
          <ContextMenuItem label="Print labels"         iconUrl={icons[ICON_PRINT_LABEL]} divider onClick={() => setOptionsSheetOpen(false)} />
          <ContextMenuItem label="Delete serials"       iconUrl={icons[ICON_BIN]} state="destructive" onClick={() => setOptionsSheetOpen(false)} />
        </div>
      </BottomSheet>

      {/* ── Sort bottom sheet ────────────────────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        contained
      >
        <div style={{ paddingBottom: tokens.spacing[2] }}>
          {["Name ↑", "Name ↓", "Claimed status"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSortSheetOpen(false)}
              style={{
                display:     "block",
                width:       "100%",
                padding:     `${tokens.spacing[3]} ${tokens.spacing[4]}`,
                background:  "none",
                border:      "none",
                cursor:      "pointer",
                textAlign:   "left",
                fontFamily:  tokens.fontFamily.sans,
                fontSize:    "14px",
                fontWeight:  tokens.fontWeight.regular,
                lineHeight:  "20px",
                color:       tokens.color.fg.primary,
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
