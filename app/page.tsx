"use client";
// app/page.tsx — Prototype index

import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { ActionCard } from "@/components/ui/ActionCard";

const ENTRIES = [
  {
    label:       "Web app — dashboard",
    description: "Serialisation dashboard, capture serials, create serials flows",
    href:        "/dashboard/serialisation",
  },
  {
    label:       "Mobile app — product detail page",
    description: "Product info → capture serials → success confirmation",
    href:        "/mobile/product-info",
  },
  {
    label:       "Mobile app — serialisation home",
    description: "Home dashboard with stats, open tasks, and quick actions",
    href:        "/mobile/serials-home",
  },
  {
    label:       "Mobile app — serialisation list",
    description: "Serial tasks list with filter bar, badges, and action menus",
    href:        "/mobile/serialisation",
  },
];

export default function PrototypeIndexPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight:      "100dvh",
        background:     tokens.color.bg.bg,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        tokens.spacing[8],
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: tokens.spacing[8], textAlign: "center" }}>
        <div
          style={{
            width:        "32px",
            height:       "32px",
            background:   tokens.color.brand.lime,
            borderRadius: tokens.borderRadius.sm,
            margin:       "0 auto 12px",
          }}
        />
        <h1
          style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.h4,
            fontWeight: tokens.fontWeight.semiBold,
            color:      tokens.color.fg.primary,
            margin:     0,
          }}
        >
          Scannable Prototypes
        </h1>
        <p
          style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.body,
            color:      tokens.color.fg.support,
            marginTop:  tokens.spacing[2],
            marginBottom: 0,
          }}
        >
          Select a prototype to preview
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[3] }}>
        {ENTRIES.map((entry) => (
          <ActionCard
            key={entry.href}
            label={entry.label}
            description={entry.description}
            lines="2"
            action="icon btn"
            onClick={() => router.push(entry.href)}
          />
        ))}
      </div>
    </div>
  );
}
