// @refresh reset
"use client";
// app/mobile/link-rope-serials/page.tsx
// Mirrors capture-serials Phase 2 (isLinkMode) — same icons, same components

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { GloryItem } from "@/components/ui/GloryItems";
import { ScanSimulationSheet } from "@/components/patterns/ScanSimulationSheet";

const SCAN_NFC_ID = "3460:9895";
const SCAN_ID     = "3953:13529";
const NFC_ADD_ID  = "2064:1089";
const BIN_ID      = "49:967";

function MaskIcon({ url, color, size = 16, fallback }: {
  url?: string; color: string; size?: number; fallback: React.ReactNode;
}) {
  if (!url) return <>{fallback}</>;
  return (
    <span aria-hidden style={{
      display: "inline-block", width: size, height: size, flexShrink: 0,
      background: color,
      maskImage: `url(${url})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
      WebkitMaskImage: `url(${url})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
    } as React.CSSProperties} />
  );
}

const ScanNfcFallback = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
    <rect x="20" y="8" width="24" height="40" rx="4" stroke={tokens.color.fg.disabled} strokeWidth="2"/>
    <rect x="24" y="14" width="16" height="24" rx="2" stroke={tokens.color.fg.disabled} strokeWidth="1.5" fill="none"/>
    <path d="M44 22c3 3 3 9 0 12" stroke={tokens.color.bg.blue} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M47 19c5 5 5 13 0 18" stroke={tokens.color.bg.blue} strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.5"/>
    <circle cx="32" cy="52" r="2" fill={tokens.color.fg.disabled}/>
  </svg>
);

const NfcFallback = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BinFallback = () => (
  <svg width="20" height="20" viewBox="0 0 16 18" fill="none" aria-hidden>
    <path d="M15 4L14.133 16.142C14.058 17.189 13.187 18 12.138 18H3.862C2.813 18 1.942 17.189 1.867 16.142L1 4M6 8V14M10 8V14M11 4V1C11 0.448 10.552 0 10 0H6C5.448 0 5 0.448 5 1V4M0 4H16"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

function SerialRow({ value, onRemove, binUrl }: { value: string; onRemove: () => void; binUrl?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2], padding: `${tokens.spacing[2.5]} ${tokens.spacing[3]}`, background: tokens.color.bg.lightBg, borderRadius: tokens.borderRadius.md }}>
      <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
        #{value}
      </span>
      <button type="button" onClick={onRemove} aria-label="Remove serial" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", padding: tokens.spacing[1], cursor: "pointer", flexShrink: 0, borderRadius: tokens.borderRadius.md }}>
        <MaskIcon url={binUrl} color={tokens.color.fg.red} size={20} fallback={<BinFallback />} />
      </button>
    </div>
  );
}

