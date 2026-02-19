import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, QrCode, Upload, Package, Users, UsersRound, 
  LogOut, SearchCheck, ShieldCheck, Menu, X 
} from "lucide-react"; 
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const { role, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. OPCIONES COMPARTIDAS (Operativa de caja)
  const commonLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Validar Cupón", path: "/admin/validador", icon: <QrCode className="w-5 h-5" /> },
    { name: "Consultar Puntos", path: "/admin/consulta", icon: <SearchCheck className="w-5 h-5" /> },
  ];

  // 2. OPCIONES EXCLUSIVAS (Solo super_admin)
  const adminLinks = role === 'super_admin' ? [
    { name: "Cargar Puntos (Excel)", path: "/admin/cargar-puntos", icon: <Upload className="w-5 h-5" /> },
    { name: "Inventario & Combos", path: "/admin/inventario", icon: <Package className="w-5 h-5" /> },
    { name: "Base de Clientes", path: "/admin/clientes", icon: <UsersRound className="w-5 h-5" /> },
    { name: "Gestión Vendedores", path: "/admin/vendedores", icon: <Users className="w-5 h-5" /> },
  ] : [];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 custom-scrollbar mt-4 md:mt-0">
      {/* Título de sección */}
      <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest px-3 mb-1">
        {role === 'super_admin' ? 'Operativa' : 'Menú Principal'}
      </div>
      
      {commonLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              isActive 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-transparent"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        );
      })}

      {/* Separador y Opciones de Admin */}
      {role === 'super_admin' && (
        <>
          <div className="h-px bg-border/50 my-4 mx-3"></div>
          <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest px-3 mb-1">
            Administración
          </div>
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                    : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </>
      )}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* --- BARRA SUPERIOR MÓVIL (Solo se ve en celulares) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <Link to="/admin/dashboard" className="font-heading text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
          MR. HUMO
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-card border-r-border/50" aria-describedby={undefined}>
            <div className="p-6 flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="font-heading text-2xl font-black text-primary">MR. HUMO</span>
              </div>
              <div className="flex items-center gap-2 mb-6 text-xs font-black text-foreground uppercase tracking-wider bg-secondary p-3 rounded-lg border border-border">
                <ShieldCheck className={`w-4 h-4 ${role === 'super_admin' ? 'text-primary' : 'text-blue-400'}`} />
                {role === 'super_admin' ? 'Super Admin' : 'Ventas'}
              </div>
              <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
              <div className="pt-4 mt-auto border-t border-border">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-black text-sm border border-destructive/20"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* --- SIDEBAR DESKTOP (Menú Lateral para PC) --- */}
      <aside className="hidden md:flex w-72 bg-card border-r border-border/50 flex-col shadow-xl z-10 h-screen relative">
        <div className="p-6">
          <Link to="/" className="flex items-center justify-center bg-background py-4 rounded-xl border border-border hover:border-primary/30 transition-colors shadow-inner">
            <span className="font-heading text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400 tracking-tight">
              MR. HUMO
            </span>
          </Link>
          <div className="flex items-center gap-3 mt-4 text-xs font-black text-foreground uppercase tracking-widest bg-secondary/50 p-3 rounded-xl border border-border shadow-sm">
            <div className={`p-1.5 rounded-md ${role === 'super_admin' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            {role === 'super_admin' ? 'Super Admin' : 'Caja / Ventas'}
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col px-4 pb-6">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-border/50 bg-secondary/10">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all font-black text-sm border border-transparent hover:border-destructive/50"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* En móviles, añadimos un espacio arriba para compensar la barra fija */}
        <div className="h-16 md:hidden shrink-0 bg-background" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>

    </div>
  );
}