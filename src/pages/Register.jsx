import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    birth_date: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();
  const { login } = auth;

  useEffect(() => {
    const token = auth?.token;
    if (token && token.trim().length > 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth?.token, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/register", form);
      const { token, role, user_id, full_name } = response.data;
      if (token) {
        login({ token, role, user_id, full_name });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Ошибка при регистрации");
    }
  };

  return (
    <div className="flex items-center justify-center pt-30">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow space-y-3"
      >
        <h2 className="text-xl font-semibold">Регистрация</h2>
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          placeholder="ФИО"
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          required
          placeholder="Пароль"
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Телефон"
          className="w-full p-2 border rounded"
        />
        <input
          name="birth_date"
          value={form.birth_date}
          onChange={handleChange}
          type="date"
          className="w-full p-2 border rounded"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Адрес"
          className="w-full p-2 border rounded"
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Зарегистрироваться
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default Register;
