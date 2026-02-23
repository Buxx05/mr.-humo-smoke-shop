import { useState } from "react";
import { Minus, Plus, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

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
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(
      { id: product.id, nombre: product.nombre, precio: product.precio, imagen: product.imagen },
      cantidad
    );
    
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-bold text-foreground">¡Agregado al carrito!</span>
        <span className="text-xs text-muted-foreground">{cantidad}x {product.nombre}</span>
      </div>
    );
    setCantidad(1); 
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
        {/* Etiqueta de Categoría Flotante - Oculta en móvil (hidden md:block) */}
        <div className="hidden md:block absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-border text-foreground px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
          {product.categoria}
        </div>
      </div>
      
      {/* CONTENIDO (Textos y Precios) */}
      <div className="p-4 md:p-5 flex flex-col flex-1 space-y-3">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 mb-1.5 line-clamp-1">
            <Tag className="w-3 h-3 shrink-0" /> {product.marca || "Exclusivo"}
          </p>

          {/* Título estrictamente truncado a 2 líneas para no romper la cuadrícula. 
              El atributo 'title' permite ver el nombre completo al dejar el cursor encima */}
          <h3 
            className="font-black text-sm md:text-base leading-tight text-foreground line-clamp-2 min-h-[2.5rem] break-words"
            title={product.nombre}
          >
            {product.nombre}
          </h3>
        </div>

        <div className="text-2xl font-black text-primary font-heading tracking-tight">
          S/ {product.precio.toFixed(2)}
        </div>

        {/* CONTROLES DE COMPRA */}
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

          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-black text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02] shadow-[0_0_15px_rgba(153,204,51,0.2)] active:scale-95"
          >
            <ShoppingCart className="h-4 w-4 shrink-0" />
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;