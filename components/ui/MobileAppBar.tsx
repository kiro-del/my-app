"use client";
// components/ui/MobileAppBar.tsx
// Figma: Scannable Design System — node 2475:7759 (Mobile / Top App Bar)
// All values reference design-tokens — never hardcoded.
//
// Color rules from Figma:
//   Dark bg (home / main / account):  text=white, action icons=lime, nav icons=white
//   Light bg (task):                  text=fg.primary, all icons=fg.primary

import React from "react";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { Badge } from "@/components/ui/Badge";

// ── Figma DS node IDs ─────────────────────────────────────────────────────────

const SQUIRCLE_ID    = "2307:2312"; // Scannable squircle brand logo 24px
const MULTISCAN_ID   = "92:796";    // Multi-scan icon 24px  (DS node 92:796)
const ARROW_LEFT_ID  = "67:629";    // Arrow left icon 24px  (DS node 67:629)

// ── Inline SVG icons — only icons not available as DS nodes ──────────────────

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AddIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MenuHorizontalIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5"  cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <circle cx="19" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

function SelectorIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 9l4-4 4 4"  stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Tap-target button wrapper ─────────────────────────────────────────────────

function IconBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "40px", height: "40px",
        padding: tokens.spacing[2],
        background: "transparent", border: "none", cursor: "pointer",
        borderRadius: tokens.borderRadius.md, flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type MobileAppBarPage = "home" | "main" | "task" | "account";

export interface MobileAppBarProps {
  page:            MobileAppBarPage;
  /** Number of action icon buttons on the right (0–3) */
  actions?:        0 | 1 | 2 | 3;
  /** Show back ← (main) or close × (task) on the left */
  withBackIcon?:   boolean;
  /** Show a secondary sub-text line beneath the title */
  subText?:        boolean;
  title?:          string;
  subTextContent?: string;
  /** Version string shown in the account page badge (e.g. "2.24.0") */
  version?:        string;
  /** Transparent background — use when floating over a dark gradient */
  transparent?:    boolean;
  /**
   * For page="task" only: swap the default × close button for a ← back arrow.
   * Default is "close".
   */
  taskNavIcon?:    "close" | "back";
  onBack?:         () => void;
  onClose?:        () => void;
  onAdd?:          () => void;
  onMore?:         () => void;
  onMultiScan?:    () => void;
}

// ── MobileAppBar ──────────────────────────────────────────────────────────────

