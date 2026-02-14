
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, X, Filter } from "lucide-react";
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
  // Drawer para filtros en móvil
  const [showMobileFilter, setShowMobileFilter] = useState(false);
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
    if (selectedCat && !selectedSub) {
      // Mostrar todos los productos de la categoría seleccionada
      return productosBD.filter((p) => {
        const matchCat = p.categoria === selectedCat;
        const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      });
    }
    if (selectedSub) {
      // Mostrar solo productos de la subcategoría
      return productosBD.filter((p) => {
        const matchCat = p.categoria === selectedCat;
        const matchSub = p.subcategoria === selectedSub;
        const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSub && matchSearch;
      });
    }
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

        {/* Filtro horizontal solo en desktop/tablet */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2">
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
              <div className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                selectedCat === cat && !selectedSub
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}>
                <span
                  className="text-sm select-none"
                  onClick={() => {
                    setSelectedCat(cat);
                    setSelectedSub(null);
                    if (cat === "Todos") searchParams.delete("categoria");
                    else searchParams.set("categoria", cat);
                    setSearchParams(searchParams);
                  }}
                >
                  {cat}
                </span>
                <span
                  className="text-lg opacity-70 cursor-pointer px-1"
                  onClick={e => {
                    e.stopPropagation();
                    setOpenDropdown(prev => prev === cat ? null : cat);
                  }}
                >
                  ▾
                </span>
              </div>
              {openDropdown === cat && (
                <div className="absolute left-0 mt-2 w-56 bg-card border border-border rounded shadow-lg z-50 py-2">
                  {CATEGORIES[cat].map((sub) => {
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

        {/* Botón Filtrar solo en móvil */}
        <div className="flex sm:hidden justify-end mb-4">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold shadow"
            onClick={() => setShowMobileFilter(true)}
          >
            <Filter className="w-4 h-4" /> Filtrar
          </button>
        </div>

        {/* Drawer lateral para filtros en móvil */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-[90vw] max-w-xs bg-white h-full shadow-xl flex flex-col animate-slide-in-left">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="font-bold text-lg">Filtros</span>
                <button onClick={() => setShowMobileFilter(false)}>
                  <X className="w-7 h-7 text-black font-bold" strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-2">
                <div className="mb-4">
                  <span className="block font-bold text-xs mb-2">CATEGORÍAS</span>
                  <div className="divide-y">
                    <button
                      onClick={() => { handleCatClick("Todos"); setSelectedSub(null); setShowMobileFilter(false); }}
                      className={`w-full text-left py-2 px-1 text-sm font-medium ${selectedCat === "Todos" && !selectedSub ? "text-primary" : "text-zinc-900"}`}
                    >
                      Todos
                    </button>
                    {Object.keys(CATEGORIES).map((cat) => (
                      <div key={cat}>
                        <div className={`w-full flex items-center justify-between py-2 px-1 text-sm font-medium cursor-pointer ${selectedCat === cat && !selectedSub ? "text-primary" : "text-zinc-900"}`}>
                          <span
                            onClick={() => {
                              setSelectedCat(cat);
                              setSelectedSub(null);
                              setShowMobileFilter(false);
                              if (cat === "Todos") searchParams.delete("categoria");
                              else searchParams.set("categoria", cat);
                              setSearchParams(searchParams);
                            }}
                          >{cat}</span>
                          <span
                            className="text-2xl px-2 opacity-70 cursor-pointer"
                            onClick={e => {
                              e.stopPropagation();
                              setOpenDropdown(prev => prev === cat ? null : cat);
                            }}
                          >▾</span>
                        </div>
                        {/* Subcategorías desplegables */}
                        {openDropdown === cat && (
                          <div className="pl-4 pb-2">
                            {CATEGORIES[cat].map((sub) => {
                              const count = productosBD.filter(p => p.categoria === cat && p.subcategoria === sub).length;
                              return (
                                <button
                                  key={sub}
                                  onClick={() => {
                                    setSelectedCat(cat);
                                    setSelectedSub(sub);
                                    setOpenDropdown(null);
                                    setShowMobileFilter(false);
                                    searchParams.set("categoria", sub);
                                    setSearchParams(searchParams);
                                  }}
                                  className={`w-full flex items-center justify-between py-1 px-1 text-xs hover:bg-muted/20 ${selectedSub === sub && selectedCat === cat ? "text-primary font-bold" : "text-zinc-900"}`}
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
                </div>
              </div>
            </div>
            {/* Fondo para cerrar el drawer */}
            <div className="flex-1" onClick={() => setShowMobileFilter(false)} />
          </div>
        )}

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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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