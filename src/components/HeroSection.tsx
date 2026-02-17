import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-[90vh] overflow-hidden bg-black">
      
      {/* --- EFECTO DE HUMO VERDE NEÓN (CSS PURO) --- */}
      <div className="absolute inset-0 z-0 opacity-40">
        {/* Capa 1: Humo Verde Principal (#99CC33) - Da el brillo neón */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(153,204,51,0.25)_0%,transparent_50%)] animate-[spin_25s_linear_infinite]" />
        
        {/* Capa 2: Niebla Verde Oscura (#5F8021) - Da profundidad al humo */}
        <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(95,128,33,0.3)_0%,transparent_40%)] animate-[spin_35s_linear_infinite_reverse]" />
      </div>
      
      {/* Overlay oscuro para que el texto se lea perfecto */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/80 z-10" />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-20 container text-center px-4 space-y-8 pt-20">
        
        {/* Badge superior */}
        <div className="inline-block animate-fade-in-up opacity-0 [animation-delay:100ms]">
          <span className="py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wide shadow-[0_0_10px_rgba(153,204,51,0.2)]">
            EST. 2024 • LIMA, PERÚ
          </span>
        </div>

        {/* Título Gigante */}
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white opacity-0 animate-fade-in-up [animation-delay:300ms]">
          MR. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-200 to-primary animate-gradient-x">HUMO</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto leading-relaxed opacity-0 animate-fade-in-up [animation-delay:500ms]">
          Más que una tienda, somos cultura. Encuentra los mejores vapes, bongs y accesorios premium en un solo lugar.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-fade-in-up [animation-delay:700ms]">
          <Link
            to="/catalogo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shadow-[0_0_20px_rgba(153,204,51,0.4)]"
          >
            Ver Catálogo
          </Link>
          <Link
            to="/premios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Club de Puntos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;