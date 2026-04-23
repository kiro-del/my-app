"use client";

// components/ui/SectionHeader.tsx
// Figma: Scannable Design System — node 171:383
// Use as: modal header, side-panel header, or section header.
//
// Props drive everything — no variant enum needed:
//   onBack    → shows ← button on the left
//   decoIcon  → shows indigo icon box left of the title
//   subtitle  → shows a second line below the title
//   onMore    → shows ··· button on the right
//   onClose   → shows × button on the right (after ···)

import React from "react";
import tokens from "@/styles/design-tokens";
import { IconClose, IconArrowLeft, IconMenuHorizontal } from "@/components/icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SectionHeaderProps {
  /** Main heading — always required */
  title: string;
  /** Secondary line beneath the title (14px/regular/#6b7280) */
  subtitle?: string;
  /** Icon node rendered inside the indigo 40×40 deco box */
  decoIcon?: React.ReactNode;
  /** Back-arrow button on the left — provide handler to show it */
  onBack?: () => void;
  /** ··· more-options button on the right — provide handler to show it */
  onMore?: () => void;
  /** × close button on the right — provide handler to show it */
  onClose?: () => void;
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const ICON_BTN: React.CSSProperties = {
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  width:          "32px",
  height:         "32px",
  padding:        tokens.spacing[1],    // 4px
  background:     "transparent",
  border:         "none",
  borderRadius:   tokens.borderRadius.md, // 6px
  cursor:         "pointer",
  flexShrink:     0,
};

// ---------------------------------------------------------------------------
// SectionHeader
// ---------------------------------------------------------------------------

export function SectionHeader({
  title,
  subtitle,
  decoIcon,
  onBack,
  onMore,
  onClose,
  style,
}: SectionHeaderProps) {
  const hasSubtitle = Boolean(subtitle);
  const hasDecoIcon = Boolean(decoIcon);
  // Figma node 171:383 — all variants use spacing-5 (20px) vertical padding
  const verticalPadding = tokens.spacing[5]; // 20px

  return (
    <div
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           tokens.spacing[2],          // 8px
        padding:       `${verticalPadding} ${tokens.spacing[4]}`, // v h
        background:    tokens.color.base.white,
        borderBottom:  `1px solid ${tokens.color.divider.border}`,
        ...style,
      }}
    >
      {/* ── Left: back button ─────────────────────────────────────── */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          style={ICON_BTN}
        >
          <IconArrowLeft color={tokens.color.fg.primary} />
        </button>
      )}

      {/* ── Left: deco icon box ───────────────────────────────────── */}
      {hasDecoIcon && (
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "40px",
            height:         "40px",
            flexShrink:     0,
            background:     tokens.color.bg.blue,     // #6366f1
            borderRadius:   tokens.borderRadius.lg,   // 8px
            padding:        tokens.spacing[2],        // 8px
          }}
        >
          {decoIcon}
        </div>
      )}

      {/* ── Centre: title [+ subtitle] ────────────────────────────── */}
      <div
        style={{
          flex:          "1 0 0",
          minWidth:      0,
          display:       "flex",
          flexDirection: "column",
          gap:           hasSubtitle ? tokens.spacing[1] : undefined, // 4px
        }}
      >
        <p
          style={{
            margin:       0,
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.h3,          // 20px
            fontWeight:   tokens.fontWeight.medium,    // 500
            lineHeight:   tokens.lineHeight.h3,        // 28px
            color:        tokens.color.fg.primary,
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}
        >
          {title}
        </p>

        {hasSubtitle && (
          <p
            style={{
              margin:       0,
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,       // 14px
              fontWeight:   tokens.fontWeight.regular,  // 400
              lineHeight:   tokens.lineHeight.body,     // 20px
              color:        tokens.color.fg.support,    // #6b7280
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Right: more button ────────────────────────────────────── */}
      {onMore && (
        <button
          type="button"
          onClick={onMore}
          aria-label="More options"
          style={ICON_BTN}
        >
          <IconMenuHorizontal color={tokens.color.fg.primary} />
        </button>
      )}

      {/* ── Right: close button ───────────────────────────────────── */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={ICON_BTN}
        >
          <IconClose color={tokens.color.fg.primary} />
        </button>
      )}
    </div>
  );
}

export default SectionHeader;
