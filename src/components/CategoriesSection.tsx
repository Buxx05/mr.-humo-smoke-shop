import { useNavigate } from "react-router-dom";
import { CloudFog, Aperture, Wand2, FlaskConical, Scroll, Scissors, Flame } from "lucide-react";

// 7 categorías con íconos más precisos para un Smoke Shop
const categorias = [
  {
    nombre: "Vapers",
    icon: <CloudFog className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    descripcion: "Dispositivos de última generación",
  },
  {
    nombre: "Grinders",
    icon: <Aperture className="w-8 h-8 text-primary group-hover:rotate-180 transition-transform duration-700" />,
    descripcion: "Muele tu material con precisión",
  },
  {
    nombre: "Pipas",
    icon: <Wand2 className="w-8 h-8 text-primary group-hover:-rotate-12 transition-transform duration-300" />,
    descripcion: "Variedad para todos los estilos",
  },
  {
    nombre: "Bongs",
    icon: <FlaskConical className="w-8 h-8 text-primary group-hover:-translate-y-1 transition-transform duration-300" />,
    descripcion: "Filtrado supremo en cada calada",
  },
  {
    nombre: "Papeles",
    icon: <Scroll className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    descripcion: "Conos, blunts y sedas premium",
  },
  {
    nombre: "Armado",
    icon: <Scissors className="w-8 h-8 text-primary group-hover:rotate-45 transition-transform duration-300" />,
    descripcion: "Filtros, enroladoras y complementos",
  },
  {
    nombre: "Accesorios",
    icon: <Flame className="w-8 h-8 text-primary group-hover:scale-125 transition-transform duration-300" />,
    descripcion: "Encendedores, mechas y sopletes",
  },
];

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 animate-fade-in relative border-b border-border/50 overflow-hidden">
      {/* Brillo de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container px-0 relative z-10">
        
        {/* Títulos */}
        <div className="text-center mb-10 md:mb-16 space-y-3 px-4">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Nuestras <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">Categorías</span>
          </h2>
          <p className="text-muted-foreground font-medium text-sm md:text-lg max-w-2xl mx-auto">
            Explora nuestra selección premium. Desliza para ver más.
          </p>
        </div>
        
        {/* CARRUSEL DE UNA SOLA FILA (Swipe en móvil, centrado en PC) */}
        {/* Se usa [-ms-overflow-style:none] y [scrollbar-width:none] para ocultar la fea barra de scroll */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 md:px-8 pb-8 xl:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              onClick={() => navigate(`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`)}
              className="shrink-0 w-[140px] md:w-[160px] xl:w-[170px] snap-center flex flex-col items-center justify-start gap-3 rounded-3xl bg-card border border-border p-5 md:p-6 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/30 hover:shadow-[0_10px_30px_rgba(153,204,51,0.15)] hover:-translate-y-1 focus:outline-none group relative overflow-hidden"
              style={{ minHeight: '160px' }}
            >
              {/* Círculo del Ícono con Neón */}
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-primary/10 mb-1 group-hover:shadow-[0_0_20px_rgba(153,204,51,0.2)] group-hover:bg-primary/20 transition-all duration-300 border border-primary/20 shrink-0">
                {cat.icon}
              </div>
              
              <span className="font-black text-sm md:text-base text-foreground text-center leading-tight">
                {cat.nombre}
              </span>
              
              {/* La descripción se oculta en celulares muy chicos para que no se rompa el diseño */}
              <span className="text-[10px] md:text-xs text-muted-foreground text-center leading-relaxed font-medium hidden sm:block">
                {cat.descripcion}
              </span>
              
              {/* Borde dinámico que aparece al pasar el mouse */}
              <span className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 pointer-events-none transition-all duration-300" />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;