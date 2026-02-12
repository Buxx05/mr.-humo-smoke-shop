import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, FileText, Search, ChevronLeft, ChevronRight, User } from "lucide-react";
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
      DNI: c.dni,
      Celular: c.phone,
      Email: c.email,
      Puntos: c.points_balance,
      Registro: new Date(c.created_at).toLocaleDateString()
    })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Clientes");
    writeFile(wb, "Base_Datos_Clientes.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Base de Datos de Clientes - Mr. Humo", 14, 10);
    autoTable(doc, {
      head: [['Nombre', 'DNI', 'Celular', 'Email', 'Puntos']],
      body: clients.map(c => [c.full_name, c.dni, c.phone, c.email, c.points_balance]),
    });
    doc.save("Clientes_MrHumo.pdf");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Base de Clientes</h1>
          <p className="text-muted-foreground">Visualiza y exporta la información de tus clientes registrados.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportExcel} className="gap-2"><FileSpreadsheet className="w-4 h-4 text-green-600" /> Excel</Button>
          <Button variant="outline" onClick={exportPDF} className="gap-2"><FileText className="w-4 h-4 text-red-600" /> PDF</Button>
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
                <TableHead className="text-center">Puntos</TableHead>
                <TableHead className="text-right">Fecha Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <div className="bg-primary/10 p-1 rounded-full"><User className="w-3 h-3 text-primary"/></div>
                    {c.full_name}
                  </TableCell>
                  <TableCell>{c.dni || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{c.email}</span>
                      <span>{c.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-primary">{c.points_balance}</span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {currentClients.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8">No se encontraron clientes.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end p-4 gap-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Clients;