"use client";
// app/showcase/page.tsx
// Sample project showcase — built entirely with our design system
// components (Button, Input) and design tokens.
// Share this page to demonstrate the design system in action.

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Calendar icon — 24px, from Figma node I38:49573;1313:2927
// ---------------------------------------------------------------------------
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="4" width="18" height="17" rx="2" stroke="#111827" strokeWidth="1.5" />
    <path d="M3 9h18" stroke="#111827" strokeWidth="1.5" />
    <path d="M8 2v4M16 2v4" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8"  cy="13" r="1" fill="#111827" />
    <circle cx="12" cy="13" r="1" fill="#111827" />
    <circle cx="16" cy="13" r="1" fill="#111827" />
    <circle cx="8"  cy="17" r="1" fill="#111827" />
    <circle cx="12" cy="17" r="1" fill="#111827" />
  </svg>
);

// Chevron down — 16px for the dropdown trigger
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 6l4 4 4-4" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Close icon — 24px for the bottom sheet
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6 6l12 12M6 18L18 6" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Dropdown input — Input + chevron divider, opens bottom sheet
// ---------------------------------------------------------------------------
function DropdownInput({
  label,
  value,
  placeholder,
  onClick,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onClick: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[1], width: "100%" }}>
      <label style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.body, color: tokens.color.fg.primary }}>
        {label}
      </label>
      <button
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: tokens.spacing[2.5],
          background: tokens.color.base.white,
          border: `1px solid ${tokens.color.divider.frame}`,
          borderRadius: tokens.borderRadius.md,
          boxShadow: tokens.shadows.sm,
          cursor: "pointer",
          fontFamily: tokens.fontFamily.sans,
          textAlign: "left" as const,
        }}
      >
        <span style={{ fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.regular, lineHeight: tokens.lineHeight.body, color: value ? tokens.color.fg.primary : tokens.color.fg.disabled }}>
          {value || placeholder}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[2], paddingLeft: tokens.spacing[2], borderLeft: `1px solid ${tokens.color.bg.darkBg}`, alignSelf: "stretch" }}>
          <ChevronDownIcon />
        </div>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bottom sheet — preference picker
// ---------------------------------------------------------------------------
const PREFERENCES = ["Sample one", "Sample two", "Sample three"];

