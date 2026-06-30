"use client";
// app/mobile/inspect/page.tsx
// Figma: MF-serialisations node 346-68664

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { RadioButton } from "@/components/ui/Radio";

// ── Types ──────────────────────────────────────────────────────────────────────

type ChecklistCol = "pass" | "monitor" | "repair" | "fail" | "na";

const COLS: { key: ChecklistCol; label: string }[] = [
  { key: "pass",    label: "Pass"    },
  { key: "monitor", label: "Monitor" },
  { key: "repair",  label: "Repair"  },
  { key: "fail",    label: "Fail"    },
  { key: "na",      label: "NA"      },
];

const ROWS = ["Visual", "Tactile", "Function"] as const;
type ChecklistRow = typeof ROWS[number];

type ChecklistState = Record<ChecklistRow, ChecklistCol | null>;

// ── Safe badge ─────────────────────────────────────────────────────────────────

function SafeBadge() {
  return (
    <span
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            "2px",
        padding:        `2px ${tokens.spacing[2]}`,
        borderRadius:   tokens.borderRadius.full,
        background:     "#DCFCE7",
        fontFamily:     tokens.fontFamily.sans,
        fontSize:       tokens.fontSize.bodySmall,
        fontWeight:     tokens.fontWeight.semiBold,
        lineHeight:     tokens.lineHeight.bodySmall,
        color:          "#166534",
        whiteSpace:     "nowrap" as const,
        flexShrink:     0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" fill="#22C55E" />
        <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Safe
    </span>
  );
}

// ── Select field ───────────────────────────────────────────────────────────────

function SelectField({ label, value, placeholder }: { label: string; value?: string; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
      <span
        style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    tokens.fontSize.body,
          fontWeight:  tokens.fontWeight.medium,
          lineHeight:  tokens.lineHeight.body,
          color:       tokens.color.fg.primary,
        }}
      >
        {label}
      </span>
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          background:     tokens.color.base.white,
          border:         `1px solid ${tokens.color.divider.frame}`,
          borderRadius:   tokens.borderRadius.md,
          boxShadow:      "0px 1px 4px 0px rgba(0,0,0,0.05)",
          overflow:       "hidden",
        }}
      >
        <span
          style={{
            flex:        "1 1 0",
            minWidth:    0,
            padding:     `${tokens.spacing[2.5]} ${tokens.spacing[2.5]}`,
            fontFamily:  tokens.fontFamily.sans,
            fontSize:    tokens.fontSize.body,
            fontWeight:  tokens.fontWeight.regular,
            lineHeight:  tokens.lineHeight.body,
            color:       value ? tokens.color.fg.primary : tokens.color.fg.disabled,
          }}
        >
          {value || placeholder || "Select..."}
        </span>
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        tokens.spacing[2],
            height:     "100%",
            padding:    `0 ${tokens.spacing[2.5]}`,
            flexShrink: 0,
          }}
        >
          <div style={{ width: "1px", alignSelf: "stretch", background: tokens.color.divider.border }} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 6l4 4 4-4" stroke={tokens.color.fg.support} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Checklist table ────────────────────────────────────────────────────────────

