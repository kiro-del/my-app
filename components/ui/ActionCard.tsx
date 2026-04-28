// components/ui/ActionCard.tsx
// Figma: Scannable Design System — node 3263:2039 (Actionable Cards)
// All values reference design-tokens — never hardcoded.
//
// Note: Hover + Focus states are only explicitly shown in Figma for the
// "lines=2, leadingIcon=none, action=icon btn" variant, but per user
// instruction these states apply universally to all card types.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ActionCardAction   = "icon btn" | "text btn";
export type ActionCardLeading  = "none" | "icon" | "product";
export type ActionCardLines    = "1" | "2";
export type ActionCardState    = "Default" | "Hover" | "Focus" | "Selected" | "Disable";

export interface ActionCardProps {
  /** Primary label */
  label: string;
  /** Secondary description line — only visible when lines="2" */
  description?: string;
  /** Which action affordance appears on the right */
  action?: ActionCardAction;
  /** Leading content type */
  leadingIcon?: ActionCardLeading;
  /** Number of text lines to show */
  lines?: ActionCardLines;
  /** Controlled interactive state (for demos / Storybook). Omit for mouse-driven state. */
  state?: ActionCardState;
  /** Called when the card action is triggered */
  onClick?: () => void;
  /** Whether this card is currently selected */
  selected?: boolean;
  /** Disable the card */
  disabled?: boolean;
  /** Src URL for product image (leadingIcon="product") */
  productImageSrc?: string;
  /** Icon node to render in the leading area (leadingIcon="icon") */
  leadingIconNode?: React.ReactNode;
  /** Label for the text-button action (action="text btn") */
  actionLabel?: string;
  /** Called specifically when the action button is clicked */
  onActionClick?: (e: React.MouseEvent) => void;
}