function BottomSheet({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (val: string) => void;
}) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: tokens.color.base.overlay,
          zIndex: 40,
        }}
      />
      {/* Sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "393px",
        background: tokens.color.base.white,
        borderRadius: `${tokens.borderRadius["2xl"]} ${tokens.borderRadius["2xl"]} 0 0`,
        padding: tokens.spacing[4],
        zIndex: 50,
        boxShadow: tokens.shadows.lg,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing[2] }}>
          <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4, color: tokens.color.fg.primary }}>
            Select a preference:
          </p>
          <Button
            variant="icon"
            icon={<CloseIcon />}
            aria-label="Close"
            onClick={onClose}
          />
        </div>

        {/* Options */}
        {PREFERENCES.map((item, i) => (
          <button
            key={item}
            onClick={() => { onSelect(item); onClose(); }}
            style={{
              display: "flex", alignItems: "center",
              width: "100%", padding: `${tokens.spacing[4]} 0`,
              background: "transparent", border: "none",
              borderBottom: i < PREFERENCES.length - 1 ? `1px solid ${tokens.color.bg.darkBg}` : "none",
              cursor: "pointer",
              fontFamily: tokens.fontFamily.sans,
              fontSize: tokens.fontSize.body,
              fontWeight: tokens.fontWeight.medium,
              lineHeight: tokens.lineHeight.body,
              color: tokens.color.fg.primary,
              textAlign: "left" as const,
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// The form itself
// ---------------------------------------------------------------------------
function SampleForm() {
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [startDate,  setStartDate]  = useState("");
  const [preference, setPreference] = useState("");
  const [sheetOpen,  setSheetOpen]  = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    if (!startDate)    e.startDate  = "Start date is required";
    if (!preference)   e.preference = "Please select a preference";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: tokens.spacing[4], padding: `${tokens.spacing[10]} ${tokens.spacing[4]}`, textAlign: "center" as const }}>
        <div style={{ width: "48px", height: "48px", background: tokens.color.tint.green, borderRadius: tokens.borderRadius.full, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={tokens.color.fg.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary }}>
          Form submitted!
        </p>
        <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fg.support }}>
          {name} · {email} · {startDate} · {preference}
        </p>
        <Button variant="secondary" label="Reset" onClick={() => { setSubmitted(false); setName(""); setEmail(""); setStartDate(""); setPreference(""); }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[6], padding: `${tokens.spacing[6]} ${tokens.spacing[4]}` }}>
      {/* Title */}
      <div style={{ paddingBottom: tokens.spacing[6], borderBottom: `1px solid ${tokens.color.divider.border}` }}>
        <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4, color: tokens.color.fg.primary }}>
          A form sample
        </p>
      </div>

      {/* Name */}
      <Input
        label="Name"
        placeholder="Placeholder"
        value={name}
        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
        errorMessage={errors.name}
      />

      {/* Email */}
      <Input
        label="Email"
        placeholder="Placeholder"
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
        errorMessage={errors.email}
      />

      {/* Start Date */}
      <Input
        label="Start Date"
        placeholder="Placeholder"
        type="date"
        value={startDate}
        onChange={e => { setStartDate(e.target.value); setErrors(p => ({ ...p, startDate: "" })); }}
        tailingIcon={<CalendarIcon />}
        errorMessage={errors.startDate}
      />

      {/* Preference — dropdown */}
      <div>
        <DropdownInput
          label="Preference"
          value={preference}
          placeholder="Placeholder"
          onClick={() => setSheetOpen(true)}
        />
        {errors.preference && (
          <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.red, marginTop: tokens.spacing[1] }}>
            {errors.preference}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button variant="primary" label="Submit" onClick={handleSubmit} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Showcase page wrapper
