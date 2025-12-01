import { useState, useEffect } from "react";
import api from "../api/axios";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    doctor_id: "",
    service_id: "",
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {                      
        const [doctorsRes, servicesRes] = await Promise.all([
          api.get("/doctors"),
          api.get("/services"),
        ]);
        if (!mounted) return;
        setDoctors(doctorsRes.data || []);
        setServices(servicesRes.data || []);
      } catch (err) {
        console.error("Error loading doctors/services:", err);
        setMessage("Ошибка загрузки данных");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        doctor_id: Number(form.doctor_id),
        service_id: Number(form.service_id),
        date: form.date,
        time: form.time,
        reason: form.reason,
      };
      const res = await api.post("/appointments", payload);
      setMessage("Запись создана!");
      setForm({
        doctor_id: "",
        service_id: "",
        date: "",
        time: "",
        reason: "",
      });
      console.log("Appointment created:", res.data);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.error || "Ошибка при создании записи");
    }
  };

  if (loading) return <div className="p-6">Загрузка данных...</div>;

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-2xl font-semibold mb-4">Записаться на приём</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Врач</label>
          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Выберите врача</option>
            {doctors.length > 0 ? (
              doctors.map((d) => (
                <option key={d.id} value={d.user_id}>
                  {d.full_name} ({d.specialization || "—"})
                </option>
              ))
            ) : (
              <option disabled>Врачи не найдены</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Услуга</label>
          <select
            name="service_id"
            value={form.service_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Выберите услугу</option>
            {services.length > 0 ? (
              services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.price} ₸)
                </option>
              ))
            ) : (
              <option disabled>Услуги не найдены</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дата</label>
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Время</label>
          <input
            name="time"
            value={form.time}
            onChange={handleChange}
            type="time"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Причина обращения
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Опишите причину"
            className="w-full p-2 border rounded"
          />
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Записаться
        </button>
      </form>

      {message && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
