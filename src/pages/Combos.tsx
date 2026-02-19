import { useEffect, useState } from "react";
import { ShoppingCart, Loader2, Sparkles, Check } from "lucide-react";
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
    
    // Toast descriptivo igual al del ProductCard
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-foreground">¡Combo Agregado!</span>
        <span className="text-xs text-muted-foreground">{combo.title}</span>
      </div>
    );
  };

  return (
    <main className="py-8 md:py-12 animate-fade-in px-4">
      <div className="container max-w-7xl mx-auto space-y-8">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Combos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">Especiales</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm md:text-base">
            Ahorra llevando el paquete completo. Ofertas por tiempo limitado.
          </p>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="animate-spin w-10 h-10 text-primary mb-4" />
            <p className="font-medium">Cargando promociones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {combos.map((combo) => (
              <div key={combo.id} className="group rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(153,204,51,0.1)] flex flex-col h-full">
                
                {/* IMAGEN Y DESCUENTO */}
                <div className="aspect-square overflow-hidden bg-secondary relative border-b border-border/50">
                  <img 
                    src={combo.image_url} 
                    alt={combo.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy" 
                  />
                  {/* Badge de descuento con efecto glow */}
                  <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-black px-4 py-1.5 rounded-full text-sm shadow-[0_0_15px_rgba(239,68,68,0.4)] tracking-wider">
                    -{combo.discount}% OFF
                  </div>
                </div>

                {/* DETALLES DEL COMBO */}
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-black text-foreground mb-3 leading-tight">{combo.title}</h3>
                    
                    {/* Lista de productos incluídos */}
                    <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Incluye:</p>
                      <ul className="space-y-2">
                        {combo.products_list.map((p: string, i: number) => (
                          <li key={i} className="text-sm text-foreground font-medium flex items-start gap-2 leading-tight">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> 
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* PRECIO Y BOTÓN */}
                  <div className="pt-4 mt-auto">
                    <div className="flex items-end justify-between mb-4 bg-background p-3 rounded-xl border border-border shadow-inner">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Precio Real</p>
                        <span className="text-sm text-muted-foreground line-through font-medium">S/ {combo.price_normal.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Oferta</p>
                        <span className="text-2xl font-heading font-black text-primary leading-none">S/ {combo.price_combo.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddCombo(combo)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-black text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] shadow-[0_0_15px_rgba(153,204,51,0.2)] active:scale-95"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      LO QUIERO
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
        
        {!loading && combos.length === 0 && (
          <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-lg font-bold text-foreground">Estamos armando nuevos paquetes.</p>
            <p className="text-sm text-muted-foreground mt-1">¡Vuelve pronto para ver las ofertas!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Combos;