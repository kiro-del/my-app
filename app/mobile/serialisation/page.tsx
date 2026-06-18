"use client";
// app/mobile/serialisation/page.tsx
// Figma: Serials file — node 20:6473 (Mobile / Serialisation)

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";
import { Badge } from "@/components/ui/Badge";
import { BadgeActionable, BadgeActionableChevronIcon } from "@/components/ui/BadgeActionable";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { SearchScanSheet } from "@/components/patterns/SearchScanSheet";
import { useToast } from "@/components/ui/Toast";
import type { BottomNavItemDef } from "@/components/ui/MobileBottomNav";
import type { BadgeColor } from "@/components/ui/Badge";

// ── DS icon node IDs (design system file j8hy0yzSKPyh1yRKOh4tuU) ───────────────
const FILTER_ICON_ID    = "148:822";   // Adjustments / filter icon
const HOME_ID           = "2307:2449";
const SERIALS_ID        = "94:553";
const PRODUCTS_ID       = "3628:9949"; // Products
const ME_ID             = "1613:107";
// Add-menu icons
const ICON_CREATE_SER   = "94:554";    // Create serials
const ICON_CAPTURE_SER  = "6258:3868"; // Capture serials
const ICON_ROPE_SER     = "2119:4324"; // Create cut rope serials
// Context-menu icons
const ICON_COPY         = "149:364";   // Copy
const ICON_EDIT         = "46:2933";   // Edit / pencil
const ICON_PRINT_LABEL  = "6040:1824"; // Printer label
const ICON_REFRESH      = "46:2937";   // Refresh / Reload
const ICON_BIN          = "49:967";    // Bin / Delete

const ALL_ICON_IDS = [
  FILTER_ICON_ID, HOME_ID, SERIALS_ID, PRODUCTS_ID, ME_ID,
  ICON_CREATE_SER, ICON_CAPTURE_SER, ICON_ROPE_SER,
  ICON_COPY, ICON_EDIT, ICON_PRINT_LABEL, ICON_REFRESH, ICON_BIN,
];

// ── Static data ────────────────────────────────────────────────────────────────

interface SerialTask {
  id:     string;
  name:   string;
  date:   string;
  count:  string;
  badges: { label: string; color: BadgeColor }[];
}

const SERIAL_TASKS: SerialTask[] = [
  {
    id: "1",
    name:   "Ultra O Locksafe / A327",
    date:   "Created on May 14, 2026",
    count:  "100 serials",
    badges: [
      { label: "Check printer", color: "red"   },
      { label: "Captured",      color: "gray"  },
      { label: "Active",        color: "green" },
    ],
  },
  {
    id: "2",
    name:   "Ultra O Captive Bar Titanium/Red .../ A322-ID",
    date:   "Created on May 12, 2026",
    count:  "400 serials",
    badges: [
      { label: "Complete",  color: "green" },
      { label: "Generated", color: "blue"  },
    ],
  },
  {
    id: "3",
    name:   "Ultra O Black Kwiklock / A323BLK",
    date:   "Created on May 5, 2026",
    count:  "100 serials",
    badges: [
      { label: "Captured", color: "gray"  },
      { label: "Active",   color: "green" },
    ],
  },
  {
    id: "4",
    name:   "Ultra O Locksafe / A327",
    date:   "Created on April 14, 2026",
    count:  "100 serials",
    badges: [
      { label: "Complete",  color: "green" },
      { label: "Captured",  color: "gray"  },
      { label: "Close",     color: "gray"  },
    ],
  },
  {
    id: "5",
    name:   "Ultra O Matt Grey Kwiklock / A323MG",
    date:   "Created on April 12, 2026",
    count:  "400 serials",
    badges: [
      { label: "Generated", color: "blue" },
    ],
  },
  {
    id: "6",
    name:   "Trance L / HU102PR-L",
    date:   "Created on April 8, 2026",
    count:  "400 serials",
    badges: [
      { label: "Generated", color: "blue" },
    ],
  },
];

// ── Inline mask icon helper ────────────────────────────────────────────────────

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

// ── Menu horizontal icon (24px, for "..." action button) ──────────────────────

function MenuHorizIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5"  cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <circle cx="19" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

// ── Fallback adjustments icon (16px) ─────────────────────────────────────────

