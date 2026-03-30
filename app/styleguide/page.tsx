"use client";

import { useState, useEffect } from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Icon data
// ---------------------------------------------------------------------------

const ICONS_24: { name: string; nodeId: string }[] = [
  { name: "add",                   nodeId: "46:2936" },
  { name: "minus",                 nodeId: "56:261" },
  { name: "close",                 nodeId: "46:2935" },
  { name: "refresh",               nodeId: "46:2937" },
  { name: "search",                nodeId: "52:1245" },
  { name: "edit",                  nodeId: "46:2934" },
  { name: "update info",           nodeId: "46:2933" },
  { name: "upload",                nodeId: "66:607" },
  { name: "download",              nodeId: "66:608" },
  { name: "import",                nodeId: "2974:11454" },
  { name: "print",                 nodeId: "46:2944" },
  { name: "print preview",         nodeId: "2098:2078" },
  { name: "preview",               nodeId: "58:221" },
  { name: "copy",                  nodeId: "149:364" },
  { name: "drag to order",         nodeId: "106:665" },
  { name: "bulk edit",             nodeId: "46:2946" },
  { name: "arrow up",              nodeId: "67:626" },
  { name: "arrow right",           nodeId: "67:627" },
  { name: "arrow down",            nodeId: "67:628" },
  { name: "arrow left",            nodeId: "67:629" },
  { name: "chevron-down",          nodeId: "46:2940" },
  { name: "chevron-right",         nodeId: "46:2941" },
  { name: "chevron-up",            nodeId: "46:2942" },
  { name: "chevron-left",          nodeId: "46:2943" },
  { name: "expand",                nodeId: "2468:771" },
  { name: "collapse",              nodeId: "2468:780" },
  { name: "selector",              nodeId: "46:2945" },
  { name: "switch vertical",       nodeId: "55:223" },
  { name: "check on",              nodeId: "46:2930" },
  { name: "confirm",               nodeId: "2197:2558" },
  { name: "error",                 nodeId: "2305:2304" },
  { name: "exclamation mark",      nodeId: "51:1203" },
  { name: "question mark",         nodeId: "46:2938" },
  { name: "information mark",      nodeId: "71:1452" },
  { name: "x-circle",              nodeId: "1307:1697" },
  { name: "minus circle",          nodeId: "2449:783" },
  { name: "menu horizontal",       nodeId: "154:1415" },
  { name: "menu-hbg",              nodeId: "113:770" },
  { name: "doc",                   nodeId: "92:758" },
  { name: "my doc",                nodeId: "92:778" },
  { name: "file",                  nodeId: "2508:760" },
  { name: "folder",                nodeId: "220:465" },
  { name: "add folder",            nodeId: "1608:856" },
  { name: "doc bar chart",         nodeId: "94:534" },
  { name: "clipboard",             nodeId: "2782:10219" },
  { name: "specs",                 nodeId: "131:1374" },
  { name: "components",            nodeId: "131:1373" },
  { name: "history",               nodeId: "131:1375" },
  { name: "user",                  nodeId: "2864:8053" },
  { name: "users",                 nodeId: "1613:107" },
  { name: "team",                  nodeId: "92:1154" },
  { name: "add user",              nodeId: "2434:971" },
  { name: "remove user",           nodeId: "2094:2004" },
  { name: "product",               nodeId: "58:222" },
  { name: "product-check",         nodeId: "3606:10279" },
  { name: "product-x",             nodeId: "1762:9428" },
  { name: "package",               nodeId: "2204:3423" },
  { name: "tag",                   nodeId: "55:224" },
  { name: "add tag",               nodeId: "1657:817" },
  { name: "serials",               nodeId: "94:553" },
  { name: "serials create",        nodeId: "94:554" },
  { name: "NFC",                   nodeId: "2115:3933" },
  { name: "NFC tag",               nodeId: "2242:2042" },
  { name: "NFC disabled",          nodeId: "2317:2586" },
  { name: "scannable wave",        nodeId: "2261:2169" },
  { name: "multi-scan",            nodeId: "92:796" },
  { name: "multi-select",          nodeId: "2458:749" },
  { name: "inspection",            nodeId: "92:1150" },
  { name: "inspection remove",     nodeId: "2663:10049" },
  { name: "map",                   nodeId: "94:537" },
  { name: "location",              nodeId: "94:862" },
  { name: "hide",                  nodeId: "2421:1300" },
  { name: "show",                  nodeId: "2421:1301" },
  { name: "notifications",         nodeId: "92:1260" },
  { name: "notification-off",      nodeId: "4428:10043" },
  { name: "settings",              nodeId: "46:2929" },
  { name: "settings-2",            nodeId: "3104:10533" },
  { name: "organisations",         nodeId: "94:535" },
  { name: "manufacturer",          nodeId: "92:2804" },
  { name: "wifi",                  nodeId: "3583:10323" },
  { name: "offline",               nodeId: "1414:2247" },
  { name: "backup",                nodeId: "1545:7123" },
  { name: "cloud alert",           nodeId: "1553:7130" },
  { name: "activity circle",       nodeId: "1307:1690" },
  { name: "code",                  nodeId: "2086:2207" },
  { name: "data",                  nodeId: "71:1584" },
  { name: "cart",                  nodeId: "3590:10561" },
  { name: "dollar",                nodeId: "3611:11302" },
  { name: "mail",                  nodeId: "4295:12981" },
  { name: "clock",                 nodeId: "4347:917" },
  { name: "trending-up",           nodeId: "4348:1043" },
  { name: "book",                  nodeId: "91:739" },
  { name: "public",                nodeId: "2102:2107" },
  { name: "lock",                  nodeId: "2102:2108" },
  { name: "link",                  nodeId: "135:813" },
  { name: "dashboard",             nodeId: "91:746" },
  { name: "calendar",              nodeId: "2150:1814" },
  { name: "archive",               nodeId: "2175:2537" },
  { name: "home",                  nodeId: "2307:2449" },
  { name: "circle back",           nodeId: "2171:2524" },
  { name: "finger print",          nodeId: "71:1451" },
  { name: "camera",                nodeId: "152:824" },
  { name: "bin",                   nodeId: "49:967" },
  { name: "group",                 nodeId: "94:861" },
  { name: "category",              nodeId: "94:539" },
  { name: "shield-check",          nodeId: "2465:740" },
  { name: "star",                  nodeId: "3246:2455" },
  { name: "star circle",           nodeId: "3246:2449" },
  { name: "gift",                  nodeId: "1029:8401" },
  { name: "replace",               nodeId: "2602:7699" },
  { name: "lightbulb",             nodeId: "2695:6943" },
  { name: "life ring",             nodeId: "2973:11331" },
  { name: "tower",                 nodeId: "92:1153" },
  { name: "kit bag",               nodeId: "92:1151" },
  { name: "vehicles",              nodeId: "92:1152" },
  { name: "rope",                  nodeId: "2119:4324" },
  { name: "carabiner",             nodeId: "2136:588" },
  { name: "log-out",               nodeId: "5051:10313" },
  { name: "calibration",           nodeId: "4737:10662" },
  { name: "add to group",          nodeId: "132:107" },
  { name: "add to inventory",      nodeId: "2307:2535" },
  { name: "remove from inventory", nodeId: "2307:2534" },
  { name: "chat",                  nodeId: "1831:9264" },
  { name: "announcement",          nodeId: "219:361" },
  { name: "slide close",           nodeId: "2298:3804" },
  { name: "slide open",            nodeId: "2298:3805" },
];

