import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth"; // <-- Importamos la autenticación
import CartSheet from "./CartSheet";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Combos", to: "/combos" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Contacto", to: "/#contacto" },
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
            
            {/* LOGICA DEL ICONO DE USUARIO */}
            {session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={role === 'super_admin' || role === 'vendedor' ? '/admin/dashboard' : '/cliente/dashboard'}
                  className="p-2 rounded-md hover:bg-secondary transition-colors text-primary"
                  title="Mi Panel"
                >
                  <User className="h-5 w-5" />
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
              <Link
                to="/login"
                className="hidden md:flex p-2 rounded-md hover:bg-secondary transition-colors"
                title="Iniciar Sesión"
              >
                <User className="h-5 w-5" />
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

        {/* Menú Móvil */}
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
                    className="text-sm font-medium py-2 text-primary flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> Mi Panel
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="text-sm font-medium py-2 text-left text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-2 text-primary flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Iniciar Sesión / Registro
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