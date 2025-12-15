import { Link } from "react-router-dom";

function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>

      {role === "patient" && (
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
