import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-[85vh] overflow-hidden" style={{
      backgroundImage: 'url(https://media.craiyon.com/2025-09-30/2Jf6dqtFQE-dKByJvJ9GuQ.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 container text-center space-y-6 py-20">
        <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tight text-gradient-gold opacity-0 animate-fade-in-up">
          MR. HUMO
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto opacity-0 animate-fade-in-up [animation-delay:200ms]">
          Tu espacio de vapeo y tabaquería
        </p>
        <div className="opacity-0 animate-fade-in-up [animation-delay:400ms]">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 font-heading font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            EXPLORAR CATÁLOGO
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
