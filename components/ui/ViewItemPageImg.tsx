"use client";
// components/ui/ViewItemPageImg.tsx
// Figma: Scannable Design System — node 2796:7479 (ViewItemPageImg, 3 platforms)
// Upload icon: Figma node 66:607 (24px)

import React from "react";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CameraIcon } from "@/components/ui/ProductImg";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ViewItemPageImgPlatform = "mobile" | "desktop" | "empty";

export interface ViewItemPageImgProps {
  platform: ViewItemPageImgPlatform;
  /** Image URLs for the carousel */
  images?: string[];
  /** Zero-based index of the active image */
  currentIndex?: number;
  /** Called when the upload button is tapped (mobile only) */
  onUpload?: () => void;
  /** Called when "Add Image" is pressed (empty state only) */
  onAddImage?: () => void;
}

// ── UploadIcon ─────────────────────────────────────────────────────────────────

const UPLOAD_NODE_ID = "66:607";

function UploadIcon({ color = tokens.color.fg.primary }: { color?: string }) {
  const icons = useFigmaIcons([UPLOAD_NODE_ID]);
  const url   = icons[UPLOAD_NODE_ID];

  if (url) {
    return (
      <span
        aria-hidden
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
      />
    );
  }

  // Fallback while loading — upload arrow shape
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 6C2 3.79 3.79 2 6 2h12c2.21 0 4 1.79 4 4v12c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4V6z"
        stroke={color} strokeWidth="1.5"
      />
      <path
        d="M12 16V8m0 0-3 3m3-3 3 3"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Dot pagination ─────────────────────────────────────────────────────────────

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            width:        "8px",
            height:       "8px",
            borderRadius: tokens.borderRadius.full,
            background:   i === active
              ? tokens.color.fg.primary
              : tokens.color.fg.disabled,
            flexShrink:   0,
          }}
        />
      ))}
    </div>
  );
}

// ── Placeholder image ──────────────────────────────────────────────────────────

function PlaceholderImg({ width, height }: { width: string | number; height: string | number }) {
  return (
    <div style={{
      width,
      height,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      flexShrink:     0,
    }}>
      {/* 96px deco icon: rounded grey box + 64px camera (24px icon scaled ×2.667) */}
      <div style={{
        width:          "96px",
        height:         "96px",
        background:     tokens.color.bg.bg,
        borderRadius:   tokens.borderRadius["3xl"],
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
      }}>
        <span style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          transform:       "scale(2.667)",
          transformOrigin: "center",
        }}>
          <CameraIcon color={tokens.color.fg.disabled} />
        </span>
      </div>
    </div>
  );
}

// ── ViewItemPageImg ────────────────────────────────────────────────────────────

export function ViewItemPageImg({
  platform,
  images,
  currentIndex = 0,
  onUpload,
  onAddImage,
}: ViewItemPageImgProps) {
  const imgCount = images?.length ?? 3;
  const activeIdx = Math.min(currentIndex, imgCount - 1);

  // ── mobile ─────────────────────────────────────────────────────────────────
  if (platform === "mobile") {
    return (
      <div style={{
        position:       "relative",
        width:          "100%",
        height:         "240px",
        background:     tokens.color.base.white,
        display:        "flex",
        flexDirection:  "column",
        paddingTop:     tokens.spacing[2],
        paddingBottom:  tokens.spacing[4],
        gap:            tokens.spacing[4],
        boxSizing:      "border-box",
        overflow:       "hidden",
      }}>
        {/* Image area */}
        <div style={{ flex: "1 0 0", display: "flex", justifyContent: "center", overflow: "hidden" }}>
          {images?.[activeIdx] ? (
            <img
              src={images[activeIdx]}
              alt={`Image ${activeIdx + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PlaceholderImg width="100%" height="100%" />
          )}
        </div>

        {/* Bottom row: dots + badge */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: "18px", flexShrink: 0 }}>
          <Dots count={imgCount} active={activeIdx} />
          <div style={{ position: "absolute", right: tokens.spacing[4], top: "50%", transform: "translateY(-50%)" }}>
            <Badge color="gray" label={`${activeIdx + 1} of ${imgCount}`} />
          </div>
        </div>

        {/* Upload button — absolute top-right */}
        <div style={{ position: "absolute", top: tokens.spacing[4], right: tokens.spacing[4] }}>
          <Button
            variant="icon framed"
            icon={<UploadIcon />}
            onClick={onUpload}
          />
        </div>
      </div>
    );
  }

  // ── desktop ────────────────────────────────────────────────────────────────
  if (platform === "desktop") {
    return (
      <div style={{
        position:       "relative",
        width:          "100%",
        height:         "264px",
        background:     tokens.color.base.white,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        paddingTop:     tokens.spacing[4],
        paddingBottom:  tokens.spacing[4],
        gap:            tokens.spacing[4],
        boxSizing:      "border-box",
        overflow:       "hidden",
      }}>
        {/* Image */}
        <div style={{ flex: "1 0 0", width: "100%", overflow: "hidden", display: "flex", justifyContent: "center" }}>
          {images?.[activeIdx] ? (
            <img
              src={images[activeIdx]}
              alt={`Image ${activeIdx + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PlaceholderImg width="100%" height="100%" />
          )}
        </div>

        {/* Dots */}
        <div style={{ flexShrink: 0 }}>
          <Dots count={imgCount} active={activeIdx} />
        </div>

        {/* "1 of N" badge — absolute top-right */}
        <div style={{ position: "absolute", top: tokens.spacing[4], right: tokens.spacing[4] }}>
          <Badge color="gray" label={`${activeIdx + 1} of ${imgCount}`} />
        </div>
      </div>
    );
  }

  // ── empty state ────────────────────────────────────────────────────────────
  return (
    <div style={{
      width:          "100%",
      height:         "264px",
      background:     tokens.color.base.white,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      gap:            tokens.spacing[10],
      paddingTop:     tokens.spacing[6],
      paddingBottom:  tokens.spacing[6],
      boxSizing:      "border-box",
    }}>
      {/* Deco box with camera */}
      <div style={{
        width:          "96px",
        height:         "96px",
        background:     tokens.color.bg.bg,
        borderRadius:   tokens.borderRadius["3xl"],
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
      }}>
        <span style={{ transform: "scale(2.667)", transformOrigin: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CameraIcon color={tokens.color.fg.disabled} />
        </span>
      </div>

      {/* Add Image button */}
      <Button variant="secondary" label="Add Image" onClick={onAddImage} />
    </div>
  );
}
