"use client";

// components/ui/SectionHeader.tsx
// Figma: Scannable Design System — node 171:383
// Use as: modal header, side-panel header, or section header.
//
// Props drive everything — no variant enum needed:
//   onBack       → shows ← button on the left
//   decoIconTone → shows the 40px design system DecoIcon left of the title
//   subtitle     → shows a second line below the title
//   onMore       → shows ··· button on the right
//   onClose      → shows × button on the right (after ···)

import React from "react";
import tokens from "@/styles/design-tokens";
import { IconClose, IconArrowLeft, IconMenuHorizontal } from "@/components/icons";
import { DecoIcon, type DecoIcon40Tone } from "@/components/ui/DecoIcon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SectionHeaderProps {
  /** Main heading — always required */
  title: string;
  /** Secondary line beneath the title (14px/regular/#6b7280) */
  subtitle?: string;
  /**
   * Tone for the 40px design system DecoIcon shown left of the title.
   * Typed to the available 40px tones — component renders DecoIcon internally.
   */
  decoIconTone?: DecoIcon40Tone;
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
  padding:        tokens.spacing[1],
  background:     "transparent",
  border:         "none",
  borderRadius:   tokens.borderRadius.md,
  cursor:         "pointer",
  flexShrink:     0,
};

// ---------------------------------------------------------------------------
// SectionHeader
// ---------------------------------------------------------------------------

export function SectionHeader({
  title,
  subtitle,
  decoIconTone,
  onBack,
  onMore,
  onClose,
  style,
}: SectionHeaderProps) {
  const hasSubtitle  = Boolean(subtitle);
  const hasDecoIcon  = Boolean(decoIconTone);
  const verticalPadding = tokens.spacing[5]; // 20px

  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          tokens.spacing[2],
        padding:      `${verticalPadding} ${tokens.spacing[4]}`,
        background:   tokens.color.base.white,
        borderBottom: `1px solid ${tokens.color.divider.border}`,
        ...style,
      }}
    >
      {/* ── Left: back button ─────────────────────────────────────── */}
      {onBack && (
        <button type="button" onClick={onBack} aria-label="Go back" style={ICON_BTN}>
          <IconArrowLeft color={tokens.color.fg.primary} />
        </button>
      )}

      {/* ── Left: DecoIcon (40px, from design system) ─────────────── */}
      {hasDecoIcon && (
        <DecoIcon size="40" tone={decoIconTone} />
      )}

      {/* ── Centre: title [+ subtitle] ────────────────────────────── */}
      <div
        style={{
          flex:          "1 0 0",
          minWidth:      0,
          display:       "flex",
          flexDirection: "column",
          gap:           hasSubtitle ? tokens.spacing[1] : undefined,
        }}
      >
        <p
          style={{
            margin:       0,
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.h3,
            fontWeight:   tokens.fontWeight.medium,
            lineHeight:   tokens.lineHeight.h3,
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
              fontSize:     tokens.fontSize.body,
              fontWeight:   tokens.fontWeight.regular,
              lineHeight:   tokens.lineHeight.body,
              color:        tokens.color.fg.support,
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
        <button type="button" onClick={onMore} aria-label="More options" style={ICON_BTN}>
          <IconMenuHorizontal color={tokens.color.fg.primary} />
        </button>
      )}

      {/* ── Right: close button ───────────────────────────────────── */}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close" style={ICON_BTN}>
          <IconClose color={tokens.color.fg.primary} />
        </button>
      )}
    </div>
  );
}

export default SectionHeader;
