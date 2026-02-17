import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { session, role, loading } = useAuth();

  // 1. Si Supabase sigue revisando, mostramos una pequeña carga (NO expulsamos)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 2. Si definitivamente terminó de cargar y NO hay sesión, lo mandamos al login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si hay una restricción de roles y el usuario no cumple, lo mandamos al inicio (No autorizado)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 4. Todo correcto, mostrar el contenido
  return <Outlet />;
};