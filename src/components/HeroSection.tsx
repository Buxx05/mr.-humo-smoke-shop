import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-[90vh] md:min-h-screen overflow-hidden bg-black selection:bg-primary/30 selection:text-primary">
      
      {/* --- EFECTO DE HUMO VERDE NEÓN (CSS PURO) --- */}
      <div className="absolute inset-0 z-0 opacity-40 md:opacity-50 mix-blend-screen pointer-events-none">
        {/* Capa 1: Humo Verde Principal (#99CC33) - Da el brillo neón */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(153,204,51,0.25)_0%,transparent_50%)] animate-[spin_25s_linear_infinite]" />
        
        {/* Capa 2: Niebla Verde Oscura (#5F8021) - Da profundidad al humo */}
        <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(95,128,33,0.3)_0%,transparent_40%)] animate-[spin_35s_linear_infinite_reverse]" />
      </div>
      
      {/* Overlay oscuro para que el texto se lea perfecto */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/80 z-10 pointer-events-none" />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-20 container text-center px-4 md:px-8 space-y-6 md:space-y-8 pt-20 md:pt-0 flex flex-col items-center justify-center h-full">
        
        {/* Badge superior */}
        <div className="inline-block animate-fade-in-up opacity-0 [animation-delay:100ms] [animation-fill-mode:forwards]">
          <span className="flex items-center gap-2 py-1.5 px-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs md:text-sm font-black tracking-widest shadow-[0_0_15px_rgba(153,204,51,0.2)] uppercase">
            <Sparkles className="w-3.5 h-3.5" /> EST. 2024 • LIMA, PERÚ
          </span>
        </div>

        {/* Título Gigante */}
        <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white opacity-0 animate-fade-in-up [animation-delay:300ms] [animation-fill-mode:forwards] leading-none drop-shadow-2xl">
          MR. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-300 to-primary animate-gradient-x drop-shadow-[0_0_30px_rgba(153,204,51,0.4)]">HUMO</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up [animation-delay:500ms] [animation-fill-mode:forwards] font-medium">
          Más que una tienda, somos cultura. Encuentra los mejores vapes, bongs y accesorios premium en un solo lugar.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 md:pt-8 w-full sm:w-auto opacity-0 animate-fade-in-up [animation-delay:700ms] [animation-fill-mode:forwards]">
          <Link
            to="/catalogo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 md:py-4.5 font-black text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shadow-[0_0_30px_rgba(153,204,51,0.3)] hover:shadow-[0_0_40px_rgba(153,204,51,0.5)] active:scale-95 text-base"
          >
            Explorar Catálogo
          </Link>
          <Link
            to="/premios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 md:py-4.5 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 text-base group"
          >
            Club VIP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;