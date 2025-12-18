import { Outlet, useLocation } from "react-router-dom";
import BackButton from "./BackButton";
import Navbar from "./Navbar";

export default function PageLayout() {
  const loc = useLocation();

  const isHome = loc.pathname === "/";
  const isDashboard = loc.pathname === "/dashboard";
  const showBackButton = !isHome && !isDashboard;

  const role = localStorage.getItem("role");

  const bgImage = role === "admin" ? "/admin.jpg" : "/clinic-bg3.jpg";

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <img
        key={bgImage}
        src={bgImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
      />

      <div className="page-wrapper relative z-10">
        {showBackButton && (
          <div className="page-actions flex items-center">
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
