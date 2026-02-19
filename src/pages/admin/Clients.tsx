import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, FileText, Search, ChevronLeft, ChevronRight, User, UsersRound, RefreshCw } from "lucide-react";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "cliente")
      .order("created_at", { ascending: false });
    setClients(data || []);
    setLoading(false);
  };

  const filteredClients = clients.filter(c => 
    (c.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.dni || "").includes(searchTerm)
  );
  
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportExcel = () => {
    const ws = utils.json_to_sheet(clients.map(c => ({
      Nombre: c.full_name,
      DNI: c.dni || 'No registrado',
      Celular: c.phone || 'No registrado',
      Email: c.email,
      Puntos: c.points_balance,
      Registro: new Date(c.created_at).toLocaleDateString()
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Clientes");
    writeFile(wb, "Base_Datos_Clientes_MrHumo.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Base de Datos de Clientes - Mr. Humo", 14, 10);
    autoTable(doc, {
      head: [['Nombre', 'DNI', 'Celular', 'Email', 'Puntos']],
      body: clients.map(c => [
        c.full_name, 
        c.dni || '-', 
        c.phone || '-', 
        c.email, 
        `${c.points_balance} pts`
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [153, 204, 51] } // Tu verde corporativo (#99CC33)
    });
    doc.save("Clientes_MrHumo.pdf");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-3 rounded-lg text-primary">
            <UsersRound className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-heading text-primary leading-none">Base de Clientes</h1>
            <p className="text-muted-foreground text-sm mt-1">Directorio oficial y exportación de datos.</p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchClients} className="shrink-0" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </Button>
      </div>

      <Card className="border-primary/20 shadow-lg bg-card overflow-hidden">
        
        {/* BARRA DE HERRAMIENTAS (Buscador y Exportación) */}
        <div className="p-4 border-b border-border/50 bg-secondary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre o DNI..." 
              className="pl-9 border-primary/20 focus-visible:ring-primary shadow-inner bg-background"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={exportExcel} 
              className="flex-1 sm:flex-none gap-2 border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500 transition-colors font-bold"
            >
              <FileSpreadsheet className="w-4 h-4" /> Excel
            </Button>
            <Button 
              variant="outline" 
              onClick={exportPDF} 
              className="flex-1 sm:flex-none gap-2 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500 transition-colors font-bold"
            >
              <FileText className="w-4 h-4" /> PDF
            </Button>
          </div>
        </div>

        {/* TABLA DE CLIENTES */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4">Cliente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Datos de Contacto</TableHead>
                  <TableHead className="text-center">Puntos Disponibles</TableHead>
                  <TableHead className="text-right">Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Cargando directorio de clientes...</p>
                    </TableCell>
                  </TableRow>
                ) : currentClients.map((c) => (
                  <TableRow key={c.id} className="hover:bg-secondary/20 transition-colors group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-foreground text-base">{c.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground font-medium">{c.dni || "---"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm space-y-0.5">
                        <span className="text-foreground">{c.email}</span>
                        <span className="text-muted-foreground">{c.phone || "Sin teléfono"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-full font-black text-sm shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {c.points_balance} pts
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground font-medium">
                      {new Date(c.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && currentClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground bg-secondary/10">
                      {searchTerm ? "No se encontraron clientes con ese nombre o DNI." : "Aún no hay clientes registrados en la plataforma."}
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
    </div>
  );
};

export default Clients;