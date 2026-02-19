import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, ShieldCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth"; 
import CartSheet from "./CartSheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Combos", to: "/combos" },
  { label: "Premios", to: "/premios" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Contacto", to: "/contacto" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems, justAdded } = useCart();
  const location = useLocation();
  
  // Extraemos la sesión y la función para cerrar sesión
  const { session, role, signOut } = useAuth(); 

  // Cierra el menú móvil automáticamente si cambias de página
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto relative">
          
          {/* LOGO */}
          <Link to="/" className="font-heading text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300 hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(153,204,51,0.2)]">
            MR. HUMO
          </Link>

          {/* MENÚ DE ESCRITORIO */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm transition-all duration-300 relative py-2 ${
                    isActive 
                      ? "font-black text-primary" 
                      : "font-medium text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {/* Puntito verde debajo del link activo */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(153,204,51,0.8)]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ICONOS DE LA DERECHA */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* --- LOGICA DEL BOTÓN DE USUARIO (ESCRITORIO Y TABLET) --- */}
            {session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to={role === 'super_admin' || role === 'vendedor' ? '/admin/dashboard' : '/cliente/dashboard'}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(153,204,51,0.4)] transition-all h-10 px-4 rounded-full font-bold"
                  >
                    {role === 'super_admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    <span>Mi Panel</span>
                  </Button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-full hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
             ) : (
              <Link to="/login" className="hidden md:block">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2 bg-secondary/50 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all h-10 px-5 rounded-full font-bold shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Entrar / Unirme</span>
                </Button>
              </Link>
            )}

            {/* CARRITO */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className={`h-5 w-5 text-foreground ${justAdded ? "animate-cart-bounce text-primary" : ""}`} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-black text-primary-foreground shadow-[0_0_10px_rgba(153,204,51,0.5)]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* BOTÓN DE MENÚ MÓVIL */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-full bg-secondary/50 border border-border text-foreground hover:bg-secondary transition-all"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* --- MENÚ MÓVIL (Overlay Estilo Glassmorphism) --- */}
        {mobileOpen && (
          <nav className="absolute top-[100%] left-0 w-full md:hidden border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl animate-fade-in-up origin-top">
            <div className="flex flex-col px-4 py-6 gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-base py-3 px-4 rounded-xl transition-all flex items-center gap-3 ${
                      isActive 
                        ? "font-black text-primary bg-primary/10 border border-primary/20" 
                        : "font-medium text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {isActive && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="h-px bg-border/50 my-4 mx-2" /> {/* Separador */}

              {/* OPCIONES DE USUARIO EN MÓVIL */}
              {session ? (
                <div className="flex flex-col gap-3 px-2">
                  <Link
                    to={role === 'super_admin' || role === 'vendedor' ? '/admin/dashboard' : '/cliente/dashboard'}
                    className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-black shadow-[0_0_15px_rgba(153,204,51,0.2)]"
                  >
                    {role === 'super_admin' ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    Ir a Mi Panel
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-colors"
                  >
                    <LogOut className="h-5 w-5" /> Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="px-2">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-black shadow-[0_0_15px_rgba(153,204,51,0.2)]"
                  >
                    <User className="h-5 w-5" />
                    Iniciar Sesión / Registro
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;