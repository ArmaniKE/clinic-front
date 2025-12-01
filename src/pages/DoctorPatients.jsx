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
        // проверьте фактический endpoint в вашем бэке; если другой — замените
        const res = await api.get(`/doctor/patients?doctor_id=${doctorId}`);
        console.log("GET /doctor/patients response:", res.status, res.data);
        setPatients(res.data || []);
      } catch (err) {
        console.warn(
          "GET /doctor/patients failed, trying /patients?doctor_id...",
          err
        );
        try {
          const res2 = await api.get(`/patients?doctor_id=${doctorId}`);
          console.log(
            "GET /patients?doctor_id response:",
            res2.status,
            res2.data
          );
          setPatients(res2.data || []);
        } catch (err2) {
          console.error("Error loading patients:", err2);
          setError(
            err2?.response?.data?.error ||
              err2.message ||
              "Ошибка загрузки пациентов"
          );
        }
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
            <li key={p.id} className="p-3 border rounded bg-white">
              {p.full_name ||
                p.name ||
                `${p.first_name || ""} ${p.last_name || ""}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
