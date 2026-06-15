// components/patterns/ContextMenu.tsx
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
  /**
   * Use position:absolute instead of position:fixed — for use inside a
   * position:relative container (e.g. the 393 px mobile prototype wrapper).
   * The parent must be position:relative and height:100dvh for the sheet
   * to anchor to the visible bottom correctly.
   */
  contained?: boolean;
  /**
   * Suppress the semi-transparent backdrop entirely.
   * Use when the sheet is already scoped to a contained surface (e.g. a side
   * panel) and dimming the rest of the UI is not desired.
   */
  noBackdrop?: boolean;
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
        paddingTop:     tokens.spacing[3],
        paddingBottom:  tokens.spacing[1],
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
  contained = false,
  noBackdrop = false,
}: ContextMenuProps) {
  // ── Animation state ────────────────────────────────────────────────────────
  // `mounted`  — controls whether the DOM node exists
  // `revealed` — false while closing (drives slide-down transition + backdrop fade)
  // Slide-IN is handled by CSS @keyframes so no JS timer is needed on open.
  const [mounted,  setMounted]  = React.useState(open);
  const [revealed, setRevealed] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      // Both states flip together — CSS @keyframes handles the slide-in visually.
      setMounted(true);
      setRevealed(true);
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
          paddingTop:    tokens.spacing[1],
          paddingBottom: tokens.spacing[1],
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

  // CSS keyframe names for slide-in animation (avoids needing a JS timer).
  const slideInKf  = isMobile ? "_cm-slide-up" : "_cm-slide-up-center";
  const slideInCss = isMobile
    ? `@keyframes _cm-slide-up { from { transform: translateY(100%); } to { transform: translateY(0%); } }`
    : `@keyframes _cm-slide-up-center { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0%); } }`;

  return (
    <>
      {/* Keyframes injected once per render — idempotent */}
      <style>{slideInCss}</style>

      {/* Backdrop — suppressed when noBackdrop is true */}
      {!noBackdrop && (
        <div
          aria-hidden
          onClick={onClose}
          style={{
            position:   contained ? "absolute" : "fixed",
            inset:      0,
            zIndex:     40,
            background: tokens.color.base.overlay,   // rgba(0,0,0,0.5)
            opacity:      revealed ? 1 : 0,
            transition:   "opacity 300ms ease",
            cursor:       "pointer",
            // iOS Safari only fires click on non-interactive elements
            // when cursor:pointer is set — required for tap-to-dismiss.
            WebkitTapHighlightColor: "transparent",
          } as React.CSSProperties}
        />
      )}

      {/* Panel */}
      <div
        role="menu"
        style={{
          position:           contained ? "absolute" : "fixed",
          bottom:             0,
          left:               isMobile ? 0 : "50%",
          // revealed=true  → CSS @keyframes slides panel in (no JS timer needed)
          // revealed=false → inline transform + transition slides panel out
          transform: revealed
            ? isMobile ? "translateY(0%)" : "translateX(-50%) translateY(0%)"
            : isMobile ? "translateY(100%)" : "translateX(-50%) translateY(100%)",
          animation:  revealed ? `${slideInKf} 300ms ease` : undefined,
          transition: revealed ? undefined : "transform 300ms ease",
          zIndex:             50,
          width:              panelWidth,
          background:         tokens.color.base.white,
          borderTopLeftRadius:  tokens.borderRadius["2xl"],  // 16px
          borderTopRightRadius: tokens.borderRadius["2xl"],  // 16px
          boxShadow:          tokens.shadows.upLg,
          paddingTop:         isMobile ? "0" : tokens.spacing[2],
          paddingBottom:      tokens.spacing[2],
          overflow:           "hidden",
          maxHeight:          "90vh",
          overflowY:          "auto",
        } as React.CSSProperties}
      >
        {/* Drag handle — mobile only */}
        {isMobile && <DragHandle />}

        {children}
      </div>
    </>
  );
}

export default ContextMenu;
