"use client";

import React, { useState } from "react";
import tokens from "@/styles/design-tokens";
import { AppShell } from "@/components/ui/AppShell";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Sidebar / AppBar config (copied from approved prototype)
// ---------------------------------------------------------------------------
const SIDEBAR_SECTIONS = [
  {
    items: [
      { label: "Overview",          href: "/dashboard",                iconNodeId: "91:746"   as const },
      { label: "Team",              href: "/dashboard/team",           iconNodeId: "92:1154"  as const },
      { label: "Product Search",    href: "/dashboard/product-search", iconNodeId: "52:1245"  as const },
      { label: "Settings",          href: "/dashboard/settings",       iconNodeId: "46:2929"  as const, active: true },
      { label: "Scannable Updates", href: "/dashboard/updates",        iconNodeId: "2508:760" as const },
      { label: "Knowledge Base",    href: "/dashboard/knowledge",      iconNodeId: "91:739"   as const },
    ],
  },
  {
    title: "Equipment owners",
    collapsible: true,
    items: [
      { label: "Inventory",    href: "/dashboard/inventory",    iconNodeId: "92:758"    as const },
      { label: "My inventory", href: "/dashboard/my-inventory", iconNodeId: "92:778"    as const },
      { label: "Labels",       href: "/dashboard/labels",       iconNodeId: "3628:9947" as const },
      { label: "Inspections",  href: "/dashboard/inspections",  iconNodeId: "92:1150"   as const },
      { label: "Multi-scan",   href: "/dashboard/multi-scan",   iconNodeId: "92:796"    as const },
      { label: "Products/SKUs",href: "/dashboard/products",     iconNodeId: "3628:9947" as const },
    ],
  },
];

const APP_BAR_PROPS = {
  breadcrumbs: [
    { label: "Admin",    href: "/dashboard" },
    { label: "Settings", href: "/dashboard/settings" },
  ],
  userInitials: "KZ",
  language: "English",
};

const SIDEBAR_PROPS = {
  orgName:      "Wānaka Height Safety",
  userName:     "kiro zhang",
  userInitials: "KZ",
  planBadge:    "Pro" as const,
  sections:     SIDEBAR_SECTIONS,
};

// ---------------------------------------------------------------------------
// Pricing scale — non-linear slider (matches img 2)
// ---------------------------------------------------------------------------
const SCALE_POINTS = [200, 500, 1000, 2000, 3000, 5000, 7500, 10000];

function sliderToItems(value: number): number {
  const max = SCALE_POINTS.length - 1;
  const clamped = Math.max(0, Math.min(max, value));
  const lo = Math.floor(clamped);
  const hi = Math.ceil(clamped);
  if (lo === hi) return SCALE_POINTS[lo];
  const t = clamped - lo;
  return Math.round(SCALE_POINTS[lo] + t * (SCALE_POINTS[hi] - SCALE_POINTS[lo]));
}

function itemsToMonthlyPrice(items: number): number {
  // $8 per 100 items/month (approx Scannable pricing)
  return Math.round((items / 100) * 8);
}

