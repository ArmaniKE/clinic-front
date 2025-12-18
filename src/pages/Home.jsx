import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const auth = useAuth();
  const isLoggedIn = Boolean(auth?.token && auth.token.trim().length > 0);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/clinic-bg2.jpg"
          alt="Clinic Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-200 rounded-full opacity-30 mix-blend-multiply animate-pulse"></div>

      <div className="relative z-10 max-w-xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Медицинская клиника
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Онлайн-запись к врачу, управление приёмами и удобный личный кабинет
          для пациентов, врачей и администраторов.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Регистрация
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
