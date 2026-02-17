// AQUÍ PONES TUS MARCAS REALES
const BRANDS = [
  { name: "brand1", logo: "/brands/brand1.png" }, 
  { name: "brand2", logo: "/brands/brand2.png" },
  { name: "brand3", logo: "/brands/brand3.jpg" },
  { name: "brand4", logo: "/brands/brand4.jpg" },
  { name: "brand1", logo: "/brands/brand1.png" }, 
  { name: "brand2", logo: "/brands/brand2.png" },
  { name: "brand3", logo: "/brands/brand3.jpg" },
  { name: "brand4", logo: "/brands/brand4.jpg" },
];

const BrandsCarousel = () => {
  return (
    <div className="py-12 bg-black border-y border-white/10 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Trabajamos con las mejores marcas del mercado.
        </p>
      </div>

      {/* CONTENEDOR DE LA ANIMACIÓN */}
      <div 
        className="relative flex w-full overflow-hidden mask-linear-gradient"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div className="flex animate-scroll hover:[animation-play-state:paused] gap-12 min-w-max">
          {/* PRIMERA VUELTA DE LOGOS */}
          {BRANDS.map((brand, index) => (
            <div key={index} className="flex items-center justify-center h-20 w-32 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer">
              {/* ¡IMAGEN ACTIVADA! */}
              <img src={brand.logo} alt={brand.name} className="max-h-16 object-contain" />
            </div>
          ))}

          {/* SEGUNDA VUELTA (DUPLICADA PARA EL EFECTO INFINITO) */}
          {BRANDS.map((brand, index) => (
            <div key={`dup-${index}`} className="flex items-center justify-center h-20 w-32 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer">
               {/* ¡IMAGEN ACTIVADA! */}
               <img src={brand.logo} alt={brand.name} className="max-h-16 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsCarousel;