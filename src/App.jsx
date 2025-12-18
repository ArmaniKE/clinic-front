import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DoctorSchedule from "./pages/DoctorSchedule";
import AdminPayments from "./pages/AdminPayments";
import BookAppointment from "./pages/BookAppointment";
import Payments from "./pages/Payments";
import AdminPanel from "./pages/AdminPanel";
import CreateUser from "./pages/CreateUser";
import CreateService from "./pages/CreateService";
import AdminDoctors from "./pages/AdminDoctors";
import AdminPatients from "./pages/AdminPatients";
import AdminServices from "./pages/AdminServices";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import Appointments from "./pages/Appointments";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PageLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctor/schedule" element={<DoctorSchedule />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/book/:id" element={<BookAppointment />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/create-user" element={<CreateUser />} />
            <Route path="/admin/create-service" element={<CreateService />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
