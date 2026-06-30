"use client";
// components/ui/mobile/Input.tsx
// Mobile-specific input — 48px height (14px top+bottom padding), 8px border-radius.
// Keep separate from components/ui/Input.tsx to avoid polluting the design system.

import React, { forwardRef, useState } from "react";
import tokens from "@/styles/design-tokens";
import { IconClose } from "@/components/icons";

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.5" stroke={tokens.color.bg.red} strokeWidth="1.3" />
    <rect x="7.25" y="4.5" width="1.5" height="4.5" rx="0.75" fill={tokens.color.bg.red} />
    <circle cx="8" cy="11" r="0.75" fill={tokens.color.bg.red} />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 2a4 4 0 0 1 2.4 7.2V11H5.6V9.2A4 4 0 0 1 8 2z"
      stroke={tokens.color.fg.support} strokeWidth="1.2" fill="none" />
    <path d="M6 12.5h4M6.5 14h3"
      stroke={tokens.color.fg.support} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  placeholder?: string;
  supportMessage?: string;
  showSupportIcon?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
  tailingIcon?: React.ReactNode;
  inlineButton?: React.ReactNode;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder = "Placeholder",
  supportMessage,
  showSupportIcon = false,
  errorMessage,
  leadingIcon,
  tailingIcon,
  inlineButton,
  onClear,
  disabled,
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled;
  const isError = !!errorMessage;

  const borderStyle: React.CSSProperties = isError
    ? { border: `2px solid ${tokens.color.bg.red}` }
    : isDisabled
    ? { border: `1px solid ${tokens.color.divider.frame}`, background: tokens.color.bg.lightBg }
    : isFocused
    ? { border: `2px solid ${tokens.color.divider.blue}` }
    : { border: `1px solid ${tokens.color.divider.frame}` };

  const hasInlineBtn = !!inlineButton;
  const showClear = !!onClear && !!rest.value;

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: tokens.spacing[2],
    paddingLeft: tokens.spacing[2.5],
    paddingRight: hasInlineBtn ? 0 : tokens.spacing[2.5],
    paddingTop: "14px",
    paddingBottom: "14px",
    alignItems: "center",
    borderRadius: tokens.borderRadius.lg,
    background: borderStyle.background || tokens.color.base.white,
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box" as const,
    boxShadow: tokens.shadows.sm,
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    ...borderStyle,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1], width: "100%" }}>
      {label && (
        <label style={{
          fontFamily: tokens.fontFamily.sans,
          fontSize: tokens.fontSize.body,
          fontWeight: tokens.fontWeight.medium,
          lineHeight: tokens.lineHeight.body,
          color: tokens.color.fg.primary,
        }}>
          {label}
        </label>
      )}

      {hasInlineBtn ? (
        <div style={{
          display: "flex",
          width: "100%",
          height: "48px",
          boxSizing: "border-box" as const,
          boxShadow: tokens.shadows.sm,
          transition: "border-color 150ms ease, box-shadow 150ms ease",
        }}>
          {/* Left: input area */}
          <div style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            gap: tokens.spacing[2],
            paddingLeft: tokens.spacing[2.5],
            paddingRight: tokens.spacing[2.5],
            borderTopLeftRadius: tokens.borderRadius.lg,
            borderBottomLeftRadius: tokens.borderRadius.lg,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            background: borderStyle.background || tokens.color.base.white,
            overflow: "hidden",
            minWidth: 0,
            boxSizing: "border-box" as const,
            position: "relative" as const,
            zIndex: 2,
            marginRight: "-1px",
            ...borderStyle,
          }}>
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
                color: isDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
                cursor: isDisabled ? "not-allowed" : "text",
              }}
              onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
              onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
              {...rest}
            />
            {showClear && (
              <button type="button" onClick={onClear} aria-label="Clear"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: isDisabled ? "not-allowed" : "pointer", flexShrink: 0, padding: 0 }}
              >
                <IconClose size={24} color={isDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary} />
              </button>
            )}
          </div>

          {/* Right: inline button — inject right-only border radius */}
          <div style={{
            display: "flex",
            alignItems: "stretch",
            flexShrink: 0,
            position: "relative" as const,
            zIndex: 1,
          }}>
            {React.isValidElement(inlineButton)
              ? React.cloneElement(
                  inlineButton as React.ReactElement<{ style?: React.CSSProperties }>,
                  {
                    style: {
                      ...(inlineButton as React.ReactElement<{ style?: React.CSSProperties }>).props.style,
                      borderTopRightRadius: tokens.borderRadius.lg,
                      borderBottomRightRadius: tokens.borderRadius.lg,
                    },
                  }
                )
              : inlineButton}
          </div>
        </div>
      ) : (
        <div style={wrapperStyle}>
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
              color: isDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary,
              cursor: isDisabled ? "not-allowed" : "text",
            }}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
            {...rest}
          />
          {isError ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: "16px", height: "16px" }} aria-hidden>
              <ErrorIcon />
            </span>
          ) : showClear ? (
            <button type="button" onClick={onClear} aria-label="Clear"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: isDisabled ? "not-allowed" : "pointer", flexShrink: 0, padding: 0 }}
            >
              <IconClose size={24} color={isDisabled ? tokens.color.fg.disabled : tokens.color.fg.primary} />
            </button>
          ) : tailingIcon ? (
            <span style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden>
              {tailingIcon}
            </span>
          ) : null}
        </div>
      )}

      {(errorMessage || supportMessage) && (
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
          {showSupportIcon && !isError && (
            <span style={{ flexShrink: 0 }} aria-hidden>
              <LightbulbIcon />
            </span>
          )}
          <p style={{
            fontFamily: tokens.fontFamily.sans,
            fontSize: tokens.fontSize.bodySmall,
            fontWeight: tokens.fontWeight.regular,
            lineHeight: tokens.lineHeight.bodySmall,
            color: isError ? tokens.color.fg.red : tokens.color.fg.support,
            margin: 0,
          }}>
            {isError ? errorMessage : supportMessage}
          </p>
        </div>
      )}
    </div>
  );
});

Input.displayName = "MobileInput";

export default Input;
