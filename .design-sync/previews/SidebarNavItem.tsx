import React from "react";
import { SidebarNavItem } from "@/components/ui/SidebarNavItem";

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12v8a1 1 0 001 1h16a1 1 0 001-1v-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProductsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function AllStates() {
  return (
    <div style={{ width: "240px", padding: "8px", background: "#f9fafb", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
      <SidebarNavItem label="Overview"     icon={<HomeIcon />} />
      <SidebarNavItem label="Products/SKUs" icon={<ProductsIcon />} selected />
      <SidebarNavItem label="My inventory" icon={<HomeIcon />} showProChip />
      <SidebarNavItem label="Scannable Updates" icon={<SettingsIcon />} showInfo />
      <SidebarNavItem label="Serialisation" icon={<ProductsIcon />} selected showInfo />
      <SidebarNavItem label="Settings"     icon={<SettingsIcon />} />
    </div>
  );
}
