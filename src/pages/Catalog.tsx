import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

// Categorías con subcategorías (coincide con el inventario)
const CATEGORIES: Record<string, string[]> = {
  Vapers: ["Desechables", "Recargables", "E-Liquid", "Sales de Nicotina", "Repuestos"],
  Grinders: ["Mini Grinders", "Acrílicos", "Biodegradables", "Metálicos", "Combos Pipa + Grinder"],
  Pipas: ["Metal", "Vidrio", "Silicona", "Artesanales"],
  Bongs: ["Acrílicos", "Vidrio", "Silicona", "Kits"],
  "Papeles y Blunts": ["Blunts", "Papeles 1”", "Orgánicos", "Sabores", "Celulosa"],
  "Para Armado": ["Filtros", "Enrolladoras"],
  "Encendedores y Accesorios": ["Encendedores", "Otros Accesorios"],
  Otros: ["General", "Nuevos Ingresos"]
};

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("categoria") || "Todos";
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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
          subcategoria: p.subcategory || '',
          imagen: p.image_url || 'https://placehold.co/400x400/2d2d2d/FFF?text=FOTO',
          es_canjeable: p.is_redeemable // Opcional, por si quieres ponerle un badge visual luego
        }));
        setProductosBD(mapeados);
      }
      setLoading(false);
    };

    fetchProductos();
  }, []);

  // Mostrar todos los productos si está seleccionado "Todos"
  // Si hay subcategoría, filtrar por subcategoría y categoría, pero el buscador puede sobreescribir el filtro
  const filtered = useMemo(() => {
    if (selectedCat === "Todos") {
      return productosBD.filter((p) => {
        const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      });
    }
    if (selectedSub) {
      // Si hay búsqueda, mostrar productos de la subcategoría que coincidan, pero si la búsqueda no encuentra nada en esa subcategoría, buscar en toda la categoría
      const subFiltered = productosBD.filter((p) => {
        const matchCat = p.categoria === selectedCat;
        const matchSub = p.subcategoria === selectedSub;
        const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSub && matchSearch;
      });
      if (search && subFiltered.length === 0) {
        // Si no hay resultados en la subcategoría, buscar en toda la categoría
        return productosBD.filter((p) => {
          const matchCat = p.categoria === selectedCat;
          const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
          return matchCat && matchSearch;
        });
      }
      return subFiltered;
    }
    // Si solo hay categoría seleccionada, no mostrar nada hasta que elija subcategoría
    return [];
  }, [selectedCat, selectedSub, search, productosBD]);

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
            onClick={() => { handleCatClick("Todos"); setSelectedSub(null); setOpenDropdown(null); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCat === "Todos" && !selectedSub
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>

          {Object.keys(CATEGORIES).map((cat) => (
            <div key={cat} className="relative">
              <button
                onClick={() => {
                  // Abrir/cerrar menú y seleccionar categoría principal
                  setOpenDropdown(prev => prev === cat ? null : cat);
                  setSelectedCat(cat);
                  setSelectedSub(null);
                  // actualizar params
                  if (cat === "Todos") searchParams.delete("categoria");
                  else searchParams.set("categoria", cat);
                  setSearchParams(searchParams);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCat === cat && !selectedSub
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-sm">{cat}</span>
                <span className="text-xs opacity-70">▾</span>
              </button>

              {/* Dropdown de subcategorías */}
              {openDropdown === cat && (
                <div className="absolute left-0 mt-2 w-56 bg-card border border-border rounded shadow-lg z-50 py-2">
                  {CATEGORIES[cat].map((sub) => {
                    // Contador de productos por subcategoría
                    const count = productosBD.filter(p => p.categoria === cat && p.subcategoria === sub).length;
                    return (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedCat(cat);
                          setSelectedSub(sub);
                          setOpenDropdown(null);
                          searchParams.set("categoria", sub);
                          setSearchParams(searchParams);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/20"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-primary">▶</span>
                          {sub}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Título de categoría/subcategoría */}
        {selectedCat !== "Todos" && selectedSub && (
          <div className="text-lg font-bold text-primary flex items-center gap-2 justify-center">
            <span>{selectedCat}</span>
            <span className="text-muted-foreground">/</span>
            <span>{selectedSub}</span>
          </div>
        )}

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