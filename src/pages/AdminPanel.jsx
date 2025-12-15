import { Link } from "react-router-dom";

export default function AdminPanel() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      <div className="grid gap-4 max-w-md">
        <Link
          to="/admin/dashboard"
          className="block bg-yellow-100 p-3 rounded font-semibold"
        >
          📊 Статистика и отчёты
        </Link>
        <Link to="/admin/doctors" className="block bg-blue-100 p-3 rounded">
          Управление врачами
        </Link>
        <Link to="/admin/patients" className="block bg-blue-100 p-3 rounded">
          Управление пациентами
        </Link>
        <Link to="/admin/services" className="block bg-blue-100 p-3 rounded">
          Управление услугами
        </Link>
        <Link to="/admin/payments" className="block bg-green-100 p-3 rounded">
          Управление платежами
        </Link>
      </div>
    </div>
  );
}
