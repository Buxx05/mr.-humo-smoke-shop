import { Link } from "react-router-dom";
import { Facebook, Instagram, Music2, MapPin, Phone, ChevronRight, Store, Clock } from "lucide-react";

const Footer = () => {
  const WHATSAPP_NUMBER = "51935342437";
  
  return (
    <footer className="bg-black text-white border-t border-white/10 pt-16 md:pt-24 pb-8 relative overflow-hidden">
      
      {/* Brillo de fondo sutil */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* GRID PRINCIPAL REESTRUCTURADO: 4 - 2 - 3 - 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Columna 1: Marca y Redes (Toma 4 columnas para más espacio) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-start">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="Mr. Humo Logo" 
                className="w-36 md:w-44 h-auto object-contain drop-shadow-[0_0_15px_rgba(153,204,51,0.3)] hover:scale-105 transition-transform duration-300" 
              />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium max-w-sm">
              Elevando la cultura del buen humo. Encuentra los mejores vapes, bongs y accesorios premium en Lima con total garantía y asesoría real.
            </p>
            
            <div className="flex gap-3 pt-2">
              <a href="https://www.instagram.com/mr.humo_peru/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(153,204,51,0.3)]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100076200017322&sk=about" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(153,204,51,0.3)]">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@mrhumo.pe" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(153,204,51,0.3)]">
                <Music2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Columna 2: Navegación (Toma 2 columnas, es más compacta) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-black mb-6 text-zinc-100 uppercase tracking-widest">
              Navegación
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Inicio", path: "/" },
                { name: "Catálogo", path: "/catalogo" },
                { name: "Club VIP", path: "/premios" },
                { name: "Nuestra Historia", path: "/nosotros" },
                { name: "Contacto", path: "/contacto" },
                { name: "Mi Panel", path: "/cliente/dashboard" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-zinc-400 hover:text-primary transition-colors flex items-center gap-2 text-sm group font-medium w-max">
                    <ChevronRight className="w-4 h-4 text-primary opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Tiendas (Toma 3 columnas) */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-black mb-6 text-zinc-100 uppercase tracking-widest">
              Tiendas
            </h3>
            <div className="space-y-8">
              <div className="group">
                <h4 className="font-bold text-primary text-sm flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4" /> Sede Principal
                </h4>
                <p className="flex items-start gap-3 text-zinc-400 text-sm group-hover:text-zinc-200 transition-colors">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" />
                  <span>Villa El Salvador<br/>LIMA 42</span>
                </p>
              </div>
              <div className="group">
                <h4 className="font-bold text-primary text-sm flex items-center gap-2 mb-3">
                  <Store className="w-4 h-4" /> Sede Secundaria
                </h4>
                <p className="flex items-start gap-3 text-zinc-400 text-sm group-hover:text-zinc-200 transition-colors">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" />
                  <span>Villa El Salvador<br/>LIMA 42</span>
                </p>
              </div>
            </div>
          </div>

          {/* Columna 4: Atención (Toma 3 columnas) */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-black mb-6 text-zinc-100 uppercase tracking-widest">
              Atención
            </h3>
            <ul className="space-y-5">
              <li>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 text-zinc-400 hover:text-white transition-all duration-300 group bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 hover:border-[#25D366]/50 hover:bg-zinc-900 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors shrink-0 shadow-inner">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#25D366] mb-1 uppercase tracking-widest">Chat Ventas</p>
                    <p className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors">+51 935 342 437</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-4 text-zinc-400 p-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary mb-1 uppercase tracking-widest">Horario de Atención</p>
                    <p className="text-sm font-medium leading-relaxed">Lun - Dom: 9:30 - 21:00<br/>Sábados: 9:30 - 22:00</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs md:text-sm">
          <p className="text-zinc-500 font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} Mr. Humo Smoke Shop.<br className="md:hidden" /> Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-zinc-500 font-bold uppercase tracking-wider text-[10px] md:text-xs">
            <Link to="/terminos" className="hover:text-primary transition-colors">Términos</Link>
            <span className="opacity-20 hidden md:inline">|</span>
            <Link to="/privacidad" className="hover:text-primary transition-colors">Privacidad</Link>
            <span className="opacity-20 hidden md:inline">|</span>
            <Link to="/contacto" className="hover:text-primary transition-colors">Reclamos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;