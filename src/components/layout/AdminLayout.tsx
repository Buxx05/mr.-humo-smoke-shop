import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, QrCode, Upload, Package, Users, UsersRound, LogOut, SearchCheck } from "lucide-react"; 

export default function AdminLayout() {
  const { role, signOut } = useAuth(); // <--- Extraemos signOut
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    
    // SOLO VENDEDORES
    ...(role === 'vendedor' ? [
      { name: "Validar Cupón", path: "/admin/validador", icon: <QrCode className="w-5 h-5" /> },
      { name: "Consultar Puntos", path: "/admin/consulta", icon: <SearchCheck className="w-5 h-5" /> }, // <--- NUEVA OPCIÓN
    ] : []),

    // SOLO SUPER ADMIN
    ...(role === 'super_admin' ? [
      { name: "Vendedores", path: "/admin/vendedores", icon: <Users className="w-5 h-5" /> },
      { name: "Clientes", path: "/admin/clientes", icon: <UsersRound className="w-5 h-5" /> },
      { name: "Inventario", path: "/admin/inventario", icon: <Package className="w-5 h-5" /> },
      { name: "Cargar Puntos", path: "/admin/cargar-puntos", icon: <Upload className="w-5 h-5" /> },
    ] : [])
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/20">
      {/* Sidebar (Menú Lateral) */}
      <aside className="w-full md:w-64 bg-card border-r border-border p-4 flex flex-col shadow-sm z-10 sticky top-0 h-screen">
        <div className="text-xs font-bold text-muted-foreground px-2 uppercase tracking-wider mb-4">
          Panel de {role === 'super_admin' ? 'Administración' : 'Ventas'}
        </div>
        
        {/* Lista de Enlaces */}
        <nav className="flex flex-col gap-2 flex-1">
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

        {/* Botón de Cerrar Sesión (Al final) */}
        <div className="pt-4 mt-4 border-t border-border">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
}