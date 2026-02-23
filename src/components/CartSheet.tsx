import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
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
      .map((i) => `▪️ ${i.nombre} (x${i.cantidad}) - S/ ${(i.precio * i.cantidad).toFixed(2)}`)
      .join("\n");

    const mensaje = `Hola MR. HUMO! 🔥\nQuiero hacer el siguiente pedido:\n\n🛒 *PRODUCTOS:*\n${productLines}\n\n💰 *TOTAL:* S/ ${total.toFixed(2)}\n\n📝 *MIS DATOS:*\n👤 Nombre: ${nombre}\n📱 Teléfono: ${telefono}\n📍 Distrito: ${distrito}`;

    const url = `https://wa.me/51935342437?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    clearCart();
    
    // Limpiamos el formulario para la próxima vez
    setNombre(""); setTelefono(""); setDistrito("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg p-0 bg-background border-l border-border/50 shadow-2xl" aria-describedby={undefined}>
        
        {/* HEADER DEL CARRITO */}
        <SheetHeader className="px-6 py-5 border-b border-border/50 bg-card">
          <SheetTitle className="font-heading text-2xl font-black text-foreground flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <ShoppingBag className="w-5 h-5" />
            </div>
            Mi Carrito
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* ESTADO VACÍO */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-muted-foreground animate-fade-in">
            <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 opacity-20" />
            </div>
            <p className="text-xl font-bold text-foreground">Tu carrito está vacío</p>
            <p className="text-sm mt-2 text-center max-w-[250px]">¡Explora nuestro catálogo y agrega tus productos favoritos!</p>
            <button 
              onClick={() => onOpenChange(false)} 
              className="mt-8 font-bold text-primary hover:underline underline-offset-4"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          /* ESTADO CON PRODUCTOS */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* ÁREA SCROLLABLE PARA LOS PRODUCTOS */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-secondary/10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl bg-card p-3 border border-border/50 shadow-sm relative group hover:border-primary/30 transition-colors">
                  
                  {/* Imagen */}
                  <div className="h-20 w-20 rounded-xl bg-background border border-border/50 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                    <img src={item.imagen} alt={item.nombre} className="h-full w-full object-contain drop-shadow-md" />
                  </div>
                  
                  {/* Detalles */}
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div className="pr-6">
                      <p className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{item.nombre}</p>
                      <p className="text-xs font-black text-muted-foreground mt-1">S/ {item.precio.toFixed(2)} c/u</p>
                    </div>
                    
                    <div className="flex items-end justify-between mt-2">
                      {/* Píldora de Cantidad */}
                      <div className="flex items-center bg-background border border-border rounded-lg p-0.5 shadow-inner">
                        <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-colors">
                          <Minus className="h-3 w-3 font-bold" />
                        </button>
                        <span className="text-xs font-black w-8 text-center text-foreground">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-colors">
                          <Plus className="h-3 w-3 font-bold" />
                        </button>
                      </div>
                      
                      {/* Subtotal del item */}
                      <p className="text-sm font-black text-primary">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Botón Eliminar */}
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* ÁREA FIJA (FOOTER) - TOTAL Y FORMULARIO */}
            <div className="p-6 bg-card border-t border-border/50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-10">
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Total a Pagar</span>
                <span className="text-3xl font-black font-heading text-primary">S/ {total.toFixed(2)}</span>
              </div>

              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    maxLength={9}
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <div className="relative">
                    <select
                      value={distrito}
                      onChange={(e) => setDistrito(e.target.value)}
                      className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Distrito</option>
                      {distritos.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {/* Flechita personalizada para el select */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">▾</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                disabled={!nombre || telefono.length < 9 || !distrito}
                className="w-full flex items-center justify-center gap-3 rounded-xl py-4 text-base font-black text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 shadow-lg"
                style={{ 
                  backgroundColor: (!nombre || telefono.length < 9 || !distrito) ? '#333' : '#25D366',
                  boxShadow: (!nombre || telefono.length < 9 || !distrito) ? 'none' : '0 0 20px rgba(37,211,102,0.3)'
                }}
              >
                <MessageCircle className="h-5 w-5" />
                ENVIAR PEDIDO AHORA
              </button>
            </div>

          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;