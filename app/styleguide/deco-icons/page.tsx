"use client";

// app/styleguide/deco-icons/page.tsx
// Decorative icon (DecoIcons) variant browser
// Visit: localhost:3000/styleguide/deco-icons

import { useState, useEffect } from "react";
import tokens from "@/styles/design-tokens";

const FILE_KEY = "j8hy0yzSKPyh1yRKOh4tuU";

// ---------------------------------------------------------------------------
// Each DecoIcon variant maps to a specific Figma node that we export as image
// ---------------------------------------------------------------------------
const DECO_VARIANTS: { size: string; tone: string; nodeId: string }[] = [
  // 40px — full set of tones
  { size: "40", tone: "info",            nodeId: "216:871"    },
  { size: "40", tone: "info reverse",    nodeId: "216:1184"   },
  { size: "40", tone: "success",         nodeId: "2204:3387"  },
  { size: "40", tone: "success-reverse", nodeId: "2204:3397"  },
  { size: "40", tone: "error",           nodeId: "216:1193"   },
  { size: "40", tone: "error-reverse",   nodeId: "2236:2941"  },
  { size: "40", tone: "warning",         nodeId: "216:1196"   },
  { size: "40", tone: "disabled",        nodeId: "216:1199"   },
  { size: "40", tone: "brand",           nodeId: "216:1202"   },
  { size: "40", tone: "highlight",       nodeId: "220:2721"   },
  // 64px
  { size: "64", tone: "brand",           nodeId: "1098:8734"  },
  { size: "64", tone: "info",            nodeId: "4409:13196" },
  { size: "64", tone: "loading",         nodeId: "1767:2252"  },
  // 96px
  { size: "96", tone: "info",            nodeId: "2365:1748"  },
  { size: "96", tone: "success",         nodeId: "2365:1843"  },
  { size: "96", tone: "disabled",        nodeId: "2365:1826"  },
  // 136px
  { size: "136", tone: "success",        nodeId: "1732:9725"  },
  { size: "136", tone: "disabled",       nodeId: "1114:2158"  },
  { size: "136", tone: "loading",        nodeId: "1738:2243"  },
];

