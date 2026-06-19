# Scannable UI Library — design-sync notes

## Repo facts

- Shape: `package` (no Storybook). Entry: `.ds-build-entry.tsx` (custom synth entry in repo root).
- Source root: `components/ui/`. All 54 components are src-matched in `componentSrcMap`.
- Styling: pure inline styles via `@/styles/design-tokens` (CSS-in-JS). `[CSS_RUNTIME]` on every build is expected and non-blocking.
- Font: Inter — referenced in tokens but **not shipped in the bundle**; must be loaded by the host app.
- No provider wrapper needed — components work standalone.

## Build command

```
node .ds-sync/resync.mjs \
  --config .design-sync/config.json \
  --node-modules ./node_modules \
  --entry ./.ds-build-entry.tsx \
  --out ./ds-bundle \
  --remote .design-sync/.cache/remote-sync.json
```

Re-fetch the remote anchor first: `DesignSync(get_file, "_ds_sync.json")` → save to `.design-sync/.cache/remote-sync.json`.

## Known render warns

- `[CSS_RUNTIME]` on every build — expected, CSS-in-JS DS.
- DecoIcon `FortyPx`/`SixtyFourPx`/`NinetySixPx`: shows gray placeholder squares. DecoIcon fetches SVG from Figma API at runtime (async); placeholders are intentional, not a render failure.

## Config overrides

- `MobileAppBar`: `cardMode: "column"` — stories use 390px-wide mobile containers, overflow grid cells at multi-column layout.
- `ModalHeader`: `cardMode: "column"` — stories use 480px-wide containers.

## Authored previews (16 components)

Badge, BadgeActionable, BadgeActionableChevronIcon, BadgeActionableCloseIcon, CalendarIcon, CameraIcon, Checkbox, CheckboxIndicator, CheckboxInput, ContextMenuItem, DecoIcon, MobileAppBar, ModalHeader, ProductListItem, SectionHeader, SidebarNavItem.

Remaining 38 components ship the floor card. Author previews incrementally by adding `previews/<Name>.tsx` and running the driver.

## Re-sync risks

- **Inline token values in conventions.md**: The conventions header names specific hex values extracted from `design-tokens.ts`. If tokens are updated in Figma and regenerated, verify the table values still match.
- **DecoIcon placeholder behaviour**: Tied to the Figma API fetch in `DecoIcon.tsx`. If the component gains local fallback SVGs, the preview should be updated to show them.
- **MobileAppBar/ModalHeader width**: If these components get wider or narrower containers in previews, `cardMode: "column"` overrides may need revisiting.
- **CalendarIcon source**: Declared in `componentSrcMap` under `Input.tsx` — if the CalendarIcon export moves to its own file, update the map.
- **CameraIcon source**: Under `ProductImg.tsx` in the map — same caveat.
