import { useEffect, useState } from "react";
import api from "../api/axios";
import AppointmentCard from "../components/AppointmentCard";
import useAuth from "../hooks/useAuth";

export default function DoctorSchedule() {
  const auth = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useAuth() in DoctorSchedule:", auth);
    const doctorId =
      auth?.user?.id || auth?.userId || auth?.user_id || auth?.currentUser?.id;
    if (!doctorId) {
      console.warn("DoctorSchedule: doctorId not found on auth object");
      setLoading(false);
      setError("ID доктора не найден. Проверьте контекст авторизации.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/appointments?doctor_id=${doctorId}`);
        console.log(
          "GET /appointments?doctor_id response:",
          res.status,
          res.data
        );
        setAppointments(res.data || []);
      } catch (err) {
        console.error("Error loading doctor appointments:", err);
        setError(
          err?.response?.data?.error || err.message || "Ошибка загрузки приёмов"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth]);

  if (loading) return <div className="p-6">Загрузка расписания...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Моё расписание</h1>
      {appointments.length === 0 ? (
        <div className="text-gray-600">Приёмы не найдены</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <AppointmentCard key={a.id} appointment={a} role="doctor" />
          ))}
        </div>
      )}
    </div>
  );
}
