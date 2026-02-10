import { Link } from "react-router-dom";
import { Facebook, Instagram, Music } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contacto" className="border-t border-border bg-card py-16">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-primary">MR. HUMO</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Av. Principal 123, Lima, Perú</p>
              <p>+51 999 888 777</p>
              <p>contacto@mrhumo.com</p>
              <p>Lun-Sab: 10:00 - 20:00</p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">PRODUCTOS</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/catalogo?categoria=Vapers" className="hover:text-primary transition-colors">Vapers</Link>
              <Link to="/catalogo?categoria=Líquidos" className="hover:text-primary transition-colors">Líquidos</Link>
              <Link to="/catalogo?categoria=Pipas" className="hover:text-primary transition-colors">Pipas y Bongs</Link>
              <Link to="/catalogo?categoria=Accesorios" className="hover:text-primary transition-colors">Accesorios</Link>
              <Link to="/combos" className="hover:text-primary transition-colors">Combos</Link>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">INFORMACIÓN</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/nosotros" className="hover:text-primary transition-colors">Quiénes Somos</Link>
              <a href="#contacto" className="hover:text-primary transition-colors">Contacto</a>
              <span className="cursor-default">Política de Envíos</span>
              <span className="cursor-default">Términos y Condiciones</span>
              <a href="/cliente/login.php" className="hover:text-primary transition-colors">Sistema de Puntos</a>
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-foreground">SÍGUENOS</h4>
            <div className="flex gap-3">
              <a href="https://facebook.com/mrhumo" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com/mrhumo" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://tiktok.com/@mrhumo" target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Music className="h-4 w-4" />
              </a>
            </div>
            <div className="flex gap-2 mt-4">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                OK
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 MR. HUMO - Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;
