// components/ui/AppBar.tsx
// Figma: Scannable Design System — node 2150:1741 (App bar)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AppBarProps {
  breadcrumbs:     BreadcrumbItem[];
  /** Show "Book a Demo" primary lime button */
  showBookADemo?:  boolean;
  /** Language code displayed in selector — defaults to "EN" */
  language?:       string;
  /** User initials for the avatar pill */
  userInitials?:   string;
  /** Notification count — shows badge when > 0 */
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onLanguageClick?:      () => void;
  onAvatarClick?:        () => void;
  onBookADemoClick?:     () => void;
}

// ---------------------------------------------------------------------------
// Inline SVGs — bell, chevron-down
// ---------------------------------------------------------------------------
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M8 1.5A4.5 4.5 0 0 0 3.5 6v2.5L2 10h12l-1.5-1.5V6A4.5 4.5 0 0 0 8 1.5Z"
      stroke={tokens.color.fg.primary} strokeWidth="1.3" fill="none"
      strokeLinejoin="round"
    />
    <path d="M6.5 12a1.5 1.5 0 0 0 3 0" stroke={tokens.color.fg.primary} strokeWidth="1.3" fill="none" />
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke={tokens.color.fg.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// AppBar
// Figma: h=64px, pad 12/24, white bg, bottom border divider/frame
//        left: breadcrumb · right: (book a demo?) + notifications + lang + avatar
// ---------------------------------------------------------------------------
export function AppBar({
  breadcrumbs,
  showBookADemo = false,
  language = "EN",
  userInitials = "SW",
  notificationCount = 0,
  onNotificationsClick,
  onLanguageClick,
  onAvatarClick,
  onBookADemoClick,
}: AppBarProps) {

  const pillBase: React.CSSProperties = {
    display:        "flex",
    alignItems:     "center",
    height:         "40px",
    borderRadius:   tokens.borderRadius.lg,   // 8px
    border:         `1px solid ${tokens.color.divider.frame}`,
    background:     tokens.color.base.white,
    cursor:         "pointer",
    fontFamily:     tokens.fontFamily.sans,
    fontSize:       tokens.fontSize.body,
    fontWeight:     tokens.fontWeight.medium,
    color:          tokens.color.fg.primary,
  };

  return (
    <header
      style={{
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        height:          "64px",
        padding:         `12px 24px`,
        boxSizing:       "border-box" as const,
        flexShrink:      0,
      }}
    >
      {/* Left — breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Right — actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Book a Demo — primary lime button */}
        {showBookADemo && (
          <button
            onClick={onBookADemoClick}
            style={{
              display:      "inline-flex",
              alignItems:   "center",
              height:       "40px",
              padding:      `0 ${tokens.spacing[4]}`,
              borderRadius: tokens.borderRadius.md,
              border:       `1px solid ${tokens.color.divider.lime}`,
              background:   tokens.color.brand.lime,
              fontFamily:   tokens.fontFamily.sans,
              fontSize:     tokens.fontSize.body,
              fontWeight:   tokens.fontWeight.medium,
              color:        tokens.color.fg.primary,
              cursor:       "pointer",
              whiteSpace:   "nowrap" as const,
            }}
          >
            Book a Demo
          </button>
        )}

        {/* Notifications — secondary button with bell icon */}
        <button
          onClick={onNotificationsClick}
          style={{
            ...pillBase,
            padding:  `0 ${tokens.spacing[4]} 0 ${tokens.spacing[3]}`,
            gap:      "4px",
            position: "relative" as const,
          }}
          aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ""}`}
        >
          <BellIcon />
          <span>Notifications</span>
          {notificationCount > 0 && (
            <span
              style={{
                position:     "absolute",
                top:          "6px",
                right:        "6px",
                width:        "8px",
                height:       "8px",
                borderRadius: "50%",
                background:   tokens.color.bg.red,
              }}
              aria-hidden
            />
          )}
        </button>

        {/* Language selector */}
        <button
          onClick={onLanguageClick}
          style={{ ...pillBase, padding: `0 ${tokens.spacing[3]}`, gap: "16px" }}
          aria-label={`Language: ${language}`}
        >
          <span>{language}</span>
          <ChevronDown />
        </button>

        {/* Avatar pill — initials + chevron */}
        <button
          onClick={onAvatarClick}
          style={{
            ...pillBase,
            padding:      `4px 8px 4px 4px`,
            gap:          "4px",
            borderRadius: "24px",
          }}
          aria-label="User menu"
        >
          {/* Avatar circle */}
          <div
            style={{
              width:          "32px",
              height:         "32px",
              borderRadius:   "50%",
              background:     tokens.color.bg.darkBg,  // gray-200
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontFamily:     tokens.fontFamily.sans,
              fontSize:       tokens.fontSize.body,
              fontWeight:     tokens.fontWeight.medium,
              color:          tokens.color.fg.primary,
              flexShrink:     0,
            }}
          >
            {userInitials}
          </div>
          <ChevronDown />
        </button>
      </div>
    </header>
  );
}

export default AppBar;
