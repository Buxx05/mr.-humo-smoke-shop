// src/App.tsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Flame } from "lucide-react"; // Importamos el ícono de la llama

// Proveedores (Contexts)
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Layouts y Componentes Base
import { PublicLayout } from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Pages - Públicas (Carga inmediata para SEO y velocidad)
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Combos from "./pages/Combos";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Contact from "./pages/Contact";
import AgeVerification from "./components/AgeVerification";
import CookieBanner from "./components/CookieBanner";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";


// Pages - Privadas (Carga Perezosa / Lazy Loading para no saturar al usuario)
const ClientDashboard = lazy(() => import("./pages/client/Dashboard"));
const Redeem = lazy(() => import("./pages/client/Redeem"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Validator = lazy(() => import("./pages/admin/Validator"));
const CargarPuntos = lazy(() => import("./pages/admin/CargarPuntos"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Vendors = lazy(() => import("./pages/admin/Vendors"));
const Clients = lazy(() => import("./pages/admin/Clients"));
const PointCheck = lazy(() => import("./pages/admin/PointCheck"));

// --- COMPONENTE DE CARGA VIP (Loader Temático) ---
const PageLoader = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
    <div className="relative">
      {/* Brillo de fondo */}
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
      {/* Llama saltando */}
      <div className="bg-primary/10 p-4 rounded-full border border-primary/20 relative z-10 animate-bounce">
        <Flame className="w-10 h-10 text-primary" />
      </div>
    </div>
    <span className="text-sm font-black tracking-widest uppercase text-muted-foreground animate-pulse">
      Encendiendo...
    </span>
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
          {/* Alertas */}
          <Toaster />
          <Sonner />
          
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />

            <AgeVerification />
            <CookieBanner />
            {/* Suspense muestra el Loader mientras se descargan las páginas "lazy" */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                
                {/* --- GRUPO 1: RUTAS PÚBLICAS Y DE CLIENTE (Llevan Header y Footer) --- */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalogo" element={<Catalog />} />
                  <Route path="/combos" element={<Combos />} />
                  <Route path="/premios" element={<Redeem />} />
                  <Route path="/nosotros" element={<About />} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/terminos" element={<Terms />} />
                  <Route path="/privacidad" element={<Privacy />} />
                  
                  {/* Rutas Privadas del Cliente */}
                  <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
                    <Route path="/cliente/dashboard" element={<ClientDashboard />} />
                  </Route>
                  
                  {/* Error 404 */}
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* --- GRUPO 2: RUTAS DE ADMIN Y VENDEDOR (Pantalla completa, SIN Header ni Footer) --- */}
                <Route element={<ProtectedRoute allowedRoles={['vendedor', 'super_admin']} />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/validador" element={<Validator />} />
                    <Route path="/admin/consulta" element={<PointCheck />} />
                    <Route path="/admin/cargar-puntos" element={<CargarPuntos />} />
                    
                    {/* Rutas exclusivas para Super Admin (Opcional, si quieres dividirlas en el ProtectedRoute después) */}
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