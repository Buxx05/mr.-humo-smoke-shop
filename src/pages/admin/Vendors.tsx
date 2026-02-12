import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserPlus, Trash2, Pencil, FileSpreadsheet, FileText, Search, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Cliente temporal solo para crear usuarios (para no cerrar tu sesión)
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

    // 1. Crear en Auth
    const { data: authData, error: authError } = await tempSupabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          dni: formData.dni,
          phone: formData.phone, // Ahora sí se guardará gracias al Trigger SQL
        }
      }
    });

    if (authError) {
      toast.error("Error: " + authError.message);
    } else if (authData.user) {
      // 2. Asignar rol de vendedor
      await supabase.from("profiles").update({ role: "vendedor" }).eq("id", authData.user.id);
      toast.success("Vendedor creado exitosamente");
      setIsCreateOpen(false);
      resetForm();
      fetchVendors();
    }
    setProcessing(false);
  };

  // --- LOGICA DE EDITAR (COMPLETA) ---
  const openEdit = (vendor: any) => {
    setFormData({
      id: vendor.id,
      email: vendor.email,
      password: "", // Se deja vacío. Si el admin escribe algo, se cambia la clave.
      fullName: vendor.full_name,
      dni: vendor.dni || "",
      phone: vendor.phone || ""
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // 1. Actualizar datos del perfil (Nombre, DNI, Celular)
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

    // 2. Si escribió una nueva contraseña, actualizarla usando la función SQL
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

  // --- LOGICA DE ELIMINAR TOTALMENTE ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("¡CUIDADO! ¿Estás seguro de eliminar PERMANENTEMENTE a este vendedor? Esta acción no se puede deshacer.")) return;
    
    // Llamamos a la función SQL de borrado total
    const { error } = await supabase.rpc('eliminar_usuario_total', { user_id: id });

    if (error) {
      toast.error("Error al eliminar: " + error.message);
    } else {
      toast.success("Vendedor eliminado del sistema.");
      fetchVendors();
    }
  };

  const resetForm = () => setFormData({ id: "", email: "", password: "", fullName: "", dni: "", phone: "" });

  // Paginación y Filtrado
  const filteredVendors = vendors.filter(v => 
    v.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.dni.includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const currentVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Exportar
  const exportExcel = () => {
    const ws = utils.json_to_sheet(vendors.map(v => ({
      Nombre: v.full_name,
      DNI: v.dni,
      Celular: v.phone,
      Email: v.email,
      Fecha: new Date(v.created_at).toLocaleDateString()
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Vendedores");
    writeFile(wb, "Vendedores.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Vendedores", 14, 10);
    autoTable(doc, {
      head: [['Nombre', 'DNI', 'Celular', 'Email']],
      body: vendors.map(v => [v.full_name, v.dni, v.phone, v.email]),
    });
    doc.save("Vendedores.pdf");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Gestión de Vendedores</h1>
          <p className="text-muted-foreground">Administra el acceso y contraseñas de tu equipo.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={exportExcel} title="Excel"><FileSpreadsheet className="w-4 h-4 text-green-600" /></Button>
          <Button variant="outline" size="icon" onClick={exportPDF} title="PDF"><FileText className="w-4 h-4 text-red-600" /></Button>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetForm}><UserPlus className="w-4 h-4" /> Nuevo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nuevo Vendedor</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <Input placeholder="Nombre Completo" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="DNI" maxLength={8} required value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
                  <Input placeholder="Celular" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <Input type="email" placeholder="Correo (Usuario)" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <Input type="password" placeholder="Contraseña" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                <Button type="submit" className="w-full" disabled={processing}>{processing ? "Guardando..." : "Crear Vendedor"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o DNI..." 
            className="max-w-sm border-none shadow-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVendors.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.full_name}</TableCell>
                  <TableCell>{v.dni}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3"/> {v.email}</div>
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3"/> {v.phone || "Sin N°"}</div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(v)} title="Editar datos y contraseña">
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)} title="Eliminar permanentemente">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {currentVendors.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8">No se encontraron vendedores.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-end p-4 gap-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        )}
      </Card>

      {/* MODAL DE EDICIÓN COMPLETO */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Vendedor</DialogTitle></DialogHeader>
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
                <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-muted-foreground">Correo (No editable)</Label>
              <Input disabled value={formData.email} className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-pass">Nueva Contraseña (Opcional)</Label>
              <Input 
                id="edit-pass"
                type="password" 
                placeholder="Dejar en blanco para mantener la actual" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
              <p className="text-[10px] text-muted-foreground">Si escribes aquí, se cambiará la contraseña del vendedor.</p>
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
              {processing ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendors;