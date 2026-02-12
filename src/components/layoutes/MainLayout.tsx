import { Router } from "./";
import { Footer } from ".";
import { Header } from ".";
import { Sidebar } from ".";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
}
