import { useState } from "react";
import api from "../api/axios";

export default function CreateService() {
  const [form, setForm] = useState({ name: "", price: 0, duration_min: 30 });
  const [msg, setMsg] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/services", form);
      setMsg(`Создано: ${res.data.id ?? JSON.stringify(res.data)}`);
      setForm({ name: "", price: 0, duration_min: 30 });
    } catch (err) {
      setMsg(err?.response?.data?.error || "Ошибка");
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl mb-4">Создать услугу</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={change}
          placeholder="Название услуги"
          className="w-full p-2 border rounded"
        />
        <input
          name="price"
          value={form.price}
          onChange={change}
          type="number"
          placeholder="Цена"
          className="w-full p-2 border rounded"
        />
        <input
          name="duration_min"
          value={form.duration_min}
          onChange={change}
          type="number"
          placeholder="Длительность (мин)"
          className="w-full p-2 border rounded"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Создать услугу
        </button>
      </form>
      {msg && <div className="mt-3 text-sm">{msg}</div>}
    </div>
  );
}
