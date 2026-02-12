import { useEffect, useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Combos = () => {
  const { addItem } = useCart();
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      // Traemos los combos de la base de datos real
      const { data, error } = await supabase.from('combos').select('*').eq('active', true);
      if (!error && data) {
        setCombos(data);
      }
      setLoading(false);
    };
    fetchCombos();
  }, []);

  const handleAddCombo = (combo: any) => {
    addItem({
      id: 9000 + combo.id, // ID artificial para que no choque con productos normales
      nombre: `Combo: ${combo.title}`,
      precio: combo.price_combo,
      imagen: combo.image_url,
    }, 1);
    toast.success("✅ Combo agregado al carrito");
  };

  return (
    <main className="py-12 animate-fade-in">
      <div className="container space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl font-bold text-foreground">🎁 Combos Especiales</h1>
          <p className="text-muted-foreground">Ahorra con nuestros paquetes promocionales</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {combos.map((combo) => (
              <div key={combo.id} className="rounded-lg bg-card border border-border overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:border-primary/40 shadow-sm flex flex-col">
                <div className="aspect-square overflow-hidden bg-secondary relative">
                  <img src={combo.image_url} alt={combo.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-110" loading="lazy" />
                  <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-bold px-3 py-1 rounded-full text-sm shadow-md">
                    -{combo.discount}%
                  </div>
                </div>
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-bold text-card-foreground mb-2">{combo.title}</h3>
                    <ul className="space-y-1.5">
                      {combo.products_list.map((p: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0"></span> 
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-sm text-muted-foreground line-through">S/ {combo.price_normal.toFixed(2)}</span>
                      <span className="text-2xl font-heading font-bold text-primary">S/ {combo.price_combo.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleAddCombo(combo)}
                      className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg shadow-primary/20"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      LO QUIERO
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && combos.length === 0 && (
          <p className="text-center text-muted-foreground">Aún no hay combos disponibles. ¡Vuelve pronto!</p>
        )}
      </div>
    </main>
  );
};

export default Combos;