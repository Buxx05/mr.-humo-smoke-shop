import { useState } from "react";
import { read, utils } from "xlsx";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react";

interface ParsedRow {
  dni: string;
  puntos: number;
}

const CargarPuntos = () => {
  const [data, setData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{procesados: number, limbo: number} | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        const workbook = read(buffer, { type: "array" });
        
        // 1. Seleccionar la hoja correcta (Buscamos la de PAGOS, o por defecto la 2da hoja)
        const targetSheetName = workbook.SheetNames.find(s => s.toUpperCase().includes("PAGOS")) 
          || (workbook.SheetNames.length > 1 ? workbook.SheetNames[1] : workbook.SheetNames[0]);
        
        const worksheet = workbook.Sheets[targetSheetName];
        const rawData = utils.sheet_to_json(worksheet);
        
        // Usamos un Map para agrupar puntos si un cliente compró varias veces el mismo día
        const puntosAgrupados = new Map<string, number>();

        rawData.forEach((row: any) => {
          // Buscamos columnas RECEPTOR y MONTO
          const receptorKey = Object.keys(row).find(k => k.toUpperCase().includes('RECEPTOR'));
          const montoKey = Object.keys(row).find(k => k.toUpperCase() === 'MONTO' || k.toUpperCase().includes('MONTO REALIZADO') || k.toUpperCase().includes('TOTAL'));

          if (receptorKey && montoKey) {
            // Extraer string "71234567 - JUAN PEREZ"
            const receptorStr = String(row[receptorKey]).trim();
            
            // 2. Limpiar el DNI: cortamos por el guion y tomamos solo la primera parte
            const dniLimpio = receptorStr.split('-')[0].trim();
            
            // 3. Ignorar clientes genéricos (00000000) o DNIs vacíos
            if (dniLimpio && dniLimpio !== "00000000" && dniLimpio !== "0") {
              const puntos = Math.floor(Number(row[montoKey]));
              
              if (!isNaN(puntos) && puntos > 0) {
                const puntosActuales = puntosAgrupados.get(dniLimpio) || 0;
                puntosAgrupados.set(dniLimpio, puntosActuales + puntos);
              }
            }
          }
        });

        // Convertimos el Map a un array para la tabla
        const parsedData: ParsedRow[] = Array.from(puntosAgrupados.entries()).map(([dni, puntos]) => ({
          dni,
          puntos
        }));

        setData(parsedData);
        setResult(null);
        
        if (parsedData.length === 0) {
          toast.error("No se encontraron compras con DNI registrado (Ignorando Clientes Varios).");
        } else {
          toast.success(`Se agruparon ${parsedData.length} clientes válidos.`);
        }
      } catch (error) {
        toast.error("Error al leer el archivo Excel.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const procesarPuntos = async () => {
    if (data.length === 0) return;
    setLoading(true);

    const { data: response, error } = await supabase.rpc('procesar_excel_puntos', {
      datos: data
    });

    if (error) {
      toast.error("Hubo un error al procesar los puntos en la base de datos.");
    } else {
      toast.success("¡Carga masiva completada con éxito!");
      setResult(response);
      setData([]); // Limpiamos la tabla
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-xl border border-border">
        <div className="bg-primary/20 p-3 rounded-lg text-primary">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-primary leading-none">Carga Masiva (Excel)</h1>
          <p className="text-muted-foreground text-sm mt-1">Sube el reporte de ventas diario para asignar puntos automáticamente.</p>
        </div>
      </div>

      <Card className="border-primary/20 shadow-lg bg-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="flex items-center gap-2">
            1. Sube tu Reporte de Caja
          </CardTitle>
          <CardDescription>Formatos soportados: .xlsx, .xls, .csv. (El sistema ignorará automáticamente a "Clientes Varios")</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {result && (
            <div className="bg-card border border-primary/20 shadow-inner rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
              <div className="flex items-center gap-4 bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                <CheckCircle className="w-10 h-10 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-500 uppercase tracking-widest">Puntos Asignados</p>
                  <p className="text-xs text-muted-foreground mt-0.5"><strong className="text-foreground">{result.procesados}</strong> clientes recibieron sus puntos exitosamente.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                <AlertTriangle className="w-10 h-10 text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-black text-orange-500 uppercase tracking-widest">Puntos en Limbo</p>
                  <p className="text-xs text-muted-foreground mt-0.5"><strong className="text-foreground">{result.limbo}</strong> compras en espera a que el cliente cree su cuenta.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full relative">
              <Input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileUpload} 
                className="cursor-pointer file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-primary/90 h-12"
              />
            </div>
            {fileName && <span className="text-sm font-medium text-primary flex items-center gap-2 w-full sm:w-auto shrink-0 bg-primary/10 px-3 py-2 rounded-md"><FileSpreadsheet className="w-5 h-5"/> {fileName}</span>}
          </div>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card className="border-primary/20 shadow-lg bg-card animate-fade-in-up">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 bg-secondary/20">
            <div>
              <CardTitle className="text-lg">2. Vista Previa de Puntos</CardTitle>
              <CardDescription>Revisa los montos antes de confirmar. Se sumarán un total de <strong className="text-primary">{data.reduce((acc, curr) => acc + curr.puntos, 0)} puntos</strong>.</CardDescription>
            </div>
            <Button onClick={procesarPuntos} disabled={loading} size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20 text-md font-bold hover:scale-105 transition-transform">
              {loading ? "Procesando DB..." : "Confirmar y Subir Puntos"}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-auto custom-scrollbar">
              <Table>
                <TableHeader className="bg-background sticky top-0 z-10 shadow-sm">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>DNI / Documento Identidad</TableHead>
                    <TableHead className="text-right">Puntos Ganados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} className="hover:bg-secondary/30 transition-colors">
                      <TableCell className="text-muted-foreground font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono font-bold text-foreground">{row.dni}</TableCell>
                      <TableCell className="text-right font-black text-primary text-lg">+{row.puntos}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CargarPuntos;