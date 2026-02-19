// AQUÍ PONES TUS MARCAS REALES (Recuerda subir las imágenes a tu carpeta public/brands/)
const BRANDS = [
  { name: "Blunt_wrap", logo: "/brands/Blunt_wrap.png" },
  { name: "Bob", logo: "/brands/Bob.png" }, 
  { name: "Geek_vape", logo: "/brands/Geek_vape.png" },
  { name: "ocb_1", logo: "/brands/ocb_1.png" },
  { name: "show_blunt", logo: "/brands/show_blunt.png" },
  { name: "smok", logo: "/brands/smok.png" },
  { name: "smoking", logo: "/brands/smoking.png" },
  { name: "vaporever", logo: "/brands/vaporever.png" },
  { name: "VOOPOO_1", logo: "/brands/VOOPOO_1.png" },
  { name: "Yumi", logo: "/brands/Yumi.png" },
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
              className="flex items-center justify-center w-24 md:w-32 lg:w-40 h-20 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 cursor-pointer hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(153,204,51,0.3)]"
            >
              <img src={brand.logo} alt={brand.name} className="max-h-12 md:max-h-16 object-contain" loading="lazy" />
            </div>
          ))}

          {/* SEGUNDA VUELTA (DUPLICADA PARA EL EFECTO INFINITO) */}
          {BRANDS.map((brand, index) => (
            <div 
              key={`dup-${index}`} 
              className="flex items-center justify-center w-24 md:w-32 lg:w-40 h-20 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 cursor-pointer hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(153,204,51,0.3)]"
            >
               <img src={brand.logo} alt={brand.name} className="max-h-12 md:max-h-16 object-contain" loading="lazy" />
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default BrandsCarousel;