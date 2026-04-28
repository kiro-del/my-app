// components/ui/DecoIcon.tsx
// Figma: Scannable Design System — node 216:872 (Deco Icons)
// Self-contained: coloured container + 24px design system icon inside.
// Fetches the full node as an image via /api/figma-icons — no hand-crafted SVG.

"use client";

import React, { useState, useEffect } from "react";
import tokens from "@/styles/design-tokens";

const FILE_KEY = "j8hy0yzSKPyh1yRKOh4tuU";

// ---------------------------------------------------------------------------
// Types — sourced directly from tokens.icons.deco
// ---------------------------------------------------------------------------
export type DecoIcon40Tone =
  | "info" | "info reverse"
  | "success" | "success-reverse"
  | "error" | "error-reverse"
  | "warning" | "disabled" | "brand" | "highlight";

export type DecoIcon64Tone  = "brand" | "info" | "loading";
export type DecoIcon96Tone  = "info" | "success" | "disabled";
export type DecoIcon136Tone = "success" | "disabled" | "loading";

export type DecoIconSize = "40" | "64" | "96" | "136";

export interface DecoIconProps {
  size?: DecoIconSize;
  tone?: DecoIcon40Tone | DecoIcon64Tone | DecoIcon96Tone | DecoIcon136Tone;
}

// ---------------------------------------------------------------------------
// Node ID map — matches DECO_VARIANTS in app/styleguide/deco-icons/page.tsx
// ---------------------------------------------------------------------------
const NODE_MAP: Record<string, string> = {
  // 40px
  "40:info":             "216:871",
  "40:info reverse":     "216:1184",
  "40:success":          "2204:3387",
  "40:success-reverse":  "2204:3397",
  "40:error":            "216:1193",
  "40:error-reverse":    "2236:2941",
  "40:warning":          "216:1196",
  "40:disabled":         "216:1199",
  "40:brand":            "216:1202",
  "40:highlight":        "220:2721",
  // 64px
  "64:brand":            "1098:8734",
  "64:info":             "4409:13196",
  "64:loading":          "1767:2252",
  // 96px
  "96:info":             "2365:1748",
  "96:success":          "2365:1843",
  "96:disabled":         "2365:1826",
  // 136px
  "136:success":         "1732:9725",
  "136:disabled":        "1114:2158",
  "136:loading":         "1738:2243",
};

// ---------------------------------------------------------------------------
// DecoIcon
// ---------------------------------------------------------------------------
export function DecoIcon({ size = "40", tone = "info" }: DecoIconProps) {
  const [url, setUrl] = useState<string | null>(null);
  const px = parseInt(size);
  const key = `${size}:${tone}`;
  const nodeId = NODE_MAP[key];

  useEffect(() => {
    if (!nodeId) return;
    fetch(`/api/figma-icons?ids=${encodeURIComponent(nodeId)}&fileKey=${FILE_KEY}`)
      .then((r) => r.ok ? r.json() : null)
      .then((json) => json?.images?.[nodeId] && setUrl(json.images[nodeId]))
      .catch(() => {});
  }, [nodeId]);

  const borderRadius = px >= 96
    ? tokens.borderRadius["3xl"]   // 24px
    : tokens.borderRadius.lg;      // 8px

  if (!url) {
    // Placeholder — same size and radius as the real icon
    return (
      <div
        style={{
          width:        px,
          height:       px,
          borderRadius,
          background:   tokens.color.bg.darkBg,
          flexShrink:   0,
          opacity:      0.35,
        }}
      />
    );
  }

  return (
    <img
      src={url}
      width={px}
      height={px}
      alt={`${tone} deco icon`}
      style={{ display: "block", borderRadius, flexShrink: 0 }}
    />
  );
}

export default DecoIcon;
