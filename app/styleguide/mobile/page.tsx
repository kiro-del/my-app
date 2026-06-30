"use client";
// app/styleguide/mobile/page.tsx

import { useState } from "react";
import { MobileAppBar, type MobileAppBarPage } from "@/components/ui/MobileAppBar";
import { MobileBottomNav, type BottomNavItemDef } from "@/components/ui/MobileBottomNav";
import { Input } from "@/components/ui/mobile/Input";
import { InputCalendar } from "@/components/ui/mobile/InputCalendar";
import { SelectInput } from "@/components/ui/mobile/InputSelect";
import { ScanInput } from "@/components/ui/mobile/InputScan";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import tokens from "@/styles/design-tokens";

// Figma node IDs for bottom nav icons (24px)
const NAV_ICON_IDS = {
  home:          "2307:2449",
  specs:         "131:1374",
  notifications: "92:1260",
  users:         "1613:107",
} as const;

// ---------------------------------------------------------------------------
// Shared nav (matches other styleguide pages)
// ---------------------------------------------------------------------------
const TOP_NAV = ["Colors", "Typography", "Spacing", "Border Radius", "Shadows", "Icons", "Components", "Patterns", "Mobile"];

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "16px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>{title}</p>
      {children}
    </div>
  );
}

function CodeSnippet({ code }: { code: string }) {
  return (
    <div style={{ background: tokens.color.brand.darkGrey, borderRadius: tokens.borderRadius.md, padding: "12px 16px", marginTop: "16px" }}>
      <pre style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.brand.lime, margin: 0, whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{code}</pre>
    </div>
  );
}

function PropsTable({ rows }: { rows: { prop: string; type: string; def: string; desc: string }[] }) {
  return (
    <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", marginTop: "32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "160px 220px 110px 1fr", gap: "12px", padding: "10px 20px", background: tokens.color.bg.bg, borderBottom: `1px solid ${tokens.color.divider.border}` }}>
        {["Prop", "Type", "Default", "Description"].map(h => (
          <span key={h} style={{ fontSize: "11px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={row.prop} style={{ display: "grid", gridTemplateColumns: "160px 220px 110px 1fr", gap: "12px", padding: "12px 20px", borderBottom: i < rows.length - 1 ? `1px solid ${tokens.color.divider.border}` : "none", alignItems: "start" }}>
          <code style={{ fontSize: "12px", fontFamily: "monospace", color: tokens.color.fg.blue, background: tokens.color.tint.blue, padding: "2px 6px", borderRadius: "4px", width: "fit-content" }}>{row.prop}</code>
          <code style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.fg.support }}>{row.type}</code>
          <code style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.fg.support }}>{row.def}</code>
          <p style={{ fontSize: "13px", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, margin: 0 }}>{row.desc}</p>
        </div>
      ))}
    </div>
  );
}

function Pill({ val, cur, onClick }: { val: string; cur: string; onClick: () => void }) {
  const active = val === cur;
  return (
    <button onClick={onClick} style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${active ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: active ? tokens.color.tint.blue : tokens.color.base.white, color: active ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer", fontWeight: active ? "600" : "400" }}>
      {val}
    </button>
  );
}

function Toggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${active ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: active ? tokens.color.tint.blue : tokens.color.base.white, color: active ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer", fontWeight: active ? "600" : "400" }}>
      {label}
    </button>
  );
}

