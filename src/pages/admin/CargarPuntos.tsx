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
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertimos el Excel a JSON
        const rawData = utils.sheet_to_json(worksheet);
        
        // Mapeo inteligente de columnas (Por si Smartclick usa nombres distintos)
        const parsedData: ParsedRow[] = rawData.map((row: any) => {
          // Buscamos la columna DNI
          const dniKey = Object.keys(row).find(k => k.toUpperCase().includes('DNI') || k.toUpperCase().includes('DOC'));
          // Buscamos la columna Monto/Total
          const montoKey = Object.keys(row).find(k => k.toUpperCase().includes('TOTAL') || k.toUpperCase().includes('MONTO') || k.toUpperCase().includes('IMPORTE'));

          if (dniKey && montoKey) {
            // Regla de negocio: 1 Sol = 1 Punto (Redondeado)
            const puntosCalc = Math.floor(Number(row[montoKey]));
            return {
              dni: String(row[dniKey]).trim(),
              puntos: isNaN(puntosCalc) ? 0 : puntosCalc
            };
          }
          return null;
        }).filter(item => item !== null && item.puntos > 0) as ParsedRow[]; // Filtramos errores y compras de 0 soles

        setData(parsedData);
        setResult(null);
        
        if (parsedData.length === 0) {
          toast.error("No se encontraron columnas de DNI o Monto válidas en el Excel.");
        } else {
          toast.success(`Se encontraron ${parsedData.length} registros válidos.`);
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

    // Llamamos a la función segura de la base de datos enviando todo el JSON
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
      <div>
        <h1 className="text-3xl font-bold font-heading text-primary">Carga de Smartclick</h1>
        <p className="text-muted-foreground">Sube el reporte de ventas diario para asignar puntos a los clientes automáticamente.</p>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> Subir Archivo Excel
          </CardTitle>
          <CardDescription>Formatos soportados: .xlsx, .xls, .csv</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload} 
              className="max-w-sm cursor-pointer"
            />
            {fileName && <span className="text-sm text-muted-foreground flex items-center gap-1"><FileSpreadsheet className="w-4 h-4"/> {fileName}</span>}
          </div>

          {result && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-bold text-green-700">Puntos Asignados</p>
                  <p className="text-xs text-muted-foreground">{result.procesados} clientes registrados recibieron sus puntos.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-bold text-yellow-700">Puntos en Limbo</p>
                  <p className="text-xs text-muted-foreground">{result.limbo} compras guardadas para clientes sin cuenta web.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vista Previa de Datos</CardTitle>
              <CardDescription>Se sumarán un total de {data.reduce((acc, curr) => acc + curr.puntos, 0)} puntos.</CardDescription>
            </div>
            <Button onClick={procesarPuntos} disabled={loading} size="lg" className="shadow-lg">
              {loading ? "Procesando..." : "Confirmar y Subir Puntos"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-auto border rounded-md">
              <Table>
                <TableHeader className="bg-muted sticky top-0">
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>DNI / Documento</TableHead>
                    <TableHead className="text-right">Puntos a Sumar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-mono font-medium">{row.dni}</TableCell>
                      <TableCell className="text-right font-bold text-primary">+{row.puntos}</TableCell>
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