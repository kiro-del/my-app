"use client";

// components/ui/Alert.tsx
// Figma: Scannable Design System — node 215:2129
// Tones: brand | info | warning | disruptive
// Types: default | compact

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type AlertTone = "brand" | "info" | "warning" | "disruptive";
export type AlertType = "default" | "compact";

export interface AlertProps {
  tone?: AlertTone;
  type?: AlertType;
  withAction?: boolean;
  withCloseButton?: boolean;
  /** Primary heading (default: "Attention needed") */
  title?: string;
  /** Body text shown below title in default type */
  body?: string;
  /** Label for the primary action link (default type). Default: "View detail" */
  viewDetailLabel?: string;
  /** Label for the dismiss/action link. Default: "Dismiss" */
  dismissLabel?: string;
  onClose?: () => void;
  onViewDetail?: () => void;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Tone config
// ---------------------------------------------------------------------------
const TONE_CONFIG: Record<AlertTone, { bg: string; color: string; actionColor: string }> = {
  brand: {
    bg:          tokens.color.brand.lime,        // #ccff00
    color:       tokens.color.brand.darkPurple,  // #2c2258
    actionColor: tokens.color.fg.primary,        // #111827 — per Figma brand action links
  },
  info: {
    bg:          tokens.color.tint.blue,         // #eef2ff
    color:       tokens.color.fg.blue,           // #4338ca
    actionColor: tokens.color.fg.blue,
  },
  warning: {
    bg:          tokens.color.tint.yellow,       // #fffbeb
    color:       tokens.color.fg.amber,          // #b45309
    actionColor: tokens.color.fg.amber,
  },
  disruptive: {
    bg:          tokens.color.tint.red,          // #fef2f2
    color:       tokens.color.fg.red,            // #b91c1c
    actionColor: tokens.color.fg.red,
  },
};

// ---------------------------------------------------------------------------
// Inline SVG icons — no fetch required, always correct tone color
// ---------------------------------------------------------------------------

/** Circle with lowercase "i" — info tone (default type) */
const InfoCircleIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="8.5" r="1" fill={color} />
    <path d="M12 11.5v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Circle with "!" — warning & disruptive tones (default type) */
const ExclamationCircleIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <path d="M12 8v5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1" fill={color} />
  </svg>
);

/** Megaphone — brand tone, rendered inside a dark purple rounded container */
const AnnouncementIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M3 9h4l9-4.5v13L7 13H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
      stroke="white" strokeWidth="1.5" strokeLinejoin="round"
    />
    <path d="M7 13l1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 7.5c1.3.6 2 1.6 2 3.5s-.7 2.9-2 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Wifi-off — disruptive compact special state (no close, no action) */
const OfflineIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.71 5.05A16 16 0 0 1 22.56 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="20" r="1" fill={color} />
    <path d="M2 2l20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Close "×" — 12 × 12, drawn in the tone color */
const CloseXIcon = ({ color }: { color: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path d="M1 1l10 10M11 1L1 11" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function BrandIconBox() {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          "40px",
        height:         "40px",
        flexShrink:     0,
        background:     tokens.color.brand.darkPurple,
        borderRadius:   tokens.borderRadius.lg,   // 8px
        padding:        "8px",
        boxSizing:      "border-box" as const,
      }}
    >
      <AnnouncementIcon />
    </div>
  );
}

function ToneIcon({ tone, compact = false }: { tone: AlertTone; compact?: boolean }) {
  const color = TONE_CONFIG[tone].color;

  if (tone === "brand") {
    return compact ? (
      // No branded box in compact — use a plain announcement icon tinted to dark purple
      <AnnouncementIcon />
    ) : (
      <BrandIconBox />
    );
  }
  if (tone === "info") return <InfoCircleIcon color={color} />;
  return <ExclamationCircleIcon color={color} />;
}

function CloseButton({ tone, onClick }: { tone: AlertTone; onClick?: () => void }) {
  const color = TONE_CONFIG[tone].color;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          "24px",
        height:         "24px",
        flexShrink:     0,
        background:     "transparent",
        border:         "none",
        cursor:         "pointer",
        padding:        0,
      }}
    >
      <CloseXIcon color={color} />
    </button>
  );
}

function ActionLink({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background:     "transparent",
        border:         "none",
        cursor:         "pointer",
        padding:        0,
        fontFamily:     tokens.fontFamily.sans,
        fontSize:       tokens.fontSize.body,
        fontWeight:     tokens.fontWeight.medium,
        lineHeight:     tokens.lineHeight.body,
        color,
        textDecoration: "underline",
        flexShrink:     0,
      }}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
export function Alert({
  tone            = "brand",
  type            = "default",
  withAction      = false,
  withCloseButton = true,
  title           = "Attention needed",
  body            = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.",
  viewDetailLabel = "View detail",
  dismissLabel    = "Dismiss",
  onClose,
  onViewDetail,
  onDismiss,
  style,
}: AlertProps) {
  const cfg = TONE_CONFIG[tone];

  // Special case: disruptive + compact + no close + no action → "offline" state
  const isOffline =
    tone === "disruptive" && type === "compact" && !withCloseButton && !withAction;

  // ── Compact ─────────────────────────────────────────────────────────────
  if (type === "compact") {
    return (
      <div
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:         "12px",
          padding:     "16px",
          borderRadius: tokens.borderRadius.md,
          background:  cfg.bg,
          ...style,
        }}
      >
        {/* Icon */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {isOffline ? (
            <OfflineIcon color={cfg.color} />
          ) : (
            <ToneIcon tone={tone} compact />
          )}
        </div>

        {/* Text — fills available space */}
        <p
          style={{
            flex:       "1 0 0",
            minWidth:   0,
            margin:     0,
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.medium,
            lineHeight: tokens.lineHeight.body,
            color:      cfg.color,
          }}
        >
          {isOffline ? "You are offline. Check your network connection" : title}
        </p>

        {/* Action button */}
        {!isOffline && withAction && (
          <ActionLink label={dismissLabel} color={cfg.actionColor} onClick={onDismiss} />
        )}

        {/* Close button */}
        {!isOffline && withCloseButton && (
          <CloseButton tone={tone} onClick={onClose} />
        )}
      </div>
    );
  }

  // ── Default ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "flex-start",
        gap:          "12px",
        padding:      "16px",
        borderRadius: tokens.borderRadius.md,
        background:   cfg.bg,
        ...style,
      }}
    >
      {/* Icon / brand box */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        <ToneIcon tone={tone} />
      </div>

      {/* Content column */}
      <div
        style={{
          flex:          "1 0 0",
          minWidth:      0,
          display:       "flex",
          flexDirection: "column",
          gap:           withAction ? "16px" : "8px",
        }}
      >
        {/* Title + body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              margin:     0,
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,
              fontWeight: tokens.fontWeight.medium,
              lineHeight: tokens.lineHeight.body,
              color:      cfg.color,
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin:     0,
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,
              fontWeight: tokens.fontWeight.regular,
              lineHeight: tokens.lineHeight.body,
              color:      cfg.color,
            }}
          >
            {body}
          </p>
        </div>

        {/* Action links — only in default type */}
        {withAction && (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <ActionLink
              label={viewDetailLabel}
              color={cfg.actionColor}
              onClick={onViewDetail}
            />
            <ActionLink
              label={dismissLabel}
              color={cfg.actionColor}
              onClick={onDismiss}
            />
          </div>
        )}
      </div>

      {/* Close button */}
      {withCloseButton && <CloseButton tone={tone} onClick={onClose} />}
    </div>
  );
}

export default Alert;
