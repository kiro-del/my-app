// components/ui/EmptyState.tsx
// Figma: Scannable Design System — node 2204:2632 (/empty state)
// Two sizes: "large" (96px icon container) and "small" (40px icon container)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type EmptyStateSize = "small" | "large";

export interface EmptyStateProps {
  /**
   * Icon to render inside the grey container.
   * For "large": caller should pass a 64px icon (e.g. <img src={...} width={64} height={64} />).
   * For "small": caller should pass a 24px icon.
   * The container itself is sized; the icon should fill it naturally.
   */
  icon: React.ReactNode;
  /** "large" (default) = 96px container, borderRadius 3xl. "small" = 40px container, borderRadius lg. */
  size?: EmptyStateSize;
  /** Heading — h5 (16px/500) */
  title: string;
  /** Optional body copy — bodyR (14px/400), fg.support */
  description?: string;
  /**
   * Optional call-to-action — pass a <Button>, <GloryItem>, or any ReactNode.
   * Rendered below the text block, separated by gap-6 (24px).
   */
  action?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function EmptyState({
  icon,
  size = "large",
  title,
  description,
  action,
}: EmptyStateProps) {
  const isLarge = size === "large";

  // Icon container dimensions — Figma node 2204:2632
  const containerSize = isLarge ? "96px" : "40px";
  const containerRadius = isLarge ? tokens.borderRadius["3xl"] : tokens.borderRadius.lg;

  // Outer gap between icon container and content column
  // large: gap-6 (24px) / small: gap-2 (8px)
  const outerGap = isLarge ? tokens.spacing[6] : tokens.spacing[2];

  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            outerGap,
        width:          "100%",
        boxSizing:      "border-box",
      }}
    >
      {/* Icon container — grey pill */}
      <div
        style={{
          width:          containerSize,
          height:         containerSize,
          flexShrink:     0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          borderRadius:   containerRadius,
          background:     tokens.color.bg.bg,   // #f3f4f6
        }}
      >
        {icon}
      </div>

      {/* Content column: text block + optional action */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           tokens.spacing[6],  // 24px — same at both sizes per Figma
          width:         "100%",
        }}
      >
        {/* Text block */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:           tokens.spacing[1],  // 4px
            width:         "100%",
          }}
        >
          <p
            style={{
              ...tokens.typography.h5,
              color:     tokens.color.fg.primary,
              margin:    0,
              textAlign: "center",
            }}
          >
            {title}
          </p>

          {description && (
            <p
              style={{
                ...tokens.typography.bodyR,
                color:     tokens.color.fg.support,
                margin:    0,
                textAlign: "center",
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* CTA */}
        {action && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
