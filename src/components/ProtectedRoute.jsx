import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // если нет токена → редирект на логин
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // если роль не входит в список разрешённых → редирект на логин
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // иначе рендерим компонент
  return children;
}

export default ProtectedRoute;
