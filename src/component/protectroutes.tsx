import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  role: number | undefined;
  allowedRoles: number[];
  isLoading: boolean;
}

export const ProtectedRoute = ({
  role,
  allowedRoles,
  isLoading,
}: ProtectedRouteProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">กำลังโหลดสิทธิ์ผู้ใช้...</p>
      </div>
    );
  }

  if (role === undefined || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
