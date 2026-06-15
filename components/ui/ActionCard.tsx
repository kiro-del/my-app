"use client";

// components/ui/ActionCard.tsx
// Figma: Scannable Design System — node 3263:2039 (Actionable Cards)
// All values reference design-tokens — never hardcoded.
//
// Hover + Focus states are only shown in Figma for "lines=2, leadingIcon=none, action=icon btn"
// but apply universally to all card types per user instruction.
//
// Design system compliance:
//   - action icon btn  → Button variant="icon framed" + Figma arrow-right node 46:2885
//   - action text btn  → Button variant="secondary"
//   - leadingIcon="icon"    → DecoIcon component (40px, typed tone)
//   - leadingIcon="product" → ProductImg 56px (Figma node 2319:1509)

import React from "react";
import tokens from "@/styles/design-tokens";
import { Button } from "@/components/ui/Button";
import { DecoIcon, type DecoIcon40Tone } from "@/components/ui/DecoIcon";
import { ProductImg } from "@/components/ui/ProductImg";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

// Arrow right icon — Figma node 46:2885
const ARROW_RIGHT_NODE = "46:2885";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ActionCardAction  = "icon btn" | "text btn";
export type ActionCardLeading = "none" | "icon" | "product";
export type ActionCardLines   = "1" | "2";
export type ActionCardState   = "Default" | "Hover" | "Focus" | "Selected" | "Disable";

export interface ActionCardProps {
  label: string;
  description?: string;
  action?: ActionCardAction;
  /** Leading content type */
  leadingIcon?: ActionCardLeading;
  lines?: ActionCardLines;
  /** Controlled state override — omit for mouse-driven behaviour */
  state?: ActionCardState;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  /** Src URL for product image (leadingIcon="product") — 56×56 */
  productImageSrc?: string;
  /**
   * Tone for the 40px design system DecoIcon (leadingIcon="icon").
   * Typed to available 40px tones — component renders DecoIcon internally.
   */
  decoIconTone?: DecoIcon40Tone;
  /** Label for the secondary text button (action="text btn") */
  actionLabel?: string;
  onActionClick?: (e: React.MouseEvent) => void;
}

