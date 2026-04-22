// components/ui/DataTable.tsx
// Figma: Scannable Design System — node 161:4925 (/Table/table cell)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type SortDirection = "asc" | "desc" | "none";

export interface DataTableColumn<T = Record<string, unknown>> {
  key:       string;
  label:     string;
  sortable?: boolean;
  width?:    string | number;
  render?:   (value: unknown, row: T, rowIndex: number) => React.ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns:        DataTableColumn<T>[];
  rows:           T[];
  sortKey?:       string;
  sortDirection?: SortDirection;
  onSort?:        (key: string) => void;
  /** Row key extractor — defaults to row index */
  getRowKey?:     (row: T, index: number) => string | number;
  /** Renders trailing action cell per row (menu/download icons) */
  renderRowActions?: (row: T, index: number) => React.ReactNode;
  /**
   * When true the action column sticks to the right edge while
   * data columns scroll horizontally.
   */
  stickyActions?: boolean;
  /**
   * "fixed" enforces exact column widths via CSS table-layout:fixed.
   * Defaults to "auto".
   */
  layout?: "auto" | "fixed";
  emptyMessage?:  string;
  /** Called when a data row is clicked */
  onRowClick?:    (row: T, index: number) => void;
  /** Key of the currently selected row — highlights that row */
  selectedRowKey?: string | number;
}

// ---------------------------------------------------------------------------
// Sort chevron — 16px
// ---------------------------------------------------------------------------
function SortChevron({ direction }: { direction: SortDirection }) {
  const color = direction !== "none" ? tokens.color.fg.primary : tokens.color.fg.support;
  const rotate = direction === "asc" ? "rotate(180deg)" : "rotate(0deg)";
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden
      style={{ flexShrink: 0, transform: rotate, transition: "transform 150ms ease" }}
    >
      <path d="M4 6l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// DataTable
// Header row: h=44px, gray-100 bg, 14px Medium fg.support, pad 12/16
// Body row:   h=72px, white bg, 14px Regular fg.primary, pad 10/16
//             bottom border: 1px divider.frame
// ---------------------------------------------------------------------------
export function DataTable<T = Record<string, unknown>>({
  columns,
  rows,
  sortKey,
  sortDirection = "none",
  onSort,
  getRowKey,
  renderRowActions,
  stickyActions = false,
  layout = "auto",
  emptyMessage = "No results found.",
  onRowClick,
  selectedRowKey,
}: DataTableProps<T>) {
  const [hoveredKey, setHoveredKey] = React.useState<string | number | null>(null);

  const headerCellStyle: React.CSSProperties = {
    padding:        "12px 16px",
    background:     tokens.color.bg.bg,           // gray-100 #f3f4f6
    fontFamily:     tokens.fontFamily.sans,
    fontSize:       tokens.fontSize.body,          // 14px
    fontWeight:     tokens.fontWeight.medium,      // 500
    lineHeight:     tokens.lineHeight.body,        // 20px
    color:          tokens.color.fg.support,       // #6b7280
    textAlign:      "left" as const,
    whiteSpace:     "nowrap" as const,
    userSelect:     "none" as const,
    borderBottom:   `1px solid ${tokens.color.divider.border}`,
  };

  const bodyCellStyle: React.CSSProperties = {
    padding:        "10px 16px",
    fontFamily:     tokens.fontFamily.sans,
    fontSize:       tokens.fontSize.body,          // 14px
    fontWeight:     tokens.fontWeight.regular,     // 400
    lineHeight:     tokens.lineHeight.body,        // 20px
    color:          tokens.color.fg.primary,       // #111827
    verticalAlign:  "middle" as const,
  };

  return (
    <div
      style={{
        width:     "100%",
        overflowX: "auto" as const,
      }}
    >
      <table
        style={{
          width:           layout === "fixed" ? "max-content" : "100%",
          minWidth:        "100%",
          borderCollapse:  "collapse" as const,
          tableLayout:     layout as React.CSSProperties["tableLayout"],
        }}
      >
        {/* Header */}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...headerCellStyle,
                  width:  col.width,
                  cursor: col.sortable && onSort ? "pointer" : "default",
                }}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: col.sortable ? "8px" : undefined }}>
                  <span>{col.label}</span>
                  {col.sortable && (
                    <SortChevron direction={sortKey === col.key ? sortDirection : "none"} />
                  )}
                </div>
              </th>
            ))}
            {renderRowActions && (
              <th
                style={{
                  ...headerCellStyle,
                  width: "80px",
                  ...(stickyActions ? {
                    position:    "sticky",
                    right:       0,
                    zIndex:      1,
                    background:  tokens.color.bg.bg,
                    boxShadow:   `-1px 0 0 ${tokens.color.divider.border}`,
                  } : {}),
                }}
              />
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderRowActions ? 1 : 0)}
                style={{
                  ...bodyCellStyle,
                  textAlign:  "center",
                  color:      tokens.color.fg.support,
                  padding:    "40px 16px",
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, ri) => {
              const isLast = ri === rows.length - 1;
              const key = getRowKey ? getRowKey(row, ri) : ri;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row, ri)}
                  onMouseEnter={() => onRowClick && setHoveredKey(key)}
                  onMouseLeave={() => onRowClick && setHoveredKey(null)}
                  style={{
                    borderBottom: isLast ? "none" : `1px solid ${tokens.color.divider.border}`,
                    background:
                      selectedRowKey !== undefined && key === selectedRowKey
                        ? tokens.color.bg.lightBg           // selected: subtle gray-50
                        : hoveredKey === key && onRowClick
                        ? tokens.color.tint.blue            // hover: indigo-50
                        : tokens.color.base.white,
                    cursor:     onRowClick ? "pointer" : undefined,
                    transition: "background 150ms ease",
                  }}
                >
                  {columns.map((col) => {
                    const value = (row as Record<string, unknown>)[col.key];
                    return (
                      <td key={col.key} style={{ ...bodyCellStyle, width: col.width }}>
                        {col.render ? col.render(value, row, ri) : String(value ?? "")}
                      </td>
                    );
                  })}
                  {renderRowActions && (
                    <td
                      style={{
                        ...bodyCellStyle,
                        width:   "80px",
                        padding: "16px 12px",
                        ...(stickyActions ? {
                          position:   "sticky",
                          right:      0,
                          background: tokens.color.base.white,
                          boxShadow:  `-1px 0 0 ${tokens.color.divider.border}`,
                        } : {}),
                      }}
                    >
                      {renderRowActions(row, ri)}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
