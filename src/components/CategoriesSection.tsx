import { Link, useNavigate } from "react-router-dom";
import { FaWind, FaFlask, FaBolt, FaCogs, FaLeaf, FaFire, FaBoxOpen } from "react-icons/fa";

// 7 categorías principales (sin "Todos" ni "Otros")
const categorias = [
  {
    nombre: "Vapers",
    icon: <FaWind className="text-3xl mx-auto" />,
    descripcion: "Dispositivos de vapeo de última generación",
  },
  {
    nombre: "Grinders",
    icon: <FaLeaf className="text-3xl mx-auto" />,
    descripcion: "Muele y prepara tu material fácilmente",
  },
  {
    nombre: "Pipas",
    icon: <FaBoxOpen className="text-3xl mx-auto" />,
    descripcion: "Variedad de pipas para todos los gustos",
  },
  {
    nombre: "Bongs",
    icon: <FaFire className="text-3xl mx-auto" />,
    descripcion: "Filtrado y frescura en cada calada",
  },
  {
    nombre: "Papeles y Blunts",
    icon: <FaFlask className="text-3xl mx-auto" />,
    descripcion: "E-liquids con los mejores sabores",
  },
  {
    nombre: "Para Armado",
    icon: <FaBolt className="text-3xl mx-auto" />,
    descripcion: "Sistemas pod compactos y potentes",
  },
  {
    nombre: "Encendedores y Accesorios",
    icon: <FaCogs className="text-3xl mx-auto" />,
    descripcion: "Todo lo que necesitas para tu vape",
  },
];

const CategoriesSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 animate-fade-in">
      <div className="container">
        <h2 className="font-heading text-4xl font-bold text-center mb-2 text-foreground">
          Nuestras <span className="text-lime-400">Categorías</span>
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Explora nuestra selección premium organizada para ti
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 max-w-7xl mx-auto">
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              onClick={() => navigate(`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`)}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card border border-border p-8 transition-all duration-300 hover:border-lime-400 hover:shadow-xl hover:scale-[1.04] focus:outline-none group relative"
              style={{ minHeight: 180 }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-lime-900/10 mb-2 group-hover:shadow-[0_0_0_4px_rgba(163,230,53,0.2)]">
                {cat.icon}
              </div>
              <span className="font-bold text-lg text-foreground mb-1">{cat.nombre}</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">{cat.descripcion}</span>
              <span className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-lime-400 pointer-events-none transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;