const SIZES = ["40", "64", "96", "136"] as const;

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------
async function fetchSvgs(nodeIds: string[]): Promise<Record<string, string>> {
  const ids = nodeIds.join(",");
  try {
    const res = await fetch(
      `/api/figma-icons?ids=${encodeURIComponent(ids)}&fileKey=${FILE_KEY}`,
    );
    if (!res.ok) return {};
    const json = await res.json();
    return json.images || {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// DecoVariantCard
// ---------------------------------------------------------------------------
// Border radius per size — matching Figma: 8px for 40/64, 2xl (16px) for 96/136
function decoRadius(size: string): string {
  return parseInt(size) >= 96
    ? tokens.borderRadius["2xl"]
    : tokens.borderRadius.lg;
}

function DecoVariantCard({
  size,
  tone,
  svgUrl,
  loading,
}: {
  size: string;
  tone: string;
  svgUrl?: string;
  loading: boolean;
}) {
  const px = parseInt(size);
  const radius = decoRadius(size);

  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            "10px",
        padding:        "16px 16px 12px",
        background:     tokens.color.base.white,
        border:         `1px solid ${tokens.color.divider.border}`,
        borderRadius:   tokens.borderRadius.lg,
      }}
    >
      {/* Icon — no extra wrapper, rendered at natural size */}
      {loading ? (
        <div
          style={{
            width:        `${px}px`,
            height:       `${px}px`,
            background:   tokens.color.bg.darkBg,
            borderRadius: radius,
            opacity:      0.4,
          }}
        />
      ) : svgUrl ? (
        <img
          src={svgUrl}
          width={px}
          height={px}
          alt={`DecoIcon ${size}px ${tone}`}
          style={{ display: "block", borderRadius: radius }}
        />
      ) : (
        <div
          style={{
            width:        `${px}px`,
            height:       `${px}px`,
            background:   tokens.color.bg.darkBg,
            borderRadius: radius,
            opacity:      0.4,
          }}
        />
      )}

      {/* Tone label */}
      <span
        style={{
          fontSize:   "11px",
          fontFamily: tokens.fontFamily.sans,
          color:      tokens.color.fg.support,
          fontWeight: tokens.fontWeight.medium,
          textAlign:  "center" as const,
        }}
      >
        {tone}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DecoIconsPage() {
  const [svgs, setSvgs]       = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [svgError, setSvgError] = useState(false);

  useEffect(() => {
    fetchSvgs(DECO_VARIANTS.map((v) => v.nodeId)).then((result) => {
      setSvgs(result);
      setSvgError(Object.keys(result).length === 0);
      setFetching(false);
    });
  }, []);

  return (
    <div
      style={{
        minHeight:  "100vh",
        background: tokens.color.bg.lightBg,
        fontFamily: tokens.fontFamily.sans,
      }}
    >
      {/* ── Header ── */}
      <div style={{ background: tokens.color.brand.darkGrey, padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width:        "32px",
                height:       "32px",
                background:   tokens.color.brand.lime,
                borderRadius: tokens.borderRadius.sm,
              }}
            />
            <span
              style={{
                fontSize:      tokens.fontSize.body,
                fontWeight:    tokens.fontWeight.semiBold,
                color:         tokens.color.brand.lime,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
              }}
            >
              Scannable
            </span>
          </div>
          <h1
            style={{
              fontSize:   tokens.fontSize.display,
              fontWeight: tokens.fontWeight.medium,
              color:      tokens.color.fgReverse.primary,
              lineHeight: "140%",
              margin:     0,
            }}
          >
            Deco Icons
          </h1>
          <p
            style={{
              fontSize:  tokens.fontSize.body,
              color:     tokens.color.fgReverse.support,
              marginTop: "8px",
            }}
          >
            Decorative icon set — {DECO_VARIANTS.length} variants across 4 sizes
          </p>
        </div>
      </div>

      {/* ── Nav ── */}
      <div
        style={{
          background:   tokens.color.base.white,
          borderBottom: `1px solid ${tokens.color.divider.frame}`,
          position:     "sticky",
          top:          0,
          zIndex:       10,
        }}
      >
        <div
          style={{
            maxWidth:   "1200px",
            margin:     "0 auto",
            padding:    "0 40px",
            display:    "flex",
            gap:        "4px",
            overflowX:  "auto" as const,
          }}
        >
          {SIZES.map((size) => (
            <a
              key={size}
              href={`#size-${size}`}
              style={{
                display:    "inline-block",
                padding:    "12px 16px",
                fontSize:   tokens.fontSize.bodySmall,
                fontWeight: tokens.fontWeight.medium,
                color:      tokens.color.fg.support,
                textDecoration: "none",
                whiteSpace: "nowrap" as const,
              }}
            >
              {size}px
            </a>
          ))}
          <a
            href="/styleguide"
            style={{
              display:    "inline-block",
              padding:    "12px 16px",
              fontSize:   tokens.fontSize.bodySmall,
              fontWeight: tokens.fontWeight.regular,
              color:      tokens.color.fg.disabled,
              textDecoration: "none",
              whiteSpace: "nowrap" as const,
              marginLeft: "auto",
            }}
          >
            ← Design System
          </a>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 40px" }}>

        {svgError && (
          <div
            style={{
              padding:      "12px 16px",
              background:   tokens.color.tint.yellow,
              border:       `1px solid #fcd34d`,
              borderRadius: tokens.borderRadius.md,
              marginBottom: "32px",
            }}
          >
            <p
              style={{
                fontSize:   tokens.fontSize.bodySmall,
                color:      tokens.color.fg.amber,
                margin:     0,
                fontFamily: tokens.fontFamily.sans,
              }}
            >
              ⚠️ SVG previews unavailable — add <code>FIGMA_TOKEN</code> to{" "}
              <code>.env.local</code> and restart.
            </p>
          </div>
        )}

        {SIZES.map((size) => {
          const variants = DECO_VARIANTS.filter((v) => v.size === size);
          return (
            <section key={size} id={`size-${size}`} style={{ marginBottom: "64px" }}>
              <h2
                style={{
                  fontSize:     tokens.fontSize.h2,
                  fontWeight:   tokens.fontWeight.medium,
                  fontFamily:   tokens.fontFamily.sans,
                  color:        tokens.color.fg.primary,
                  borderBottom: `1px solid ${tokens.color.divider.frame}`,
                  paddingBottom: "12px",
                  marginBottom: "24px",
                  lineHeight:   "140%",
                }}
              >
                {size}px
                <span
                  style={{
                    marginLeft: "12px",
                    fontSize:   tokens.fontSize.body,
                    fontWeight: tokens.fontWeight.regular,
                    color:      tokens.color.fg.support,
                  }}
                >
                  {variants.length} {variants.length === 1 ? "variant" : "variants"}
                </span>
              </h2>

              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "12px" }}>
                {variants.map((v) => (
                  <DecoVariantCard
                    key={v.nodeId}
                    size={v.size}
                    tone={v.tone}
                    svgUrl={svgs[v.nodeId]}
                    loading={fetching}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Props reference */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            style={{
              fontSize:     tokens.fontSize.h2,
              fontWeight:   tokens.fontWeight.medium,
              fontFamily:   tokens.fontFamily.sans,
              color:        tokens.color.fg.primary,
              borderBottom: `1px solid ${tokens.color.divider.frame}`,
              paddingBottom: "12px",
              marginBottom: "24px",
              lineHeight:   "140%",
            }}
          >
            Props
          </h2>
          <div
            style={{
              background:   tokens.color.base.white,
              borderRadius: tokens.borderRadius.lg,
              border:       `1px solid ${tokens.color.divider.border}`,
              overflow:     "hidden",
            }}
          >
            {[
              {
                prop:    "size",
                type:    '"40" | "64" | "96" | "136"',
                default: '"40"',
                desc:    "Overall icon size in pixels",
              },
              {
                prop:    "tone",
                type:    '"info" | "info reverse" | "success" | "success-reverse" | "error" | "error-reverse" | "warning" | "disabled" | "brand" | "highlight" | "loading"',
                default: '"info"',
                desc:    "Colour / semantic tone. Not every size supports every tone — see variants above",
              },
            ].map((row, i, arr) => (
              <div
                key={row.prop}
                style={{
                  display:      "grid",
                  gridTemplateColumns: "120px 1fr 80px 1fr",
                  gap:          "16px",
                  padding:      "14px 20px",
                  alignItems:   "start",
                  borderBottom: i < arr.length - 1
                    ? `1px solid ${tokens.color.divider.border}`
                    : "none",
                }}
              >
                <code
                  style={{
                    fontSize:   "12px",
                    fontFamily: "monospace",
                    color:      tokens.color.fg.primary,
                    fontWeight: tokens.fontWeight.semiBold,
                  }}
                >
                  {row.prop}
                </code>
                <code
                  style={{
                    fontSize:   "11px",
                    fontFamily: "monospace",
                    color:      tokens.color.fg.blue,
                    wordBreak:  "break-word" as const,
                  }}
                >
                  {row.type}
                </code>
                <code
                  style={{
                    fontSize:   "11px",
                    fontFamily: "monospace",
                    color:      tokens.color.fg.support,
                  }}
                >
                  {row.default}
                </code>
                <span
                  style={{
                    fontSize:   tokens.fontSize.bodySmall,
                    color:      tokens.color.fg.support,
                    fontFamily: tokens.fontFamily.sans,
                  }}
                >
                  {row.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div
          style={{
            borderTop:       `1px solid ${tokens.color.divider.frame}`,
            paddingTop:      "24px",
            display:         "flex",
            justifyContent:  "space-between",
          }}
        >
          <span
            style={{
              fontSize:   tokens.fontSize.bodySmall,
              color:      tokens.color.fg.disabled,
              fontFamily: tokens.fontFamily.sans,
            }}
          >
            Scannable Design System · Deco Icons
          </span>
          <a
            href="/styleguide"
            style={{
              fontSize:       tokens.fontSize.bodySmall,
              color:          tokens.color.fg.support,
              fontFamily:     tokens.fontFamily.sans,
              textDecoration: "none",
            }}
          >
            ← Back to Design System
          </a>
        </div>
      </div>
    </div>
  );
}
