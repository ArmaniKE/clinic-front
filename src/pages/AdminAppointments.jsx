import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    time: "",
    reason: "",
    status: "pending",
  });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/appointments/admin/all");
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

  const startEdit = (a) => {
    setEditingId(a.id);
    setForm({
      date: a.date?.split("T")[0] || "",
      time: a.time || "",
      reason: a.reason || "",
      status: a.status || "pending",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${editingId}`, {
        date: form.date,
        time: form.time,
        reason: form.reason,
        status: form.status,
      });
      setEditingId(null);
      setForm({ date: "", time: "", reason: "", status: "pending" });
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка обновления");
    }
  };

  const remove = async (id) => {
    if (!confirm("Отменить приём?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка удаления");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление приёмами</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Все приёмы</h2>
        {loading && <div>Загрузка...</div>}
        {!loading && items.length === 0 && (
          <div className="text-gray-500">Приёмы не найдены</div>
        )}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded shadow">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Пациент</th>
                  <th className="text-left p-3">Врач</th>
                  <th className="text-left p-3">Услуга</th>
                  <th className="text-left p-3">Дата</th>
                  <th className="text-left p-3">Время</th>
                  <th className="text-left p-3">Статус</th>
                  <th className="text-left p-3">Причина</th>
                  <th className="text-center p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr
                    key={a.id}
                    className={`border-b hover:bg-gray-50 ${
                      a.status === "cancelled" ? "bg-gray-100 opacity-75" : ""
                    }`}
                  >
                    <td className="p-3">{a.id}</td>
                    <td className="p-3">{a.patient_name || "—"}</td>
                    <td className="p-3">{a.doctor_name || "—"}</td>
                    <td className="p-3">{a.service_name || "—"}</td>
                    <td className="p-3">
                      {a.date
                        ? new Date(a.date).toLocaleDateString("ru-RU")
                        : "—"}
                    </td>
                    <td className="p-3">{a.time || "—"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          a.status === "cancelled"
                            ? "bg-red-200 text-red-800"
                            : a.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200"
                        }`}
                      >
                        {a.status === "cancelled"
                          ? "Отменён"
                          : a.status === "completed"
                          ? "Завершён"
                          : a.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate">{a.reason || "—"}</td>
                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => startEdit(a)}
                          className="px-2 py-1 bg-blue-200 rounded text-xs"
                          disabled={a.status === "cancelled"}
                        >
                          Изменить
                        </button>
                        <button
                          onClick={() => remove(a.id)}
                          className="px-2 py-1 bg-red-200 rounded text-xs"
                          disabled={a.status === "cancelled"}
                        >
                          Отменить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingId && (
        <div className="max-w-lg p-6 bg-white rounded shadow border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Редактировать приём</h2>
          <form onSubmit={saveEdit} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Дата</label>
              <input
                name="date"
                value={form.date}
                onChange={change}
                type="date"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Время</label>
              <input
                name="time"
                value={form.time}
                onChange={change}
                type="time"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Причина обращения
              </label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={change}
                placeholder="Причина обращения"
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Статус</label>
              <select
                name="status"
                value={form.status}
                onChange={change}
                className="w-full p-2 border rounded"
              >
                <option value="pending">Ожидает</option>
                <option value="completed">Завершён</option>
                <option value="cancelled">Отменён</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Сохранить
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ date: "", time: "", reason: "", status: "pending" });
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

