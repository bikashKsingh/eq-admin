import { Outlet } from "react-router-dom";
import { Footer } from "../";
import { TrainerHeader } from "./TrainerHeader";
import { TrainerSidebar } from "./TrainerSidebar";

export function TrainerLayout() {
  return (
    <div className="container-scroller">
      <TrainerHeader />
      <div className="container-fluid page-body-wrapper">
        <TrainerSidebar />
        <div className="main-panel">
          <Outlet />
          <Footer />
        </div>
      </div>
    </div>
  );
}
