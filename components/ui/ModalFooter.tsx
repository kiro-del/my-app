// components/ui/ModalFooter.tsx
// Figma: Scannable Design System — node 2205:556 (Modal Footer)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ModalFooterProps {
  /** Show a "Back" ghost link on the left */
  backBtn?: boolean;
  /**
   * "1" = single primary button (Cancel + Submit)
   * "2" = two primary buttons (Cancel + secondary action + Submit)
   */
  mainBtn?: "1" | "2";
  /** Label for the primary / submit button */
  submitLabel?: string;
  /** Label for the secondary action button (mainBtn="2" only) */
  secondaryLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Label for the back button */
  backLabel?: string;
  onBack?: () => void;
  onCancel?: () => void;
  onSecondary?: () => void;
  onSubmit?: () => void;
  /** Disable the submit button */
  submitDisabled?: boolean;
}

// ---------------------------------------------------------------------------
// ChevronLeftIcon — 16px
// ---------------------------------------------------------------------------
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ModalFooter
// ---------------------------------------------------------------------------
export function ModalFooter({
  backBtn = false,
  mainBtn = "1",
  submitLabel    = "Submit",
  secondaryLabel = "Save draft",
  cancelLabel    = "Cancel",
  backLabel      = "Back",
  onBack,
  onCancel,
  onSecondary,
  onSubmit,
  submitDisabled = false,
}: ModalFooterProps) {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        width:          "100%",
        boxSizing:      "border-box",
        paddingLeft:    tokens.spacing[6],   // 24px
        paddingRight:   tokens.spacing[6],
        paddingTop:     tokens.spacing[4],   // 16px
        paddingBottom:  tokens.spacing[4],
        borderTop:      `1px solid ${tokens.color.divider.border}`, // gray-200
        background:     tokens.color.base.white,
      }}
    >
      {/* Left — Back ghost link (or spacer) */}
      <div style={{ minWidth: "80px" }}>
        {backBtn && (
          <button
            type="button"
            onClick={onBack}
            style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        tokens.spacing[1],    // 4px
              background: "transparent",
              border:     "none",
              padding:    0,
              cursor:     "pointer",
              color:      tokens.color.fg.blue, // indigo-700 #4338ca
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,     // 14px
              fontWeight: tokens.fontWeight.medium,  // 500
              lineHeight: tokens.lineHeight.body,    // 20px
            }}
          >
            <ChevronLeftIcon />
            {backLabel}
          </button>
        )}
      </div>

      {/* Right — button group */}
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[3] }}>  {/* 12px gap */}

        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            display:       "inline-flex",
            alignItems:    "center",
            justifyContent:"center",
            height:        "36px",
            paddingLeft:   tokens.spacing[4],  // 16px
            paddingRight:  tokens.spacing[4],
            borderRadius:  tokens.borderRadius.md, // 6px
            background:    tokens.color.base.white,
            border:        `1px solid ${tokens.color.divider.frame}`, // gray-300
            cursor:        "pointer",
            fontFamily:    tokens.fontFamily.sans,
            fontSize:      tokens.fontSize.body,
            fontWeight:    tokens.fontWeight.medium,
            lineHeight:    tokens.lineHeight.body,
            color:         tokens.color.fg.primary,
            boxShadow:     tokens.shadows.sm,
            whiteSpace:    "nowrap",
          }}
        >
          {cancelLabel}
        </button>

        {/* Secondary action button (mainBtn="2" only) */}
        {mainBtn === "2" && (
          <button
            type="button"
            onClick={onSecondary}
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              justifyContent:"center",
              height:        "36px",
              paddingLeft:   tokens.spacing[4],
              paddingRight:  tokens.spacing[4],
              borderRadius:  tokens.borderRadius.md,
              background:    tokens.color.base.white,
              border:        `1px solid ${tokens.color.divider.frame}`,
              cursor:        "pointer",
              fontFamily:    tokens.fontFamily.sans,
              fontSize:      tokens.fontSize.body,
              fontWeight:    tokens.fontWeight.medium,
              lineHeight:    tokens.lineHeight.body,
              color:         tokens.color.fg.primary,
              boxShadow:     tokens.shadows.sm,
              whiteSpace:    "nowrap",
            }}
          >
            {secondaryLabel}
          </button>
        )}

        {/* Primary / Submit */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitDisabled}
          style={{
            display:       "inline-flex",
            alignItems:    "center",
            justifyContent:"center",
            height:        "36px",
            paddingLeft:   tokens.spacing[4],
            paddingRight:  tokens.spacing[4],
            borderRadius:  tokens.borderRadius.md,
            background:    submitDisabled ? tokens.color.bg.darkBg    : tokens.color.brand.lime,   // lime #ccff00 / gray-200
            border:        `1px solid ${submitDisabled ? tokens.color.divider.frame : tokens.color.divider.lime}`, // lime-600 / gray-300
            cursor:        submitDisabled ? "not-allowed" : "pointer",
            fontFamily:    tokens.fontFamily.sans,
            fontSize:      tokens.fontSize.body,
            fontWeight:    tokens.fontWeight.medium,
            lineHeight:    tokens.lineHeight.body,
            color:         submitDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
            boxShadow:     submitDisabled ? "none" : tokens.shadows.sm,
            whiteSpace:    "nowrap",
            transition:    "background 150ms ease, border-color 150ms ease",
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

export default ModalFooter;
