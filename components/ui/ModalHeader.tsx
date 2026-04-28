// components/ui/ModalHeader.tsx
// Figma: Scannable Design System — node 2103:2361 (Modal Header)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";
import { GloryItem } from "@/components/ui/GloryItems";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ModalHeaderProps {
  title: string;
  /** Optional description text below the title */
  bodyText?: string;
  /**
   * When true, shows a GloryItems badge chip above the title and
   * centres the content block horizontally.
   */
  withBadge?: boolean;
  /** Label for the GloryItems badge (only rendered when withBadge=true) */
  badgeLabel?: string;
  /** Called when the close × button is clicked */
  onClose?: () => void;
}

// ---------------------------------------------------------------------------
// CloseIcon — 24px × mark
// ---------------------------------------------------------------------------
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ModalHeader
// ---------------------------------------------------------------------------
export function ModalHeader({
  title,
  bodyText,
  withBadge = false,
  badgeLabel = "New",
  onClose,
}: ModalHeaderProps) {
  const hasBodyText = Boolean(bodyText);
  const isCentered = withBadge;

  return (
    <div
      style={{
        position:   "relative",
        width:      "100%",
        boxSizing:  "border-box",
        paddingTop:    tokens.spacing[6],   // 24px
        paddingBottom: tokens.spacing[4],   // 16px
        paddingLeft:   tokens.spacing[6],   // 24px
        paddingRight:  tokens.spacing[6],
        background:    tokens.color.base.white,
      }}
    >
      {/* Close button — absolute top-right, p-4, rounded-md */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position:      "absolute",
            top:           tokens.spacing[3],    // 12px
            right:         tokens.spacing[3],
            display:       "flex",
            alignItems:    "center",
            justifyContent:"center",
            padding:       tokens.spacing[1],    // 4px
            borderRadius:  tokens.borderRadius.md,
            background:    "transparent",
            border:        "none",
            cursor:        "pointer",
            color:         tokens.color.fg.support,
            transition:    "background 150ms ease, color 150ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = tokens.color.bg.bg;
            (e.currentTarget as HTMLButtonElement).style.color = tokens.color.fg.primary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = tokens.color.fg.support;
          }}
        >
          <CloseIcon />
        </button>
      )}

      {/* Content area */}
      <div
        style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     isCentered ? "center" : "flex-start",
          gap:            withBadge ? tokens.spacing[4] : hasBodyText ? tokens.spacing[2] : "0",
          // Reserve space for close button on the right when not centred
          paddingRight:   !isCentered && onClose ? tokens.spacing[8] : "0",
        }}
      >
        {/* Badge chip — only when withBadge */}
        {withBadge && (
          <GloryItem type="chip" label={badgeLabel} />
        )}

        {/* Title */}
        <h2
          style={{
            margin:      0,
            fontFamily:  tokens.fontFamily.sans,
            fontSize:    tokens.fontSize.h4,       // 18px
            fontWeight:  tokens.fontWeight.semiBold, // 600
            lineHeight:  tokens.lineHeight.h4,     // 24px
            color:       tokens.color.fg.primary,
            textAlign:   isCentered ? "center" : "left",
          }}
        >
          {title}
        </h2>

        {/* Body text */}
        {hasBodyText && (
          <p
            style={{
              margin:      0,
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.body,     // 14px
              fontWeight:  tokens.fontWeight.regular, // 400
              lineHeight:  tokens.lineHeight.body,   // 20px
              color:       tokens.color.fg.support,
              textAlign:   isCentered ? "center" : "left",
            }}
          >
            {bodyText}
          </p>
        )}
      </div>
    </div>
  );
}

export default ModalHeader;
