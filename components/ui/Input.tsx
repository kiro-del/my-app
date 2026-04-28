// components/ui/Input.tsx
// Built on top of design-tokens.ts — all values reference tokens, never hardcoded
// Icon specs confirmed from Figma plugin API:
//   leading icon:  24×24, color gray/400 (#9ca3af) — baked into SVG export
//   tailing icon:  24×24, color gray/900 (#111827) — baked into SVG export
//   error icon:    16×16, built-in (not from library)
//   gap:           8px (spacing[2])
//   alignment:     items-center

import React, { forwardRef, useState } from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type InputSize = "Default" | "large";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?:           string;
  placeholder?:     string;
  supportMessage?:  string;
  showSupportIcon?: boolean;
  errorMessage?:    string;
  leadingIcon?:     React.ReactNode;
  tailingIcon?:     React.ReactNode;
  inputSize?:       InputSize;
  /**
   * Inline action button rendered flush at the right edge of the input border.
   * When set, paddingRight becomes 0 and the error icon is suppressed
   * (error state is indicated by the red border only).
   * Pass a fully-styled <button> element — it will be separated by a 1px divider.
   */
  inlineButton?:    React.ReactNode;
  /**
   * When provided, a × clear button appears to the left of inlineButton
   * whenever the input has a non-empty value. Only meaningful when
   * inlineButton is also set.
   */
  onClear?:         () => void;
}

// ---------------------------------------------------------------------------
// Built-in status icons — not from icon library
// ---------------------------------------------------------------------------

// Error indicator — 16px, uses bg/red token
const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.5" stroke={tokens.color.bg.red} strokeWidth="1.3" />
    <rect x="7.25" y="4.5" width="1.5" height="4.5" rx="0.75" fill={tokens.color.bg.red} />
    <circle cx="8" cy="11" r="0.75" fill={tokens.color.bg.red} />
  </svg>
);

// Clear × — 14px, tinted to fg/support; used by inlineButton variant
const ClearXIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

