import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState(
    () => localStorage.getItem("login_email") || ""
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem("login_password") || ""
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const { login } = auth;

  // Redirect if already logged in
  useEffect(() => {
    const token = auth?.token;
    if (token && token.trim().length > 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth?.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    localStorage.setItem("login_email", email);
    localStorage.setItem("login_password", password);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role, user_id, full_name } = response.data;
      login({ token, role, user_id, full_name });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Ошибка при входе");
    }
  };

  return (
    <div className="flex items-center justify-center pt-45">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-semibold">Вход</h2>
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Пароль"
          className="w-full p-2 border rounded"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Войти
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
