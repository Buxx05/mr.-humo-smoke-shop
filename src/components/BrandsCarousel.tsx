// AQUÍ PONES TUS MARCAS REALES (Recuerda subir las imágenes a tu carpeta public/brands/)
const BRANDS = [
  { name: "Blunt_wrap", logo: "/brands/BLUNT_WRAP_BE.png" },
  { name: "Bob", logo: "/brands/BOB_BE.png" }, 
  { name: "Geek_vape", logo: "/brands/GEEK_VAPE_BE.png" },
  { name: "ocb_1", logo: "/brands/OCB_BE.png" },
  { name: "show_blunt", logo: "/brands/SHOW_BE.png" },
  { name: "smok", logo: "/brands/SMOK_BE.png" },
  { name: "smoking", logo: "/brands/SMOKING_BE.png" },
  { name: "Uwell", logo: "/brands/UWELL_BE.png" },
  { name: "Vaporever", logo: "/brands/VAPOREVER_BE.png" },
  { name: "VOOPOO", logo: "/brands/VOOPOO_BE.png" },
  { name: "Yumi", logo: "/brands/YUMI_BE.png" },
];

const BrandsCarousel = () => {
  return (
    <div className="py-10 md:py-16 bg-background/50 border-y border-border/50 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-xs md:text-sm font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-primary/50 hidden sm:block"></span>
          Trabajamos con las mejores marcas
          <span className="w-8 h-[1px] bg-primary/50 hidden sm:block"></span>
        </p>
      </div>

      {/* CONTENEDOR DE LA ANIMACIÓN CON SOPORTE PARA TODOS LOS NAVEGADORES */}
      <div 
        className="relative flex w-full overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div className="flex animate-scroll hover:[animation-play-state:paused] gap-8 md:gap-16 min-w-max items-center">
          
          {/* PRIMERA VUELTA DE LOGOS */}
          {BRANDS.map((brand, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center w-32 md:w-40 lg:w-48 h-24 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 cursor-pointer hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(153,204,51,0.3)]"
            >
              <img src={brand.logo} alt={brand.name} className="max-h-24 md:max-h-28 object-contain" loading="lazy" />
            </div>
          ))}

          {/* SEGUNDA VUELTA (DUPLICADA PARA EL EFECTO INFINITO) */}
          {BRANDS.map((brand, index) => (
            <div 
              key={`dup-${index}`} 
              className="flex items-center justify-center w-32 md:w-40 lg:w-48 h-24 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 cursor-pointer hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(153,204,51,0.3)]"
            >
               <img src={brand.logo} alt={brand.name} className="max-h-24 md:max-h-28 object-contain" loading="lazy" />
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default BrandsCarousel;