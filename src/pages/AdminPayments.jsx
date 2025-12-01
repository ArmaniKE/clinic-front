import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminPayments() {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    patient_id: "",
    appointment_id: "",
    method: "наличные",
  });
  // const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [paymentsRes, patientsRes] = await Promise.all([
        api.get("/payments"),
        api.get("/patients"),
      ]);
      setItems(paymentsRes.data || []);
      setPatients(patientsRes.data || []);
      console.log(paymentsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Загрузить приёмы при выборе пациента
  useEffect(() => {
    if (form.patient_id) {
      const loadAppointments = async () => {
        try {
          const res = await api.get(
            `/appointments?patient_id=${form.patient_id}`
          );
          setAppointments(res.data || []);
        } catch (e) {
          console.error(e);
        }
      };
      loadAppointments();
    }
  }, [form.patient_id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const create = async (e) => {
    e.preventDefault();

    if (!form.appointment_id) {
      alert("Выбери приём");
      return;
    }

    try {
      // Получи данные приёма (включая сумму услуги)
      const appointment = appointments.find(
        (a) => a.id === Number(form.appointment_id)
      );
      if (!appointment) {
        alert("Приём не найден");
        return;
      }

      // Создай платёж с суммой из услуги
      await api.post("/payments", {
        patient_id: Number(form.patient_id),
        appointment_id: Number(form.appointment_id),
        amount: appointment.service_price || 0, // берём цену из услуги
        method: form.method,
        status: "completed", // всегда "completed" (оплачено)
      });

      await load();
      setForm({ patient_id: "", appointment_id: "", method: "наличные" });
      setAppointments([]);
      alert("Платёж создан!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка создания");
    }
  };

  const remove = async (id) => {
    if (!confirm("Удалить платёж?")) return;
    try {
      await api.delete(`/payments/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Ошибка удаления");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление платежами</h1>

      {/* СПИСОК ПЛАТЕЖЕЙ ВВЕРХУ */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Все платежи</h2>
        {loading && <div>Загрузка...</div>}
        {!loading && items.length === 0 && (
          <div className="text-gray-500">Платежи не найдены</div>
        )}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded shadow">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3">Пациент</th>
                  <th className="text-left p-3">Услуга</th>
                  <th className="text-right p-3">Сумма (₸)</th>
                  <th className="text-left p-3">Способ оплаты</th>
                  <th className="text-left p-3">Дата</th>
                  <th className="text-center p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.patient_name || "—"}</td>
                    <td className="p-3">{p.service_name || "—"}</td>
                    <td className="text-right p-3 font-semibold">
                      {p.amount} ₸
                    </td>
                    <td className="p-3 capitalize">{p.method}</td>
                    <td className="p-3 text-gray-600 text-xs">
                      {p.appointment_date
                        ? new Date(p.appointment_date).toLocaleDateString(
                            "ru-RU"
                          )
                        : p.paid_at
                        ? new Date(p.paid_at).toLocaleDateString("ru-RU")
                        : "—"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => remove(p.id)}
                        className="px-2 py-1 bg-red-200 rounded text-xs"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ФОРМА СОЗДАНИЯ ПЛАТЕЖА ВНИЗУ */}
      <div className="max-w-lg p-6 bg-white rounded shadow border-t-4 border-green-500">
        <h2 className="text-xl font-semibold mb-4">Отметить как оплачено</h2>
        <form onSubmit={create} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Выберите пациента
            </label>
            <select
              name="patient_id"
              value={form.patient_id}
              onChange={change}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">— Выберите пациента —</option>
              {patients.map((p) => (
                <option key={p.user_id} value={p.user_id}>
                  {p.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Выберите приём для оплаты
            </label>
            <select
              name="appointment_id"
              value={form.appointment_id}
              onChange={change}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">— Выберите приём —</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.service_name} - {a.doctor_name} (
                  {new Date(a.date).toLocaleDateString("ru-RU")}) -{" "}
                  {a.service_price} ₸
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Способ оплаты
            </label>
            <select
              name="method"
              value={form.method}
              onChange={change}
              className="w-full p-2 border rounded"
            >
              <option value="наличные">Наличные</option>
              <option value="карта">Карта</option>
              <option value="перевод">Перевод</option>
            </select>
          </div>

          <button className="w-full bg-green-600 text-white px-4 py-2 rounded font-semibold">
            Создать платёж
          </button>
        </form>
      </div>
    </div>
  );
}