export function MobileAppBar({
  page,
  actions = 0,
  withBackIcon = false,
  taskNavIcon = "close",
  subText = false,
  title,
  subTextContent,
  version = "2.24.0",
  transparent = false,
  onBack,
  onClose,
  onAdd,
  onMore,
  onMultiScan,
}: MobileAppBarProps) {
  const figma = useFigmaIcons([SQUIRCLE_ID, MULTISCAN_ID, ARROW_LEFT_ID]);

  const isHome    = page === "home";
  const isMain    = page === "main";
  const isTask    = page === "task";
  const isAccount = page === "account";
  const isDark    = !isTask || transparent;  // task page has white bg unless transparent=true

  // ── Color palette by bg ───────────────────────────────────────────────────
  const bgColor      = transparent ? "transparent" : (isDark ? tokens.color.brand.darkGrey : tokens.color.base.white);
  const textColor    = isDark ? tokens.color.base.white       : tokens.color.fg.primary;
  const subColor     = isDark ? tokens.color.fgReverse.support : tokens.color.fg.support;
  // Nav icons (back arrow, close, selector) → white on dark, primary on light
  const navColor     = isDark ? tokens.color.base.white       : tokens.color.fg.primary;
  // Action icons (add, dots, multi-scan) → lime on dark, primary on light
  const actionColor  = isDark ? tokens.color.brand.lime       : tokens.color.fg.primary;

  // ── Resolved title / sub-text ─────────────────────────────────────────────
  const resolvedTitle = title ?? (
    isHome    ? "Wanaka Height Safety"
    : isAccount ? "My Account"
    : isTask    ? "Title"
    : withBackIcon ? "Auckland"      // main + back → location name
    : "All Inventory"                // main + no back → page name
  );
  const resolvedSub = subTextContent ?? (
    isTask ? "Sub text" : "5/9 Checked Off Sep 24, 2025"
  );

  // ── Squircle logo — brand logo, renders with own colors ───────────────────
  const SquircleImg = figma[SQUIRCLE_ID]
    ? <img src={figma[SQUIRCLE_ID]} alt="Scannable" width={24} height={24} style={{ display: "block", flexShrink: 0 }} />
    : <div style={{ width: 24, height: 24, background: tokens.color.brand.lime, borderRadius: "5px", flexShrink: 0 }} />;

  // ── Shared mask helper ────────────────────────────────────────────────────
  const MaskIcon = (url: string, color: string, fallback: React.ReactNode) =>
    url ? (
      <span
        aria-hidden
        style={{
          display: "inline-block", width: "24px", height: "24px", flexShrink: 0,
          background: color,
          maskImage: `url(${url})`, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
          WebkitMaskImage: `url(${url})`, WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
        } as React.CSSProperties}
      />
    ) : fallback;

  // ── Arrow left — DS node 67:629 ───────────────────────────────────────────
  const ArrowLeftIcon = MaskIcon(
    figma[ARROW_LEFT_ID],
    actionColor,
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke={actionColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  );

  // ── Multi-scan — DS node 92:796 ───────────────────────────────────────────
  const MultiScanIcon = MaskIcon(
    figma[MULTISCAN_ID],
    actionColor,
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3"  y="3"  width="8" height="8" rx="1.5" stroke={actionColor} strokeWidth="1.6" />
      <rect x="13" y="3"  width="8" height="8" rx="1.5" stroke={actionColor} strokeWidth="1.6" />
      <rect x="3"  y="13" width="8" height="8" rx="1.5" stroke={actionColor} strokeWidth="1.6" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke={actionColor} strokeWidth="1.6" />
    </svg>,
  );

  // ── Container style ───────────────────────────────────────────────────────
  const base: React.CSSProperties = {
    display: "flex", alignItems: "center", position: "relative",
    width: "100%", boxSizing: "border-box", background: bgColor,
  };

  let containerStyle: React.CSSProperties;
  if (isTask) {
    containerStyle = { ...base, height: "56px", justifyContent: "center", padding: `0 ${tokens.spacing[4]}` };
  } else if (isAccount) {
    containerStyle = { ...base, height: "56px", gap: tokens.spacing[2], paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[1], paddingTop: tokens.spacing[4], paddingBottom: tokens.spacing[4] };
  } else if (isHome && actions === 0) {
    containerStyle = { ...base, padding: tokens.spacing[4] };
  } else if (isMain && withBackIcon) {
    containerStyle = { ...base, gap: tokens.spacing[2], padding: `${tokens.spacing[2]} ${tokens.spacing[1]}` };
  } else {
    containerStyle = { ...base, gap: tokens.spacing[2], paddingLeft: tokens.spacing[4], paddingRight: tokens.spacing[1], paddingTop: tokens.spacing[2], paddingBottom: tokens.spacing[2] };
  }

  return (
    <div style={containerStyle}>

      {/* ── LEFT: back ← (main) or close × (task) ─────────────────────────── */}
      {isMain && withBackIcon && (
        <IconBtn onClick={onBack}>{ArrowLeftIcon}</IconBtn>
      )}
      {isTask && (
        <div style={{ position: "absolute", left: tokens.spacing[1], top: "50%", transform: "translateY(-50%)" }}>
          {taskNavIcon === "back"
            ? <IconBtn onClick={onBack}>{ArrowLeftIcon}</IconBtn>
            : <IconBtn onClick={onClose}><CloseIcon color={actionColor} /></IconBtn>
          }
        </div>
      )}

      {/* ── CENTRE: home — squircle + org name + selector ──────────────────── */}
      {isHome && (
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2], flex: "1 0 0", minWidth: 0 }}>
          {SquircleImg}
          <span style={{ ...tokens.typography.h5, color: textColor, whiteSpace: "nowrap" }}>{resolvedTitle}</span>
          <SelectorIcon color={actionColor} />
        </div>
      )}

      {/* ── CENTRE: main — title (+ optional sub-text) ─────────────────────── */}
      {isMain && !subText && (
        <span style={{ ...tokens.typography.h5, color: textColor, flex: "1 0 0", minWidth: 0 }}>{resolvedTitle}</span>
      )}
      {isMain && subText && (
        <div style={{ display: "flex", flexDirection: "column", flex: "1 0 0", minWidth: 0 }}>
          <span style={{ ...tokens.typography.h5, color: textColor }}>{resolvedTitle}</span>
          <span style={{ ...tokens.typography.smallBodyR, color: subColor }}>{resolvedSub}</span>
        </div>
      )}

      {/* ── CENTRE: account — title ────────────────────────────────────────── */}
      {isAccount && (
        <span style={{ ...tokens.typography.h5, color: textColor, flex: "1 0 0", minWidth: 0 }}>{resolvedTitle}</span>
      )}

      {/* ── CENTRE: task — centered title + optional sub-text ──────────────── */}
      {isTask && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ ...tokens.typography.h5, color: textColor }}>{resolvedTitle}</span>
          {subText && (
            <span style={{ ...tokens.typography.smallBodyR, color: subColor }}>{resolvedSub}</span>
          )}
        </div>
      )}

      {/* ── RIGHT: home — multi-scan icon ──────────────────────────────────── */}
      {isHome && actions >= 1 && (
        <IconBtn onClick={onMultiScan}>{MultiScanIcon}</IconBtn>
      )}

      {/* ── RIGHT: main — action buttons ────────────────────────────────────── */}
      {/* no-back:   1→[+]  2→[···][+]  3→[···][···][+]                        */}
      {/* with-back: 1→[+]  2→[···][+]  3→[···][⊞][+]                         */}
      {isMain && actions >= 2 && (
        <IconBtn onClick={onMore}><MenuHorizontalIcon color={actionColor} /></IconBtn>
      )}
      {isMain && actions === 3 && !withBackIcon && (
        <IconBtn onClick={onMore}><MenuHorizontalIcon color={actionColor} /></IconBtn>
      )}
      {isMain && actions === 3 && withBackIcon && (
        <IconBtn onClick={onMultiScan}>{MultiScanIcon}</IconBtn>
      )}
      {isMain && actions >= 1 && (
        <IconBtn onClick={onAdd}><AddIcon color={actionColor} /></IconBtn>
      )}

      {/* ── RIGHT: account — version badge (DS Badge, lime variant) ────────── */}
      {isAccount && (
        <Badge color="lime" label={`v ${version}`} />
      )}

      {/* ── RIGHT: task — actions (absolutely positioned right) ────────────── */}
      {isTask && actions >= 1 && (
        <div style={{ position: "absolute", right: tokens.spacing[1], top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          {actions >= 2 && <IconBtn onClick={onMore}><MenuHorizontalIcon color={actionColor} /></IconBtn>}
          <IconBtn onClick={onAdd}><AddIcon color={actionColor} /></IconBtn>
        </div>
      )}
    </div>
  );
}
