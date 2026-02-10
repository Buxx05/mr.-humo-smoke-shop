import { Link } from "react-router-dom";
import { categorias } from "@/data/products";

const CategoriesSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-center mb-12 text-foreground">
          Explora por Categoría
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.nombre}
              to={cat.nombre === "Combos" ? "/combos" : `/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
              className="flex flex-col items-center gap-3 rounded-lg bg-card border border-border p-6 transition-all duration-300 hover:border-primary/50 hover:scale-105"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-medium text-card-foreground">{cat.nombre}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
