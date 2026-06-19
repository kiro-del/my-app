# Scannable UI Library — conventions for the design agent

## No provider required

Components from `window.ScannableUI.*` render standalone. No theme provider, no context wrapper needed. Just render them directly.

```jsx
// Correct
<Button variant="primary" label="Save" />

// Also correct — no wrapper needed
<div style={{ display: "flex", gap: "8px" }}>
  <Button variant="secondary" label="Cancel" />
  <Button variant="primary" label="Confirm" />
</div>
```

## Styling idiom — inline styles with token values

This DS uses **inline styles** referencing a design-token object. There are no CSS utility classes on components. For your own layout glue (wrappers, spacing between DS components, page scaffolding), also use inline `style` with the token values below — never invent class names.

The font is **Inter** and must be loaded by the host app (it does not ship in the bundle). Reference it as `"Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"`.

### Core token values

**Color — foreground** (text, icons)
| Token path | Value | Use |
|---|---|---|
| `color.fg.primary` | `#111827` | body text, primary icons |
| `color.fg.support` | `#6b7280` | secondary/muted text |
| `color.fg.disabled` | `#9ca3af` | disabled text |
| `color.fg.blue` | `#4338ca` | links, active states |
| `color.fg.red` | `#b91c1c` | destructive text |
| `color.fg.green` | `#166534` | success text |
| `color.fgReverse.primary` | `#f9fafb` | text on dark surfaces |

**Color — background & surface**
| Token path | Value | Use |
|---|---|---|
| `color.bg.lightBg` | `#f9fafb` | page background |
| `color.bg.bg` | `#f3f4f6` | subtle surface, badge gray |
| `color.bg.darkBg` | `#e5e7eb` | dividers, hover states |
| `color.brand.darkGrey` | `#201b30` | mobile app bar background |
| `color.brand.lime` | `#ccff00` | brand accent |
| `color.divider.border` | `#e5e7eb` | card/panel borders |
| `color.divider.frame` | `#d1d5db` | input borders, section dividers |

**Color — semantic tints** (light backgrounds for badges, alerts)
`color.tint.blue` `#eef2ff` · `color.tint.red` `#fef2f2` · `color.tint.green` `#dcfce7` · `color.tint.yellow` `#fffbeb`

**Spacing** (Tailwind-aligned, use these values for gap/padding/margin):
`2px` · `4px` · `6px` · `8px` · `10px` · `12px` · `16px` · `20px` · `24px` · `32px` · `48px`

**Border radius**: `4px` (sm) · `6px` (md) · `8px` (lg) · `16px` (2xl) · `9999px` (full/pill)

**Typography** — apply as `style` objects:
| Scale | fontSize / fontWeight / lineHeight |
|---|---|
| `bodyR` | 14px / 400 / 20px |
| `bodyM` | 14px / 500 / 20px |
| `bodySB` | 14px / 600 / 20px |
| `smallBodyR` | 12px / 400 / 16px |
| `smallBodyM` | 12px / 500 / 16px |
| `h5` | 16px / 500 / 22px |
| `h4` | 18px / 500 / 24px |
| `h3` | 20px / 500 / 28px |

**Shadows**: `0 1px 4px rgba(0,0,0,.05)` (sm) · `0 2px 4px rgba(0,0,0,.06),0 4px 6px rgba(0,0,0,.06)` (md)

## Where to look

- Per-component API + usage: `components/general/<Name>/<Name>.prompt.md`
- Component JSX stubs: `components/general/<Name>/<Name>.jsx`
- Type interfaces: `components/general/<Name>/<Name>.d.ts`

## Example — idiomatic layout using DS components

```jsx
// A modal confirmation panel built with DS components + inline-style layout
function ConfirmPanel() {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      maxWidth: "480px",
    }}>
      <ModalHeader title="Delete serial" onClose={() => {}} />
      <p style={{ fontSize: "14px", fontWeight: "400", lineHeight: "20px", color: "#6b7280", margin: 0 }}>
        This action cannot be undone.
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="secondary" label="Cancel" />
        <Button variant="destructive" label="Delete" />
      </div>
    </div>
  );
}
```
