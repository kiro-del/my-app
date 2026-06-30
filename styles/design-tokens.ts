// ============================================================
// design-tokens.ts
// Auto-generated from Figma: Scannable Design System
// Source: https://www.figma.com/design/j8hy0yzSKPyh1yRKOh4tuU
// ============================================================

// ------------------------------------------------------------
// COLORS
// ------------------------------------------------------------

export const colorFg = {
  primary: "#111827",
  support: "#6b7280",
  disabled: "#9ca3af",
  blue: "#4338ca",
  red: "#b91c1c",
  amber: "#b45309",
  green: "#166534",
} as const;

export const colorFgReverse = {
  primary: "#f9fafb",
  support: "#9ca3af",
  blue: "#a5b4fc",
  success: "#4ade80",
} as const;

export const colorBg = {
  bg: "#f5f7fa",
  lightBg: "#f9fafb",
  darkBg: "#e5e7eb",
  blue: "#6366f1",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  linearBg: "linear-gradient(149.26deg, #332562 11.24%, #171717 97.76%)",
} as const;

export const colorBrand = {
  lime: "#ccff00",
  darkGrey: "#201b30",
  darkPurple: "#2c2258",
} as const;

export const colorDivider = {
  frame: "#d1d5db",
  border: "#e5e7eb",
  reverse: "#374151",
  blue: "#6366f1",
  red: "#ef4444",
  lime: "#c1eb00",
  gradientDark: "linear-gradient(135.85deg, #ccff00 7.36%, #2e225b 49.74%, #ff4ccf 94.05%)",
  gradient: "linear-gradient(224.50deg, #ccff00 9.46%, #ad9aff 52.09%, #ff4ccf 90.84%)",
} as const;

export const colorTint = {
  blue: "#eef2ff",
  red: "#fef2f2",
  green: "#dcfce7",
  yellow: "#fffbeb",
} as const;

export const colorHover = {
  blue: "#3730a3",
  amber: "#92400e",
  green: "#14532d",
  red: "#991b1b",
  lime: "#c1eb00",
} as const;

export const colorPressed = {
  blue: "#312e81",
  red: "#7f1d1d",
  amber: "#78350f",
  green: "#14532d",
  lime: "#a3d400",
} as const;

export const colorBase = {
  white: "#ffffff",
  black: "#000000",
  overlay: "rgba(0, 0, 0, 0.5)",
} as const;

export const colorGray = {
  50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db",
  400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151",
  800: "#1f2937", 900: "#111827",
} as const;

export const colorIndigo = {
  50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc",
  400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca",
  800: "#3730a3", 900: "#312e81",
} as const;

export const colorRed = {
  50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5",
  400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c",
  800: "#991b1b", 900: "#7f1d1d",
} as const;

export const colorLime = {
  50: "#f9ffe7", 100: "#f0ffc2", 200: "#e4fe98", 300: "#d8fd69",
  400: "#cdfa3f", 500: "#ccff00", 600: "#c1eb00", 700: "#a3d400",
  800: "#84bb00", 900: "#719300",
} as const;

export const colorGreen = {
  50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac",
  400: "#4ade80", 500: "#22c55e", 600: "#16a34a", 700: "#15803d",
  800: "#166534", 900: "#14532d",
} as const;

export const colorAmber = {
  50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
  400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309",
  800: "#92400e", 900: "#78350f",
} as const;

// ------------------------------------------------------------
// TYPOGRAPHY
// ------------------------------------------------------------

export const fontFamily = {
  sans: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
} as const;

export const fontWeight = {
  regular: "300",
  medium: "400",
  semiBold: "500",
} as const;

export const fontSize = {
  display: "32px", h1: "28px", h2: "24px", h3: "20px",
  h4: "18px", h5: "16px", body: "14px", bodySmall: "12px",
} as const;

export const lineHeight = {
  loose: "140%", h3: "28px", h4: "24px", h5: "22px",
  body: "20px", bodySmall: "16px", linkSmall: "18px",
} as const;