// ---------------------------------------------------------------------------
export default function ShowcasePage() {
  const [sheetOpen,  setSheetOpen]  = useState(false);
  const [preference, setPreference] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: tokens.color.bg.bg, fontFamily: tokens.fontFamily.sans }}>

      {/* Page header */}
      <div style={{ background: tokens.color.brand.darkGrey, padding: `${tokens.spacing[6]} ${tokens.spacing[6]} ${tokens.spacing[5]}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[3], marginBottom: tokens.spacing[2] }}>
            <div style={{ width: "24px", height: "24px", background: tokens.color.brand.lime, borderRadius: tokens.borderRadius.sm }} />
            <span style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.brand.lime, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Scannable</span>
          </div>
          <h1 style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h2, fontWeight: tokens.fontWeight.medium, color: tokens.color.fgReverse.primary, lineHeight: "140%", margin: 0 }}>
            Design System Showcase
          </h1>
          <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, color: tokens.color.fgReverse.support, marginTop: tokens.spacing[1] }}>
            Sample project built with our Button + Input components and design tokens
          </p>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ background: tokens.color.base.white, borderBottom: `1px solid ${tokens.color.divider.frame}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: `0 ${tokens.spacing[6]}`, display: "flex", gap: tokens.spacing[1] }}>
          {[
            { label: "Design Tokens", href: "/styleguide" },
            { label: "Components", href: "/styleguide/components" },
            { label: "Showcase", href: "/showcase" },
          ].map(item => (
            <a key={item.href} href={item.href} style={{ display: "inline-block", padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`, fontSize: tokens.fontSize.bodySmall, fontWeight: item.href === "/showcase" ? tokens.fontWeight.semiBold : tokens.fontWeight.medium, color: item.href === "/showcase" ? tokens.color.fg.primary : tokens.color.fg.support, textDecoration: "none", whiteSpace: "nowrap" as const, borderBottom: item.href === "/showcase" ? `2px solid ${tokens.color.brand.lime}` : "2px solid transparent" }}>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: `${tokens.spacing[10]} ${tokens.spacing[6]}` }}>
        <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.support, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: tokens.spacing[4] }}>
          Sample — A Form
        </p>

        {/* Mobile frame */}
        <div style={{ display: "flex", gap: tokens.spacing[8], alignItems: "flex-start", flexWrap: "wrap" as const }}>

          {/* Phone mockup */}
          <div style={{
            width: "393px",
            minHeight: "600px",
            background: tokens.color.base.white,
            borderRadius: tokens.borderRadius["3xl"],
            boxShadow: tokens.shadows.lg,
            overflow: "hidden",
            position: "relative" as const,
            border: `1px solid ${tokens.color.divider.border}`,
            flexShrink: 0,
          }}>
            <FormWithSheet />
          </div>

          {/* Annotation panel */}
          <div style={{ flex: 1, minWidth: "220px", display: "flex", flexDirection: "column", gap: tokens.spacing[4] }}>
            <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: tokens.spacing[5] }}>
              <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, marginBottom: tokens.spacing[3] }}>Components used</p>
              {[
                { name: "Input", detail: "× 4 fields", note: "Name, Email, Date, Dropdown" },
                { name: "Button", detail: "primary", note: "Submit action" },
                { name: "Button", detail: "icon", note: "Close bottom sheet" },
                { name: "Button", detail: "secondary", note: "Reset after submit" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: `${tokens.spacing[2]} 0`, borderBottom: i < 3 ? `1px solid ${tokens.color.divider.border}` : "none" }}>
                  <div>
                    <code style={{ fontSize: "12px", fontFamily: "monospace", color: tokens.color.fg.blue, background: tokens.color.tint.blue, padding: "1px 5px", borderRadius: "3px" }}>{item.name}</code>
                    <span style={{ fontSize: "11px", color: tokens.color.fg.support, marginLeft: "6px", fontFamily: tokens.fontFamily.sans }}>{item.detail}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans, textAlign: "right" as const, maxWidth: "100px" }}>{item.note}</span>
                </div>
              ))}
            </div>

            <div style={{ background: tokens.color.base.white, border: `1px solid ${tokens.color.divider.border}`, borderRadius: tokens.borderRadius.lg, padding: tokens.spacing[5] }}>
              <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h5, fontWeight: tokens.fontWeight.semiBold, color: tokens.color.fg.primary, marginBottom: tokens.spacing[3] }}>Tokens used</p>
              {[
                { token: "color.fg.primary", value: "#111827" },
                { token: "color.brand.lime", value: "#ccff00" },
                { token: "color.divider.frame", value: "#d1d5db" },
                { token: "color.bg.red", value: "#ef4444" },
                { token: "shadows.sm", value: "drop shadow" },
                { token: "borderRadius.md", value: "6px" },
                { token: "spacing[4]", value: "16px" },
                { token: "fontSize.body", value: "14px" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: `${tokens.spacing[1.5]} 0`, borderBottom: i < 7 ? `1px solid ${tokens.color.divider.border}` : "none" }}>
                  <code style={{ fontSize: "11px", fontFamily: "monospace", color: tokens.color.fg.support }}>{item.token}</code>
                  <span style={{ fontSize: "11px", color: tokens.color.fg.disabled, fontFamily: "monospace" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: tokens.color.tint.blue, border: `1px solid ${tokens.color.divider.blue}`, borderRadius: tokens.borderRadius.lg, padding: tokens.spacing[4] }}>
              <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.blue, fontWeight: tokens.fontWeight.medium, marginBottom: tokens.spacing[1] }}>Try it out</p>
              <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support }}>
                Fill in the form on the left. Validation runs on submit. The Preference field opens a bottom sheet picker.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper that owns the bottom sheet state for the demo
function FormWithSheet() {
  const [sheetOpen,  setSheetOpen]  = useState(false);
  const [preference, setPreference] = useState("");
  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [startDate,  setStartDate]  = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    if (!startDate)    e.startDate  = "Start date is required";
    if (!preference)   e.preference = "Please select a preference";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false); setName(""); setEmail("");
    setStartDate(""); setPreference(""); setErrors({});
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: tokens.spacing[4], padding: `${tokens.spacing[12]} ${tokens.spacing[4]}`, textAlign: "center" as const }}>
        <div style={{ width: "56px", height: "56px", background: tokens.color.tint.green, borderRadius: tokens.borderRadius.full, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={tokens.color.fg.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary }}>Submitted!</p>
        <div style={{ background: tokens.color.bg.bg, borderRadius: tokens.borderRadius.md, padding: tokens.spacing[4], width: "100%", textAlign: "left" as const }}>
          {[
            { label: "Name", value: name },
            { label: "Email", value: email },
            { label: "Start Date", value: startDate },
            { label: "Preference", value: preference },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: `${tokens.spacing[1.5]} 0`, borderBottom: `1px solid ${tokens.color.divider.border}` }}>
              <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.support, fontFamily: tokens.fontFamily.sans }}>{row.label}</span>
              <span style={{ fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.primary, fontFamily: tokens.fontFamily.sans, fontWeight: tokens.fontWeight.medium }}>{row.value}</span>
            </div>
          ))}
        </div>
        <Button variant="secondary" label="Reset" onClick={reset} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative" as const, minHeight: "600px" }}>
      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing[6], padding: `${tokens.spacing[6]} ${tokens.spacing[4]}` }}>
        <div style={{ paddingBottom: tokens.spacing[6], borderBottom: `1px solid ${tokens.color.divider.border}` }}>
          <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4, color: tokens.color.fg.primary }}>
            A form sample
          </p>
        </div>

        <Input label="Name" placeholder="Placeholder" value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
          errorMessage={errors.name} />

        <Input label="Email" placeholder="Placeholder" type="email" value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
          errorMessage={errors.email} />

        <Input label="Start Date" placeholder="Placeholder" type="date" value={startDate}
          onChange={e => { setStartDate(e.target.value); setErrors(p => ({ ...p, startDate: "" })); }}
          tailingIcon={<CalendarIcon />}
          errorMessage={errors.startDate} />

        {/* Preference dropdown */}
        <div>
          <DropdownInput
            label="Preference"
            value={preference}
            placeholder="Placeholder"
            onClick={() => setSheetOpen(true)}
          />
          {errors.preference && (
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.bodySmall, color: tokens.color.fg.red, marginTop: tokens.spacing[1] }}>
              {errors.preference}
            </p>
          )}
        </div>

        <Button variant="primary" label="Submit" onClick={handleSubmit} />
      </div>

      {/* Overlay */}
      {sheetOpen && (
        <div onClick={() => setSheetOpen(false)} style={{ position: "absolute" as const, inset: 0, background: tokens.color.base.overlay, zIndex: 10 }} />
      )}

      {/* Bottom sheet */}
      {sheetOpen && (
        <div style={{
          position: "absolute" as const, bottom: 0, left: 0, right: 0,
          background: tokens.color.base.white,
          borderRadius: `${tokens.borderRadius["2xl"]} ${tokens.borderRadius["2xl"]} 0 0`,
          padding: tokens.spacing[4],
          zIndex: 20,
          boxShadow: tokens.shadows.upLg,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: tokens.spacing[2] }}>
            <p style={{ fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.h4, fontWeight: tokens.fontWeight.medium, lineHeight: tokens.lineHeight.h4, color: tokens.color.fg.primary }}>
              Select a preference:
            </p>
            <Button variant="icon" icon={<CloseIcon />} aria-label="Close" onClick={() => setSheetOpen(false)} />
          </div>
          {["Sample one", "Sample two", "Sample three"].map((item, i, arr) => (
            <button key={item} onClick={() => { setPreference(item); setSheetOpen(false); setErrors(p => ({ ...p, preference: "" })); }}
              style={{ display: "flex", alignItems: "center", width: "100%", padding: `${tokens.spacing[4]} 0`, background: "transparent", border: "none", borderBottom: i < arr.length - 1 ? `1px solid ${tokens.color.bg.darkBg}` : "none", cursor: "pointer", fontFamily: tokens.fontFamily.sans, fontSize: tokens.fontSize.body, fontWeight: tokens.fontWeight.medium, color: tokens.color.fg.primary, textAlign: "left" as const }}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
