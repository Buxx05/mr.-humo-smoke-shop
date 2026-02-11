import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PackagePlus, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Formulario de nuevo producto
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    image_url: "",
    is_redeemable: false,
    points_price: "0",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (error) {
      toast.error("Error al cargar el inventario");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct = {
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url || "https://placehold.co/400x400/2d2d2d/FFF?text=FOTO",
      is_redeemable: formData.is_redeemable,
      points_price: parseInt(formData.points_price) || 0,
      active: true
    };

    const { error } = await supabase.from("products").insert([newProduct]);

    if (error) {
      toast.error("Error al guardar el producto: " + error.message);
    } else {
      toast.success("Producto agregado correctamente");
      setIsDialogOpen(false);
      setFormData({ name: "", brand: "", price: "", category: "", image_url: "", is_redeemable: false, points_price: "0" });
      fetchProducts();
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from("products").update({ active: !currentStatus }).eq("id", id);
    if (!error) fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if(!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("No se puede eliminar porque está en el historial de algún cliente. Mejor ocúltalo (Inactivo).");
    else fetchProducts();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Inventario Web</h1>
          <p className="text-muted-foreground">Gestiona los productos visibles en la tienda y en el catálogo de premios.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProducts} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><PackagePlus className="w-4 h-4 mr-2" /> Nuevo Producto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar al Catálogo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name">Nombre del Producto</Label>
                    <Input id="name" required value={formData.name} onChange={handleInputChange} placeholder="Ej. ELF BAR 5000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input id="brand" required value={formData.brand} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Input id="category" required value={formData.category} onChange={handleInputChange} placeholder="Vapers, Accesorios..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (S/)</Label>
                    <Input id="price" type="number" step="0.10" required value={formData.price} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de Imagen</Label>
                    <Input id="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4 space-y-4">
                  <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base">¿Es Canjeable por Puntos?</Label>
                      <p className="text-xs text-muted-foreground">Aparecerá en el Catálogo de Premios</p>
                    </div>
                    <Switch 
                      checked={formData.is_redeemable} 
                      onCheckedChange={(checked) => setFormData({ ...formData, is_redeemable: checked })} 
                    />
                  </div>
                  
                  {formData.is_redeemable && (
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="points_price">Costo en Puntos</Label>
                      <Input id="points_price" type="number" required value={formData.points_price} onChange={handleInputChange} />
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full">Guardar Producto</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-[80px]">Foto</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Tipo</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} className={!p.active ? "opacity-50 bg-muted/50" : ""}>
                  <TableCell>
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-md object-cover border bg-background" />
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold leading-tight">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-right font-medium">S/ {p.price}</TableCell>
                  <TableCell className="text-center">
                    {p.is_redeemable 
                      ? <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">{p.points_price} pts</span>
                      : <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">Venta Reg.</span>
                    }
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch checked={p.active} onCheckedChange={() => toggleActive(p.id, p.active)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteProduct(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hay productos registrados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;