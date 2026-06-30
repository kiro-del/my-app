"use client";
// app/mobile/manage-reels/page.tsx
// Figma: MF-serialisations node 318:19640

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import tokens from "@/styles/design-tokens";
import { MobileButton } from "@/components/ui/mobile/Button";
import { ScanInput } from "@/components/ui/mobile/InputScan";
import { BadgeActionable, BadgeActionableChevronIcon } from "@/components/ui/BadgeActionable";
import { ContextMenu } from "@/components/patterns/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { ScanSimulationSheet } from "@/components/patterns/ScanSimulationSheet";
import { getReels, type StoredReel } from "@/lib/reels-store";

const ROPE_ICON_ID  = "6458:905";
const EDIT_ICON_ID  = "46:2933";
const BIN_ICON_ID   = "49:967";
const PHONE_SCAN_ID = "4094:8844";
const ARROW_LEFT_ID = "67:629";

type Reel = StoredReel;

// ── Product thumbnail ─────────────────────────────────────────────────────────

function ReelThumb({ src }: { src: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <div style={{
      width: 56, height: 56, flexShrink: 0,
      borderRadius: "6px",
      border:       `1px solid ${tokens.color.divider.border}`,
      background:   tokens.color.base.white,
      overflow:     "hidden",
      display:      "flex",
      alignItems:   "center",
      justifyContent: "center",
    }}>
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" onError={() => setErrored(true)}
          style={{ width: 48, height: 48, objectFit: "cover" }} />
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" fill={tokens.color.fg.disabled} />
          <path d="M3 15l5-4 4 3 3-2.5 6 5" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ── Reel row ──────────────────────────────────────────────────────────────────

function ReelRow({ reel, onMenuPress, isLast }: { reel: Reel; onMenuPress: () => void; isLast: boolean }) {
  return (
    <div style={{
      display:       "flex",
      alignItems:    "center",
      gap:           tokens.spacing[4],
      paddingLeft:   tokens.spacing[4],
      paddingRight:  tokens.spacing[2],
      paddingTop:    tokens.spacing[2],
      paddingBottom: tokens.spacing[2],
      borderBottom:  isLast ? "none" : `1px solid ${tokens.color.divider.border}`,
    }}>
      <ReelThumb src={reel.image} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary }}>
          {reel.name}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support, whiteSpace: "nowrap" }}>
            {reel.brand}
          </span>
          <div style={{ width: "1px", alignSelf: "stretch", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support, whiteSpace: "nowrap" }}>
            {reel.sku}
          </span>
        </div>
        <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.primary, textDecoration: "underline", whiteSpace: "nowrap" }}>
          #{reel.serial}
        </span>
      </div>

      <button
        onClick={onMenuPress}
        aria-label={`More options for ${reel.name}`}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32,
          background: "none", border: "none", cursor: "pointer",
          borderRadius: "6px", padding: tokens.spacing[1], flexShrink: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="5"  cy="12" r="1.5" fill={tokens.color.fg.support} />
          <circle cx="12" cy="12" r="1.5" fill={tokens.color.fg.support} />
          <circle cx="19" cy="12" r="1.5" fill={tokens.color.fg.support} />
        </svg>
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ManageReelsPage() {
  const router = useRouter();

  const figmaIcons   = useFigmaIcons([ROPE_ICON_ID, EDIT_ICON_ID, BIN_ICON_ID, PHONE_SCAN_ID, ARROW_LEFT_ID]);
  const ropeIconUrl  = figmaIcons[ROPE_ICON_ID];
  const editIconUrl  = figmaIcons[EDIT_ICON_ID];
  const binIconUrl   = figmaIcons[BIN_ICON_ID];
  const phoneScanUrl = figmaIcons[PHONE_SCAN_ID];
  const arrowUrl     = figmaIcons[ARROW_LEFT_ID];

  const [reels,        setReels]        = useState<Reel[]>([]);
  const [brandFilter,  setBrandFilter]  = useState(false);
  const [lengthFilter, setLengthFilter] = useState(false);
  const [menuReel,     setMenuReel]     = useState<Reel | null>(null);
  const [scanOpen,     setScanOpen]     = useState(false);

  useEffect(() => { setReels(getReels()); }, []);

  const ArrowIcon = arrowUrl ? (
    <span aria-hidden style={{
      display: "block", width: 24, height: 24, flexShrink: 0,
      background: tokens.color.base.white,
      maskImage: `url(${arrowUrl})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
      WebkitMaskImage: `url(${arrowUrl})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
    } as React.CSSProperties} />
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      height:        "100dvh",
      background:    "linear-gradient(149.26deg, #332562 11.24%, #171717 97.76%)",
      overflow:      "hidden",
      fontFamily:    tokens.fontFamily.sans,
      position:      "relative",
    }}>
      {/* App bar — transparent over dark gradient */}
      <div style={{
        height:     "56px",
        flexShrink: 0,
        display:    "flex",
        alignItems: "center",
        padding:    `0 ${tokens.spacing[1]}`,
        gap:        tokens.spacing[2],
      }}>
        <button
          onClick={() => router.back()}
          aria-label="Back"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, flexShrink: 0,
            background: "none", border: "none", cursor: "pointer",
            borderRadius: "6px", padding: tokens.spacing[2],
          }}
        >
          {ArrowIcon}
        </button>

        <span style={{
          flex: 1, minWidth: 0,
          fontFamily: tokens.fontFamily.sans, fontSize: "16px",
          fontWeight: 500, lineHeight: "22px",
          color: tokens.color.base.white,
        }}>
          Ropes - reels
        </span>

        <button
          onClick={() => router.push("/mobile/add-reel")}
          aria-label="Add reel"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 40, height: 40, flexShrink: 0,
            background: "none", border: "none", cursor: "pointer",
            borderRadius: "6px", padding: tokens.spacing[2],
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke={tokens.color.base.white} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Search + filter — light bg card, rounded top corners */}
      <div style={{
        background:           tokens.color.bg.lightBg,
        borderTopLeftRadius:  "16px",
        borderTopRightRadius: "16px",
        padding:              tokens.spacing[4],
        display:              "flex",
        flexDirection:        "column",
        gap:                  tokens.spacing[4],
        flexShrink:           0,
      }}>
        {/* Search + Scan composite */}
        <ScanInput placeholder="Search items" onScan={() => setScanOpen(true)} />

        {/* Filter chips */}
        <div style={{ display: "flex", gap: tokens.spacing[2] }}>
          <BadgeActionable
            label="Brand"
            size="big"
            selected={brandFilter}
            tailingIcon={<BadgeActionableChevronIcon color={brandFilter ? tokens.color.fg.blue : tokens.color.fg.primary} />}
            onClick={() => setBrandFilter(v => !v)}
          />
          <BadgeActionable
            label="Lengths"
            size="big"
            selected={lengthFilter}
            tailingIcon={<BadgeActionableChevronIcon color={lengthFilter ? tokens.color.fg.blue : tokens.color.fg.primary} />}
            onClick={() => setLengthFilter(v => !v)}
          />
        </div>
      </div>

      {/* List area — white, flex-fills remaining height */}
      <div style={{
        flex:          "1 1 0",
        overflowY:     "auto",
        background:    tokens.color.base.white,
        display:       "flex",
        flexDirection: "column",
      }}>
        {reels.map((reel, i) => (
          <ReelRow
            key={reel.id}
            reel={reel}
            onMenuPress={() => setMenuReel(reel)}
            isLast={i === reels.length - 1}
          />
        ))}

        <div style={{
          paddingTop:     tokens.spacing[6],
          paddingBottom:  tokens.spacing[4],
          display:        "flex",
          justifyContent: "center",
        }}>
          <MobileButton
            variant="scan-pill"
            label="Scan reel code"
            icon={phoneScanUrl
              ? <img src={phoneScanUrl} width={24} height={24} alt="" aria-hidden style={{ display: "block" }} />
              : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="9" y="2" width="13" height="20" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M1 6l8-4M1 18l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            }
            onClick={() => setScanOpen(true)}
          />
        </div>
      </div>

      {/* Context menu — reel actions */}
      <ContextMenu
        variant="bottom-sheet-mobile"
        open={menuReel !== null}
        onClose={() => setMenuReel(null)}
        contained
      >
        <ContextMenuItem
          label="Cut rope length"
          iconUrl={ropeIconUrl}
          onClick={() => {
            const id = menuReel?.id;
            setMenuReel(null);
            router.push(`/mobile/cut-rope-lengths-v2${id ? `?reelId=${id}` : ""}`);
          }}
        />
        <ContextMenuItem label="Edit info"              iconUrl={editIconUrl} onClick={() => setMenuReel(null)} />
        <ContextMenuItem label="Remove from my reels"  iconUrl={binIconUrl}  state="destructive" onClick={() => setMenuReel(null)} />
      </ContextMenu>

      {/* Scan sheet */}
      <ScanSimulationSheet
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        contained
        hint="Scan reel barcode or QR code"
        onDetected={() => setScanOpen(false)}
      />
    </div>
  );
}
