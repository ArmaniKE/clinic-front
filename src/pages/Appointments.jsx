import { useEffect, useState } from "react";
import api from "../api/axios";
import AppointmentCard from "../components/AppointmentCard";
import socket from "../socket";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/appointments/patient");
      setAppointments(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || "Ошибка при загрузке приёмов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const onCreated = (a) => setAppointments((prev) => [a, ...prev]);
    const onUpdated = (a) =>
      setAppointments((prev) => prev.map((p) => (p.id === a.id ? a : p)));
    const onDeleted = (a) =>
      setAppointments((prev) => prev.filter((p) => p.id !== a.id));

    socket.on("appointment:created", onCreated);
    socket.on("appointment:updated", onUpdated);
    socket.on("appointment:deleted", onDeleted);

    return () => {
      socket.off("appointment:created", onCreated);
      socket.off("appointment:updated", onUpdated);
      socket.off("appointment:deleted", onDeleted);
    };
  }, []);

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Мои приёмы</h1>
      <div className="space-y-4">
        {appointments.length === 0 && <div>Записей нет</div>}
        {appointments.map((a) => (
          <AppointmentCard
            key={a.id}
            appointment={a}
            onUpdate={() => load()}
            onDelete={() => load()}
          />
        ))}
      </div>
    </div>
  );
}

export default Appointments;
