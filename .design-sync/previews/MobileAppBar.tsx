import React from "react";
import { MobileAppBar } from "@/components/ui/MobileAppBar";

export function Home() {
  return (
    <div style={{ width: "390px", background: "#1f2937" }}>
      <MobileAppBar page="home" title="Wanaka Height Safety" />
    </div>
  );
}

export function HomeWithActions() {
  return (
    <div style={{ width: "390px", background: "#1f2937" }}>
      <MobileAppBar page="home" title="Wanaka Height Safety" actions={1} />
    </div>
  );
}

export function Main() {
  return (
    <div style={{ width: "390px", background: "#1f2937" }}>
      <MobileAppBar page="main" title="All Inventory" actions={2} />
    </div>
  );
}

export function MainWithBack() {
  return (
    <div style={{ width: "390px", background: "#1f2937" }}>
      <MobileAppBar page="main" title="Auckland" withBackIcon actions={1} />
    </div>
  );
}

export function Task() {
  return (
    <div style={{ width: "390px", background: "#fff", border: "1px solid #e5e7eb" }}>
      <MobileAppBar page="task" title="Capture Serials" />
    </div>
  );
}

export function TaskWithActions() {
  return (
    <div style={{ width: "390px", background: "#fff", border: "1px solid #e5e7eb" }}>
      <MobileAppBar page="task" title="Capture Serials" actions={2} />
    </div>
  );
}

export function Account() {
  return (
    <div style={{ width: "390px", background: "#1f2937" }}>
      <MobileAppBar page="account" title="My Account" version="2.24.0" />
    </div>
  );
}
