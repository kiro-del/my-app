"use client";
// app/styleguide/patterns/page.tsx

import { useState } from "react";
import { AppBar } from "@/components/ui/AppBar";
import { AppShell } from "@/components/ui/AppShell";
import { Sidebar } from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ContextMenu } from "@/components/patterns/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { ScanSimulation, ScanOverlay } from "@/components/patterns/ScanSimulation";
import { ScanSimulationSheet, ScanButton } from "@/components/patterns/ScanSimulationSheet";
import { SearchScanSheet } from "@/components/patterns/SearchScanSheet";
import { ScanInput } from "@/components/ui/InputScan";
import { ApplyToProduct, type CatalogueProduct, type SelectedProductItem } from "@/components/ui/ApplyToProduct";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Shared nav
// ---------------------------------------------------------------------------
const TOP_NAV = ["Colors","Typography","Spacing","Border Radius","Shadows","Icons","Components","Patterns","Mobile"];

// ---------------------------------------------------------------------------
// Sidebar icon IDs (same as dashboard)
// ---------------------------------------------------------------------------
const SIDEBAR_ICON_IDS = {
  brand:      "216:1202",
  avatar:     "2261:2169",
  overview:   "91:746",
  team:       "92:1154",
  search:     "52:1245",
  settings:   "46:2929",
  updates:    "2508:760",
  knowledge:  "91:739",
  products:   "3628:9947",
  serials:    "94:554",
  inspection: "92:1150",
  checklists: "92:1270",
  inventory:  "92:758",
  myInv:      "92:778",
  multiScan:  "92:796",
};

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "16px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>{title}</p>
      {children}
    </div>
  );
}

function CodeSnippet({ code }: { code: string }) {
  return (
    <div style={{ background: tokens.color.brand.darkGrey, borderRadius: tokens.borderRadius.md, padding: "12px 16px", marginTop: "12px" }}>
      <pre style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.brand.lime, margin: 0, whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{code}</pre>
    </div>
  );
}