const ICONS_16: { name: string; nodeId: string }[] = [
  { name: "chevron-down",     nodeId: "144:817" },
  { name: "chevron-right",    nodeId: "144:818" },
  { name: "chevron-up",       nodeId: "144:819" },
  { name: "chevron-left",     nodeId: "144:820" },
  { name: "close",            nodeId: "147:798" },
  { name: "add",              nodeId: "2064:1089" },
  { name: "adjustments",      nodeId: "148:822" },
  { name: "question mark",    nodeId: "148:861" },
  { name: "check-circle",     nodeId: "1305:1777" },
  { name: "information",      nodeId: "148:862" },
  { name: "exclamation",      nodeId: "148:863" },
  { name: "download",         nodeId: "1424:10174" },
  { name: "loading",          nodeId: "1431:2244" },
  { name: "sku",              nodeId: "173:1156" },
  { name: "search",           nodeId: "148:1015" },
  { name: "arrow up",         nodeId: "151:1503" },
  { name: "arrow right",      nodeId: "151:1504" },
  { name: "arrow down",       nodeId: "151:1505" },
  { name: "arrow left",       nodeId: "151:1506" },
  { name: "link",             nodeId: "201:5918" },
  { name: "file",             nodeId: "233:1572" },
  { name: "category",         nodeId: "2013:2078" },
  { name: "scan",             nodeId: "2602:7666" },
  { name: "code",             nodeId: "2088:601" },
  { name: "public",           nodeId: "2103:2127" },
  { name: "lock",             nodeId: "2103:2128" },
  { name: "upload",           nodeId: "2119:4251" },
  { name: "refresh",          nodeId: "2181:1491" },
  { name: "scannable wave",   nodeId: "2261:2170" },
  { name: "hide",             nodeId: "2282:2732" },
  { name: "download pdf",     nodeId: "2298:1780" },
  { name: "bin",              nodeId: "2339:1005" },
  { name: "success",          nodeId: "2284:3120" },
  { name: "error",            nodeId: "2284:3139" },
  { name: "multi-select",     nodeId: "2344:1085" },
  { name: "show",             nodeId: "2363:1747" },
  { name: "doc",              nodeId: "2508:1264" },
  { name: "expand",           nodeId: "2529:5043" },
  { name: "folder",           nodeId: "2615:6558" },
  { name: "add folder",       nodeId: "1844:837" },
  { name: "edit",             nodeId: "2658:8248" },
  { name: "lightbulb",        nodeId: "2695:6967" },
  { name: "delete",           nodeId: "2867:8071" },
  { name: "check on",         nodeId: "1084:1740" },
  { name: "shield-check",     nodeId: "1091:8244" },
  { name: "vehicles",         nodeId: "1189:8623" },
  { name: "pin",              nodeId: "1189:8633" },
  { name: "selector",         nodeId: "1214:8253" },
  { name: "tag",              nodeId: "1609:9239" },
  { name: "phone",            nodeId: "1749:8743" },
  { name: "nfc tag",          nodeId: "3550:863" },
  { name: "phone scan",       nodeId: "3953:13529" },
  { name: "cloud alert",      nodeId: "4375:2566" },
  { name: "bell-off",         nodeId: "4422:2097" },
  { name: "bell",             nodeId: "4422:2113" },
];