// Support lightbulb — 16px, uses fg/support token
const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 2a4 4 0 0 1 2.4 7.2V11H5.6V9.2A4 4 0 0 1 8 2z"
      stroke={tokens.color.fg.support} strokeWidth="1.2" fill="none" />
    <path d="M6 12.5h4M6.5 14h3"
      stroke={tokens.color.fg.support} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder     = "Placeholder",
  supportMessage,
  showSupportIcon = false,
  errorMessage,
  leadingIcon,
  tailingIcon,
  inputSize       = "Default",
  inlineButton,
  onClear,
  disabled,
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled;
  const isError    = !!errorMessage;

  // ---------------------------------------------------------------------------
  // Border — confirmed from Figma
  // default:  1px divider/frame
  // focus:    2px divider/blue  (indigo-500 #6366f1)
  // error:    2px bg/red        (#ef4444)
  // disabled: 1px divider/frame, bg bg/lightBg
  // ---------------------------------------------------------------------------
  const borderStyle: React.CSSProperties = isError
    ? { border: `2px solid ${tokens.color.bg.red}` }
    : isDisabled
    ? { border: `1px solid ${tokens.color.divider.frame}`, background: tokens.color.bg.lightBg }
    : isFocused
    ? { border: `2px solid ${tokens.color.divider.blue}` }
    : { border: `1px solid ${tokens.color.divider.frame}` };

  // Height — confirmed from Figma node 1313:2941: h-[40px] items-center
  // large = 80px min-height, items-start (textarea-style)
  const heightStyle: React.CSSProperties = inputSize === "large"
    ? { minHeight: "80px", alignItems: "flex-start",
        paddingTop: tokens.spacing[2.5], paddingBottom: tokens.spacing[2.5] }
    : { height: "40px", alignItems: "center" };

  const hasInlineBtn = !!inlineButton;
  // Show clear × only in inline-button mode when the input has a value
  const showClear = hasInlineBtn && !!onClear && !!rest.value;

  const wrapperStyle: React.CSSProperties = {
    display:       "flex",
    flexDirection: "row",
    gap:           tokens.spacing[2],       // 8px — confirmed from Figma
    paddingLeft:   tokens.spacing[2.5],     // 10px
    // No right padding when inlineButton is present — button is flush to the edge
    paddingRight:  hasInlineBtn ? 0 : tokens.spacing[2.5],
    borderRadius:  tokens.borderRadius.md,  // 6px
    background:    borderStyle.background || tokens.color.base.white,
    overflow:      "hidden",
    width:         "100%",
    boxSizing:     "border-box" as const,
    boxShadow:     tokens.shadows.sm,
    transition:    "border-color 150ms ease, box-shadow 150ms ease",
    ...borderStyle,
    ...heightStyle,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1], width: "100%" }}>

      {/* Label — Inter Medium 500 14px fg/primary — confirmed Figma node 148:1525 */}
      {label && (
        <label style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize:   tokens.fontSize.body,      // 14px
          fontWeight: tokens.fontWeight.medium,  // 500
          lineHeight: tokens.lineHeight.body,    // 20px
          color:      tokens.color.fg.primary,   // #111827
        }}>
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div style={wrapperStyle}>

        {hasInlineBtn ? (
          // ── Inline-button layout: two groups so the button has zero gap ──
          <>
            {/* Left group: icon + input + optional clear × */}
            <div style={{ display: "flex", flex: 1, alignItems: "center", gap: tokens.spacing[2], minWidth: 0 }}>
              {leadingIcon && (
                <span style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden>
                  {leadingIcon}
                </span>
              )}
              <input
                ref={ref}
                disabled={isDisabled}
                placeholder={placeholder}
                style={{
                  flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none",
                  fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
                  fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
                  color:  isDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
                  cursor: isDisabled ? "not-allowed" : "text",
                }}
                onFocus={(e) => { setIsFocused(true);  onFocus?.(e); }}
                onBlur={(e)  => { setIsFocused(false); onBlur?.(e);  }}
                {...rest}
              />
              {/* Clear × — appears when input has a value */}
              {showClear && (
                <button type="button" onClick={onClear} aria-label="Clear"
                  style={{ display: "flex", alignItems: "center", padding: "0 2px", background: "transparent", border: "none", cursor: isDisabled ? "not-allowed" : "pointer", flexShrink: 0, color: isDisabled ? tokens.color.fg.disabled : tokens.color.fg.support }}
                >
                  <ClearXIcon />
                </button>
              )}
            </div>

            {/* Right group: inline button, flush to right edge, no gap.
                alignSelf: stretch overrides the wrapper's alignItems: center
                so the span (and button inside) fill the full input height. */}
            <span style={{ display: "flex", alignItems: "stretch", alignSelf: "stretch", flexShrink: 0, borderLeft: `1px solid ${tokens.color.divider.frame}` }}>
              {inlineButton}
            </span>
          </>
        ) : (
          // ── Standard layout ───────────────────────────────────────────────
          <>
            {leadingIcon && (
              <span style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden>
                {leadingIcon}
              </span>
            )}

            <input
              ref={ref}
              disabled={isDisabled}
              placeholder={placeholder}
              style={{
                flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none",
                fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body,
                fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body,
                color:  isDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
                cursor: isDisabled ? "not-allowed" : "text",
              }}
              onFocus={(e) => { setIsFocused(true);  onFocus?.(e); }}
              onBlur={(e)  => { setIsFocused(false); onBlur?.(e);  }}
              {...rest}
            />

            {/* Error icon (16px built-in) — replaces tailing icon when error */}
            {isError ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: "16px", height: "16px" }} aria-hidden>
                <ErrorIcon />
              </span>
            ) : tailingIcon ? (
              <span style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden>
                {tailingIcon}
              </span>
            ) : null}
          </>
        )}
      </div>

      {/* Support / error message */}
      {(errorMessage || supportMessage) && (
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
          {showSupportIcon && !isError && (
            <span style={{ flexShrink: 0 }} aria-hidden>
              <LightbulbIcon />
            </span>
          )}
          <p style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize:   tokens.fontSize.bodySmall,    // 12px
            fontWeight: tokens.fontWeight.regular,    // 400
            lineHeight: tokens.lineHeight.bodySmall,  // 16px
            color:      isError
                          ? tokens.color.fg.red       // #b91c1c
                          : tokens.color.fg.support,  // #6b7280
            margin:     0,
          }}>
            {isError ? errorMessage : supportMessage}
          </p>
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

// ---------------------------------------------------------------------------
// CalendarIcon — 24px calendar SVG (Figma node 2150:1814)
// A calendar body with two handle lines at top, a horizontal divider,
// and a dot grid representing dates.
// ---------------------------------------------------------------------------
export function CalendarIcon({ color = tokens.color.fg.support }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* Calendar body */}
      <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5" />
      {/* Handle lines (top tabs) */}
      <path d="M8 3V7M16 3V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Horizontal divider */}
      <path d="M3 10H21" stroke={color} strokeWidth="1.5" />
      {/* Date dot grid — 3 columns × 2 rows */}
      <circle cx="8"  cy="14" r="1" fill={color} />
      <circle cx="12" cy="14" r="1" fill={color} />
      <circle cx="16" cy="14" r="1" fill={color} />
      <circle cx="8"  cy="18" r="1" fill={color} />
      <circle cx="12" cy="18" r="1" fill={color} />
      <circle cx="16" cy="18" r="1" fill={color} />
    </svg>
  );
}

export default Input;
