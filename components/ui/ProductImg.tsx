"use client";

// components/ui/ProductImg.tsx
// Product image placeholder — all sizes from Figma:
//   40px  node 161:4904  — p-8px,  r=6px,  camera only
//   56px  node 2319:1509 — p-10/14px, r=6px,  camera only
//   64px  node 188:1642  — p-10/14px, r=6px,  camera only
//   80px  node 2237:524  — p-10/14px gap-10px, r=8px,  camera + "NO IMAGE"
//   120px node 188:1653  — p-10/14px gap-10px, r=8px,  camera + "NO IMAGE"
//   224px node 2127:1676 — p-10/14px gap-10px, r=16px, camera + "NO IMAGE"
// Camera icon: Figma node 152:824 — 24×24px, fetched via useFigmaIcons
// All values reference design-tokens — never hardcoded.

import React, { useState } from "react";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";

// ---------------------------------------------------------------------------
// Camera icon node ID — Figma node 152:824
// ---------------------------------------------------------------------------
const CAMERA_NODE_ID = "152:824";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ProductImgSize = 40 | 56 | 64 | 80 | 120 | 224;

export interface ProductImgProps {
  /** Container size in px — maps directly to Figma variants */
  size?: ProductImgSize;
  /** When provided renders the image instead of the placeholder */
  image?: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}

// ---------------------------------------------------------------------------
// CameraIcon — Figma node 152:824, 24×24
// Fetches the exact Figma SVG via useFigmaIcons and renders it via
// CSS mask-image so the color can be controlled by the caller.
// Falls back to a simple inline SVG while the URL is loading.
// ---------------------------------------------------------------------------
export function CameraIcon({ color = tokens.color.fg.disabled }: { color?: string }) {
  const icons = useFigmaIcons([CAMERA_NODE_ID]);
  const url   = icons[CAMERA_NODE_ID];

  if (url) {
    return (
      <span
        style={{
          display:            "inline-block",
          width:              "24px",
          height:             "24px",
          flexShrink:         0,
          background:         color,
          maskImage:          `url(${url})`,
          maskSize:           "contain",
          maskRepeat:         "no-repeat",
          maskPosition:       "center",
          WebkitMaskImage:    `url(${url})`,
          WebkitMaskSize:     "contain",
          WebkitMaskRepeat:   "no-repeat",
          WebkitMaskPosition: "center",
        } as React.CSSProperties}
        aria-hidden
      />
    );
  }

  // Fallback while the Figma URL is loading
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9.5 5h5l1.25 2H19a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3.25L9.5 5z"
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="2.5" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Size config table — drives all layout decisions
// ---------------------------------------------------------------------------
type SizeConfig = {
  dim:       number;
  paddingX:  string;
  paddingY:  string;
  gap?:      string;
  radius:    string;
  showLabel: boolean;
};

const SIZE_CONFIG: Record<ProductImgSize, SizeConfig> = {
  40: {
    dim:       40,
    paddingX:  tokens.spacing[2],         // 8px
    paddingY:  tokens.spacing[2],         // 8px
    gap:       undefined,
    radius:    tokens.borderRadius.md,    // 6px
    showLabel: false,
  },
  56: {
    dim:       56,
    paddingX:  tokens.spacing[2.5],       // 10px
    paddingY:  tokens.spacing[3.5],       // 14px
    gap:       undefined,
    radius:    tokens.borderRadius.md,    // 6px
    showLabel: false,
  },
  64: {
    dim:       64,
    paddingX:  tokens.spacing[2.5],       // 10px
    paddingY:  tokens.spacing[3.5],       // 14px
    gap:       undefined,
    radius:    tokens.borderRadius.md,    // 6px
    showLabel: false,
  },
  80: {
    dim:       80,
    paddingX:  tokens.spacing[2.5],       // 10px
    paddingY:  tokens.spacing[3.5],       // 14px
    gap:       tokens.spacing[2.5],       // 10px
    radius:    tokens.borderRadius.lg,    // 8px
    showLabel: true,
  },
  120: {
    dim:       120,
    paddingX:  tokens.spacing[2.5],       // 10px
    paddingY:  tokens.spacing[3.5],       // 14px
    gap:       tokens.spacing[2.5],       // 10px
    radius:    tokens.borderRadius.lg,    // 8px
    showLabel: true,
  },
  224: {
    dim:       224,
    paddingX:  tokens.spacing[2.5],       // 10px
    paddingY:  tokens.spacing[3.5],       // 14px
    gap:       tokens.spacing[2.5],       // 10px
    radius:    tokens.borderRadius["2xl"], // 16px
    showLabel: true,
  },
};

// ---------------------------------------------------------------------------
// ProductImg
// ---------------------------------------------------------------------------
export function ProductImg({
  size  = 40,
  image,
  alt   = "",
  style,
  className,
}: ProductImgProps) {
  const cfg = SIZE_CONFIG[size];
  const [imgError, setImgError] = useState(false);

  const containerStyle: React.CSSProperties = {
    width:          `${cfg.dim}px`,
    height:         `${cfg.dim}px`,
    flexShrink:     0,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            cfg.gap,
    paddingLeft:    cfg.paddingX,
    paddingRight:   cfg.paddingX,
    paddingTop:     cfg.paddingY,
    paddingBottom:  cfg.paddingY,
    borderRadius:   cfg.radius,
    background:     tokens.color.bg.bg,
    overflow:       "hidden",
    boxSizing:      "border-box" as const,
    ...style,
  };

  // When an image is provided (and hasn't errored), fill the container edge-to-edge
  if (image && !imgError) {
    return (
      <div style={{ ...containerStyle, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }} className={className}>
        <img
          src={image}
          alt={alt}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <CameraIcon color={tokens.color.fg.disabled} />
      {cfg.showLabel && (
        <span
          style={{
            fontFamily:    tokens.fontFamily.sans,
            fontSize:      tokens.fontSize.bodySmall,  // 12px
            fontWeight:    tokens.fontWeight.semiBold, // 600
            lineHeight:    "16px",                     // Figma: 16px (no token equivalent)
            color:         tokens.color.fg.disabled,   // #9ca3af
            whiteSpace:    "nowrap" as const,
            letterSpacing: "0",
          }}
        >
          NO IMAGE
        </span>
      )}
    </div>
  );
}

export default ProductImg;