const FILE_KEY = "j8hy0yzSKPyh1yRKOh4tuU";

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
// Helpers
// ---------------------------------------------------------------------------

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: "80px" }}>
      <h2 style={{ fontSize: tokens.fontSize.h2, fontWeight: tokens.fontWeight.medium, fontFamily: tokens.fontFamily.sans, color: tokens.color.fg.primary, borderBottom: `1px solid ${tokens.color.divider.frame}`, paddingBottom: "12px", marginBottom: "24px", lineHeight: "140%" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, marginTop: "4px" }}>
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Color components
// ---------------------------------------------------------------------------

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const textColor = isLight(hex) ? "#111827" : "#ffffff";
  return (
    <div>
      <div style={{ width: "100%", height: "56px", background: hex, borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.color.divider.border}`, display: "flex", alignItems: "flex-end", padding: "4px 6px" }}>
        <span style={{ fontSize: "9px", fontFamily: "monospace", color: textColor, opacity: 0.8 }}>{hex}</span>
      </div>
      <Label>{name}</Label>
    </div>
  );
}

function PaletteRow({ label, colorMap }: { label: string; colorMap: Record<string, string> }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, marginBottom: "8px" }}>{label}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: "8px" }}>
        {Object.entries(colorMap).map(([key, hex]) => (
          <ColorSwatch key={key} name={key} hex={hex} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

const typographyEntries = [
  { key: "display"    as const, label: "Display — 32px / Medium",          sample: "Scannable Design" },
  { key: "h1"         as const, label: "H1 — 28px / Medium",               sample: "Heading One" },
  { key: "h2"         as const, label: "H2 — 24px / Medium",               sample: "Heading Two" },
  { key: "h3"         as const, label: "H3 — 20px / SemiBold",             sample: "Heading Three" },
  { key: "h4"         as const, label: "H4 — 18px / Medium",               sample: "Heading Four" },
  { key: "h5"         as const, label: "H5 — 16px / SemiBold",             sample: "Heading Five" },
  { key: "bodySB"     as const, label: "Body SemiBold — 14px",             sample: "The quick brown fox jumps over the lazy dog" },
  { key: "bodyM"      as const, label: "Body Medium — 14px",               sample: "The quick brown fox jumps over the lazy dog" },
  { key: "bodyR"      as const, label: "Body Regular — 14px",              sample: "The quick brown fox jumps over the lazy dog" },
  { key: "smallBodySB" as const, label: "Small SemiBold — 12px",          sample: "The quick brown fox jumps over the lazy dog" },
  { key: "smallBodyM"  as const, label: "Small Medium — 12px",            sample: "The quick brown fox jumps over the lazy dog" },
  { key: "smallBodyR"  as const, label: "Small Regular — 12px",           sample: "The quick brown fox jumps over the lazy dog" },
  { key: "linkM"       as const, label: "Link Medium — 14px",             sample: "View details →" },
  { key: "linkSmallM"  as const, label: "Small Link Medium — 12px",       sample: "View details →" },
  { key: "linkSmallR"  as const, label: "Small Link Regular — 12px",      sample: "View details →" },
];

// ---------------------------------------------------------------------------
// Icon card
// ---------------------------------------------------------------------------

function IconCard({ name, svgUrl, size }: { name: string; svgUrl?: string; size: number }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button onClick={copy} title={`Copy "${name}"`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 6px", background: copied ? tokens.color.tint.blue : tokens.color.base.white, border: `1px solid ${copied ? tokens.color.divider.blue : tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, cursor: "pointer", transition: "all 0.15s", minWidth: 0, width: "100%" }}>
      <div style={{ width: `${size}px`, height: `${size}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {svgUrl
          ? <img src={svgUrl} alt={name} width={size} height={size} style={{ display: "block" }} />
          : <div style={{ width: `${size}px`, height: `${size}px`, background: tokens.color.bg.darkBg, borderRadius: "2px" }} />
        }
      </div>
      <span style={{ fontSize: "9px", fontFamily: tokens.fontFamily.sans, color: copied ? tokens.color.fg.blue : tokens.color.fg.support, fontWeight: copied ? tokens.fontWeight.semiBold : tokens.fontWeight.regular, textAlign: "center", wordBreak: "break-word", lineHeight: "1.3", maxWidth: "80px" }}>
        {copied ? "✓ copied" : name}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const NAV_ITEMS = ["Colors", "Typography", "Spacing", "Border Radius", "Shadows", "Icons"];

export default function StyleguidePage() {
  const [svgs24, setSvgs24] = useState<Record<string, string>>({});
  const [svgs16, setSvgs16] = useState<Record<string, string>>({});
  const [iconTab, setIconTab] = useState<"24" | "16">("24");
  const [iconQuery, setIconQuery] = useState("");
  const [iconsLoading, setIconsLoading] = useState(true);
  const [svgError, setSvgError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [r24, r16] = await Promise.all([
        fetchSvgs(ICONS_24.map(i => i.nodeId)),
        fetchSvgs(ICONS_16.map(i => i.nodeId)),
      ]);
      setSvgs24(r24);
      setSvgs16(r16);
      setSvgError(Object.keys(r24).length === 0);
      setIconsLoading(false);
    };
    load();
  }, []);

  const activeIcons = iconTab === "24" ? ICONS_24 : ICONS_16;
  const activeSvgs  = iconTab === "24" ? svgs24   : svgs16;
  const filteredIcons = iconQuery
    ? activeIcons.filter(i => i.name.toLowerCase().includes(iconQuery.toLowerCase()))
    : activeIcons;

  return (
    <div style={{ minHeight: "100vh", background: tokens.color.bg.lightBg, fontFamily: tokens.fontFamily.sans }}>

      {/* ── Header ── */}
      <div style={{ background: tokens.color.brand.darkGrey, padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", background: tokens.color.brand.lime, borderRadius: tokens.borderRadius.sm }} />
            <span style={{ fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.brand.lime, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Scannable</span>
          </div>
          <h1 style={{ fontSize: tokens.fontSize.display, fontWeight: tokens.fontWeight.medium, color: tokens.color.fgReverse.primary, lineHeight: "140%", margin: 0 }}>Design System</h1>
          <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fgReverse.support, marginTop: "8px" }}>Token reference — extracted directly from Figma</p>
        </div>
      </div>

      {/* ── Sticky nav ── */}
      <div style={{ background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.frame}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "4px", overflowX: "auto" as const }}>
          {NAV_ITEMS.map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ display: "inline-block", padding: "12px 16px", fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.support, textDecoration: "none", whiteSpace: "nowrap" as const }}>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 40px" }}>

        {/* COLORS */}
        <Section id="colors" title="Colors">
          <PaletteRow label="Foreground"       colorMap={tokens.color.fg} />
          <PaletteRow label="Foreground Reverse" colorMap={tokens.color.fgReverse} />
          <PaletteRow label="Background"       colorMap={tokens.color.bg} />
          <PaletteRow label="Brand"            colorMap={tokens.color.brand} />
          <PaletteRow label="Divider"          colorMap={tokens.color.divider} />
          <PaletteRow label="Tint"             colorMap={tokens.color.tint} />
          <PaletteRow label="Hover States"     colorMap={tokens.color.hover} />
          <PaletteRow label="Pressed States"   colorMap={tokens.color.pressed} />
          <div style={{ borderTop: `1px solid ${tokens.color.divider.border}`, margin: "28px 0 20px" }} />
          <p style={{ fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, marginBottom: "20px", fontFamily: tokens.fontFamily.sans }}>Primitive Palettes</p>
          <PaletteRow label="Gray"   colorMap={Object.fromEntries(Object.entries(tokens.color.palette.gray).map(([k,v])=>[`gray-${k}`,v]))} />
          <PaletteRow label="Indigo" colorMap={Object.fromEntries(Object.entries(tokens.color.palette.indigo).map(([k,v])=>[`indigo-${k}`,v]))} />
          <PaletteRow label="Lime"   colorMap={Object.fromEntries(Object.entries(tokens.color.palette.lime).map(([k,v])=>[`lime-${k}`,v]))} />
          <PaletteRow label="Green"  colorMap={Object.fromEntries(Object.entries(tokens.color.palette.green).map(([k,v])=>[`green-${k}`,v]))} />
          <PaletteRow label="Red"    colorMap={Object.fromEntries(Object.entries(tokens.color.palette.red).map(([k,v])=>[`red-${k}`,v]))} />
          <PaletteRow label="Amber"  colorMap={Object.fromEntries(Object.entries(tokens.color.palette.amber).map(([k,v])=>[`amber-${k}`,v]))} />
        </Section>

        {/* TYPOGRAPHY */}
        <Section id="typography" title="Typography">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "32px", padding: "16px", background: tokens.color.base.white, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.color.divider.border}` }}>
            <div><Label>Font Family</Label><p style={{ fontSize: tokens.fontSize.body, fontFamily: tokens.fontFamily.sans, color: tokens.color.fg.primary, marginTop: "4px" }}>Inter</p></div>
            <div><Label>Weights</Label><p style={{ fontSize: tokens.fontSize.body, fontFamily: tokens.fontFamily.sans, color: tokens.color.fg.primary, marginTop: "4px" }}>400 · 500 · 600</p></div>
            <div><Label>Sizes</Label><p style={{ fontSize: tokens.fontSize.body, fontFamily: tokens.fontFamily.sans, color: tokens.color.fg.primary, marginTop: "4px" }}>12 · 14 · 16 · 18 · 20 · 24 · 28 · 32px</p></div>
          </div>
          <div style={{ background: tokens.color.base.white, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.color.divider.border}`, overflow: "hidden" }}>
            {typographyEntries.map((entry, i) => (
              <div key={entry.key} style={{ display: "grid", gridTemplateColumns: "200px 1fr", alignItems: "center", gap: "24px", padding: "16px 24px", borderBottom: i < typographyEntries.length - 1 ? `1px solid ${tokens.color.divider.border}` : "none" }}>
                <div>
                  <p style={{ fontSize: "10px", fontFamily: "monospace", color: tokens.color.fg.support, margin: 0 }}>{entry.key}</p>
                  <Label>{entry.label}</Label>
                </div>
                <p style={{ ...tokens.typography[entry.key], color: tokens.color.fg.primary, margin: 0 }}>{entry.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* SPACING */}
        <Section id="spacing" title="Spacing">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {(Object.entries(tokens.spacing) as [string, string][]).map(([key, value]) => {
              const px = parseInt(value);
              return (
                <div key={key} style={{ display: "grid", gridTemplateColumns: "80px 60px 1fr", alignItems: "center", gap: "16px", padding: "6px 0" }}>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.fg.support }}>spacing[{key}]</span>
                  <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>{value}</span>
                  <div style={{ height: "6px", width: `${Math.min(px, 256)}px`, background: tokens.color.brand.lime, borderRadius: "2px" }} />
                </div>
              );
            })}
          </div>
        </Section>

        {/* BORDER RADIUS */}
        <Section id="border-radius" title="Border Radius">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "20px" }}>
            {(Object.entries(tokens.borderRadius) as [string, string][]).map(([key, value]) => (
              <div key={key}>
                <div style={{ width: "100%", height: "72px", background: tokens.color.tint.blue, border: `2px solid ${tokens.color.divider.blue}`, borderRadius: value === "9999px" ? "36px" : value }} />
                <Label>{key} — {value}</Label>
              </div>
            ))}
          </div>
        </Section>

        {/* SHADOWS */}
        <Section id="shadows" title="Shadows">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px" }}>
            {(Object.entries(tokens.shadows) as [string, string][]).map(([key, value]) => (
              <div key={key}>
                <div style={{ height: "72px", background: tokens.color.base.white, borderRadius: tokens.borderRadius.lg, boxShadow: value, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "11px", fontFamily: tokens.fontFamily.sans, color: tokens.color.fg.support }}>{key}</span>
                </div>
                <Label>{key}</Label>
              </div>
            ))}
          </div>
        </Section>

        {/* ICONS */}
        <Section id="icons" title="Icons">
          {/* Toolbar */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "4px", background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "4px" }}>
              {(["24", "16"] as const).map(size => (
                <button key={size} onClick={() => setIconTab(size)} style={{ padding: "6px 16px", fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium, fontFamily: tokens.fontFamily.sans, border: "none", cursor: "pointer", borderRadius: tokens.borderRadius.sm, background: iconTab === size ? tokens.color.base.white : "transparent", color: iconTab === size ? tokens.color.fg.primary : tokens.color.fg.support, boxShadow: iconTab === size ? tokens.shadows.sm : "none" }}>
                  {size}px
                </button>
              ))}
            </div>
            <input type="text" placeholder="Search icons…" value={iconQuery} onChange={e => setIconQuery(e.target.value)} style={{ flex: 1, padding: "8px 12px", fontSize: tokens.fontSize.body, fontFamily: tokens.fontFamily.sans, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.md, outline: "none", color: tokens.color.fg.primary, background: tokens.color.base.white }} />
            <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, whiteSpace: "nowrap" as const }}>{filteredIcons.length} icons</span>
          </div>

          {svgError && (
            <div style={{ padding: "12px 16px", background: tokens.color.tint.yellow, border: `1px solid #fcd34d`, borderRadius: tokens.borderRadius.md, marginBottom: "16px" }}>
              <p style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.amber, margin: 0, fontFamily: tokens.fontFamily.sans }}>
                ⚠️ SVG previews unavailable — add <code>FIGMA_TOKEN</code> to <code>.env.local</code> and restart. Icon names are still shown below.
              </p>
            </div>
          )}

          {iconsLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: "8px" }}>
              {Array.from({ length: 32 }).map((_, i) => <div key={i} style={{ height: "80px", background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.md, opacity: 0.4 }} />)}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: "8px" }}>
              {filteredIcons.map(icon => (
                <IconCard key={icon.nodeId} name={icon.name} svgUrl={activeSvgs[icon.nodeId]} size={iconTab === "24" ? 24 : 16} />
              ))}
            </div>
          )}

          {!iconsLoading && filteredIcons.length === 0 && (
            <p style={{ textAlign: "center", padding: "40px 0", color: tokens.color.fg.support, fontSize: tokens.fontSize.body }}>No icons matching "{iconQuery}"</p>
          )}
        </Section>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${tokens.color.divider.frame}`, paddingTop: "24px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans }}>Scannable Design System · Tokens extracted from Figma</span>
          <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.disabled, fontFamily: "monospace" }}>/styles/design-tokens.ts</span>
        </div>
      </div>
    </div>
  );
}
