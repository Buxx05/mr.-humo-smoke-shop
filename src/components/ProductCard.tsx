import { useState } from "react";
import { Minus, Plus, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Interfaz del producto
export interface ProductType {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  categoria: string;
  imagen: string;
}

const ProductCard = ({ product }: { product: ProductType }) => {
  const [cantidad, setCantidad] = useState(1);
  const [expandedName, setExpandedName] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(
      { id: product.id, nombre: product.nombre, precio: product.precio, imagen: product.imagen },
      cantidad
    );
    
    // Toast más descriptivo y visual
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-foreground">¡Agregado al carrito!</span>
        <span className="text-xs text-muted-foreground">{cantidad}x {product.nombre}</span>
      </div>
    );
    setCantidad(1); // Reiniciamos el contador tras agregar
  };

  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(153,204,51,0.1)] flex flex-col h-full">
      
      {/* IMAGEN DEL PRODUCTO */}
      <div className="aspect-square overflow-hidden bg-secondary/20 relative p-4 border-b border-border/50 flex items-center justify-center">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
          loading="lazy"
        />
        {/* Etiqueta de Categoría Flotante */}
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-border text-foreground px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
          {product.categoria}
        </div>
      </div>
      
      {/* CONTENIDO (Textos y Precios) */}
      <div className="p-4 md:p-5 flex flex-col flex-1 space-y-3">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 mb-1.5">
            <Tag className="w-3 h-3" /> {product.marca || "Exclusivo"}
          </p>

          {/* Título con truncado por defecto y toggle en móvil */}
          <h3 className={`font-black text-sm md:text-base leading-tight text-foreground min-h-[2.5rem] break-words ${!expandedName ? 'line-clamp-2' : ''}`}>
            {product.nombre}
          </h3>

          {/* Mostrar 'VER MÁS' solo en móvil para nombres largos */}
          {product.nombre.length > 60 && (
            <button
              onClick={() => setExpandedName((v) => !v)}
              aria-expanded={expandedName}
              className="mt-1 md:hidden text-xs font-bold text-primary hover:underline"
            >
              {expandedName ? 'VER MENOS' : 'VER MÁS'}
            </button>
          )}
        </div>

        <div className="text-2xl font-black text-primary font-heading tracking-tight">
          S/ {product.precio.toFixed(2)}
        </div>

        {/* CONTROLES DE COMPRA (Empujados al fondo por el mt-auto) */}
        <div className="mt-auto space-y-3 pt-2">
          
          {/* Selector de Cantidad Estilo Píldora */}
          <div className="flex items-center justify-between bg-background border border-border rounded-lg p-1 shadow-inner">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center hover:bg-border transition-colors text-muted-foreground hover:text-foreground active:scale-95"
            >
              <Minus className="h-4 w-4 font-bold" />
            </button>
            <span className="w-10 text-center font-black text-foreground text-sm">{cantidad}</span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center hover:bg-border transition-colors text-muted-foreground hover:text-foreground active:scale-95"
            >
              <Plus className="h-4 w-4 font-bold" />
            </button>
          </div>

          {/* Botón Agregar al Carrito */}
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-black text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] shadow-[0_0_15px_rgba(153,204,51,0.2)] active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;