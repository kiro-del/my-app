"use client";

// components/ui/Steps.tsx
// Figma: Scannable Design System
//   StepIndicator: 1733:2164  — 24px circle, complete/current/incomplete
//   StepBullet:    5870:2479  — 10px dot, compact variant
//   StepPanel:     1734:2142  — indicator + label
//   Steps:         1733:2254  — composed row (labeled / indicators / dots)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type StepStatus   = "complete" | "current" | "incomplete";
export type StepsVariant = "labeled" | "indicators" | "dots";

export interface StepItem {
  label: string;
}

export interface StepsProps {
  /** Ordered list of steps */
  steps: StepItem[];
  /**
   * 1-indexed active step.
   * Steps before currentStep are "complete", currentStep is "current",
   * steps after are "incomplete".
   */
  currentStep: number;
  /**
   * "labeled"    — circle + label + chevron separator (default)  — Figma: withLabel true
   * "indicators" — circle only + chevron separator               — Figma: withLabel false, Default
   * "dots"       — 10px bullet dots                              — Figma: compact
   */
  variant?: StepsVariant;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getStatus(index: number, currentStep: number): StepStatus {
  const n = index + 1;
  if (n < currentStep) return "complete";
  if (n === currentStep) return "current";
  return "incomplete";
}

/** Zero-pad step number: 1 → "01", 12 → "12" */
function padStep(n: number) {
  return String(n).padStart(2, "0");
}

// ---------------------------------------------------------------------------
// CheckIcon — white checkmark for "complete" state (16px container)
// Figma: check-on icon inside indigo-500 circle
// ---------------------------------------------------------------------------
const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
    <path
      d="M1 5L4.5 8.5L11 1"
      stroke={tokens.color.base.white}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// ChevronRight — 16px gray separator between steps
// ---------------------------------------------------------------------------
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ display: "block" }}>
    <path
      d="M6 4l4 4-4 4"
      stroke={tokens.color.divider.frame}   // gray-300 #d1d5db
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// StepIndicator — 24px circle
// Figma: 1733:2164
//   complete   → indigo-500 bg + white check
//   current    → indigo-500 border + indigo-700 number (semiBold 12px)
//   incomplete → gray-300 border + gray-500 number (semiBold 12px)
// ---------------------------------------------------------------------------
function StepIndicator({ status, stepNumber }: { status: StepStatus; stepNumber: number }) {
  const circleStyle: React.CSSProperties = {
    width:          "24px",
    height:         "24px",
    borderRadius:   tokens.borderRadius.full,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
    boxSizing:      "border-box" as const,
    transition:     "background 150ms ease, border-color 150ms ease",
    ...(status === "complete"
      ? { background: tokens.color.bg.blue }                                                                  // indigo-500 filled
      : status === "current"
      ? { border: `2px solid ${tokens.color.divider.blue}`, background: tokens.color.base.white }             // indigo-500 border
      : { border: `2px solid ${tokens.color.divider.frame}`, background: tokens.color.base.white }),          // gray-300 border
  };

  return (
    <div style={circleStyle}>
      {status === "complete" ? (
        <CheckIcon />
      ) : (
        <span
          style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.bodySmall,   // 12px
            fontWeight: tokens.fontWeight.semiBold,  // 600 — Figma: body/S-body-SB
            lineHeight: tokens.lineHeight.bodySmall, // 16px
            color:      status === "current"
              ? tokens.color.fg.blue      // indigo-700 #4338ca
              : tokens.color.fg.support,  // gray-500 #6b7280
            userSelect: "none" as const,
          }}
        >
          {padStep(stepNumber)}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StepDot — 10px dot for the "dots" variant
// Figma: 5870:2479
//   complete   → indigo-600 (#4f46e5) solid
//   current    → indigo-600 dot + indigo-200 ring (20px, absolute, z-index: -1)
//   incomplete → gray-200 (#e5e7eb) solid
// ---------------------------------------------------------------------------
function StepDot({ status }: { status: StepStatus }) {
  const baseStyle: React.CSSProperties = {
    position:     "relative",
    width:        "10px",
    height:       "10px",
    borderRadius: tokens.borderRadius.full,
    flexShrink:   0,
    transition:   "background 150ms ease",
  };

  if (status === "current") {
    return (
      <div
        style={{
          ...baseStyle,
          background: tokens.color.palette.indigo[600],   // #4f46e5
        }}
      >
        {/* Indigo-200 ring — 20px, absolute-centered, behind the dot */}
        <div
          style={{
            position:     "absolute",
            width:        "20px",
            height:       "20px",
            borderRadius: tokens.borderRadius.full,
            background:   tokens.color.palette.indigo[200],  // #c7d2fe
            top:          "50%",
            left:         "50%",
            transform:    "translate(-50%, -50%)",
            zIndex:       -1,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        background: status === "complete"
          ? tokens.color.palette.indigo[600]   // #4f46e5
          : tokens.color.bg.darkBg,             // gray-200 #e5e7eb
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
export function Steps({ steps, currentStep, variant = "labeled" }: StepsProps) {

  // ── Dots variant ──────────────────────────────────────────────────────────
  if (variant === "dots") {
    return (
      <div
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        tokens.spacing[5],   // 20px — Figma: gap-spacing-5
          overflow:   "visible",           // allow current-state ring (20px) to bleed
        }}
      >
        {steps.map((_, i) => (
          <StepDot key={i} status={getStatus(i, currentStep)} />
        ))}
      </div>
    );
  }

  // ── Labeled / Indicators variants ────────────────────────────────────────
  // Both use: [StepItem] [ChevronRight] [StepItem] …
  // Gap between all siblings:
  //   labeled    → 16px (Figma: gap-spacing-4)
  //   indicators → 8px  (Figma: gap-spacing-2)
  const outerGap = variant === "labeled" ? tokens.spacing[4] : tokens.spacing[2];

  return (
    <div
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        outerGap,
      }}
    >
      {steps.map((step, i) => {
        const status     = getStatus(i, currentStep);
        const stepNumber = i + 1;
        const isLast     = i === steps.length - 1;

        return (
          <React.Fragment key={i}>

            {/* ── Step item ─────────────────────────────────────────── */}
            <div
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        tokens.spacing[2],   // 8px between indicator and label
                flexShrink: 0,
              }}
            >
              <StepIndicator status={status} stepNumber={stepNumber} />

              {variant === "labeled" && (
                <span
                  style={{
                    fontFamily: tokens.fontFamily.sans,
                    fontSize:   tokens.fontSize.body,     // 14px
                    fontWeight: status === "current"
                      ? tokens.fontWeight.medium          // 500 — Figma: body/body-M
                      : tokens.fontWeight.regular,        // 400 — Figma: body/body-R
                    lineHeight: tokens.lineHeight.body,   // 20px
                    color: status === "current"
                      ? tokens.color.fg.blue              // indigo-700 #4338ca
                      : status === "complete"
                      ? tokens.color.fg.primary           // gray-900 #111827
                      : tokens.color.fg.support,          // gray-500 #6b7280
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {step.label}
                </span>
              )}
            </div>

            {/* ── Chevron separator — omitted after last step ─────── */}
            {!isLast && (
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                <ChevronRight />
              </div>
            )}

          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Steps;
