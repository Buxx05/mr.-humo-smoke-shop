import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, SearchCheck, Upload, Package, Users, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { role } = useAuth();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-heading text-primary">
          Hola, {role === 'super_admin' ? 'Administrador' : 'Vendedor'} 👋
        </h1>
        <p className="text-muted-foreground">
          {role === 'super_admin' 
            ? 'Bienvenido al panel de gestión gerencial.' 
            : 'Listo para atender. ¿Qué deseas hacer hoy?'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* --- VISTA EXCLUSIVA PARA VENDEDORES (OPERATIVA) --- */}
        {role === 'vendedor' && (
          <>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <Link to="/admin/validador">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Atención en Caja</CardTitle>
                  <QrCode className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold group-hover:text-primary">Validar Canje</div>
                  <p className="text-xs text-muted-foreground mt-1">Ingresar código de premio</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <Link to="/admin/consulta">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Información</CardTitle>
                  <SearchCheck className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold group-hover:text-primary">Consultar Puntos</div>
                  <p className="text-xs text-muted-foreground mt-1">Ver saldo por DNI</p>
                </CardContent>
              </Link>
            </Card>
          </>
        )}

        {/* --- VISTA EXCLUSIVA PARA SUPER ADMIN (GERENCIAL) --- */}
        {role === 'super_admin' && (
          <>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group border-purple-200 bg-purple-50/10">
              <Link to="/admin/cargar-puntos">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Operaciones</CardTitle>
                  <Upload className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">Cargar Excel</div>
                  <p className="text-xs text-muted-foreground mt-1">Subir puntos de ventas</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <Link to="/admin/inventario">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Logística</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Inventario</div>
                  <p className="text-xs text-muted-foreground mt-1">Gestionar productos y combos</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <Link to="/admin/vendedores">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Equipo</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Vendedores</div>
                  <p className="text-xs text-muted-foreground mt-1">Gestionar personal</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <Link to="/admin/clientes">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                  <UsersRound className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Clientes</div>
                  <p className="text-xs text-muted-foreground mt-1">Base de datos de usuarios</p>
                </CardContent>
              </Link>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;