// ---------------------------------------------------------------------------
// ActionCard
// ---------------------------------------------------------------------------
export function ActionCard({
  label,
  description,
  action       = "icon btn",
  leadingIcon  = "none",
  lines        = "2",
  state,
  onClick,
  selected     = false,
  disabled     = false,
  productImageSrc,
  decoIconTone = "info",
  actionLabel  = "View",
  onActionClick,
}: ActionCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  // Fetch arrow-right icon from Figma (node 46:2885) — cached by useFigmaIcons
  const icons        = useFigmaIcons([ARROW_RIGHT_NODE]);
  const arrowIconUrl = icons[ARROW_RIGHT_NODE];

  const effectiveDisabled = state === "Disable"   || disabled;
  const effectiveSelected = state === "Selected"  || selected;
  const effectiveHovered  = !effectiveDisabled && (state === "Hover"  || hovered);
  const effectiveFocused  = !effectiveDisabled && (state === "Focus"  || focused);

  // ---------------------------------------------------------------------------
  // State-driven visuals
  // ---------------------------------------------------------------------------
  const bg = (effectiveHovered || effectiveFocused)
    ? tokens.color.bg.lightBg   // gray-50
    : tokens.color.base.white;

  const borderColor = effectiveSelected
    ? tokens.color.divider.blue   // indigo-500
    : tokens.color.divider.frame; // gray-300

  const borderWidth = effectiveSelected ? "2px" : "1px";

  const boxShadow = effectiveFocused
    ? `0 1px 2px rgba(0,0,0,0.05), 0 0 0 2px ${tokens.color.base.white}, 0 0 0 4px ${tokens.color.divider.frame}`
    : undefined;

  const textColor    = effectiveDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary;
  const supportColor = effectiveDisabled ? tokens.color.fg.disabled : tokens.color.fg.support;
  const opacity      = effectiveDisabled ? 0.6 : 1;

  return (
    <div
      tabIndex={effectiveDisabled ? undefined : 0}
      role="button"
      aria-disabled={effectiveDisabled}
      aria-pressed={effectiveSelected}
      onClick={!effectiveDisabled ? onClick : undefined}
      onMouseEnter={() => !effectiveDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => !effectiveDisabled && setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (!effectiveDisabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           tokens.spacing[4],       // 16px — Figma
        width:         "362px",
        boxSizing:     "border-box" as const,
        // text btn: pl-16 pr-8 py-8 — icon btn: p-16 — Figma
        paddingTop:    action === "text btn" ? tokens.spacing[2]  : tokens.spacing[4],
        paddingBottom: action === "text btn" ? tokens.spacing[2]  : tokens.spacing[4],
        paddingLeft:   tokens.spacing[4],
        paddingRight:  action === "text btn" ? tokens.spacing[2]  : tokens.spacing[4],
        borderRadius:  tokens.borderRadius.md,  // 6px — Figma rounded-s-md
        background:    bg,
        border:        `${borderWidth} solid ${borderColor}`,
        boxShadow,
        opacity,
        cursor:        effectiveDisabled ? "not-allowed" : "pointer",
        userSelect:    "none" as const,
        transition:    "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
        overflow:      "hidden",
      }}
    >
      {/* ── Leading: product image — 56×56, white bg, gray-200 border ── */}
      {/* ── Leading: product image — 56×56, ProductImg component ── */}
      {leadingIcon === "product" && (
        <ProductImg size={56} image={productImageSrc} />
      )}

      {/* ── Leading: DecoIcon — 40px design system icon ──────────── */}
      {leadingIcon === "icon" && (
        <DecoIcon size="40" tone={decoIconTone} />
      )}

      {/* ── Text content ─────────────────────────────────────────── */}
      <div
        style={{
          flex:          1,
          minWidth:      0,
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[1],    // 4px — Figma
        }}
      >
        <span
          style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.medium,
            lineHeight: tokens.lineHeight.body,
            color:      textColor,
          }}
        >
          {label}
        </span>

        {lines === "2" && description && (
          <span
            style={{
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.bodySmall,
              fontWeight:   tokens.fontWeight.regular,
              lineHeight:   tokens.lineHeight.bodySmall,
              color:        supportColor,
            }}
          >
            {description}
          </span>
        )}
      </div>

      {/* ── Action: icon button — arrow right (Figma node 46:2885) ── */}
      {action === "icon btn" && (
        <div
          onClick={(e) => { e.stopPropagation(); onActionClick?.(e) ?? onClick?.(); }}
          style={{ flexShrink: 0 }}
        >
          <Button
            variant={effectiveDisabled ? "disabled" : "icon framed"}
            icon={
              arrowIconUrl ? (
                <span
                  style={{
                    display:            "inline-block",
                    width:              "24px",
                    height:             "24px",
                    background:         effectiveDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
                    maskImage:          `url(${arrowIconUrl})`,
                    maskSize:           "contain",
                    maskRepeat:         "no-repeat",
                    maskPosition:       "center",
                    WebkitMaskImage:    `url(${arrowIconUrl})`,
                    WebkitMaskSize:     "contain",
                    WebkitMaskRepeat:   "no-repeat",
                    WebkitMaskPosition: "center",
                  } as React.CSSProperties}
                  aria-hidden
                />
              ) : (
                // Fallback while Figma URL loads
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M13 6L19 12M19 12L13 18M19 12L5 12"
                    stroke={effectiveDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )
            }
            disabled={effectiveDisabled}
            aria-label={`${label} — ${actionLabel}`}
          />
        </div>
      )}

      {/* ── Action: text button ───────────────────────────────────── */}
      {action === "text btn" && (
        <div
          onClick={(e) => { e.stopPropagation(); onActionClick?.(e) ?? onClick?.(); }}
          style={{ flexShrink: 0 }}
        >
          <Button
            variant={effectiveDisabled ? "disabled" : "secondary"}
            label={actionLabel}
            disabled={effectiveDisabled}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ActionCardGroup
// ---------------------------------------------------------------------------
export interface ActionCardGroupProps {
  cards: ActionCardProps[];
  direction?: "vertical" | "horizontal";
}

export function ActionCardGroup({ cards, direction = "vertical" }: ActionCardGroupProps) {
  return (
    <div
      style={{
        display:       "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        gap:           tokens.spacing[2],
        flexWrap:      direction === "horizontal" ? "wrap" : undefined,
      }}
    >
      {cards.map((card, i) => (
        <ActionCard key={i} {...card} />
      ))}
    </div>
  );
}

export default ActionCard;
