import React from "react";
import { BadgeActionable, BadgeActionableChevronIcon } from "@/components/ui/BadgeActionable";

const ChevronIcon = () => <BadgeActionableChevronIcon color="#6b7280" />;
const ChevronIconBlue = () => <BadgeActionableChevronIcon color="#6366f1" />;

export function SmallRemovable() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <BadgeActionable label="EN 12275:2013" dismissible />
      <BadgeActionable label="EN 12275:2013" dismissible selected />
      <BadgeActionable label="EN 12275:2013" dismissible disabled />
    </div>
  );
}

export function SmallFilterChip() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <BadgeActionable
        label="Print Status"
        tailingIcon={<ChevronIcon />}
        dismissible
      />
      <BadgeActionable
        label="Print Status"
        tailingIcon={<ChevronIconBlue />}
        dismissible
        selected
      />
    </div>
  );
}

export function BigTextOnly() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <BadgeActionable label="Filters" size="big" />
      <BadgeActionable label="All Items" size="big" selected dismissible />
      <BadgeActionable label="Filters" size="big" disabled />
    </div>
  );
}

export function BigDropdown() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <BadgeActionable
        label="Print Status"
        size="big"
        tailingIcon={<ChevronIcon />}
        dismissible
      />
      <BadgeActionable
        label="All Items"
        size="big"
        selected
        tailingIcon={<ChevronIconBlue />}
        dismissible
      />
      <BadgeActionable
        label="Source"
        size="big"
        disabled
        tailingIcon={<ChevronIcon />}
      />
    </div>
  );
}
