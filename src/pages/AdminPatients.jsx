import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminPatients() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    birth_date: "",
    address: "",
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/patients");
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

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = (p) => {
    setEditingId(p.user_id);
    setForm({
      full_name: p.full_name || "",
      email: p.email || "",
      password: "",
      phone: p.phone || "",
      birth_date: p.birth_date?.split("T")[0] || "",
      address: p.address || "",
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
      await api.put(`/patients/${editingId}`, {
        birth_date: form.birth_date || null,
        address: form.address || null,
      });
      setEditingId(null);
      setForm({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        birth_date: "",
        address: "",
      });
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка обновления");
    }
  };

  const create = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.password) {
      alert("Заполни ФИО, Email и Пароль");
      return;
    }

    try {
      const registerRes = await api.post("/auth/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: "patient",
      });

      const newUserId = registerRes.data.user_id;

      if (newUserId) {
        await api.post("/patients", {
          user_id: newUserId,
          birth_date: form.birth_date || null,
          address: form.address || null,
        });
      }

      await load();
      setForm({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        birth_date: "",
        address: "",
      });
      alert("Пациент создан!");
    } catch (err) {
      console.error("Create error:", err);
      alert(err?.response?.data?.error || "Ошибка создания");
    }
  };

  const remove = async (id) => {
    if (!confirm("Удалить пациента?")) return;
    try {
      await api.delete(`/patients/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка удаления");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление пациентами</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Список пациентов</h2>
        {loading && <div>Загрузка...</div>}
        {!loading && items.length === 0 && (
          <div className="text-gray-500">Пациенты не найдены</div>
        )}
        {!loading && (
          <div className="grid gap-3">
            {items.map((p) => (
              <div
                key={p.user_id}
                className="p-4 bg-white rounded shadow flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold text-lg">{p.full_name}</div>
                  <div className="text-sm text-gray-600">email: {p.email}</div>
                  <div className="text-sm text-gray-600">
                    тел: {p.phone || "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    дата рождения:{" "}
                    {p.birth_date
                      ? new Date(p.birth_date).toLocaleDateString("ru-RU")
                      : "—"}
                  </div>
                  <div className="text-sm text-gray-600">
                    адрес: {p.address || "—"}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-3 py-1 bg-blue-200 rounded"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => remove(p.user_id)}
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

      <div className="max-w-lg p-6 bg-white rounded shadow border-t-4 border-green-500">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Редактировать пациента" : "Создать пациента"}
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
            name="birth_date"
            value={form.birth_date}
            onChange={change}
            type="date"
            className="w-full p-2 border rounded"
          />
          <input
            name="address"
            value={form.address}
            onChange={change}
            placeholder="Адрес"
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
                    birth_date: "",
                    address: "",
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
