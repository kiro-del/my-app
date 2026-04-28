// components/ui/ModalFooter.tsx
// Figma: Scannable Design System — node 2205:556 (Modal Footer)
//
// mainBtn="1" → primary button only (no Cancel)
// mainBtn="2" → Cancel (secondary) + primary button
// backBtn=true → Back ghost link on the left

import React from "react";
import tokens from "@/styles/design-tokens";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ModalFooterProps {
  /** Show a "Back" ghost link on the left */
  backBtn?: boolean;
  /**
   * "1" = primary button only
   * "2" = Cancel (secondary) + primary button
   */
  mainBtn?: "1" | "2";
  /** Label for the primary / submit button */
  submitLabel?: string;
  /** Label for the cancel button (mainBtn="2" only) */
  cancelLabel?: string;
  /** Label for the back link */
  backLabel?: string;
  onBack?: () => void;
  onCancel?: () => void;
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
  backBtn       = false,
  mainBtn       = "1",
  submitLabel   = "Submit",
  cancelLabel   = "Cancel",
  backLabel     = "Back",
  onBack,
  onCancel,
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
        borderTop:      `1px solid ${tokens.color.divider.border}`,
        background:     tokens.color.base.white,
      }}
    >
      {/* Left — Back ghost link (or empty spacer to keep right group flush) */}
      <div>
        {backBtn && (
          <button
            type="button"
            onClick={onBack}
            style={{
              display:    "inline-flex",
              alignItems: "center",
              gap:        tokens.spacing[1],
              background: "transparent",
              border:     "none",
              padding:    0,
              cursor:     "pointer",
              color:      tokens.color.fg.blue,
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,
              fontWeight: tokens.fontWeight.medium,
              lineHeight: tokens.lineHeight.body,
            }}
          >
            <ChevronLeftIcon />
            {backLabel}
          </button>
        )}
      </div>

      {/* Right — button group */}
      <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[3] }}>
        {mainBtn === "2" && (
          <Button
            variant="secondary"
            label={cancelLabel}
            onClick={onCancel}
          />
        )}
        <Button
          variant={submitDisabled ? "disabled" : "primary"}
          label={submitLabel}
          onClick={submitDisabled ? undefined : onSubmit}
        />
      </div>
    </div>
  );
}

export default ModalFooter;
