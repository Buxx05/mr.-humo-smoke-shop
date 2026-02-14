import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      // Traemos solo 4 productos activos para la página de inicio
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .limit(4);
        
      if (!error && data) {
        const mapeados = data.map(p => ({
          id: p.id,
          nombre: p.name,
          marca: p.brand || '',
          precio: p.price,
          categoria: p.category,
          imagen: p.image_url || 'https://placehold.co/400x400/2d2d2d/FFF?text=FOTO'
        }));
        setFeatured(mapeados);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 animate-fade-in">
      <div className="container">
        <h2 className="font-heading text-3xl font-bold text-center mb-12 text-foreground">
          💨 Productos Destacados
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;