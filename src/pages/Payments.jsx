import React, { useEffect, useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function Payments() {
  const { userId } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    async function load() {
      try {
        const res = await api.get(`/payments/patient/${userId}`);
        if (!mounted) return;
        setPayments(res.data || []);
        const sum = res.data?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
        setTotal(sum);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Мои платежи</h1>
      <div className="mb-4 p-4 bg-blue-100 rounded">
        <div className="text-lg">
          Всего оплачено: <strong>{total} ₸</strong>
        </div>
      </div>
      <div className="space-y-2">
        {payments.length === 0 && <div>Платежей нет</div>}
        {payments.map((p) => (
          <div key={p.id} className="p-3 bg-white rounded shadow">
            <div className="font-semibold">Услуга: {p.service_name || "—"}</div>
            <div className="text-sm text-gray-600">Сумма: {p.amount} ₸</div>
            <div className="text-sm text-gray-600">
              Способ: {p.method} | Статус: {p.status}
            </div>
            <div className="text-sm text-gray-600">
              Дата:{" "}
              {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
