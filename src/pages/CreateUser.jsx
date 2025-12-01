import { useState } from "react";
import api from "../api/axios";

export default function CreateUser() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "secret",
    role: "patient",
  });
  const [msg, setMsg] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/auth/register", form);
      setMsg(`Создано: ${res.data.user_id ?? JSON.stringify(res.data)}`);
    } catch (err) {
      setMsg(err?.response?.data?.error || "Ошибка");
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl mb-4">Создать пользователя</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          name="full_name"
          value={form.full_name}
          onChange={change}
          placeholder="ФИО"
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={change}
          placeholder="email"
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          value={form.password}
          onChange={change}
          placeholder="password"
          className="w-full p-2 border rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={change}
          className="w-full p-2 border rounded"
        >
          <option value="patient">Пациент</option>
          <option value="doctor">Врач</option>
          <option value="admin">Админ</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Создать
        </button>
      </form>
      {msg && <div className="mt-3 text-sm">{msg}</div>}
    </div>
  );
}
