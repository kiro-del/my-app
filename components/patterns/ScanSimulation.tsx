"use client";
// components/patterns/ScanSimulation.tsx
// Figma: Mobile scanner simulation pattern
//
// Exports:
//   ScanView            — core camera animation only; no detected sheet.
//   ScanSimulation      — full-screen camera view + slide-up detected sheet.
//   ScanOverlay         — dark overlay over existing content; dashed frame + close button.
//                         Figma: Inventory node 8496:217947

import React, { useCallback, useEffect, useRef, useState } from "react";
import tokens from "@/styles/design-tokens";
import { Button } from "@/components/ui/Button";
import { IconClose } from "@/components/icons";

// ── Shared keyframes ───────────────────────────────────────────────────────────
// Injected once via <style> in whichever top-level component renders first.

export const SCAN_KEYFRAMES = `
  @keyframes scan-line {
    0%   { top: 12px; }
    50%  { top: calc(100% - 14px); }
    100% { top: 12px; }
  }
  @keyframes scan-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }
`;

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ScanDetectedRow {
  key:   string;
  value: string;
}

// ── ScanView props ─────────────────────────────────────────────────────────────

export interface ScanViewProps {
  /**
   * Controlled scan state. Omit to use internal auto-timer.
   * "detected" stops the scan line and calls onDetected immediately.
   */
  status?: "scanning" | "detected";
  /** ms before auto-firing onDetected (uncontrolled only). Default 1800. */
  detectionDelay?: number;
  /** Pill label above the viewfinder. Pass null to hide. Default "Product". */
  scanLabel?: string | null;
  /** Pulsing hint while scanning. */
  hint?: string;
  /** Smaller sub-hint. */
  subHint?: string;
  /** Label on the manual-entry button at the bottom. */
  manualEntryLabel?: string;
  /** Value passed to onDetected (simulates a real scan result). */
  mockValue?: string;
  /** Called with mockValue when detection fires (timer or manual). */
  onDetected?: (value: string) => void;
  onManualEntry?: () => void;
  /** Scan frame size in px. Default 220 — works in both full-screen and sheet. */
  frameSize?: number;
}

// ── ScanSimulation props ───────────────────────────────────────────────────────

export interface ScanSimulationProps {
  status?: "scanning" | "detected";
  detectionDelay?: number;
  scanLabel?: string | null;
  hint?: string;
  subHint?: string;
  mockValue?: string;
  detectedTitle?: string;
  detectedSubtitle?: string;
  detectedData?: ScanDetectedRow[];
  confirmLabel?: string;
  rescanLabel?: string;
  manualEntryLabel?: string;
  onConfirm?:     () => void;
  onRescan?:      () => void;
  onManualEntry?: () => void;
}

// ── Corner bracket ─────────────────────────────────────────────────────────────

type Corner = "tl" | "tr" | "bl" | "br";

function CornerBracket({ corner, stroke = 3, size = 32, r = 8 }: {
  corner: Corner; stroke?: number; size?: number; r?: number;
}) {
  return (
    <div style={{
      position:       "absolute",
      width:          `${size}px`,
      height:         `${size}px`,
      top:            corner === "tl" || corner === "tr" ? 0 : undefined,
      bottom:         corner === "bl" || corner === "br" ? 0 : undefined,
      left:           corner === "tl" || corner === "bl" ? 0 : undefined,
      right:          corner === "tr" || corner === "br" ? 0 : undefined,
      borderTop:      (corner === "tl" || corner === "tr") ? `${stroke}px solid #fff` : "none",
      borderBottom:   (corner === "bl" || corner === "br") ? `${stroke}px solid #fff` : "none",
      borderLeft:     (corner === "tl" || corner === "bl") ? `${stroke}px solid #fff` : "none",
      borderRight:    (corner === "tr" || corner === "br") ? `${stroke}px solid #fff` : "none",
      borderTopLeftRadius:     corner === "tl" ? `${r}px` : 0,
      borderTopRightRadius:    corner === "tr" ? `${r}px` : 0,
      borderBottomLeftRadius:  corner === "bl" ? `${r}px` : 0,
      borderBottomRightRadius: corner === "br" ? `${r}px` : 0,
    }} />
  );
}