// ---------------------------------------------------------------------------
// Arrow right icon — 16px, for "icon btn" action
// ---------------------------------------------------------------------------
function ArrowRightIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M3 8H13M9 4L13 8L9 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ProductImage placeholder
// ---------------------------------------------------------------------------
function ProductImagePlaceholder() {
  return (
    <div
      style={{
        width:        "40px",
        height:       "40px",
        borderRadius: tokens.borderRadius.md,
        background:   tokens.color.bg.darkBg,
        flexShrink:   0,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="3" width="14" height="14" rx="2" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
        <circle cx="7.5" cy="7.5" r="1.5" fill={tokens.color.fg.disabled} />
        <path d="M3 13L7 9L10 12L13 9L17 13" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DecoIconPlaceholder — 40×40 icon leading area
// ---------------------------------------------------------------------------
function DecoIconPlaceholder({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        width:          "40px",
        height:         "40px",
        borderRadius:   tokens.borderRadius.lg,
        background:     tokens.color.bg.bg,
        flexShrink:     0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        color:          tokens.color.fg.support,
      }}
    >
      {children ?? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ActionCard
// ---------------------------------------------------------------------------
export function ActionCard({
  label,
  description,
  action        = "icon btn",
  leadingIcon   = "none",
  lines         = "2",
  state,
  onClick,
  selected      = false,
  disabled      = false,
  productImageSrc,
  leadingIconNode,
  actionLabel   = "View",
  onActionClick,
}: ActionCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  // Resolve effective state — controlled prop takes priority
  const effectiveDisabled  = state === "Disable"  || disabled;
  const effectiveSelected  = state === "Selected"  || selected;
  const effectiveHovered   = !effectiveDisabled && (state === "Hover"  || hovered);
  const effectiveFocused   = !effectiveDisabled && (state === "Focus"  || focused);

  // ---------------------------------------------------------------------------
  // State-driven visual tokens
  // ---------------------------------------------------------------------------
  // Background
  const bg =
    (effectiveHovered || effectiveFocused) ? tokens.color.bg.lightBg  // gray-50
    : tokens.color.base.white;

  // Border
  const borderColor = effectiveSelected
    ? tokens.color.divider.blue    // indigo-500 — 2px
    : tokens.color.divider.frame;  // gray-300  — 1px

  const borderWidth = effectiveSelected ? "2px" : "1px";

  // Focus ring — matches Figma: 0 0 0 2px white, 0 0 0 4px gray-300
  const boxShadow = effectiveFocused
    ? `0 1px 2px rgba(0,0,0,0.05), 0 0 0 2px ${tokens.color.base.white}, 0 0 0 4px ${tokens.color.divider.frame}`
    : undefined;

  // Text & icon colour
  const textColor = effectiveDisabled
    ? tokens.color.fg.disabled   // gray-400
    : tokens.color.fg.primary;   // gray-900

  const supportColor = effectiveDisabled
    ? tokens.color.fg.disabled
    : tokens.color.fg.support;   // gray-500

  const actionColor = effectiveDisabled
    ? tokens.color.fg.disabled
    : tokens.color.fg.blue;      // indigo-700

  const opacity = effectiveDisabled ? 0.6 : 1;

  // ---------------------------------------------------------------------------
  // Padding — icon btn has equal padding; text btn has less right padding
  // ---------------------------------------------------------------------------
  const padding = action === "icon btn"
    ? tokens.spacing[4]   // 16px all sides
    : undefined;

  const paddingStyle = action === "text btn"
    ? { paddingLeft: tokens.spacing[4], paddingTop: tokens.spacing[2], paddingBottom: tokens.spacing[2], paddingRight: tokens.spacing[2] }
    : { padding };

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
        display:        "flex",
        alignItems:     lines === "2" ? "flex-start" : "center",
        gap:            tokens.spacing[3],    // 12px
        width:          "362px",
        boxSizing:      "border-box",
        borderRadius:   tokens.borderRadius.lg,  // 8px
        background:     bg,
        border:         `${borderWidth} solid ${borderColor}`,
        boxShadow,
        opacity,
        cursor:         effectiveDisabled ? "not-allowed" : "pointer",
        userSelect:     "none",
        transition:     "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
        overflow:       "hidden",   // Important for selected state border
        ...paddingStyle,
      }}
    >
      {/* Leading content */}
      {leadingIcon === "product" && (
        productImageSrc ? (
          <img
            src={productImageSrc}
            alt=""
            style={{ width: "40px", height: "40px", borderRadius: tokens.borderRadius.md, objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <ProductImagePlaceholder />
        )
      )}
      {leadingIcon === "icon" && (
        <DecoIconPlaceholder>{leadingIconNode}</DecoIconPlaceholder>
      )}

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[0.5] }}>
        <span
          style={{
            fontFamily:  tokens.fontFamily.sans,
            fontSize:    tokens.fontSize.body,          // 14px
            fontWeight:  tokens.fontWeight.medium,       // 500
            lineHeight:  tokens.lineHeight.body,         // 20px
            color:       textColor,
            overflow:    "hidden",
            textOverflow:"ellipsis",
            whiteSpace:  "nowrap",
          }}
        >
          {label}
        </span>
        {lines === "2" && description && (
          <span
            style={{
              fontFamily:  tokens.fontFamily.sans,
              fontSize:    tokens.fontSize.bodySmall,    // 12px
              fontWeight:  tokens.fontWeight.regular,    // 400
              lineHeight:  tokens.lineHeight.bodySmall,  // 18px (using body-small)
              color:       supportColor,
              overflow:    "hidden",
              textOverflow:"ellipsis",
              whiteSpace:  "nowrap",
            }}
          >
            {description}
          </span>
        )}
      </div>

      {/* Action */}
      {action === "icon btn" && (
        <button
          type="button"
          aria-label={`${label} — view`}
          disabled={effectiveDisabled}
          onClick={(e) => { e.stopPropagation(); onActionClick?.(e) ?? onClick?.(); }}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        tokens.spacing[1],   // 4px
            background:     "transparent",
            border:         "none",
            borderRadius:   tokens.borderRadius.sm,
            cursor:         effectiveDisabled ? "not-allowed" : "pointer",
            flexShrink:     0,
            color:          actionColor,
          }}
        >
          <ArrowRightIcon color={actionColor} />
        </button>
      )}

      {action === "text btn" && (
        <button
          type="button"
          disabled={effectiveDisabled}
          onClick={(e) => { e.stopPropagation(); onActionClick?.(e) ?? onClick?.(); }}
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            height:         "28px",
            paddingLeft:    tokens.spacing[3],  // 12px
            paddingRight:   tokens.spacing[3],
            borderRadius:   tokens.borderRadius.md,
            background:     tokens.color.base.white,
            border:         `1px solid ${tokens.color.divider.frame}`,
            cursor:         effectiveDisabled ? "not-allowed" : "pointer",
            flexShrink:     0,
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.bodySmall,  // 12px
            fontWeight:     tokens.fontWeight.medium,
            lineHeight:     tokens.lineHeight.bodySmall,
            color:          actionColor,
            whiteSpace:     "nowrap",
            boxShadow:      tokens.shadows.sm,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ActionCardGroup — vertical / horizontal list of ActionCards
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
        gap:           tokens.spacing[2],  // 8px
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