export const typography = {
  display: { fontSize: "32px", fontWeight: "400", lineHeight: "140%", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  h1:      { fontSize: "28px", fontWeight: "400", lineHeight: "140%", letterSpacing: "0.04em", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  h2:      { fontSize: "24px", fontWeight: "400", lineHeight: "140%", letterSpacing: "0.03em", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  h3:      { fontSize: "20px", fontWeight: "400", lineHeight: "28px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  h4:      { fontSize: "18px", fontWeight: "400", lineHeight: "24px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  h5:      { fontSize: "16px", fontWeight: "400", lineHeight: "22px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  bodySB:  { fontSize: "14px", fontWeight: "500", lineHeight: "20px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  bodyM:   { fontSize: "14px", fontWeight: "400", lineHeight: "20px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  bodyR:   { fontSize: "14px", fontWeight: "300", lineHeight: "20px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  smallBodySB: { fontSize: "12px", fontWeight: "500", lineHeight: "16px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  smallBodyM:  { fontSize: "12px", fontWeight: "400", lineHeight: "16px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  smallBodyR:  { fontSize: "12px", fontWeight: "300", lineHeight: "16px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" },
  linkM:       { fontSize: "14px", fontWeight: "400", lineHeight: "20px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif", textDecoration: "underline" },
  linkSmallM:  { fontSize: "12px", fontWeight: "400", lineHeight: "18px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif", textDecoration: "underline" },
  linkSmallR:  { fontSize: "12px", fontWeight: "300", lineHeight: "18px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif", textDecoration: "underline" },
} as const;

// ------------------------------------------------------------
// SPACING (Tailwind-aligned)
// ------------------------------------------------------------

export const spacing = {
  0: "0px", 0.5: "2px", 1: "4px", 1.5: "6px", 2: "8px",
  2.5: "10px", 3: "12px", 3.5: "14px", 4: "16px", 5: "20px",
  6: "24px", 7: "28px", 8: "32px", 9: "36px", 10: "40px",
  11: "44px", 12: "48px", 14: "56px", 16: "64px", 20: "80px",
  24: "96px", 28: "112px", 32: "128px", 36: "144px", 40: "160px",
  48: "192px", 56: "224px", 64: "256px",
} as const;

// ------------------------------------------------------------
// BORDER RADIUS (from Figma Variables)
// ------------------------------------------------------------

export const borderRadius = {
  none: "0px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "999px",
} as const;

// ------------------------------------------------------------
// SHADOWS (from Figma Effect Styles)
// ------------------------------------------------------------

export const shadows = {
  sm: "0 1px 4px rgba(0,0,0,0.05)",
  md: "0 2px 4px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.06)",
  lg: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.10)",
  upSm: "0 -1px 2px rgba(0,0,0,0.05)",
  upMd: "0 -2px 4px rgba(0,0,0,0.06), 0 -4px 6px rgba(0,0,0,0.10)",
  upLg: "0 -4px 6px rgba(0,0,0,0.05), 0 -10px 15px rgba(0,0,0,0.10)",
  ringSm: "0 0 0 1px rgba(0,0,0,0.05), 0 0 2px rgba(0,0,0,0.05)",
  ringMd: "0 0 0 1px rgba(0,0,0,0.05), 0 0 4px rgba(0,0,0,0.06), 0 0 10px rgba(0,0,0,0.10)",
  ringLg: "0 0 0 1px rgba(0,0,0,0.05), 0 0 6px rgba(0,0,0,0.05), 0 0 15px rgba(0,0,0,0.10)",
  focusLime: "0 0 0 2px #ffffff, 0 0 0 4px #ccff00, 0 1px 2px rgba(0,0,0,0.05)",
  focusGrey: "0 0 0 2px #ffffff, 0 0 0 4px #d1d5db, 0 1px 2px rgba(0,0,0,0.05)",
  focusBlue: "0 0 0 2px #ffffff, 0 0 0 4px #6366f1, 0 1px 2px rgba(0,0,0,0.05)",
  focusRed:  "0 0 0 2px #ffffff, 0 0 0 4px #ef4444, 0 1px 2px rgba(0,0,0,0.05)",
} as const;

// ------------------------------------------------------------
// ICONS (from Figma icons page)
// Frame names define sizes: icon-16, icon-24, icon-64
// Use these names as keys when referencing icons in components.
// ------------------------------------------------------------

/**
 * Icon registry extracted from Figma.
 * Each entry maps an icon name to its available sizes.
 *
 * Usage example:
 *   import { icons } from "@/styles/design-tokens";
 *   const isValid = icons.size24.includes("arrow-up");
 */
export const icons = {
  /** 16×16 icons — use for inline/dense UI contexts */
  size16: [
    "chevron-down", "chevron-right", "chevron-up", "chevron-left",
    "close", "add", "adjustments", "question-mark", "number-circle",
    "check-circle", "information", "exclamation", "download", "loading",
    "sku", "search", "arrow-up", "arrow-right", "arrow-down", "arrow-left",
    "link", "file", "category", "scan", "code", "public", "lock",
    "upload", "refresh", "scannable-wave", "hide", "download-pdf", "bin",
    "success", "error", "disabled-signal", "disabled-signal-2",
    "multi-select", "show", "doc", "expand", "folder", "add-folder",
    "edit", "lightbulb", "delete", "check-on", "shield-check",
    "badge-check", "badge-check-unverified", "vehicles", "pin",
    "selector", "tag", "phone", "nfc-tag", "phone-scan", "cloud-alert",
    "bell-off", "bell",
  ],

  /** 24×24 icons — primary icon size for most UI elements */
  size24: [
    // Navigation & actions
    "add", "minus", "close", "refresh", "search", "edit", "update-info",
    "upload", "download", "import", "print", "print-preview", "preview",
    "copy", "drag-to-order", "bulk-edit",
    // Arrows & chevrons
    "arrow-up", "arrow-right", "arrow-down", "arrow-left",
    "chevron-down", "chevron-right", "chevron-up", "chevron-left",
    "expand", "collapse", "selector", "switch-vertical",
    // Status & feedback
    "check-on", "confirm", "error", "exclamation-mark", "question-mark",
    "information-mark", "x-circle", "minus-circle",
    // Menu & layout
    "menu-horizontal", "menu-vertical", "menu-hbg",
    // Files & documents
    "doc", "my-doc", "file", "folder", "add-folder", "doc-bar-chart",
    "clipboard", "specs", "components", "history",
    // Users & teams
    "user", "users", "team", "add-user", "remove-user", "unassign",
    // Products & inventory
    "product", "product-check", "product-x", "package", "tag", "add-tag",
    "serials", "serials-create", "serial-number-claimed",
    "create-assemblies", "add-to-group", "remove-from-group",
    "add-to-inventory", "remove-from-inventory",
    // Scanning & NFC
    "nfc", "nfc-tag", "nfc-disabled", "nfc-scan", "scannable-squircle",
    "scannable-squircle-bw", "scannable-wave", "multi-scan", "multi-scan-2",
    "multi-add", "multi-select", "phone-scan",
    // Inspection & safety
    "inspection", "inspection-remove", "inspection-frequency",
    "life-ring", "fire-truck", "tree", "brick", "siren",
    // Location & map
    "map", "location",
    // Visibility
    "hide", "show",
    // Communication & alerts
    "notifications", "notification-off", "chat", "announcement",
    // Settings & admin
    "settings", "settings-2", "organisations", "manufacturer",
    "rope", "carabiner", "kit-bag", "vehicles", "tower",
    // Connectivity
    "wifi", "offline", "backup", "cloud-alert", "activity-circle",
    "code", "data",
    // Commerce
    "cart", "dollar", "mail", "clock", "trending-up",
    // Misc
    "book", "public", "lock", "link", "dashboard", "calendar",
    "archive", "home", "circle-back", "slide-close", "slide-open",
    "finger-print", "camera", "bin", "group", "category",
    "shield-check", "star-circle", "star", "gift", "replace",
    "lightbulb", "product-and-sku", "phone", "log-out", "calibration",
    "scan", "instructions-added", "check-on-alt", "add-tag",
  ],

  /** 64×64 icons — use for empty states, onboarding, hero moments */
  size64: [
    "check-on", "global-search", "camera", "brand-loading",
    "scan-nfc", "offline-available", "assembly", "notifications",
  ],

  /** Decorative icons — sized for alerts, empty states, illustrations */
  deco: [
    "size-40-info", "size-40-info-reverse",
    "size-40-success", "size-40-success-reverse",
    "size-40-error", "size-40-error-reverse",
    "size-40-highlight", "size-40-warning", "size-40-disabled",
    "size-40-brand", "size-64-brand", "size-64-info", "size-64-loading",
    "size-96-info", "size-96-success", "size-96-disabled",
    "size-136-disabled", "size-136-success", "size-136-loading",
  ],

  /** Folder icons — used in folder/category components, available in 16/20/24/40px */
  folders: [
    "none", "location", "vehicle", "kitbag", "equipment", "client", "staff",
  ],
} as const;

/** Icon size values in pixels, keyed by frame name */
export const iconSizes = {
  size16: 16,
  size24: 24,
  size64: 64,
} as const;

export type IconSize = keyof typeof iconSizes;
export type Icon24 = typeof icons.size24[number];
export type Icon16 = typeof icons.size16[number];
export type Icon64 = typeof icons.size64[number];

// ------------------------------------------------------------
// CONSOLIDATED EXPORT
// ------------------------------------------------------------

const tokens = {
  color: {
    fg: colorFg,
    fgReverse: colorFgReverse,
    bg: colorBg,
    brand: colorBrand,
    divider: colorDivider,
    tint: colorTint,
    hover: colorHover,
    pressed: colorPressed,
    base: colorBase,
    palette: {
      gray: colorGray, indigo: colorIndigo, red: colorRed,
      lime: colorLime, green: colorGreen, amber: colorAmber,
    },
  },
  typography,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  spacing,
  borderRadius,
  shadows,
  icons,
  iconSizes,
} as const;

export default tokens;
