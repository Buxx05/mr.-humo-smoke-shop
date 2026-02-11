import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

// Recreamos las categorías con emojis para no perder el diseño visual
const categorias = [
  { nombre: "Vapers", emoji: "💨" },
  { nombre: "Líquidos", emoji: "💧" },
  { nombre: "Accesorios", emoji: "🛠️" },
  { nombre: "Tabaco", emoji: "🌿" },
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("categoria") || "Todos";
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [search, setSearch] = useState("");
  
  // Nuevos estados para la base de datos
  const [productosBD, setProductosBD] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      // Traemos todos los productos activos de Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);
        
      if (!error && data) {
        // Mapeamos (traducimos) los nombres de las columnas para que ProductCard no se rompa
        const mapeados = data.map(p => ({
          id: p.id,
          nombre: p.name,
          marca: p.brand || '',
          precio: p.price,
          categoria: p.category,
          imagen: p.image_url || 'https://placehold.co/400x400/2d2d2d/FFF?text=FOTO',
          es_canjeable: p.is_redeemable // Opcional, por si quieres ponerle un badge visual luego
        }));
        setProductosBD(mapeados);
      }
      setLoading(false);
    };

    fetchProductos();
  }, []);

  const filtered = useMemo(() => {
    return productosBD.filter((p) => {
      const matchCat = selectedCat === "Todos" || p.categoria === selectedCat;
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCat, search, productosBD]);

  const handleCatClick = (cat: string) => {
    setSelectedCat(cat);
    if (cat === "Todos") {
      searchParams.delete("categoria");
    } else {
      searchParams.set("categoria", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="py-12 animate-fade-in">
      <div className="container space-y-8">
        <h1 className="font-heading text-4xl font-bold text-foreground text-center">Catálogo</h1>

        {/* Buscador */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filtros de Categorías */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleCatClick("Todos")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCat === "Todos"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              onClick={() => handleCatClick(cat.nombre)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCat === cat.nombre
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.emoji} {cat.nombre}
            </button>
          ))}
        </div>

        {/* Rejilla de Productos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Cargando catálogo...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No se encontraron productos.</p>
        )}
      </div>
    </main>
  );
};

export default Catalog;