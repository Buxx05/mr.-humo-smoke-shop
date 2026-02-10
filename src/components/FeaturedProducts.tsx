import ProductCard from "./ProductCard";
import { productos } from "@/data/products";

const FeaturedProducts = () => {
  const featured = productos.slice(0, 4);

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-center mb-12 text-foreground">
          💨 Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
