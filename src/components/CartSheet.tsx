import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const distritos = [
  "Miraflores", "San Isidro", "Surco", "Barranco", "San Borja",
  "La Molina", "Jesús María", "Lince", "Magdalena", "Pueblo Libre",
  "San Miguel", "Breña", "Lima Centro", "Callao", "Otro",
];

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [distrito, setDistrito] = useState("");

  const handleWhatsApp = () => {
    if (!nombre || !telefono || !distrito) return;

    const productLines = items
      .map((i) => `- ${i.nombre} x${i.cantidad} - S/. ${(i.precio * i.cantidad).toFixed(2)}`)
      .join("\n");

    const mensaje = `Hola MR. HUMO! 👋\n\nQuiero hacer el siguiente pedido:\n\n🛒 PRODUCTOS:\n${productLines}\n\n💰 TOTAL: S/. ${total.toFixed(2)}\n\n📝 Nombre: ${nombre}\n📱 Teléfono: ${telefono}\n📍 Distrito: ${distrito}`;

    const url = `https://wa.me/51999888777?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    clearCart();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-border overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl text-foreground">🛒 Mi Carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-lg">Tu carrito está vacío</p>
            <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-lg bg-card p-3 border border-border">
                  <img src={item.imagen} alt={item.nombre} className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground line-clamp-1">{item.nombre}</p>
                    <p className="text-xs text-muted-foreground">S/. {item.precio.toFixed(2)} c/u</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="h-6 w-6 rounded bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="h-6 w-6 rounded bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <p className="text-sm font-semibold text-primary">S/. {(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-4 border-t border-border">
              <span className="font-heading font-semibold text-foreground">TOTAL</span>
              <span className="text-xl font-heading font-bold text-primary">S/. {total.toFixed(2)}</span>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={distrito}
                onChange={(e) => setDistrito(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecciona tu distrito</option>
                {distritos.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* WhatsApp button */}
            <button
              onClick={handleWhatsApp}
              disabled={!nombre || !telefono || !distrito}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-whatsapp py-3 text-sm font-bold text-whatsapp-foreground transition-colors hover:bg-whatsapp/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="h-5 w-5" />
              📱 ENVIAR PEDIDO POR WHATSAPP
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
