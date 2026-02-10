import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { combos } from "@/data/products";
import { toast } from "sonner";

const Combos = () => {
  const { addItem } = useCart();

  const handleAddCombo = (combo: typeof combos[0]) => {
    addItem({
      id: combo.id,
      nombre: combo.titulo,
      precio: combo.precioCombo,
      imagen: combo.imagen,
    });
    toast.success("✅ Combo agregado al carrito");
  };

  return (
    <main className="py-12">
      <div className="container space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl font-bold text-foreground">🎁 Combos Especiales</h1>
          <p className="text-muted-foreground">Ahorra con nuestros paquetes promocionales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {combos.map((combo) => (
            <div key={combo.id} className="rounded-lg bg-card border border-border overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:border-primary/40">
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={combo.imagen} alt={combo.titulo} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-5 space-y-4">
                <h3 className="font-heading text-lg font-bold text-card-foreground">{combo.titulo}</h3>
                <ul className="space-y-1">
                  {combo.productos.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {p}</li>
                  ))}
                </ul>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-heading font-bold text-primary">S/. {combo.precioCombo.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">S/. {combo.precioNormal.toFixed(2)}</span>
                  <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-semibold text-destructive">
                    -{combo.descuento}%
                  </span>
                </div>
                <button
                  onClick={() => handleAddCombo(combo)}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ShoppingCart className="h-4 w-4" />
                  AGREGAR AL CARRITO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Combos;
