import { useState } from "react";
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
    specialization: "",
    room: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/register", form);
      const { token, role, user_id } = response.data;
      login({ token, role, user_id });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Ошибка при регистрации");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
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
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="patient">Пациент</option>
          <option value="doctor">Врач</option>
        </select>

        {form.role === "doctor" && (
          <>
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Специализация"
              className="w-full p-2 border rounded"
            />
            <input
              name="room"
              value={form.room}
              onChange={handleChange}
              placeholder="Кабинет"
              className="w-full p-2 border rounded"
            />
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Примечания"
              className="w-full p-2 border rounded"
            />
          </>
        )}

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Зарегистрироваться
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default Register;