export default function LinkRopeSerialsPage() {
  const router     = useRouter();
  const serialRef  = useRef<HTMLInputElement>(null);
  const icons      = useFigmaIcons([SCAN_NFC_ID, SCAN_ID, NFC_ADD_ID, BIN_ID]);

  const [inputValue,      setInputValue]      = useState("");
  const [capturedSerials, setCapturedSerials] = useState<string[]>([]);
  const [scanOpen,        setScanOpen]        = useState(false);

  function submitSerial(value?: string) {
    const trimmed = (value ?? inputValue).trim();
    if (!trimmed) return;
    setCapturedSerials(prev => [...prev, trimmed]);
    setInputValue("");
    setTimeout(() => serialRef.current?.focus(), 0);
  }

  function handleComplete() {
    localStorage.setItem("mobileCutRopeLinked", "1");
    router.push("/mobile/serialisation");
  }

  const hasSerials = capturedSerials.length > 0;

  const pageWrapper: React.CSSProperties = {
    height: "100dvh", display: "flex", flexDirection: "column",
    background: tokens.color.base.white, overflow: "hidden", position: "relative",
  };

  const footerStyle: React.CSSProperties = {
    padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
    borderTop: `1px solid ${tokens.color.divider.border}`,
    flexShrink: 0, background: tokens.color.base.white,
  };

  return (
    <div style={pageWrapper}>
      <MobileAppBar
        page="task"
        title="Cut rope lengths"
        taskNavIcon="back"
        onBack={() => router.back()}
        onClose={() => router.back()}
      />

      {/* Input area */}
      <div style={{ padding: `${tokens.spacing[3]} ${tokens.spacing[4]} 0`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: tokens.spacing[2] }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Input
              ref={serialRef}
              label="Link serials"
              placeholder="Serial Number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onClear={inputValue ? () => setInputValue("") : undefined}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") submitSerial(); }}
              inlineButton={
                <button
                  type="button"
                  onClick={() => setScanOpen(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: tokens.spacing[1],
                    height: "100%",
                    paddingTop: tokens.spacing[2.5], paddingBottom: tokens.spacing[2.5],
                    paddingLeft: tokens.spacing[2], paddingRight: tokens.spacing[3],
                    background: tokens.color.brand.lime,
                    border: `1px solid ${tokens.color.divider.lime}`,
                    borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                    borderTopRightRadius: 0, borderBottomRightRadius: 0,
                    cursor: "pointer",
                    fontFamily: tokens.fontFamily.sans,
                    fontSize: tokens.fontSize.body,
                    fontWeight: tokens.fontWeight.medium,
                    color: tokens.color.fg.primary,
                    whiteSpace: "nowrap", flexShrink: 0,
                  } as React.CSSProperties}
                >
                  <MaskIcon url={icons[SCAN_ID]} color={tokens.color.fg.primary} size={16} fallback={<NfcFallback />} />
                  Scan
                </button>
              }
            />
          </div>

          {/* NFC button */}
          <button
            type="button"
            onClick={() => submitSerial(inputValue || "NFC-" + (Date.now() % 9000 + 1000))}
            style={{
              display: "flex", alignItems: "center", gap: tokens.spacing[1.5],
              height: "40px",
              paddingLeft: tokens.spacing[3], paddingRight: tokens.spacing[3],
              background: tokens.color.base.white,
              border: `1px solid ${tokens.color.divider.frame}`,
              borderRadius: tokens.borderRadius.md,
              fontFamily: tokens.fontFamily.sans,
              fontSize: tokens.fontSize.body,
              fontWeight: tokens.fontWeight.medium,
              color: tokens.color.fg.primary,
              cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
              boxShadow: tokens.shadows.sm,
            } as React.CSSProperties}
          >
            <MaskIcon url={icons[NFC_ADD_ID]} color={tokens.color.fg.primary} size={16} fallback={<NfcFallback />} />
            NFC
          </button>
        </div>

        {/* Add another */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: tokens.spacing[2], paddingBottom: tokens.spacing[3] }}>
          <button
            type="button"
            onClick={() => submitSerial()}
            style={{
              background: "transparent", border: "none", padding: 0,
              cursor: "pointer",
              fontFamily: tokens.fontFamily.sans,
              fontSize: tokens.fontSize.body,
              color: tokens.color.fg.blue,
              textDecoration: "underline",
            }}
          >
            Add another
          </button>
        </div>

        <div style={{ height: "1px", background: tokens.color.divider.border }} />
      </div>

      {/* Content */}
      <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>
        {!hasSerials ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: `${tokens.spacing[8]} ${tokens.spacing[6]}`, minHeight: "100%", boxSizing: "border-box" as const }}>
            <EmptyState
              size="large"
              icon={icons[SCAN_NFC_ID]
                ? <img src={icons[SCAN_NFC_ID]} width={64} height={64} alt="" aria-hidden style={{ display: "block" }} />
                : <ScanNfcFallback />}
              title="Capture multiple serials"
              description={"Begin by scanning or typing the first Serial Number. Use the 'Add NFC' button to link a tag, then repeat for all items of this product model."}
              action={<GloryItem type="chip" label="About continuous mode" onClick={() => {}} />}
            />
          </div>
        ) : (
          <div style={{ padding: `${tokens.spacing[4]} ${tokens.spacing[4]} ${tokens.spacing[2]}` }}>
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, margin: `0 0 ${tokens.spacing[2]}` }}>
              Serials to link ({capturedSerials.length}):
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1.5] }}>
              {capturedSerials.map((serial, i) => (
                <SerialRow
                  key={i}
                  value={serial}
                  onRemove={() => setCapturedSerials(prev => prev.filter((_, j) => j !== i))}
                  binUrl={icons[BIN_ID]}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ ...footerStyle, display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
        <Button
          variant={hasSerials ? "primary" : "disabled"}
          label="Complete linking"
          style={{ width: "100%" }}
          onClick={() => { if (hasSerials) handleComplete(); }}
        />
        <Button
          variant="secondary"
          label="Save and finish later"
          style={{ width: "100%" }}
          onClick={() => router.push("/mobile/serialisation")}
        />
      </div>

      {/* Scan simulation */}
      <ScanSimulationSheet
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        contained
        onDetected={value => {
          submitSerial(value);
          setScanOpen(false);
        }}
      />
    </div>
  );
}