function AdjustmentsFallback({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <line x1="2"  y1="4.5"  x2="14" y2="4.5"  stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2"  y1="11.5" x2="14" y2="11.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="5"  cy="4.5"  r="1.8" fill="white" stroke={color} strokeWidth="1.4" />
      <circle cx="11" cy="11.5" r="1.8" fill="white" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

// ── Menu variant ──────────────────────────────────────────────────────────────

type MenuVariant = "generated" | "captured-active" | "captured-close";

function getMenuVariant(badges: { label: string }[]): MenuVariant {
  const labels = badges.map(b => b.label);
  if (labels.includes("Generated"))  return "generated";
  if (labels.includes("Active"))     return "captured-active";
  if (labels.includes("Close"))      return "captured-close";
  return "generated";
}


// ── Page ───────────────────────────────────────────────────────────────────────

export default function SerialisationPage() {
  const router = useRouter();
  const icons = useFigmaIcons(ALL_ICON_IDS);
  const toast = useToast({ bottom: "90px" });

  const [successSheetOpen, setSuccessSheetOpen] = useState(false);

  // Show success toast/sheet when arriving from create-serials or cut-rope-lengths
  useEffect(() => {
    if (localStorage.getItem("mobileSerialCreated")) {
      localStorage.removeItem("mobileSerialCreated");
      toast.show({ variant: "success", message: "Serials captured", duration: 3000 });
    }
    if (localStorage.getItem("mobileCutRopeCreated")) {
      localStorage.removeItem("mobileCutRopeCreated");
      setSuccessSheetOpen(true);
    }
    if (localStorage.getItem("mobileCutRopeLinked")) {
      localStorage.removeItem("mobileCutRopeLinked");
      toast.show({ variant: "success", message: "Cut rope length created", duration: 3000 });
    }
    if (localStorage.getItem("mobilePrintLabels")) {
      localStorage.removeItem("mobilePrintLabels");
      toast.show({ variant: "success", message: "Printing labels...", duration: 3000 });
    }
  }, []);

  // Filter chip selected states
  const [printStatus, setPrintStatus] = useState(false);
  const [source,      setSource]      = useState(false);
  const [serialFmt,   setSerialFmt]   = useState(false);

  // Add-menu sheet
  const [addMenuOpen,   setAddMenuOpen]   = useState(false);
  const [scanSheetOpen, setScanSheetOpen] = useState(false);

  // Item context menu
  const [menuTaskId,   setMenuTaskId]   = useState<string | null>(null);
  const [captureOpen,  setCaptureOpen]  = useState(false);

  const menuTask    = SERIAL_TASKS.find(t => t.id === menuTaskId) ?? null;
  const menuVariant = menuTask ? getMenuVariant(menuTask.badges) : "generated";

  const bottomNavItems: [BottomNavItemDef, BottomNavItemDef, BottomNavItemDef, BottomNavItemDef] = [
    { id: "home",         label: "Home",          iconNodeId: HOME_ID,   onClick: () => router.push("/mobile/serials-home") },
    { id: "serialisation",label: "Serial runs", iconNodeId: SERIALS_ID,  state: "selected"      },
    { id: "products",     label: "Products",      iconNodeId: PRODUCTS_ID                              },
    { id: "me",           label: "Me",            iconNodeId: ME_ID                                },
  ];

  const chevronColor = (sel: boolean) =>
    sel ? tokens.color.fg.blue : tokens.color.fg.support;

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
      {/* ── App bar ────────────────────────────────────────────────────────── */}
      <MobileAppBar
        page="main"
        transparent
        title="Serialisation"
        actions={2}
        onAdd={() => setAddMenuOpen(true)}
      />

      {/* ── White content card ───────────────────────────────────────────────── */}
      <div
        style={{
          flex:                  "1 0 0",
          minHeight:             0,
          display:               "flex",
          flexDirection:         "column",
          background:            tokens.color.base.white,
          borderTopLeftRadius:   tokens.borderRadius["2xl"],
          borderTopRightRadius:  tokens.borderRadius["2xl"],
          overflow:              "hidden",
        }}
      >

        {/* ── Filter bar ─────────────────────────────────────────────────────── */}
        <div
          style={{
            background: tokens.color.bg.lightBg,
            paddingTop:    tokens.spacing[6],
            paddingBottom: tokens.spacing[4],
            paddingLeft:   tokens.spacing[4],
            paddingRight:  tokens.spacing[4],
            flexShrink:    0,
          }}
        >
          {/* Horizontally scrollable chip row */}
          <div
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        tokens.spacing[2],
              overflowX:  "auto",
              // Hide scrollbar cross-browser
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            } as React.CSSProperties}
          >
            {/* Filter chip — leading adjustments icon */}
            <BadgeActionable
              size="big"
              label="Filter"
              leadingIcon={
                <MaskIcon
                  url={icons[FILTER_ICON_ID]}
                  color={tokens.color.fg.primary}
                  size={16}
                  fallback={<AdjustmentsFallback color={tokens.color.fg.primary} />}
                />
              }
              style={{ flexShrink: 0 }}
            />

            {/* Vertical divider */}
            <div
              aria-hidden
              style={{
                width:      "1px",
                height:     "20px",
                background: tokens.color.divider.border,
                flexShrink: 0,
              }}
            />

            {/* Print Status ∨ */}
            <BadgeActionable
              size="big"
              label="Print Status"
              tailingIcon={<BadgeActionableChevronIcon color={chevronColor(printStatus)} />}
              selected={printStatus}
              dismissible
              onClick={()   => setPrintStatus(s => !s)}
              onDismiss={()  => setPrintStatus(false)}
              style={{ flexShrink: 0 }}
            />

            {/* Source ∨ */}
            <BadgeActionable
              size="big"
              label="Source"
              tailingIcon={<BadgeActionableChevronIcon color={chevronColor(source)} />}
              selected={source}
              dismissible
              onClick={()  => setSource(s => !s)}
              onDismiss={()  => setSource(false)}
              style={{ flexShrink: 0 }}
            />

            {/* Serial format ∨ */}
            <BadgeActionable
              size="big"
              label="Serial format"
              tailingIcon={<BadgeActionableChevronIcon color={chevronColor(serialFmt)} />}
              selected={serialFmt}
              dismissible
              onClick={()   => setSerialFmt(s => !s)}
              onDismiss={()  => setSerialFmt(false)}
              style={{ flexShrink: 0 }}
            />
          </div>
        </div>

        {/* ── Scrollable list ─────────────────────────────────────────────────── */}
        <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>
          {SERIAL_TASKS.map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(`/mobile/serialisation/${task.id}`)}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          tokens.spacing[2],
                padding:      `${tokens.spacing[3]} ${tokens.spacing[4]}`,
                borderBottom: `1px solid ${tokens.color.divider.border}`,
                cursor:       "pointer",
              }}
            >
              {/* Text block */}
              <div
                style={{
                  flex:          "1 0 0",
                  minWidth:      0,
                  display:       "flex",
                  flexDirection: "column",
                  gap:           tokens.spacing[1],
                }}
              >
                {/* Title */}
                <span
                  style={{
                    ...tokens.typography.bodyM,
                    color:        tokens.color.fg.primary,
                    overflow:     "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace:   "nowrap",
                  }}
                >
                  {task.name}
                </span>

                {/* Subtitle — date | divider | count */}
                <div
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        tokens.spacing[1],
                  }}
                >
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>
                    {task.date}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      display:    "inline-block",
                      width:      "1px",
                      height:     "12px",
                      background: tokens.color.divider.frame,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support }}>
                    {task.count}
                  </span>
                </div>

                {/* Badge row */}
                <div
                  style={{
                    display:    "flex",
                    flexWrap:   "wrap",
                    gap:        tokens.spacing[1],
                  }}
                >
                  {task.badges.map((badge) => (
                    <Badge
                      key={badge.label}
                      label={badge.label}
                      color={badge.color}
                    />
                  ))}
                </div>
              </div>

              {/* "..." action button */}
              <div
                style={{ flexShrink: 0 }}
                onClick={(e) => { e.stopPropagation(); setMenuTaskId(task.id); }}
              >
                <Button
                  variant="icon"
                  icon={<MenuHorizIcon color={tokens.color.fg.support} />}
                />
              </div>
            </div>
          ))}
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
            iconUrl={icons[ICON_CREATE_SER]}
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
            onClick={() => { setAddMenuOpen(false); router.push("/mobile/cut-rope-lengths"); }}
          />
        </div>
      </BottomSheet>

      {/* ── Item context menu sheet ─────────────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={menuTaskId !== null}
        onClose={() => setMenuTaskId(null)}
        contained
      >
        <div style={{ paddingTop: tokens.spacing[2], paddingBottom: tokens.spacing[4] }}>
          {menuVariant === "generated" && (
            <>
              <ContextMenuItem label="Copy url for preview" iconUrl={icons[ICON_COPY]} onClick={() => setMenuTaskId(null)} />
              <ContextMenuItem label="Edit order details" iconUrl={icons[ICON_EDIT]} onClick={() => { setMenuTaskId(null); router.push("/mobile/edit-order-details"); }} />
              <ContextMenuItem label="Print labels" iconUrl={icons[ICON_PRINT_LABEL]} divider onClick={() => { setMenuTaskId(null); router.push("/mobile/print-labels"); }} />
              <ContextMenuItem label="Delete serials" iconUrl={icons[ICON_BIN]} state="destructive" onClick={() => setMenuTaskId(null)} />
            </>
          )}
          {menuVariant === "captured-active" && (
            <>
              <ContextMenuItem label="Capture serials" iconUrl={icons[ICON_CAPTURE_SER]} onClick={() => { const name = menuTask?.name ?? ""; setMenuTaskId(null); router.push(`/mobile/capture-serials?mode=capture&task=${encodeURIComponent(name)}`); }} />
              <ContextMenuItem label="Copy ID" iconUrl={icons[ICON_COPY]} onClick={() => setMenuTaskId(null)} />
              <ContextMenuItem label="Print labels" iconUrl={icons[ICON_PRINT_LABEL]} onClick={() => { setMenuTaskId(null); router.push("/mobile/print-labels"); }} />
              <ContextMenuItem label="Reload" iconUrl={icons[ICON_REFRESH]} divider onClick={() => setMenuTaskId(null)} />
              <ContextMenuItem label="Delete serials" iconUrl={icons[ICON_BIN]} state="destructive" onClick={() => setMenuTaskId(null)} />
            </>
          )}
          {menuVariant === "captured-close" && (
            <>
              <ContextMenuItem
                label="Open to serial capture"
                iconUrl={icons[ICON_CAPTURE_SER]}
                trailing="toggle"
                toggleChecked={captureOpen}
                onToggleChange={setCaptureOpen}
              />
              <ContextMenuItem label="Copy ID" iconUrl={icons[ICON_COPY]} onClick={() => setMenuTaskId(null)} />
              <ContextMenuItem label="Print labels" iconUrl={icons[ICON_PRINT_LABEL]} onClick={() => { setMenuTaskId(null); router.push("/mobile/print-labels"); }} />
              <ContextMenuItem label="Reload" iconUrl={icons[ICON_REFRESH]} divider onClick={() => setMenuTaskId(null)} />
              <ContextMenuItem label="Delete serials" iconUrl={icons[ICON_BIN]} state="destructive" onClick={() => setMenuTaskId(null)} />
            </>
          )}
        </div>
      </BottomSheet>

      {/* ── Search / scan sheet ──────────────────────────────────────────────── */}
      <SearchScanSheet
        open={scanSheetOpen}
        onClose={() => setScanSheetOpen(false)}
        contained
      />

      {/* ── Toast notifications ──────────────────────────────────────────────── */}
      <toast.ToastContainer />

      {/* ── Serials generated success sheet ─────────────────────────────────── */}
      <BottomSheet
        variant="bottom-sheet-mobile"
        open={successSheetOpen}
        onClose={() => setSuccessSheetOpen(false)}
        contained
      >
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[4],
          paddingTop:    tokens.spacing[2],
          paddingLeft:   tokens.spacing[4],
          paddingRight:  tokens.spacing[4],
          paddingBottom: tokens.spacing[6],
        }}>
          {/* Success icon */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: tokens.spacing[2] }}>
            <div style={{
              width:          56,
              height:         56,
              borderRadius:   tokens.borderRadius.full,
              background:     tokens.color.tint.green,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                <path d="M6 14l6 6 10-12" stroke={tokens.color.fg.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h2 style={{ margin: 0, ...tokens.typography.h3, color: tokens.color.fg.primary, textAlign: "center" }}>
            Serials generated!
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>Label preview</span>
            <div style={{
              display:        "flex",
              justifyContent: "center",
              padding:        tokens.spacing[4],
              background:     tokens.color.bg.lightBg,
              borderRadius:   tokens.borderRadius.lg,
            }}>
              <img src="/label.png" alt="Label preview" style={{ height: 200, width: "auto", display: "block" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2] }}>
            <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support, flex: "0 0 auto" }}>Printer:</span>
            <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>Sato CT4-LX</span>
          </div>

          <Button
            variant="primary"
            label="Print NFC rope label"
            onClick={() => { setSuccessSheetOpen(false); router.push("/mobile/print-labels"); }}
            style={{ width: "100%" }}
          />
          <button
            onClick={() => { setSuccessSheetOpen(false); router.push("/mobile/edit-order-details"); }}
            style={{
              background:     "transparent",
              border:         "none",
              cursor:         "pointer",
              fontFamily:     tokens.fontFamily.sans,
              fontSize:       "14px",
              fontWeight:     tokens.fontWeight.medium,
              lineHeight:     "20px",
              color:          tokens.color.fg.blue,
              textDecoration: "underline",
              textAlign:      "center",
              width:          "100%",
            }}
          >
            Edit order details
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
