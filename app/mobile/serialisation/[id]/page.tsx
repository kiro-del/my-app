// @refresh reset
"use client";
// app/mobile/serialisation/[id]/page.tsx
// Figma: nodes 174:10624, 171:16796

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { Badge } from "@/components/ui/Badge";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

// ── DS icon node IDs (design system file j8hy0yzSKPyh1yRKOh4tuU) ─────────────
const ICON_CAPTURE_SER   = "6258:3868";
const ICON_COPY          = "149:364";
const ICON_PRINT_LABEL   = "6040:1824";
const ICON_REFRESH       = "46:2937";
const ICON_BIN           = "49:967";
const ICON_CHEVRON_DOWN  = "144:817";
const ICON_NFC_TAG       = "5530:29916";
const ALL_MENU_ICON_IDS  = [ICON_CAPTURE_SER, ICON_COPY, ICON_PRINT_LABEL, ICON_REFRESH, ICON_BIN, ICON_CHEVRON_DOWN, ICON_NFC_TAG];

// ── Serial tasks data (mirrors serialisation/page.tsx) ────────────────────────

type MenuVariant = "generated" | "captured-active" | "captured-close";

interface SerialTask {
  id:          string;
  name:        string;
  date:        string;
  count:       string;
  product:     string;
  brand:       string;
  sku:         string;
  quantity:    number;
  menuVariant: MenuVariant;
}

const SERIAL_TASKS: SerialTask[] = [
  { id: "1", name: "Ultra O Locksafe / A327",                      date: "Created on May 14, 2026",   count: "100 serials",  product: "Ultra O Locksafe",                brand: "DMM",   sku: "A327",      quantity: 100, menuVariant: "captured-active" },
  { id: "2", name: "Ultra O Captive Bar Titanium/Red .../ A322-ID", date: "Created on May 12, 2026",   count: "400 serials",  product: "Ultra O Captive Bar Titanium/Red", brand: "DMM",   sku: "A322-ID",   quantity: 400, menuVariant: "generated"       },
  { id: "3", name: "Ultra O Black Kwiklock / A323BLK",              date: "Created on May 5, 2026",    count: "100 serials",  product: "Ultra O Black Kwiklock",           brand: "DMM",   sku: "A323BLK",   quantity: 100, menuVariant: "captured-active" },
  { id: "4", name: "Ultra O Locksafe / A327",                      date: "Created on April 14, 2026", count: "100 serials",  product: "Ultra O Locksafe",                brand: "DMM",   sku: "A327",      quantity: 100, menuVariant: "captured-close"  },
  { id: "5", name: "Ultra O Matt Grey Kwiklock / A323MG",           date: "Created on April 12, 2026", count: "400 serials",  product: "Ultra O Matt Grey Kwiklock",       brand: "DMM",   sku: "A323MG",    quantity: 400, menuVariant: "generated"       },
  { id: "6", name: "Trance L / HU102PR-L",                          date: "Created on April 8, 2026",  count: "400 serials",  product: "Trance L",                        brand: "Petzl", sku: "HU102PR-L", quantity: 400, menuVariant: "generated"       },
];

const STATIC_DETAILS = [
  { label: "Purchase order",    value: "1234-44"     },
  { label: "Sales order",       value: "1234-44"     },
  { label: "Date of manufacture", value: "Apr 10, 2026" },
  { label: "Batch number",      value: "323"         },
  { label: "Type",              value: "Created"     },
];

const CHUNK_SIZE = 50;

// ── Icons ─────────────────────────────────────────────────────────────────────

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.5" />
      <path d="M21 21L16.5 16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// NFC tag — lime circle with NFC wave (DS node 5530:29916)
function NfcTagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" fill={tokens.color.brand.lime} />
      <path d="M8 11.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill={tokens.color.brand.darkPurple} />
      <path d="M5.8 9.6A3 3 0 0 1 8 4.5a3 3 0 0 1 2.2 5.1" stroke={tokens.color.brand.darkPurple} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M7 8.25A1 1 0 0 1 8 6.5a1 1 0 0 1 1 1.75" stroke={tokens.color.brand.darkPurple} strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Mask icon for DS icons
