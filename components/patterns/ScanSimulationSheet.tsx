"use client";
// components/patterns/ScanSimulationSheet.tsx
// Figma: Inventory — node 8494:104925
//
// Exports:
//   ScanButton           — lime inline button for <Input inlineButton={...} />
//   ScanSimulationSheet  — BottomSheet (60vh) with NFC | Scan tabs + ScanView

import React, { useState, useEffect } from "react";
import tokens from "@/styles/design-tokens";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { ScanView, SCAN_KEYFRAMES } from "@/components/patterns/ScanSimulation";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

// ── DS icon node IDs ───────────────────────────────────────────────────────────

const SCAN_ICON_ID = "3953:13529"; // Scan button icon 16px (Figma DS)

// ── ScanButton ─────────────────────────────────────────────────────────────────
// Pass as <Input inlineButton={<ScanButton onClick={() => setOpen(true)} />} />

export interface ScanButtonProps {
  onClick?:  () => void;
  disabled?: boolean;
  label?:    string;
  /** Injected by Input's cloneElement — do not set manually */
  style?:    React.CSSProperties;
}

export function ScanButton({ onClick, disabled, label = "Scan", style }: ScanButtonProps) {
  const icons = useFigmaIcons([SCAN_ICON_ID]);
  const iconUrl = icons[SCAN_ICON_ID];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display:                 "flex",
        alignItems:              "center",
        gap:                     tokens.spacing[1],
        height:                  "100%",
        paddingTop:              tokens.spacing[2.5],
        paddingBottom:           tokens.spacing[2.5],
        paddingLeft:             tokens.spacing[2],
        paddingRight:            tokens.spacing[3],
        background:              disabled ? tokens.color.bg.bg : tokens.color.brand.lime,
        border:                  disabled
          ? `1px solid ${tokens.color.divider.frame}`
          : `1px solid ${tokens.color.divider.lime}`,
        cursor:                  disabled ? "not-allowed" : "pointer",
        fontFamily:              tokens.fontFamily.sans,
        fontSize:                tokens.fontSize.body,
        fontWeight:              tokens.fontWeight.medium,
        color:                   disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
        whiteSpace:              "nowrap",
        opacity:                 disabled ? 0.5 : 1,
        flexShrink:              0,
        // Longhands — cloneElement in Input injects right-side radius via `style` below
        borderTopLeftRadius:     0,
        borderBottomLeftRadius:  0,
        borderTopRightRadius:    0,
        borderBottomRightRadius: 0,
        // Spread last so Input's cloneElement-injected radius overrides the 0s above
        ...style,
      }}
    >
      {/* Scan icon — mask-tinted from DS, fallback QR-frame SVG */}
      {iconUrl ? (
        <span
          aria-hidden
          style={{
            display:            "inline-block",
            width:              "16px",
            height:             "16px",
            flexShrink:         0,
            background:         disabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
            maskImage:          `url(${iconUrl})`,
            maskSize:           "contain",
            maskRepeat:         "no-repeat",
            maskPosition:       "center",
            WebkitMaskImage:    `url(${iconUrl})`,
            WebkitMaskSize:     "contain",
            WebkitMaskRepeat:   "no-repeat",
            WebkitMaskPosition: "center",
          } as React.CSSProperties}
        />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </button>
  );
}

// ── ScanSimulationSheet ────────────────────────────────────────────────────────

export interface ScanSimulationSheetProps {
  /** Controls sheet visibility */
  open:     boolean;
  onClose:  () => void;
  /**
   * Scope to position:relative parent (for mobile prototype wrapper).
   * Pass `contained` when using inside the 393px mobile layout.
   */
  contained?: boolean;
  // Detection
  /** ms before auto-firing onDetected. Default 1800. */
  detectionDelay?: number;
  /** Simulated scan result value passed to onDetected. */
  mockValue?: string;
  /**
   * Called when a scan is detected.
   * Typically: close the sheet and fill a field, OR set `detectedContent`
   * to show results inside the sheet.
   */
  onDetected?: (value: string) => void;
  /**
   * When provided, replaces the scan view with this content (e.g. a
   * results list). Set to null/undefined to go back to scanning.
   * The sheet stays open — the parent controls when to close it.
   */
  detectedContent?: React.ReactNode;
  // Labels
  hint?:             string;
  subHint?:          string;
  manualEntryLabel?: string;
  onManualEntry?:    () => void;
}

export function ScanSimulationSheet({
  open,
  onClose,
  contained        = false,
  detectionDelay   = 1800,
  mockValue        = "12344433-43",
  onDetected,
  detectedContent,
  hint             = "Looking for QR or barcode…",
  subHint          = "Hold steady · keep label flat",
  manualEntryLabel = "Enter manually",
  onManualEntry,
}: ScanSimulationSheetProps) {
  const [activeTab, setActiveTab] = useState("scan");

  // Re-key ScanView each time the sheet opens so the timer resets cleanly
  const [scanKey, setScanKey] = useState(0);
  useEffect(() => {
    if (open) {
      setActiveTab("scan");
      setScanKey(k => k + 1);
    }
  }, [open]);

  const tabs: TabItem[] = [
    { id: "nfc",  label: "NFC"  },
    { id: "scan", label: "Scan" },
  ];

  return (
    <BottomSheet
      variant="bottom-sheet-mobile"
      open={open}
      onClose={onClose}
      contained={contained}
    >
      <style>{SCAN_KEYFRAMES}</style>

      {/* Fixed-height container: 60vh */}
      <div style={{
        height:        "60vh",
        display:       "flex",
        flexDirection: "column",
        overflow:      "hidden",
      }}>
        {/* Tabs */}
        <Tabs
          items={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          fullWidth
        />

        {/* Tab content — fills remaining height */}
        <div style={{ flex: "1 0 0", minHeight: 0, position: "relative", overflow: "hidden" }}>

          {/* NFC tab — placeholder */}
          {activeTab === "nfc" && (
            <div style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexDirection:  "column",
              gap:            tokens.spacing[3],
              background:     tokens.color.bg.bg,
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 12h12M6 8h12M6 16h8" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" />
                <rect x="2" y="3" width="20" height="18" rx="3" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
              </svg>
              <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.disabled }}>NFC coming soon</span>
            </div>
          )}

          {/* Scan tab — ScanView OR detectedContent */}
          {activeTab === "scan" && (
            <>
              {detectedContent != null ? (
                // Detected: show results content instead of camera
                <div style={{
                  position:   "absolute",
                  inset:      0,
                  overflowY:  "auto",
                  background: tokens.color.base.white,
                }}>
                  {detectedContent}
                </div>
              ) : (
                // Scanning: show camera animation
                <div style={{ position: "absolute", inset: 0 }}>
                  <ScanView
                    key={scanKey}
                    detectionDelay={detectionDelay}
                    mockValue={mockValue}
                    scanLabel={null}
                    hint={hint}
                    subHint={subHint}
                    manualEntryLabel={manualEntryLabel}
                    frameSize={180}
                    onDetected={onDetected}
                    onManualEntry={onManualEntry}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

export default ScanSimulationSheet;
