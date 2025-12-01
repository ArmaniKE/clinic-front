import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BackButton from "./BackButton";
import Navbar from "./Navbar"; // если есть глобальная навигация

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
          {/* Контент страницы будет центрирован */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
