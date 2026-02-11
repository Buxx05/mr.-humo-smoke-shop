import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, QrCode, Upload, Package } from "lucide-react";

export default function AdminLayout() {
  const { role } = useAuth();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Validar Cupón", path: "/admin/validador", icon: <QrCode className="w-5 h-5" /> },
    // Estas opciones solo las verá el dueño (super_admin):
    ...(role === 'super_admin' ? [
      { name: "Cargar Excel", path: "/admin/cargar-puntos", icon: <Upload className="w-5 h-5" /> },
      { name: "Inventario", path: "/admin/inventario", icon: <Package className="w-5 h-5" /> },
    ] : [])
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Sidebar (Menú Lateral) */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-4 space-y-4 shadow-sm z-10">
        <div className="text-xs font-bold text-muted-foreground px-2 uppercase tracking-wider">
          Panel de {role === 'super_admin' ? 'Administración' : 'Ventas'}
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm ${
                location.pathname === link.path 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}