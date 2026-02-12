import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
// Pages - Públicas
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Combos from "./pages/Combos";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
// Pages - Cliente
import ClientDashboard from "./pages/client/Dashboard";
import Redeem from "./pages/client/Redeem";
// Pages - Admin
import AdminDashboard from "./pages/admin/Dashboard";
import Validator from "./pages/admin/Validator";
import CargarPuntos from "./pages/admin/CargarPuntos";
import Inventory from "./pages/admin/Inventory";
import Vendors from "./pages/admin/Vendors";
import Clients from "./pages/admin/Clients";
import PointCheck from "./pages/admin/PointCheck";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* GRUPO 1: RUTAS PÚBLICAS Y DE CLIENTE (Llevan Header y Footer) */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="/combos" element={<Combos />} />
                <Route path="/premios" element={<Redeem />} />
                <Route path="/nosotros" element={<About />} />
                <Route path="/login" element={<Login />} />
                
                {/* Rutas Cliente (Siguen usando el diseño público) */}
                <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                  <Route path="/cliente/dashboard" element={<ClientDashboard />} />
                </Route>
                
                {/* Página 404 (Con diseño público) */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* GRUPO 2: RUTAS DE ADMIN Y VENDEDOR (Pantalla completa, SIN Header ni Footer) */}
              <Route element={<ProtectedRoute allowedRoles={['vendedor', 'super_admin']} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/validador" element={<Validator />} />
                  <Route path="/admin/consulta" element={<PointCheck />} />
                  <Route path="/admin/cargar-puntos" element={<CargarPuntos />} />
                  <Route path="/admin/inventario" element={<Inventory />} />
                  <Route path="/admin/vendedores" element={<Vendors />} />
                  <Route path="/admin/clientes" element={<Clients />} />
                </Route>
              </Route>

            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;