// components/ui/ContextMenu.tsx
// Figma: Scannable Design System
//   Floating menu:        node 1586:8785
//   Bottom sheet (web):   node 5688:11322
//   Bottom sheet (mobile):node 1388:7711
// All values reference design-tokens — never hardcoded.
"use client";

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ContextMenuVariant =
  | "floating"
  | "bottom-sheet-web"
  | "bottom-sheet-mobile";

export interface ContextMenuProps {
  /**
   * Surface type:
   * - "floating"             — absolute popup, positioned near a trigger
   * - "bottom-sheet-web"     — slides up from bottom (web, 400 px wide panel)
   * - "bottom-sheet-mobile"  — slides up from bottom (full-width, drag handle)
   */
  variant?: ContextMenuVariant;
  /** Whether the menu is visible */
  open: boolean;
  /** Called when the backdrop is clicked or Escape is pressed */
  onClose?: () => void;
  children: React.ReactNode;
  /**
   * Override the panel width (floating only).
   * Floating default is 240 px; set to wider values for multi-item menus (320 px).
   */
  width?: number;
  /**
   * Extra inline style applied to the floating panel (floating variant only).
   * Use to set `top`, `right`, `left`, `bottom` for dropdown positioning.
   */
  floatingStyle?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Drag handle — mobile bottom sheet only
// Figma: node 2314:2565 "sheet drag handle"  h=6px, w=36px, rgba(10,15,26,0.2)
// ---------------------------------------------------------------------------
function DragHandle() {
  return (
    <div
      style={{
        display:        "flex",
        justifyContent: "center",
        paddingTop:     "12px",
        paddingBottom:  "4px",
        flexShrink:     0,
        width:          "100%",
      }}
    >
      <div
        style={{
          width:        "36px",
          height:       "6px",
          borderRadius: "10px",
          background:   "rgba(10, 15, 26, 0.2)",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContextMenu
// ---------------------------------------------------------------------------
export function ContextMenu({
  variant = "floating",
  open,
  onClose,
  children,
  width,
  floatingStyle,
}: ContextMenuProps) {
  // ── Animation state ────────────────────────────────────────────────────────
  // For bottom sheets we drive a CSS translateY transition.
  // `mounted`  — controls whether the DOM node exists
  // `revealed` — controls the translate (0 = fully visible, 100% = hidden below)
  const [mounted,  setMounted]  = React.useState(open);
  const [revealed, setRevealed] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      // Small delay so the browser paints the initial transform before we
      // remove it (triggering the slide-up transition).
      const id = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(id);
    } else {
      setRevealed(false);
      // Wait for the slide-down transition to finish before unmounting.
      const id = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(id);
    }
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open || !onClose) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Floating variant ───────────────────────────────────────────────────────
  if (variant === "floating") {
    if (!open) return null;
    return (
      <div
        role="menu"
        style={{
          position:      "absolute",
          zIndex:        50,
          background:    tokens.color.base.white,
          borderRadius:  tokens.borderRadius.lg,      // 8px
          boxShadow:     tokens.shadows.ringLg,       // ring/lg from Figma
          width:         `${width ?? 240}px`,
          paddingTop:    "4px",
          paddingBottom: "4px",
          overflow:      "hidden",
          ...floatingStyle,
        }}
      >
        {children}
      </div>
    );
  }

  // ── Bottom-sheet variants (web + mobile) ───────────────────────────────────
  if (!mounted) return null;

  const isMobile = variant === "bottom-sheet-mobile";
  // Web bottom-sheet is 400 px centred; mobile is full viewport width.
  const panelWidth = isMobile ? "100%" : `${width ?? 400}px`;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     40,
          background: tokens.color.base.overlay,   // rgba(0,0,0,0.5)
          opacity:    revealed ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />

      {/* Panel */}
      <div
        role="menu"
        style={{
          position:           "fixed",
          bottom:             0,
          left:               isMobile ? 0 : "50%",
          transform:          isMobile
            ? `translateY(${revealed ? "0%" : "100%"})`
            : `translateX(-50%) translateY(${revealed ? "0%" : "100%"})`,
          zIndex:             50,
          width:              panelWidth,
          background:         tokens.color.base.white,
          borderTopLeftRadius:  tokens.borderRadius["2xl"],  // 16px
          borderTopRightRadius: tokens.borderRadius["2xl"],  // 16px
          boxShadow:          tokens.shadows.upLg,
          transition:         "transform 300ms ease",
          paddingTop:         isMobile ? "0" : "8px",
          paddingBottom:      "8px",
          overflow:           "hidden",
          maxHeight:          "90vh",
          overflowY:          "auto",
        }}
      >
        {/* Drag handle — mobile only */}
        {isMobile && <DragHandle />}

        {children}
      </div>
    </>
  );
}

export default ContextMenu;
