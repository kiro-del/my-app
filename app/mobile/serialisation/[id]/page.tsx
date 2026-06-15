// @refresh reset
"use client";
// app/mobile/serialisation/[id]/page.tsx
// Figma: nodes 91:7825 (collapsed) and 91:10465 (expanded)

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

// ── DS icon node IDs (design system file j8hy0yzSKPyh1yRKOh4tuU) ─────────────
const ICON_CAPTURE_SER = "5846:2623";
const ICON_COPY        = "149:364";
const ICON_PRINT_LABEL = "6040:1824";
const ICON_REFRESH     = "46:2937";
const ICON_BIN         = "49:967";
const ALL_MENU_ICON_IDS = [ICON_CAPTURE_SER, ICON_COPY, ICON_PRINT_LABEL, ICON_REFRESH, ICON_BIN];

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


// ── Icons ─────────────────────────────────────────────────────────────────────

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronDownIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 6L8 10.5L12.5 6" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 10L8 5.5L12.5 10" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

function SortIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 9l4-4 4 4"   stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15l4 4 4-4"  stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Static detail data (prototype) ────────────────────────────────────────────

const STATIC_DETAILS = [
  { label: "Purchase order",    value: "1234-44"     },
  { label: "Sales order",       value: "1234-44"     },
  { label: "Date of manufacture", value: "Apr 10, 2026" },
  { label: "Batch number",      value: "323"         },
  { label: "Type",              value: "Generated"   },
];

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

  // Generate serial numbers for display
  const serials = Array.from({ length: task.quantity > 30 ? 30 : task.quantity }, (_, i) =>
    String(23060000 + i)
  );

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

          {/* Section header row */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              paddingLeft:   tokens.spacing[4],
              paddingRight:  tokens.spacing[4],
            }}
          >
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
                  ? <ChevronUpIcon color={tokens.color.fg.blue} />
                  : <ChevronDownIcon color={tokens.color.fg.blue} />
                }
                <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.blue }}>
                  {detailsExpanded ? "Collapse" : "View details"}
                </span>
              </button>
            </div>

            <div style={{ height: "1px", background: tokens.color.divider.border }} />
          </div>

          {/* Expandable detail rows */}
          {detailsExpanded && (
            <div style={{ background: tokens.color.base.white }}>
              {STATIC_DETAILS.map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    paddingLeft:   tokens.spacing[4],
                    paddingRight:  tokens.spacing[4],
                  }}
                >
                  <div
                    style={{
                      display:    "flex",
                      alignItems: "flex-start",
                      paddingTop:    "14px",
                      paddingBottom: "13px",
                      gap:           tokens.spacing[3],
                    }}
                  >
                    <span
                      style={{
                        ...tokens.typography.bodyM,
                        color:      tokens.color.fg.support,
                        width:      "128px",
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        ...tokens.typography.bodyR,
                        color:   tokens.color.fg.primary,
                        flex:    "1 0 0",
                        minWidth: 0,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                  <div style={{ height: "1px", background: tokens.color.divider.border }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info + serial list ──────────────────────────────────────── */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[2],
            paddingBottom: tokens.spacing[4],
            borderBottom:  `1px solid ${tokens.color.divider.border}`,
          }}
        >
          {/* Product row */}
          <div style={{ display: "flex", flexDirection: "column", paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[4] }}>
            <div
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        tokens.spacing[4],
                paddingTop: tokens.spacing[2],
                paddingBottom: tokens.spacing[2],
              }}
            >
              {/* Product image placeholder */}
              <div
                style={{
                  width:           "56px",
                  height:          "56px",
                  flexShrink:      0,
                  background:      tokens.color.bg.bg,
                  borderRadius:    tokens.borderRadius.md,
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                }}
              >
                <CameraIcon color={tokens.color.fg.disabled} />
              </div>

              {/* Name + brand/sku */}
              <div
                style={{
                  flex:          "1 0 0",
                  minWidth:      0,
                  display:       "flex",
                  flexDirection: "column",
                  gap:           tokens.spacing[1],
                }}
              >
                <span
                  style={{
                    ...tokens.typography.bodyM,
                    color:        tokens.color.fg.primary,
                    overflow:     "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace:   "nowrap",
                  }}
                >
                  {task.product}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>
                    {task.brand}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      display:    "inline-block",
                      width:      "1px",
                      alignSelf:  "stretch",
                      background: tokens.color.divider.frame,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>
                    {task.sku}
                  </span>
                </div>
              </div>
            </div>

            {/* Serial quantity row */}
            <div
              style={{
                display:       "flex",
                gap:           tokens.spacing[1],
                paddingTop:    tokens.spacing[2],
                paddingBottom: tokens.spacing[2],
              }}
            >
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.support }}>
                Serial quantity:
              </span>
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>
                {task.quantity}
              </span>
            </div>
          </div>

          {/* Search + sort row */}
          <div
            style={{
              display:     "flex",
              alignItems:  "center",
              gap:         tokens.spacing[3],
              paddingLeft: tokens.spacing[4],
              paddingRight: tokens.spacing[4],
            }}
          >
            {/* Search input */}
            <div
              style={{
                flex:         "1 0 0",
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

            {/* Sort button */}
            <button
              style={{
                display:      "flex",
                alignItems:   "center",
                justifyContent: "center",
                background:   tokens.color.base.white,
                border:       `1px solid ${tokens.color.divider.frame}`,
                borderRadius: tokens.borderRadius.md,
                padding:      tokens.spacing[1],
                cursor:       "pointer",
                flexShrink:   0,
              }}
            >
              <SortIcon color={tokens.color.fg.primary} />
            </button>
          </div>

          {/* Serial number badge grid */}
          <div
            style={{
              display:    "flex",
              flexWrap:   "wrap",
              gap:        tokens.spacing[2],
              alignItems: "center",
              paddingLeft: tokens.spacing[4],
              paddingRight: tokens.spacing[4],
              paddingTop: tokens.spacing[2],
              paddingBottom: tokens.spacing[2],
            }}
          >
            {serials.map((serial) => (
              <span
                key={serial}
                style={{
                  ...tokens.typography.smallBodySB,
                  color:         tokens.color.fg.primary,
                  background:    tokens.color.bg.bg,
                  borderRadius:  tokens.borderRadius.full,
                  paddingTop:    tokens.spacing[0.5],
                  paddingBottom: tokens.spacing[0.5],
                  paddingLeft:   tokens.spacing[2],
                  paddingRight:  tokens.spacing[2],
                  flexShrink:    0,
                }}
              >
                {serial}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Options button ───────────────────────────────────────────────────── */}
      <div
        style={{
          background:  tokens.color.base.white,
          borderTop:   `1px solid ${tokens.color.divider.border}`,
          padding:     tokens.spacing[4],
          flexShrink:  0,
        }}
      >
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
          <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>
            Options
          </span>
        </button>
      </div>

      {/* ── Options bottom sheet ─────────────────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        contained
      >
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
              <ContextMenuItem
                label="Open to serial capture"
                iconUrl={menuIcons[ICON_CAPTURE_SER]}
                trailing="toggle"
                toggleChecked={captureOpen}
                onToggleChange={setCaptureOpen}
              />
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
