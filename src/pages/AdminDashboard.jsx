import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [data, setData] = useState({
    total: 0,
    weekData: [],
    doctorStats: [],
    appointmentCount: 0,
    patientCount: 0,
    doctorCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/dashboard/admin");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Статистика и отчёты</h1>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Общий доход</div>
          <div className="text-3xl font-bold text-green-600">
            {data.total} ₸
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Приёмов</div>
          <div className="text-3xl font-bold text-blue-600">
            {data.appointmentCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Пациентов</div>
          <div className="text-3xl font-bold text-purple-600">
            {data.patientCount}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-600">Врачей</div>
          <div className="text-3xl font-bold text-orange-600">
            {data.doctorCount}
          </div>
        </div>
      </div>

      {/* График доходов (последние 7 дней) */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Доход последние 7 дней</h2>
        <div className="space-y-2">
          {data.weekData.length === 0 ? (
            <div className="text-gray-500">Нет данных</div>
          ) : (
            data.weekData.map((d) => (
              <div key={d.date} className="flex items-center gap-4">
                <div className="w-24 text-sm">
                  {new Date(d.date).toLocaleDateString("ru-RU")}
                </div>
                <div
                  className="flex-1 bg-gray-200 rounded h-6"
                  style={{ width: "100%" }}
                >
                  <div
                    className="bg-green-500 h-6 rounded"
                    style={{
                      width: `${
                        (d.amount /
                          Math.max(...data.weekData.map((x) => x.amount), 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="w-20 text-right font-semibold">
                  {d.amount} ₸
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Доход по врачам */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Доход по врачам</h2>
        <div className="space-y-3">
          {data.doctorStats.length === 0 ? (
            <div className="text-gray-500">Нет данных</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-2">Врач</th>
                  <th className="text-right p-2">Доход (₸)</th>
                  <th className="text-right p-2">% от общего</th>
                </tr>
              </thead>
              <tbody>
                {data.doctorStats.map((d, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{d.full_name || "—"}</td>
                    <td className="text-right p-2 font-semibold">
                      {d.total} ₸
                    </td>
                    <td className="text-right p-2">
                      {data.total > 0
                        ? ((d.total / data.total) * 100).toFixed(1)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
