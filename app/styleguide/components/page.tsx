"use client";
// app/styleguide/components/page.tsx
// Icons fetched from the actual button/input component instances in Figma
// so colors are baked correctly per variant (white for destructive, gray for disabled etc.)

import { useState, useEffect, useRef } from "react";
import { Button, ButtonType, ButtonSize, ButtonWithIcon } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RadioIndicator, RadioButton, RadioInput, RadioGroup } from "@/components/ui/Radio";
import { CheckboxIndicator, Checkbox, CheckboxInput, CheckboxGroup } from "@/components/ui/Checkbox";
import { Sidebar } from "@/components/ui/Sidebar";
import { SidebarNavItem } from "@/components/ui/SidebarNavItem";
import { SelectionCard, SelectionCardGroup } from "@/components/ui/SelectionCard";
import { Badge, BadgeColor, BadgeIconPosition } from "@/components/ui/Badge";
import { BadgeActionable, BadgeActionableChevronIcon } from "@/components/ui/BadgeActionable";
import { Toast, ToastVariant, useToast } from "@/components/ui/Toast";
import { Toggle as ToggleUI } from "@/components/ui/Toggle";
import { ToggleInput } from "@/components/ui/ToggleInput";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { Alert, AlertTone, AlertType } from "@/components/ui/Alert";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GloryItem } from "@/components/ui/GloryItems";
import { ModalFooter } from "@/components/ui/ModalFooter";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ActionCard, ActionCardGroup } from "@/components/ui/ActionCard";
import { CalendarIcon } from "@/components/ui/Input";
import { ProductImg, CameraIcon } from "@/components/ui/ProductImg";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AppBar } from "@/components/ui/AppBar";
import { DashboardStatCard, DashboardStatStrip } from "@/components/ui/DashboardStatCard";
import { ListViewItem } from "@/components/ui/ListViewItem";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination, TableFooter } from "@/components/ui/Pagination";
import { ApplyToProduct, type CatalogueProduct, type SelectedProductItem } from "@/components/ui/ApplyToProduct";
import { SearchDropdown, type SearchDropdownItem } from "@/components/ui/SearchDropdown";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { ProductListItem } from "@/components/ui/ProductListItem";
import { ViewItemPageImg, type ViewItemPageImgPlatform } from "@/components/ui/ViewItemPageImg";
import { EmptyState } from "@/components/ui/EmptyState";
import { Steps, type StepsVariant } from "@/components/ui/Steps";
import { SelectInput } from "@/components/ui/SelectInput";
import { CompositeInput } from "@/components/ui/CompositeInput";
import { ScanInput } from "@/components/ui/ScanInput";
import tokens from "@/styles/design-tokens";

const FILE_KEY = "j8hy0yzSKPyh1yRKOh4tuU";

// ---------------------------------------------------------------------------
// Icon node IDs — fetched from the actual button/input instances in Figma
// ---------------------------------------------------------------------------
const ICON_NODE_IDS = {
  btn_primary_add:       "59:426",
  btn_primary_arrow:     "207:2404",
  btn_secondary_add:     "153:829",
  btn_secondary_arrow:   "207:2413",
  btn_tertiary_add:      "58:417",
  btn_tertiary_arrow:    "172:989",
  btn_destructive_add:   "2107:1896",
  btn_destructive_arrow: "2107:1904",
  btn_disabled_add:      "2107:1912",
  btn_disabled_arrow:    "2107:1921",
  btn_icon_dots:         "154:1415",
  input_search:          "52:1265",
  input_arrow:           "1313:2945",
  input_scan:            "3953:13529",  // phone-scan 16px — used in inline button variant
  input_nfc_add:         "2064:1089",   // add/plus 16px  — used in NFC inline button
  tab_placeholder:       "51:1203",     // exclamation mark 24px — placeholder icon for Tabs demo
  pli_add_24:            "46:2936",     // add/plus 24px — ProductListItem add button
  pli_bin_24:            "49:967",      // bin/trash 24px — ProductListItem delete button
  pli_add_16:            "2064:1089",   // add/plus 16px — ProductListItem action link
  pli_info_16:           "148:862",     // info circle 16px — ProductListItem indicator
  badge_leading:         "2284:3120",   // success 16px — Badge leading icon demo
  badge_trailing:        "2284:3139",   // error 16px — Badge trailing icon demo
};

