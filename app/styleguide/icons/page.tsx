"use client";

// ============================================================
// app/styleguide/icons/page.tsx
// Icon browser — fetches SVGs from Figma export API
// Visit: localhost:3000/styleguide/icons
// ============================================================

import { useState, useEffect } from "react";
import tokens from "@/styles/design-tokens";

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
  const ids = nodeIds.map(id => id.replace(":", "-")).join(",");
  try {
    const res = await fetch(
      `/api/figma-icons?ids=${encodeURIComponent(ids)}&fileKey=${FILE_KEY}`
    );
    if (!res.ok) return {};
    const json = await res.json();
    return json.images || {};
  } catch {
    return {};
  }
}

function SkeletonCard() {
  return (
    <div style={{ height: "90px", background: tokens.color.bg.darkBg, borderRadius: tokens.borderRadius.lg, opacity: 0.4 }} />
  );
}

function IconCard({ name, svgUrl, size }: { name: string; svgUrl?: string; size: number }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={copy}
      title={`Click to copy: "${name}"`}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "8px", padding: "12px 8px",
        background: copied ? tokens.color.tint.blue : tokens.color.base.white,
        border: `1px solid ${copied ? tokens.color.divider.blue : tokens.color.divider.border}`,
        borderRadius: tokens.borderRadius.lg, cursor: "pointer",
        transition: "all 0.15s", minWidth: 0, width: "100%",
      }}
    >
      <div style={{ width: `${size}px`, height: `${size}px`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {svgUrl ? (
          <img src={svgUrl} alt={name} width={size} height={size} style={{ display: "block" }} />
        ) : (
          <div style={{ width: `${size}px`, height: `${size}px`, background: tokens.color.bg.darkBg, borderRadius: "2px" }} />
        )}
      </div>
      <span style={{
        fontSize: "10px", fontFamily: tokens.fontFamily.sans, lineHeight: "1.3",
        color: copied ? tokens.color.fg.blue : tokens.color.fg.support,
        fontWeight: copied ? tokens.fontWeight.semiBold : tokens.fontWeight.regular,
        textAlign: "center", wordBreak: "break-word", maxWidth: "88px",
      }}>
        {copied ? "✓ copied" : name}
      </span>
    </button>
  );
}

export default function IconsPage() {
  const [svgs24, setSvgs24] = useState<Record<string, string>>({});
  const [svgs16, setSvgs16] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"24" | "16">("24");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [r24, r16] = await Promise.all([
        fetchSvgs(ICONS_24.map(i => i.nodeId)),
        fetchSvgs(ICONS_16.map(i => i.nodeId)),
      ]);
      setSvgs24(r24);
      setSvgs16(r16);
      setApiError(Object.keys(r24).length === 0 && Object.keys(r16).length === 0);
      setLoading(false);
    };
    load();
  }, []);

  const activeIcons = activeTab === "24" ? ICONS_24 : ICONS_16;
  const activeSvgs  = activeTab === "24" ? svgs24   : svgs16;
  const filtered = query
    ? activeIcons.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : activeIcons;

  return (
    <div style={{ minHeight: "100vh", background: tokens.color.bg.lightBg, fontFamily: tokens.fontFamily.sans }}>

      {/* Header */}
      <div style={{ background: tokens.color.brand.darkGrey, padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", background: tokens.color.brand.lime, borderRadius: tokens.borderRadius.sm }} />
            <span style={{ fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.brand.lime, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Scannable</span>
          </div>
          <h1 style={{ fontSize: tokens.fontSize.display, fontWeight: tokens.fontWeight.medium, color: tokens.color.fgReverse.primary, lineHeight: "140%", margin: 0 }}>
            Icon Library
          </h1>
          <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fgReverse.support, marginTop: "8px" }}>
            {ICONS_24.length} icons at 24px · {ICONS_16.length} icons at 16px · Click to copy name
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.frame}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 40px", display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "4px", background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: "4px" }}>
            {(["24", "16"] as const).map(size => (
              <button key={size} onClick={() => setActiveTab(size)} style={{
                padding: "6px 16px", fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.medium,
                fontFamily: tokens.fontFamily.sans, border: "none", cursor: "pointer",
                borderRadius: tokens.borderRadius.sm,
                background: activeTab === size ? tokens.color.base.white : "transparent",
                color: activeTab === size ? tokens.color.fg.primary : tokens.color.fg.support,
                boxShadow: activeTab === size ? tokens.shadows.sm : "none",
              }}>
                {size}px
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search icons…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, padding: "8px 12px", fontSize: tokens.fontSize.body,
              fontFamily: tokens.fontFamily.sans, border: `1px solid ${tokens.color.divider.border}`,
              borderRadius: tokens.borderRadius.md, outline: "none", color: tokens.color.fg.primary,
              background: tokens.color.base.white,
            }}
          />
          <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, whiteSpace: "nowrap" as const }}>
            {filtered.length} icons
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px" }}>

        {apiError && (
          <div style={{ padding: "16px 20px", background: tokens.color.tint.yellow, border: `1px solid #fcd34d`, borderRadius: tokens.borderRadius.lg, marginBottom: "24px" }}>
            <p style={{ fontSize: tokens.fontSize.body, color: tokens.color.fg.amber, margin: 0, fontFamily: tokens.fontFamily.sans }}>
              ⚠️ SVGs couldn't be loaded from Figma. Icons are listed by name below — add a <code>/api/figma-icons</code> route with your Figma token to enable live previews.
            </p>
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))", gap: "8px" }}>
            {Array.from({ length: 48 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))", gap: "8px" }}>
            {filtered.map(icon => (
              <IconCard
                key={icon.nodeId}
                name={icon.name}
                svgUrl={activeSvgs[icon.nodeId.replace(":", "-")]}
                size={activeTab === "24" ? 24 : 16}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: "center", padding: "64px 0", color: tokens.color.fg.support, fontSize: tokens.fontSize.body, fontFamily: tokens.fontFamily.sans }}>
            No icons matching "{query}"
          </p>
        )}

        <div style={{ marginTop: "48px", borderTop: `1px solid ${tokens.color.divider.border}`, paddingTop: "24px" }}>
          <a href="/styleguide" style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans }}>
            ← Back to Design Tokens
          </a>
        </div>
      </div>
    </div>
  );
}
