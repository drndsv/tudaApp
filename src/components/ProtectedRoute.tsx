import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    (!user.roles || !allowedRoles.some((role) => user.roles?.includes(role)))
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
