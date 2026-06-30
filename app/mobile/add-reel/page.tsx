"use client";
// app/mobile/add-reel/page.tsx
// Figma: MF-serialisations nodes 263:60620, 305:14286, 263:60640

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import tokens from "@/styles/design-tokens";
import { MobileAppBar } from "@/components/ui/MobileAppBar";
import { MobileButton } from "@/components/ui/mobile/Button";
import { Input } from "@/components/ui/mobile/Input";
import { ScanInput } from "@/components/ui/mobile/InputScan";
import { InputCalendar } from "@/components/ui/mobile/InputCalendar";
import { ScanSimulationSheet } from "@/components/patterns/ScanSimulationSheet";
import { InputScanDark } from "@/components/ui/mobile/InputScanDark";
import { addReel } from "@/lib/reels-store";

// ── Mock search data ──────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  sku: string;
  image: string;
}

const SUGGESTIONS: SearchResult[] = [
  { id: "s1", name: "drenaLINE 11.8mm 500m Blue", brand: "Edelrid", sku: "EDL-11800-500-BL", image: "/drenaLINE 11.8mm 500m Blue.png" },
  { id: "s2", name: "ZENITH 9.5mm Pink 60m",      brand: "Mammut",  sku: "MAM-9500-60-PK",  image: "/ZENITH 9.5 mm Pink 60 m.jpg" },
  { id: "s3", name: "Braided Safety Blue 11mm",    brand: "Scannable", sku: "SCN-1100-150-BL", image: "/Braided Safety Blue.webp" },
];

function filterResults(query: string): SearchResult[] {
  if (!query.trim()) return SUGGESTIONS;
  const q = query.toLowerCase();
  return SUGGESTIONS.filter(r =>
    r.name.toLowerCase().includes(q) || r.brand.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
  );
}

// ── Result row ────────────────────────────────────────────────────────────────

function ResultRow({ item, onSelect }: { item: SearchResult; onSelect: () => void }) {
  const [errored, setErrored] = useState(false);

  return (
    <button
      onClick={onSelect}
      style={{
        display:     "flex",
        alignItems:  "center",
        gap:         tokens.spacing[3],
        padding:     `${tokens.spacing[3]} 0`,
        background:  "none",
        border:      "none",
        cursor:      "pointer",
        width:       "100%",
        textAlign:   "left",
        borderBottom: `1px solid ${tokens.color.divider.border}`,
      }}
    >
      <div style={{
        width:           56,
        height:          56,
        borderRadius:    "6px",
        border:          `1px solid ${tokens.color.divider.border}`,
        background:      tokens.color.base.white,
        flexShrink:      0,
        overflow:        "hidden",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
      }}>
        {!errored ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt="" onError={() => setErrored(true)} style={{ width: "48px", height: "48px", objectFit: "cover" }} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="3" stroke={tokens.color.fg.disabled} strokeWidth="1.5" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: tokens.spacing[1] }}>
        <div style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize:   "14px",
          fontWeight: 400,
          lineHeight: "20px",
          color:      tokens.color.fg.primary,
        }}>
          {item.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   "12px",
            fontWeight: 300,
            lineHeight: "16px",
            color:      tokens.color.fg.support,
            whiteSpace: "nowrap",
          }}>
            {item.brand}
          </span>
          <div style={{ width: "1px", alignSelf: "stretch", background: tokens.color.divider.frame, flexShrink: 0 }} />
          <span style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   "12px",
            fontWeight: 300,
            lineHeight: "16px",
            color:      tokens.color.fg.support,
            whiteSpace: "nowrap",
          }}>
            {item.sku}
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Scene = "search" | "detail";

