import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext"; 
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Combos from "./pages/Combos";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
// NUEVOS IMPORTS:
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import ClientDashboard from "./pages/client/Dashboard";
import Redeem from "./pages/client/Redeem";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Validator from "./pages/admin/Validator";
import CargarPuntos from "./pages/admin/CargarPuntos";
import Inventory from "./pages/admin/Inventory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/premios" element={<Redeem />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/login" element={<Login />} />
              {/* RUTAS PRIVADAS - SOLO PARA CLIENTES */}
              <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                <Route path="/cliente/dashboard" element={<ClientDashboard />} />
              </Route>
              {/* RUTAS PRIVADAS - SOLO PARA ADMIN Y VENDEDORES */}
              <Route element={<ProtectedRoute allowedRoles={['vendedor', 'super_admin']} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/validador" element={<Validator />} />
                  <Route path="/admin/cargar-puntos" element={<CargarPuntos />} />
                  <Route path="/admin/inventario" element={<Inventory />} /> {/* <-- NUEVA RUTA AQUÍ */}
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;