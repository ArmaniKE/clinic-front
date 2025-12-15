import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services");
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

  const create = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Заполни название и цену");
      return;
    }

    try {
      await api.post("/services", {
        name: form.name,
        price: Number(form.price),
      });
      await load();
      setForm({ name: "", price: "" });
      alert("Услуга создана!");
    } catch (err) {
      console.error("Create error:", err);
      alert(err?.response?.data?.error || "Ошибка создания");
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name || "",
      price: s.price || "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/services/${editingId}`, {
        name: form.name,
        price: Number(form.price),
      });
      setEditingId(null);
      setForm({ name: "", price: "" });
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка обновления");
    }
  };

  const remove = async (id) => {
    if (!confirm("Удалить услугу?")) return;
    try {
      await api.delete(`/services/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка удаления");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление услугами</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Список услуг</h2>
        {loading && <div>Загрузка...</div>}
        {!loading && items.length === 0 && (
          <div className="text-gray-500">Услуги не найдены</div>
        )}
        {!loading && (
          <div className="grid gap-3">
            {items.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-lg">{s.name}</div>
                  <div className="text-sm text-gray-600">Цена: {s.price} ₸</div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(s)}
                    className="px-3 py-1 bg-blue-200 rounded"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => remove(s.id)}
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

      <div className="max-w-lg p-6 bg-white rounded shadow border-t-4 border-purple-500">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Редактировать услугу" : "Создать услугу"}
        </h2>
        <form onSubmit={editingId ? saveEdit : create} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={change}
            placeholder="Название услуги (например: Пломбирование зубов)"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={change}
            placeholder="Цена в тенге (₸)"
            type="number"
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex gap-2">
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              {editingId ? "Сохранить" : "Создать"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", price: "" });
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