function ChecklistTable({
  state,
  onChange,
}: {
  state:    ChecklistState;
  onChange: (row: ChecklistRow, col: ChecklistCol) => void;
}) {
  // Column widths: first col takes remaining space, each radio col is fixed
  const colWidth   = 52;
  const labelWidth = "auto";

  return (
    <div
      style={{
        border:       `1px solid ${tokens.color.divider.frame}`,
        borderRadius: tokens.borderRadius.sm,
        overflow:     "hidden",
        width:        "100%",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          borderBottom: `1px solid ${tokens.color.divider.frame}`,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, padding: `${tokens.spacing[1]} ${tokens.spacing[2]}` }} />
        {COLS.map((col) => (
          <div
            key={col.key}
            style={{
              width:          colWidth,
              flexShrink:     0,
              textAlign:      "center",
              padding:        `${tokens.spacing[1]} 0`,
              fontFamily:     tokens.fontFamily.sans,
              fontSize:       tokens.fontSize.bodySmall,
              fontWeight:     tokens.fontWeight.regular,
              lineHeight:     tokens.lineHeight.bodySmall,
              color:          tokens.color.fg.primary,
            }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Data rows */}
      {ROWS.map((row, rowIdx) => (
        <div
          key={row}
          style={{
            display:      "flex",
            alignItems:   "center",
            borderBottom: rowIdx < ROWS.length - 1 ? `1px solid ${tokens.color.divider.frame}` : "none",
          }}
        >
          <div
            style={{
              flex:       1,
              minWidth:   0,
              padding:    `${tokens.spacing[3]} ${tokens.spacing[2]}`,
              fontFamily: tokens.fontFamily.sans,
              fontSize:   tokens.fontSize.body,
              fontWeight: tokens.fontWeight.medium,
              lineHeight: tokens.lineHeight.body,
              color:      tokens.color.fg.primary,
            }}
          >
            {row}
          </div>
          {COLS.map((col) => (
            <div
              key={col.key}
              style={{
                width:          colWidth,
                flexShrink:     0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        `${tokens.spacing[3]} 0`,
              }}
            >
              <RadioButton
                name={`checklist-${row}`}
                value={col.key}
                checked={state[row] === col.key}
                onChange={() => onChange(row, col.key)}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Select All row */}
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          borderTop:    `1px solid ${tokens.color.divider.frame}`,
          background:   tokens.color.bg.lightBg,
        }}
      >
        <div
          style={{
            flex:       1,
            minWidth:   0,
            padding:    `${tokens.spacing[3]} ${tokens.spacing[2]}`,
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            fontWeight: tokens.fontWeight.medium,
            lineHeight: tokens.lineHeight.body,
            color:      tokens.color.fg.primary,
          }}
        >
          Select All
        </div>
        {COLS.map((col) => {
          const allMatch = ROWS.every((r) => state[r] === col.key);
          return (
            <div
              key={col.key}
              style={{
                width:          colWidth,
                flexShrink:     0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        `${tokens.spacing[3]} 0`,
              }}
            >
              <RadioButton
                name="checklist-all"
                value={col.key}
                checked={allMatch}
                onChange={() => {
                  ROWS.forEach((r) => onChange(r, col.key));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Upload area ────────────────────────────────────────────────────────────────

function UploadArea() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
      <span
        style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    tokens.fontSize.body,
          fontWeight:  tokens.fontWeight.medium,
          lineHeight:  tokens.lineHeight.body,
          color:       tokens.color.fg.primary,
        }}
      >
        Product Images
      </span>
      <div
        style={{
          background:    tokens.color.bg.lightBg,
          border:        `2px dashed ${tokens.color.divider.frame}`,
          borderRadius:  tokens.borderRadius.lg,
          padding:       `${tokens.spacing[6]} ${tokens.spacing[4]}`,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           tokens.spacing[2],
        }}
      >
        <button
          type="button"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            tokens.spacing[1],
            padding:        `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
            background:     tokens.color.base.white,
            border:         `1px solid ${tokens.color.divider.frame}`,
            borderRadius:   tokens.borderRadius.md,
            cursor:         "pointer",
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,
            fontWeight:     tokens.fontWeight.medium,
            lineHeight:     tokens.lineHeight.body,
            color:          tokens.color.fg.primary,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 11V5M5 8l3-3 3 3" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Upload image
        </button>
        <span
          style={{
            fontFamily:  tokens.fontFamily.sans,
            fontSize:    tokens.fontSize.body,
            fontWeight:  tokens.fontWeight.medium,
            lineHeight:  tokens.lineHeight.body,
            color:       tokens.color.fg.support,
          }}
        >
          Choose images or drop files here
        </span>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function InspectPage() {
  const router = useRouter();

  const [checklist, setChecklist] = useState<ChecklistState>({
    Visual:   "pass",
    Tactile:  "pass",
    Function: "pass",
  });

  function handleChecklistChange(row: ChecklistRow, col: ChecklistCol) {
    setChecklist((prev) => ({ ...prev, [row]: col }));
  }

  return (
    <div
      style={{
        height:        "100dvh",
        display:       "flex",
        flexDirection: "column",
        background:    tokens.color.base.white,
        overflow:      "hidden",
        position:      "relative",
        fontFamily:    tokens.fontFamily.sans,
      }}
    >
      {/* App bar — white, border-bottom, centered "Inspect", close × left */}
      <MobileAppBar
        page="task"
        title="Inspect"
        onClose={() => router.back()}
      />

      {/* Scrollable content */}
      <div style={{ flex: "1 1 0", minHeight: 0, overflowY: "auto" }}>
        {/* Product item row */}
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           tokens.spacing[4],
            padding:       tokens.spacing[2],
            borderBottom:  `1px solid ${tokens.color.divider.border}`,
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              width:          56,
              height:         56,
              flexShrink:     0,
              borderRadius:   tokens.borderRadius.md,
              border:         `1px solid ${tokens.color.divider.border}`,
              background:     tokens.color.base.white,
              overflow:       "hidden",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Braided Safety Blue.webp"
              alt=""
              style={{ width: 48, height: 48, objectFit: "contain" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: tokens.spacing[1], justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily:   tokens.fontFamily.sans,
                  fontSize:     tokens.fontSize.body,
                  fontWeight:   tokens.fontWeight.medium,
                  lineHeight:   tokens.lineHeight.body,
                  color:        tokens.color.fg.primary,
                  flex:         "1 1 0",
                  minWidth:     0,
                  overflow:     "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace:   "nowrap",
                }}
              >
                Braided Safety Blue 12.7mm 1/2&quot; 1...
              </span>
              <SafeBadge />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, whiteSpace: "nowrap" }}>DMM</span>
              <div style={{ width: "1px", alignSelf: "stretch", background: tokens.color.divider.frame, flexShrink: 0 }} />
              <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, whiteSpace: "nowrap" }}>A327</span>
            </div>
            <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.primary, textDecoration: "underline" }}>
              #132241154A
            </span>
          </div>
        </div>

        {/* Form fields */}
        <div
          style={{
            padding:       tokens.spacing[4],
            display:       "flex",
            flexDirection: "column",
            gap:           tokens.spacing[4],
          }}
        >
          <SelectField
            label="Thorough Examination Job Reference"
            placeholder="Select..."
          />

          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <SelectField
              label="Checklist"
              value="Visual, Tactile, Function"
            />

            <ChecklistTable state={checklist} onChange={handleChecklistChange} />
          </div>

          <UploadArea />
        </div>
      </div>

      {/* Sticky footer */}
      <div
        style={{
          flexShrink:  0,
          padding:     `${tokens.spacing[4]} ${tokens.spacing[4]}`,
          borderTop:   `1px solid ${tokens.color.divider.border}`,
          background:  tokens.color.base.white,
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/mobile/serials-home?success=inspected")}
          style={{
            width:          "100%",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
            background:     tokens.color.brand.lime,
            border:         `1px solid #C1EB00`,
            borderRadius:   tokens.borderRadius.md,
            cursor:         "pointer",
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,
            fontWeight:     tokens.fontWeight.medium,
            lineHeight:     tokens.lineHeight.body,
            color:          tokens.color.fg.primary,
          }}
        >
          Complete Inspection
        </button>
      </div>
    </div>
  );
}
