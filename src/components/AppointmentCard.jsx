import { useState } from "react";
import api from "../api/axios";

export default function AppointmentCard({
  appointment,
  onUpdate,
  onDelete,
  role,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    date: appointment.date?.split("T")[0] || "",
    time: appointment.time || "",
    reason: appointment.reason || "",
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/appointments/${appointment.id}`, form);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      alert(err?.response?.data?.error || "Ошибка при сохранении");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Отменить приём?")) return;
    try {
      await api.delete(`/appointments/${appointment.id}`);
      if (onDelete) onDelete();
    } catch (err) {
      alert(err?.response?.data?.error || "Ошибка при отмене");
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-blue-50 rounded border-l-4 border-blue-500">
        <form onSubmit={handleSave} className="space-y-2">
          <input
            name="date"
            value={form.date}
            onChange={change}
            type="date"
            className="w-full p-2 border rounded"
          />
          <input
            name="time"
            value={form.time}
            onChange={change}
            type="time"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="reason"
            value={form.reason}
            onChange={change}
            placeholder="Причина"
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow border-l-4 border-green-500">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-lg">
            {appointment.service_name || "Приём"}
          </div>
          <div className="text-sm text-gray-600">
            {role === "doctor" ? (
              <div>Пациент: {appointment.patient_name || "—"}</div>
            ) : (
              <div>Врач: {appointment.doctor_name || "—"}</div>
            )}
          </div>
        </div>
        <span className="bg-yellow-200 px-2 py-1 rounded text-xs font-semibold">
          {appointment.status}
        </span>
      </div>

      <div className="text-sm text-gray-700 mb-3">
        <div>📅 {new Date(appointment.date).toLocaleDateString("ru-RU")}</div>
        <div>⏰ {appointment.time}</div>
        {appointment.reason && <div>📝 {appointment.reason}</div>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-blue-200 rounded text-sm"
        >
          Изменить
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1 bg-red-200 rounded text-sm"
        >
          Отменить
        </button>
      </div>
    </div>
  );
}
