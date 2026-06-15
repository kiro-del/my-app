// components/ui/Pagination.tsx
// Figma: Scannable Design System — nodes 158:732 (Step link) · 158:775 (Number link) · 2011:2045 (table footer)
// All values reference design-tokens — never hardcoded.

import React from "react";
import tokens from "@/styles/design-tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PaginationProps {
  /** Current active page (1-based) */
  currentPage:  number;
  totalPages:   number;
  /** Number of page number buttons to show around the current page */
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

export interface TableFooterProps extends PaginationProps {
  /** "Showing X to Y of Z result(s)" — pass all three values */
  from:    number;
  to:      number;
  total:   number;
}

// ---------------------------------------------------------------------------
// Chevron icons — 16px
// ---------------------------------------------------------------------------
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M10 4L6 8l4 4" stroke={tokens.color.fg.support} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M6 4l4 4-4 4" stroke={tokens.color.fg.support} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getPageNumbers(current: number, total: number, siblings: number): (number | "…")[] {
  if (total <= 1) return [1];

  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const left  = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  const pages: (number | "…")[] = [1];
  if (left > 2)        pages.push("…");
  pages.push(...range(left, right));
  if (right < total - 1) pages.push("…");
  if (total > 1) pages.push(total);

  return pages;
}

// ---------------------------------------------------------------------------
// Step button (prev / next)
// Figma: 36×36, pad 10/9, border divider.frame, r=6
// ---------------------------------------------------------------------------
function StepButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled:  boolean;
  onClick:   () => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const isPrev = direction === "prev";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      style={{
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        width:                "36px",
        height:               "36px",
        padding:              "10px 9px",
        borderTopLeftRadius:     isPrev ? tokens.borderRadius.md : "0",
        borderBottomLeftRadius:  isPrev ? tokens.borderRadius.md : "0",
        borderTopRightRadius:    isPrev ? "0" : tokens.borderRadius.md,
        borderBottomRightRadius: isPrev ? "0" : tokens.borderRadius.md,
        border:               `1px solid ${tokens.color.divider.frame}`,
        background:           hovered && !disabled ? tokens.color.bg.lightBg : tokens.color.base.white,
        cursor:               disabled ? "not-allowed" : "pointer",
        opacity:              disabled ? 0.4 : 1,
        transition:           "background 150ms ease",
        boxSizing:            "border-box" as const,
      }}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {direction === "prev" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Number button
// Figma: 42×36, pad 8/16
//   current: tint.blue bg, fg.blue text, 2px indigo border
//   default: white bg, fg.support text, 1px frame border
// ---------------------------------------------------------------------------
function NumberButton({
  page,
  current,
  onClick,
}: {
  page:    number;
  current: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={`Page ${page}`}
      aria-current={current ? "page" : undefined}
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          "42px",
        height:         "36px",
        padding:        `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        borderRadius:   0,
        border:         current
          ? `1px solid ${tokens.color.divider.blue}`
          : `1px solid ${tokens.color.divider.frame}`,
        background:     current
          ? tokens.color.tint.blue                       // indigo-50 #eef2ff
          : hovered
          ? tokens.color.bg.lightBg
          : tokens.color.base.white,
        fontFamily:     tokens.fontFamily.sans,
        fontSize:       tokens.fontSize.body,            // 14px
        fontWeight:     tokens.fontWeight.medium,        // 500
        lineHeight:     tokens.lineHeight.body,
        color:          current
          ? tokens.color.fg.blue                         // indigo-700 #4338ca
          : tokens.color.fg.support,
        cursor:         "pointer",
        transition:     "background 150ms ease",
        boxSizing:      "border-box" as const,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {page}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Pagination — just the controls row
// ---------------------------------------------------------------------------
export function Pagination({
  currentPage,
  totalPages,
  siblingCount = 1,
  onPageChange,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing[1] }}>
      <StepButton
        direction="prev"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            style={{
              width:          "36px",
              height:         "36px",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontFamily:     tokens.fontFamily.sans,
              fontSize:       tokens.fontSize.body,
              color:          tokens.color.fg.support,
            }}
          >
            …
          </span>
        ) : (
          <NumberButton
            key={p}
            page={p}
            current={p === currentPage}
            onClick={() => onPageChange(p)}
          />
        )
      )}

      <StepButton
        direction="next"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// TableFooter — "Showing X to Y of Z result(s)" + Pagination
// Figma: h=60px, pad 12/24, white bg, top border divider.frame
// ---------------------------------------------------------------------------
export function TableFooter({
  from,
  to,
  total,
  currentPage,
  totalPages,
  siblingCount,
  onPageChange,
}: TableFooterProps) {
  const resultLabel = total === 1 ? "result" : "results";

  return (
    <div
      style={{
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        padding:         `${tokens.spacing[3]} ${tokens.spacing[6]}`,
        background:      tokens.color.base.white,
        borderTop:       `1px solid ${tokens.color.divider.frame}`,
        borderRadius:    `0 0 ${tokens.borderRadius.lg} ${tokens.borderRadius.lg}`,
        boxSizing:       "border-box" as const,
        minHeight:       "60px",
      }}
    >
      <span
        style={{
          fontFamily:  tokens.fontFamily.sans,
          fontSize:    tokens.fontSize.body,       // 14px
          fontWeight:  tokens.fontWeight.regular,  // 400
          lineHeight:  tokens.lineHeight.body,
          color:       tokens.color.fg.support,    // #6b7280
        }}
      >
        Showing {from} to {to} of {total} {resultLabel}
      </span>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        siblingCount={siblingCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default Pagination;