// 393px phone-width frame — gives the bar real mobile context
function PhoneFrame({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <div style={{ width: "393px", border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", boxShadow: tokens.shadows.lg, background: bg ?? tokens.color.bg.bg }}>
      {children}
      {/* content stub */}
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[200, 140, 200].map((w, i) => (
          <div key={i} style={{ height: "14px", width: `${w}px`, background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.sm, opacity: 0.5 }} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant gallery — static grid showing all key combinations
// ---------------------------------------------------------------------------
const GALLERY: { label: string; props: { page: MobileAppBarPage; actions?: 0|1|2|3; withBackIcon?: boolean; subText?: boolean } }[] = [
  { label: "home / actions=0",                props: { page: "home",    actions: 0 } },
  { label: "home / actions=1",                props: { page: "home",    actions: 1 } },
  { label: "account",                         props: { page: "account", actions: 1 } },
  { label: "main / actions=1",               props: { page: "main",    actions: 1 } },
  { label: "main / actions=2",               props: { page: "main",    actions: 2 } },
  { label: "main / actions=3",               props: { page: "main",    actions: 3 } },
  { label: "main / back / actions=0",        props: { page: "main",    actions: 0, withBackIcon: true } },
  { label: "main / back / actions=1",        props: { page: "main",    actions: 1, withBackIcon: true } },
  { label: "main / back / actions=2",        props: { page: "main",    actions: 2, withBackIcon: true } },
  { label: "main / back / actions=3",        props: { page: "main",    actions: 3, withBackIcon: true } },
  { label: "main / back / actions=3 / sub",  props: { page: "main",    actions: 3, withBackIcon: true, subText: true } },
  { label: "task / actions=0",               props: { page: "task",    actions: 0, withBackIcon: true } },
  { label: "task / actions=0 / sub",         props: { page: "task",    actions: 0, withBackIcon: true, subText: true } },
  { label: "task / actions=1",               props: { page: "task",    actions: 1, withBackIcon: true } },
  { label: "task / actions=2",               props: { page: "task",    actions: 2, withBackIcon: true } },
];

// ---------------------------------------------------------------------------
// Bottom Nav section
// ---------------------------------------------------------------------------
function BottomNavSection() {
  const [selectedId, setSelectedId] = useState<string>("home");
  const [badgeItem,  setBadgeItem]  = useState<string | null>(null);

  const makeItem = (id: string, label: string, nodeId: string): BottomNavItemDef => ({
    id,
    label,
    iconNodeId: nodeId,
    state: id === selectedId ? "selected" : id === badgeItem ? "badge" : "default",
    badgeCount: 3,
    onClick: () => setSelectedId(id),
  });

  const items: [BottomNavItemDef, BottomNavItemDef, BottomNavItemDef, BottomNavItemDef] = [
    makeItem("home",          "Home",          NAV_ICON_IDS.home),
    makeItem("inventory",     "Inventory",     NAV_ICON_IDS.specs),
    makeItem("notifications", "Notifications", NAV_ICON_IDS.notifications),
    makeItem("me",            "Me",            NAV_ICON_IDS.users),
  ];

  return (
    <Section title="Mobile Bottom Nav">
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/MobileBottomNav.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2475:7660</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
        5-slot bottom navigation: 2 items left · brand DecoIcon centre · 2 items right. Height 70px, white background, top border.
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" as const }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Badge on:</span>
        {[null, "home", "inventory", "notifications", "me"].map(id => (
          <Pill
            key={id ?? "none"}
            val={id ?? "none"}
            cur={badgeItem ?? "none"}
            onClick={() => setBadgeItem(id === badgeItem ? null : id)}
          />
        ))}
      </div>

      {/* Preview */}
      <div style={{ width: "393px", border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", boxShadow: tokens.shadows.lg }}>
        <MobileBottomNav items={items} />
      </div>

      <CodeSnippet code={`import { MobileBottomNav } from "@/components/ui/MobileBottomNav";

const items = [
  { id: "home",          label: "Home",          iconNodeId: "2307:2449", state: "selected" },
  { id: "inventory",     label: "Inventory",     iconNodeId: "131:1374",  state: "default" },
  { id: "notifications", label: "Notifications", iconNodeId: "92:1260",   state: "badge", badgeCount: 3 },
  { id: "me",            label: "Me",            iconNodeId: "1613:107",  state: "default" },
];

<MobileBottomNav items={items} onCentreClick={() => {}} />`} />

      <PropsTable rows={[
        { prop: "items",         type: "[BottomNavItemDef, BottomNavItemDef,\n BottomNavItemDef, BottomNavItemDef]", def: "—",    desc: "Exactly 4 items — 2 left of centre brand icon, 2 right" },
        { prop: "onCentreClick", type: "() => void",                                                                 def: "—",    desc: "Called when the centre brand DecoIcon is tapped" },
      ]} />

      <div style={{ marginTop: "24px" }}>
        <p style={{ fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "12px" }}>BottomNavItemDef</p>
        <PropsTable rows={[
          { prop: "id",         type: "string",                            def: "—",           desc: "Unique identifier for this tab" },
          { prop: "label",      type: "string",                            def: "—",           desc: "Text label shown beneath the icon" },
          { prop: "iconNodeId", type: "string",                            def: "—",           desc: "Figma 24px icon node ID — fetched via useFigmaIcons" },
          { prop: "state",      type: '"selected" | "default" | "badge"',  def: '"default"',   desc: "Selected: dark icon + semi-bold label. Badge: adds count chip top-right of icon." },
          { prop: "badgeCount", type: "number",                            def: "1",           desc: "Number shown in the badge chip when state=\"badge\"" },
          { prop: "onClick",    type: "() => void",                        def: "—",           desc: "Called when this tab is tapped" },
        ]} />
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Mobile button specimens
// ---------------------------------------------------------------------------

// DS icon node ID for phone-scan (24px, DS file j8hy0yzSKPyh1yRKOh4tuU)
const PHONE_SCAN_ID = "4094:8844";

// Fallback shown while the DS icon URL is loading
function PhoneScanFallback() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="2.5" width="12" height="19" rx="3" stroke={tokens.color.fg.primary} strokeWidth="2" />
      <line x1="0" y1="9"  x2="5" y2="9"  stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="14" x2="4" y2="14" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  const h = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
      <line x1={h} y1={2}      x2={h}       y2={size - 2} stroke={tokens.color.fg.primary} strokeWidth={size === 16 ? 1.5 : 2} strokeLinecap="round" />
      <line x1={2} y1={h}      x2={size - 2} y2={h}        stroke={tokens.color.fg.primary} strokeWidth={size === 16 ? 1.5 : 2} strokeLinecap="round" />
    </svg>
  );
}

function getBtnSpecimens(phoneScanUrl?: string) { return [
  {
    name: "Primary",
    figmaNode: "275:62713",
    description: "Full-width lime action button. Default CTA for mobile task flows.",
    preview: (
      <button style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "100%", height: "54px",
        background: tokens.color.brand.lime, borderRadius: "8px", border: "none",
        fontFamily: tokens.fontFamily.sans, fontSize: "16px", fontWeight: 500,
        color: tokens.color.fg.primary, cursor: "pointer",
        paddingLeft: "16px", paddingRight: "16px",
      }}>
        Continue to cut rope
      </button>
    ),
    code: `<button style={{
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "100%", height: "54px",
  background: tokens.color.brand.lime,
  borderRadius: "8px", border: "none",
  fontSize: "16px", fontWeight: 500,
  color: tokens.color.fg.primary,
}}>
  Continue to cut rope
</button>`,
  },
  {
    name: "Outline",
    figmaNode: "275:62738",
    description: "Secondary action button — white bg with dark border. Use for secondary CTAs alongside a Primary.",
    preview: (
      <button style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "4px", width: "100%", height: "54px",
        background: tokens.color.base.white,
        border: `1px solid ${tokens.color.fg.primary}`,
        borderRadius: "8px",
        fontFamily: tokens.fontFamily.sans, fontSize: "16px", fontWeight: 500,
        color: tokens.color.fg.primary, cursor: "pointer",
        paddingLeft: "12px", paddingRight: "16px",
      }}>
        <PlusIcon size={16} />
        Create Item
      </button>
    ),
    code: `<button style={{
  display: "flex", alignItems: "center", justifyContent: "center",
  gap: "4px", width: "100%", height: "54px",
  background: tokens.color.base.white,
  border: \`1px solid \${tokens.color.fg.primary}\`,
  borderRadius: "8px",
  fontSize: "16px", fontWeight: 500,
  color: tokens.color.fg.primary,
  paddingLeft: "12px", paddingRight: "16px",
}}>
  <PlusIcon size={16} />
  Create Item
</button>`,
  },
  {
    name: "Scan (Pill)",
    figmaNode: "275:62715",
    description: "Lime pill button for scan actions. Hugs content width — don't stretch full-width.",
    preview: (
      <button style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: "8px", height: "54px",
        background: tokens.color.brand.lime,
        borderRadius: "999px", border: "none",
        fontFamily: tokens.fontFamily.sans, fontSize: "16px", fontWeight: 500,
        color: tokens.color.fg.primary, cursor: "pointer",
        paddingLeft: "28px", paddingRight: "28px",
      }}>
        {phoneScanUrl
          ? <img src={phoneScanUrl} width={24} height={24} alt="" aria-hidden />
          : <PhoneScanFallback />}
        Scan reel code
      </button>
    ),
    code: `<button style={{
  display: "inline-flex", alignItems: "center",
  gap: "8px", height: "54px",
  background: tokens.color.brand.lime,
  borderRadius: "999px", border: "none",
  fontSize: "16px", fontWeight: 500,
  color: tokens.color.fg.primary,
  paddingLeft: "28px", paddingRight: "28px",
}}>
  <PhoneScanIcon />
  Scan reel code
</button>`,
  },
  {
    name: "Card",
    figmaNode: "275:62731",
    description: "Dashed-border card button for create/add flows. Full width, 16px radius.",
    preview: (
      <button style={{
        display: "flex", alignItems: "center",
        gap: "8px", width: "100%",
        background: tokens.color.base.white,
        border: `1px dashed ${tokens.color.divider.border}`,
        borderRadius: "16px", cursor: "pointer",
        padding: "16px",
        fontFamily: tokens.fontFamily.sans,
      }}>
        <div style={{
          width: "40px", height: "40px", flexShrink: 0,
          background: tokens.color.bg.bg,
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <PlusIcon size={24} />
        </div>
        <span style={{ fontSize: "14px", fontWeight: 500, color: tokens.color.fg.primary }}>
          make a custom one
        </span>
      </button>
    ),
    code: `<button style={{
  display: "flex", alignItems: "center",
  gap: "8px", width: "100%",
  background: tokens.color.base.white,
  border: \`1px dashed \${tokens.color.divider.border}\`,
  borderRadius: "16px", padding: "16px",
}}>
  <div style={{
    width: "40px", height: "40px",
    background: tokens.color.bg.bg, borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <PlusIcon size={24} />
  </div>
  <span style={{ fontSize: "14px", fontWeight: 500 }}>
    make a custom one
  </span>
</button>`,
  },
];
}

function ButtonsTab() {
  const icons = useFigmaIcons([PHONE_SCAN_ID]);
  const specimens = getBtnSpecimens(icons[PHONE_SCAN_ID]);

  return (
    <>
      <Section title="Mobile Buttons">
        <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
          Temp button patterns from the cut-rope flow — not yet in the main DS.
          Figma file: <a href="https://www.figma.com/design/5HgljtpzsvLhHfJVDgabGq" target="_blank" rel="noreferrer" style={{ color: tokens.color.fg.blue }}>temp mobile components</a>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {specimens.map(({ name, figmaNode, description, preview, code }) => (
            <div key={name} style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${tokens.color.divider.border}`, display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>{name}</span>
                <code style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: "monospace" }}>Figma {figmaNode}</code>
              </div>
              {/* Preview */}
              <div style={{ padding: "24px 20px", background: tokens.color.bg.lightBg, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <div style={{ width: "361px" }}>
                  {preview}
                </div>
              </div>
              {/* Description */}
              <div style={{ padding: "12px 20px", borderTop: `1px solid ${tokens.color.divider.border}` }}>
                <p style={{ fontSize: "13px", color: tokens.color.fg.support, margin: 0, fontFamily: tokens.fontFamily.sans }}>{description}</p>
              </div>
              {/* Code */}
              <div style={{ background: tokens.color.brand.darkGrey, borderTop: `1px solid ${tokens.color.divider.border}` }}>
                <pre style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.brand.lime, margin: 0, padding: "12px 20px", whiteSpace: "pre-wrap" as const, lineHeight: "1.6" }}>{code}</pre>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Mobile Inputs tab
// ---------------------------------------------------------------------------

const SELECT_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "spool",    label: "Full spool" },
  { value: "custom",   label: "Custom length" },
];

function InputsTab() {
  const [textVal,    setTextVal]    = useState("");
  const [dateVal,    setDateVal]    = useState("");
  const [selectVal,  setSelectVal]  = useState("");
  const [scanVal,    setScanVal]    = useState("");
  const [showError,  setShowError]  = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const errorMsg = showError ? "This field is required" : undefined;

  return (
    <>
      <Section title="Mobile Inputs">
        <div style={{ marginBottom: "8px", display: "flex", flexWrap: "wrap" as const, gap: "8px", alignItems: "center" }}>
          <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>
            components/ui/mobile/Input.tsx · InputCalendar.tsx · InputSelect.tsx · InputScan.tsx
          </code>
          <span style={{ fontSize: "12px", color: tokens.color.fg.disabled }}>Figma node 295-49244</span>
        </div>
        <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
          Mobile-specific inputs — 48px height (padding-driven), 8px border-radius. Separate from the DS components; mobile sizing is baked in with no extra props needed.
        </p>

        {/* Controls */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" as const }}>
          <Toggle active={showError}  label="Error state" onClick={() => setShowError(b => !b)} />
          <Toggle active={isDisabled} label="Disabled"    onClick={() => setIsDisabled(b => !b)} />
        </div>

        {/* Live preview — 393px form */}
        <div style={{ width: "393px", background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.lg, boxShadow: tokens.shadows.lg, overflow: "hidden" }}>
          <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input
                           label="Batch number"
              placeholder="e.g. B32042000470"
              value={textVal}
              onChange={e => setTextVal(e.target.value)}
              errorMessage={errorMsg}
              disabled={isDisabled}
            />
            <ScanInput
                           label="Serial number"
              placeholder="Scan or type serial"
              value={scanVal}
              onChange={e => setScanVal(e.target.value)}
              disabled={isDisabled}
            />
            <InputCalendar
              label="Date of manufacture"
              placeholder="Select date"
              value={dateVal}
              onChange={setDateVal}
              errorMessage={errorMsg}
              disabled={isDisabled}
            />
            <SelectInput
                           label="Serial format"
              placeholder="Choose format…"
              options={SELECT_OPTIONS}
              value={selectVal}
              onChange={setSelectVal}
              errorMessage={errorMsg}
              disabled={isDisabled}
            />
          </div>
        </div>

        <CodeSnippet code={`import { Input }         from "@/components/ui/mobile/Input";
import { InputCalendar } from "@/components/ui/mobile/InputCalendar";
import { SelectInput }   from "@/components/ui/mobile/InputSelect";
import { ScanInput }     from "@/components/ui/mobile/InputScan";

// Plain text — 48px, 8px radius
<Input label="Batch number" placeholder="…" />

// Scan + button — 48px, 8px radius baked in
<ScanInput label="Serial number" placeholder="…" />

// Date picker — 48px (py=12px + 24px icon), 8px radius
<InputCalendar label="Date of manufacture" />

// Dropdown — 48px, 8px radius baked in
<SelectInput label="Format" options={OPTIONS} />`} />

        <PropsTable rows={[
          { prop: "label",        type: "string",  def: "—",     desc: "Field label rendered above the input." },
          { prop: "errorMessage", type: "string",  def: "—",     desc: "Turns border red and shows the message below." },
          { prop: "disabled",     type: "boolean", def: "false", desc: "Lightens border + background, prevents interaction." },
        ]} />
      </Section>

      {/* ── Per-component specimens ── */}
      <Section title="Specimens">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Input */}
          {[
            { label: "Default (empty)",  value: "",               disabled: false, error: undefined },
            { label: "Filled",           value: "B32042000470",   disabled: false, error: undefined },
            { label: "Error",            value: "",               disabled: false, error: "This field is required" },
            { label: "Disabled",         value: "B32042000470",   disabled: true,  error: undefined },
          ].map(({ label, value, disabled, error }) => (
            <div key={`input-${label}`} style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${tokens.color.divider.border}`, display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Input — {label}</span>
                <code style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: "monospace" }}>mobile/Input</code>
              </div>
              <div style={{ padding: "20px", background: tokens.color.bg.lightBg }}>
                <div style={{ width: "361px" }}>
                  <Input label="Batch number" placeholder="e.g. B32042000470" value={value} disabled={disabled} errorMessage={error} onChange={() => {}} />
                </div>
              </div>
            </div>
          ))}

          {/* ScanInput */}
          {[
            { label: "Default (empty)",  value: "",             disabled: false },
            { label: "Filled",           value: "#593-4890",    disabled: false },
            { label: "Disabled",         value: "#593-4890",    disabled: true  },
          ].map(({ label, value, disabled }) => (
            <div key={`scan-${label}`} style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${tokens.color.divider.border}`, display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>ScanInput — {label}</span>
                <code style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: "monospace" }}>mobile/InputScan</code>
              </div>
              <div style={{ padding: "20px", background: tokens.color.bg.lightBg }}>
                <div style={{ width: "361px" }}>
                  <ScanInput label="Serial number" placeholder="Scan or type serial" value={value} disabled={disabled} onChange={() => {}} />
                </div>
              </div>
            </div>
          ))}

          {/* InputCalendar */}
          {[
            { label: "Empty",    value: "",           disabled: false },
            { label: "Filled",   value: "2026-04-10", disabled: false },
            { label: "Disabled", value: "2026-04-10", disabled: true  },
          ].map(({ label, value, disabled }) => (
            <div key={`cal-${label}`} style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${tokens.color.divider.border}`, display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>InputCalendar — {label}</span>
                <code style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: "monospace" }}>mobile/InputCalendar</code>
              </div>
              <div style={{ padding: "20px", background: tokens.color.bg.lightBg }}>
                <div style={{ width: "361px" }}>
                  <InputCalendar label="Date of manufacture" placeholder="Select date" value={value} disabled={disabled} onChange={v => {}} />
                </div>
              </div>
            </div>
          ))}

          {/* SelectInput */}
          {[
            { label: "Empty",    value: "",         disabled: false },
            { label: "Filled",   value: "standard", disabled: false },
            { label: "Disabled", value: "standard", disabled: true  },
            { label: "Error",    value: "",         disabled: false, error: "Please select a format" },
          ].map(({ label, value, disabled, error }) => (
            <div key={`sel-${label}`} style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${tokens.color.divider.border}`, display: "flex", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>SelectInput — {label}</span>
                <code style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: "monospace" }}>mobile/InputSelect</code>
              </div>
              <div style={{ padding: "20px", background: tokens.color.bg.lightBg }}>
                <div style={{ width: "361px" }}>
                  <SelectInput label="Serial format" placeholder="Choose format…" options={SELECT_OPTIONS} value={value} disabled={disabled} errorMessage={error} onChange={() => {}} />
                </div>
              </div>
            </div>
          ))}

        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
const MOBILE_TABS = [
  { id: "app-bar",    label: "App Bar" },
  { id: "bottom-nav", label: "Bottom Nav" },
  { id: "buttons",    label: "Buttons" },
  { id: "inputs",     label: "Inputs" },
];

// ---------------------------------------------------------------------------
// App Bar tab content
// ---------------------------------------------------------------------------
function AppBarTab() {
  const [page,         setPage]    = useState<MobileAppBarPage>("home");
  const [actions,      setActions] = useState<0|1|2|3>(1);
  const [withBackIcon, setWithBack] = useState(false);
  const [subText,      setSubText] = useState(false);

  const isTask    = page === "task";
  const isHome    = page === "home";
  const isAccount = page === "account";

  return (
    <>
      <Section title="Mobile App Bar">
        <div style={{ marginBottom: "8px" }}>
          <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/MobileAppBar.tsx</code>
          <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2475:7759</span>
        </div>
        <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
          Top navigation bar for mobile (393px). Dark background on home/main/account; white on task pages. Icon buttons use 40×40 tap targets.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "16px", marginBottom: "24px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Page:</span>
            {(["home", "main", "task", "account"] as MobileAppBarPage[]).map(p => (
              <Pill key={p} val={p} cur={page} onClick={() => { setPage(p); if (p === "account") { setActions(1); setWithBack(false); setSubText(false); } if (p === "home") setWithBack(false); }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans }}>Actions:</span>
            {([0, 1, 2, 3] as const).map(n => (
              <Pill key={n} val={String(n)} cur={String(actions)} onClick={() => setActions(n)} />
            ))}
          </div>
          {!isHome && !isAccount && (
            <Toggle active={withBackIcon} label={isTask ? "Close ×" : "Back ←"} onClick={() => setWithBack(b => !b)} />
          )}
          {!isAccount && !isHome && (
            <Toggle active={subText} label="Sub text" onClick={() => setSubText(b => !b)} />
          )}
        </div>

        <PhoneFrame bg={isTask ? tokens.color.bg.bg : tokens.color.brand.darkGrey}>
          <MobileAppBar
            page={page}
            actions={actions}
            withBackIcon={withBackIcon}
            subText={subText}
          />
        </PhoneFrame>

        <CodeSnippet code={`import { MobileAppBar } from "@/components/ui/MobileAppBar";

<MobileAppBar
  page="${page}"
  actions={${actions}}${withBackIcon ? "\n  withBackIcon" : ""}${subText ? "\n  subText" : ""}
/>`} />

        <PropsTable rows={[
          { prop: "page",           type: '"home" | "main" | "task" | "account"', def: "—",       desc: "Controls background color, layout, and which elements are rendered" },
          { prop: "actions",        type: "0 | 1 | 2 | 3",                        def: "0",        desc: "Number of action icon buttons on the right. Slots: add (+), menu (···), multi-scan (⊞)" },
          { prop: "withBackIcon",   type: "boolean",                               def: "false",    desc: "Shows ← on main pages, or × on task pages when combined with page=\"task\"" },
          { prop: "subText",        type: "boolean",                               def: "false",    desc: "Renders a secondary line beneath the title (main + task pages)" },
          { prop: "title",          type: "string",                                def: "per page", desc: "Title text. Defaults: home→org name, main→\"Auckland\", task→\"Title\", account→\"My Account\"" },
          { prop: "subTextContent", type: "string",                                def: "per page", desc: "Sub-text content. Defaults: task→\"Sub text\", main→checklist progress" },
          { prop: "version",        type: "string",                                def: '"2.24.0"', desc: "Version string shown in the lime badge on account pages" },
          { prop: "onBack",         type: "() => void",                            def: "—",        desc: "Called when the back ← button is pressed (main page)" },
          { prop: "onClose",        type: "() => void",                            def: "—",        desc: "Called when the close × button is pressed (task page)" },
          { prop: "onAdd",          type: "() => void",                            def: "—",        desc: "Called when the add + action button is pressed" },
          { prop: "onMore",         type: "() => void",                            def: "—",        desc: "Called when the ··· menu button is pressed" },
          { prop: "onMultiScan",    type: "() => void",                            def: "—",        desc: "Called when the multi-scan action button is pressed" },
        ]} />
      </Section>

      <Section title="All Variants">
        <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fg.support, marginBottom: "24px", fontFamily: tokens.fontFamily.sans }}>
          Every page × action × modifier combination from Figma node 2475:7759.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {GALLERY.map(({ label, props }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "393px", flexShrink: 0, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
                <MobileAppBar {...props} />
              </div>
              <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: "monospace", whiteSpace: "nowrap" as const }}>{label}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MobileStyleguidePage() {
  const [activeTab, setActiveTab] = useState("app-bar");

  return (
    <div style={{ minHeight: "100vh", background: tokens.color.bg.lightBg, fontFamily: tokens.fontFamily.sans }}>

      {/* ── Header ── */}
      <div style={{ background: tokens.color.brand.darkGrey, padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", background: tokens.color.brand.lime, borderRadius: tokens.borderRadius.sm }} />
            <span style={{ fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.brand.lime, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Scannable</span>
          </div>
          <h1 style={{ fontSize: tokens.fontSize.display, fontWeight: tokens.fontWeight.medium, color: tokens.color.fgReverse.primary, lineHeight: "140%", margin: 0 }}>Mobile Components</h1>
          <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fgReverse.support, marginTop: "8px" }}>Mobile-first UI components — 393px canvas, design tokens throughout</p>
        </div>
      </div>

      {/* ── Sticky nav ── */}
      <div style={{ background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.frame}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "4px", overflowX: "auto" as const }}>
          {TOP_NAV.map(item => {
            const href =
              item === "Components" ? "/styleguide/components"
              : item === "Patterns"  ? "/styleguide/patterns"
              : item === "Mobile"    ? "/styleguide/mobile"
              : `/styleguide#${item.toLowerCase().replace(/ /g, "-")}`;
            const active = item === "Mobile";
            return (
              <a key={item} href={href} style={{ display: "inline-block", padding: "12px 16px", fontSize: tokens.fontSize.bodySmall, fontWeight: active ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, color: active ? tokens.color.fg.primary : tokens.color.fg.support, textDecoration: "none", whiteSpace: "nowrap" as const, borderBottom: active ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent" }}>
                {item}
              </a>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px 64px" }}>

        {/* ── Component tabs ── */}
        <div style={{ display: "flex", borderBottom: `1px solid ${tokens.color.divider.border}`, marginBottom: "32px", overflowX: "auto" as const }}>
          {MOBILE_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 20px", fontSize: tokens.fontSize.body, fontWeight: activeTab === tab.id ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, fontFamily: tokens.fontFamily.sans, color: activeTab === tab.id ? tokens.color.fg.primary : tokens.color.fg.support, background: "transparent", border: "none", borderBottom: activeTab === tab.id ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent", cursor: "pointer", marginBottom: "-1px", whiteSpace: "nowrap" as const }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "app-bar"    && <AppBarTab />}
        {activeTab === "bottom-nav" && <BottomNavSection />}
        {activeTab === "buttons"    && <ButtonsTab />}
        {activeTab === "inputs"     && <InputsTab />}

        <div style={{ borderTop: `1px solid ${tokens.color.divider.frame}`, paddingTop: "24px", marginTop: "48px", display: "flex", justifyContent: "space-between" }}>
          <a href="/styleguide/patterns" style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textDecoration: "none" }}>← Patterns</a>
          <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans }}>Scannable Design System · Mobile</span>
        </div>
      </div>
    </div>
  );
}
