import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// 1. Traemos la interfaz del combo aquí mismo
export interface Combo {
  id: number;
  titulo: string;
  productos: string[];
  precioNormal: number;
  precioCombo: number;
  descuento: number;
  imagen: string;
}

// 2. Traemos la lista de combos aquí mismo
const combos: Combo[] = [
  {
    id: 101,
    titulo: "Kit Inicio Vaper",
    productos: ["Vaper ELF BAR 5000 Puffs", "Líquido NAKED 100 60ml", "Cargador USB-C"],
    precioNormal: 180,
    precioCombo: 150,
    descuento: 17,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=KIT+INICIO",
  },
  {
    id: 102,
    titulo: "Pack Fumador",
    productos: ["Pipa de Vidrio RAW 25cm", "Grinder Metálico 4 Piezas", "Encendedor Premium"],
    precioNormal: 100,
    precioCombo: 85,
    descuento: 15,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=PACK+FUMADOR",
  },
  {
    id: 103,
    titulo: "Pack Líquidos x3",
    productos: ["Líquido NAKED 100 - Mango", "Líquido VGOD - Lush Ice", "Líquido NAKED 100 - Berry"],
    precioNormal: 111,
    precioCombo: 90,
    descuento: 19,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=PACK+LIQUIDOS",
  },
  {
    id: 104,
    titulo: "Combo Premium Vaper",
    productos: ["GEEK VAPE Aegis Mini Kit", "Líquido VGOD 60ml", "Kit de Limpieza"],
    precioNormal: 233,
    precioCombo: 199,
    descuento: 15,
    imagen: "https://placehold.co/400x400/2d2d2d/FFD700?text=COMBO+PREMIUM",
  },
];

const Combos = () => {
  const { addItem } = useCart();

  const handleAddCombo = (combo: Combo) => {
    // Nota: Agregamos el ", 1" al final para decirle al carrito que la cantidad es 1
    addItem({
      id: combo.id,
      nombre: combo.titulo,
      precio: combo.precioCombo,
      imagen: combo.imagen,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {combos.map((combo) => (
            <div key={combo.id} className="rounded-lg bg-card border border-border overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:border-primary/40 shadow-sm">
              <div className="aspect-square overflow-hidden bg-secondary">
                <img src={combo.imagen} alt={combo.titulo} className="h-full w-full object-cover transition-transform duration-300 hover:scale-110" loading="lazy" />
              </div>
              <div className="p-5 space-y-4">
                <h3 className="font-heading text-lg font-bold text-card-foreground">{combo.titulo}</h3>
                <ul className="space-y-1">
                  {combo.productos.map((p, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> {p}
                    </li>
                  ))}
                </ul>
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-2xl font-heading font-bold text-primary">S/ {combo.precioCombo.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">S/ {combo.precioNormal.toFixed(2)}</span>
                  <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                    -{combo.descuento}%
                  </span>
                </div>
                <button
                  onClick={() => handleAddCombo(combo)}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm mt-2"
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