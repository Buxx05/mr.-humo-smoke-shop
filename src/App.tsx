// src/App.tsx
import { Suspense, lazy } from "react";
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

// Pages - Públicas (Carga inmediata)
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Combos from "./pages/Combos";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/ScrollToTop";

// Pages - Privadas (Carga Perezosa / Lazy Loading)
const ClientDashboard = lazy(() => import("./pages/client/Dashboard"));
const Redeem = lazy(() => import("./pages/client/Redeem"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Validator = lazy(() => import("./pages/admin/Validator"));
const CargarPuntos = lazy(() => import("./pages/admin/CargarPuntos"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Vendors = lazy(() => import("./pages/admin/Vendors"));
const Clients = lazy(() => import("./pages/admin/Clients"));
const PointCheck = lazy(() => import("./pages/admin/PointCheck"));

// Componente de carga visual
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
  </div>
);

// Optimización: Evitar que React Query recargue todo al cambiar de pestaña
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            {/* Suspense envuelve las rutas para mostrar el Loader mientras descargan */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* GRUPO 1: RUTAS PÚBLICAS Y DE CLIENTE (Llevan Header y Footer) */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalogo" element={<Catalog />} />
                  <Route path="/combos" element={<Combos />} />
                  <Route path="/premios" element={<Redeem />} />
                  <Route path="/nosotros" element={<About />} />
                  <Route path="/contacto" element={<Contact />} />
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
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;