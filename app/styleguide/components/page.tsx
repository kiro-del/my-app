"use client";
// app/styleguide/components/page.tsx
// Icons fetched from the actual button/input component instances in Figma
// so colors are baked correctly per variant (white for destructive, gray for disabled etc.)

import { useState, useEffect } from "react";
import { Button, ButtonType, ButtonSize, ButtonWithIcon } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import tokens from "@/styles/design-tokens";

const FILE_KEY = "j8hy0yzSKPyh1yRKOh4tuU";

// ---------------------------------------------------------------------------
// Icon node IDs — fetched from the actual button/input instances in Figma
// so the exported SVG already has the correct color per variant
// ---------------------------------------------------------------------------
const ICON_NODE_IDS = {
  // Button icons — 16px, fetched from each button variant instance
  // so color is baked: primary/secondary=dark, destructive=white, disabled=gray, tertiary=indigo
  btn_primary_add:       "59:426",     // add in primary button    — gray/900 #111827
  btn_primary_arrow:     "207:2404",   // arrow in primary button  — gray/900 #111827
  btn_secondary_add:     "153:829",    // add in secondary button  — gray/900 #111827
  btn_secondary_arrow:   "207:2413",   // arrow in secondary button — gray/900 #111827
  btn_tertiary_add:      "58:417",     // add in tertiary button   — indigo/700 #4338ca
  btn_tertiary_arrow:    "172:989",    // arrow in tertiary button — indigo/700 #4338ca
  btn_destructive_add:   "2107:1896",  // add in destructive button — white #ffffff
  btn_destructive_arrow: "2107:1904",  // arrow in destructive button — white #ffffff
  btn_disabled_add:      "2107:1912",  // add in disabled button   — gray/400 #9ca3af
  btn_disabled_arrow:    "2107:1921",  // arrow in disabled button — gray/400 #9ca3af

  // Icon-only button — 24px menu horizontal
  btn_icon_dots: "154:1415",

  // Input icons — 24px, fetched from default state input instances
  // node 52:1262 = default state with leading icon, 52:1265 = search icon inside it
  // node 1313:2937 = filled state with tailing icon, 1313:2945 = arrow inside it
  input_search:  "52:1265",    // search icon in default state input — gray/400 #9ca3af
  input_arrow:   "1313:2945",  // arrow right in tailing input — gray/900 #111827
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

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------
const TOP_NAV = ["Colors","Typography","Spacing","Border Radius","Shadows","Icons","Components"];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <p style={{ fontSize: "12px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginBottom: "10px", fontWeight: tokens.fontWeight.medium }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>{children}</div>
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

function Toggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "4px 12px", fontSize: "12px", fontFamily: tokens.fontFamily.sans, border: `1px solid ${active ? tokens.color.fg.blue : tokens.color.divider.border}`, borderRadius: "20px", background: active ? tokens.color.tint.blue : tokens.color.base.white, color: active ? tokens.color.fg.blue : tokens.color.fg.support, cursor: "pointer", fontWeight: active ? "600" : "400" }}>
      {label}
    </button>
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

  // Pick the correct pre-colored icon based on the selected variant
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

      {/* Playground */}
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
            <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, display: "flex", alignItems: "center", justifyContent: "center", height: "80px", marginBottom: "12px" }}>
              <Button variant={variant} size={size} withIcon={withIcon} icon={previewIcon} label="Button" />
            </div>
            <CodeSnippet code={codeStr} />
          </div>
        </div>
      </div>

      {/* All variants */}
      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "16px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>All Variants</p>
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
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
        <Row label="Loading">
          <Button variant="loading" />
        </Row>
        <Row label="Icon (borderless) · Default / large">
          <Button variant="icon"        icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
          <Button variant="icon" size="large" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
        </Row>
        <Row label="Icon Framed (bordered) · Default / large">
          <Button variant="icon framed"        icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
          <Button variant="icon framed" size="large" icon={<FigmaIcon svgUrl={svgs[ICON_NODE_IDS.btn_icon_dots]} size={24} alt="more" />} aria-label="More options" />
        </Row>
      </div>

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
// Input tab
// ---------------------------------------------------------------------------
function InputTab({ svgs }: { svgs: Record<string, string> }) {
  const [hasLeading, setLeading]  = useState(false);
  const [hasTailing, setTailing]  = useState(false);
  const [hasSupport, setSupport]  = useState(false);
  const [hasError,   setHasError] = useState(false);
  const [disabled,   setDisabled] = useState(false);
  const [inputSize,  setSize]     = useState<"Default"|"large">("Default");

  // Icons fetched from actual input instances — correct colors baked in
  const searchIcon = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS.input_search]} size={24} alt="search" />;
  const arrowIcon  = <FigmaIcon svgUrl={svgs[ICON_NODE_IDS.input_arrow]}  size={24} alt="arrow right" />;

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

      {/* Playground */}
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
                <Toggle active={hasLeading} label="Leading icon"  onClick={() => setLeading(!hasLeading)} />
                <Toggle active={hasTailing} label="Tailing icon"  onClick={() => setTailing(!hasTailing)} />
                <Toggle active={hasSupport} label="Support msg"   onClick={() => setSupport(!hasSupport)} />
                <Toggle active={hasError}   label="Error state"   onClick={() => setHasError(!hasError)} />
                <Toggle active={disabled}   label="Disabled"      onClick={() => setDisabled(!disabled)} />
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

      {/* All states */}
      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "16px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>All States</p>
      <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: "24px", marginBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>default</p>
            <Input label="Label" placeholder="Placeholder" />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>focus — click to trigger</p>
            <Input label="Label" placeholder="Placeholder" />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>filled</p>
            <Input label="Label" placeholder="Placeholder" defaultValue="email@address.com" />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>error</p>
            <Input label="Label" placeholder="Placeholder" defaultValue="email@address.com" errorMessage="This field has an error" />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>disabled</p>
            <Input label="Label" placeholder="Placeholder" disabled />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>support message</p>
            <Input label="Label" placeholder="Placeholder" supportMessage="Support message" showSupportIcon />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>leading icon — search (gray/400)</p>
            <Input label="Label" placeholder="Search…" leadingIcon={searchIcon} />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>tailing icon — arrow right (gray/900)</p>
            <Input label="Label" placeholder="Placeholder" tailingIcon={arrowIcon} />
          </div>
          <div>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>leading icon + error</p>
            <Input label="Label" placeholder="Placeholder" leadingIcon={searchIcon} defaultValue="bad@input" errorMessage="Invalid format" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: "monospace", marginBottom: "8px" }}>large (textarea-style)</p>
            <Input label="Label" placeholder="Write a note…" inputSize="large" />
          </div>
        </div>
      </div>

      <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px", borderBottom: `1px solid ${tokens.color.divider.border}`, paddingBottom: "8px" }}>Props</p>
      <PropsTable rows={[
        { prop: "label",           type: "string",            def: "—",             desc: "Label above the field — Inter Medium 500 14px" },
        { prop: "placeholder",     type: "string",            def: '"Placeholder"', desc: "Placeholder text in gray-400" },
        { prop: "inputSize",       type: '"Default"|"large"', def: '"Default"',     desc: "Default=40px · large=80px min-height" },
        { prop: "leadingIcon",     type: "ReactNode",         def: "—",             desc: "24px icon on the left — gray/400 color" },
        { prop: "tailingIcon",     type: "ReactNode",         def: "—",             desc: "24px icon on the right — hidden when errorMessage set" },
        { prop: "errorMessage",    type: "string",            def: "—",             desc: "Red 2px border + 16px error indicator + message" },
        { prop: "supportMessage",  type: "string",            def: "—",             desc: "Helper text in gray-500 below the input" },
        { prop: "showSupportIcon", type: "boolean",           def: "false",         desc: "Prefix support message with lightbulb icon" },
        { prop: "disabled",        type: "boolean",           def: "false",         desc: "gray-50 bg, gray-400 text, not interactive" },
      ]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------
const COMPONENT_TABS = [
  { id: "button", label: "Button" },
  { id: "input",  label: "Input" },
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
              href={item === "Components" ? "/styleguide/components" : `/styleguide#${item.toLowerCase().replace(" ","-")}`}
              style={{ display: "inline-block", padding: "12px 16px", fontSize: tokens.fontSize.bodySmall, fontWeight: item === "Components" ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, color: item === "Components" ? tokens.color.fg.primary : tokens.color.fg.support, textDecoration: "none", whiteSpace: "nowrap" as const, borderBottom: item === "Components" ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent" }}>
              {item}
            </a>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px 64px" }}>

        {/* Component tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${tokens.color.divider.border}`, marginBottom: "32px" }}>
          {COMPONENT_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "10px 20px", fontSize: tokens.fontSize.body, fontWeight: activeTab === tab.id ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, fontFamily: tokens.fontFamily.sans, color: activeTab === tab.id ? tokens.color.fg.primary : tokens.color.fg.support, background: "transparent", border: "none", borderBottom: activeTab === tab.id ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent", cursor: "pointer", marginBottom: "-1px" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "button" && <ButtonTab svgs={svgs} />}
        {activeTab === "input"  && <InputTab  svgs={svgs} />}

        <div style={{ borderTop: `1px solid ${tokens.color.divider.frame}`, paddingTop: "24px", marginTop: "48px", display: "flex", justifyContent: "space-between" }}>
          <a href="/styleguide" style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textDecoration: "none" }}>← Design Tokens</a>
          <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.disabled, fontFamily: "monospace" }}>Figma nodes 21:2928 · 51:990 · 52:1298</span>
        </div>
      </div>
    </div>
  );
}
