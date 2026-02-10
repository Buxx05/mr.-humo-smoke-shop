import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { productos, categorias } from "@/data/products";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("categoria") || "Todos";
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return productos.filter((p) => {
      const matchCat = selectedCat === "Todos" || p.categoria === selectedCat;
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.marca.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCat, search]);

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
    <main className="py-12">
      <div className="container space-y-8">
        <h1 className="font-heading text-4xl font-bold text-foreground text-center">Catálogo</h1>

        {/* Search */}
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

        {/* Category filters */}
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
          {categorias.filter(c => c.nombre !== "Combos").map((cat) => (
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

        {/* Products grid */}
        {filtered.length > 0 ? (
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
