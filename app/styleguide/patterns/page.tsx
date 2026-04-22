"use client";
// app/styleguide/patterns/page.tsx

import { useState } from "react";
import { AppBar } from "@/components/ui/AppBar";
import { AppShell } from "@/components/ui/AppShell";
import { Sidebar } from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Shared nav
// ---------------------------------------------------------------------------
const TOP_NAV = ["Colors","Typography","Spacing","Border Radius","Shadows","Icons","Components","Patterns"];

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
                  <button type="button" style={{ display: "flex", alignItems: "center", gap: "6px", height: "100%", padding: "0 14px", background: tokens.color.brand.lime, border: "none", cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, whiteSpace: "nowrap" as const, borderRadius: 0 }}>
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
// Tabs
// ---------------------------------------------------------------------------
const PATTERN_TABS = [
  { id: "app-shell",  label: "App Shell" },
  { id: "app-bar",    label: "App Bar" },
  { id: "sidebar",    label: "Sidebar" },
  { id: "multi-step", label: "Multi-Step Card" },
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

        {activeTab === "app-shell"  && <AppShellPattern icons={icons} />}
        {activeTab === "app-bar"    && <AppBarPattern />}
        {activeTab === "sidebar"    && <SidebarPattern icons={icons} />}
        {activeTab === "multi-step" && <MultiStepCardPattern />}

        <div style={{ borderTop: `1px solid ${tokens.color.divider.frame}`, paddingTop: "24px", marginTop: "48px", display: "flex", justifyContent: "space-between" }}>
          <a href="/styleguide/components" style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textDecoration: "none" }}>← Components</a>
        </div>
      </div>
    </div>
  );
}