// ---------------------------------------------------------------------------
// Fetch SVGs from our API proxy
// ---------------------------------------------------------------------------
async function fetchSvgs(nodeIds: string[]): Promise<Record<string, string>> {
  const ids = nodeIds.join(",");
  try {
    const res = await fetch(`/api/figma-icons?ids=${encodeURIComponent(ids)}&fileKey=${FILE_KEY}`);
    if (!res.ok) return {};
    const json = await res.json();
    return json.images || {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// FigmaIcon — renders fetched SVG at the correct size
// ---------------------------------------------------------------------------
function FigmaIcon({ svgUrl, size = 24, alt = "" }: { svgUrl?: string; size?: number; alt?: string }) {
  if (!svgUrl) {
    return (
      <span style={{ display: "inline-block", width: size, height: size, background: tokens.color.bg.darkBg, borderRadius: "3px", opacity: 0.3, flexShrink: 0 }} />
    );
  }
  return <img src={svgUrl} width={size} height={size} alt={alt} style={{ display: "block", flexShrink: 0 }} />;
}

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
// Layout helpers
// ---------------------------------------------------------------------------
const TOP_NAV = ["Colors","Typography","Spacing","Border Radius","Shadows","Icons","Components","Patterns","Mobile"];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "10px", fontWeight: tokens.fontWeight.medium }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>{children}</div>
    </div>
  );
}

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
      <div style={{ display: "grid", gridTemplateColumns: "130px 240px 110px 1fr", gap: "12px", padding: "10px 20px", background: tokens.color.bg.bg, borderBottom: `1px solid ${tokens.color.divider.border}` }}>
        {["Prop","Type","Default","Description"].map(h => (
          <span key={h} style={{ fontSize: "11px", fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={row.prop} style={{ display: "grid", gridTemplateColumns: "130px 240px 110px 1fr", gap: "12px", padding: "12px 20px", borderBottom: i < rows.length-1 ? `1px solid ${tokens.color.divider.border}` : "none", alignItems: "start" }}>
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

function PillToggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${active ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: active ? tokens.color.tint.blue : tokens.color.base.white, color: active ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer", fontWeight: active ? "600" : "400" }}>
      {label}
    </button>
  );
}

function PreviewBox({ children, tall }: { children: React.ReactNode; tall?: boolean }) {
  return (
    <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "24px 20px", minHeight: tall ? "120px" : "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Button tab
// ---------------------------------------------------------------------------
function ButtonTab({ svgs }: { svgs: Record<string, string> }) {
  const [variant, setVariant]   = useState<ButtonType>("primary");
  const [size, setSize]         = useState<ButtonSize>("Default");
  const [withIcon, setWithIcon] = useState<ButtonWithIcon>("none");

  const isIconType  = variant === "icon" || variant === "icon framed";
  const isNoIconVar = ["disabled", "loading"].includes(variant);

  const addKey   = `btn_${variant.replace(" ","_")}_add`;
  const arrowKey = `btn_${variant.replace(" ","_")}_arrow`;
  const addIcon   = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS[addKey   as keyof typeof ICON_NODE_IDS]]} size={16} alt="add" />;
  const arrowIcon = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS[arrowKey as keyof typeof ICON_NODE_IDS]]} size={16} alt="arrow right" />;
  const dotsIcon  = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more options" />;

  const previewIcon = isIconType ? dotsIcon
    : withIcon === "heading" ? addIcon
    : withIcon === "tailing" ? arrowIcon
    : undefined;

  const codeStr = `<Button
  variant="${variant}"${size !== "Default" ? `\n  size="${size}"` : ""}${!isIconType && !isNoIconVar && withIcon !== "none" ? `\n  withIcon="${withIcon}"` : ""}${previewIcon ? `\n  icon={<YourIcon />}` : ""}
  label="Button"
/>`;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Button.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 21:2928</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>8 variants · 2 sizes · leading/tailing icons · icon-only · loading state</p>

      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Variant</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(["primary","secondary","tertiary","destructive","disabled","loading","icon","icon framed"] as ButtonType[]).map(v => (
                  <Pill key={v} val={v} cur={variant} onClick={() => { setVariant(v); setWithIcon("none"); }} />
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Size</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["Default","large"] as ButtonSize[]).map(s => <Pill key={s} val={s} cur={size} onClick={() => setSize(s)} />)}
              </div>
            </div>
            {!isIconType && !isNoIconVar && (
              <div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>With Icon</p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(["none","heading","tailing"] as ButtonWithIcon[]).map(i => <Pill key={i} val={i} cur={withIcon} onClick={() => setWithIcon(i)} />)}
                </div>
              </div>
            )}
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <PreviewBox>
              <Button variant={variant} size={size} withIcon={withIcon} icon={previewIcon} label="Button" />
            </PreviewBox>
            <CodeSnippet code={codeStr} />
          </div>
        </div>
      </div>

      <Section title="All Variants">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <Row label="Primary">
            <Button variant="primary" label="Button" />
            <Button variant="primary" label="Button" withIcon="heading" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_primary_add]}   size={16} alt="add" />} />
            <Button variant="primary" label="Button" withIcon="tailing" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_primary_arrow]} size={16} alt="arrow" />} />
          </Row>
          <Row label="Secondary">
            <Button variant="secondary" label="Button" />
            <Button variant="secondary" label="Button" withIcon="heading" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_secondary_add]}   size={16} alt="add" />} />
            <Button variant="secondary" label="Button" withIcon="tailing" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_secondary_arrow]} size={16} alt="arrow" />} />
          </Row>
          <Row label="Tertiary">
            <Button variant="tertiary" label="Button" />
            <Button variant="tertiary" label="Button" withIcon="heading" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_tertiary_add]}   size={16} alt="add" />} />
            <Button variant="tertiary" label="Button" withIcon="tailing" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_tertiary_arrow]} size={16} alt="arrow" />} />
          </Row>
          <Row label="Destructive">
            <Button variant="destructive" label="Button" />
            <Button variant="destructive" label="Button" withIcon="heading" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_destructive_add]}   size={16} alt="add" />} />
            <Button variant="destructive" label="Button" withIcon="tailing" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_destructive_arrow]} size={16} alt="arrow" />} />
          </Row>
          <Row label="Disabled">
            <Button variant="disabled" label="Button" />
            <Button variant="disabled" label="Button" withIcon="heading" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_disabled_add]}   size={16} alt="add" />} />
            <Button variant="disabled" label="Button" withIcon="tailing" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_disabled_arrow]} size={16} alt="arrow" />} />
          </Row>
          <Row label="Loading"><Button variant="loading" /></Row>
          <Row label="Icon (borderless) · Default / large">
            <Button variant="icon"        icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
            <Button variant="icon" size="large" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
          </Row>
          <Row label="Icon Framed (bordered) · Default / large">
            <Button variant="icon framed"        icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
            <Button variant="icon framed" size="large" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
          </Row>
        </div>
      </Section>

      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props</p>
      <PropsTable rows={[
        { prop: "variant",  type: '"primary"|"secondary"|"tertiary"\n"destructive"|"disabled"|"loading"\n"icon"|"icon framed"', def: '"primary"',  desc: "Visual variant — maps to Figma type prop" },
        { prop: "size",     type: '"Default"|"large"',          def: '"Default"', desc: "Default=40px height, large=48px" },
        { prop: "withIcon", type: '"none"|"heading"|"tailing"', def: '"none"',    desc: "Icon position (text buttons only). Use 16px icons." },
        { prop: "icon",     type: "ReactNode",                  def: "—",         desc: "Pass 16px icon for text buttons, 24px for icon-only variants" },
        { prop: "label",    type: "string",                     def: '"Button"',  desc: "Button label text" },
        { prop: "type",     type: '"button"|"submit"|"reset"',  def: '"button"',  desc: "HTML button type attribute" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calendar date-picker demo — interactive, reusable in prototypes
// Pattern: hidden <input type="date"> + showPicker() triggered by CalendarIcon button
// ---------------------------------------------------------------------------
function CalendarDateDemo() {
  const domRef1 = useRef<HTMLInputElement>(null);
  const domRef2 = useRef<HTMLInputElement>(null);
  const domRef3 = useRef<HTMLInputElement>(null);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("2026-04-10"); // pre-filled example

  // Format raw YYYY-MM-DD to "Apr 10, 2026" display string
  function formatDate(raw: string) {
    if (!raw) return "";
    const d = new Date(raw + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const calendarTailingIcon = (ref: React.RefObject<HTMLInputElement | null>) => (
    <button
      type="button"
      onClick={() => ref.current?.showPicker?.()}
      style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
    >
      <CalendarIcon />
    </button>
  );

  const codeSnippet =
`import { useRef, useState } from "react";
import { Input, CalendarIcon } from "@/components/ui/Input";

const domRef = useRef<HTMLInputElement>(null);
const [date, setDate] = useState("");

function formatDate(raw: string) {
  if (!raw) return "";
  return new Date(raw + "T00:00:00")
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

<div style={{ position: "relative" }}>
  <Input
    label="Date of manufacture"
    placeholder="Select date"
    value={formatDate(date)}
    readOnly
    tailingIcon={
      <button type="button"
        onClick={() => domRef.current?.showPicker?.()}
        style={{ display:"flex", alignItems:"center", background:"transparent", border:"none", cursor:"pointer", padding:0 }}
      >
        <CalendarIcon />
      </button>
    }
  />
  <input ref={domRef} type="date"
    onChange={(e) => setDate(e.target.value)}
    style={{ position:"absolute", opacity:0, pointerEvents:"none", width:0, height:0 }}
    tabIndex={-1} aria-hidden
  />
</div>`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[6] }}>

      {/* Description */}
      <p style={{ fontSize: "13px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, margin: 0 }}>
        Use a hidden <code style={{ fontFamily: "monospace" }}>{"<input type=\"date\">"}</code> + <code style={{ fontFamily: "monospace" }}>showPicker()</code> triggered by the
        {" "}<code style={{ fontFamily: "monospace" }}>CalendarIcon</code> button. This opens the native date picker without any visible date-input chrome.
        The displayed value is formatted separately. Icon colour is <code style={{ fontFamily: "monospace" }}>fg/primary</code>.
      </p>

      {/* Interactive demos */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.spacing[4], alignItems: "flex-start" }}>

        {/* Empty state */}
        <div style={{ width: "280px" }}>
          <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>empty — click icon to pick</p>
          <div style={{ position: "relative" }}>
            <Input
              label="Date of manufacture"
              placeholder="Select date"
              value={formatDate(date1)}
              readOnly
              tailingIcon={calendarTailingIcon(domRef1)}
            />
            <input
              ref={domRef1}
              type="date"
              onChange={(e) => setDate1(e.target.value)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
              tabIndex={-1}
              aria-hidden
            />
          </div>
        </div>

        {/* Pre-filled state */}
        <div style={{ width: "280px" }}>
          <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>pre-filled — click icon to change</p>
          <div style={{ position: "relative" }}>
            <Input
              label="Date of manufacture"
              placeholder="Select date"
              value={formatDate(date2)}
              readOnly
              tailingIcon={calendarTailingIcon(domRef2)}
            />
            <input
              ref={domRef2}
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
              tabIndex={-1}
              aria-hidden
            />
          </div>
        </div>

        {/* Disabled state */}
        <div style={{ width: "280px" }}>
          <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>disabled</p>
          <Input
            label="Date of manufacture"
            placeholder="Select date"
            disabled
            tailingIcon={
              <button type="button" disabled style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "not-allowed", padding: 0 }}>
                <CalendarIcon color={tokens.color.fg.disabled} />
              </button>
            }
          />
        </div>

        {/* Error state */}
        <div style={{ width: "280px" }}>
          <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>error</p>
          <div style={{ position: "relative" }}>
            <Input
              label="Date of manufacture"
              placeholder="Select date"
              value={formatDate(date1)}
              readOnly
              errorMessage="Date is required"
              tailingIcon={calendarTailingIcon(domRef3)}
            />
            <input
              ref={domRef3}
              type="date"
              onChange={(e) => setDate1(e.target.value)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
              tabIndex={-1}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Code snippet */}
      <pre style={{
        fontFamily: "monospace", fontSize: "12px",
        background: tokens.color.bg.darkBg, color: tokens.color.brand.lime,
        padding: "12px 16px", borderRadius: tokens.borderRadius.md,
        overflowX: "auto", margin: 0, lineHeight: "1.6",
      }}>
        {codeSnippet}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Input tab
// ---------------------------------------------------------------------------
function InputTab({ svgs }: { svgs: Record<string, string> }) {
  const [hasLeading, setLeading]  = useState(false);
  const [hasTailing, setTailing]  = useState(false);
  const [hasSupport, setSupport]  = useState(false);
  const [hasError,   setHasError] = useState(false);
  const [disabled,   setDisabled] = useState(false);
  const [inputSize,  setSize]     = useState<"Default"|"large">("Default");

  // Inline button demo state
  const [inlineVal,  setInlineVal]  = useState("");
  const [inlineSVal, setInlineSVal] = useState("");

  const searchIcon = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS.input_search]} size={24} alt="search" />;
  const arrowIcon  = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS.input_arrow]}  size={24} alt="arrow right" />;

  // Reusable inline Scan button factory — accepts disabled flag
  function ScanBtn(btnDisabled?: boolean) {
    const scanIconEl = svgs[ICON_NODE_IDS.input_scan]
      ? <span style={{ display:"inline-block", width:"16px", height:"16px", background: btnDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary, maskImage:`url(${svgs[ICON_NODE_IDS.input_scan]})`, maskSize:"contain", maskRepeat:"no-repeat", maskPosition:"center", WebkitMaskImage:`url(${svgs[ICON_NODE_IDS.input_scan]})`, WebkitMaskSize:"contain", WebkitMaskRepeat:"no-repeat", WebkitMaskPosition:"center" } as React.CSSProperties} aria-hidden />
      : <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path fillRule="evenodd" clipRule="evenodd" d="M1 2.5A1.5 1.5 0 0 1 2.5 1H5v1.5H2.5V5H1V2.5zm10 0V1h2.5A1.5 1.5 0 0 1 15 2.5V5h-1.5V2.5H11zM1 11h1.5v2.5H5V15H2.5A1.5 1.5 0 0 1 1 13.5V11zm13 2.5V11h1.5v2.5A1.5 1.5 0 0 1 13.5 15H11v-1.5h2.5zM3 7.5h10V9H3V7.5z"/></svg>;
    return (
      <button
        type="button"
        disabled={btnDisabled}
        style={{ display:"flex", alignItems:"center", gap: tokens.spacing[1], height:"100%", paddingTop: tokens.spacing[2.5], paddingBottom: tokens.spacing[2.5], paddingLeft: tokens.spacing[2], paddingRight: tokens.spacing[2.5], background: btnDisabled ? tokens.color.bg.lightBg : tokens.color.brand.lime, border: btnDisabled ? `1px solid ${tokens.color.divider.frame}` : `1px solid ${tokens.color.divider.lime}`, cursor: btnDisabled ? "not-allowed" : "pointer", fontFamily:tokens.fontFamily.sans, fontSize:tokens.fontSize.body, fontWeight:tokens.fontWeight.medium, color: btnDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary, whiteSpace:"nowrap" as const, borderRadius: 0 }}
      >
        {scanIconEl}Scan
      </button>
    );
  }

  const codeStr = `<Input
  label="Label"
  placeholder="Placeholder"${hasLeading ? `\n  leadingIcon={<SearchIcon />}` : ""}${hasTailing ? `\n  tailingIcon={<ArrowRightIcon />}` : ""}${hasError ? `\n  errorMessage="This field has an error"` : ""}${hasSupport && !hasError ? `\n  supportMessage="Support message"\n  showSupportIcon` : ""}${disabled ? `\n  disabled` : ""}${inputSize !== "Default" ? `\n  inputSize="${inputSize}"` : ""}
/>`;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Input.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 51:990 + 52:1298</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>5 states · 24px icons · error + support messages · large size</p>

      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Size</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {["Default","large"].map(s => <Pill key={s} val={s} cur={inputSize} onClick={() => setSize(s as any)} />)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <PillToggle active={hasLeading} label="Leading icon"  onClick={() => setLeading(!hasLeading)} />
                <PillToggle active={hasTailing} label="Tailing icon"  onClick={() => setTailing(!hasTailing)} />
                <PillToggle active={hasSupport} label="Support msg"   onClick={() => setSupport(!hasSupport)} />
                <PillToggle active={hasError}   label="Error state"   onClick={() => setHasError(!hasError)} />
                <PillToggle active={disabled}   label="Disabled"      onClick={() => setDisabled(!disabled)} />
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "20px", marginBottom: "12px" }}>
              <Input
                label="Label"
                placeholder="Placeholder"
                leadingIcon={hasLeading ? searchIcon : undefined}
                tailingIcon={hasTailing ? arrowIcon  : undefined}
                errorMessage={hasError ? "This field has an error" : undefined}
                supportMessage={hasSupport && !hasError ? "Support message" : undefined}
                showSupportIcon={hasSupport && !hasError}
                disabled={disabled}
                inputSize={inputSize}
              />
            </div>
            <CodeSnippet code={codeStr} />
          </div>
        </div>
      </div>

      <Section title="All States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>default</p><Input label="Label" placeholder="Placeholder" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>focus — click to trigger</p><Input label="Label" placeholder="Placeholder" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>filled</p><Input label="Label" placeholder="Placeholder" defaultValue="email@address.com" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>error</p><Input label="Label" placeholder="Placeholder" defaultValue="email@address.com" errorMessage="This field has an error" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>disabled</p><Input label="Label" placeholder="Placeholder" disabled /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>support message</p><Input label="Label" placeholder="Placeholder" supportMessage="Support message" showSupportIcon /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>leading icon — search (gray/400)</p><Input label="Label" placeholder="Search…" leadingIcon={searchIcon} /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>tailing icon — arrow right (gray/900)</p><Input label="Label" placeholder="Placeholder" tailingIcon={arrowIcon} /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>leading icon + error</p><Input label="Label" placeholder="Placeholder" leadingIcon={searchIcon} defaultValue="bad@input" errorMessage="Invalid format" /></div>
            <div style={{ gridColumn: "1 / -1" }}><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>large (textarea-style)</p><Input label="Label" placeholder="Write a note…" inputSize="large" /></div>
          </div>
        </div>
      </Section>

      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props</p>
      <PropsTable rows={[
        { prop: "label",           type: "string",            def: "—",             desc: "Label above the field — Inter Medium 500 14px" },
        { prop: "placeholder",     type: "string",            def: '"Placeholder"', desc: "Placeholder text in gray-400" },
        { prop: "inputSize",       type: '"Default"|"large"', def: '"Default"',     desc: "Default=40px · large=80px min-height" },
        { prop: "leadingIcon",     type: "ReactNode",         def: "—",             desc: "24px icon on the left — gray/400 color" },
        { prop: "tailingIcon",     type: "ReactNode",         def: "—",             desc: "24px icon on the right — hidden when errorMessage set" },
        { prop: "errorMessage",    type: "string",            def: "—",             desc: "Red 2px border + error icon + message. For inline button variant use ScanInput." },
        { prop: "supportMessage",  type: "string",            def: "—",             desc: "Helper text in gray-500 below the input" },
        { prop: "showSupportIcon", type: "boolean",           def: "false",         desc: "Prefix support message with lightbulb icon" },
        { prop: "disabled",        type: "boolean",           def: "false",         desc: "gray-50 bg, gray-400 text, not interactive" },
      ]} />

      {/* Calendar / date variant */}
      <Section title="Tailing icon — Calendar (date input pattern)">
        <CalendarDateDemo />
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SelectInput tab
// ---------------------------------------------------------------------------
function SelectInputTab() {
  const [val,      setVal]      = useState("option-a");
  const [hasError, setHasError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const options = [
    { value: "option-a", label: "Option A" },
    { value: "option-b", label: "Option B" },
    { value: "option-c", label: "Option C" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/SelectInput.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 51:1093</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Dropdown select — same border states as Input · floating list via ContextMenu</p>

      {/* Playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                <PillToggle active={hasError} label="Error state" onClick={() => setHasError(!hasError)} />
                <PillToggle active={disabled} label="Disabled"    onClick={() => setDisabled(!disabled)} />
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "20px" }}>
              <SelectInput
                label="Label"
                placeholder="Placeholder"
                options={options}
                value={hasError || disabled ? undefined : val}
                onChange={setVal}
                errorMessage={hasError ? "This field has an error" : undefined}
                supportMessage={!hasError ? "Support message" : undefined}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* All states */}
      <Section title="All States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>default (empty)</p><SelectInput label="Label" placeholder="Placeholder" options={options} /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>filled — click to open</p><SelectInput label="Label" options={options} value="option-a" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>error</p><SelectInput label="Label" options={options} value="option-a" errorMessage="This field has an error" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>disabled</p><SelectInput label="Label" placeholder="Placeholder" options={options} disabled /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>support message</p><SelectInput label="Label" placeholder="Placeholder" options={options} supportMessage="Support message" showSupportIcon /></div>
          </div>
        </div>
      </Section>

      {/* Props */}
      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props</p>
      <PropsTable rows={[
        { prop: "options",        type: "SelectOption[]", def: "—",             desc: "Array of { value, label } pairs" },
        { prop: "value",          type: "string",         def: "—",             desc: "Controlled selected value" },
        { prop: "onChange",       type: "(v) => void",    def: "—",             desc: "Called with the new value when an option is picked" },
        { prop: "label",          type: "string",         def: "—",             desc: "Label above the dropdown" },
        { prop: "placeholder",    type: "string",         def: '"Placeholder"', desc: "Shown when no value is selected" },
        { prop: "errorMessage",   type: "string",         def: "—",             desc: "Red 2px border + error icon + message below" },
        { prop: "supportMessage", type: "string",         def: "—",             desc: "Helper text shown below the trigger" },
        { prop: "showSupportIcon",type: "boolean",        def: "false",         desc: "Prefix support message with lightbulb icon" },
        { prop: "disabled",       type: "boolean",        def: "false",         desc: "Gray-50 bg, not interactive" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CompositeInput tab
// ---------------------------------------------------------------------------
function CompositeInputTab() {
  const [numVal,   setNumVal]   = useState("");
  const [unit,     setUnit]     = useState("kg");
  const [hasError, setHasError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const unitOptions = [
    { value: "kg",  label: "kg"  },
    { value: "g",   label: "g"   },
    { value: "lb",  label: "lb"  },
    { value: "oz",  label: "oz"  },
    { value: "m",   label: "m"   },
    { value: "cm",  label: "cm"  },
    { value: "mm",  label: "mm"  },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/CompositeInput.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 52:1355 · 5837:15854</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Text input + inline unit selector — single shared border, right-aligned 148px dropdown</p>

      {/* Playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                <PillToggle active={hasError} label="Error state" onClick={() => setHasError(!hasError)} />
                <PillToggle active={disabled} label="Disabled"    onClick={() => setDisabled(!disabled)} />
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "20px" }}>
              <CompositeInput
                label="Weight"
                placeholder="0"
                value={numVal}
                onChange={setNumVal}
                unitOptions={unitOptions}
                unitValue={unit}
                onUnitChange={setUnit}
                errorMessage={hasError ? "This field has an error" : undefined}
                supportMessage={!hasError ? "Enter a value and select a unit" : undefined}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* All states */}
      <Section title="All States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>default (empty)</p><CompositeInput label="Label" placeholder="0" unitOptions={unitOptions} /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>filled</p><CompositeInput label="Label" value="12.5" unitOptions={unitOptions} unitValue="kg" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>error</p><CompositeInput label="Label" value="abc" unitOptions={unitOptions} unitValue="kg" errorMessage="Invalid value" /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>disabled</p><CompositeInput label="Label" placeholder="0" unitOptions={unitOptions} disabled /></div>
            <div><p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>support message</p><CompositeInput label="Label" placeholder="0" unitOptions={unitOptions} unitValue="m" supportMessage="Enter a length" showSupportIcon /></div>
          </div>
        </div>
      </Section>

      {/* Props */}
      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props</p>
      <PropsTable rows={[
        { prop: "unitOptions",    type: "UnitOption[]",   def: "—",              desc: "Array of { value, label } pairs for the unit dropdown" },
        { prop: "unitValue",      type: "string",         def: "—",              desc: "Controlled selected unit" },
        { prop: "onUnitChange",   type: "(v) => void",    def: "—",              desc: "Called when a unit is selected" },
        { prop: "value",          type: "string",         def: "—",              desc: "Controlled value for the text input" },
        { prop: "onChange",       type: "(v) => void",    def: "—",              desc: "Called on text input change" },
        { prop: "label",          type: "string",         def: "—",              desc: "Label above the field" },
        { prop: "placeholder",    type: "string",         def: '"0"',            desc: "Placeholder for the numeric input" },
        { prop: "unitPlaceholder",type: "string",         def: '"Select unit"',  desc: "Placeholder shown in the unit button when nothing selected" },
        { prop: "errorMessage",   type: "string",         def: "—",              desc: "Red 2px border + error icon + message below" },
        { prop: "supportMessage", type: "string",         def: "—",              desc: "Helper text shown below the input" },
        { prop: "showSupportIcon",type: "boolean",        def: "false",          desc: "Prefix support message with lightbulb icon" },
        { prop: "disabled",       type: "boolean",        def: "false",          desc: "Gray-50 bg, not interactive" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radio tab
// ---------------------------------------------------------------------------
function RadioTab() {
  const [radioVal, setRadioVal]         = useState("option-a");
  const [showDesc, setShowDesc]         = useState(false);
  const [twoLineDesc, setTwoLineDesc]   = useState(false);
  const [showBadge, setShowBadge]       = useState(false);
  const [radioDisabled, setRadioDisabled] = useState(false);
  const [direction, setDirection]       = useState<"vertical"|"horizontal">("vertical");

  const demoOptions = [
    { value: "option-a", label: "Option A", description: showDesc ? "Short description about this option" : undefined, meta: twoLineDesc ? "Included · Requires plan upgrade" : undefined, badge: showBadge ? "New" : undefined },
    { value: "option-b", label: "Option B", description: showDesc ? "Short description about this option" : undefined, meta: twoLineDesc ? "Most popular · Recommended for teams" : undefined, badge: showBadge ? "Popular" : undefined },
    { value: "option-c", label: "Option C", description: showDesc ? "Short description about this option" : undefined, meta: twoLineDesc ? "Enterprise only · Contact sales" : undefined },
  ];

  const codeStr = `<RadioGroup
  name="plan"
  value={selected}
  onChange={setSelected}
  direction="${direction}"
  options={[
    { value: "option-a", label: "Option A" },
    { value: "option-b", label: "Option B" },
    { value: "option-c", label: "Option C" },
  ]}
/>`;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Radio.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 35:1161 · 2172:2525</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>RadioButton · RadioInput · RadioGroup · 6 states · label + description</p>

      {/* Playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Direction</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <Pill val="vertical"   cur={direction} onClick={() => setDirection("vertical")} />
                <Pill val="horizontal" cur={direction} onClick={() => setDirection("horizontal")} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <PillToggle active={showDesc}      label="Description"   onClick={() => { setShowDesc(!showDesc); if (showDesc) setTwoLineDesc(false); }} />
                <PillToggle active={twoLineDesc}   label="2-line desc"   onClick={() => { setTwoLineDesc(!twoLineDesc); setShowDesc(true); }} />
                <PillToggle active={showBadge}     label="Badge"         onClick={() => setShowBadge(!showBadge)} />
                <PillToggle active={radioDisabled} label="Disabled"      onClick={() => setRadioDisabled(!radioDisabled)} />
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "20px", marginBottom: "12px" }}>
              <RadioGroup
                name="playground-radio"
                value={radioVal}
                onChange={setRadioVal}
                direction={direction}
                disabled={radioDisabled}
                options={demoOptions}
              />
            </div>
            <CodeSnippet code={codeStr} />
          </div>
        </div>
      </div>

      {/* All States */}
      <Section title="All States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>

          {/* ── Indicator state grid (Figma 35:1161) ── */}
          <Row label="Indicator — 8 states (Figma 35:1161)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 40px)", gap: "8px", alignItems: "center" }}>
              {[
                { label: "unsel\ndefault",  checked: false, hovered: false, focused: false, disabled: false },
                { label: "sel\ndefault",    checked: true,  hovered: false, focused: false, disabled: false },
                { label: "unsel\nhover",    checked: false, hovered: true,  focused: false, disabled: false },
                { label: "sel\nhover",      checked: true,  hovered: true,  focused: false, disabled: false },
                { label: "unsel\nfocus",    checked: false, hovered: false, focused: true,  disabled: false },
                { label: "sel\nfocus",      checked: true,  hovered: false, focused: true,  disabled: false },
                { label: "unsel\ndisabled", checked: false, hovered: false, focused: false, disabled: true  },
                { label: "sel\ndisabled",   checked: true,  hovered: false, focused: false, disabled: true  },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <RadioIndicator checked={s.checked} hovered={s.hovered} focused={s.focused} disabled={s.disabled} />
                  <span style={{ fontSize: "10px", color: tokens.color.fg.support, textAlign: "center", whiteSpace: "pre", lineHeight: "14px", fontFamily: tokens.fontFamily.sans }}>{s.label}</span>
                </div>
              ))}
            </div>
          </Row>

          <Row label="RadioInput — unchecked">
            <RadioInput name="s1" value="a" label="Label" onChange={() => {}} />
          </Row>
          <Row label="RadioInput — checked">
            <RadioInput name="s2" value="a" checked label="Label" onChange={() => {}} />
          </Row>
          <Row label="RadioInput — with 1-line description">
            <RadioInput name="s3a" value="a" label="Label" description="Short supporting description text" onChange={() => {}} />
          </Row>
          <Row label="RadioInput — description + meta line (12px primary)">
            <RadioInput name="s3b" value="a" label="Label" description="Get notified when someone posts a comment on a posting." meta="Thorough · Recommended for teams" onChange={() => {}} />
          </Row>
          <Row label="RadioInput — with badge (no description / with description + meta)">
            <RadioInput name="s3c" value="a" label="Label" badge="New" onChange={() => {}} />
            <RadioInput name="s3d" value="a" label="Label" badge="Popular" description="Short supporting description" meta="Included · Recommended" onChange={() => {}} />
          </Row>
          <Row label="RadioInput — disabled unchecked / disabled checked">
            <RadioInput name="s4" value="a" label="Disabled" disabled />
            <RadioInput name="s5" value="a" label="Disabled checked" checked disabled />
          </Row>
          <Row label="RadioGroup — vertical">
            <RadioGroup
              name="states-v"
              value="b"
              onChange={() => {}}
              options={[
                { value: "a", label: "Option A" },
                { value: "b", label: "Option B" },
                { value: "c", label: "Option C", disabled: true },
              ]}
            />
          </Row>
          <Row label="RadioGroup — horizontal">
            <RadioGroup
              name="states-h"
              value="a"
              onChange={() => {}}
              direction="horizontal"
              options={[
                { value: "a", label: "Option A" },
                { value: "b", label: "Option B" },
                { value: "c", label: "Option C" },
              ]}
            />
          </Row>
        </div>
      </Section>

      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props — RadioInput / RadioGroup</p>
      <PropsTable rows={[
        { prop: "checked",     type: "boolean",                    def: "false",      desc: "Whether this option is selected" },
        { prop: "disabled",    type: "boolean",                    def: "false",      desc: "Non-interactive — gray fill, gray border" },
        { prop: "label",       type: "string",                     def: "—",          desc: "Primary label — Inter Regular 14px" },
        { prop: "description", type: "string",                     def: "—",          desc: "Secondary description — Inter Regular 12px gray/500" },
        { prop: "name",        type: "string",                     def: "—",          desc: "HTML name attribute — groups radios together" },
        { prop: "value",       type: "string",                     def: "—",          desc: "HTML value attribute" },
        { prop: "onChange",    type: "(checked: boolean) => void", def: "—",          desc: "Fired when the user selects this option" },
        { prop: "direction",   type: '"vertical"|"horizontal"',    def: '"vertical"', desc: "RadioGroup only — layout direction" },
        { prop: "options",     type: "RadioOption[]",              def: "—",          desc: "RadioGroup only — array of option objects" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkbox tab
// ---------------------------------------------------------------------------
function CheckboxTab() {
  const [checked, setChecked]           = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [showDesc, setShowDesc]         = useState(false);
  const [cbDisabled, setCbDisabled]     = useState(false);

  // Group state
  const [groupValues, setGroupValues] = useState<Record<string, boolean>>({
    "check-a": true,
    "check-b": false,
    "check-c": false,
  });

  const allChecked  = Object.values(groupValues).every(Boolean);
  const someChecked = Object.values(groupValues).some(Boolean) && !allChecked;

  function toggleGroup(val: string, c: boolean) {
    setGroupValues(prev => ({ ...prev, [val]: c }));
  }

  const codeStr = `<CheckboxInput
  label="Accept terms"
  description="By checking this you agree"
  checked={checked}
  onChange={setChecked}
/>

// Indeterminate (parent of partial selection)
<Checkbox
  checked={allChecked}
  indeterminate={someChecked}
  onChange={handleSelectAll}
/>`;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Checkbox.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 35:1151 · 35:1462</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Checkbox · CheckboxInput · CheckboxGroup · checked / indeterminate / disabled · label + description</p>

      {/* Playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>State</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <PillToggle active={checked}       label="Checked"       onClick={() => { setChecked(!checked); setIndeterminate(false); }} />
                <PillToggle active={indeterminate} label="Indeterminate" onClick={() => { setIndeterminate(!indeterminate); setChecked(false); }} />
                <PillToggle active={cbDisabled}    label="Disabled"      onClick={() => setCbDisabled(!cbDisabled)} />
                <PillToggle active={showDesc}      label="Description"   onClick={() => setShowDesc(!showDesc)} />
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <PreviewBox>
              <CheckboxInput
                checked={checked}
                indeterminate={indeterminate}
                disabled={cbDisabled}
                label="Checkbox label"
                description={showDesc ? "Supporting description text" : undefined}
                onChange={setChecked}
              />
            </PreviewBox>
            <CodeSnippet code={codeStr} />
          </div>
        </div>
      </div>

      {/* All States */}
      <Section title="All States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>

          {/* ── Indicator state grid (Figma 35:1151) ── */}
          <Row label="Indicator — 12 states (Figma 35:1151)">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { rowLabel: "default",  hovered: false, focused: false, disabled: false },
                { rowLabel: "hover",    hovered: true,  focused: false, disabled: false },
                { rowLabel: "focus",    hovered: false, focused: true,  disabled: false },
                { rowLabel: "disabled", hovered: false, focused: false, disabled: true  },
              ].map((row) => (
                <div key={row.rowLabel} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <span style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, width: "48px", flexShrink: 0 }}>{row.rowLabel}</span>
                  {[
                    { type: "unselected" as const,     checked: false, indeterminate: false },
                    { type: "selected" as const,       checked: true,  indeterminate: false },
                    { type: "indeterminate" as const,  checked: false, indeterminate: true  },
                  ].map((col) => (
                    <div key={col.type} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <CheckboxIndicator checked={col.checked} indeterminate={col.indeterminate} hovered={row.hovered} focused={row.focused} disabled={row.disabled} />
                      <span style={{ fontSize: "10px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans }}>{col.type}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Row>

          <Row label="Checkbox control — unchecked / checked / indeterminate / disabled-unchecked / disabled-checked">
            <Checkbox checked={false} />
            <Checkbox checked={true}         onChange={() => {}} />
            <Checkbox indeterminate={true}   onChange={() => {}} />
            <Checkbox checked={false} disabled />
            <Checkbox checked={true}  disabled />
            <Checkbox indeterminate   disabled />
          </Row>
          <Row label="CheckboxInput — unchecked">
            <CheckboxInput label="Label" onChange={() => {}} />
          </Row>
          <Row label="CheckboxInput — checked">
            <CheckboxInput label="Label" checked onChange={() => {}} />
          </Row>
          <Row label="CheckboxInput — with description">
            <CheckboxInput label="Label" description="Supporting description text here" onChange={() => {}} />
          </Row>
          <Row label="CheckboxInput — disabled">
            <CheckboxInput label="Disabled unchecked" disabled />
            <CheckboxInput label="Disabled checked" checked disabled />
          </Row>
          <Row label="Select-all pattern with indeterminate">
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[3] }}>
              <CheckboxInput
                label="Select all"
                checked={allChecked}
                indeterminate={someChecked}
                onChange={(c) => setGroupValues({ "check-a": c, "check-b": c, "check-c": c })}
              />
              <div style={{ paddingLeft: tokens.spacing[6] }}>
                <CheckboxGroup
                  options={[
                    { value: "check-a", label: "Item A", checked: groupValues["check-a"] },
                    { value: "check-b", label: "Item B", checked: groupValues["check-b"] },
                    { value: "check-c", label: "Item C", checked: groupValues["check-c"] },
                  ]}
                  onChange={toggleGroup}
                />
              </div>
            </div>
          </Row>
        </div>
      </Section>

      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props — CheckboxInput / CheckboxGroup</p>
      <PropsTable rows={[
        { prop: "checked",       type: "boolean",                    def: "false", desc: "Whether the checkbox is checked" },
        { prop: "indeterminate", type: "boolean",                    def: "false", desc: "Mixed state — shows dash — use for parent of partial group" },
        { prop: "disabled",      type: "boolean",                    def: "false", desc: "Non-interactive — gray fill, gray border" },
        { prop: "label",         type: "string",                     def: "—",     desc: "Primary label — Inter Regular 14px" },
        { prop: "description",   type: "string",                     def: "—",     desc: "Secondary description — Inter Regular 12px gray/500" },
        { prop: "name",          type: "string",                     def: "—",     desc: "HTML name attribute" },
        { prop: "value",         type: "string",                     def: "—",     desc: "HTML value attribute" },
        { prop: "onChange",      type: "(checked: boolean) => void", def: "—",     desc: "Fired when checkbox state changes" },
        { prop: "options",       type: "CheckboxOption[]",           def: "—",     desc: "CheckboxGroup only — array of option objects" },
        { prop: "direction",     type: '"vertical"|"horizontal"',    def: '"vertical"', desc: "CheckboxGroup only — layout direction" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SelectionCard tab
// ---------------------------------------------------------------------------
function SelectionCardTab() {
  const [cardType, setCardType]           = useState<"radio"|"checkbox">("radio");
  const [cardVal, setCardVal]             = useState("plan-b");
  const [checkVals, setCheckVals]         = useState<string[]>(["feat-a"]);
  const [showDesc, setShowDesc]           = useState(true);
  const [twoLineDesc, setTwoLineDesc]     = useState(false);
  const [showBadge, setShowBadge]         = useState(false);
  const [cols, setCols]                   = useState<1|2|3>(1);
  const [cardDisabled, setCardDisabled]   = useState(false);

  function toggleCheckVal(val: string, checked: boolean) {
    setCheckVals(prev => checked ? [...prev, val] : prev.filter(v => v !== val));
  }

  const radioOptions = [
    { value: "plan-a", label: "Starter",    description: showDesc ? "Up to 5 users · 10 GB storage" : undefined, meta: twoLineDesc ? "Included · Free tier available" : undefined },
    { value: "plan-b", label: "Pro",        description: showDesc ? "Up to 25 users · 100 GB storage" : undefined, meta: twoLineDesc ? "Most popular · Recommended for teams" : undefined, badge: showBadge ? "Popular" : undefined },
    { value: "plan-c", label: "Enterprise", description: showDesc ? "Unlimited users · Unlimited storage" : undefined, meta: twoLineDesc ? "Custom contract · Contact sales" : undefined, badge: showBadge ? "New" : undefined, disabled: cardDisabled },
  ];

  const checkOptions = [
    { value: "feat-a", label: "NFC scanning",   description: showDesc ? "Scan NFC tags with your phone" : undefined, meta: twoLineDesc ? "Requires NFC-capable device" : undefined },
    { value: "feat-b", label: "Bulk import",    description: showDesc ? "Import hundreds of assets at once" : undefined, meta: twoLineDesc ? "CSV and Excel supported" : undefined, badge: showBadge ? "Beta" : undefined },
    { value: "feat-c", label: "Custom reports", description: showDesc ? "Build and schedule your own reports" : undefined, meta: twoLineDesc ? "Pro plan and above" : undefined, disabled: cardDisabled },
  ];

  const codeStr = cardType === "radio"
    ? `<SelectionCardGroup
  type="radio"
  name="plan"
  value={selected}
  onChange={(val) => setSelected(val)}
  columns={${cols}}
  options={[
    { value: "a", label: "Starter", description: "Up to 5 users" },
    { value: "b", label: "Pro",     description: "Up to 25 users" },
  ]}
/>`
    : `<SelectionCardGroup
  type="checkbox"
  name="features"
  value={selected}       // string[]
  onChange={(val, checked) => toggle(val, checked)}
  columns={${cols}}
  options={[
    { value: "nfc",    label: "NFC scanning" },
    { value: "import", label: "Bulk import" },
  ]}
/>`;

  const opts   = cardType === "radio" ? radioOptions : checkOptions;
  const curVal = cardType === "radio" ? cardVal       : checkVals;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/SelectionCard.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2448:1886</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>SelectionCard · SelectionCardGroup · radio + checkbox modes · 1–3 column grid</p>

      {/* Playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Type</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <Pill val="radio"    cur={cardType} onClick={() => setCardType("radio")} />
                <Pill val="checkbox" cur={cardType} onClick={() => setCardType("checkbox")} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Columns</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {([1,2,3] as const).map(c => <Pill key={c} val={String(c)} cur={String(cols)} onClick={() => setCols(c)} />)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <PillToggle active={showDesc}     label="Description"  onClick={() => { setShowDesc(!showDesc); if (showDesc) setTwoLineDesc(false); }} />
                <PillToggle active={twoLineDesc}  label="2-line desc"  onClick={() => { setTwoLineDesc(!twoLineDesc); setShowDesc(true); }} />
                <PillToggle active={showBadge}    label="Badge"        onClick={() => setShowBadge(!showBadge)} />
                <PillToggle active={cardDisabled} label="Disable last" onClick={() => setCardDisabled(!cardDisabled)} />
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "20px", marginBottom: "12px" }}>
              <SelectionCardGroup
                type={cardType}
                name="playground-card"
                value={curVal as any}
                onChange={(val, checked) => {
                  if (cardType === "radio") setCardVal(val);
                  else toggleCheckVal(val, checked);
                }}
                columns={cols}
                options={opts}
              />
            </div>
            <CodeSnippet code={codeStr} />
          </div>
        </div>
      </div>

      {/* All States */}
      <Section title="All States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <Row label="Radio card — no description / description only / description + meta">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 240px)", gap: "12px", width: "100%" }}>
              <SelectionCard type="radio" label="Starter" checked onChange={() => {}} />
              <SelectionCard type="radio" label="Pro" description="Up to 25 users · 100 GB storage" checked onChange={() => {}} />
              <SelectionCard type="radio" label="Enterprise" description="Unlimited users and storage" meta="Custom contract · Contact sales" checked onChange={() => {}} />
            </div>
          </Row>
          <Row label="Radio card — with badge (unchecked / checked / disabled)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 240px)", gap: "12px", width: "100%" }}>
              <SelectionCard type="radio" label="Starter" description="Up to 5 users · 10 GB storage" badge="Free" />
              <SelectionCard type="radio" label="Pro" description="Up to 25 users · 100 GB storage" badge="Popular" checked onChange={() => {}} />
              <SelectionCard type="radio" label="Enterprise" description="Custom contract required" badge="New" disabled />
            </div>
          </Row>
          <Row label="Checkbox card — unchecked / checked / indeterminate / disabled">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 220px)", gap: "12px", width: "100%" }}>
              <SelectionCard type="checkbox" label="Feature A" description="Default state" />
              <SelectionCard type="checkbox" label="Feature B" description="This is enabled" checked onChange={() => {}} />
              <SelectionCard type="checkbox" label="Feature C" description="Mixed state" checked={false} indeterminate onChange={() => {}} />
              <SelectionCard type="checkbox" label="Feature D" description="Not available" disabled />
            </div>
          </Row>
          <Row label="Checkbox card — with badge">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 240px)", gap: "12px", width: "100%" }}>
              <SelectionCard type="checkbox" label="NFC scanning" description="Scan NFC tags with your phone" badge="Beta" />
              <SelectionCard type="checkbox" label="Bulk import" description="Import assets from CSV or Excel" badge="Beta" checked onChange={() => {}} />
              <SelectionCard type="checkbox" label="Custom reports" description="Build and schedule your own reports" badge="New" disabled />
            </div>
          </Row>
          <Row label="2-column radio group">
            <div style={{ width: "100%" }}>
              <SelectionCardGroup
                type="radio"
                name="example-2col"
                value="opt-b"
                onChange={() => {}}
                columns={2}
                options={[
                  { value: "opt-a", label: "Standard", description: "Basic access for individuals" },
                  { value: "opt-b", label: "Professional", description: "Advanced tools for teams" },
                  { value: "opt-c", label: "Business", description: "Full suite for organisations" },
                  { value: "opt-d", label: "Enterprise", description: "Custom contract required", disabled: true },
                ]}
              />
            </div>
          </Row>
        </div>
      </Section>

      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props — SelectionCard / SelectionCardGroup</p>
      <PropsTable rows={[
        { prop: "type",          type: '"radio"|"checkbox"',           def: '"radio"',  desc: "Control indicator shown inside the card" },
        { prop: "checked",       type: "boolean",                      def: "false",    desc: "Whether the card is selected" },
        { prop: "indeterminate", type: "boolean",                      def: "false",    desc: "Checkbox only — mixed state indicator" },
        { prop: "disabled",      type: "boolean",                      def: "false",    desc: "Gray background, not interactive" },
        { prop: "label",         type: "string",                       def: "—",        desc: "Primary card label — Inter Medium 14px" },
        { prop: "description",   type: "string",                       def: "—",        desc: "Secondary text — Inter Regular 12px gray/500" },
        { prop: "trailingIcon",  type: "ReactNode",                    def: "—",        desc: "Optional icon rendered at the right edge" },
        { prop: "name",          type: "string",                       def: "—",        desc: "HTML name attribute — groups radios together" },
        { prop: "value",         type: "string",                       def: "—",        desc: "HTML value attribute" },
        { prop: "onChange",      type: "(checked: boolean) => void",   def: "—",        desc: "Fired when selection changes" },
        { prop: "columns",       type: "1 | 2 | 3",                   def: "1",        desc: "SelectionCardGroup only — CSS grid columns" },
        { prop: "options",       type: "SelectionCardOption[]",        def: "—",        desc: "SelectionCardGroup only — array of card options" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// BadgeTab
// ---------------------------------------------------------------------------
function BadgeTab({ svgs }: { svgs: Record<string, string> }) {
  const colors: BadgeColor[] = ["green", "red", "blue", "yellow", "gray", "lime"];

  const leadingIcon  = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS.badge_leading]}  size={16} alt="check" />;
  const trailingIcon = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS.badge_trailing]} size={16} alt="close" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

      {/* All colors — plain */}
      <Section title="Colors — plain">
        <Row label="All colors">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {colors.map(c => <Badge key={c} color={c} label={c.charAt(0).toUpperCase() + c.slice(1)} />)}
          </div>
        </Row>
      </Section>

      {/* With dot */}
      <Section title="With dot">
        <Row label="All colors">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {colors.map(c => <Badge key={c} color={c} label={c.charAt(0).toUpperCase() + c.slice(1)} withDot />)}
          </div>
        </Row>
      </Section>

      {/* With leading icon */}
      <Section title="With leading icon">
        <Row label="All colors">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {colors.map(c => (
              <Badge key={c} color={c} label={c.charAt(0).toUpperCase() + c.slice(1)}
                icon={leadingIcon} iconPosition="leading" />
            ))}
          </div>
        </Row>
      </Section>

      {/* With trailing icon */}
      <Section title="With trailing icon">
        <Row label="All colors">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {colors.map(c => (
              <Badge key={c} color={c} label={c.charAt(0).toUpperCase() + c.slice(1)}
                icon={trailingIcon} iconPosition="tail" />
            ))}
          </div>
        </Row>
      </Section>

      {/* Common use cases */}
      <Section title="Common use cases">
        <Row label="Status">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Badge color="green"  label="Active"   withDot />
            <Badge color="yellow" label="Pending"  withDot />
            <Badge color="red"    label="Failed"   withDot />
            <Badge color="gray"   label="Inactive" withDot />
            <Badge color="blue"   label="Draft"    withDot />
          </div>
        </Row>
        <Row label="Labels">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Badge color="blue" label="Beta" />
            <Badge color="lime" label="New" />
            <Badge color="gray" label="Deprecated" />
          </div>
        </Row>
      </Section>

      <PropsTable rows={[
        { prop: "label",        type: "string",                                              def: "—",       desc: "Badge text" },
        { prop: "color",        type: "green | red | blue | yellow | gray | lime",           def: "green",   desc: "Color variant" },
        { prop: "withDot",      type: "boolean",                                             def: "false",   desc: "Show 8px dot before label" },
        { prop: "icon",         type: "React.ReactNode",                                     def: "—",       desc: "16px icon element" },
        { prop: "iconPosition", type: "none | leading | tail",                               def: "none",    desc: "Where to place the icon (ignored when withDot is true)" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// BadgeActionableTab
// ---------------------------------------------------------------------------
function BadgeActionableTab() {
  const [sel1, setSel1] = useState(false);
  const [sel2, setSel2] = useState(false);
  const [sel3, setSel3] = useState(false);
  const [sel4, setSel4] = useState(false);

  // Shared icon helpers (inline SVGs — 16px)
  const AdjustmentsIcon = ({ color = tokens.color.fg.primary }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <line x1="2" y1="4.5"  x2="14" y2="4.5"  stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="11.5" x2="14" y2="11.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="5"  cy="4.5"  r="1.8" fill="white" stroke={color} strokeWidth="1.4" />
      <circle cx="11" cy="11.5" r="1.8" fill="white" stroke={color} strokeWidth="1.4" />
    </svg>
  );

  const InfoIcon = ({ color = tokens.color.fg.support }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.3" />
      <path d="M8 7v4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.8" fill={color} />
    </svg>
  );

  const chevronColor    = (sel: boolean) => sel ? tokens.color.fg.blue : tokens.color.fg.support;
  const adjColor        = (sel: boolean) => sel ? tokens.color.fg.blue : tokens.color.fg.primary;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

      {/* ── Small — removable tag (tailing ×, always) ── */}
      <Section title="Small — removable tag">
        <Row label="Default / selected">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable label="EN 12275:2013" dismissible onDismiss={() => {}} />
            <BadgeActionable label="EN 12275:2013" dismissible selected onDismiss={() => {}} />
          </div>
        </Row>
        <Row label="Disabled">
          <BadgeActionable label="EN 12275:2013" dismissible disabled onDismiss={() => {}} />
        </Row>
      </Section>

      {/* ── Small — dropdown filter (leading info + trailing chevron → × when selected) ── */}
      <Section title="Small — dropdown filter chip">
        <Row label="Default / selected / disabled">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable
              label="EN 12275:2013"
              leadingIcon={<InfoIcon />}
              tailingIcon={<BadgeActionableChevronIcon color={tokens.color.fg.support} />}
              dismissible
              onDismiss={() => {}}
            />
            <BadgeActionable
              label="EN 12275:2013"
              selected
              leadingIcon={<InfoIcon color={tokens.color.fg.blue} />}
              tailingIcon={<BadgeActionableChevronIcon color={tokens.color.fg.blue} />}
              dismissible
              onDismiss={() => {}}
            />
            <BadgeActionable
              label="EN 12275:2013"
              disabled
              leadingIcon={<InfoIcon />}
              tailingIcon={<BadgeActionableChevronIcon color={tokens.color.fg.support} />}
              dismissible
              onDismiss={() => {}}
            />
          </div>
        </Row>
        <Row label="Interactive (click to select)">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable
              label="Print Status"
              leadingIcon={<InfoIcon color={sel1 ? tokens.color.fg.blue : tokens.color.fg.support} />}
              tailingIcon={<BadgeActionableChevronIcon color={chevronColor(sel1)} />}
              selected={sel1}
              dismissible
              onClick={() => setSel1(!sel1)}
              onDismiss={() => setSel1(false)}
            />
            <BadgeActionable
              label="Source"
              tailingIcon={<BadgeActionableChevronIcon color={chevronColor(sel2)} />}
              selected={sel2}
              dismissible
              onClick={() => setSel2(!sel2)}
              onDismiss={() => setSel2(false)}
            />
          </div>
        </Row>
      </Section>

      {/* ── Big — text only ── */}
      <Section title='Big — text only ("none")'>
        <Row label="Default / selected / disabled">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable label="Filters" size="big" />
            <BadgeActionable label="All Item" size="big" selected dismissible onDismiss={() => {}} />
            <BadgeActionable label="Filters"  size="big" disabled />
          </div>
        </Row>
      </Section>

      {/* ── Big — leading icon ── */}
      <Section title='Big — leading icon'>
        <Row label="Default / selected / disabled">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable
              label="Filters"
              size="big"
              leadingIcon={<AdjustmentsIcon />}
            />
            <BadgeActionable
              label="Filters"
              size="big"
              selected
              leadingIcon={<AdjustmentsIcon color={tokens.color.fg.blue} />}
            />
            <BadgeActionable
              label="Filters"
              size="big"
              disabled
              leadingIcon={<AdjustmentsIcon />}
            />
          </div>
        </Row>
      </Section>

      {/* ── Big — tailing icon (dropdown) ── */}
      <Section title='Big — tailing icon (dropdown)'>
        <Row label="Default / selected (× replaces icon) / disabled">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable
              label="Print Status"
              size="big"
              tailingIcon={<BadgeActionableChevronIcon color={tokens.color.fg.support} />}
              dismissible
              onDismiss={() => {}}
            />
            <BadgeActionable
              label="All Item"
              size="big"
              selected
              tailingIcon={<BadgeActionableChevronIcon color={tokens.color.fg.blue} />}
              dismissible
              onDismiss={() => {}}
            />
            <BadgeActionable
              label="Source"
              size="big"
              disabled
              tailingIcon={<BadgeActionableChevronIcon color={tokens.color.fg.support} />}
            />
          </div>
        </Row>
        <Row label="Interactive (click to select)">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable
              label="Print Status"
              size="big"
              tailingIcon={<BadgeActionableChevronIcon color={chevronColor(sel3)} />}
              selected={sel3}
              dismissible
              onClick={() => setSel3(!sel3)}
              onDismiss={() => setSel3(false)}
            />
            <BadgeActionable
              label="Source"
              size="big"
              tailingIcon={<BadgeActionableChevronIcon color={chevronColor(sel4)} />}
              selected={sel4}
              dismissible
              onClick={() => setSel4(!sel4)}
              onDismiss={() => setSel4(false)}
            />
            <BadgeActionable
              label="Filters"
              size="big"
              leadingIcon={<AdjustmentsIcon color={adjColor(false)} />}
            />
          </div>
        </Row>
      </Section>

      {/* ── Big — tailing adjustments icon ── */}
      <Section title='Big — tailing adjustments icon'>
        <Row label="Default / selected">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <BadgeActionable label="Filters" size="big" tailingIcon={<AdjustmentsIcon />} />
            <BadgeActionable label="Filters" size="big" selected tailingIcon={<AdjustmentsIcon color={tokens.color.fg.blue} />} dismissible onDismiss={() => {}} />
          </div>
        </Row>
      </Section>

      {/* Props table */}
      <PropsTable rows={[
        { prop: "label",        type: "string",                       def: "—",       desc: "Chip text" },
        { prop: "size",         type: '"small" | "big"',              def: '"small"', desc: "small = pill (12px rounded-full) · big = chip (14px rounded-md)" },
        { prop: "selected",     type: "boolean",                      def: "false",   desc: "Blue selected state — tint/blue bg, action/500 border" },
        { prop: "disabled",     type: "boolean",                      def: "false",   desc: "Fades to 30% opacity, prevents interaction" },
        { prop: "leadingIcon",  type: "React.ReactNode",              def: "—",       desc: "16×16 icon before label" },
        { prop: "tailingIcon",  type: "React.ReactNode",              def: "—",       desc: "16×16 icon after label. On big+dismissible: replaced by × when selected" },
        { prop: "dismissible",  type: "boolean",                      def: "false",   desc: "Shows ×. small+no tailingIcon: always. small+tailingIcon or big: only when selected" },
        { prop: "onClick",      type: "() => void",                   def: "—",       desc: "Called on chip click" },
        { prop: "onDismiss",    type: "() => void",                   def: "—",       desc: "Called when × is clicked (stops propagation)" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar icon node IDs (same as dashboard pages)
// ---------------------------------------------------------------------------
const SIDEBAR_ICON_IDS = {
  overview:   "91:746",    // dashboard
  team:       "92:1154",   // team
  search:     "52:1245",   // search
  settings:   "46:2929",   // settings
  updates:    "2508:760",  // file  (Figma: Scannable Updates uses file icon)
  knowledge:  "91:739",    // book
  products:   "3628:9947", // product&sku  (new icon, missing from library)
  serials:    "94:554",    // serials create  (Figma: Serialisation uses serials-create)
  inspection: "92:1150",   // inspection
  checklists: "92:1270",
  inventory:  "92:758",    // doc  (Figma: Inventory uses doc/kit-list icon)
  myInv:      "92:778",    // my doc
  multiScan:  "92:796",    // multi-scan
};

// ---------------------------------------------------------------------------
// SidebarTab
// ---------------------------------------------------------------------------
function SidebarTab() {
  const [variant, setVariant]     = useState<"standard" | "pro" | "upgrade">("standard");
  const [selectedItem, setSelectedItem] = useState("products");
  const [collapsible, setCollapsible]   = useState(true);
  const [icons, setIcons]               = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSvgs(Object.values(SIDEBAR_ICON_IDS)).then(setIcons);
  }, []);

  // MF sections — Manufacturers/Resellers view
  const mfSections = [
    {
      items: [
        { label: "Overview",          iconUrl: icons[SIDEBAR_ICON_IDS.overview],   selected: selectedItem === "overview",   onClick: () => setSelectedItem("overview") },
        { label: "Team",              iconUrl: icons[SIDEBAR_ICON_IDS.team],        selected: selectedItem === "team",       onClick: () => setSelectedItem("team") },
        { label: "Product Search",    iconUrl: icons[SIDEBAR_ICON_IDS.search],      selected: selectedItem === "search",     onClick: () => setSelectedItem("search") },
        { label: "Settings",          iconUrl: icons[SIDEBAR_ICON_IDS.settings],    selected: selectedItem === "settings",   onClick: () => setSelectedItem("settings") },
        { label: "Scannable Updates", iconUrl: icons[SIDEBAR_ICON_IDS.updates],     selected: selectedItem === "updates",    onClick: () => setSelectedItem("updates"),    showInfo: true },
        { label: "Knowledge Base",    iconUrl: icons[SIDEBAR_ICON_IDS.knowledge],   selected: selectedItem === "knowledge",  onClick: () => setSelectedItem("knowledge"),  showInfo: true },
      ],
    },
    {
      title: "Manufacturers/Resellers",
      collapsible,
      items: [
        { label: "Products/SKUs",  iconUrl: icons[SIDEBAR_ICON_IDS.products],   selected: selectedItem === "products",    onClick: () => setSelectedItem("products") },
        { label: "Serialisation",  iconUrl: icons[SIDEBAR_ICON_IDS.serials],    selected: selectedItem === "serials",     onClick: () => setSelectedItem("serials"),    showInfo: true },
        { label: "Inspections",    iconUrl: icons[SIDEBAR_ICON_IDS.inspection], selected: selectedItem === "inspections", onClick: () => setSelectedItem("inspections") },
        { label: "Checklists",     icon: <ChecklistIcon />,                     selected: selectedItem === "checklists",  onClick: () => setSelectedItem("checklists") },
      ],
    },
    {
      title: "Equipment Owners",
      collapsible,
      items: [
        { label: "Inventory",    iconUrl: icons[SIDEBAR_ICON_IDS.inventory],  selected: selectedItem === "inventory",  onClick: () => setSelectedItem("inventory") },
        { label: "My inventory", iconUrl: icons[SIDEBAR_ICON_IDS.myInv],      selected: selectedItem === "myInv",      onClick: () => setSelectedItem("myInv") },
        { label: "Multi-scan",   iconUrl: icons[SIDEBAR_ICON_IDS.multiScan],  selected: selectedItem === "multiScan",  onClick: () => setSelectedItem("multiScan") },
        { label: "Inspections",  iconUrl: icons[SIDEBAR_ICON_IDS.inspection], selected: selectedItem === "eo-insp",    onClick: () => setSelectedItem("eo-insp") },
      ],
    },
  ];

  // EO sections — Equipment Owner view (pro/upgrade share same structure, upgrade adds Pro chips)
  const isUpgrade = variant === "upgrade";
  const eoSections = [
    {
      items: [
        { label: "Overview",          iconUrl: icons[SIDEBAR_ICON_IDS.overview],   selected: selectedItem === "overview",  onClick: () => setSelectedItem("overview") },
        { label: "Team",              iconUrl: icons[SIDEBAR_ICON_IDS.team],        selected: selectedItem === "team",      onClick: () => setSelectedItem("team"),      showProChip: isUpgrade },
        { label: "Product Search",    iconUrl: icons[SIDEBAR_ICON_IDS.search],      selected: selectedItem === "search",    onClick: () => setSelectedItem("search") },
        { label: "Settings",          iconUrl: icons[SIDEBAR_ICON_IDS.settings],    selected: selectedItem === "settings",  onClick: () => setSelectedItem("settings") },
        { label: "Scannable Updates", iconUrl: icons[SIDEBAR_ICON_IDS.updates],     selected: selectedItem === "updates",   onClick: () => setSelectedItem("updates") },
        { label: "Knowledge Base",    iconUrl: icons[SIDEBAR_ICON_IDS.knowledge],   selected: selectedItem === "knowledge", onClick: () => setSelectedItem("knowledge") },
      ],
    },
    {
      title: "Equipment Owners",
      collapsible,
      items: [
        { label: "Inventory",      iconUrl: icons[SIDEBAR_ICON_IDS.inventory],  selected: selectedItem === "inventory",  onClick: () => setSelectedItem("inventory") },
        { label: "My inventory",   iconUrl: icons[SIDEBAR_ICON_IDS.myInv],      selected: selectedItem === "myInv",      onClick: () => setSelectedItem("myInv"),      showProChip: isUpgrade },
        { label: "Multi-scan",     iconUrl: icons[SIDEBAR_ICON_IDS.multiScan],  selected: selectedItem === "multiScan",  onClick: () => setSelectedItem("multiScan"),  showProChip: isUpgrade },
        { label: "Inspections",    iconUrl: icons[SIDEBAR_ICON_IDS.inspection], selected: selectedItem === "eo-insp",    onClick: () => setSelectedItem("eo-insp"),    showProChip: isUpgrade },
        { label: "Products/SKUs",  iconUrl: icons[SIDEBAR_ICON_IDS.products],   selected: selectedItem === "products",   onClick: () => setSelectedItem("products"),   showProChip: isUpgrade },
      ],
    },
  ];

  const activeSections = variant === "standard" ? mfSections : eoSections;
  const userName    = variant === "standard" ? "Manufacturer co." : variant === "pro" ? "Wanaka Height Safety" : "Individual test";

  return (
    <div>
      {/* Meta */}
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Sidebar.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 2475:4074 · 92:1281</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Left navigation panel · 3 variants (MF, EO-pro, EO-free) · collapsible sections · Pro chips · wave brand logo
      </p>

      {/* Playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px" }}>
          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Variant</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Pill val="standard" cur={variant} onClick={() => setVariant("standard")} />
                <Pill val="pro"      cur={variant} onClick={() => setVariant("pro")} />
                <Pill val="upgrade"  cur={variant} onClick={() => setVariant("upgrade")} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <PillToggle active={collapsible} label="Collapsible sections" onClick={() => setCollapsible(!collapsible)} />
            </div>
          </div>

          {/* Preview */}
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ height: "600px", overflow: "hidden", borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.color.divider.border}` }}>
              <Sidebar
                userName="Danny Smith"
                userSubtitle={userName}
                userInitials="DS"
                variant={variant}
                ctaLabel="Buy NFC Tags"
                sections={activeSections}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nav item states */}
      <Section title="Nav Item States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <Row label="Default">
            <div style={{ width: "264px" }}><SidebarNavItem label="Overview" iconUrl={icons[SIDEBAR_ICON_IDS.overview]} /></div>
          </Row>
          <Row label="Selected">
            <div style={{ width: "264px" }}><SidebarNavItem label="Products/SKUs" iconUrl={icons[SIDEBAR_ICON_IDS.products]} selected /></div>
          </Row>
          <Row label="With Pro chip">
            <div style={{ width: "264px" }}><SidebarNavItem label="My inventory" iconUrl={icons[SIDEBAR_ICON_IDS.myInv]} showProChip /></div>
          </Row>
          <Row label="With info icon">
            <div style={{ width: "264px" }}><SidebarNavItem label="Scannable Updates" iconUrl={icons[SIDEBAR_ICON_IDS.updates]} showInfo /></div>
          </Row>
          <Row label="Selected + info icon">
            <div style={{ width: "264px" }}><SidebarNavItem label="Serialisation" iconUrl={icons[SIDEBAR_ICON_IDS.serials]} selected showInfo /></div>
          </Row>
        </div>
      </Section>

      {/* Props */}
      <PropsTable rows={[
        { prop: "userName",     type: "string",                           def: "—",           desc: "Organisation / workspace name shown in the header" },
        { prop: "userSubtitle", type: "string",                           def: "undefined",   desc: "Optional subtitle below the name (e.g. subdomain or company)" },
        { prop: "userInitials", type: "string",                           def: "—",           desc: "Fallback initials if avatar image unavailable" },
        { prop: "variant",      type: '"standard" | "pro" | "upgrade"',   def: '"standard"',  desc: "standard = Buy NFC Tags only · pro = PRO badge + Active status + CTA · upgrade = lime Upgrade button + CTA" },
        { prop: "ctaLabel",     type: "string",                           def: '"Buy NFC Tags"', desc: "Label on the secondary CTA button; omit to hide it" },
        { prop: "sections",     type: "SidebarSection[]",                 def: "—",           desc: "Ordered list of nav sections, each with optional title and collapsible flag" },
        { prop: "onCtaClick",   type: "() => void",                       def: "undefined",   desc: "Called when the CTA button is clicked" },
        { prop: "onUserClick",  type: "() => void",                       def: "undefined",   desc: "Called when the user/org header row is clicked" },
      ]} />

      <PropsTable rows={[
        { prop: "label",       type: "string",     def: "—",     desc: "SidebarNavItem — visible text label" },
        { prop: "icon",        type: "ReactNode",  def: "—",     desc: "24×24 icon node rendered on the left" },
        { prop: "selected",    type: "boolean",    def: "false", desc: "Highlights item with indigo-50 background" },
        { prop: "showProChip", type: "boolean",    def: "false", desc: "Shows a bordered 'Pro' chip on the trailing side" },
        { prop: "showInfo",    type: "boolean",    def: "false", desc: "Shows a 16px info icon inline after the label" },
        { prop: "href",        type: "string",     def: "—",     desc: "Renders as <a> instead of <button> when provided" },
        { prop: "onClick",     type: "() => void", def: "—",     desc: "Click handler (used when href is not set)" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast tab
// ---------------------------------------------------------------------------
function ToastTab() {
  const [variant, setVariant]   = useState<ToastVariant>("success");
  const [withClose, setClose]   = useState(false);
  const [withAction, setAction] = useState(false);
  const { show, ToastContainer } = useToast();

  const message = variant === "success" ? "Serials added successfully"
    : variant === "error"   ? "Something went wrong"
    : "New firmware available";

  function fireToast() {
    show({
      message,
      variant,
      onClose:  withClose  ? () => {} : undefined,
      action:   withAction ? { label: "Undo", onClick: () => {} } : undefined,
      duration: 3000,
    });
  }

  const codeStr = `import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/components/ui/Toast";

// Simple auto-dismiss
<Toast message="Serials added" variant="${variant}" />

// With hook
const { show, ToastContainer } = useToast();
show({ message: "Done!", variant: "${variant}"${withClose ? ', onClose: () => {}' : ''}${withAction ? ', action: { label: "Undo", onClick: () => {} }' : ''} });

<ToastContainer />`;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Toast.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2250-1079</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>3 variants · optional close button · optional action link · auto-dismiss after 3s when no close</p>

      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Variant</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(["success","error","info"] as ToastVariant[]).map(v => (
                  <Pill key={v} val={v} cur={variant} onClick={() => setVariant(v)} />
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <PillToggle active={withClose}  label="Close button" onClick={() => setClose(!withClose)} />
                <PillToggle active={withAction} label="Action link"  onClick={() => setAction(!withAction)} />
              </div>
            </div>
            <button
              onClick={fireToast}
              style={{ padding: "10px 20px", borderRadius: tokens.borderRadius.md, background: tokens.color.brand.lime, border: "none", cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, width: "fit-content" }}
            >
              Fire toast
            </button>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview (inline)</p>
            <Toast
              message={message}
              variant={variant}
              onClose={withClose ? () => {} : undefined}
              action={withAction ? { label: "Undo", onClick: () => {} } : undefined}
            />
          </div>
        </div>
        <CodeSnippet code={codeStr} />
      </div>

      <Section title="All Variants">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Toast variant="success" message="Serials added successfully" onClose={() => {}} />
          <Toast variant="error"   message="Something went wrong"       onClose={() => {}} />
          <Toast variant="info"    message="New firmware available"      onClose={() => {}} />
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "message",  type: "string",                                                    def: "—",          desc: "The text shown inside the toast" },
        { prop: "variant",  type: '"success" | "error" | "info"',                               def: '"success"',  desc: "Controls background color and icon" },
        { prop: "onClose",  type: "() => void",                                                def: "undefined",  desc: "If provided, renders a dismiss ✕ button; toast stays until dismissed" },
        { prop: "action",   type: '{ label: string; onClick: () => void }',                    def: "undefined",  desc: "Optional underlined action link on the right" },
        { prop: "duration", type: "number",                                                    def: "3000",       desc: "Auto-dismiss delay in ms when no onClose is provided" },
      ]} />
      <ToastContainer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle + ToggleInput combined tab
// ---------------------------------------------------------------------------
function ToggleTab() {
  const [toggleChecked,  setToggleChecked]  = useState(false);
  const [toggleDisabled, setToggleDisabled] = useState(false);
  const [inputChecked,   setInputChecked]   = useState(false);
  const [showDesc,       setShowDesc]       = useState(false);
  const [inputDisabled,  setInputDisabled]  = useState(false);

  const toggleCode = `import { Toggle } from "@/components/ui/Toggle";

<Toggle
  checked={${toggleChecked}}
  onChange={(v) => setChecked(v)}${toggleDisabled ? '\n  disabled' : ''}
/>`;

  const inputCode = `import { ToggleInput } from "@/components/ui/ToggleInput";

<ToggleInput
  label="Enable notifications"${showDesc ? '\n  description="You will receive push alerts for low stock"' : ''}
  checked={${inputChecked}}
  onChange={(v) => setChecked(v)}${inputDisabled ? '\n  disabled' : ''}
/>`;

  return (
    <div>
      {/* ── Toggle ── */}
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Toggle.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2044-2521</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>On/off pill toggle · controlled · disabled state</p>

      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>State</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <PillToggle active={toggleChecked}  label="Checked"  onClick={() => setToggleChecked(!toggleChecked)} />
                <PillToggle active={toggleDisabled} label="Disabled" onClick={() => setToggleDisabled(!toggleDisabled)} />
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <ToggleUI checked={toggleChecked} onChange={setToggleChecked} disabled={toggleDisabled} />
          </div>
        </div>
        <CodeSnippet code={toggleCode} />
      </div>

      <Section title="States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <Row label="Off"><ToggleUI checked={false} onChange={() => {}} /></Row>
          <Row label="On"><ToggleUI checked={true}  onChange={() => {}} /></Row>
          <Row label="Disabled off"><ToggleUI checked={false} onChange={() => {}} disabled /></Row>
          <Row label="Disabled on"><ToggleUI checked={true}  onChange={() => {}} disabled /></Row>
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "checked",  type: "boolean",                    def: "—",     desc: "Controlled on/off state" },
        { prop: "onChange", type: "(checked: boolean) => void", def: "—",     desc: "Called with the new boolean value on change" },
        { prop: "disabled", type: "boolean",                    def: "false", desc: "Renders at 50% opacity and blocks interaction" },
        { prop: "id",       type: "string",                     def: "auto",  desc: "Optional id wired to the hidden input (auto-generated if omitted)" },
      ]} />

      {/* ── ToggleInput ── */}
      <div style={{ borderTop: `1px solid ${tokens.color.divider.frame}`, marginTop: "48px", paddingTop: "40px" }}>
        <div style={{ marginBottom: "8px" }}>
          <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ToggleInput.tsx</code>
          <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 4088-2130</span>
        </div>
        <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Label + optional help text row with Toggle on the right</p>

        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
          <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
                <div style={{ display: "flex", gap: "6px" }}>
                  <PillToggle active={showDesc}      label="Help text" onClick={() => setShowDesc(!showDesc)} />
                  <PillToggle active={inputDisabled} label="Disabled"  onClick={() => setInputDisabled(!inputDisabled)} />
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
              <div style={{ maxWidth: "360px" }}>
                <ToggleInput
                  label="Enable notifications"
                  description={showDesc ? "You will receive push alerts for low stock" : undefined}
                  checked={inputChecked}
                  onChange={setInputChecked}
                  disabled={inputDisabled}
                />
              </div>
            </div>
          </div>
          <CodeSnippet code={inputCode} />
        </div>

        <Section title="Examples">
          <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
            <div style={{ maxWidth: "480px" }}>
              <ToggleInput label="Enable notifications" checked={false} onChange={() => {}} />
              <ToggleInput label="Dark mode" checked={true} onChange={() => {}} />
              <ToggleInput label="Item expiry" description="Get notified when an item reaches its end-of-life or fails" checked={false} onChange={() => {}} />
              <ToggleInput label="Archived view" description="Show archived products in the inventory list" checked={true} onChange={() => {}} disabled />
            </div>
          </div>
        </Section>

        <PropsTable rows={[
          { prop: "label",       type: "string",                    def: "—",         desc: "Primary label text" },
          { prop: "description", type: "string",                    def: "undefined", desc: "Optional help text below the label (14px Regular); shifts alignment to flex-start" },
          { prop: "checked",     type: "boolean",                   def: "—",         desc: "Controlled on/off state passed to the inner Toggle" },
          { prop: "onChange",    type: "(checked: boolean) => void", def: "—",         desc: "Called with the new boolean value on toggle" },
          { prop: "disabled",    type: "boolean",                   def: "false",     desc: "Dims label and passes disabled to the Toggle" },
        ]} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContextMenuItemTab
// ---------------------------------------------------------------------------
function ContextMenuItemTab() {
  const [toggleA, setToggleA] = useState(false);
  const [toggleB, setToggleB] = useState(true);

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ContextMenuItem.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 165:930</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Row atom — icon, label, optional support text, 5 states, 4 trailing types. Compose rows inside a <code>ContextMenu</code> surface (see Patterns).
      </p>

      <Section title="States">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "8px", maxWidth: "320px" }}>
          <ContextMenuItem label="Default" />
          <ContextMenuItem label="Hover (simulated)"    state="hover" />
          <ContextMenuItem label="Selected"             state="selected" />
          <ContextMenuItem label="Remove from inventory" state="destructive" />
          <ContextMenuItem label="Disabled"             state="disabled" />
        </div>
      </Section>

      <Section title="With icon">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "8px", maxWidth: "320px" }}>
          <ContextMenuItem label="Inspect" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          } />
          <ContextMenuItem label="Remove from inventory" state="destructive" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M9 6V4h6v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          } />
          <ContextMenuItem label="Add NFC" supportText="NFC is not enabled on this device" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 5h3l6 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 9.5c1.5.5 2.5 2 2.5 3.5s-1 3-2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          } />
        </div>
      </Section>

      <Section title="Trailing types">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "8px", maxWidth: "320px" }}>
          <ContextMenuItem label="Move to folder"   trailing="arrow" />
          <ContextMenuItem label="Show archived"    trailing="toggle" toggleChecked={toggleA} onToggleChange={setToggleA} />
          <ContextMenuItem label="Preview mode"     trailing="toggle" toggleChecked={toggleB} onToggleChange={setToggleB} />
          <ContextMenuItem label="Next inspection"  trailing="chip"   chipLabel="Due Sep 3" />
          <ContextMenuItem label="With divider"     divider />
          <ContextMenuItem label="After divider" />
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "label",          type: "string",                    def: "—",         desc: "Primary label text" },
        { prop: "supportText",    type: "string",                    def: "undefined", desc: "Secondary line below label" },
        { prop: "icon",           type: "ReactNode",                 def: "undefined", desc: "Inline SVG; paths use currentColor — tinted automatically" },
        { prop: "iconUrl",        type: "string",                    def: "undefined", desc: "Data URL SVG, tinted via CSS mask (fg.disabled or fg.red)" },
        { prop: "state",          type: "'default'|'hover'|'selected'|'destructive'|'disabled'", def: "'default'", desc: "Visual state of the row" },
        { prop: "trailing",       type: "'none'|'arrow'|'toggle'|'chip'", def: "'none'", desc: "Trailing element type" },
        { prop: "chipLabel",      type: "string",                    def: "undefined", desc: "Text inside the amber chip badge" },
        { prop: "toggleChecked",  type: "boolean",                   def: "false",     desc: "Controlled value for the toggle trailing item" },
        { prop: "onToggleChange", type: "(checked: boolean) => void", def: "undefined", desc: "Called when the toggle is switched" },
        { prop: "divider",        type: "boolean",                   def: "false",     desc: "Adds a 1px divider line below the row" },
        { prop: "onClick",        type: "() => void",                def: "undefined", desc: "Row click handler — adds role=menuitem, keyboard support" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// AlertTab
// ---------------------------------------------------------------------------
function AlertTab() {
  const [tone,            setTone]      = useState<AlertTone>("brand");
  const [type,            setType]      = useState<AlertType>("default");
  const [withAction,      setAction]    = useState(false);
  const [withClose,       setClose]     = useState(true);

  const tones: AlertTone[] = ["brand", "info", "warning", "disruptive"];
  const types: AlertType[] = ["default", "compact"];

  const codeStr = `import { Alert } from "@/components/ui/Alert";

<Alert
  tone="${tone}"
  type="${type}"${withAction ? "\n  withAction" : ""}${!withClose ? "\n  withCloseButton={false}" : ""}
  title="Attention needed"${type === "default" ? '\n  body="Lorem ipsum dolor sit amet..."' : ""}
  onClose={() => {}}${withAction && type === "default" ? '\n  onViewDetail={() => {}}\n  onDismiss={() => {}}' : ""}${withAction && type === "compact" ? '\n  onDismiss={() => {}}' : ""}
/>`;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Alert.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 215-2129</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        4 tones · 2 types · optional action links · optional close button
      </p>

      {/* Playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px" }}>
          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Tone</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {tones.map(t => <Pill key={t} val={t} cur={tone} onClick={() => setTone(t)} />)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Type</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {types.map(t => <Pill key={t} val={t} cur={type} onClick={() => setType(t)} />)}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <PillToggle active={withAction} label="With action"       onClick={() => setAction(!withAction)} />
                <PillToggle active={withClose}  label="With close button" onClick={() => setClose(!withClose)} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "24px" }}>
              <Alert
                tone={tone}
                type={type}
                withAction={withAction}
                withCloseButton={withClose}
                title="Attention needed"
                body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum."
                onClose={() => {}}
                onViewDetail={() => {}}
                onDismiss={() => {}}
              />
            </div>
            <CodeSnippet code={codeStr} />
          </div>
        </div>
      </div>

      {/* All tones — default */}
      <Section title="All Tones — Default type">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Alert tone="brand"      title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." onClose={() => {}} />
          <Alert tone="info"       title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." onClose={() => {}} />
          <Alert tone="warning"    title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." onClose={() => {}} />
          <Alert tone="disruptive" title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." onClose={() => {}} />
        </div>
      </Section>

      {/* All tones — compact */}
      <Section title="All Tones — Compact type">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Alert tone="info"       type="compact" title="A new software update is available. See what's new in version 2.0.4." onClose={() => {}} />
          <Alert tone="warning"    type="compact" title="A new software update is available. See what's new in version 2.0.4." onClose={() => {}} />
          <Alert tone="disruptive" type="compact" title="A new software update is available. See what's new in version 2.0.4." onClose={() => {}} />
          <Alert tone="disruptive" type="compact" withCloseButton={false} />
        </div>
      </Section>

      {/* With action */}
      <Section title="With action">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Alert tone="brand"      withAction title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." />
          <Alert tone="info"       withAction title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." />
          <Alert tone="warning"    withAction title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." />
          <Alert tone="disruptive" withAction title="Attention needed" body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam." />
        </div>
      </Section>

      {/* Compact with action */}
      <Section title="Compact with action">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Alert tone="info"       type="compact" withAction title="A new software update is available. See what's new in version 2.0.4." onDismiss={() => {}} />
          <Alert tone="warning"    type="compact" withAction title="A new software update is available. See what's new in version 2.0.4." onDismiss={() => {}} />
          <Alert tone="disruptive" type="compact" withAction title="A new software update is available. See what's new in version 2.0.4." onDismiss={() => {}} />
        </div>
      </Section>

      {/* Props */}
      <PropsTable rows={[
        { prop: "tone",            type: '"brand" | "info" | "warning" | "disruptive"', def: '"brand"',           desc: "Color scheme and icon style" },
        { prop: "type",            type: '"default" | "compact"',                        def: '"default"',         desc: "default = icon + title + body; compact = icon + single line" },
        { prop: "withAction",      type: "boolean",                                      def: "false",             desc: "Shows action links (default: View detail + Dismiss; compact: Dismiss)" },
        { prop: "withCloseButton", type: "boolean",                                      def: "true",              desc: "Shows a × close button on the trailing edge" },
        { prop: "title",           type: "string",                                       def: '"Attention needed"', desc: "Primary heading text" },
        { prop: "body",            type: "string",                                       def: "lorem ipsum",       desc: "Body text shown below title (default type only)" },
        { prop: "viewDetailLabel", type: "string",                                       def: '"View detail"',     desc: "Label for the primary action link (default type)" },
        { prop: "dismissLabel",    type: "string",                                       def: '"Dismiss"',         desc: "Label for the dismiss link (both types)" },
        { prop: "onClose",         type: "() => void",                                   def: "undefined",         desc: "Called when the × button is clicked" },
        { prop: "onViewDetail",    type: "() => void",                                   def: "undefined",         desc: "Called when View detail is clicked" },
        { prop: "onDismiss",       type: "() => void",                                   def: "undefined",         desc: "Called when Dismiss is clicked" },
        { prop: "style",           type: "React.CSSProperties",                          def: "undefined",         desc: "Extra inline styles applied to the container" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SectionHeader tab
// ---------------------------------------------------------------------------


function SectionHeaderTab() {
  const variants: { label: string; element: React.ReactNode }[] = [
    {
      label: "1 · Title only",
      element: <SectionHeader title="Batch details" />,
    },
    {
      label: "2 · Title + subtitle",
      element: <SectionHeader title="iPhone 15 Pro Max" subtitle="Apply to product" />,
    },
    {
      label: "3 · Back + title",
      element: <SectionHeader title="Capture serials" onBack={() => {}} />,
    },
    {
      label: "4 · Back + title + subtitle",
      element: <SectionHeader title="iPhone 15 Pro Max" subtitle="24 items · B-2024-001" onBack={() => {}} />,
    },
    {
      label: "5 · Title + close",
      element: <SectionHeader title="Filters" onClose={() => {}} />,
    },
    {
      label: "6 · Back + title + close",
      element: <SectionHeader title="Edit batch" onBack={() => {}} onClose={() => {}} />,
    },
    {
      label: "7 · Title + more + close",
      element: <SectionHeader title="Serialisation" onMore={() => {}} onClose={() => {}} />,
    },
    {
      label: "8 · Deco icon + title + subtitle",
      element: <SectionHeader title="iPhone 15 Pro Max" subtitle="Apply to product" decoIconTone="info" />,
    },
    {
      label: "9 · Deco icon + title + subtitle + close",
      element: <SectionHeader title="iPhone 15 Pro Max" subtitle="Apply to product" decoIconTone="info" onClose={() => {}} />,
    },
    {
      label: "10 · Back + deco icon + title + subtitle + close",
      element: <SectionHeader title="iPhone 15 Pro Max" subtitle="Apply to product" decoIconTone="info" onBack={() => {}} onClose={() => {}} />,
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: tokens.fontSize.h2, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, marginBottom: "8px" }}>Section Header</h2>
      <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fg.support, marginBottom: "32px" }}>
        Used as a modal header, side-panel header, or section header. All variants are driven by props — no variant enum.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "560px" }}>
        {variants.map(({ label, element }) => (
          <div key={label} style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
            <div style={{ padding: "8px 12px", background: tokens.color.bg.bg, borderBottom: `1px solid ${tokens.color.divider.border}`, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.support }}>
              {label}
            </div>
            {element}
          </div>
        ))}
      </div>

      <PropsTable rows={[
        { prop: "title",     type: "string",              def: "—",         desc: "Main heading text (always required)" },
        { prop: "subtitle",  type: "string",              def: "undefined", desc: "Secondary line beneath title — triggers compact padding" },
        { prop: "decoIconTone", type: "DecoIcon40Tone", def: "undefined", desc: "Tone for the 40px design system DecoIcon shown left of the title" },
        { prop: "onBack",    type: "() => void",          def: "undefined", desc: "Shows ← button when provided" },
        { prop: "onMore",    type: "() => void",          def: "undefined", desc: "Shows ··· button when provided" },
        { prop: "onClose",   type: "() => void",          def: "undefined", desc: "Shows × button when provided" },
        { prop: "style",     type: "React.CSSProperties", def: "undefined", desc: "Extra inline styles on the container" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// GloryItems tab
// ---------------------------------------------------------------------------
function GloryItemsTab() {
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/GloryItems.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 3450:9507</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Decorative pill with pink gradient border and sparkle star icon — button (larger) and chip (smaller) variants</p>

      <Section title="Variants">
        <Row label="button — larger pill (3px border, px-16 py-8)">
          <GloryItem type="button" label="Glory feature" />
          <GloryItem type="button" label="New" />
          <GloryItem type="button" label="AI powered" />
        </Row>
        <Row label="chip — smaller pill (2px border, px-8 py-2)">
          <GloryItem type="chip" label="New" />
          <GloryItem type="chip" label="Beta" />
          <GloryItem type="chip" label="Preview" />
        </Row>
      </Section>

      <PropsTable rows={[
        { prop: "type",   type: '"button" | "chip"',  def: '"button"', desc: "button = larger pill with 3px border; chip = smaller pill with 2px border" },
        { prop: "label",  type: "string",              def: '"Glory"',  desc: "Text label displayed next to the sparkle star icon" },
        { prop: "onClick",type: "() => void",           def: "undefined",desc: "Makes the pill interactive with pointer cursor" },
        { prop: "style",  type: "React.CSSProperties", def: "undefined",desc: "Extra inline styles on the outer container" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal tab (ModalHeader + ModalFooter)
// ---------------------------------------------------------------------------
function ModalTab() {
  const [backBtn,  setBackBtn]  = useState(false);
  const [mainBtn,  setMainBtn]  = useState<"1"|"2">("1");
  const [withBadge,setWithBadge]= useState(false);
  const [withBody, setWithBody] = useState(true);

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ModalHeader.tsx · components/ui/ModalFooter.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 2103:2361 · 2205:556</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Modal shell components — header with title/badge/description + footer with Back/Cancel/Submit buttons</p>

      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", fontWeight: "600" }}>ModalHeader options</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <PillToggle active={withBadge} label="withBadge" onClick={() => setWithBadge(!withBadge)} />
                <PillToggle active={withBody}  label="withBodyText" onClick={() => setWithBody(!withBody)} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", fontWeight: "600" }}>ModalFooter options</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <PillToggle active={backBtn}   label="backBtn" onClick={() => setBackBtn(!backBtn)} />
                <Pill val="1" cur={mainBtn} onClick={() => setMainBtn("1")} />
                <Pill val="2" cur={mainBtn} onClick={() => setMainBtn("2")} />
              </div>
            </div>
          </div>
          {/* Preview */}
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", width: "512px", maxWidth: "100%" }}>
              <ModalHeader
                title="Create serial numbers"
                bodyText={withBody ? "Configure the serial number format and quantity for this batch." : undefined}
                withBadge={withBadge}
                badgeLabel="New"
                onClose={() => {}}
              />
              <div style={{ padding: "24px", background: tokens.color.bg.lightBg, minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "13px", color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans, margin: 0 }}>Modal body content</p>
              </div>
              <ModalFooter backBtn={backBtn} mainBtn={mainBtn} submitLabel="Create" onBack={() => {}} onCancel={() => {}} onSubmit={() => {}} />
            </div>
          </div>
        </div>
      </div>

      <Section title="ModalHeader variants">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { withBadge: false, bodyText: undefined,       label: "Title only" },
            { withBadge: false, bodyText: "Configure the serial number format and quantity for this batch.", label: "Title + body text" },
            { withBadge: true,  bodyText: "Configure the serial number format and quantity for this batch.", label: "Badge + title + body text (centred)" },
          ].map(({ withBadge: wb, bodyText: bt, label: lbl }) => (
            <div key={lbl}>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "4px" }}>{lbl}</p>
              <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", width: "512px" }}>
                <ModalHeader title="Create serial numbers" bodyText={bt} withBadge={wb} badgeLabel="New" onClose={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ModalFooter variants">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { backBtn: false, mainBtn: "1" as const, label: "No back · primary only" },
            { backBtn: true,  mainBtn: "1" as const, label: "Back · primary only" },
            { backBtn: false, mainBtn: "2" as const, label: "No back · Cancel + primary" },
            { backBtn: true,  mainBtn: "2" as const, label: "Back · Cancel + primary" },
          ].map(({ backBtn: bb, mainBtn: mb, label: lbl }) => (
            <div key={lbl}>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "4px" }}>{lbl}</p>
              <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
                <ModalFooter backBtn={bb} mainBtn={mb} submitLabel="Create" onBack={() => {}} onCancel={() => {}} onSubmit={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "title",       type: "string",              def: "required",   desc: "(ModalHeader) Heading text" },
        { prop: "bodyText",    type: "string",              def: "undefined",  desc: "(ModalHeader) Description text below the title" },
        { prop: "withBadge",   type: "boolean",             def: "false",      desc: "(ModalHeader) Shows GloryItem chip above title and centres content" },
        { prop: "badgeLabel",  type: "string",              def: '"New"',      desc: "(ModalHeader) Label for the badge chip (withBadge only)" },
        { prop: "onClose",     type: "() => void",          def: "undefined",  desc: "(ModalHeader) Shows × close button when provided" },
        { prop: "backBtn",       type: "boolean",   def: "false",    desc: "(ModalFooter) Shows a Back ghost link on the left" },
        { prop: "mainBtn",       type: '"1" | "2"', def: '"1"',      desc: "(ModalFooter) 1 = primary button only; 2 = Cancel + primary" },
        { prop: "submitLabel",   type: "string",    def: '"Submit"', desc: "(ModalFooter) Label for the primary action button" },
        { prop: "cancelLabel",   type: "string",    def: '"Cancel"', desc: "(ModalFooter) Label for the cancel button (mainBtn=2 only)" },
        { prop: "submitDisabled",type: "boolean",   def: "false",    desc: "(ModalFooter) Disables the submit button" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ActionCard tab
// ---------------------------------------------------------------------------
function ActionCardTab() {
  const [action,      setAction]      = useState<"icon btn"|"text btn">("icon btn");
  const [leadingIcon, setLeadingIcon] = useState<"none"|"icon"|"product">("none");
  const [lines,       setLines]       = useState<"1"|"2">("2");
  const [cardState,   setCardState]   = useState<"Default"|"Hover"|"Focus"|"Selected"|"Disable">("Default");

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ActionCard.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 3263:2039</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Actionable card with 5 interactive states · 2 action types · 3 leading icon variants · 1–2 text lines</p>

      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", fontWeight: "600" }}>action</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <Pill val="icon btn"  cur={action} onClick={() => setAction("icon btn")} />
                <Pill val="text btn"  cur={action} onClick={() => setAction("text btn")} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", fontWeight: "600" }}>leadingIcon</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <Pill val="none"    cur={leadingIcon} onClick={() => setLeadingIcon("none")} />
                <Pill val="icon"    cur={leadingIcon} onClick={() => setLeadingIcon("icon")} />
                <Pill val="product" cur={leadingIcon} onClick={() => setLeadingIcon("product")} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", fontWeight: "600" }}>lines</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <Pill val="1" cur={lines} onClick={() => setLines("1")} />
                <Pill val="2" cur={lines} onClick={() => setLines("2")} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", fontWeight: "600" }}>state</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(["Default","Hover","Focus","Selected","Disable"] as const).map(s => (
                  <Pill key={s} val={s} cur={cardState} onClick={() => setCardState(s)} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Preview</p>
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ActionCard
                label="Rope — 11mm × 50m"
                description="Batch #2024-001 · 12 cut ropes"
                action={action}
                leadingIcon={leadingIcon}
                lines={lines}
                state={cardState}
                actionLabel="Select"
              />
            </div>
          </div>
        </div>
      </div>

      <Section title="All 5 States — icon btn, no leading, 2 lines">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(["Default","Hover","Focus","Selected","Disable"] as const).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ width: "64px", fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, flexShrink: 0 }}>{s}</span>
              <ActionCard label="Rope — 11mm × 50m" description="Batch #2024-001 · 12 cut ropes" state={s} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Leading icon variants">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ width: "64px", fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, flexShrink: 0 }}>none</span>
            <ActionCard label="Rope — 11mm × 50m" description="Batch #2024-001" leadingIcon="none" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ width: "64px", fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, flexShrink: 0 }}>icon</span>
            <ActionCard label="Rope — 11mm × 50m" description="Batch #2024-001" leadingIcon="icon" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ width: "64px", fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, flexShrink: 0 }}>product</span>
            <ActionCard label="Rope — 11mm × 50m" description="Batch #2024-001" leadingIcon="product" />
          </div>
        </div>
      </Section>

      <Section title="Action types">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ width: "72px", fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, flexShrink: 0 }}>icon btn</span>
            <ActionCard label="Rope — 11mm × 50m" description="Batch #2024-001" action="icon btn" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ width: "72px", fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, flexShrink: 0 }}>text btn</span>
            <ActionCard label="Rope — 11mm × 50m" description="Batch #2024-001" action="text btn" actionLabel="Select" />
          </div>
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "label",           type: "string",                                              def: "required",    desc: "Primary text label" },
        { prop: "description",     type: "string",                                              def: "undefined",   desc: "Secondary text — only shown when lines=2" },
        { prop: "action",          type: '"icon btn" | "text btn"',                             def: '"icon btn"',  desc: "icon btn = arrow-right icon; text btn = outlined button on the right" },
        { prop: "leadingIcon",     type: '"none" | "icon" | "product"',                         def: '"none"',      desc: "Leading content: none / deco icon area / product image" },
        { prop: "lines",           type: '"1" | "2"',                                           def: '"2"',         desc: "1 = label only; 2 = label + description" },
        { prop: "state",           type: '"Default"|"Hover"|"Focus"|"Selected"|"Disable"',      def: "undefined",   desc: "Controlled state override (for demos). Omit for mouse-driven state." },
        { prop: "selected",        type: "boolean",                                             def: "false",       desc: "Applies Selected state (2px indigo border)" },
        { prop: "disabled",        type: "boolean",                                             def: "false",       desc: "Disables interaction and dims the card" },
        { prop: "actionLabel",     type: "string",                                              def: '"View"',      desc: "Label for the text button (action=text btn only)" },
        { prop: "onClick",         type: "() => void",                                          def: "undefined",   desc: "Called when the card body is clicked" },
        { prop: "onActionClick",   type: "(e: MouseEvent) => void",                             def: "undefined",   desc: "Called when the action button is clicked (propagation stopped)" },
        { prop: "productImageSrc", type: "string",              def: "undefined",  desc: "Image URL for leading product image (56×56, white bg, gray-200 border)" },
        { prop: "decoIconTone",   type: "DecoIcon40Tone",    def: '"info"',     desc: "Tone for the 40px design system DecoIcon (leadingIcon=icon only)" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ProductImg tab
// ---------------------------------------------------------------------------
function ProductImgTab() {
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ProductImg.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 161:4904 · 2319:1509 · 188:1642 · 2237:524 · 188:1653 · 2127:1676</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Product image placeholder — 6 sizes · camera icon (node 152:824) · "NO IMAGE" label on ≥80px · fills with image when provided
      </p>

      <Section title="Placeholder — all sizes">
        <Row label="40px · radius-md · camera only">
          <ProductImg size={40} />
        </Row>
        <Row label="56px · radius-md · camera only">
          <ProductImg size={56} />
        </Row>
        <Row label="64px · radius-md · camera only">
          <ProductImg size={64} />
        </Row>
        <Row label="80px · radius-lg · camera + NO IMAGE">
          <ProductImg size={80} />
        </Row>
        <Row label="120px · radius-lg · camera + NO IMAGE">
          <ProductImg size={120} />
        </Row>
        <Row label="224px · radius-2xl · camera + NO IMAGE">
          <ProductImg size={224} />
        </Row>
      </Section>

      <Section title="With image">
        <Row label="All sizes — objectFit cover, fills edge-to-edge">
          <ProductImg size={40}  image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Product" />
          <ProductImg size={56}  image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Product" />
          <ProductImg size={64}  image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Product" />
          <ProductImg size={80}  image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Product" />
          <ProductImg size={120} image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Product" />
          <ProductImg size={224} image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Product" />
        </Row>
      </Section>

      <Section title="Camera icon (node 152:824)">
        <Row label="24px · standalone export · CameraIcon color prop">
          <span style={{ display: "flex", alignItems: "center", gap: tokens.spacing[3] }}>
            <CameraIcon color={tokens.color.fg.disabled} />
            <CameraIcon color={tokens.color.fg.primary} />
            <CameraIcon color={tokens.color.fg.support} />
            <CameraIcon color={tokens.color.fg.blue} />
          </span>
        </Row>
      </Section>

      <PropsTable rows={[
        { prop: "size",    type: "40 | 56 | 64 | 80 | 120 | 224", def: "40",       desc: "Container size in px — maps directly to Figma variants. ≥80px shows camera + NO IMAGE label" },
        { prop: "image",   type: "string",                          def: "—",        desc: "When provided, renders the image filling the container edge-to-edge (objectFit: cover)" },
        { prop: "alt",     type: "string",                          def: '""',       desc: "Alt text for the image" },
        { prop: "style",   type: "React.CSSProperties",             def: "—",        desc: "Extra inline styles merged onto the container" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumb tab
// ---------------------------------------------------------------------------
function BreadcrumbTab() {
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Breadcrumb.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 5467:20002</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Navigation trail — last item Medium fg.primary, parents Regular fg.support, "/" separator</p>

      <Section title="Variants">
        <Row label="Single item">
          <Breadcrumb items={[{ label: "Dashboard" }]} />
        </Row>
        <Row label="Two levels">
          <Breadcrumb items={[{ label: "Dashboard", href: "#" }, { label: "Serials" }]} />
        </Row>
        <Row label="Three levels">
          <Breadcrumb items={[{ label: "Dashboard", href: "#" }, { label: "Inventory", href: "#" }, { label: "Create Serials" }]} />
        </Row>
        <Row label="Four levels">
          <Breadcrumb items={[{ label: "Dashboard", href: "#" }, { label: "Inventory", href: "#" }, { label: "Products", href: "#" }, { label: "Ultra O Locksafe" }]} />
        </Row>
      </Section>

      <PropsTable rows={[
        { prop: "items", type: "BreadcrumbItem[]", def: "—", desc: "Ordered list of breadcrumb segments. Last item is always the current page (no href needed)." },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// AppBar tab
// ---------------------------------------------------------------------------
function AppBarTab() {
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/AppBar.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Top navigation bar — 64px, white bg, breadcrumb left, controls right</p>

      <Section title="Default">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
          <AppBar breadcrumbs={[{ label: "Dashboard", href: "#" }, { label: "Inventory" }]} language="EN" userInitials="KZ" notificationCount={3} />
        </div>
      </Section>
      <Section title="With Book a Demo">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
          <AppBar breadcrumbs={[{ label: "Dashboard" }]} showBookADemo language="EN" userInitials="KZ" />
        </div>
      </Section>
      <Section title="No notifications">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
          <AppBar breadcrumbs={[{ label: "Dashboard", href: "#" }, { label: "Reports", href: "#" }, { label: "Monthly" }]} language="FR" userInitials="AB" notificationCount={0} />
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "breadcrumbs",         type: "BreadcrumbItem[]", def: "—",      desc: "Breadcrumb trail shown on the left" },
        { prop: "showBookADemo",        type: "boolean",          def: "false",  desc: "Shows a lime primary 'Book a Demo' button" },
        { prop: "language",             type: "string",           def: '"EN"',   desc: "Language code shown in the selector" },
        { prop: "userInitials",         type: "string",           def: "—",      desc: "Two-letter initials for the avatar pill" },
        { prop: "notificationCount",    type: "number",           def: "—",      desc: "Badge count on bell icon — hidden when 0" },
        { prop: "onNotificationsClick", type: "() => void",       def: "—",      desc: "Bell click handler" },
        { prop: "onLanguageClick",      type: "() => void",       def: "—",      desc: "Language selector click handler" },
        { prop: "onAvatarClick",        type: "() => void",       def: "—",      desc: "Avatar click handler" },
        { prop: "onBookADemoClick",     type: "() => void",       def: "—",      desc: "Book a Demo click handler" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// DashboardStatCard tab
// ---------------------------------------------------------------------------
function DashboardStatCardTab() {
  // Icons filled with brand.darkPurple — rendered on lime (#ccff00) background
  const StatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="13" width="4" height="8" rx="1" fill={tokens.color.brand.darkPurple} />
      <rect x="10" y="9" width="4" height="12" rx="1" fill={tokens.color.brand.darkPurple} />
      <rect x="17" y="4" width="4" height="17" rx="1" fill={tokens.color.brand.darkPurple} />
    </svg>
  );
  const BoxIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3L21 7.5V16.5L12 21L3 16.5V7.5L12 3Z" stroke={tokens.color.brand.darkPurple} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 7.5L12 12L21 7.5M12 12V21" stroke={tokens.color.brand.darkPurple} strokeWidth="1.5" />
    </svg>
  );
  const TagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2L20 10L12 22L4 10L12 2Z" stroke={tokens.color.brand.darkPurple} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2" fill={tokens.color.brand.darkPurple} />
    </svg>
  );

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/DashboardStatCard.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 3343:25930 · bg brand.darkPurple · icon fill darkPurple on lime</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Dark KPI strip — brand.darkPurple bg · lime icon box · darkPurple icons · 16px radius · gray-700 dividers</p>

      <Section title="Single card">
        <Row label="With action link">
          <DashboardStatCard icon={<StatIcon />} label="Total Serials" count="12,450" actionLabel="View Inventory" actionHref="#" />
        </Row>
        <Row label="Without action">
          <DashboardStatCard icon={<BoxIcon />} label="Active Products" count="38" />
        </Row>
      </Section>

      <Section title="Strip — horizontal row of cards">
        <DashboardStatStrip cards={[
          { icon: <StatIcon />, label: "Total Serials",    count: "12,450", actionLabel: "View all",  actionHref: "#" },
          { icon: <BoxIcon />,  label: "Active Products",  count: "38" },
          { icon: <TagIcon />,  label: "Pending Captures", count: "5",      actionLabel: "Review",    actionHref: "#" },
        ]} />
      </Section>

      <PropsTable rows={[
        { prop: "iconUrl",       type: "string",     def: "—",  desc: "Figma icon URL from useFigmaIcons — rendered via CSS mask at brand.darkPurple (preferred)" },
        { prop: "icon",          type: "ReactNode",  def: "—",  desc: "Fallback icon node — color your SVG with tokens.color.brand.darkPurple" },
        { prop: "label",         type: "string",     def: "—",  desc: "Metric label — 14px SemiBold white" },
        { prop: "count",         type: "string | number", def: "—", desc: "Metric value — 18px Medium white" },
        { prop: "actionLabel",   type: "string",     def: "—",  desc: "Link text — shown only when provided" },
        { prop: "actionHref",    type: "string",     def: "—",  desc: "Link href — use with actionLabel" },
        { prop: "onActionClick", type: "() => void", def: "—",  desc: "Click handler — alternative to actionHref" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ListViewItem tab
// ---------------------------------------------------------------------------
function ListViewItemTab() {
  const ArrowBtn = () => (
    <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.frame}`, borderRadius: tokens.borderRadius.md, cursor: "pointer", flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ListViewItem.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Product row — 56px image, title, subtitle, optional serial ref, chip, and trailing action</p>

      <Section title="Variants">
        <Row label="Title + subtitle only">
          <div style={{ width: "400px", border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
            <ListViewItem title="Ultra O Locksafe" subtitle="DMM · A327MG" />
          </div>
        </Row>
        <Row label="With serial ref">
          <div style={{ width: "400px", border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
            <ListViewItem title="Ultra O Locksafe" subtitle="DMM · A327MG" serialRef="#132241154A" />
          </div>
        </Row>
        <Row label="With chip + action">
          <div style={{ width: "400px", border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
            <ListViewItem title="Ultra O Locksafe" subtitle="DMM · A327MG" chip={{ label: "Active", color: "green" }} action={<ArrowBtn />} />
          </div>
        </Row>
        <Row label="Stacked list">
          <div style={{ width: "400px", border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
            <ListViewItem title="Ultra O Locksafe" subtitle="DMM · A327MG" chip={{ label: "Active", color: "green" }} action={<ArrowBtn />} />
            <ListViewItem title="Mammut Sender" subtitle="Mammut · 2310-01160" chip={{ label: "Pending", color: "yellow" }} action={<ArrowBtn />} />
            <ListViewItem title="Petzl Grigri" subtitle="Petzl · D100A001" chip={{ label: "Expired", color: "red" }} action={<ArrowBtn />} />
          </div>
        </Row>
      </Section>

      <PropsTable rows={[
        { prop: "title",     type: "string",        def: "—",         desc: "Primary label — 14px Medium fg.primary" },
        { prop: "subtitle",  type: "string",        def: "—",         desc: "Secondary line — 12px Regular fg.support" },
        { prop: "serialRef", type: "string",        def: "—",         desc: "Third line — 12px Medium fg.primary (e.g. serial number)" },
        { prop: "imageUrl",  type: "string",        def: "—",         desc: "Product image URL — shows placeholder when omitted" },
        { prop: "chip",      type: "ListViewChip",  def: "—",         desc: "Badge shown inline after the title — { label, color }" },
        { prop: "action",    type: "ReactNode",     def: "—",         desc: "Trailing element — typically an icon button" },
        { prop: "onClick",   type: "() => void",    def: "—",         desc: "Makes the whole row clickable" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTable tab
// ---------------------------------------------------------------------------
function DataTableTab() {
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<"asc"|"desc"|"none">("asc");

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const rows = [
    { name: "Ultra O Locksafe", sku: "A327MG",    brand: "DMM",    status: "Active" },
    { name: "Sender 9.9",       sku: "2310-01160", brand: "Mammut", status: "Pending" },
    { name: "Grigri+",          sku: "D100A001",   brand: "Petzl",  status: "Active" },
    { name: "Reverso 4",        sku: "D017AA00",   brand: "Petzl",  status: "Expired" },
  ];

  const columns = [
    { key: "name",   label: "Product",  sortable: true },
    { key: "brand",  label: "Brand",    sortable: true },
    { key: "sku",    label: "SKU",      sortable: false },
    { key: "status", label: "Status",   sortable: false,
      render: (v: unknown) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium, color: v === "Active" ? tokens.color.fg.green : v === "Pending" ? tokens.color.fg.amber : tokens.color.fg.disabled }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: v === "Active" ? tokens.color.fg.green : v === "Pending" ? tokens.color.fg.amber : tokens.color.fg.disabled, flexShrink: 0 }} />
          {String(v)}
        </span>
      )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/DataTable.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 161:4925</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Sortable data table — 44px header, 72px rows, custom cell renderers, sticky action column</p>

      <Section title="Sortable table">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
          <DataTable
            columns={columns}
            rows={rows}
            sortKey={sortKey}
            sortDirection={sortDir}
            onSort={handleSort}
          />
        </div>
      </Section>

      <Section title="Empty state">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
          <DataTable columns={columns} rows={[]} emptyMessage="No products found." />
        </div>
      </Section>

      <Section title="With row actions">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
          <DataTable
            columns={columns}
            rows={rows}
            renderRowActions={(row) => (
              <button style={{ background: "none", border: "none", cursor: "pointer", color: tokens.color.fg.support, fontSize: tokens.fontSize.bodySmall, fontFamily: tokens.fontFamily.sans }}>
                ···
              </button>
            )}
          />
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "columns",        type: "DataTableColumn[]",  def: "—",      desc: "Column definitions — key, label, sortable, width, render" },
        { prop: "rows",           type: "T[]",                def: "—",      desc: "Data rows — keys matched to column.key" },
        { prop: "sortKey",        type: "string",             def: "—",      desc: "Currently sorted column key" },
        { prop: "sortDirection",  type: '"asc"|"desc"|"none"',def: '"none"', desc: "Sort direction for the active column" },
        { prop: "onSort",         type: "(key: string) => void", def: "—",   desc: "Called when a sortable header is clicked" },
        { prop: "renderRowActions", type: "(row, i) => ReactNode", def: "—", desc: "Renders a trailing action cell per row" },
        { prop: "stickyActions",  type: "boolean",            def: "false",  desc: "Sticks the action column to the right edge on scroll" },
        { prop: "onRowClick",     type: "(row, i) => void",   def: "—",      desc: "Makes rows clickable with hover highlight" },
        { prop: "emptyMessage",   type: "string",             def: '"No results found."', desc: "Message shown when rows array is empty" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination tab
// ---------------------------------------------------------------------------
function PaginationTab() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(3);
  const [page3, setPage3] = useState(5);

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Pagination.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Page controls + TableFooter with result count — controlled, 1-based</p>

      <Section title="Pagination">
        <Row label="First page">
          <Pagination currentPage={page1} totalPages={10} onPageChange={setPage1} />
        </Row>
        <Row label="Middle page">
          <Pagination currentPage={page2} totalPages={10} onPageChange={setPage2} />
        </Row>
        <Row label="Last page">
          <Pagination currentPage={page3} totalPages={5} onPageChange={setPage3} />
        </Row>
      </Section>

      <Section title="TableFooter — with result count">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, overflow: "hidden" }}>
          <TableFooter currentPage={page2} totalPages={10} onPageChange={setPage2} from={21} to={30} total={98} />
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "currentPage",  type: "number",           def: "—",  desc: "Active page — 1-based" },
        { prop: "totalPages",   type: "number",           def: "—",  desc: "Total number of pages" },
        { prop: "siblingCount", type: "number",           def: "1",  desc: "Page buttons to show either side of the current page" },
        { prop: "onPageChange", type: "(page: number) => void", def: "—", desc: "Called with the new page number on click" },
        { prop: "from / to / total", type: "number",     def: "—",  desc: "TableFooter only — drives the 'Showing X to Y of Z' label" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ApplyToProduct tab
// ---------------------------------------------------------------------------
function ApplyToProductTab() {
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
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>Search, select, and quantify products — used in create-serials and capture-serials flows</p>

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

      <PropsTable rows={[
        { prop: "catalogue",        type: "CatalogueProduct[]",      def: "—",               desc: "Full searchable product list — already-selected items are filtered out" },
        { prop: "selectedProducts", type: "SelectedProductItem[]",   def: "—",               desc: "Controlled list of selected products with quantities" },
        { prop: "onProductsChange", type: "(products) => void",      def: "—",               desc: "Called whenever selection or quantity changes" },
        { prop: "defaultQuantity",  type: "number",                  def: "0",               desc: "Quantity assigned when a product is first added" },
        { prop: "quantityLabel",    type: "string",                  def: '"Quantity of serials"', desc: "Label above each quantity input" },
        { prop: "binIconUrl",       type: "string",                  def: "—",               desc: "Figma icon URL for the remove button (node 49:967)" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SearchDropdown tab
// ---------------------------------------------------------------------------
function SearchDropdownTab() {
  const FLAT_ITEMS: SearchDropdownItem[] = [
    { id: "1", title: "Ultra O Locksafe - A327",   subtitle: "DMM · A327MG"          },
    { id: "2", title: "Ultra O Locksafe (Orange)",  subtitle: "DMM · A327OR"          },
  ];

  const USED_ITEMS: SearchDropdownItem[] = [
    { id: "3", title: "11MM Kernmantle Marlow Static Rope",  subtitle: "Marlow · ZTO11/11" },
  ];

  const GLOBAL_ITEMS: SearchDropdownItem[] = [
    { id: "4", title: "11MM Kernmantle Marlow Static Rope orange...", subtitle: "Marlow · ZTO11/15" },
    { id: "5", title: "11mm Marlow Kernmantle static rope",            subtitle: "Marlow · ZTO11/12" },
    { id: "6", title: "Fixe Ranger Rope – 11mm – 200m Spool",         subtitle: "Aspiring safety · P11FRSR" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>
          components/ui/SearchDropdown.tsx
        </code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Search result dropdown — flat (count header) or sectioned (named groups). Rows rendered via ListViewItem.
      </p>

      <Section title="Flat variant — single section, no label (node 3250:19886)">
        <div style={{ width: "360px" }}>
          <SearchDropdown
            sections={[{ items: FLAT_ITEMS }]}
            onSelect={(item) => alert(`Selected: ${item.title}`)}
          />
        </div>
      </Section>

      <Section title="Sectioned variant — named section headers (node 3250:19845)">
        <div style={{ width: "360px" }}>
          <SearchDropdown
            sections={[
              { label: "Used products:",               items: USED_ITEMS   },
              { label: "Products in global database:", items: GLOBAL_ITEMS },
            ]}
            onSelect={(item) => alert(`Selected: ${item.title}`)}
          />
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "sections",  type: "SearchDropdownSection[]", def: "—", desc: "One section (no label) = flat variant; sections with labels = sectioned variant" },
        { prop: "onSelect",  type: "(item) => void",          def: "—", desc: "Called when the user clicks a row" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabs tab
// ---------------------------------------------------------------------------
function TabsTab({ svgs }: { svgs: Record<string, string> }) {
  const [activeA, setActiveA] = useState("a");
  const [activeB, setActiveB] = useState("b");
  const [activeC, setActiveC] = useState("c");
  const [activeD, setActiveD] = useState("a");
  const [activeE, setActiveE] = useState("e1");

  const iconUrl = svgs[ICON_NODE_IDS.tab_placeholder];

  // Inline SVG placeholder rendered as a ReactNode so Tabs stays framework-agnostic
  const PlaceholderIcon = (
    <img src={iconUrl} alt="" width={24} height={24}
      style={{ display: "block", filter: "brightness(0) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(60%)" }}
    />
  );
  const PlaceholderIconActive = (
    <img src={iconUrl} alt="" width={24} height={24}
      style={{ display: "block", filter: "brightness(0) invert(23%) sepia(87%) saturate(700%) hue-rotate(224deg) brightness(90%) contrast(95%)" }}
    />
  );

  const makeItems = (ids: string[], labels: string[], withIcon?: boolean, badge?: number): TabItem[] =>
    ids.map((id, i) => ({
      id,
      label: labels[i],
      ...(withIcon ? { icon: <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block" }} /> } : {}),
      ...(badge !== undefined && i === 2 ? { badge } : {}),
    }));

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Tabs.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 71:1391 · 71:1496</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Tab bar for web and mobile. Active tab: indigo label + 2px indicator. Supports icons (stacked above label), badge counts, and full-width stretch.
      </p>

      {/* Text-only */}
      <Section title="Text only">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>2 items</p>
            <Tabs
              items={[{ id: "a", label: "Product" }, { id: "b", label: "Parts" }]}
              activeId={activeA}
              onChange={setActiveA}
            />
          </div>
          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>3 items</p>
            <Tabs
              items={[{ id: "a", label: "Product" }, { id: "b", label: "Parts" }, { id: "c", label: "History" }]}
              activeId={activeB}
              onChange={setActiveB}
            />
          </div>
          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>4 items · fullWidth</p>
            <Tabs
              items={[{ id: "a", label: "Product" }, { id: "b", label: "Parts" }, { id: "c", label: "History" }, { id: "d", label: "Serials" }]}
              activeId={activeC}
              onChange={setActiveC}
              fullWidth
            />
          </div>
        </div>
      </Section>

      {/* With icons */}
      <Section title="With icons · fullWidth">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>2 items</p>
            <div style={{ width: "400px" }}>
              <Tabs
                items={[
                  { id: "a", label: "Product", icon: <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block" }} /> },
                  { id: "b", label: "Parts",   icon: <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block" }} /> },
                ]}
                activeId={activeD}
                onChange={setActiveD}
                fullWidth
              />
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>4 items · with badge</p>
            <div style={{ width: "500px" }}>
              <Tabs
                items={[
                  { id: "e1", label: "Product",  icon: <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block" }} /> },
                  { id: "e2", label: "Parts",    icon: <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block" }} /> },
                  { id: "e3", label: "History",  icon: <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block" }} />, badge: 3 },
                  { id: "e4", label: "Serials",  icon: <img src={iconUrl} alt="" width={24} height={24} style={{ display: "block" }} /> },
                ]}
                activeId={activeE}
                onChange={setActiveE}
                fullWidth
              />
            </div>
          </div>
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "items",     type: "TabItem[]",           def: "—",     desc: "Tab definitions — id, label, optional icon ReactNode, optional badge count" },
        { prop: "activeId",  type: "string",              def: "—",     desc: "id of the currently selected tab" },
        { prop: "onChange",  type: "(id: string) => void", def: "—",    desc: "Called with the new tab id when a tab is clicked" },
        { prop: "fullWidth", type: "boolean",             def: "false", desc: "Stretch tabs to fill the container width equally (flex: 1)" },
      ]} />

      <div style={{ marginTop: "24px" }}>
        <p style={{ fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "12px" }}>TabItem</p>
        <PropsTable rows={[
          { prop: "id",    type: "string",        def: "—",         desc: "Unique identifier used as the activeId value" },
          { prop: "label", type: "string",        def: "—",         desc: "Text shown on the tab" },
          { prop: "icon",  type: "ReactNode",     def: "undefined", desc: "24×24 icon rendered above the label. Omit for text-only tabs." },
          { prop: "badge", type: "number",        def: "undefined", desc: "Badge count shown top-right of the icon. Only visible when icon is set." },
        ]} />
      </div>
    </div>
  );
}

// Inline SVG — node 2508:1264 is a two-path raster composite that doesn't export via SVG API
function DocIcon16() {
  const c = tokens.color.fg.support;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip-doc16)">
        <path d="M3.5 0.5H8.88086L13.5 5.2041V14.4004C13.4999 14.7019 13.3875 14.9854 13.1963 15.1895C13.0059 15.3925 12.7544 15.5 12.5 15.5H3.5C3.24558 15.5 2.99411 15.3925 2.80371 15.1895C2.61247 14.9854 2.5001 14.7019 2.5 14.4004V1.59961L2.50488 1.48828C2.52897 1.22896 2.6362 0.989301 2.80371 0.810547C2.99411 0.607458 3.24558 0.5 3.5 0.5Z" stroke={c} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.5 0V5.5H13.5" stroke={c} strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip-doc16"><rect width="16" height="16" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

function ProductListItemTab({ svgs }: { svgs: Record<string, string> }) {
  const add24  = svgs[ICON_NODE_IDS.pli_add_24];
  const bin24  = svgs[ICON_NODE_IDS.pli_bin_24];
  const add16  = svgs[ICON_NODE_IDS.pli_add_16];
  const info16 = svgs[ICON_NODE_IDS.pli_info_16];

  const Img = (url?: string, size = 24) =>
    url
      ? <img src={url} alt="" width={size} height={size} style={{ display: "block" }} />
      : <div style={{ width: size, height: size, background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.sm, opacity: 0.4 }} />;

  const items = [
    { label: "SKU", variant: "text" as const,                     value: "SCN-0042" },
    { label: "NFC",  variant: "action" as const },
    { label: "Batch", variant: "text+buttons" as const,            value: "B-2024-09" },
    { label: "Serial", variant: "text+indicator+buttons" as const, value: "SN-00124" },
    { label: "Certificate", variant: "badge" as const,             badgeText: "cert-2024.pdf", noDivider: true },
  ];

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ProductListItem.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2334:810</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        A single row in a product detail list. Five variants: text, action, text+buttons, text+indicator+buttons, badge.
      </p>

      <Section title="All variants">
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
          {items.map((item, i) => (
            <ProductListItem
              key={item.variant}
              label={item.label}
              variant={item.variant}
              value={"value" in item ? item.value : undefined}
              badgeText={"badgeText" in item ? item.badgeText : undefined}
              noDivider={"noDivider" in item ? item.noDivider : false}
              actionIcon={Img(add16, 16)}
              addIcon={Img(add24)}
              deleteIcon={Img(bin24)}
              indicatorIcon={Img(info16, 16)}
              badgeIcon={<DocIcon16 />}
            />
          ))}
        </div>
      </Section>

      <Section title="Individual variants">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>text</p>
            <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <ProductListItem label="SKU" variant="text" value="SCN-0042" noDivider />
            </div>
          </div>

          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>action</p>
            <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <ProductListItem label="NFC" variant="action" actionIcon={Img(add16, 16)} noDivider />
            </div>
          </div>

          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>text+buttons</p>
            <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <ProductListItem label="Batch" variant="text+buttons" value="B-2024-09" addIcon={Img(add24)} deleteIcon={Img(bin24)} noDivider />
            </div>
          </div>

          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>text+indicator+buttons</p>
            <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <ProductListItem label="Serial" variant="text+indicator+buttons" value="SN-00124" indicatorIcon={Img(info16, 16)} addIcon={Img(add24)} deleteIcon={Img(bin24)} noDivider />
            </div>
          </div>

          <div>
            <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>badge</p>
            <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden" }}>
              <ProductListItem label="Certificate" variant="badge" badgeText="cert-2024.pdf" badgeIcon={<DocIcon16 />} noDivider />
            </div>
          </div>

        </div>
      </Section>

      <PropsTable rows={[
        { prop: "label",          type: "string",                                                                          def: "—",           desc: "Fixed 128px left column label" },
        { prop: "variant",        type: '"text" | "action" | "text+buttons" | "text+indicator+buttons" | "badge"',        def: "—",           desc: "Which variant to render" },
        { prop: "value",          type: "string",                                                                          def: "undefined",   desc: "Text value shown in text / text+buttons / text+indicator+buttons" },
        { prop: "actionLabel",    type: "string",                                                                          def: '"+ Add NFC"', desc: "Label for the action button (action variant)" },
        { prop: "actionIcon",     type: "ReactNode",                                                                       def: "undefined",   desc: "16px icon shown left of actionLabel" },
        { prop: "onAction",       type: "() => void",                                                                     def: "undefined",   desc: "Click handler for the action button" },
        { prop: "addIcon",        type: "ReactNode",                                                                       def: "undefined",   desc: "24px icon for the add icon-button" },
        { prop: "deleteIcon",     type: "ReactNode",                                                                       def: "undefined",   desc: "24px icon for the delete icon-button" },
        { prop: "onAdd",          type: "() => void",                                                                     def: "undefined",   desc: "Click handler for add button" },
        { prop: "onDelete",       type: "() => void",                                                                     def: "undefined",   desc: "Click handler for delete button" },
        { prop: "indicatorIcon",  type: "ReactNode",                                                                       def: "undefined",   desc: "16px info icon shown between value and buttons (text+indicator+buttons)" },
        { prop: "badgeText",      type: "string",                                                                          def: "undefined",   desc: "Text inside the badge pill (badge variant)" },
        { prop: "badgeIcon",      type: "ReactNode",                                                                       def: "undefined",   desc: "16px icon appended inside the badge pill" },
        { prop: "noDivider",      type: "boolean",                                                                         def: "false",       desc: "Suppress bottom border (last item in a list)" },
      ]} />
    </div>
  );
}

function ViewItemPageImgTab() {
  const [platform, setPlatform] = useState<ViewItemPageImgPlatform>("mobile");
  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ViewItemPageImg.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2796:7479</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Product image carousel for the item detail page. Three platform variants: mobile, desktop, empty state.
      </p>

      <Section title="Live Playground">
        <div style={{ marginBottom: "16px", display: "flex", gap: "6px" }}>
          {(["mobile", "desktop", "empty"] as ViewItemPageImgPlatform[]).map(p => (
            <Pill key={p} val={p} cur={platform} onClick={() => setPlatform(p)} />
          ))}
        </div>
        <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", maxWidth: "400px" }}>
          <ViewItemPageImg platform={platform} />
        </div>
      </Section>

      <Section title="All variants">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          {(["mobile", "desktop", "empty"] as ViewItemPageImgPlatform[]).map(p => (
            <div key={p}>
              <p style={{ fontSize: "12px", color: tokens.color.fg.disabled, fontFamily: "monospace", marginBottom: "8px" }}>{p}</p>
              <div style={{ border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, overflow: "hidden", width: "360px" }}>
                <ViewItemPageImg platform={p} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "platform",      type: '"mobile" | "desktop" | "empty"', def: "—",         desc: "Which platform variant to render" },
        { prop: "images",        type: "string[]",                        def: "undefined", desc: "Array of image URLs for the carousel; falls back to placeholder if not provided" },
        { prop: "currentIndex",  type: "number",                          def: "0",         desc: "Zero-based index of the active image" },
        { prop: "onUpload",      type: "() => void",                      def: "undefined", desc: "Upload button callback — mobile only" },
        { prop: "onAddImage",    type: "() => void",                      def: "undefined", desc: '"Add Image" button callback — empty state only' },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState tab
// ---------------------------------------------------------------------------
function EmptyStateTab() {
  const [size, setSize] = useState<"large" | "small">("large");
  const [showDesc, setShowDesc] = useState(true);
  const [showAction, setShowAction] = useState(true);

  // Placeholder icon that matches the "large" 64px sizing used in Capture Serials
  const LargePlaceholderIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="12" y="12" width="40" height="40" rx="8" stroke={tokens.color.fg.disabled} strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="32" r="8" stroke={tokens.color.fg.disabled} strokeWidth="2.5" fill="none" />
      <path d="M20 20l8 8M44 20l-8 8M20 44l8-8M44 44l-8-8" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  const SmallPlaceholderIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke={tokens.color.fg.disabled} strokeWidth="1.5" fill="none" />
      <path d="M12 8v4M12 16h.01" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  const iconEl = size === "large" ? <LargePlaceholderIcon /> : <SmallPlaceholderIcon />;

  const actionEl = showAction ? (
    <GloryItem type="chip" label="Learn More" onClick={() => {}} />
  ) : undefined;

  const codeStr = `import { EmptyState } from "@/components/ui/EmptyState";

<EmptyState
  size="${size}"
  icon={<YourIcon />}
  title="No items yet"${showDesc ? `\n  description="Add your first item to get started."` : ""}${showAction ? `\n  action={<Button variant="primary" label="Get started" />}` : ""}
/>`;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/EmptyState.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma node 2204:2632</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>2 sizes · icon container · title + optional description · optional CTA action</p>

      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Size</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["large", "small"] as const).map(s => (
                  <Pill key={s} val={s} cur={size} onClick={() => setSize(s)} />
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Options</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <PillToggle active={showDesc}   label="Description" onClick={() => setShowDesc(v => !v)} />
                <PillToggle active={showAction} label="Action CTA"  onClick={() => setShowAction(v => !v)} />
              </div>
            </div>
          </div>

          <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: size === "large" ? "280px" : "240px" }}>
              <EmptyState
                size={size}
                icon={iconEl}
                title="No items yet"
                description={showDesc ? "Add your first item to get started." : undefined}
                action={actionEl}
              />
            </div>
          </div>
        </div>
        <CodeSnippet code={codeStr} />
      </div>

      <Section title="Sizes">
        <Row label="large — 96px container, borderRadius 3xl (24px)">
          <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "32px 24px", width: "300px" }}>
            <EmptyState size="large" icon={<LargePlaceholderIcon />} title="No items yet" description="Add your first item to get started." action={<GloryItem type="chip" label="Get started" onClick={() => {}} />} />
          </div>
        </Row>
        <Row label="small — 40px container, borderRadius lg (8px)">
          <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "24px", width: "300px" }}>
            <EmptyState size="small" icon={<SmallPlaceholderIcon />} title="No results" description="Try adjusting your search." />
          </div>
        </Row>
      </Section>

      <PropsTable rows={[
        { prop: "icon",        type: "React.ReactNode", def: "—",        desc: "Icon rendered inside the grey container. Use 64px for large, 24px for small." },
        { prop: "size",        type: '"large" | "small"', def: '"large"', desc: "large = 96px container with 3xl radius. small = 40px container with lg radius." },
        { prop: "title",       type: "string",         def: "—",        desc: "Heading text — rendered at h5 (16px/500)." },
        { prop: "description", type: "string",         def: "undefined", desc: "Optional body copy — bodyR (14px/400), fg.support colour." },
        { prop: "action",      type: "React.ReactNode", def: "undefined", desc: "Optional CTA — pass a <Button>, <GloryItem type=\"chip\">, or any ReactNode." },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// StepsTab
// ---------------------------------------------------------------------------
const DEMO_STEPS = [
  { label: "Serial details" },
  { label: "Apply to products" },
  { label: "Review" },
  { label: "Confirm" },
];

function StepsTab() {
  const [currentStep, setCurrentStep] = useState(2);
  const [variant, setVariant]         = useState<StepsVariant>("labeled");

  const variants: StepsVariant[] = ["labeled", "indicators", "dots"];

  const codeStr = `import { Steps } from "@/components/ui/Steps";

<Steps
  steps={[
    { label: "Serial details" },
    { label: "Apply to products" },
    { label: "Review" },
    { label: "Confirm" },
  ]}
  currentStep={${currentStep}}
  variant="${variant}"
/>`;

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/Steps.tsx</code>
        <span style={{ fontSize: "12px", color: tokens.color.fg.disabled, marginLeft: "8px" }}>Figma nodes 1733:2164 · 5870:2479 · 1734:2142 · 1733:2254</span>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Step progress indicator · 3 variants: labeled, indicators, dots
      </p>

      {/* Live playground */}
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "20px" }}>Live Playground</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Variant</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {variants.map((v) => (
                  <Pill key={v} val={v} cur={variant} onClick={() => setVariant(v)} />
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>Current step</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {DEMO_STEPS.map((_, i) => (
                  <Pill key={i} val={String(i + 1)} cur={String(currentStep)} onClick={() => setCurrentStep(i + 1)} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "12px", fontWeight: "600", color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "12px" }}>Preview</p>
            <div style={{ padding: "16px 0", overflow: "visible" }}>
              <Steps steps={DEMO_STEPS} currentStep={currentStep} variant={variant} />
            </div>
          </div>
        </div>
        <CodeSnippet code={codeStr} />
      </div>

      {/* All variants */}
      <Section title="Variants">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {variants.map((v) => (
            <div key={v}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "16px", textTransform: "capitalize" as const }}>{v}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px 0", overflow: "visible" }}>
                {[1, 2, 3, 4].map((step) => (
                  <Steps key={step} steps={DEMO_STEPS} currentStep={step} variant={v} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <PropsTable rows={[
        { prop: "steps",       type: "StepItem[]",    def: "—",          desc: "Ordered array of step objects, each with a label string." },
        { prop: "currentStep", type: "number",        def: "—",          desc: "1-indexed active step. Steps before it are complete, after are incomplete." },
        { prop: "variant",     type: '"labeled" | "indicators" | "dots"', def: '"labeled"', desc: 'labeled = circles + labels + chevrons; indicators = circles + chevrons; dots = 10px bullet dots.' },
      ]} />
    </div>
  );
}

// ScanInputTab
// ---------------------------------------------------------------------------
function ScanInputTab() {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  const searchIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke={tokens.color.fg.disabled} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <code style={{ fontSize: "12px", fontFamily: "monospace", background: tokens.color.bg.darkBg, padding: "2px 8px", borderRadius: tokens.borderRadius.sm, color: tokens.color.fg.support }}>components/ui/ScanInput.tsx</code>
      </div>
      <p style={{ fontSize: "14px", color: tokens.color.fg.support, marginBottom: "32px", fontFamily: tokens.fontFamily.sans }}>
        Input + Scan button pre-wired. Owns the inline button, clear ×, and disabled forwarding.
      </p>

      {/* Without leading icon */}
      <Section title="No Leading Icon">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>default</p>
              <ScanInput label="Label" placeholder="Placeholder" value="" onChange={() => {}} />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>filled + clear ×</p>
              <ScanInput label="Label" placeholder="Placeholder" value={val1 || "12344433-43"} onChange={(e) => setVal1(e.target.value)} />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>error</p>
              <ScanInput label="Label" placeholder="Placeholder" value="12344433-43" onChange={() => {}} errorMessage="Invalid format" />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>disabled</p>
              <ScanInput label="Label" placeholder="Invalid inputs" value="" onChange={() => {}} disabled />
            </div>
          </div>
        </div>
      </Section>

      {/* With leading search icon */}
      <Section title="With Leading Search Icon">
        <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>search + scan — default</p>
              <ScanInput label="Label" placeholder="Placeholder" leadingIcon={searchIcon} value="" onChange={() => {}} />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>search + scan — filled + clear ×</p>
              <ScanInput label="Label" placeholder="Placeholder" leadingIcon={searchIcon} value={val2 || "327"} onChange={(e) => setVal2(e.target.value)} />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>search + scan — error</p>
              <ScanInput label="Label" placeholder="Placeholder" leadingIcon={searchIcon} value="327" onChange={() => {}} errorMessage="Invalid format" />
            </div>
            <div>
              <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>search + scan — disabled</p>
              <ScanInput label="Label" placeholder="Invalid inputs" leadingIcon={searchIcon} value="" onChange={() => {}} disabled />
            </div>
          </div>
        </div>
      </Section>

      <CodeSnippet code={`import { ScanInput } from "@/components/ui/ScanInput";

<ScanInput
  label="Serial number"
  placeholder="Scan or type..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onScan={() => setSheetOpen(true)}
/>

{/* With leading icon */}
<ScanInput
  label="Search"
  placeholder="Search by name or code..."
  leadingIcon={<SearchIcon />}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onScan={() => setSheetOpen(true)}
/>`} />

      <PropsTable rows={[
        { prop: "onScan",      type: "() => void",        def: "—",      desc: "Called when the Scan button is clicked. Wire to open a ScanSimulationSheet." },
        { prop: "value",       type: "string",            def: "—",      desc: "Controlled input value." },
        { prop: "onChange",    type: "ChangeEventHandler", def: "—",     desc: "Called on every keystroke." },
        { prop: "leadingIcon", type: "ReactNode",          def: "—",     desc: "24px icon on the left, e.g. a search icon." },
        { prop: "disabled",    type: "boolean",            def: "false", desc: "Disables both the text input and the Scan button together." },
        { prop: "...rest",     type: "InputProps",         def: "—",     desc: "All other Input props (label, placeholder, errorMessage, etc.) are forwarded." },
      ]} />
    </div>
  );
}

const COMPONENT_TABS = [
  { id: "button",          label: "Button" },
  { id: "input",           label: "Input" },
  { id: "select-input",    label: "Select Input" },
  { id: "composite-input", label: "Composite Input" },
  { id: "scan-input",      label: "Scan Input" },
  { id: "radio",           label: "Radio" },
  { id: "checkbox",       label: "Checkbox" },
  { id: "selection-card", label: "Selection Card" },
  { id: "badge",            label: "Badge" },
  { id: "badge-actionable", label: "Badge Actionable" },
  { id: "sidebar",          label: "Sidebar" },
  { id: "toast",          label: "Toast" },
  { id: "toggle",         label: "Toggle" },
  { id: "context-item",   label: "Context Menu Item" },
  { id: "alert",          label: "Alert" },
  { id: "section-header", label: "Section Header" },
  { id: "glory-items",    label: "Glory Items" },
  { id: "modal",          label: "Modal" },
  { id: "action-card",    label: "Action Card" },
  { id: "product-img",    label: "Product Image" },
  { id: "breadcrumb",     label: "Breadcrumb" },
  { id: "appbar",         label: "App Bar" },
  { id: "stat-card",      label: "Stat Card" },
  { id: "list-view-item", label: "List View Item" },
  { id: "data-table",     label: "Data Table" },
  { id: "pagination",     label: "Pagination" },
  { id: "apply-to-product",   label: "Apply to Product"  },
  { id: "search-dropdown",    label: "Search Dropdown"   },
  { id: "tabs",               label: "Tabs"              },
  { id: "product-list-item",  label: "Product List Item"  },
  { id: "view-item-img",      label: "View Item Img"      },
  { id: "empty-state",        label: "Empty State"        },
  { id: "steps",              label: "Steps"              },
];

export default function ComponentsPage() {
  const [activeTab, setActiveTab] = useState("button");
  const [svgs, setSvgs]           = useState<Record<string, string>>({});

  useEffect(() => {
    const ids = Object.values(ICON_NODE_IDS);
    fetchSvgs(ids).then(setSvgs);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: tokens.color.bg.lightBg, fontFamily: tokens.fontFamily.sans }}>

      {/* Header */}
      <div style={{ background: tokens.color.brand.darkGrey, padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", background: tokens.color.brand.lime, borderRadius: tokens.borderRadius.sm }} />
            <span style={{ fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.brand.lime, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Scannable</span>
          </div>
          <h1 style={{ fontSize: tokens.fontSize.display, fontWeight: tokens.fontWeight.medium, color: tokens.color.fgReverse.primary, lineHeight: "140%", margin: 0 }}>Components</h1>
          <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fgReverse.support, marginTop: "8px" }}>Built on design tokens · icons from Figma instances</p>
        </div>
      </div>

      {/* Top nav */}
      <div style={{ background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.frame}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "4px", overflowX: "auto" as const }}>
          {TOP_NAV.map(item => (
            <a key={item}
              href={item === "Components" ? "/styleguide/components" : item === "Patterns" ? "/styleguide/patterns" : item === "Mobile" ? "/styleguide/mobile" : `/styleguide#${item.toLowerCase().replace(" ","-")}`}
              style={{ display: "inline-block", padding: "12px 16px", fontSize: tokens.fontSize.bodySmall, fontWeight: item === "Components" ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, color: item === "Components" ? tokens.color.fg.primary : tokens.color.fg.support, textDecoration: "none", whiteSpace: "nowrap" as const, borderBottom: item === "Components" ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent" }}>
              {item}
            </a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px 64px" }}>

        {/* Component tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${tokens.color.divider.border}`, marginBottom: "32px", overflowX: "auto" as const }}>
          {COMPONENT_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 20px", fontSize: tokens.fontSize.body, fontWeight: activeTab === tab.id ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, fontFamily: tokens.fontFamily.sans, color: activeTab === tab.id ? tokens.color.fg.primary : tokens.color.fg.support, background: "transparent", border: "none", borderBottom: activeTab === tab.id ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent", cursor: "pointer", marginBottom: "-1px", whiteSpace: "nowrap" as const }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "button"          && <ButtonTab svgs={svgs} />}
        {activeTab === "input"           && <InputTab  svgs={svgs} />}
        {activeTab === "select-input"    && <SelectInputTab />}
        {activeTab === "composite-input" && <CompositeInputTab />}
        {activeTab === "radio"           && <RadioTab />}
        {activeTab === "checkbox"       && <CheckboxTab />}
        {activeTab === "selection-card" && <SelectionCardTab />}
        {activeTab === "badge"            && <BadgeTab svgs={svgs} />}
        {activeTab === "badge-actionable" && <BadgeActionableTab />}
        {activeTab === "sidebar"          && <SidebarTab />}
        {activeTab === "toast"          && <ToastTab />}
        {activeTab === "toggle"         && <ToggleTab />}
        {activeTab === "context-item"   && <ContextMenuItemTab />}
        {activeTab === "alert"          && <AlertTab />}
        {activeTab === "section-header" && <SectionHeaderTab />}
        {activeTab === "glory-items"    && <GloryItemsTab />}
        {activeTab === "modal"          && <ModalTab />}
        {activeTab === "action-card"    && <ActionCardTab />}
        {activeTab === "product-img"      && <ProductImgTab />}
        {activeTab === "breadcrumb"       && <BreadcrumbTab />}
        {activeTab === "appbar"           && <AppBarTab />}
        {activeTab === "stat-card"        && <DashboardStatCardTab />}
        {activeTab === "list-view-item"   && <ListViewItemTab />}
        {activeTab === "data-table"       && <DataTableTab />}
        {activeTab === "pagination"       && <PaginationTab />}
        {activeTab === "apply-to-product" && <ApplyToProductTab />}
        {activeTab === "search-dropdown"  && <SearchDropdownTab />}
        {activeTab === "tabs"             && <TabsTab svgs={svgs} />}
        {activeTab === "product-list-item" && <ProductListItemTab svgs={svgs} />}
        {activeTab === "view-item-img"     && <ViewItemPageImgTab />}
        {activeTab === "empty-state"       && <EmptyStateTab />}
        {activeTab === "steps"             && <StepsTab />}
        {activeTab === "scan-input"        && <ScanInputTab />}

        <div style={{ borderTop: `1px solid ${tokens.color.divider.frame}`, paddingTop: "24px", marginTop: "48px", display: "flex", justifyContent: "space-between" }}>
          <a href="/styleguide" style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textDecoration: "none" }}>← Design Tokens</a>
          <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.disabled, fontFamily: "monospace" }}>Figma · 35:1161 · 2172:2525 · 35:1151 · 35:1462 · 2448:1886</span>
        </div>
      </div>
    </div>
  );
}