// ── QR code icon — Figma DS node 5888:2495 ────────────────────────────────────

function QrCodeIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 135 135" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <path d="M56.25 0H0V56.25H56.25V0ZM11.25 11.25H45V45H11.25V11.25ZM33.75 101.25H22.5V112.5H33.75V101.25Z" fill="white"/>
      <path d="M56.25 78.75H0V135H56.25V78.75ZM11.25 90H45V123.75H11.25V90ZM101.25 22.5H112.5V33.75H101.25V22.5Z" fill="white"/>
      <path d="M78.75 0H135V56.25H78.75V0ZM90 11.25V45H123.75V11.25H90ZM67.5 67.5V90H78.75V101.25H67.5V112.5H90V90H101.25V112.5H112.5V101.25H135V90H101.25V67.5H67.5ZM90 90H78.75V78.75H90V90ZM135 112.5H123.75V123.75H101.25V135H135V112.5ZM90 135V123.75H67.5V135H90Z" fill="white"/>
      <path d="M112.5 78.75H135V67.5H112.5V78.75Z" fill="white"/>
    </svg>
  );
}

// ── ScanView ───────────────────────────────────────────────────────────────────
// Core camera view: dark bg, grain, scan frame + line animation, hint text,
// manual-entry button. No detected sheet — callers handle detection outcome.

export function ScanView({
  status: controlledStatus,
  detectionDelay  = 1800,
  scanLabel       = "Product",
  hint            = "Looking for QR or barcode…",
  subHint         = "Hold steady · keep label flat",
  manualEntryLabel = "Enter manually",
  mockValue       = "12344433-43",
  frameSize       = 220,
  onDetected,
  onManualEntry,
}: ScanViewProps) {
  const isControlled = controlledStatus !== undefined;
  const [internalDetected, setInternalDetected] = useState(false);
  const detected = isControlled ? controlledStatus === "detected" : internalDetected;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fire = useCallback(() => {
    if (!isControlled) setInternalDetected(true);
    onDetected?.(mockValue);
  }, [isControlled, mockValue, onDetected]);

  // Uncontrolled auto-timer
  useEffect(() => {
    if (isControlled) return;
    timerRef.current = setTimeout(fire, detectionDelay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Controlled: fire callback when status flips to "detected"
  useEffect(() => {
    if (isControlled && controlledStatus === "detected") onDetected?.(mockValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledStatus]);

  const handleManualEntry = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isControlled) setInternalDetected(true);
    onDetected?.(mockValue);
    onManualEntry?.();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <style>{SCAN_KEYFRAMES}</style>

      {/* Dark camera background */}
      <div style={{ position: "absolute", inset: 0, background: tokens.color.brand.darkGrey }} />

      {/* Depth gradients */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(50,60,80,0.55) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 75%, rgba(30,30,50,0.45) 0%, transparent 50%)
        `,
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 2px)",
      }} />

      {/* Pill label */}
      {scanLabel && (
        <div style={{ position: "absolute", top: tokens.spacing[4], left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 10 }}>
          <div style={{
            background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: tokens.borderRadius.full, padding: `${tokens.spacing[1.5]} ${tokens.spacing[3]}`,
            backdropFilter: "blur(10px)",
          }}>
            <span style={{ ...tokens.typography.smallBodyM, color: "#fff" }}>{scanLabel}</span>
          </div>
        </div>
      )}

      {/* Viewfinder frame + scan line — centred at 40% height */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${frameSize}px`, height: `${frameSize}px`,
      }}>
        <CornerBracket corner="tl" />
        <CornerBracket corner="tr" />
        <CornerBracket corner="bl" />
        <CornerBracket corner="br" />

        {/* QR code placeholder icon */}
        <div style={{ position: "absolute", inset: "24px" }}>
          <QrCodeIcon style={{ width: "100%", height: "100%" }} />
        </div>

        {!detected && (
          <div style={{
            position:     "absolute",
            left:         "10px",
            right:        "10px",
            height:       "2px",
            background:   `linear-gradient(90deg, transparent, ${tokens.color.brand.lime} 20%, ${tokens.color.brand.lime} 80%, transparent)`,
            boxShadow:    `0 0 12px ${tokens.color.brand.lime}, 0 0 22px rgba(204,255,0,0.5)`,
            borderRadius: "2px",
            animation:    "scan-line 2.4s ease-in-out infinite",
          }} />
        )}
      </div>

      {/* Hint text below frame */}
      <div style={{
        position: "absolute",
        top:      `calc(40% + ${frameSize / 2 + 16}px)`,
        left: 0, right: 0, zIndex: 6,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: tokens.spacing[1.5], padding: `0 ${tokens.spacing[6]}`, textAlign: "center",
      }}>
        <span style={{
          ...tokens.typography.bodyM, color: "#fff",
          textShadow:  "0 1px 4px rgba(0,0,0,0.6)",
          animation:   !detected ? "scan-pulse 1.4s ease-in-out infinite" : undefined,
        }}>
          {hint}
        </span>
        {!detected && (
          <span style={{ ...tokens.typography.smallBodyR, color: "rgba(255,255,255,0.6)" }}>
            {subHint}
          </span>
        )}
      </div>

    </div>
  );
}

