import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-primary">
            MR. HUMO
          </Link>

          {/* Menú de Escritorio */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Iconos de la derecha */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* --- LOGICA DEL BOTÓN DE USUARIO (ESCRITORIO Y TABLET) --- */}
            {session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to={role === 'super_admin' || role === 'vendedor' ? '/admin/dashboard' : '/cliente/dashboard'}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary transition-all h-9"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-bold hidden sm:inline-block">Mi Panel</span>
                    <span className="font-bold sm:hidden">Panel</span>
                  </Button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-md hover:bg-secondary transition-colors text-destructive"
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
                  className="gap-2 bg-transparent border-transparent hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all h-9 shadow-none"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium hidden sm:inline-block">Iniciar Sesión</span>
                </Button>
              </Link>
            )}

            {/* Carrito */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className={`h-5 w-5 text-foreground ${justAdded ? "animate-cart-bounce" : ""}`} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Botón de Menú Móvil */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* --- MENÚ MÓVIL --- */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border bg-background animate-fade-in-up">
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                    location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-border my-2" /> {/* Separador */}

              {/* Opciones de usuario en móvil */}
              {session ? (
                <>
                  <Link
                    to={role === 'super_admin' || role === 'vendedor' ? '/admin/dashboard' : '/cliente/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium py-2 flex items-center gap-2 text-primary"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-bold bg-primary/10 px-3 py-1 rounded-md">Ir a Mi Panel</span>
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-sm font-medium py-2 text-left text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-5 w-5" /> Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-2 text-primary flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  <span className="font-bold bg-primary/10 px-3 py-1 rounded-md w-full">Iniciar Sesión / Registro</span>
                </Link>
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