import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { UserPlus, Trash2, Pencil, FileSpreadsheet, FileText, Search, ChevronLeft, ChevronRight, Phone, Mail, UserCog, RefreshCw, ShieldCheck } from "lucide-react";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Cliente temporal solo para crear usuarios (para no cerrar tu sesión de Super Admin)
const tempSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

const Vendors = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    fullName: "",
    dni: "",
    phone: ""
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "vendedor")
      .order("created_at", { ascending: false });
    setVendors(data || []);
    setLoading(false);
  };

  // --- LOGICA DE CREAR ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const { data: authData, error: authError } = await tempSupabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          dni: formData.dni,
          phone: formData.phone, 
        }
      }
    });

    if (authError) {
      toast.error("Error: " + authError.message);
    } else if (authData.user) {
      await supabase.from("profiles").update({ role: "vendedor" }).eq("id", authData.user.id);
      toast.success("Vendedor creado exitosamente");
      setIsCreateOpen(false);
      resetForm();
      fetchVendors();
    }
    setProcessing(false);
  };

  // --- LOGICA DE EDITAR ---
  const openEdit = (vendor: any) => {
    setFormData({
      id: vendor.id,
      email: vendor.email,
      password: "", 
      fullName: vendor.full_name,
      dni: vendor.dni || "",
      phone: vendor.phone || ""
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: formData.fullName,
        dni: formData.dni,
        phone: formData.phone
      })
      .eq("id", formData.id);

    if (profileError) {
      toast.error("Error al actualizar perfil");
      setProcessing(false);
      return;
    }

    if (formData.password.trim().length > 0) {
      if (formData.password.length < 6) {
        toast.error("La nueva contraseña debe tener al menos 6 caracteres");
        setProcessing(false);
        return;
      }

      const { error: passError } = await supabase.rpc('actualizar_password_vendedor', {
        user_id: formData.id,
        new_password: formData.password
      });

      if (passError) {
        toast.error("Error al actualizar la contraseña: " + passError.message);
        setProcessing(false);
        return;
      }
      toast.success("Datos y contraseña actualizados");
    } else {
      toast.success("Datos actualizados (Contraseña sin cambios)");
    }

    setIsEditOpen(false);
    fetchVendors();
    setProcessing(false);
  };

  // --- LOGICA DE ELIMINAR ---
  const handleDelete = async (id: string) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    
    const { error } = await supabase.rpc('eliminar_usuario_total', { user_id: pendingDeleteId });

    if (error) {
      toast.error("Error al eliminar: " + error.message);
    } else {
      toast.success("Vendedor eliminado del sistema.");
      fetchVendors();
    }
    setDeleteDialogOpen(false);
    setPendingDeleteId(null);
  };

  const resetForm = () => setFormData({ id: "", email: "", password: "", fullName: "", dni: "", phone: "" });

  const filteredVendors = vendors.filter(v => 
    v.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.dni || "").includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const currentVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportExcel = () => {
    const ws = utils.json_to_sheet(vendors.map(v => ({
      Nombre: v.full_name,
      DNI: v.dni || '-',
      Celular: v.phone || '-',
      Email: v.email,
      Registro: new Date(v.created_at).toLocaleDateString()
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Vendedores");
    writeFile(wb, "Equipo_Ventas_MrHumo.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Equipo de Ventas - Mr. Humo", 14, 10);
    autoTable(doc, {
      head: [['Nombre', 'DNI', 'Celular', 'Email']],
      body: vendors.map(v => [v.full_name, v.dni || '-', v.phone || '-', v.email]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [153, 204, 51] } // Verde Corporativo
    });
    doc.save("Equipo_Ventas_MrHumo.pdf");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-3 rounded-lg text-primary">
            <UserCog className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-heading text-primary leading-none">Gestión de Vendedores</h1>
            <p className="text-muted-foreground text-sm mt-1">Administra el acceso y credenciales de tu equipo de tienda.</p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchVendors} className="shrink-0" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </Button>
      </div>

      <Card className="border-primary/20 shadow-lg bg-card overflow-hidden">
        
        {/* BARRA DE HERRAMIENTAS */}
        <div className="p-4 border-b border-border/50 bg-secondary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar personal por nombre o DNI..." 
              className="pl-9 border-primary/20 focus-visible:ring-primary shadow-inner bg-background"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" onClick={exportExcel} title="Exportar a Excel" className="border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400">
              <FileSpreadsheet className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={exportPDF} title="Exportar a PDF" className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400">
              <FileText className="w-4 h-4" />
            </Button>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20 font-bold ml-2" onClick={resetForm}>
                  <UserPlus className="w-4 h-4" /> Registrar Vendedor
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogHeader><DialogTitle>Nuevo Acceso de Vendedor</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <Input placeholder="Ej. Carlos Mendoza" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>DNI</Label>
                      <Input placeholder="Número" maxLength={8} required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Celular</Label>
                      <Input placeholder="Opcional" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Correo de Acceso (Usuario)</Label>
                    <Input type="email" placeholder="vendedor1@mrhumo.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña Inicial</Label>
                    <Input type="password" placeholder="Mínimo 6 caracteres" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={processing}>{processing ? "Registrando en Base de Datos..." : "Crear Vendedor"}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* TABLA DE VENDEDORES */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4">Vendedor</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Datos de Acceso</TableHead>
                  <TableHead className="text-right">Gestión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && vendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Cargando equipo de ventas...</p>
                    </TableCell>
                  </TableRow>
                ) : currentVendors.map((v) => (
                  <TableRow key={v.id} className="hover:bg-secondary/20 transition-colors group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-foreground text-base">{v.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground font-medium">{v.dni || "---"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm space-y-1">
                        <span className="text-foreground flex items-center gap-2"><Mail className="w-3 h-3 text-muted-foreground"/> {v.email}</span>
                        <span className="text-muted-foreground flex items-center gap-2"><Phone className="w-3 h-3"/> {v.phone || "Sin N°"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)} title="Editar datos y contraseña" className="hover:text-primary hover:bg-primary/10">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)} title="Eliminar permanentemente" className="hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && currentVendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground bg-secondary/10">
                      {searchTerm ? "No se encontró ningún vendedor con esos datos." : "Aún no has registrado vendedores."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end p-4 gap-2 border-t border-border/50 bg-secondary/10">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="hover:text-primary hover:border-primary">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-bold mx-2">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="hover:text-primary hover:border-primary">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>

      {/* MODAL DE EDICIÓN */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader><DialogTitle>Actualizar Vendedor</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>DNI</Label>
                <Input maxLength={8} required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Celular</Label>
                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-muted-foreground">Correo de Acceso (No editable)</Label>
              <Input disabled value={formData.email} className="bg-muted text-muted-foreground font-medium" />
            </div>

            <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
              <Label htmlFor="edit-pass" className="text-primary font-bold">Forzar Nueva Contraseña (Opcional)</Label>
              <Input 
                id="edit-pass"
                type="password" 
                placeholder="Dejar en blanco para no cambiarla" 
                value={formData.password} 
                className="bg-background"
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <p className="text-xs text-muted-foreground mt-1">Si escribes aquí, reemplazarás la contraseña actual del vendedor.</p>
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Guardando en Base de Datos..." : "Guardar Cambios"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación de vendedor */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Eliminación Permanente</AlertDialogTitle>
            <AlertDialogDescription>
              ¡ATENCIÓN! Estás a punto de eliminar PERMANENTEMENTE a este vendedor del sistema. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sí, Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vendors;