// ── ScanSimulation — full-screen with slide-up detected sheet ──────────────────

export function ScanSimulation({
  status: controlledStatus,
  detectionDelay  = 1800,
  scanLabel       = "Product",
  hint            = "Looking for QR or barcode…",
  subHint         = "Hold steady · keep label flat",
  mockValue       = "12344433-43",
  detectedTitle   = "Product detected",
  detectedSubtitle,
  detectedData    = [],
  confirmLabel    = "Confirm",
  rescanLabel     = "Scan another",
  manualEntryLabel = "Enter manually",
  onConfirm,
  onRescan,
  onManualEntry,
}: ScanSimulationProps) {
  const isControlled = controlledStatus !== undefined;
  const [sheetMounted,  setSheetMounted]  = useState(false);
  const [sheetRevealed, setSheetRevealed] = useState(false);

  const openSheet = useCallback(() => {
    setSheetMounted(true);
    requestAnimationFrame(() => setSheetRevealed(true));
  }, []);

  const closeSheet = useCallback((then?: () => void) => {
    setSheetRevealed(false);
    setTimeout(() => { setSheetMounted(false); then?.(); }, 350);
  }, []);

  // Controlled: sync sheet to prop
  useEffect(() => {
    if (!isControlled) return;
    if (controlledStatus === "detected") openSheet();
    else closeSheet();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isControlled, controlledStatus]);

  const [scanKey, setScanKey] = useState(0);

  const handleDetected = () => openSheet();

  const handleRescan = () => {
    closeSheet(() => setScanKey(k => k + 1));
    onRescan?.();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* ScanView fills the background */}
      <ScanView
        key={scanKey}
        status={isControlled ? controlledStatus : undefined}
        detectionDelay={detectionDelay}
        scanLabel={scanLabel}
        hint={hint}
        subHint={subHint}
        mockValue={mockValue}
        manualEntryLabel={manualEntryLabel}
        frameSize={260}
        onDetected={handleDetected}
        onManualEntry={onManualEntry}
      />

      {/* Detected sheet — slides up on top of the camera view */}
      {sheetMounted && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 40,
          background: tokens.color.base.white,
          borderTopLeftRadius:  tokens.borderRadius["2xl"],
          borderTopRightRadius: tokens.borderRadius["2xl"],
          boxShadow:  tokens.shadows.upLg,
          transform:  `translateY(${sheetRevealed ? "0%" : "100%"})`,
          transition: "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
          padding:    `0 ${tokens.spacing[4]} ${tokens.spacing[8]}`,
        }}>
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: `${tokens.spacing[3]} 0 ${tokens.spacing[2]}` }}>
            <div style={{ width: "36px", height: "6px", borderRadius: "10px", background: "rgba(10,15,26,0.2)" }} />
          </div>

          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2], marginBottom: tokens.spacing[1] }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: tokens.color.brand.lime,
              boxShadow: `0 0 0 3px rgba(204,255,0,0.2)`,
              flexShrink: 0, animation: "scan-pulse 1.4s ease-in-out infinite",
            }} />
            <span style={{ ...tokens.typography.h4, color: tokens.color.fg.primary }}>{detectedTitle}</span>
          </div>

          {detectedSubtitle && (
            <span style={{ ...tokens.typography.smallBodyR, color: tokens.color.fg.support, display: "block", marginBottom: tokens.spacing[3] }}>
              {detectedSubtitle}
            </span>
          )}

          {/* Key-value card */}
          {detectedData.length > 0 && (
            <div style={{
              background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.lg,
              padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`, marginBottom: tokens.spacing[4],
            }}>
              {detectedData.map((row, i) => (
                <div key={row.key} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: `${tokens.spacing[2.5]} 0`,
                  borderBottom: i < detectedData.length - 1 ? `1px solid ${tokens.color.divider.border}` : "none",
                  gap: tokens.spacing[4],
                }}>
                  <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>{row.key}</span>
                  <span style={{ ...tokens.typography.bodyM, color: tokens.color.fg.primary, textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <Button variant="primary"   label={confirmLabel} style={{ width: "100%" }} onClick={onConfirm} />
            <Button variant="tertiary"  label={rescanLabel}  style={{ width: "100%" }} onClick={handleRescan} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── ScanOverlay ────────────────────────────────────────────────────────────────
// Full-screen solid dark background with corner-bracket scan frame, QR code
// placeholder, lime scan line, and a close button top-left.
// Figma: Inventory node 8496:217947

export interface ScanOverlayProps {
  /** Controls visibility */
  open: boolean;
  onClose: () => void;
  /**
   * Scope to position:relative parent (mobile prototype wrapper).
   * Pass `contained` when inside the 393px mobile layout.
   */
  contained?: boolean;
  /** ms before auto-firing onDetected. Default 1800. */
  detectionDelay?: number;
  /** Simulated scan result passed to onDetected. */
  mockValue?: string;
  /** Called when a scan is detected. */
  onDetected?: (value: string) => void;
}

export function ScanOverlay({
  open,
  onClose,
  contained       = false,
  detectionDelay  = 1800,
  mockValue       = "12344433-43",
  onDetected,
}: ScanOverlayProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    timerRef.current = setTimeout(() => {
      onDetected?.(mockValue);
    }, detectionDelay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const frameSize = 180;

  return (
    <div style={{
      position:   contained ? "absolute" : "fixed",
      inset:      0,
      zIndex:     50,
      background: tokens.color.brand.darkGrey,
    }}>
      <style>{SCAN_KEYFRAMES}</style>

      {/* Close button — top left */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close scanner"
        style={{
          position:       "absolute",
          top:            tokens.spacing[4],
          left:           tokens.spacing[4],
          padding:        tokens.spacing[2],
          borderRadius:   tokens.borderRadius.md,
          background:     "transparent",
          border:         "none",
          cursor:         "pointer",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <IconClose color="white" size={24} />
      </button>

      {/* Corner-bracket scan frame — centred */}
      <div style={{
        position:  "absolute",
        top:       "50%",
        left:      "50%",
        transform: "translate(-50%, -50%)",
        width:     `${frameSize}px`,
        height:    `${frameSize}px`,
      }}>
        <CornerBracket corner="tl" />
        <CornerBracket corner="tr" />
        <CornerBracket corner="bl" />
        <CornerBracket corner="br" />

        {/* QR code placeholder */}
        <div style={{ position: "absolute", inset: "24px" }}>
          <QrCodeIcon style={{ width: "100%", height: "100%" }} />
        </div>

        {/* Scan line */}
        <div style={{
          position:     "absolute",
          left:         "10px",
          right:        "10px",
          height:       "2px",
          background:   `linear-gradient(90deg, transparent, ${tokens.color.brand.lime} 20%, ${tokens.color.brand.lime} 80%, transparent)`,
          boxShadow:    `0 0 12px ${tokens.color.brand.lime}, 0 0 22px rgba(204,255,0,0.5)`,
          borderRadius: "2px",
          animation:    "scan-line 2.4s ease-in-out infinite",
        }} />
      </div>
    </div>
  );
}

export default ScanSimulation;
