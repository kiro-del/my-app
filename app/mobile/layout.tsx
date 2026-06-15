// app/mobile/layout.tsx
// Wraps all mobile prototype pages — constrains to 393px on large screens,
// full-width on actual mobile devices. Shows black gutter on desktop/tablet.

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", background: "#000", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "393px", minHeight: "100dvh", overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </div>
  );
}
