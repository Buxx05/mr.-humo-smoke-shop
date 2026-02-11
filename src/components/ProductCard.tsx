import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Creamos una nueva interfaz aquí mismo para reemplazar la que eliminamos
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
    toast.success("✅ Producto agregado al carrito");
    setCantidad(1);
  };

  return (
    <div className="group rounded-lg bg-card border border-border overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:border-primary/40 shadow-sm">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-heading font-semibold text-sm leading-tight text-card-foreground line-clamp-2 min-h-[40px]">
            {product.nombre}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Marca: {product.marca}</p>
        </div>

        <p className="text-xl font-heading font-bold text-primary">S/ {product.precio.toFixed(2)}</p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
            className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center hover:bg-border transition-colors text-foreground"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{cantidad}</span>
          <button
            onClick={() => setCantidad(cantidad + 1)}
            className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center hover:bg-border transition-colors text-foreground"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
        >
          <ShoppingCart className="h-4 w-4" />
          AGREGAR
        </button>
      </div>
    </div>
  );
};

export default ProductCard;