function BehaviourRules({ rules }: { rules: { title: string; description: string }[] }) {
  return (
    <div style={{ marginTop: "32px", marginBottom: "8px" }}>
      <p style={{ fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "12px" }}>
        Behaviour rules
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {rules.map((rule, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 16px", background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md }}>
            <div style={{ width: "20px", height: "20px", borderRadius: tokens.borderRadius.full, background: tokens.color.tint.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
              <span style={{ fontSize: "11px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.blue, fontFamily: tokens.fontFamily.sans }}>{i + 1}</span>
            </div>
            <div>
              <p style={{ fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, margin: "0 0 2px" }}>{rule.title}</p>
              <p style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, margin: 0 }}>{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropsTable({ rows }: { rows: { prop: string; type: string; def: string; desc: string }[] }) {
  return (
    <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", marginTop: "32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "160px 220px 110px 1fr", gap: "12px", padding: "10px 20px", background: tokens.color.bg.bg, borderBottom: `1px solid ${tokens.color.divider.border}` }}>
        {["Prop","Type","Default","Description"].map(h => (
          <span key={h} style={{ fontSize: "11px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={row.prop} style={{ display: "grid", gridTemplateColumns: "160px 220px 110px 1fr", gap: "12px", padding: "12px 20px", borderBottom: i < rows.length-1 ? `1px solid ${tokens.color.divider.border}` : "none", alignItems: "start" }}>
          <code style={{ fontSize: "12px", fontFamily: "monospace", color: tokens.color.fg.blue, background: tokens.color.tint.blue, padding: "2px 6px", borderRadius: "4px", width: "fit-content" }}>{row.prop}</code>
          <code style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.fg.support }}>{row.type}</code>
          <code style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.fg.support }}>{row.def}</code>
          <p style={{ fontSize: "13px", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, margin: 0 }}>{row.desc}</p>
        </div>
      ))}
    </div>
  );
}


// Inline SVG: Figma API serves a stale cached grid for node 92:1270.
// Built from the actual Figma desktop SVG paths.
function ChecklistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
      <path d="M7.5 4H7C5.34315 4 4 5.34315 4 7V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V7C20 5.34315 18.6569 4 17 4H16.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="7" y="1" width="10" height="5" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="7" y="9" width="10" height="2" rx="1" fill="currentColor"/>
      <rect x="7" y="13" width="7" height="2" rx="1" fill="currentColor"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shared sidebar props factory — matches dashboard structure exactly
// ---------------------------------------------------------------------------
function makeSidebarProps(icons: Record<string, string>, selectedItem = "serials") {
  return {
    userName:     "Danny Smith",
    userSubtitle: "real mf",
    userInitials: "DS",
    variant:      "standard" as const,
    ctaLabel:     "Buy NFC Tags",
    sections: [
      {
        items: [
          { id: "overview",  label: "Overview",          iconUrl: icons[SIDEBAR_ICON_IDS.overview],   selected: selectedItem === "overview" },
          { id: "team",      label: "Team",              iconUrl: icons[SIDEBAR_ICON_IDS.team],        selected: selectedItem === "team" },
          { id: "search",    label: "Product Search",    iconUrl: icons[SIDEBAR_ICON_IDS.search],      selected: selectedItem === "search" },
          { id: "settings",  label: "Settings",          iconUrl: icons[SIDEBAR_ICON_IDS.settings],    selected: selectedItem === "settings" },
          { id: "updates",   label: "Scannable Updates", iconUrl: icons[SIDEBAR_ICON_IDS.updates],     selected: selectedItem === "updates",   showInfo: true },
          { id: "knowledge", label: "Knowledge Base",    iconUrl: icons[SIDEBAR_ICON_IDS.knowledge],   selected: selectedItem === "knowledge", showInfo: true },
        ],
      },
      {
        title:       "Manufacturers/Resellers",
        collapsible: true,
        items: [
          { id: "products",   label: "Products/SKUs", iconUrl: icons[SIDEBAR_ICON_IDS.products],   selected: selectedItem === "products" },
          { id: "serials",    label: "Serialisation", iconUrl: icons[SIDEBAR_ICON_IDS.serials],    selected: selectedItem === "serials",    showInfo: true },
          { id: "inspection", label: "Inspections",   iconUrl: icons[SIDEBAR_ICON_IDS.inspection], selected: selectedItem === "inspection" },
          { id: "checklists", label: "Checklists",    icon: <ChecklistIcon />,                    selected: selectedItem === "checklists" },
        ],
      },
      {
        title:       "Equipment Owners",
        collapsible: true,
        items: [
          { id: "inventory",  label: "Inventory",    iconUrl: icons[SIDEBAR_ICON_IDS.inventory],  selected: selectedItem === "inventory" },
          { id: "myInv",      label: "My inventory", iconUrl: icons[SIDEBAR_ICON_IDS.myInv],      selected: selectedItem === "myInv" },
          { id: "multiScan",  label: "Multi-scan",   iconUrl: icons[SIDEBAR_ICON_IDS.multiScan],  selected: selectedItem === "multiScan" },
          { id: "inspection2",label: "Inspections",  iconUrl: icons[SIDEBAR_ICON_IDS.inspection], selected: selectedItem === "inspection2" },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// App Shell pattern
// ---------------------------------------------------------------------------
function AppShellPattern({ icons }: { icons: Record<string, string> }) {
  const [selected, setSelected] = useState("serials");
  const [notifs, setNotifs]     = useState(0);
  const [bookDemo, setBookDemo] = useState(false);

  const sidebarProps = {
    ...makeSidebarProps(icons, selected),
    sections: makeSidebarProps(icons, selected).sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        onClick: () => setSelected(item.id),
      })),
    })),
  };

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/AppShell.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>Full-page layout combining Sidebar (284px) + AppBar (64px) + scrollable content area</p>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Preview options:</span>
        <button
          onClick={() => setNotifs(n => n > 0 ? 0 : 3)}
          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${notifs > 0 ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: notifs > 0 ? tokens.color.tint.blue : tokens.color.base.white, color: notifs > 0 ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
          Notifications
        </button>
        <button
          onClick={() => setBookDemo(b => !b)}
          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${bookDemo ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: bookDemo ? tokens.color.tint.blue : tokens.color.base.white, color: bookDemo ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
          Book a Demo
        </button>
      </div>

      {/* Framed preview */}
      <div style={{ height: "962px", border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", boxShadow: tokens.shadows.lg }}>
        <AppShell
          appBar={{
            breadcrumbs: [
              { label: "Home", href: "#" },
              { label: selected.charAt(0).toUpperCase() + selected.slice(1) },
            ],
            showBookADemo: bookDemo,
            notificationCount: notifs,
            userInitials: "DS",
          }}
          sidebar={sidebarProps}
        >
          <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ height: "32px", width: "240px", background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.md, opacity: 0.4 }} />
            <div style={{ height: "120px", background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.md, opacity: 0.2 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {[1,2,3].map(i => <div key={i} style={{ height: "80px", background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.md, opacity: 0.15 }} />)}
            </div>
          </div>
        </AppShell>
      </div>

      <CodeSnippet code={`import { AppShell } from "@/components/ui/AppShell";

<AppShell
  appBar={{ breadcrumbs: [{ label: "Home", href: "/" }, { label: "Serialisation" }] }}
  sidebar={{ userName: "Danny Smith", sections: [...] }}
>
  {/* page content */}
</AppShell>`} />

      <PropsTable rows={[
        { prop: "appBar",   type: "AppBarProps",   def: "—", desc: "All AppBar props — breadcrumbs, actions, user initials, notification count" },
        { prop: "sidebar",  type: "SidebarProps",  def: "—", desc: "All Sidebar props — user, variant, sections, CTA" },
        { prop: "children", type: "ReactNode",     def: "—", desc: "Page content rendered in the scrollable main area" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// App Bar pattern
// ---------------------------------------------------------------------------
function AppBarPattern() {
  const [notifs,   setNotifs]   = useState(0);
  const [bookDemo, setBookDemo] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/AppBar.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2150-1741</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>Top navigation bar — 64px tall · breadcrumb left · actions right</p>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Options:</span>
        <button
          onClick={() => setNotifs(n => n > 0 ? 0 : 3)}
          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${notifs > 0 ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: notifs > 0 ? tokens.color.tint.blue : tokens.color.base.white, color: notifs > 0 ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
          Notifications badge
        </button>
        <button
          onClick={() => setBookDemo(b => !b)}
          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${bookDemo ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: bookDemo ? tokens.color.tint.blue : tokens.color.base.white, color: bookDemo ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
          Book a Demo
        </button>
      </div>

      <Section title="Default">
        <div style={{ border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
          <AppBar
            breadcrumbs={[{ label: "Home", href: "#" }, { label: "Serialisation" }]}
            notificationCount={notifs}
            showBookADemo={bookDemo}
            userInitials="DS"
          />
        </div>
      </Section>

      <Section title="Deep breadcrumb">
        <div style={{ border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
          <AppBar
            breadcrumbs={[{ label: "Home", href: "#" }, { label: "Serialisation", href: "#" }, { label: "Create" }]}
            userInitials="DS"
          />
        </div>
      </Section>

      <CodeSnippet code={`import { AppBar } from "@/components/ui/AppBar";

<AppBar
  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Serialisation" }]}
  userInitials="DS"
  notificationCount={3}
  showBookADemo
/>`} />

      <PropsTable rows={[
        { prop: "breadcrumbs",          type: "BreadcrumbItem[]", def: "—",       desc: "Ordered list of { label, href? } shown on the left" },
        { prop: "showBookADemo",        type: "boolean",          def: "false",   desc: "Shows a lime 'Book a Demo' button" },
        { prop: "language",             type: "string",           def: '"EN"',    desc: "Language code shown in the selector pill" },
        { prop: "userInitials",         type: "string",           def: '"SW"',    desc: "Initials shown in the avatar pill" },
        { prop: "notificationCount",    type: "number",           def: "0",       desc: "Shows a red dot on the bell when > 0" },
        { prop: "onNotificationsClick", type: "() => void",       def: "—",       desc: "Called when the Notifications button is clicked" },
        { prop: "onLanguageClick",      type: "() => void",       def: "—",       desc: "Called when the language selector is clicked" },
        { prop: "onAvatarClick",        type: "() => void",       def: "—",       desc: "Called when the avatar pill is clicked" },
        { prop: "onBookADemoClick",     type: "() => void",       def: "—",       desc: "Called when the Book a Demo button is clicked" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar pattern
// ---------------------------------------------------------------------------
function SidebarPattern({ icons }: { icons: Record<string, string> }) {
  const [selected,     setSelected]     = useState("serials");
  const [variant,      setVariant]      = useState<"standard"|"pro"|"upgrade">("pro");
  const [collapsible,  setCollapsible]  = useState(false);

  const sidebarProps = {
    ...makeSidebarProps(icons, selected),
    variant,
    sections: makeSidebarProps(icons, selected).sections.map(section => ({
      ...section,
      collapsible,
      items: section.items.map(item => ({
        ...item,
        onClick: () => setSelected(item.id),
      })),
    })),
  };

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Sidebar.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>284px left navigation panel · standard / pro / upgrade variants · collapsible sections</p>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" as const }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Variant:</span>
        {(["standard","pro","upgrade"] as const).map(v => (
          <button key={v} onClick={() => setVariant(v)}
            style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${variant === v ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: variant === v ? tokens.color.tint.blue : tokens.color.base.white, color: variant === v ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
            {v}
          </button>
        ))}
        <span style={{ width: "1px", height: "16px", background: tokens.color.divider.border }} />
        <button onClick={() => setCollapsible(c => !c)}
          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${collapsible ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: collapsible ? tokens.color.tint.blue : tokens.color.base.white, color: collapsible ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
          Collapsible sections
        </button>
      </div>

      <div style={{ height: "962px", border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", display: "flex", boxShadow: tokens.shadows.lg }}>
        <Sidebar {...sidebarProps} />
        <div style={{ flex: 1, background: tokens.color.bg.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans }}>Content area</p>
        </div>
      </div>

      <CodeSnippet code={`import { Sidebar } from "@/components/ui/Sidebar";

<Sidebar
  userName="Danny Smith"
  userSubtitle="Scannable"
  userInitials="DS"
  variant="pro"
  ctaLabel="Buy NFC Tags"
  sections={[
    {
      items: [
        { id: "serials", label: "Serialisation", icon: <Icon />, selected: true, showInfo: true },
      ],
    },
  ]}
/>`} />

      <PropsTable rows={[
        { prop: "userName",     type: "string",                         def: "—",           desc: "Organisation name shown in the header" },
        { prop: "userSubtitle", type: "string",                         def: "undefined",   desc: "Optional subtitle below the name" },
        { prop: "userInitials", type: "string",                         def: "—",           desc: "Fallback initials for the avatar" },
        { prop: "variant",      type: '"standard" | "pro" | "upgrade"', def: '"standard"',  desc: "Controls PRO badge, status pill, and upgrade CTA" },
        { prop: "ctaLabel",     type: "string",                         def: '"Buy NFC Tags"', desc: "Label on the secondary CTA button" },
        { prop: "sections",     type: "SidebarSection[]",               def: "—",           desc: "Nav sections, each with optional title, collapsible flag, and items array" },
        { prop: "onCtaClick",   type: "() => void",                     def: "undefined",   desc: "Called when the CTA button is clicked" },
        { prop: "onUserClick",  type: "() => void",                     def: "undefined",   desc: "Called when the user header row is clicked" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Multi-Step Card pattern
// ---------------------------------------------------------------------------
function MultiStepCardPattern() {
  const [step, setStep] = useState<1 | 2>(1);

  const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke={tokens.color.fg.primary} strokeWidth="1.5"/><path d="M3 10h18M8 2v4M16 2v4" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round"/></svg>
  );

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>pattern: Multi-Step Card</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "8px", fontFamily: tokens.fontFamily.sans }}>Single white card with persistent header · step body swaps in place · footer always shows Back (step 2+), Cancel, and primary action.</p>

      {/* Step toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Preview step:</span>
        {([1, 2] as const).map(s => (
          <button key={s} onClick={() => setStep(s)} style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${step === s ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: step === s ? tokens.color.tint.blue : tokens.color.base.white, color: step === s ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
            Step {s}
          </button>
        ))}
      </div>

      <div style={{ border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", boxShadow: tokens.shadows.lg, background: tokens.color.base.white, display: "flex", flexDirection: "column" }}>

        {/* Persistent card header */}
        <div style={{ padding: "24px", borderBottom: `1px solid ${tokens.color.divider.border}` }}>
          <h1 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h3, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h3, color: tokens.color.fg.primary, margin: "0 0 4px" }}>Capture Serials</h1>
          <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support, margin: 0 }}>Use this tool to capture serials created outside of Scannable</p>
        </div>

        {/* Step 1 body */}
        {step === 1 && (
          <div style={{ padding: "24px", flex: 1 }}>
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: "16px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, margin: "0 0 16px" }}>Batch Details</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              <Input label="Purchase order"     placeholder="Enter a reference number" />
              <Input label="Sales order number" placeholder="Enter a sales order number" />
              <Input label="Customer reference" placeholder="Enter a customer reference number" />
              <Input label="Batch number"       placeholder="Enter a batch number" />
              <Input label="Date of manufacture" placeholder="Select a date" tailingIcon={<CalendarIcon />} />
            </div>
            <div style={{ height: "1px", background: tokens.color.divider.border, margin: "0 0 24px" }} />
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: "16px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, margin: "0 0 4px" }}>Apply to Product</p>
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support, margin: "0 0 16px" }}>Add as many products as needed.</p>
            <div style={{ width: "50%", border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, padding: "12px 16px", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.disabled }}>Product selector (50% width)</div>
          </div>
        )}

        {/* Step 2 body */}
        {step === 2 && (
          <div style={{ padding: "16px 24px", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* One expanded card preview */}
              <div style={{ width: "50%", border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "16px", boxSizing: "border-box" as const }}>
                <div style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, marginBottom: "8px" }}>Ultra O Locksafe — expand to capture serials</div>
                <Input placeholder="Serial Number" inlineButton={
                  <button type="button" style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1], height: "100%", paddingTop: tokens.spacing[2.5], paddingBottom: tokens.spacing[2.5], paddingLeft: tokens.spacing[2], paddingRight: tokens.spacing[2.5], background: tokens.color.brand.lime, border: `1px solid ${tokens.color.divider.lime}`, cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, whiteSpace: "nowrap" as const, borderRadius: 0 }}>
                    Scan
                  </button>
                } />
              </div>
              <div style={{ width: "50%", border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "16px", boxSizing: "border-box" as const, background: tokens.color.tint.blue, display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9" stroke={tokens.color.fg.blue} strokeWidth="1.5"/><circle cx="12" cy="8.5" r="1" fill={tokens.color.fg.blue}/><path d="M12 11.5v5" stroke={tokens.color.fg.blue} strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.blue }}>Or capture serials via tower machine</span>
              </div>
            </div>
          </div>
        )}

        {/* Persistent footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: step === 2 ? "space-between" : "flex-end", padding: "16px 24px", borderTop: `1px solid ${tokens.color.divider.border}` }}>
          {step === 2 && (
            <button onClick={() => setStep(1)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, padding: 0 }}>
              <BackIcon />Back
            </button>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            <Button label="Cancel" variant="secondary" />
            {step === 1
              ? <Button label="Next Step" variant="primary" onClick={() => setStep(2)} />
              : <Button label="Save"      variant="primary" />
            }
          </div>
        </div>
      </div>

      <CodeSnippet code={`// Card shell — shared across all steps
<div style={{ background: white, border: "1px solid divider/border", borderRadius: "lg", display: "flex", flexDirection: "column" }}>

  {/* Always-visible header */}
  <div style={{ padding: "24px", borderBottom: "1px solid divider/border" }}>
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </div>

  {/* Step body swaps here */}
  {step === 1 && <Step1Content />}
  {step === 2 && <Step2Content />}

  {/* Always-visible footer */}
  <div style={{ display: "flex", justifyContent: step === 2 ? "space-between" : "flex-end",
                padding: "16px 24px", borderTop: "1px solid divider/border" }}>
    {step === 2 && <BackButton />}
    <div style={{ display: "flex", gap: "12px" }}>
      <Button variant="secondary" label="Cancel" />
      <Button variant="primary"   label={step === 1 ? "Next Step" : "Save"} />
    </div>
  </div>
</div>`} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Context Menu pattern
// ---------------------------------------------------------------------------
function ContextMenuPattern() {
  const [floatingOpen,     setFloatingOpen]     = useState(false);
  const [sheetWebOpen,     setSheetWebOpen]     = useState(false);
  const [sheetMobileOpen,  setSheetMobileOpen]  = useState(false);
  const [toggleA,          setToggleA]          = useState(false);
  const [toggleB,          setToggleB]          = useState(false);

  const DEMO_ITEMS = [
    { label: "Update information" },
    { label: "Archive",  divider: true },
    { label: "Delete",   state: "destructive" as const },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/patterns/ContextMenu.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>+ ContextMenuItem.tsx</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
        Three surface types: floating popup, web bottom sheet (400px centred), mobile bottom sheet (full-width, drag handle, slide-up animation).
      </p>

      {/* ── Variants ─────────────────────────────────────────────────────── */}
      <Section title="Floating">
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button label="Open floating menu" variant="secondary" onClick={() => setFloatingOpen(o => !o)} />
          <ContextMenu variant="floating" open={floatingOpen} onClose={() => setFloatingOpen(false)} floatingStyle={{ top: "44px", left: 0 }}>
            <ContextMenuItem label="Update information" />
            <ContextMenuItem label="Move to folder" trailing="arrow" />
            <ContextMenuItem label="Show archived" trailing="toggle" toggleChecked={toggleA} onToggleChange={setToggleA} />
            <ContextMenuItem label="Preview mode"  trailing="toggle" toggleChecked={toggleB} onToggleChange={setToggleB} />
            <ContextMenuItem label="Archive" divider />
            <ContextMenuItem label="Delete" state="destructive" onClick={() => setFloatingOpen(false)} />
          </ContextMenu>
        </div>
      </Section>

      <Section title="Bottom sheet — web">
        <Button label="Open web bottom sheet" variant="secondary" onClick={() => setSheetWebOpen(true)} />
        <ContextMenu variant="bottom-sheet-web" open={sheetWebOpen} onClose={() => setSheetWebOpen(false)}>
          {DEMO_ITEMS.map(item => (
            <ContextMenuItem key={item.label} label={item.label} state={item.state} divider={item.divider} onClick={() => setSheetWebOpen(false)} />
          ))}
        </ContextMenu>
      </Section>

      <Section title="Bottom sheet — mobile">
        <Button label="Open mobile bottom sheet" variant="secondary" onClick={() => setSheetMobileOpen(true)} />
        <ContextMenu variant="bottom-sheet-mobile" open={sheetMobileOpen} onClose={() => setSheetMobileOpen(false)}>
          {DEMO_ITEMS.map(item => (
            <ContextMenuItem key={item.label} label={item.label} state={item.state} divider={item.divider} onClick={() => setSheetMobileOpen(false)} />
          ))}
        </ContextMenu>
      </Section>


      <BehaviourRules rules={[
        {
          title:       "Backdrop tap dismisses the sheet",
          description: "Tapping anywhere outside the panel (on the semi-transparent overlay) calls onClose and slides the sheet away. Always wire onClose={() => setOpen(false)} — omitting it leaves the sheet non-dismissible.",
        },
        {
          title:       "Escape key dismisses on desktop",
          description: "Pressing Escape while a sheet or floating menu is open triggers onClose. Behaviour is identical across all three variants.",
        },
        {
          title:       "Item action then dismiss",
          description: "Each ContextMenuItem onClick should perform its action and then call the parent's close handler. The sheet does not auto-close on item click — the consumer controls timing.",
        },
        {
          title:       "One menu open at a time",
          description: "Only one ContextMenu should be open simultaneously. Opening a second menu must close the first.",
        },
      ]} />

<CodeSnippet code={`import { ContextMenu }     from "@/components/patterns/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";

// Floating
<div style={{ position: "relative" }}>
  <Button onClick={() => setOpen(true)} ... />
  <ContextMenu variant="floating" open={open} onClose={() => setOpen(false)}
    floatingStyle={{ top: "44px", left: 0 }}>
    <ContextMenuItem label="Edit" />
    <ContextMenuItem label="Delete" state="destructive" />
  </ContextMenu>
</div>

// Mobile bottom sheet
<ContextMenu variant="bottom-sheet-mobile" open={open} onClose={() => setOpen(false)}>
  <ContextMenuItem label="Capture serials" onClick={handleCapture} />
  <ContextMenuItem label="Add to inventory" onClick={handleAdd} />
</ContextMenu>`} />

      <PropsTable rows={[
        { prop: "variant",      type: '"floating" | "bottom-sheet-web" | "bottom-sheet-mobile"', def: '"floating"', desc: "Surface type — floating popup or animated slide-up sheet" },
        { prop: "open",         type: "boolean",       def: "—",      desc: "Controls visibility. Bottom sheets animate in/out; floating mounts/unmounts instantly" },
        { prop: "onClose",      type: "() => void",    def: "—",      desc: "Called on backdrop click or Escape key" },
        { prop: "children",     type: "ReactNode",     def: "—",      desc: "ContextMenuItem rows (or any content)" },
        { prop: "width",        type: "number",        def: "240/400", desc: "Panel width in px — floating default 240, web sheet default 400" },
        { prop: "floatingStyle",type: "CSSProperties", def: "—",      desc: "Positioning overrides for the floating panel (top, left, right, bottom)" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overlay demo — sub-component so it can hold its own state
// ---------------------------------------------------------------------------
function OverlayDemo() {
  const [open, setOpen]     = useState(false);
  const [serial, setSerial] = useState("");

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" as const, marginBottom: "24px" }}>
      {/* Preview frame — acts as the "existing page" the overlay sits on top of */}
      <div style={{
        position:     "relative",
        width:        "393px",
        height:       "580px",
        borderRadius: tokens.borderRadius["2xl"],
        overflow:     "hidden",
        border:       `1px solid ${tokens.color.divider.frame}`,
        boxShadow:    tokens.shadows.lg,
        background:   tokens.color.base.white,
        flexShrink:   0,
        display:      "flex",
        flexDirection: "column" as const,
      }}>
        {/* Simulated app bar */}
        <div style={{
          height:       "56px",
          borderBottom: `1px solid ${tokens.color.divider.frame}`,
          display:      "flex",
          alignItems:   "center",
          padding:      `0 ${tokens.spacing[4]}`,
          background:   tokens.color.base.white,
        }}>
          <span style={{ ...tokens.typography.h5, color: tokens.color.fg.primary }}>Link to a Product</span>
        </div>

        {/* Page content */}
        <div style={{ padding: tokens.spacing[4], display: "flex", flexDirection: "column" as const, gap: tokens.spacing[3] }}>
          <ScanInput
            label="Search Product to Link the NFC"
            placeholder="Search by name or code…"
            value={serial}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerial(e.target.value)}
            onScan={() => setOpen(true)}
          />
        </div>

        {/* Overlay mounts inside the frame */}
        <ScanOverlay
          open={open}
          onClose={() => setOpen(false)}
          contained
          detectionDelay={1800}
          onDetected={value => { setSerial(value); setOpen(false); }}
        />
      </div>

      {/* Instructions */}
      <div style={{ flex: 1, minWidth: "200px", paddingTop: tokens.spacing[2] }}>
        <p style={{ fontSize: "13px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, lineHeight: "1.6", margin: 0 }}>
          Click <strong>Scan</strong> to open the full-screen overlay. It dims the page, shows a centred dashed scan frame, and auto-detects after ~1.8 s. The close button dismisses without scanning.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sheet demo — sub-component so it can hold its own state
// ---------------------------------------------------------------------------
function SheetDemo() {
  const [open, setOpen]       = useState(false);
  const [serial, setSerial]   = useState("");
  const [scanKey, setScanKey] = useState(0);

  const handleOpen = () => {
    setScanKey(k => k + 1);
    setOpen(true);
  };

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" as const, marginBottom: "24px" }}>
      {/* Preview frame */}
      <div style={{
        position:     "relative",
        width:        "393px",
        height:       "580px",
        borderRadius: tokens.borderRadius["2xl"],
        overflow:     "hidden",
        border:       `1px solid ${tokens.color.divider.frame}`,
        boxShadow:    tokens.shadows.lg,
        background:   tokens.color.bg.bg,
        flexShrink:   0,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        flexDirection: "column" as const,
        gap:          tokens.spacing[4],
        padding:      tokens.spacing[6],
      }}>
        <ScanInput
          label="Serial number"
          placeholder="Scan or type…"
          value={serial}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerial(e.target.value)}
          onScan={handleOpen}
        />
        <ScanSimulationSheet
          key={scanKey}
          open={open}
          onClose={() => setOpen(false)}
          contained
          detectionDelay={1800}
          onDetected={value => { setSerial(value); setOpen(false); }}
        />
      </div>

      {/* Instructions */}
      <div style={{ flex: 1, minWidth: "200px", paddingTop: tokens.spacing[2] }}>
        <p style={{ fontSize: "13px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, lineHeight: "1.6", margin: 0 }}>
          Click <strong>Scan</strong> in the input to open the bottom sheet. The scanner auto-detects after ~1.8 s and fills the field.
        </p>
      </div>
    </div>
  );
}

function ScanButtonDemo() {
  const [open, setOpen] = useState(false);
  const [val, setVal]   = useState("");

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" as const, marginBottom: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: tokens.spacing[4], minWidth: "280px" }}>
        <ScanInput
          label="Enabled"
          placeholder="Tap Scan →"
          value={val}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value)}
          onScan={() => setOpen(true)}
        />
        <ScanSimulationSheet
          open={open}
          onClose={() => setOpen(false)}
          onDetected={v => { setVal(v); setOpen(false); }}
        />
        <ScanInput
          label="Disabled"
          placeholder="Not available"
          value=""
          onChange={() => {}}
          disabled
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scan Simulation pattern
// ---------------------------------------------------------------------------
function ScanSimulationPattern() {
  const [status,    setStatus]    = useState<"scanning" | "detected">("scanning");
  const [delay,     setDelay]     = useState(1800);
  const [key,       setKey]       = useState(0); // re-mount to restart

  const DEMO_DATA = [
    { key: "Product",      value: "Ultra O Locksafe" },
    { key: "Manufacturer", value: "DMM" },
    { key: "Part No.",     value: "A327MG" },
    { key: "Standard",     value: "EN 362 : 2004" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/patterns/ScanSimulation.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
        Full-screen camera view with animated lime scan line. Auto-advances to a slide-up detected sheet after <code style={{ fontFamily: "monospace" }}>detectionDelay</code> ms. Supports uncontrolled (auto-timer) or controlled (<code style={{ fontFamily: "monospace" }}>status</code> prop) modes.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" as const }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Mode:</span>
        <button onClick={() => { setStatus("scanning"); setKey(k => k + 1); }}
          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${tokens.color.divider.border}`, borderRadius: "20px", background: tokens.color.base.white, color: tokens.color.fg.support, cursor: "pointer" }}>
          ↺ Restart scanning
        </button>
        <button onClick={() => setStatus("detected")}
          style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${tokens.color.fg.blue}`, borderRadius: "20px", background: tokens.color.tint.blue, color: tokens.color.fg.blue, cursor: "pointer" }}>
          Skip to detected
        </button>
        <span style={{ width: "1px", height: "16px", background: tokens.color.divider.border }} />
        <span style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans }}>Delay:</span>
        {([800, 1800, 3000] as const).map(d => (
          <button key={d} onClick={() => { setDelay(d); setKey(k => k + 1); }}
            style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${delay === d ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: delay === d ? tokens.color.tint.blue : tokens.color.base.white, color: delay === d ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
            {d}ms
          </button>
        ))}
      </div>

      {/* Preview — iPhone-sized frame */}
      <div style={{
        width:        "393px",
        height:       "580px",
        borderRadius: tokens.borderRadius["2xl"],
        overflow:     "hidden",
        border:       `1px solid ${tokens.color.divider.frame}`,
        boxShadow:    tokens.shadows.lg,
      }}>
        <ScanSimulation
          key={key}
          status={status}
          detectionDelay={delay}
          scanLabel="Product"
          hint="Looking for QR or barcode…"
          subHint="Hold steady · keep label flat"
          detectedTitle="Product detected"
          detectedSubtitle="QR · GS1 DataMatrix"
          detectedData={DEMO_DATA}
          confirmLabel="Open product"
          rescanLabel="Scan another"
          manualEntryLabel="Enter manually"
          onConfirm={() => alert("→ onConfirm fired")}
          onRescan={() => setStatus("scanning")}
          onManualEntry={() => setStatus("detected")}
        />
      </div>

      <CodeSnippet code={`import { ScanSimulation } from "@/components/patterns/ScanSimulation";

// Uncontrolled — auto-detects after detectionDelay ms
<ScanSimulation
  detectionDelay={1800}
  scanLabel="Product"
  detectedTitle="Product detected"
  detectedSubtitle="QR · GS1 DataMatrix"
  detectedData={[
    { key: "Product",      value: "Ultra O Locksafe" },
    { key: "Manufacturer", value: "DMM" },
    { key: "Part No.",     value: "A327MG" },
  ]}
  confirmLabel="Open product"
  onConfirm={() => router.push("/mobile/product-info")}
  onRescan={() => {/* reset scan */}}
/>

// Controlled — you drive the state
const [status, setStatus] = useState<"scanning" | "detected">("scanning");
<ScanSimulation
  status={status}
  onConfirm={() => router.push("/mobile/product-info")}
  onRescan={() => setStatus("scanning")}
/>`} />

      <PropsTable rows={[
        { prop: "status",           type: '"scanning" | "detected"', def: "internal",  desc: "Controlled state. Omit to let the component auto-advance via detectionDelay." },
        { prop: "detectionDelay",   type: "number",                  def: "1800",      desc: "ms before the detected sheet auto-slides up (uncontrolled mode only)." },
        { prop: "scanLabel",        type: "string",                  def: '"Product"', desc: "Pill label above the viewfinder frame." },
        { prop: "hint",             type: "string",                  def: '"Looking for QR or barcode…"', desc: "Pulsing status text shown while scanning." },
        { prop: "subHint",          type: "string",                  def: '"Hold steady…"', desc: "Smaller sub-hint text beneath the main hint." },
        { prop: "detectedTitle",    type: "string",                  def: '"Product detected"', desc: "Bold title in the slide-up sheet." },
        { prop: "detectedSubtitle", type: "string",                  def: "—",         desc: "Optional subtitle e.g. codec info (QR · GS1 DataMatrix)." },
        { prop: "detectedData",     type: "ScanDetectedRow[]",       def: "[]",        desc: "Key-value rows shown in the info card inside the sheet." },
        { prop: "confirmLabel",     type: "string",                  def: '"Confirm"', desc: "Primary CTA button label." },
        { prop: "rescanLabel",      type: "string",                  def: '"Scan another"', desc: "Ghost button label — resets to scanning state." },
        { prop: "manualEntryLabel", type: "string",                  def: '"Enter manually"', desc: "Button label that skips scanning and shows the detected sheet." },
        { prop: "onConfirm",        type: "() => void",              def: "—",         desc: "Called when the primary CTA is tapped." },
        { prop: "onRescan",         type: "() => void",              def: "—",         desc: "Called when the rescan button is tapped (after resetting sheet)." },
        { prop: "onManualEntry",    type: "() => void",              def: "—",         desc: "Called when manual entry is tapped." },
      ]} />

      {/* ── Sheet variant ──────────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: tokens.color.divider.border, margin: "40px 0" }} />

      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/patterns/ScanSimulationSheet.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
        Bottom-sheet variant (60 vh). Use when scanning is a secondary action within an existing screen — e.g. filling an input field, searching for a product, or picking from a results list. Composed of <code style={{ fontFamily: "monospace" }}>BottomSheet</code> + <code style={{ fontFamily: "monospace" }}>Tabs</code> + <code style={{ fontFamily: "monospace" }}>ScanView</code>.
      </p>

      <SheetDemo />

      <CodeSnippet code={`import { ScanSimulationSheet, ScanButton } from "@/components/patterns/ScanSimulationSheet";
import { Input } from "@/components/ui/Input";

// ── Pattern A: fill a single input field ─────────────────────────────────────
const [open, setOpen] = useState(false);
const [serial, setSerial] = useState("");

<Input
  label="Serial number"
  value={serial}
  onChange={e => setSerial(e.target.value)}
  inlineButton={<ScanButton onClick={() => setOpen(true)} />}
/>

<ScanSimulationSheet
  open={open}
  onClose={() => setOpen(false)}
  onDetected={value => { setSerial(value); setOpen(false); }}
/>

// ── Pattern B: show results inside the sheet ──────────────────────────────────
const [results, setResults] = useState<Product[]>([]);

<ScanSimulationSheet
  open={open}
  onClose={() => { setOpen(false); setResults([]); }}
  onDetected={value => setResults(lookupProduct(value))}
  detectedContent={results.length > 0 ? <ProductList items={results} /> : undefined}
/>

// ── Pattern C: fill search + navigate ────────────────────────────────────────
<ScanSimulationSheet
  open={open}
  onClose={() => setOpen(false)}
  onDetected={value => { setSearch(value); setOpen(false); router.push("/search?q=" + value); }}
/>`} />

      <PropsTable rows={[
        { prop: "open",             type: "boolean",         def: "—",         desc: "Controls sheet visibility." },
        { prop: "onClose",          type: "() => void",      def: "—",         desc: "Called on backdrop tap or swipe-down." },
        { prop: "contained",        type: "boolean",         def: "false",     desc: "Scope to nearest position:relative parent (for 393px mobile prototype wrapper)." },
        { prop: "detectionDelay",   type: "number",          def: "1800",      desc: "ms before auto-firing onDetected in uncontrolled mode." },
        { prop: "mockValue",        type: "string",          def: '"12344433-43"', desc: "Simulated scan result passed to onDetected." },
        { prop: "onDetected",       type: "(value: string) => void", def: "—", desc: "Called when a scan is detected. Parent decides outcome: close sheet, fill field, show results." },
        { prop: "detectedContent",  type: "ReactNode",       def: "—",         desc: "When set, replaces the scan camera view with this content (e.g. results list). Set to null/undefined to return to scanning." },
        { prop: "hint",             type: "string",          def: '"Looking for QR or barcode…"', desc: "Pulsing status text shown while scanning." },
        { prop: "subHint",          type: "string",          def: '"Hold steady · keep label flat"', desc: "Smaller sub-hint beneath the main hint." },
        { prop: "manualEntryLabel", type: "string",          def: '"Enter manually"', desc: "Button at the bottom of the scan view for manual fallback." },
        { prop: "onManualEntry",    type: "() => void",      def: "—",         desc: "Called when manual entry is tapped." },
      ]} />

      {/* ── Overlay variant ────────────────────────────────────────────────── */}
      <div style={{ height: "1px", background: tokens.color.divider.border, margin: "40px 0" }} />

      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>ScanOverlay</code>
        <span style={{ marginLeft: tokens.spacing[2], fontSize: "12px", fontFamily: "monospace", color: tokens.color.fg.support }}>from @/components/patterns/ScanSimulation</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
        Full-screen dark overlay variant (Figma node 8496:217947). Dims the existing page and shows a centred dashed scan frame. Use when you want maximum scanning focus without leaving the page — the overlay closes after detection and the result fills the underlying input.
      </p>

      <OverlayDemo />

      <CodeSnippet code={`import { ScanOverlay } from "@/components/patterns/ScanSimulation";
import { ScanButton }   from "@/components/patterns/ScanSimulationSheet";

const [open, setOpen]     = useState(false);
const [serial, setSerial] = useState("");

<Input
  label="Search Product to Link the NFC"
  value={serial}
  onChange={e => setSerial(e.target.value)}
  inlineButton={<ScanButton onClick={() => setOpen(true)} />}
/>

{/* Overlay sits inside position:relative container */}
<ScanOverlay
  open={open}
  onClose={() => setOpen(false)}
  contained
  onDetected={value => { setSerial(value); setOpen(false); }}
/>`} />

      <PropsTable rows={[
        { prop: "open",            type: "boolean",                  def: "—",             desc: "Controls overlay visibility." },
        { prop: "onClose",         type: "() => void",               def: "—",             desc: "Called when the close button is tapped." },
        { prop: "contained",       type: "boolean",                  def: "false",         desc: "position:absolute (inside a relative parent) vs position:fixed (viewport)." },
        { prop: "detectionDelay",  type: "number",                   def: "1800",          desc: "ms before auto-firing onDetected." },
        { prop: "mockValue",       type: "string",                   def: '"12344433-43"', desc: "Simulated scan result passed to onDetected." },
        { prop: "onDetected",      type: "(value: string) => void",  def: "—",             desc: "Called when a scan is detected." },
      ]} />

      <div style={{ height: "1px", background: tokens.color.divider.border, margin: "40px 0" }} />

      <h3 style={{ fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, margin: "0 0 8px" }}>ScanButton</h3>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
        Lime inline button designed for <code style={{ fontFamily: "monospace" }}>{"<Input inlineButton={...} />"}</code>. Opens the sheet on click.
      </p>

      <ScanButtonDemo />

      <PropsTable rows={[
        { prop: "onClick",   type: "() => void", def: "—",        desc: "Handler — typically opens the ScanSimulationSheet." },
        { prop: "disabled",  type: "boolean",    def: "false",    desc: "Dims button and disables interaction." },
        { prop: "label",     type: "string",     def: '"Scan"',   desc: "Button text label." },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search & Scan Sheet pattern
// ---------------------------------------------------------------------------
function SearchScanSheetPattern() {
  const [open, setOpen]               = useState(false);
  const [defaultTab, setDefaultTab]   = useState<"scan" | "search">("scan");
  const [lastScan, setLastScan]       = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/patterns/SearchScanSheet.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
        Mobile bottom sheet triggered by the lime centre button in <code style={{ fontFamily: "monospace" }}>MobileBottomNav</code>. Three tabs: NFC (coming soon), Scan (full-screen camera), Search (input + filter chips + results). Reuses <code style={{ fontFamily: "monospace" }}>ScanView</code> from ScanSimulation.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center", flexWrap: "wrap" as const }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Default tab:</span>
        {(["scan", "search"] as const).map(t => (
          <button key={t} onClick={() => setDefaultTab(t)}
            style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${defaultTab === t ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: defaultTab === t ? tokens.color.tint.blue : tokens.color.base.white, color: defaultTab === t ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" as const }}>
        {/* Phone frame */}
        <div style={{
          position:      "relative",
          width:         "393px",
          height:        "760px",
          borderRadius:  tokens.borderRadius["2xl"],
          overflow:      "hidden",
          border:        `1px solid ${tokens.color.divider.frame}`,
          boxShadow:     tokens.shadows.lg,
          background:    "linear-gradient(149.26deg, #332562 11.24%, #171717 97.76%)",
          flexShrink:    0,
          display:       "flex",
          flexDirection: "column" as const,
          alignItems:    "center",
          justifyContent: "flex-end",
        }}>
          {/* Simulated bottom nav with lime button */}
          <div style={{ width: "100%", height: "70px", background: tokens.color.base.white, borderTop: `1px solid ${tokens.color.divider.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexShrink: 0 }}>
            <span style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans }}>Home</span>
            <span style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans }}>Serials</span>
            {/* Lime centre button */}
            <button
              onClick={() => setOpen(true)}
              style={{ width: "40px", height: "40px", borderRadius: tokens.borderRadius.md, background: tokens.color.brand.lime, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M10 4v12M4 10h12" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <span style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans }}>Products</span>
            <span style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans }}>Me</span>
          </div>

          {/* Sheet */}
          <SearchScanSheet
            open={open}
            onClose={() => setOpen(false)}
            defaultTab={defaultTab}
            onScanDetected={(v) => setLastScan(v)}
            contained
          />
        </div>

        {/* Description */}
        <div style={{ flex: 1, minWidth: "240px", paddingTop: "8px", display: "flex", flexDirection: "column" as const, gap: "16px" }}>
          <p style={{ fontSize: "13px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, lineHeight: "1.6", margin: 0 }}>
            Tap the <strong style={{ color: tokens.color.fg.primary }}>lime button</strong> in the simulated bottom nav to open the sheet.
          </p>
          <ul style={{ fontSize: "13px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, lineHeight: "1.8", margin: 0, paddingLeft: "20px" }}>
            <li><strong>NFC</strong> — disabled tab, coming soon</li>
            <li><strong>Scan</strong> — full camera view with animated scan line; auto-detects after ~1.8s</li>
            <li><strong>Search</strong> — text input with focus ring, filter chips (All / Products / Items), mock item + product results</li>
          </ul>
          {lastScan && (
            <div style={{ padding: "10px 14px", background: tokens.color.tint.blue, borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.color.fg.blue}22` }}>
              <span style={{ fontSize: "12px", fontFamily: "monospace", color: tokens.color.fg.blue }}>onScanDetected: "{lastScan}"</span>
            </div>
          )}
        </div>
      </div>

      <CodeSnippet code={`import { SearchScanSheet } from "@/components/patterns/SearchScanSheet";

// Wire to lime centre button in MobileBottomNav
const [scanSheetOpen, setScanSheetOpen] = useState(false);

<MobileBottomNav
  items={bottomNavItems}
  onCentreClick={() => setScanSheetOpen(true)}
/>

<SearchScanSheet
  open={scanSheetOpen}
  onClose={() => setScanSheetOpen(false)}
  defaultTab="scan"
  onScanDetected={(value) => console.log("scanned:", value)}
  contained
/>`} />

      <PropsTable rows={[
        { prop: "open",            type: "boolean",                  def: "—",        desc: "Controls sheet visibility." },
        { prop: "onClose",         type: "() => void",               def: "—",        desc: "Called on backdrop tap or Escape." },
        { prop: "defaultTab",      type: '"scan" | "search"',        def: '"scan"',   desc: "Which tab is active when the sheet opens." },
        { prop: "onScanDetected",  type: "(value: string) => void",  def: "—",        desc: "Called when a scan is detected. Sheet closes automatically." },
        { prop: "contained",       type: "boolean",                  def: "false",    desc: "position:absolute (inside relative parent) vs position:fixed. Use contained in mobile prototype wrapper." },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Apply to Product pattern
// ---------------------------------------------------------------------------
function ApplyToProductPattern() {
  const CATALOGUE: CatalogueProduct[] = [
    { id: "1", name: "Ultra O Locksafe",  sku: "DMM | A327MG" },
    { id: "2", name: "Sender 9.9",        sku: "Mammut | 2310-01160" },
    { id: "3", name: "Grigri+",           sku: "Petzl | D100A001" },
    { id: "4", name: "Reverso 4",         sku: "Petzl | D017AA00" },
    { id: "5", name: "ATC Guide",         sku: "Black Diamond | BD625100" },
  ];
  const [selected, setSelected] = useState<SelectedProductItem[]>([]);

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ApplyToProduct.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Composed pattern of <code style={{ fontFamily: "monospace" }}>Input</code> + <code style={{ fontFamily: "monospace" }}>Button</code> — search, select, and quantify products. Used in create-serials and capture-serials flows.
      </p>

      <Section title="Live demo">
        <div style={{ maxWidth: "560px", background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: tokens.spacing[6] }}>
          <ApplyToProduct
            catalogue={CATALOGUE}
            selectedProducts={selected}
            onProductsChange={setSelected}
            defaultQuantity={0}
            quantityLabel="Quantity of serials"
          />
        </div>
      </Section>

      <BehaviourRules rules={[
        { title: "Search filters the catalogue", description: "Typing in the search field filters products by name or SKU. Already-selected products are removed from results." },
        { title: "Quantity defaults to 0", description: "When a product is added it gets defaultQuantity (default 0). The user must set a positive number before submitting." },
        { title: "Remove clears the row", description: "Tapping the bin icon removes the product from selectedProducts immediately — no confirmation needed." },
      ]} />

      <PropsTable rows={[
        { prop: "catalogue",        type: "CatalogueProduct[]",    def: "—",                    desc: "Full searchable product list — already-selected items are filtered out" },
        { prop: "selectedProducts", type: "SelectedProductItem[]", def: "—",                    desc: "Controlled list of selected products with quantities" },
        { prop: "onProductsChange", type: "(products) => void",    def: "—",                    desc: "Called whenever selection or quantity changes" },
        { prop: "defaultQuantity",  type: "number",                def: "0",                    desc: "Quantity assigned when a product is first added" },
        { prop: "quantityLabel",    type: "string",                def: '"Quantity of serials"', desc: "Label above each quantity input" },
        { prop: "binIconUrl",       type: "string",                def: "—",                    desc: "Figma icon URL for the remove button (node 49:967)" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
const PATTERN_TABS = [
  { id: "app-shell",        label: "App Shell" },
  { id: "app-bar",          label: "App Bar" },
  { id: "sidebar",          label: "Sidebar" },
  { id: "multi-step",       label: "Multi-Step Card" },
  { id: "context-menu",     label: "Context Menu" },
  { id: "scan",             label: "Scan Simulation" },
  { id: "search-scan-sheet",  label: "Search & Scan Sheet" },
  { id: "apply-to-product",   label: "Apply to Product" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PatternsPage() {
  const [activeTab, setActiveTab] = useState("app-shell");
  const icons = useFigmaIcons(Object.values(SIDEBAR_ICON_IDS));

  return (
    <div style={{ minHeight: "100vh", background: tokens.color.bg.lightBg, fontFamily: tokens.fontFamily.sans }}>

      {/* Header */}
      <div style={{ background: tokens.color.brand.darkGrey, padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", background: tokens.color.brand.lime, borderRadius: tokens.borderRadius.sm }} />
            <span style={{ fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.brand.lime, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Scannable</span>
          </div>
          <h1 style={{ fontSize: tokens.fontSize.display, fontWeight: tokens.fontWeight.medium, color: tokens.color.fgReverse.primary, lineHeight: "140%", margin: 0 }}>Patterns</h1>
          <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fgReverse.support, marginTop: "8px" }}>Larger compositions built from design system components</p>
        </div>
      </div>

      {/* Top nav */}
      <div style={{ background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.frame}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "4px", overflowX: "auto" as const }}>
          {TOP_NAV.map(item => {
            const href = item === "Components" ? "/styleguide/components"
              : item === "Patterns" ? "/styleguide/patterns"
              : item === "Mobile"   ? "/styleguide/mobile"
              : `/styleguide#${item.toLowerCase().replace(/ /g, "-")}`;
            const active = item === "Patterns";
            return (
              <a key={item} href={href} style={{ display: "inline-block", padding: "12px 16px", fontSize: tokens.fontSize.bodySmall, fontWeight: active ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, color: active ? tokens.color.fg.primary : tokens.color.fg.support, textDecoration: "none", whiteSpace: "nowrap" as const, borderBottom: active ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent" }}>
                {item}
              </a>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px 64px" }}>

        {/* Pattern tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${tokens.color.divider.border}`, marginBottom: "32px", overflowX: "auto" as const }}>
          {PATTERN_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 20px", fontSize: tokens.fontSize.body, fontWeight: activeTab === tab.id ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, fontFamily: tokens.fontFamily.sans, color: activeTab === tab.id ? tokens.color.fg.primary : tokens.color.fg.support, background: "transparent", border: "none", borderBottom: activeTab === tab.id ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent", cursor: "pointer", marginBottom: "-1px", whiteSpace: "nowrap" as const }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "app-shell"    && <AppShellPattern icons={icons} />}
        {activeTab === "app-bar"      && <AppBarPattern />}
        {activeTab === "sidebar"      && <SidebarPattern icons={icons} />}
        {activeTab === "multi-step"   && <MultiStepCardPattern />}
        {activeTab === "context-menu"      && <ContextMenuPattern />}
        {activeTab === "scan"              && <ScanSimulationPattern />}
        {activeTab === "search-scan-sheet" && <SearchScanSheetPattern />}
        {activeTab === "apply-to-product"  && <ApplyToProductPattern />}

        <div style={{ borderTop: `1px solid ${tokens.color.divider.frame}`, paddingTop: "24px", marginTop: "48px", display: "flex", justifyContent: "space-between" }}>
          <a href="/styleguide/components" style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textDecoration: "none" }}>← Components</a>
        </div>
      </div>
    </div>
  );
}
