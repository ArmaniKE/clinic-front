import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDoctors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    room: "",
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctors");
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const create = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.password) {
      alert("Заполни все поля");
      return;
    }

    try {
      const registerRes = await api.post("/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: "doctor",
      });

      const newUserId = registerRes.data.user_id;
      console.log("New doctor user_id:", newUserId);

      if (newUserId) {
        await api.post("/doctors", {
          user_id: newUserId,
          specialization: form.specialization || null,
          room: form.room || null,
        });
        console.log("Doctor record created");
      }

      await load();
      setForm({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        room: "",
      });
      alert("Врач создан!");
    } catch (err) {
      console.error("Create error:", err);
      alert(err?.response?.data?.error || "Ошибка создания");
    }
  };

  const startEdit = (d) => {
    setEditingId(d.user_id);
    setForm({
      full_name: d.full_name || "",
      email: d.email || "",
      password: "",
      phone: d.phone || "",
      specialization: d.specialization || "",
      room: d.room || "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingId}`, {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
      });
      await api.put(`/doctors/${editingId}`, {
        specialization: form.specialization,
        room: form.room,
      });
      setEditingId(null);
      setForm({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        room: "",
      });
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка обновления");
    }
  };

  const remove = async (id) => {
    if (!confirm("Удалить врача и все его приёмы?")) return;
    try {
      await api.delete(`/doctors/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка удаления");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление врачами</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Список врачей</h2>
        {loading && <div>Загрузка...</div>}
        {!loading && items.length === 0 && (
          <div className="text-gray-500">Врачи не найдены</div>
        )}
        {!loading && (
          <div className="grid gap-3">
            {items.map((d) => (
              <div
                key={d.user_id}
                className="p-4 bg-white rounded shadow flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-lg">{d.full_name}</div>
                  <div className="text-sm text-gray-600">email: {d.email}</div>
                  <div className="text-sm text-gray-600">
                    тел: {d.phone || "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    специальность: {d.specialization || "—"} | комн.{" "}
                    {d.room || "—"}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(d)}
                    className="px-3 py-1 bg-blue-200 rounded"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => remove(d.user_id)}
                    className="px-3 py-1 bg-red-200 rounded"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-lg p-6 bg-white rounded shadow border-t-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Редактировать врача" : "Создать врача"}
        </h2>
        <form onSubmit={editingId ? saveEdit : create} className="space-y-3">
          <input
            name="full_name"
            value={form.full_name}
            onChange={change}
            placeholder="ФИО"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={change}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          {!editingId && (
            <input
              name="password"
              value={form.password}
              onChange={change}
              placeholder="Пароль"
              type="password"
              className="w-full p-2 border rounded"
              required
            />
          )}
          <input
            name="phone"
            value={form.phone}
            onChange={change}
            placeholder="Телефон"
            className="w-full p-2 border rounded"
          />
          <input
            name="specialization"
            value={form.specialization}
            onChange={change}
            placeholder="Специальность"
            className="w-full p-2 border rounded"
          />
          <input
            name="room"
            value={form.room}
            onChange={change}
            placeholder="Кабинет/Комната"
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              {editingId ? "Сохранить" : "Создать"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    full_name: "",
                    email: "",
                    password: "",
                    phone: "",
                    specialization: "",
                    room: "",
                  });
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