function MaskIcon({
  url, color, size = 16, fallback,
}: { url?: string; color: string; size?: number; fallback: React.ReactNode }) {
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

function ChevronDownFallback({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 6L8 10.5L12.5 6" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpFallback({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 10L8 5.5L12.5 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ViewSerialsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const task = SERIAL_TASKS.find(t => t.id === id) ?? SERIAL_TASKS[0];

  const menuIcons = useFigmaIcons(ALL_MENU_ICON_IDS);

  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [optionsOpen,     setOptionsOpen]     = useState(false);
  const [captureOpen,     setCaptureOpen]     = useState(false);

  // Generate serial numbers in 001M07816826 format, split into groups of 50
  const formatSerial = (n: number) => `${String(n).padStart(3, "0")}M07816826`;
  const allSerials = Array.from({ length: task.quantity }, (_, i) => formatSerial(i + 1));
  const groups: string[][] = [];
  for (let i = 0; i < allSerials.length; i += CHUNK_SIZE) {
    groups.push(allSerials.slice(i, i + CHUNK_SIZE));
  }

  // First group expanded by default
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]));
  function toggleGroup(idx: number) {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <div
      style={{
        height:        "100dvh",
        display:       "flex",
        flexDirection: "column",
        background:    tokens.color.base.white,
        overflow:      "hidden",
      }}
    >
      {/* ── App bar ─────────────────────────────────────────────────────────── */}
      <MobileAppBar
        page="task"
        taskNavIcon="close"
        title="View serials"
        onClose={() => router.back()}
      />

      {/* ── Scrollable content ──────────────────────────────────────────────── */}
      <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>

        {/* ── Serial details section ─────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[4] }}>
            <div
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                paddingTop:     "4px",
                paddingBottom:  "3px",
              }}
            >
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>
                Serial details
              </span>
              <button
                onClick={() => setDetailsExpanded(e => !e)}
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        tokens.spacing[1],
                  background: "transparent",
                  border:     "none",
                  cursor:     "pointer",
                  padding:    `${tokens.spacing[2.5]} 0`,
                }}
              >
                {detailsExpanded
                  ? <MaskIcon url={menuIcons[ICON_CHEVRON_DOWN]} color={tokens.color.fg.blue} size={16} fallback={<ChevronUpFallback color={tokens.color.fg.blue} />} />
                  : <MaskIcon url={menuIcons[ICON_CHEVRON_DOWN]} color={tokens.color.fg.blue} size={16} fallback={<ChevronDownFallback color={tokens.color.fg.blue} />} />
                }
                <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.blue }}>
                  {detailsExpanded ? "Collapse" : "View details"}
                </span>
              </button>
            </div>
            <div style={{ height: "1px", background: tokens.color.divider.border }} />
          </div>

          {detailsExpanded && (
            <div style={{ background: tokens.color.base.white }}>
              {STATIC_DETAILS.map(({ label, value }) => (
                <div key={label} style={{ paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[4] }}>
                  <div style={{ display: "flex", alignItems: "flex-start", paddingTop: "14px", paddingBottom: "13px", gap: tokens.spacing[3] }}>
                    <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.support, width: "128px", flexShrink: 0 }}>
                      {label}
                    </span>
                    <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary, flex: "1 0 0", minWidth: 0 }}>
                      {value}
                    </span>
                  </div>
                  <div style={{ height: "1px", background: tokens.color.divider.border }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info card ──────────────────────────────────────────────── */}
        <div style={{ paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[4] }}>
          <div
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:           tokens.spacing[4],
              paddingTop:    tokens.spacing[2],
              paddingBottom: tokens.spacing[2],
            }}
          >
            <div
              style={{
                width:          "56px",
                height:         "56px",
                flexShrink:     0,
                background:     tokens.color.bg.bg,
                borderRadius:   tokens.borderRadius.md,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
              }}
            >
              <CameraIcon color={tokens.color.fg.disabled} />
            </div>

            <div style={{ flex: "1 0 0", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacing[2] }}>
              <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1], minWidth: 0 }}>
                <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {task.product}
                </span>
                <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>{task.sku}</span>
              </div>
              <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary, flexShrink: 0 }}>{task.count}</span>
            </div>
          </div>
          <div style={{ height: "1px", background: tokens.color.divider.border }} />
        </div>

        {/* ── Search bar ─────────────────────────────────────────────────────── */}
        <div style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[4]}` }}>
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          tokens.spacing[2],
              background:   tokens.color.base.white,
              border:       `1px solid ${tokens.color.divider.frame}`,
              borderRadius: tokens.borderRadius.md,
              padding:      `${tokens.spacing[2]} ${tokens.spacing[2.5]}`,
              boxShadow:    "0px 1px 4px 0px rgba(0,0,0,0.05)",
            }}
          >
            <SearchIcon color={tokens.color.fg.disabled} />
            <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.disabled, flex: "1 0 0" }}>
              Search serial number...
            </span>
          </div>
        </div>

        {/* ── Serial groups ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4], paddingBottom: tokens.spacing[4] }}>
          {groups.map((group, idx) => {
            const isExpanded = expandedGroups.has(idx);
            const first = group[0];
            const last  = group[group.length - 1];
            return (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[4], paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[4], borderBottom: isExpanded ? `1px solid ${tokens.color.divider.border}` : "none", paddingBottom: isExpanded ? tokens.spacing[4] : 0 }}>

                {/* Group header row: chevron | range | count */}
                <button
                  onClick={() => toggleGroup(idx)}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          tokens.spacing[4],
                    width:        "100%",
                    background:   "transparent",
                    border:       "none",
                    borderBottom: isExpanded ? "none" : `1px solid ${tokens.color.divider.border}`,
                    cursor:       "pointer",
                    textAlign:    "left",
                    padding:      `0 0 ${tokens.spacing[2]} 0`,
                    boxSizing:    "border-box",
                  }}
                >
                  {isExpanded
                    ? <ChevronUpFallback color={tokens.color.fg.support} />
                    : <ChevronDownFallback color={tokens.color.fg.support} />
                  }
                  <div style={{ flex: "1 0 0", display: "flex", alignItems: "center", gap: tokens.spacing[1.5], flexWrap: "wrap" }}>
                    <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>{first}</span>
                    <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>-</span>
                    <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>{last}</span>
                  </div>
                  <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support, flexShrink: 0 }}>
                    ({group.length})
                  </span>
                </button>

                {/* Serial pill badges */}
                {isExpanded && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", justifyItems: "start" }}>
                    {group.map((serial) => (
                      <Badge
                        key={serial}
                        color="gray"
                        label={serial}
                        icon={
                          menuIcons[ICON_NFC_TAG]
                            ? <img src={menuIcons[ICON_NFC_TAG]} width={16} height={16} alt="" aria-hidden />
                            : <NfcTagIcon />
                        }
                        iconPosition="leading"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Options button ───────────────────────────────────────────────────── */}
      <div style={{ background: tokens.color.base.white, borderTop: `1px solid ${tokens.color.divider.border}`, padding: tokens.spacing[4], flexShrink: 0 }}>
        <button
          onClick={() => setOptionsOpen(true)}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "100%",
            background:     tokens.color.brand.lime,
            border:         `1px solid ${tokens.color.divider.lime}`,
            borderRadius:   tokens.borderRadius.md,
            padding:        `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
            cursor:         "pointer",
          }}
        >
          <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>Options</span>
        </button>
      </div>

      {/* ── Options bottom sheet ─────────────────────────────────────────────── */}
      <BottomSheet variant="bottom-sheet-mobile" open={optionsOpen} onClose={() => setOptionsOpen(false)} contained>
        <div style={{ paddingTop: tokens.spacing[2], paddingBottom: tokens.spacing[4] }}>
          {task.menuVariant === "generated" && (
            <>
              <ContextMenuItem label="Copy url for preview" iconUrl={menuIcons[ICON_COPY]} onClick={() => setOptionsOpen(false)} />
              <ContextMenuItem label="Print labels" iconUrl={menuIcons[ICON_PRINT_LABEL]} divider onClick={() => { setOptionsOpen(false); router.push("/mobile/print-labels"); }} />
              <ContextMenuItem label="Delete serials" iconUrl={menuIcons[ICON_BIN]} state="destructive" onClick={() => setOptionsOpen(false)} />
            </>
          )}
          {task.menuVariant === "captured-active" && (
            <>
              <ContextMenuItem label="Capture serials" iconUrl={menuIcons[ICON_CAPTURE_SER]} onClick={() => setOptionsOpen(false)} />
              <ContextMenuItem label="Copy ID" iconUrl={menuIcons[ICON_COPY]} onClick={() => setOptionsOpen(false)} />
              <ContextMenuItem label="Print labels" iconUrl={menuIcons[ICON_PRINT_LABEL]} onClick={() => { setOptionsOpen(false); router.push("/mobile/print-labels"); }} />
              <ContextMenuItem label="Reload" iconUrl={menuIcons[ICON_REFRESH]} divider onClick={() => setOptionsOpen(false)} />
              <ContextMenuItem label="Delete serials" iconUrl={menuIcons[ICON_BIN]} state="destructive" onClick={() => setOptionsOpen(false)} />
            </>
          )}
          {task.menuVariant === "captured-close" && (
            <>
              <ContextMenuItem label="Open to serial capture" iconUrl={menuIcons[ICON_CAPTURE_SER]} trailing="toggle" toggleChecked={captureOpen} onToggleChange={setCaptureOpen} />
              <ContextMenuItem label="Copy ID" iconUrl={menuIcons[ICON_COPY]} onClick={() => setOptionsOpen(false)} />
              <ContextMenuItem label="Print labels" iconUrl={menuIcons[ICON_PRINT_LABEL]} onClick={() => { setOptionsOpen(false); router.push("/mobile/print-labels"); }} />
              <ContextMenuItem label="Reload" iconUrl={menuIcons[ICON_REFRESH]} divider onClick={() => setOptionsOpen(false)} />
              <ContextMenuItem label="Delete serials" iconUrl={menuIcons[ICON_BIN]} state="destructive" onClick={() => setOptionsOpen(false)} />
            </>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
