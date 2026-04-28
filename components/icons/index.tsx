// components/icons/index.tsx
// Static SVG icon components — exported directly from Figma
// Figma file: j8hy0yzSKPyh1yRKOh4tuU
//
// Each icon accepts:
//   color?: string   — stroke or fill color (defaults to #111827 / fg-primary)
//   size?:  number   — width & height in px (defaults to 24)
//
// Usage:
//   import { IconClose, IconArrowLeft, IconMenuHorizontal } from "@/components/icons";
//   <IconClose color="white" size={16} />

import React from "react";

// ---------------------------------------------------------------------------
// IconClose — Figma node 46:2935 "close"
// X mark, two crossing lines, stroke-based
// ---------------------------------------------------------------------------
export function IconClose({
  color = "#111827",
  size  = 24,
}: {
  color?: string;
  size?:  number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 18L18 6M18 18L6 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// IconArrowLeft — Figma node 67:629 "arrow left"
// Arrow with horizontal stem pointing left, stroke-based
// ---------------------------------------------------------------------------
export function IconArrowLeft({
  color = "#111827",
  size  = 24,
}: {
  color?: string;
  size?:  number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11 18L5 12M5 12L11 6M5 12L19 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// IconArrowRight — Figma "arrow right"
// ---------------------------------------------------------------------------
export function IconArrowRight({
  color = "#111827",
  size  = 24,
}: {
  color?: string;
  size?:  number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M13 6L19 12M19 12L13 18M19 12L5 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// IconMenuHorizontal — Figma node 154:1415 "menu horizontal"
// Three horizontal dots (···), fill-based
// ---------------------------------------------------------------------------
export function IconMenuHorizontal({
  color = "#111827",
  size  = 24,
}: {
  color?: string;
  size?:  number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="5"  cy="12" r="2" fill={color} />
      <circle cx="12" cy="12" r="2" fill={color} />
      <circle cx="19" cy="12" r="2" fill={color} />
    </svg>
  );
}
