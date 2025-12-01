import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();

  const auth = useAuth();
  const user = auth?.user || null;
  //   const isLogged = Boolean(user);

  const handleLogout = () => {
    if (auth?.logout) auth.logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Клиника
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/" className="px-3 py-1 hover:bg-gray-100 rounded">
            Главная
          </Link>

          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="px-3 py-1 hover:bg-gray-100 rounded">
                Админ
              </Link>
              <Link
                to="/admin/dashboard"
                className="px-3 py-1 hover:bg-gray-100 rounded"
              >
                Отчёты
              </Link>
              <Link
                to="/admin/payments"
                className="px-3 py-1 hover:bg-gray-100 rounded"
              >
                Платежи
              </Link>
            </>
          )}

          {user?.role === "doctor" && (
            <Link
              to="/doctor/schedule"
              className="px-3 py-1 hover:bg-gray-100 rounded"
            >
              Мой график
            </Link>
          )}

          {user?.role === "patient" && (
            <>
              <Link to="/book" className="px-3 py-1 hover:bg-gray-100 rounded">
                Запись
              </Link>
              <Link
                to="/appointments"
                className="px-3 py-1 hover:bg-gray-100 rounded"
              >
                Мои приёмы
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Войти
              </Link>
              <Link to="/register" className="px-3 py-1 border rounded">
                Регистрация
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span>{user.full_name || user.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Выйти
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
