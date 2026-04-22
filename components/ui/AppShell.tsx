// components/ui/AppShell.tsx
// Layout wrapper — AppBar (top) + Sidebar (left) + main content area.
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";
import { AppBar, AppBarProps } from "./AppBar";
import { Sidebar, SidebarProps } from "./Sidebar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AppShellProps {
  appBar:   AppBarProps;
  sidebar:  SidebarProps;
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// AppShell
// Structure:
//   ┌──────────┬─────────────────────┐
//   │          │   AppBar (64px)     │
//   │ Sidebar  ├─────────────────────┤
//   │ (284px)  │   <main> (flex 1)   │
//   │ full ht  │                     │
//   └──────────┴─────────────────────┘
// ---------------------------------------------------------------------------
export function AppShell({ appBar, sidebar, children }: AppShellProps) {
  return (
    <div
      style={{
        display:    "flex",
        flexDirection: "row",
        height:     "100vh",
        overflow:   "hidden",
        background: tokens.color.bg.lightBg,
      }}
    >
      {/* Sidebar — full viewport height */}
      <Sidebar {...sidebar} />

      {/* Right panel — AppBar on top, scrollable content below */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          flex:          1,
          overflow:      "hidden",
          minWidth:      0,
          background:    tokens.color.bg.bg,   // #f3f4f6 — matches main content
        }}
      >
        <AppBar {...appBar} />

        {/* Main content */}
        <main
          style={{
            flex:       1,
            overflowY:  "auto" as const,
            background: tokens.color.bg.bg,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
