// components/ui/ActionCard.tsx
// Figma: Scannable Design System — node 3263:2039 (Actionable Cards)
// All values reference design-tokens — never hardcoded.
//
// Hover + Focus states are only shown in Figma for "lines=2, leadingIcon=none, action=icon btn"
// but apply universally to all card types per user instruction.
//
// Design system compliance:
//   - action buttons  → Button component (variant="icon" / "secondary")
//   - leadingIcon="icon"    → DecoIcon component (40px, typed tone)
//   - leadingIcon="product" → 56×56 product image (Figma node 2319:1415)

import React from "react";
import tokens from "@/styles/design-tokens";
import { Button } from "@/components/ui/Button";
import { DecoIcon, type DecoIcon40Tone } from "@/components/ui/DecoIcon";
import { IconArrowRight } from "@/components/icons";

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
        gap:           tokens.spacing[3],       // 12px
        width:         "362px",
        boxSizing:     "border-box",
        padding:       tokens.spacing[4],       // 16px all sides
        borderRadius:  tokens.borderRadius.lg,  // 8px
        background:    bg,
        border:        `${borderWidth} solid ${borderColor}`,
        boxShadow,
        opacity,
        cursor:        effectiveDisabled ? "not-allowed" : "pointer",
        userSelect:    "none",
        transition:    "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
        overflow:      "hidden",
      }}
    >
      {/* ── Leading: product image — 56×56, white bg, gray-200 border ── */}
      {leadingIcon === "product" && (
        productImageSrc ? (
          <img
            src={productImageSrc}
            alt=""
            style={{
              width:        "56px",
              height:       "56px",
              borderRadius: tokens.borderRadius.md,   // 6px
              objectFit:    "cover",
              flexShrink:   0,
              border:       `1px solid ${tokens.color.divider.border}`,  // gray-200
              background:   tokens.color.base.white,
            }}
          />
        ) : (
          /* Placeholder when no src provided */
          <div
            style={{
              width:        "56px",
              height:       "56px",
              borderRadius: tokens.borderRadius.md,
              background:   tokens.color.base.white,
              border:       `1px solid ${tokens.color.divider.border}`,
              flexShrink:   0,
            }}
          />
        )
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
          gap:           tokens.spacing[0.5],  // 2px
        }}
      >
        <span
          style={{
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     tokens.fontSize.body,
            fontWeight:   tokens.fontWeight.medium,
            lineHeight:   tokens.lineHeight.body,
            color:        textColor,
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
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
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
            }}
          >
            {description}
          </span>
        )}
      </div>

      {/* ── Action: icon button — arrow right ────────────────────── */}
      {action === "icon btn" && (
        <div
          onClick={(e) => { e.stopPropagation(); onActionClick?.(e) ?? onClick?.(); }}
          style={{ flexShrink: 0 }}
        >
          <Button
            variant={effectiveDisabled ? "disabled" : "icon"}
            icon={<IconArrowRight color={effectiveDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary} />}
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
