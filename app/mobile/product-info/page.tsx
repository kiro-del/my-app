"use client";
// app/mobile/product-info/page.tsx
// Figma: Mobile App — node 3151:119379 (product/info with Options button)

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { ViewItemPageImg } from "@/components/ui/ViewItemPageImg";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { ProductListItem } from "@/components/ui/ProductListItem";
import { Button } from "@/components/ui/Button";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { ContextMenu } from "@/components/patterns/ContextMenu";
import { ContextMenuItem } from "@/components/ui/ContextMenuItem";
import { Toast } from "@/components/ui/Toast";

// ── DS icon node IDs ───────────────────────────────────────────────────────────
const FINGERPRINT_ID = "71:1447"; // DS Tab icon — finger print
const SPECS_ID       = "92:2266"; // DS Tab icon — specs / list

// ── iOS status bar ─────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{ height: "54px", display: "flex", alignItems: "flex-end", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px", flexShrink: 0 }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "white", fontFamily: tokens.fontFamily.sans, fontSize: "17px", fontWeight: 600, lineHeight: "22px" }}>
          9:41
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {/* Signal */}
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
            <rect x="0"  y="7" width="3" height="5"  rx="0.5" fill="white" fillOpacity="0.4" />
            <rect x="5"  y="4" width="3" height="8"  rx="0.5" fill="white" fillOpacity="0.6" />
            <rect x="10" y="1" width="3" height="11" rx="0.5" fill="white" fillOpacity="0.8" />
            <rect x="15" y="0" width="3" height="12" rx="0.5" fill="white" />
          </svg>
          {/* WiFi */}
          <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden>
            <path d="M1 5C3.7 2.4 7 1 8.5 1s4.8 1.4 7.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
            <path d="M3.2 7.5C5 5.5 6.7 4.5 8.5 4.5s3.5 1 5.3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
            <path d="M5.8 10C6.9 8.8 7.7 8.5 8.5 8.5s1.6.3 2.7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8.5" cy="12" r="1" fill="white" />
          </svg>
          {/* Battery */}
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
            <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="white" strokeOpacity="0.35" />
            <rect x="2"   y="2"   width="18" height="9" rx="2" fill="white" />
            <path d="M24 4v5c1-.8 1-4.2 0-5Z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Info rows ──────────────────────────────────────────────────────────────────

const INFO_ROWS = [
  { label: "Name",         value: "Ultra O Locksafe" },
  { label: "Manufacturer", value: "DMM"              },
  { label: "Part number",  value: "A327MG"           },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ProductInfoPage() {
  const [activeTab,         setActiveTab]         = useState("info");
  const [showOptions,       setShowOptions]       = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const router     = useRouter();
  const figmaIcons = useFigmaIcons([FINGERPRINT_ID, SPECS_ID]);

  // Detect ?success=serials param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "serials") {
      setShowSuccessBanner(true);
      // Clean URL without a navigation
      window.history.replaceState({}, "", window.location.pathname);
      const t = setTimeout(() => setShowSuccessBanner(false), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  // Use iconUrl so Tabs applies CSS mask for exact fg/blue / fg/support tinting
  const tabItems: TabItem[] = [
    {
      id:      "info",
      label:   "Info",
      iconUrl: figmaIcons[FINGERPRINT_ID],
      icon: !figmaIcons[FINGERPRINT_ID] ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2C8.5 2 5.5 3.9 4 6.8" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M20 6.8C18.5 3.9 15.5 2 12 2" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 7a5 5 0 0 0-5 5v1" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M17 12a5 5 0 0 0-5-5" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 15v-3a3 3 0 0 1 6 0v3" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 15v3" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M4 12v1a8 8 0 0 0 4.5 7.2" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M20 13a8 8 0 0 1-8 8" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : undefined,
    },
    {
      id:      "specs",
      label:   "Specs",
      iconUrl: figmaIcons[SPECS_ID],
      icon: !figmaIcons[SPECS_ID] ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="2" rx="1" fill="black" />
          <rect x="3" y="9" width="18" height="2" rx="1" fill="black" />
          <rect x="3" y="14" width="12" height="2" rx="1" fill="black" />
        </svg>
      ) : undefined,
    },
  ];

  return (
    <div style={{
      height:          "100dvh",
      display:         "flex",
      flexDirection:   "column",
      background:      "linear-gradient(149.26deg, #332562 11.24%, #171717 97.76%)",
      overflow:        "hidden",
      position:        "relative",
    }}>
      {/* DS MobileAppBar — task variant, transparent so gradient shows through */}
      <MobileAppBar
        page="task"
        transparent
        title="Ultra O Locksafe"
        onClose={() => router.push("/")}
      />

      {/* White content card */}
      <div style={{
        flex:                  "1 0 0",
        minHeight:             0,
        display:               "flex",
        flexDirection:         "column",
        background:            tokens.color.base.white,
        borderTopLeftRadius:   tokens.borderRadius.lg,
        borderTopRightRadius:  tokens.borderRadius.lg,
        overflow:              "hidden",
      }}>
        <ViewItemPageImg platform="mobile" />

        <Tabs items={tabItems} activeId={activeTab} onChange={setActiveTab} fullWidth />

        {/* Scrollable content */}
        <div style={{ flex: "1 0 0", minHeight: 0, overflowY: "auto" }}>
          {activeTab === "info" && (
            <>
              {INFO_ROWS.map((row, i) => (
                <ProductListItem
                  key={row.label}
                  label={row.label}
                  variant="text"
                  value={row.value}
                  noDivider={i === INFO_ROWS.length - 1}
                />
              ))}
            </>
          )}
          {activeTab === "specs" && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: tokens.spacing[8], color: tokens.color.fg.disabled, fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body }}>
              Specs coming soon
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div style={{ padding: tokens.spacing[4], borderTop: `1px solid ${tokens.color.divider.border}`, flexShrink: 0, background: tokens.color.base.white }}>
          <Button
            variant="primary"
            label="Options"
            style={{ width: "100%" }}
            onClick={() => setShowOptions(true)}
          />
        </div>
      </div>

      {/* Success toast — floats 80px above the bottom edge */}
      {showSuccessBanner && (
        <div style={{
          position: "absolute",
          bottom:   "80px",
          left:     tokens.spacing[4],
          right:    tokens.spacing[4],
          zIndex:   30,
        }}>
          <Toast
            variant="success"
            message="Serials added successfully"
          />
        </div>
      )}

      {/* Options bottom sheet */}
      <ContextMenu
        variant="bottom-sheet-mobile"
        open={showOptions}
        onClose={() => setShowOptions(false)}
        contained
      >
        <div style={{ padding: `0 ${tokens.spacing[2]} ${tokens.spacing[4]}` }}>
          <ContextMenuItem
            label="Capture serials"
            onClick={() => {
              setShowOptions(false);
              router.push("/mobile/capture-serials");
            }}
          />
          <ContextMenuItem
            label="Add to inventory"
            onClick={() => setShowOptions(false)}
          />
        </div>
      </ContextMenu>
    </div>
  );
}
