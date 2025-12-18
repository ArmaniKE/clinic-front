import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

function Dashboard() {
  const role = localStorage.getItem("role");
  const auth = useAuth();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    birth_date: "",
    address: "",
  });

  // Загрузка профиля пациента
  useEffect(() => {
    if (role !== "patient") return;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError("");
      try {
        const res = await api.get("/patients/me");
        const data = res.data || {};
        setProfile(data);
        setEditForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          birth_date: data.birth_date ? data.birth_date.split("T")[0] : "",
          address: data.address || "",
        });
      } catch (err) {
        setProfileError(
          err?.response?.data?.error ||
            err?.message ||
            "Ошибка загрузки профиля"
        );
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [role]);

  const handleProfileChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError("");
    try {
      const res = await api.put("/patients/me", editForm);
      setProfile(res.data);
      setEditForm((prev) => ({
        ...prev,
        full_name: res.data.full_name || prev.full_name,
      }));
      alert("Профиль обновлён");
    } catch (err) {
      setProfileError(
        err?.response?.data?.error ||
          err?.message ||
          "Ошибка обновления профиля"
      );
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>

      {role === "patient" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded shadow max-w-md">
            <h2 className="text-xl font-semibold mb-4">Мои данные</h2>
            {profileLoading && <div>Загрузка профиля...</div>}
            {profileError && (
              <div className="text-red-600 mb-2 text-sm">{profileError}</div>
            )}
            {profile && (
              <div className="space-y-1 text-sm text-gray-700 mb-4">
                <div>
                  <span className="font-semibold">ФИО: </span>
                  {profile.full_name || "—"}
                </div>
                <div>
                  <span className="font-semibold">Email: </span>
                  {profile.email || "—"}
                </div>
                <div>
                  <span className="font-semibold">Телефон: </span>
                  {profile.phone || "—"}
                </div>
                <div>
                  <span className="font-semibold">Дата рождения: </span>
                  {profile.birth_date
                    ? new Date(profile.birth_date).toLocaleDateString("ru-RU")
                    : "—"}
                </div>
                <div>
                  <span className="font-semibold">Адрес: </span>
                  {profile.address || "—"}
                </div>
              </div>
            )}

            <h3 className="text-lg font-semibold mb-2">Редактировать</h3>
            <form onSubmit={handleProfileSave} className="space-y-2 text-sm">
              <input
                name="full_name"
                value={editForm.full_name}
                onChange={handleProfileChange}
                placeholder="ФИО"
                className="w-full p-2 border rounded"
              />
              <input
                name="phone"
                value={editForm.phone}
                onChange={handleProfileChange}
                placeholder="Телефон"
                className="w-full p-2 border rounded"
              />
              <input
                name="birth_date"
                type="date"
                value={editForm.birth_date}
                onChange={handleProfileChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="address"
                value={editForm.address}
                onChange={handleProfileChange}
                placeholder="Адрес"
                className="w-full p-2 border rounded"
              />
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded text-sm">
                Сохранить
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded shadow max-w-md">
            <h2 className="text-xl font-semibold mb-4">Пациент</h2>
            <Link to="/book" className="block bg-blue-100 p-3 rounded mb-3">
              Записаться на приём
            </Link>
            <Link
              to="/appointments"
              className="block bg-blue-100 p-3 rounded mb-3"
            >
              История приёмов
            </Link>
            <Link to="/payments" className="block bg-blue-100 p-3 rounded">
              Оплаты
            </Link>
          </div>
        </div>
      )}

      {role === "doctor" && (
        <div className="bg-white p-6 rounded shadow max-w-md">
          <h2 className="text-xl font-semibold mb-4">Врач</h2>
          <Link
            to="/doctor/schedule"
            className="block bg-green-100 p-3 rounded mb-3"
          >
            Моё расписание
          </Link>
          <Link
            to="/doctor/patients"
            className="block bg-green-100 p-3 rounded"
          >
            Пациенты
          </Link>
        </div>
      )}

      {role === "admin" && (
        <div className="bg-white p-6 rounded shadow max-w-md">
          <h2 className="text-xl font-semibold mb-4">Администратор</h2>
          <Link to="/admin" className="block bg-red-100 p-3 rounded">
            Открыть панель администратора
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
