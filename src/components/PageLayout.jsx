import { Outlet, useLocation } from "react-router-dom";
import BackButton from "./BackButton";
import Navbar from "./Navbar";

export default function PageLayout() {
  const loc = useLocation();
  const isHome = loc.pathname === "/";

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        {!isHome && (
          <div
            className="page-actions"
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <BackButton />
          </div>
        )}

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
