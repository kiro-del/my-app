// components/ui/BottomSheet.tsx
// Alias of ContextMenu for non-menu bottom sheet use cases.
// Use this when the sheet contains arbitrary content (forms, confirmations,
// detail panels, etc.) rather than a list of context menu actions.
//
// All props, variants, and behaviour are identical to ContextMenu.
// Docs: /styleguide/patterns → Context Menu tab

export { ContextMenu as BottomSheet } from "@/components/patterns/ContextMenu";
export type { ContextMenuProps as BottomSheetProps } from "@/components/patterns/ContextMenu";
