// components/ui/Breadcrumb.tsx
// Figma: Scannable Design System — node 5467:20002 (/breadcrumb)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// ---------------------------------------------------------------------------
// Breadcrumb
// Figma: all items except last → 14px Regular fg.support
//        last item             → 14px Medium  fg.primary
//        separator "/"        → 14px Regular fg.support, gap 4px between all
// ---------------------------------------------------------------------------
export function Breadcrumb({ items }: BreadcrumbProps) {
  const textBase: React.CSSProperties = {
    fontFamily:  tokens.fontFamily.sans,
    fontSize:    tokens.fontSize.body,    // 14px
    lineHeight:  tokens.lineHeight.body,  // 20px
    whiteSpace:  "nowrap" as const,
  };

  return (
    <nav aria-label="breadcrumb">
      <ol
        style={{
          display:    "flex",
          alignItems: "center",
          gap:        "4px",               // confirmed from Figma node
          margin:     0,
          padding:    0,
          listStyle:  "none",
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const labelStyle: React.CSSProperties = {
            ...textBase,
            fontWeight: isLast ? tokens.fontWeight.medium : tokens.fontWeight.regular,
            color:      isLast ? tokens.color.fg.primary  : tokens.color.fg.support,
            textDecoration: "none",
          };

          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <li aria-hidden style={{ ...textBase, fontWeight: tokens.fontWeight.regular, color: tokens.color.fg.support }}>
                  /
                </li>
              )}
              <li>
                {item.href && !isLast ? (
                  <a href={item.href} style={labelStyle}>
                    {item.label}
                  </a>
                ) : (
                  <span style={labelStyle} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
