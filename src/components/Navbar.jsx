import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();

  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.token && auth.token.trim().length > 0);

  const handleLogout = () => {
    if (auth?.logout) auth.logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          className="text-xl font-bold"
        >
          Клиника
        </Link>

        <nav className="flex items-center gap-3">
          {isLoggedIn && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">
                {auth?.fullName || auth?.userId || "Пользователь"}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
