import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, X, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// Categorías con subcategorías
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

const ITEMS_PER_PAGE = 20; // <--- Cantidad de productos por página

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("categoria") || "Todos";
  
  // Estados de Filtros
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  
  // Base de datos
  const [productosBD, setProductosBD] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown manual solo para móvil
  const [openDropdownMobile, setOpenDropdownMobile] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').eq('active', true);
        
      if (!error && data) {
        const mapeados = data.map(p => ({
          id: p.id,
          nombre: p.name,
          marca: p.brand || '',
          precio: p.price,
          categoria: p.category,
          subcategoria: p.subcategory || '',
          imagen: p.image_url || 'https://placehold.co/400x400/2d2d2d/FFF?text=FOTO',
          es_canjeable: p.is_redeemable 
        }));
        setProductosBD(mapeados);
      }
      setLoading(false);
    };

    fetchProductos();
  }, []);

  // Resetear a la página 1 cuando cambia algún filtro o la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat, selectedSub, search]);

  // Filtrado general (Mismo que antes)
  const filtered = useMemo(() => {
    if (selectedCat === "Todos") {
      return productosBD.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCat && !selectedSub) {
      return productosBD.filter((p) => p.categoria === selectedCat && (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase())));
    }
    if (selectedSub) {
      return productosBD.filter((p) => p.categoria === selectedCat && p.subcategoria === selectedSub && (p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase())));
    }
    return [];
  }, [selectedCat, selectedSub, search, productosBD]);

  // Lógica de Paginación
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCatClick = (cat: string) => {
    setSelectedCat(cat);
    if (cat === "Todos") searchParams.delete("categoria");
    else searchParams.set("categoria", cat);
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    // Le damos a React 100ms para renderizar la nueva cuadrícula antes de hacer scroll.
    // Esto evita que el cambio de altura de la página rompa la animación de subida.
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="py-8 md:py-12 animate-fade-in px-4 min-h-screen">
      <div className="container max-w-7xl mx-auto space-y-8">
        
        {/* CABECERA */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-foreground">Catálogo VIP</h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium">Encuentra todo lo que necesitas para tu sesión.</p>
        </div>

        {/* ========================================= */}
        {/* PANEL DE CONTROL ORDENADO (SOLO PC)       */}
        {/* ========================================= */}
<div className="hidden md:flex flex-col gap-4 bg-secondary/10 p-4 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm relative z-50">          
          {/* Fila 1: Buscador */}
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-border bg-background pl-12 pr-4 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner"
            />
          </div>

          <div className="h-px w-full bg-border/50 my-1"></div>

          {/* Fila 2: Categorías con Hover */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { handleCatClick("Todos"); setSelectedSub(null); }}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                selectedCat === "Todos" && !selectedSub
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(153,204,51,0.3)]"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              Todos los Productos
            </button>
            
            {Object.keys(CATEGORIES).map((cat) => (
              <div key={cat} className="relative group">
                {/* Botón Principal */}
                <button
                  onClick={() => {
                    setSelectedCat(cat);
                    setSelectedSub(null);
                    searchParams.set("categoria", cat);
                    setSearchParams(searchParams);
                  }}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedCat === cat
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(153,204,51,0.3)]"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {cat}
                  <span className="text-xs opacity-70 group-hover:rotate-180 transition-transform duration-300">▼</span>
                </button>
                
                {/* Dropdown que aparece solo con HOVER (CSS) */}
                <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-card border border-border rounded-xl shadow-2xl py-2 overflow-hidden">
                    {CATEGORIES[cat].map((sub) => {
                      const count = productosBD.filter(p => p.categoria === cat && p.subcategoria === sub).length;
                      return (
                        <button
                          key={sub}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCat(cat);
                            setSelectedSub(sub);
                            searchParams.set("categoria", sub);
                            setSearchParams(searchParams);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                            selectedSub === sub ? "bg-primary/10 text-primary font-black border-l-4 border-primary" : "hover:bg-secondary/50 font-medium text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {selectedSub === sub && <span className="text-[10px] text-primary">▶</span>}
                            {sub}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono bg-background border border-border px-2 py-0.5 rounded-md">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================= */}
        {/* FILTROS PARA MÓVIL (DRAWER)               */}
        {/* ========================================= */}
        <div className="md:hidden space-y-4">
          <div className="relative w-full shadow-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-border bg-card pl-12 pr-4 py-3 text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full bg-secondary border border-border text-foreground font-black shadow-sm"
            onClick={() => setShowMobileFilter(true)}
          >
            <Filter className="w-5 h-5 text-primary" /> {selectedSub || selectedCat || "Filtrar Catálogo"}
          </button>
        </div>

        {/* Drawer lateral móvil */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex animate-fade-in md:hidden">
            <div className="w-[85vw] max-w-sm bg-background h-full shadow-2xl flex flex-col animate-slide-in-left border-r border-border">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card">
                <span className="font-black text-xl font-heading text-primary">Categorías</span>
                <button onClick={() => setShowMobileFilter(false)} className="bg-secondary p-1.5 rounded-full text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
                <div className="mb-4 space-y-1">
                  <button
                    onClick={() => { handleCatClick("Todos"); setSelectedSub(null); setShowMobileFilter(false); }}
                    className={`w-full text-left py-3 px-4 rounded-lg text-base font-black transition-colors ${selectedCat === "Todos" && !selectedSub ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
                  >
                    Ver Todos los Productos
                  </button>
                  <div className="my-4 h-px bg-border"></div>
                  {Object.keys(CATEGORIES).map((cat) => (
                    <div key={cat} className="rounded-lg overflow-hidden border border-border/50 mb-2 bg-card">
                      <div 
                        className={`w-full flex items-center justify-between py-3 px-4 text-base font-bold cursor-pointer transition-colors ${selectedCat === cat && !selectedSub ? "bg-primary/10 text-primary border-l-4 border-primary" : "text-foreground hover:bg-secondary"}`}
                        onClick={() => {
                          setSelectedCat(cat);
                          setSelectedSub(null);
                          setOpenDropdownMobile(prev => prev === cat ? null : cat);
                        }}
                      >
                        <span>{cat}</span>
                        <span className={`text-xl transition-transform ${openDropdownMobile === cat ? "rotate-180 text-primary" : "text-muted-foreground"}`}>▾</span>
                      </div>
                      {openDropdownMobile === cat && (
                        <div className="bg-background border-t border-border/50 p-2 space-y-1">
                          {CATEGORIES[cat].map((sub) => {
                            const count = productosBD.filter(p => p.categoria === cat && p.subcategoria === sub).length;
                            return (
                              <button
                                key={sub}
                                onClick={() => {
                                  setSelectedCat(cat);
                                  setSelectedSub(sub);
                                  setOpenDropdownMobile(null);
                                  setShowMobileFilter(false);
                                  searchParams.set("categoria", sub);
                                  setSearchParams(searchParams);
                                }}
                                className={`w-full flex items-center justify-between py-2.5 px-4 rounded-md text-sm transition-colors ${selectedSub === sub && selectedCat === cat ? "bg-primary text-primary-foreground font-black shadow-sm" : "text-muted-foreground font-medium hover:bg-secondary hover:text-foreground"}`}
                              >
                                <span>{sub}</span>
                                <span className={`text-xs font-mono px-2 py-0.5 rounded ${selectedSub === sub ? "bg-black/20" : "bg-secondary"}`}>{count}</span>
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
            <div className="flex-1" onClick={() => setShowMobileFilter(false)} />
          </div>
        )}

        {/* ========================================= */}
        {/* TÍTULO DE RESULTADOS Y PRODUCTOS          */}
        {/* ========================================= */}
        
        <div className="flex items-center justify-between border-b border-border/50 pb-2">
          {selectedCat !== "Todos" && selectedSub ? (
            <div className="text-lg md:text-xl font-black text-foreground flex items-center gap-2">
              <span className="text-muted-foreground">{selectedCat}</span>
              <span className="text-primary">/</span>
              <span>{selectedSub}</span>
            </div>
          ) : (
            <div className="text-lg md:text-xl font-black text-foreground">
              {selectedCat === "Todos" ? "Todos los Productos" : selectedCat}
            </div>
          )}
          <span className="text-sm font-bold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Rejilla de Productos PAGINADA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p className="font-medium">Cargando catálogo...</p>
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-lg font-bold text-foreground">No encontramos productos.</p>
            <p className="text-sm text-muted-foreground mt-1">Intenta buscar con otras palabras o selecciona "Todos".</p>
          </div>
        )}

        {/* ========================================= */}
        {/* CONTROLES DE PAGINACIÓN                   */}
        {/* ========================================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-2 font-bold border-border hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50 h-11 px-5 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>
            
            <div className="flex items-center justify-center min-w-[100px] bg-secondary/30 h-11 rounded-xl border border-border font-black text-sm">
              <span className="text-primary mr-1">{currentPage}</span> / <span className="text-muted-foreground ml-1">{totalPages}</span>
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="gap-2 font-bold border-border hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50 h-11 px-5 rounded-xl"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

      </div>
    </main>
  );
};

export default Catalog;