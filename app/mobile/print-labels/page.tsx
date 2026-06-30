"use client";
// app/mobile/print-labels/page.tsx
// Figma: MF-serialisations node 263:60766

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { MobileButton } from "@/components/ui/mobile/Button";
import { SelectInput } from "@/components/ui/mobile/InputSelect";

// ── Radio option ───────────────────────────────────────────────────────────────

function RadioOption({
  label,
  selected,
  onSelect,
  divider,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  divider?: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           tokens.spacing[4],
        paddingBottom: divider ? tokens.spacing[4] : 0,
        borderBottom:  divider ? `1px solid ${tokens.color.divider.border}` : "none",
        cursor:        "pointer",
        flexShrink:    0,
        width:         "100%",
      }}
    >
      <div style={{
        width:          16,
        height:         16,
        borderRadius:   999,
        flexShrink:     0,
        background:     selected ? tokens.color.bg.blue : tokens.color.base.white,
        border:         selected
          ? `1.5px solid ${tokens.color.bg.blue}`
          : `1px solid ${tokens.color.divider.frame}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}>
        {selected && (
          <div style={{ width: 6, height: 6, borderRadius: 999, background: tokens.color.base.white }} />
        )}
      </div>
      <span style={{
        fontFamily: tokens.fontFamily.sans,
        fontSize:   tokens.fontSize.body,
        fontWeight: tokens.fontWeight.regular,
        lineHeight: tokens.lineHeight.body,
        color:      tokens.color.fg.primary,
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
    </div>
  );
}

const PRINTER_OPTIONS = [
  { label: "Sato CT4-LX",  value: "sato-ct4-lx"  },
  { label: "Zebra ZD420",  value: "zebra-zd420"  },
  { label: "Brother QL-820NWB", value: "brother-ql820" },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PrintLabelsPage() {
  const router  = useRouter();
  const [scope,   setScope]   = useState<"all" | "first">("all");
  const [printer, setPrinter] = useState("sato-ct4-lx");

  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      height:        "100dvh",
      background:    tokens.color.base.white,
      overflow:      "hidden",
      fontFamily:    tokens.fontFamily.sans,
    }}>
      <MobileAppBar
        page="task"
        title="Print labels"
        taskNavIcon="close"
        onClose={() => router.back()}
      />

      {/* Scrollable content */}
      <div style={{
        flex:          "1 1 0",
        overflowY:     "auto",
        display:       "flex",
        flexDirection: "column",
        gap:           tokens.spacing[6],
        padding:       tokens.spacing[4],
      }}>
        {/* Scope */}
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
          <span style={{
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.medium,
            lineHeight: tokens.lineHeight.body,
            color:      tokens.color.fg.primary,
          }}>
            Scope
          </span>
          <div style={{
            background:    tokens.color.base.white,
            border:        `1px solid ${tokens.color.divider.border}`,
            borderRadius:  "16px",
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[4],
            padding:       `${tokens.spacing[6]} ${tokens.spacing[4]}`,
          }}>
            <RadioOption
              label="Print all labels"
              selected={scope === "all"}
              onSelect={() => setScope("all")}
              divider
            />
            <RadioOption
              label="Print one (first) label"
              selected={scope === "first"}
              onSelect={() => setScope("first")}
            />
          </div>
        </div>

        {/* Printer */}
        <SelectInput
          label="Printer"
          options={PRINTER_OPTIONS}
          value={printer}
          onChange={setPrinter}
        />
      </div>

      {/* Footer */}
      <div style={{
        borderTop:     `1px solid ${tokens.color.divider.border}`,
        padding:       tokens.spacing[4],
        background:    tokens.color.base.white,
        flexShrink:    0,
        display:       "flex",
        flexDirection: "column",
        gap:           "12px",
      }}>
        <MobileButton
          variant="primary"
          label="Print"
          onClick={() => router.push("/mobile/serials-home")}
        />
        <button
          onClick={() => router.push("/mobile/serials-home")}
          style={{
            background:     "transparent",
            border:         "none",
            cursor:         "pointer",
            padding:        `${tokens.spacing[2]} 0`,
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,
            fontWeight:     500,
            lineHeight:     "20px",
            color:          tokens.color.fg.blue,
            textDecoration: "underline",
            width:          "100%",
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