export default function AddReelPage() {
  const router = useRouter();

  const [scene, setScene]               = useState<Scene>("search");
  const [query, setQuery]               = useState("");
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [scanOpen, setScanOpen]         = useState(false);
  const [scanTarget, setScanTarget]     = useState<"serial" | "batch" | null>(null);

  // Detail form state
  const [serial,  setSerial]  = useState("");
  const [batch,   setBatch]   = useState("");
  const [mfgDate, setMfgDate] = useState("");

  const results = filterResults(query);

  function handleSelectResult(item: SearchResult) {
    setSelectedItem(item);
    setScene("detail");
  }

  function handleScanField(target: "serial" | "batch") {
    setScanTarget(target);
    setScanOpen(true);
  }

  function handleScanned(value: string) {
    if (scanTarget === "serial") setSerial(value);
    if (scanTarget === "batch")  setBatch(value);
    setScanOpen(false);
    setScanTarget(null);
  }

  // ── Search scene ───────────────────────────────────────────────────────────

  if (scene === "search") {
    return (
      <div style={{
        display:        "flex",
        flexDirection:  "column",
        height:         "100dvh",
        background:     tokens.color.bg.linearBg,
        overflow:       "hidden",
        fontFamily:     tokens.fontFamily.sans,
        position:       "relative",
      }}>
        <MobileAppBar
          page="task"
          title="Add reels"
          taskNavIcon="back"
          onBack={() => router.back()}
          transparent
        />

        {/* Search label + input */}
        <div style={{
          padding:    `${tokens.spacing[3]} ${tokens.spacing[4]} ${tokens.spacing[4]}`,
          flexShrink: 0,
        }}>
          <span style={{
            display:      "block",
            fontFamily:   tokens.fontFamily.sans,
            fontSize:     "14px",
            fontWeight:   400,
            lineHeight:   "20px",
            color:        "#ffffff",
            marginBottom: tokens.spacing[2],
          }}>
            Search Item to Add
          </span>
          <InputScanDark
            value={query}
            onChange={e => setQuery(e.target.value)}
            onScan={() => { setScanTarget("serial"); setScanOpen(true); }}
          />
        </div>

        {/* White results panel */}
        <div style={{
          flex:          "1 1 0",
          background:    tokens.color.base.white,
          borderRadius:  "16px 16px 0 0",
          overflow:      "hidden",
          display:       "flex",
          flexDirection: "column",
        }}>
          {/* Panel header */}
          <div style={{
            padding:    `${tokens.spacing[6]} ${tokens.spacing[4]} ${tokens.spacing[1]}`,
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   "14px",
              fontWeight: 300,
              lineHeight: "20px",
              color:      tokens.color.fg.support,
            }}>
              {query.trim() ? "Results" : "Suggestions"}
            </span>
          </div>

          {/* Results list */}
          <div style={{
            flex:      "1 1 0",
            overflowY: "auto",
            padding:   `0 ${tokens.spacing[4]}`,
          }}>
            {results.length > 0 ? (
              results.map(item => (
                <ResultRow key={item.id} item={item} onSelect={() => handleSelectResult(item)} />
              ))
            ) : (
              <div style={{
                padding:   `${tokens.spacing[8]} 0`,
                textAlign: "center",
                color:     tokens.color.fg.support,
                fontSize:  "14px",
              }}>
                No results for "{query}"
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            borderTop:   `1px solid ${tokens.color.divider.border}`,
            padding:     tokens.spacing[4],
            flexShrink:  0,
            display:     "flex",
            flexDirection: "column",
            gap:         tokens.spacing[2],
            alignItems:  "center",
          }}>
            <span style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   "14px",
              fontWeight: 300,
              lineHeight: "20px",
              color:      tokens.color.fg.primary,
            }}>
              Or add item to your reels
            </span>
            <MobileButton
              variant="outline"
              type="button"
              label="Create Item"
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Scan sheet */}
        <ScanSimulationSheet
          open={scanOpen}
          onClose={() => { setScanOpen(false); setScanTarget(null); }}
          contained
          hint="Scan item barcode or QR code"
          onDetected={(value) => {
            setScanOpen(false);
            if (scanTarget === "serial") {
              const match = SUGGESTIONS.find(s => s.id === "s1") || SUGGESTIONS[0];
              setSelectedItem(match);
              setSerial(value);
              setScene("detail");
            }
            setScanTarget(null);
          }}
        />
      </div>
    );
  }

  // ── Detail scene ───────────────────────────────────────────────────────────

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      height:         "100dvh",
      background:     tokens.color.bg.linearBg,
      overflow:       "hidden",
      fontFamily:     tokens.fontFamily.sans,
      position:       "relative",
    }}>
      <MobileAppBar
        page="task"
        title="Add reel"
        taskNavIcon="back"
        onBack={() => setScene("search")}
        transparent
      />

      {/* White detail panel */}
      <div style={{
        flex:          "1 1 0",
        background:    tokens.color.base.white,
        borderRadius:  "16px 16px 0 0",
        overflowY:     "auto",
        display:       "flex",
        flexDirection: "column",
      }}>
        {/* Product summary — large centered layout matching Figma detail scene */}
        {selectedItem && (
          <div style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            tokens.spacing[2],
            paddingTop:     tokens.spacing[6],
            paddingBottom:  tokens.spacing[4],
            borderBottom:   `1px solid ${tokens.color.divider.border}`,
          }}>
            {/* Large product image */}
            <div style={{
              width:           "100%",
              height:          "160px",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              overflow:        "hidden",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {/* Product name */}
            <span style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color:      tokens.color.fg.primary,
              textAlign:  "center",
              padding:    `0 ${tokens.spacing[4]}`,
            }}>
              {selectedItem.name}
            </span>

            {/* Brand · SKU */}
            <span style={{
              fontFamily: tokens.fontFamily.sans,
              fontSize:   "12px",
              fontWeight: 300,
              lineHeight: "16px",
              color:      tokens.color.fg.support,
              textAlign:  "center",
            }}>
              {selectedItem.brand} · {selectedItem.sku}
            </span>
          </div>
        )}

        {/* Form fields */}
        <div style={{
          flex:          "1 1 0",
          padding:       tokens.spacing[4],
          display:       "flex",
          flexDirection: "column",
          gap:           tokens.spacing[4],
        }}>
          <ScanInput
            label="Serial Number"
            placeholder="Enter or scan serial number"
            value={serial}
            onChange={e => setSerial(e.target.value)}
            onScan={() => handleScanField("serial")}
          />
          <ScanInput
            label="Batch Number"
            placeholder="Enter or scan batch number"
            value={batch}
            onChange={e => setBatch(e.target.value)}
            onScan={() => handleScanField("batch")}
          />
          <InputCalendar
            label="Date of Manufacture"
            value={mfgDate}
            onChange={setMfgDate}
          />
        </div>

        {/* Footer */}
        <div style={{
          borderTop:     `1px solid ${tokens.color.divider.border}`,
          padding:       tokens.spacing[4],
          background:    tokens.color.base.white,
          flexShrink:    0,
        }}>
          <MobileButton
            variant="primary"
            label="Add to my reel"
            onClick={() => {
              if (selectedItem) {
                addReel({
                  id:     `reel-${Date.now()}`,
                  name:   selectedItem.name,
                  brand:  selectedItem.brand,
                  sku:    selectedItem.sku,
                  serial: serial || "—",
                  image:  selectedItem.image,
                });
              }
              router.push("/mobile/manage-reels");
            }}
          />
        </div>
      </div>

      {/* Scan sheet */}
      <ScanSimulationSheet
        open={scanOpen}
        onClose={() => { setScanOpen(false); setScanTarget(null); }}
        contained
        hint={scanTarget === "serial" ? "Scan serial number" : "Scan batch number"}
        onDetected={handleScanned}
      />
    </div>
  );
}
