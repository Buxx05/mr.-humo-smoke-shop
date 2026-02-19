import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, SearchCheck, Upload, Package, Users, UsersRound, ShieldCheck, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { role } = useAuth();
  
  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* --- CABECERA DE BIENVENIDA --- */}
      <div className="flex items-center gap-4 bg-secondary/20 p-6 rounded-2xl border border-border/50">
        <div className="bg-primary/20 p-4 rounded-xl text-primary hidden sm:block">
          <LayoutDashboard className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black font-heading text-foreground tracking-tight">
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
              {role === 'super_admin' ? 'Administrador' : 'Equipo de Ventas'}
            </span> 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium">
            {role === 'super_admin' 
              ? 'Bienvenido a tu centro de mando. Tienes control total sobre la tienda.' 
              : 'Bienvenido a tu turno. ¿Qué operación realizaremos hoy?'}
          </p>
        </div>
      </div>

      {/* --- SECCIÓN 1: OPERATIVA DE CAJA (VISIBLE PARA TODOS) --- */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest px-2 flex items-center gap-2">
          <QrCode className="w-4 h-4" /> Operativa en Caja
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link to="/admin/validador" className="block outline-none group">
            <Card className="h-full bg-card hover:bg-secondary/20 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(153,204,51,0.15)] hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">Atención al Cliente</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <QrCode className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-foreground">Validar Canje</div>
                <p className="text-sm text-muted-foreground mt-1">Escanear o ingresar código de premio</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/consulta" className="block outline-none group">
            <Card className="h-full bg-card hover:bg-secondary/20 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(153,204,51,0.15)] hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">Información</CardTitle>
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <SearchCheck className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-foreground">Consultar Saldo</div>
                <p className="text-sm text-muted-foreground mt-1">Ver puntos y cupones por DNI</p>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>

      {/* --- SECCIÓN 2: ADMINISTRACIÓN (SOLO SUPER ADMIN) --- */}
      {role === 'super_admin' && (
        <div className="space-y-4 pt-4 border-t border-border/50">
          <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest px-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Gestión Gerencial
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link to="/admin/cargar-puntos" className="block outline-none group">
              <Card className="h-full bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(153,204,51,0.2)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-bold text-primary">Operaciones</CardTitle>
                  <Upload className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-black text-primary">Cargar Excel</div>
                  <p className="text-sm text-muted-foreground mt-1">Subir reporte de ventas</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/inventario" className="block outline-none group">
              <Card className="h-full bg-card hover:bg-secondary/20 border-border hover:border-foreground/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Catálogo</CardTitle>
                  <Package className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground">Inventario</div>
                  <p className="text-sm text-muted-foreground mt-1">Productos y Combos</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/clientes" className="block outline-none group">
              <Card className="h-full bg-card hover:bg-secondary/20 border-border hover:border-foreground/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Base de Datos</CardTitle>
                  <UsersRound className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground">Clientes</div>
                  <p className="text-sm text-muted-foreground mt-1">Directorio de usuarios</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/vendedores" className="block outline-none group">
              <Card className="h-full bg-card hover:bg-secondary/20 border-border hover:border-foreground/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">Personal</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground">Vendedores</div>
                  <p className="text-sm text-muted-foreground mt-1">Accesos y permisos</p>
                </CardContent>
              </Card>
            </Link>

          </div>
        </div>
      )}
      
    </div>
  );
};

export default AdminDashboard;