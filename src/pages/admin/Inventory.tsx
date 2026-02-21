import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { PackagePlus, RefreshCw, Pencil, Trash2, Upload, ImageIcon, Gift, Search, ChevronLeft, ChevronRight } from "lucide-react";

// DEFINICIÓN DE CATEGORÍAS Y SUBCATEGORÍAS
const CATEGORIES: Record<string, string[]> = {
  "Vapers": ["Desechables", "Recargables", "E-Liquid", "Sales de Nicotina", "Repuestos"],
  "Grinders": ["Mini Grinders", "Acrílicos", "Biodegradables", "Metálicos", "Combos Pipa + Grinder"],
  "Pipas": ["Metal", "Vidrio", "Silicona", "Artesanales"],
  "Bongs": ["Acrílicos", "Vidrio", "Silicona", "Kits"],
  "Papeles y Blunts": ["Blunts", "Papeles 1”", "Orgánicos", "Sabores", "Celulosa"],
  "Para Armado": ["Filtros", "Enrolladoras"],
  "Encendedores y Accesorios": ["Encendedores", "Otros Accesorios"],
  "Otros": ["General", "Nuevos Ingresos"]
};

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("products");
  
  // ESTADOS DE PRODUCTOS
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ESTADOS DE BUSQUEDA Y PAGINACION
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ESTADOS DE COMBOS
  const [combos, setCombos] = useState<any[]>([]);
  const [isComboDialogOpen, setIsComboDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'product' | 'combo' | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // FORMULARIO PRODUCTO
  const [prodForm, setProdForm] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    subcategory: "",
    image_url: "",
    is_redeemable: false,
    points_price: "0",
  });

  // FORMULARIO COMBO
  const [comboForm, setComboForm] = useState({
    title: "",
    products_list: "",
    price_normal: "",
    price_combo: "",
    image_url: ""
  });

  useEffect(() => {
    fetchProducts();
    fetchCombos();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const fetchCombos = async () => {
    const { data } = await supabase.from("combos").select("*").order("id", { ascending: false });
    setCombos(data || []);
  };

  // --- FILTRADO Y PAGINACION ---
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // --- SUBIDA DE IMAGEN (GENÉRICA Y SEGURA) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'combo') => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      // Generamos un nombre único con la fecha y un random
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);

      if (type === 'product') {
        setProdForm(prev => ({ ...prev, image_url: publicUrl }));
      } else {
        setComboForm(prev => ({ ...prev, image_url: publicUrl }));
      }
      toast.success("Imagen subida correctamente");
    } catch (error: any) {
      toast.error("Error al subir imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- LÓGICA DE PRODUCTOS ---
  const resetProdForm = () => {
    setProdForm({ name: "", brand: "", price: "", category: "", subcategory: "", image_url: "", is_redeemable: false, points_price: "0" });
    setEditingId(null);
  };

  const handleEditProduct = (product: any) => {
    setProdForm({
      name: product.name,
      brand: product.brand || "",
      price: product.price,
      category: product.category,
      subcategory: product.subcategory || "",
      image_url: product.image_url,
      is_redeemable: product.is_redeemable,
      points_price: product.points_price
    });
    setEditingId(product.id);
    setIsDialogOpen(true);
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name: prodForm.name,
      brand: prodForm.brand,
      price: parseFloat(prodForm.price),
      category: prodForm.category,
      subcategory: prodForm.subcategory,
      image_url: prodForm.image_url || "https://placehold.co/400x400/2d2d2d/FFF?text=SIN+FOTO",
      is_redeemable: prodForm.is_redeemable,
      points_price: parseInt(prodForm.points_price) || 0,
      active: true
    };

    let error;
    if (editingId) {
      const res = await supabase.from("products").update(productData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("products").insert([productData]);
      error = res.error;
    }

    if (error) toast.error("Error: " + error.message);
    else {
      toast.success(editingId ? "Producto actualizado" : "Producto creado");
      setIsDialogOpen(false);
      resetProdForm();
      fetchProducts();
    }
    setLoading(false);
  };

  const deleteProduct = async (id: number) => {
    setPendingDeleteId(id);
    setDeleteType('product');
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (pendingDeleteId === null) return;
    await supabase.from("products").delete().eq("id", pendingDeleteId);
    fetchProducts();
    setDeleteDialogOpen(false);
    setPendingDeleteId(null);
  };

  // --- LÓGICA DE COMBOS ---
  const handleEditCombo = (combo: any) => {
    setComboForm({
      title: combo.title,
      products_list: combo.products_list.join(", "),
      price_normal: combo.price_normal,
      price_combo: combo.price_combo,
      image_url: combo.image_url
    });
    setEditingId(combo.id);
    setIsComboDialogOpen(true);
  };

  const submitCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const pNormal = parseFloat(comboForm.price_normal);
    const pCombo = parseFloat(comboForm.price_combo);
    const discount = Math.round(((pNormal - pCombo) / pNormal) * 100);
    const listArray = comboForm.products_list.split(",").map(s => s.trim()).filter(s => s !== "");

    const comboData = {
      title: comboForm.title,
      products_list: listArray,
      price_normal: pNormal,
      price_combo: pCombo,
      discount: discount,
      image_url: comboForm.image_url || "https://placehold.co/400x400/2d2d2d/FFF?text=COMBO",
    };

    let error;
    if (editingId) {
      const res = await supabase.from("combos").update(comboData).eq("id", editingId);
      error = res.error;
    } else {
      const res = await supabase.from("combos").insert([comboData]);
      error = res.error;
    }

    if (error) toast.error("Error: " + error.message);
    else {
      toast.success(editingId ? "Combo actualizado" : "Combo creado");
      setIsComboDialogOpen(false);
      setComboForm({ title: "", products_list: "", price_normal: "", price_combo: "", image_url: "" });
      setEditingId(null);
      fetchCombos();
    }
    setLoading(false);
  };

  const deleteCombo = async (id: number) => {
    setPendingDeleteId(id);
    setDeleteType('combo');
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCombo = async () => {
    if (pendingDeleteId === null) return;
    await supabase.from("combos").delete().eq("id", pendingDeleteId);
    fetchCombos();
    setDeleteDialogOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Gestión de Inventario</h1>
          <p className="text-muted-foreground">Administra productos individuales y combos promocionales.</p>
        </div>
        <Button variant="outline" onClick={() => { fetchProducts(); fetchCombos(); }}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </Button>
      </div>

      <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="combos">Combos & Ofertas</TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA PRODUCTOS --- */}
        <TabsContent value="products" className="space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, marca..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if(!open) resetProdForm(); }}>
              <DialogTrigger asChild>
                <Button><PackagePlus className="w-4 h-4 mr-2" /> Nuevo Producto</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
                <DialogHeader><DialogTitle>{editingId ? "Editar Producto" : "Nuevo Producto"}</DialogTitle></DialogHeader>
                <form onSubmit={submitProduct} className="space-y-4 pt-4">
                  
                  {/* Carga de Imagen Producto */}
                  <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-lg border border-dashed border-primary/30">
                    <div className="h-20 w-20 bg-background rounded-md border flex items-center justify-center overflow-hidden relative">
                      {prodForm.image_url ? (
                        <img src={prodForm.image_url} alt="Vista previa" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="text-muted-foreground h-8 w-8" />
                      )}
                      {uploading && <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm"><RefreshCw className="animate-spin text-primary w-6 h-6" /></div>}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="img-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-md hover:bg-primary/20 w-fit transition-colors text-sm font-medium">
                          <Upload className="w-4 h-4" /> Subir Imagen (PC)
                        </div>
                        <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'product')} disabled={uploading} />
                      </Label>
                      <p className="text-xs text-muted-foreground mt-2">Formatos: JPG, PNG, WEBP. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Nombre del Producto</Label>
                      <Input required value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} placeholder="Ej. Vaper Spartan 8000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Marca</Label>
                      <Input required value={prodForm.brand} onChange={e => setProdForm({...prodForm, brand: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Precio (S/)</Label>
                      <Input type="number" step="0.1" required value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select value={prodForm.category} onValueChange={(val) => setProdForm({...prodForm, category: val, subcategory: ""})}>
                        <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(CATEGORIES).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subcategoría</Label>
                      <Select 
                        value={prodForm.subcategory} 
                        onValueChange={(val) => setProdForm({...prodForm, subcategory: val})} 
                        disabled={!prodForm.category}
                      >
                        <SelectTrigger><SelectValue placeholder="Tipo específico..." /></SelectTrigger>
                        <SelectContent>
                          {prodForm.category && CATEGORIES[prodForm.category]?.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-center justify-between">
                    <div>
                      <Label className="font-bold text-primary">¿Es Premio Canjeable?</Label>
                      <p className="text-xs text-muted-foreground">Actívalo para que salga en el Catálogo de Puntos</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {prodForm.is_redeemable && (
                         <Input 
                           type="number" 
                           step="1"
                           className="w-24 bg-background border-primary/50" 
                           placeholder="Puntos" 
                           value={prodForm.points_price} 
                           onChange={e => setProdForm({...prodForm, points_price: e.target.value})} 
                         />
                      )}
                      <Switch checked={prodForm.is_redeemable} onCheckedChange={(c) => setProdForm({...prodForm, is_redeemable: c})} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={uploading || loading}>
                    {editingId ? "Guardar Cambios" : "Crear Producto"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="overflow-hidden border-primary/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-secondary/50">
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Clasificación</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProducts.map((p) => (
                    <TableRow key={p.id} className={!p.active ? "opacity-50 bg-muted/50" : "hover:bg-secondary/20"}>
                      <TableCell><img src={p.image_url} loading="lazy" alt={p.name} className="w-12 h-12 rounded-md object-cover border bg-background" /></TableCell>
                      <TableCell>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md">{p.category}</span>
                        {p.subcategory && <span className="text-xs ml-1 text-muted-foreground font-medium">› {p.subcategory}</span>}
                      </TableCell>
                      <TableCell className="text-right font-black text-lg">S/ {p.price}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProduct(p)} className="hover:text-primary"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)} className="hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        {searchTerm ? "No se encontraron resultados para tu búsqueda." : "No hay productos registrados en el inventario."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            
            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end p-4 gap-2 border-t bg-secondary/30">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-bold mx-2">Página {currentPage} de {totalPages}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* --- PESTAÑA COMBOS --- */}
        <TabsContent value="combos" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isComboDialogOpen} onOpenChange={(open) => { setIsComboDialogOpen(open); if(!open) setEditingId(null); }}>
              <DialogTrigger asChild>
                <Button><Gift className="w-4 h-4 mr-2" /> Nuevo Combo</Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogHeader><DialogTitle>{editingId ? "Editar Combo" : "Nuevo Combo Promocional"}</DialogTitle></DialogHeader>
                <form onSubmit={submitCombo} className="space-y-4 pt-4">
                  
                  {/* Carga de Imagen Combo Mejorada */}
                  <div className="flex items-center gap-4 bg-secondary/20 p-4 rounded-lg border border-dashed border-primary/30">
                    <div className="h-16 w-16 bg-background rounded-md border flex items-center justify-center overflow-hidden relative">
                      {comboForm.image_url ? (
                        <img src={comboForm.image_url} alt="Vista previa combo" className="h-full w-full object-cover" />
                      ) : (
                        <Gift className="text-muted-foreground h-8 w-8 opacity-50" />
                      )}
                      {uploading && <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm"><RefreshCw className="animate-spin text-primary w-5 h-5" /></div>}
                    </div>
                    <div>
                      <Label htmlFor="combo-img-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded-md hover:bg-primary/20 transition-colors text-sm font-bold">
                          <Upload className="w-4 h-4" /> Subir Portada
                        </div>
                        <input id="combo-img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'combo')} disabled={uploading} />
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Título del Combo</Label>
                    <Input required value={comboForm.title} onChange={e => setComboForm({...comboForm, title: e.target.value})} placeholder="Ej. Pack Inicio Vaper" />
                  </div>
                  <div className="space-y-2">
                    <Label>Productos Incluidos (Separados por coma)</Label>
                    <Input required value={comboForm.products_list} onChange={e => setComboForm({...comboForm, products_list: e.target.value})} placeholder="Vaper 8000, Líquido 30ml, Cordón..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Precio Real (S/)</Label>
                      <Input type="number" step="0.1" required value={comboForm.price_normal} onChange={e => setComboForm({...comboForm, price_normal: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-primary font-bold">Precio Oferta (S/)</Label>
                      <Input type="number" step="0.1" required value={comboForm.price_combo} onChange={e => setComboForm({...comboForm, price_combo: e.target.value})} className="border-primary focus-visible:ring-primary" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={uploading || loading}>
                    {editingId ? "Actualizar Combo" : "Crear Combo"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((c) => (
              <Card key={c.id} className="relative group overflow-hidden border-border hover:border-primary transition-colors bg-card">
                <div className="aspect-video bg-background relative border-b">
                  <img src={c.image_url} loading="lazy" alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                    -{c.discount}% OFF
                  </div>
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-black text-xl leading-tight">{c.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{c.products_list.join(" + ")}</p>
                  <div className="flex items-baseline gap-3 mt-4 bg-secondary/30 p-3 rounded-lg border">
                    <span className="text-2xl font-black text-primary">S/ {c.price_combo}</span>
                    <span className="text-sm text-muted-foreground line-through font-medium">S/ {c.price_normal}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 hover:text-primary hover:border-primary" onClick={() => handleEditCombo(c)}>
                      <Pencil className="w-3 h-3 mr-2" /> Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-destructive hover:text-destructive-foreground" onClick={() => deleteCombo(c.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {combos.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No hay combos u ofertas activas.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === 'product'
                ? '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.'
                : '¿Estás seguro de que deseas eliminar este combo? Esta acción no se puede deshacer.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteType === 'product' ? confirmDeleteProduct : confirmDeleteCombo} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inventory;