"use client";
// app/mobile/print-labels/page.tsx
// Figma: Serials file — node 91:11013

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";

// ── Label preview image assets from Figma ─────────────────────────────────────
const IMG_QR_CODE  = "https://www.figma.com/api/mcp/asset/2eca695c-bdce-491c-b2e8-bb95a6ad769f";
const IMG_ISO_2497 = "https://www.figma.com/api/mcp/asset/9e2f608b-6022-42e3-8722-4b793a799b24";
const IMG_CE_LOGO  = "https://www.figma.com/api/mcp/asset/eaf23252-a1de-46b6-8a62-587e4e1e7cdc";
const IMG_ISO_1641 = "https://www.figma.com/api/mcp/asset/7226b1fa-5e32-4ef6-9b97-2337f3ac9bb5";
const IMG_FRAME    = "https://www.figma.com/api/mcp/asset/a2abc68a-b841-4ff8-913f-09a4cc969dc1";

// ── Colours (resolved from design-tokens) ─────────────────────────────────────
const C_BORDER_LIGHT = tokens.color.divider.border;   // #e5e7eb
const C_BORDER_FRAME = tokens.color.divider.frame;    // #d1d5db
const C_FG_PRIMARY   = tokens.color.fg.primary;       // #111827
const C_INDIGO_500   = tokens.color.palette.indigo[500]; // #6366f1
const C_LIME_500     = tokens.color.brand.lime;        // #ccff00
const C_LIME_600     = tokens.color.divider.lime;      // #c1eb00
const C_WHITE        = tokens.color.base.white;        // #ffffff
const C_GRAY_200     = tokens.color.palette.gray[200]; // #e5e7eb

// ── Radio option ───────────────────────────────────────────────────────────────

function RadioOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        tokens.spacing[2],
        height:     20,
        cursor:     "pointer",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width:           16,
          height:          16,
          borderRadius:    999,
          flexShrink:      0,
          background:      selected ? C_INDIGO_500 : C_WHITE,
          border:          selected
            ? `1.5px solid ${C_INDIGO_500}`
            : `1px solid ${C_BORDER_FRAME}`,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
        }}
      >
        {selected && (
          <div
            style={{
              width:        6,
              height:       6,
              borderRadius: 999,
              background:   C_WHITE,
            }}
          />
        )}
      </div>
      <span
        style={{
          fontSize:   14,
          fontWeight: 400,
          lineHeight: "20px",
          color:      C_FG_PRIMARY,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── ChevronDown SVG ────────────────────────────────────────────────────────────

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke={C_FG_PRIMARY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Label preview card ─────────────────────────────────────────────────────────

function LabelPreview() {
  return (
    <div
      style={{
        position:     "relative",
        width:        113.4,
        height:       226.8,
        border:       `1px solid ${C_FG_PRIMARY}`,
        borderRadius: 8,
        background:   C_WHITE,
        overflow:     "hidden",
        flexShrink:   0,
      }}
    >
      <span style={{ position: "absolute", left: 2, top: 104, fontSize: 6.8, fontFamily: "Times New Roman, serif", color: C_FG_PRIMARY, lineHeight: "7px" }}>S123-4556</span>
      <span style={{ position: "absolute", left: 2, top: 111, fontSize: 6.8, fontFamily: "Times New Roman, serif", color: C_FG_PRIMARY, lineHeight: "7px" }}>10m, Low stretch</span>
      <span style={{ position: "absolute", left: 17, top: 156, fontSize: 6.8, fontFamily: "Times New Roman, serif", color: C_FG_PRIMARY, lineHeight: "7px" }}>MM/YY</span>
      <span style={{ position: "absolute", left: 18, top: 168, fontSize: 6.8, fontFamily: "Times New Roman, serif", color: C_FG_PRIMARY, lineHeight: "7px" }}>0408</span>
      <img alt="" src={IMG_QR_CODE}  style={{ position: "absolute", left: 72, top: 183, width: 32, height: 32 }} />
      <img alt="" src={IMG_ISO_2497} style={{ position: "absolute", left: 2,  top: 152, width: 13, height: 11 }} />
      <img alt="" src={IMG_CE_LOGO}  style={{ position: "absolute", left: 3,  top: 167, width: 13.722, height: 9.5 }} />
      <img alt="" src={IMG_ISO_1641} style={{ position: "absolute", left: 45, top: 153, width: 12, height: 10 }} />
      <div style={{ position: "absolute", left: 74, top: 152, width: 29, height: 29, background: C_GRAY_200, borderRadius: 5 }} />
      <span style={{ position: "absolute", left: 82, top: 163, fontSize: 6.8, color: "#000", lineHeight: "7px", fontWeight: 400 }}>logo</span>
      <img alt="" src={IMG_FRAME} style={{ position: "absolute", left: 8, top: 180, width: 45.4, height: 37.8 }} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PrintLabelsPage() {
  const router = useRouter();
  const [labelType, setLabelType] = useState<"30mm" | "18mm">("30mm");
  const [scope,     setScope]     = useState<"first" | "all" | "reprint" | "packaging">("first");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C_WHITE, overflow: "hidden" }}>
      {/* App bar */}
      <MobileAppBar
        page="task"
        title="Print labels"
        onClose={() => router.back()}
      />

      {/* Scrollable content */}
      <div
        style={{
          flex:          "1 0 0",
          overflowY:     "auto",
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[6],
          padding:       tokens.spacing[4],
        }}
      >
        {/* Label previews */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           8,
            borderBottom:  `1px solid ${C_BORDER_LIGHT}`,
            paddingBottom: tokens.spacing[4],
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500, lineHeight: "22px", color: C_FG_PRIMARY }}>
            Label previews
          </span>
          <div style={{ display: "flex", justifyContent: "center", padding: `${tokens.spacing[4]} 16px` }}>
            <LabelPreview />
          </div>
        </div>

        {/* Type */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: C_FG_PRIMARY }}>Type</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <RadioOption label="30mm Wide" selected={labelType === "30mm"} onSelect={() => setLabelType("30mm")} />
            <RadioOption label="18mm Wide" selected={labelType === "18mm"} onSelect={() => setLabelType("18mm")} />
          </div>
        </div>

        {/* Scope */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: C_FG_PRIMARY }}>Scope</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <RadioOption label="Print one(first) label" selected={scope === "first"}     onSelect={() => setScope("first")}     />
            <RadioOption label="Print all labels"        selected={scope === "all"}       onSelect={() => setScope("all")}       />
            <RadioOption label="Reprint failed jobs"     selected={scope === "reprint"}   onSelect={() => setScope("reprint")}   />
            <RadioOption label="Print packaging"         selected={scope === "packaging"} onSelect={() => setScope("packaging")} />
          </div>
        </div>

        {/* Printer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: C_FG_PRIMARY }}>Printer</span>
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              background:     C_WHITE,
              border:         `1px solid ${C_BORDER_FRAME}`,
              borderRadius:   6,
              padding:        "10px",
              boxShadow:      "0px 1px 4px 0px rgba(0,0,0,0.05)",
              cursor:         "pointer",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: C_FG_PRIMARY }}>
              Sato CT4-LX
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "stretch" }}>
              <div style={{ width: 1, background: C_BORDER_LIGHT, alignSelf: "stretch" }} />
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Print button */}
      <div style={{ borderTop: `1px solid ${C_BORDER_LIGHT}`, padding: 16, background: C_WHITE, flexShrink: 0 }}>
        <button
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "100%",
            padding:        "10px 16px",
            background:     C_LIME_500,
            border:         `1px solid ${C_LIME_600}`,
            borderRadius:   6,
            fontSize:       14,
            fontWeight:     500,
            lineHeight:     "20px",
            color:          C_FG_PRIMARY,
            cursor:         "pointer",
          }}
        >
          Print
        </button>
      </div>
    </div>
  );
}
