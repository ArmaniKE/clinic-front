import React, { useEffect, useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function DoctorPatients() {
  const auth = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useAuth() in DoctorPatients:", auth);
    const doctorId =
      auth?.user?.id || auth?.userId || auth?.user_id || auth?.currentUser?.id;
    if (!doctorId) {
      setLoading(false);
      setError("ID доктора не найден. Проверьте аутентификацию.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/patients/doctor/${doctorId}`);
        console.log("GET /patients/doctor response:", res.status, res.data);
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error loading patients:", err);
        setError(
          err?.response?.data?.error ||
            err.message ||
            "Ошибка загрузки пациентов"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth]);

  if (loading) return <div className="p-6">Загрузка пациентов...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Пациенты</h1>
      {patients.length === 0 ? (
        <div className="text-gray-600">Пациенты не найдены</div>
      ) : (
        <ul className="space-y-2">
          {patients.map((p) => (
            <li key={p.user_id || p.id} className="p-4 border rounded bg-white">
              <div className="font-semibold text-lg">
                {p.full_name ||
                  p.name ||
                  `${p.first_name || ""} ${p.last_name || ""}`}
              </div>
              <div className="text-sm text-gray-700 mt-1 space-y-1">
                {p.email && <div>Email: {p.email}</div>}
                {p.phone && <div>Телефон: {p.phone}</div>}
                {p.birth_date && (
                  <div>
                    Дата рождения:{" "}
                    {new Date(p.birth_date).toLocaleDateString("ru-RU")}
                  </div>
                )}
                {p.address && <div>Адрес: {p.address}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
