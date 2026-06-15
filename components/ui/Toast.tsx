"use client";

// components/ui/Toast.tsx
// Variants: success | error | info | warning | lime | neutral
// Rule: no onClose → auto-dismiss after `duration` ms (default 3000)
// Icons for success / error / info are fetched from the Figma icon library.

import React, { useEffect } from "react";
import tokens from "@/styles/design-tokens";
import { useFigmaIcons } from "@/hooks/useFigmaIcons";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ToastVariant = "success" | "error" | "info";

export interface ToastProps {
  message:   string;
  variant?:  ToastVariant;
  /** If provided, renders an ✕ button and the toast stays until dismissed. */
  onClose?:  () => void;
  /** Underlined action link on the right. */
  action?:   { label: string; onClick: () => void };
  /** Auto-dismiss delay in ms when no onClose is provided. Default: 3000 */
  duration?: number;
}

// ---------------------------------------------------------------------------
// Figma icon node IDs (design system file j8hy0yzSKPyh1yRKOh4tuU)
// ---------------------------------------------------------------------------
const ICON_IDS = {
  success: "2284:3120",
  error:   "2284:3143",
  info:    "3565:10122",
} as const;

const ALL_ICON_IDS = Object.values(ICON_IDS);


function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M2 2l8 8M10 2l-8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Variant config (no icon — handled per-render using Figma URLs)
// ---------------------------------------------------------------------------
type VariantConfig = {
  bg:         string;
  text:       string;
  closeColor: string;
};

function getConfig(variant: ToastVariant): VariantConfig {
  switch (variant) {
    case "success":
      return { bg: tokens.color.tint.green, text: tokens.color.fg.green, closeColor: tokens.color.fg.green };
    case "error":
      return { bg: tokens.color.tint.red,   text: tokens.color.fg.red,   closeColor: tokens.color.fg.red };
    case "info":
    default:
      return { bg: tokens.color.tint.blue,  text: tokens.color.fg.blue,  closeColor: tokens.color.fg.blue };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Toast({
  message,
  variant  = "success",
  onClose,
  action,
  duration = 3000,
}: ToastProps) {
  const { bg, text, closeColor } = getConfig(variant);
  const autoClose = !onClose;

  // Fetch icons from Figma (module-level cache — only fetches once per session)
  const iconUrls = useFigmaIcons(ALL_ICON_IDS);

  // Auto-dismiss when there is no close button
  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(() => {
      // Notify parent if they're tracking visibility via a wrapper
    }, duration);
    return () => clearTimeout(timer);
  }, [autoClose, duration]);

  // Resolve icon for this variant
  const figmaIconId = ICON_IDS[variant as keyof typeof ICON_IDS];
  const figmaIconUrl = figmaIconId ? iconUrls[figmaIconId] : undefined;

  const iconNode: React.ReactNode = figmaIconUrl
    ? <img src={figmaIconUrl} width={16} height={16} alt="" aria-hidden />
    : null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          tokens.spacing[2],
        padding:      onClose
          ? `${tokens.spacing[1]} ${tokens.spacing[2]} ${tokens.spacing[1]} ${tokens.spacing[4]}`
          : `${tokens.spacing[2.5]} ${tokens.spacing[4]}`,
        background:   bg,
        borderRadius: tokens.borderRadius.md,
        boxShadow:    tokens.shadows.lg,
        minWidth:     "260px",
        maxWidth:     "400px",
      }}
    >
      {/* Leading icon */}
      {iconNode && (
        <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {iconNode}
        </span>
      )}

      {/* Message */}
      <span
        style={{
          flex:       "1 0 0",
          fontFamily: tokens.fontFamily.sans,
          fontSize:   tokens.fontSize.body,
          fontWeight: tokens.fontWeight.medium,
          lineHeight: tokens.lineHeight.body,
          color:      text,
        }}
      >
        {message}
      </span>

      {/* Action link */}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background:     "none",
            border:         "none",
            cursor:         "pointer",
            padding:        0,
            fontFamily:     tokens.fontFamily.sans,
            fontSize:       tokens.fontSize.body,
            fontWeight:     tokens.fontWeight.medium,
            lineHeight:     tokens.lineHeight.body,
            color:          text,
            textDecoration: "underline",
            flexShrink:     0,
          }}
        >
          {action.label}
        </button>
      )}

      {/* Close button — only when onClose provided */}
      {onClose && (
        <Button
          variant="icon"
          aria-label="Dismiss"
          onClick={onClose}
          icon={<CloseIcon color={closeColor} />}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// useToast — convenience hook for rendering auto-dismissing toasts
// ---------------------------------------------------------------------------
export type ToastState = ToastProps & { id: string };

export function useToast(opts?: { bottom?: string | number }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  function show(props: Omit<ToastProps, "onClose"> & { onClose?: () => void }) {
    const id = String(Date.now());
    const autoClose = !props.onClose;

    setToasts((prev) => [...prev, { ...props, id }]);

    if (autoClose) {
      setTimeout(() => dismiss(id), props.duration ?? 3000);
    }
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const ToastContainer = () => (
    <div
      style={{
        position:      "fixed",
        bottom:        opts?.bottom ?? tokens.spacing[8],
        left:          "50%",
        transform:     "translateX(-50%)",
        display:       "flex",
        flexDirection: "column",
        gap:           tokens.spacing[2],
        zIndex:        300,
        alignItems:    "center",
      }}
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          {...t}
          onClose={t.onClose ? () => { t.onClose?.(); dismiss(t.id); } : undefined}
        />
      ))}
    </div>
  );

  return { show, dismiss, ToastContainer };
}
