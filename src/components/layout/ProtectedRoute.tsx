import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles: ('cliente' | 'vendedor' | 'super_admin')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { role, loading, session } = useAuth();

  // 1. Mientras Supabase verifica la sesión, mostramos un cargando
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 2. Si no hay sesión iniciada, lo mandamos al login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si tiene sesión, pero su rol no está permitido en esta ruta, lo mandamos a su panel correspondiente
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'super_admin' || role === 'vendedor' ? '/admin/dashboard' : '/cliente/dashboard'} replace />;
  }

  // 4. Si todo está correcto, lo dejamos pasar a la página
  return <Outlet />;
};