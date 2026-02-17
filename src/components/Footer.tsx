import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, ChevronRight, Store, Clock } from "lucide-react";

const Footer = () => {
  const WHATSAPP_NUMBER = "51986170583";
  
  return (
    <footer className="bg-black text-white border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca y Redes */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              {/* Si prefieres usar la imagen de tu logo, descomenta la siguiente línea y borra el <span> */}
              {/* <img src="/logo.png" alt="Mr. Humo Logo" className="h-10 w-auto object-contain" /> */}
              <span className="font-heading text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
                MR. HUMO
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Elevando la cultura del buen humo. Encuentra los mejores vapes, bongs y accesorios premium en Lima con total garantía y asesoría real.
            </p>
            
            {/* Redes Sociales */}
            <div className="flex gap-4 pt-4">
              <a href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:border-primary transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              {/* TikTok no viene por defecto en lucide, puedes usar un icono genérico o SVG si necesitas */}
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-200">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(153,204,51,0.5)]"></span>
              Navegación
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Inicio", path: "/" },
                { name: "Catálogo de Productos", path: "/catalogo" },
                { name: "Club de Puntos", path: "/premios" },
                { name: "Nuestra Historia", path: "/nosotros" },
                { name: "Ir a Mi Panel", path: "/cliente/dashboard" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm group font-medium">
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Tiendas físicas */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-200">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(153,204,51,0.5)]"></span>
              Nuestras Tiendas
            </h3>
            <div className="space-y-6">
              {/* Tienda 1 */}
              <div>
                <h4 className="font-bold text-primary text-sm flex items-center gap-2 mb-2">
                  <Store className="w-4 h-4" /> Sede Av. Revolución
                </h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <p className="flex items-start gap-2 hover:text-gray-200 transition-colors">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                    <span>Av. Revolucion 1824<br/>Villa el Salvador, Lima</span>
                  </p>
                </div>
              </div>
              
              {/* Tienda 2 */}
              <div>
                <h4 className="font-bold text-primary text-sm flex items-center gap-2 mb-2">
                  <Store className="w-4 h-4" /> Sede 2 (VES)
                </h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <p className="flex items-start gap-2 hover:text-gray-200 transition-colors">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                    <span>Sector X Grupo Y<br/>Villa el Salvador, Lima</span> {/* CÁMBIALO LUEGO */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna 4: Contacto WhatsApp */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-200">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(153,204,51,0.5)]"></span>
              Atención al Cliente
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group bg-white/5 p-3 rounded-xl border border-white/5 hover:border-green-500/50"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-black transition-colors shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-green-500 font-bold mb-0.5 uppercase tracking-wider">Chat Ventas</p>
                    <p className="text-sm font-medium">+51 986 170 583</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400 p-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-bold mb-0.5 uppercase tracking-wider">Horario</p>
                    <p className="text-sm">Lun - Dom: 9:30 - 21:00<br/>Sáb. - Dom: 9:30 - 22:00</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* CINTA INFERIOR (Copyright) */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Mr. Humo Smoke Shop. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
            <Link to="/contacto" className="hover:text-primary transition-colors">Términos y Condiciones</Link>
            <span className="opacity-30">|</span>
            <Link to="/contacto" className="hover:text-primary transition-colors">Políticas de Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;