function formatItems(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(/\.0$/, "")},${String(n % 1000).padStart(3, "0")}` : String(n);
}

// Simple comma formatter
function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// Subscription tab content
// ---------------------------------------------------------------------------
function SubscriptionTab() {
  // Slider state: 0 = 200 items, 7 = 10,000 items; default ≈ 1,400 items
  const [sliderPos, setSliderPos] = useState(2.5); // between index 2 (1000) and 3 (2000) → ~1400

  const planItems  = sliderToItems(sliderPos);
  const monthlyUsd = itemsToMonthlyPrice(planItems);

  // Progress bar
  const currentCount = 131;
  const planLimit    = 300;
  const pct          = Math.min(100, (currentCount / planLimit) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[0] }}>

      {/* ── Current Subscription ── */}
      <Section title="Current Subscription">
        <div style={{
          background:   tokens.color.base.white,
          borderRadius: tokens.borderRadius.lg,
          border:       `1px solid ${tokens.color.divider.border}`,
          padding:      tokens.spacing[6],
          display:      "flex",
          flexDirection:"column",
          gap:          tokens.spacing[4],
        }}>
          {/* Plan badges */}
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2] }}>
            <div style={{
              border:       `1px solid ${tokens.color.divider.frame}`,
              borderRadius: tokens.borderRadius.sm,
              padding:      `${tokens.spacing[0.5]} ${tokens.spacing[2]}`,
              display:      "inline-flex",
              alignItems:   "center",
            }}>
              <span style={{ ...tokens.typography.bodySB, color: tokens.color.fg.primary }}>Pro</span>
            </div>
            <div><Badge label="Billed Monthly" color="green" /></div>
          </div>

          {/* Renewal */}
          <p style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary, margin: 0 }}>
            Your plan renews on: <strong>June 28, 2026</strong>
          </p>

          {/* Progress bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
            <div style={{
              height:       tokens.spacing[2],
              borderRadius: tokens.borderRadius.full,
              background:   tokens.color.bg.darkBg,
              overflow:     "hidden",
            }}>
              <div style={{
                width:        `${pct}%`,
                height:       "100%",
                background:   tokens.color.brand.lime,
                borderRadius: tokens.borderRadius.full,
                transition:   "width 0.3s ease",
              }} />
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
            <p style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary, margin: 0 }}>
              Current inventory count: <strong>{currentCount}</strong>
            </p>
            <p style={{ ...tokens.typography.bodyR, color: tokens.color.fg.primary, margin: 0 }}>
              Current plan limit: <strong>{planLimit}</strong>
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: tokens.spacing[3] }}>
            <Button variant="secondary" label="View Billing Info" />
            <Button variant="destructive" label="Cancel Subscription" />
          </div>
        </div>
      </Section>

      {/* ── Update your Subscription ── */}
      <Section title="Update your Subscription">
        {/* Dark pricing card — matches img 2 */}
        <div style={{
          background:   tokens.color.brand.darkPurple,
          borderRadius: tokens.borderRadius["2xl"],
          padding:      `${tokens.spacing[6]} ${tokens.spacing[6]} ${tokens.spacing[5]}`,
          display:      "flex",
          flexDirection:"column",
          gap:          tokens.spacing[4],
        }}>
          {/* Adjust plan label + item count */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
            <span style={{
              ...tokens.typography.smallBodySB,
              color:         tokens.color.fg.disabled,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              Adjust Plan
            </span>
            <span style={{ ...tokens.typography.display, color: tokens.color.base.white }}>
              {fmt(planItems)} items
            </span>
            <span style={{ ...tokens.typography.bodyR, color: tokens.color.fg.disabled }}>
              ${fmt(monthlyUsd)} USD / month
            </span>
          </div>

          {/* Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[2] }}>
            <input
              type="range"
              min={0}
              max={SCALE_POINTS.length - 1}
              step={0.01}
              value={sliderPos}
              onChange={e => setSliderPos(parseFloat(e.target.value))}
              style={{
                width:     "100%",
                cursor:    "pointer",
                appearance:"none",
                WebkitAppearance: "none",
                height:    "4px",
                borderRadius: tokens.borderRadius.full,
                background: `linear-gradient(to right, ${tokens.color.brand.lime} ${(sliderPos / (SCALE_POINTS.length - 1)) * 100}%, rgba(255,255,255,0.15) ${(sliderPos / (SCALE_POINTS.length - 1)) * 100}%)`,
                outline:   "none",
                border:    "none",
              } as React.CSSProperties}
            />

            {/* Tick labels */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {["200", "500", "1,000", "5,000", "10,000", "100k+"].map(label => (
                <span key={label} style={{
                  ...tokens.typography.smallBodyR,
                  color: tokens.color.fg.disabled,
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Update plan button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: tokens.spacing[4] }}>
          <Button variant="primary" label="Update plan" />
        </div>
      </Section>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper — two-column (label | content) layout
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display:      "grid",
      gridTemplateColumns: "280px 1fr",
      gap:          tokens.spacing[8],
      padding:      `${tokens.spacing[8]} ${tokens.spacing[8]}`,
      borderBottom: `1px solid ${tokens.color.divider.border}`,
    }}>
      <div>
        <h2 style={{ ...tokens.typography.h5, color: tokens.color.fg.primary, margin: 0 }}>{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("subscription");

  const TAB_ITEMS = [
    { id: "account",      label: "Account info"  },
    { id: "subscription", label: "Subscription"  },
    { id: "api",          label: "API keys"      },
  ];

  return (
    <AppShell appBar={APP_BAR_PROPS} sidebar={SIDEBAR_PROPS}>
      {/* Page header */}
      <div style={{
        background:   tokens.color.base.white,
        borderBottom: `1px solid ${tokens.color.divider.border}`,
        padding:      `${tokens.spacing[6]} ${tokens.spacing[8]} 0`,
      }}>
        <h1 style={{ ...tokens.typography.h3, color: tokens.color.fg.primary, margin: `0 0 ${tokens.spacing[4]}` }}>
          Settings
        </h1>
        <Tabs items={TAB_ITEMS} activeId={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: "900px" }}>
        {activeTab === "subscription" && <SubscriptionTab />}
        {activeTab === "account" && (
          <div style={{ padding: tokens.spacing[8] }}>
            <p style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>Account info coming soon.</p>
          </div>
        )}
        {activeTab === "api" && (
          <div style={{ padding: tokens.spacing[8] }}>
            <p style={{ ...tokens.typography.bodyR, color: tokens.color.fg.support }}>API keys coming soon.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
