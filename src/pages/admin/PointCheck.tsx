import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Ticket, AlertCircle, ScanFace } from "lucide-react";
import { toast } from "sonner";

const PointCheck = () => {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [pendingCoupons, setPendingCoupons] = useState<any[]>([]);

  // Referencia para el auto-enfoque
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convertimos a mayúsculas (por si es Carné de Extranjería) y evitamos espacios
    const value = e.target.value.toUpperCase().trim();
    setDni(value);
    
    // Si empieza a escribir otro DNI, ocultamos los datos del cliente anterior para evitar errores
    if (clientData) {
      setClientData(null);
      setPendingCoupons([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni) return;
    
    setLoading(true);

    // 1. Buscar Cliente
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("dni", dni)
      .single();

    if (error || !profile) {
      toast.error("No se encontró ningún cliente con ese DNI / Documento.");
      setLoading(false);
      inputRef.current?.focus();
      return;
    }

    setClientData(profile);

    // 2. Buscar si tiene cupones pendientes de canje
    const { data: coupons } = await supabase
      .from("coupons")
      .select(`
        *,
        products (name)
      `)
      .eq("user_id", profile.id)
      .eq("status", "pendiente");

    if (coupons) setPendingCoupons(coupons);
    
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* HEADER DE LA PÁGINA */}
      <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-xl border border-border">
        <div className="bg-primary/20 p-3 rounded-lg text-primary">
          <ScanFace className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-primary leading-none">Consulta de Puntos</h1>
          <p className="text-muted-foreground text-sm mt-1">Verifica el saldo de un cliente usando su DNI o CE.</p>
        </div>
      </div>

      {/* BUSCADOR */}
      <Card className="shadow-lg border-primary/20 bg-card">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <Input 
              ref={inputRef}
              placeholder="Ingresa el Documento..." 
              className="text-2xl md:text-3xl h-16 md:h-20 font-mono text-center tracking-[0.1em] border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary shadow-inner bg-background"
              maxLength={15}
              value={dni}
              onChange={handleDniChange}
            />
            <Button type="submit" disabled={loading || !dni} className="h-16 md:h-20 sm:w-40 text-lg font-bold shadow-lg shadow-primary/20">
              {loading ? "Buscando..." : <><Search className="w-6 h-6 mr-2" /> Buscar</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RESULTADOS DEL CLIENTE */}
      {clientData && (
        <div className="space-y-4 animate-fade-in-up">
          
          {/* Tarjeta de Información Principal */}
          <Card className="overflow-hidden border-2 border-primary shadow-primary/10">
            <CardContent className="p-6 md:p-8 bg-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Datos Personales */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cliente Encontrado</p>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground leading-tight">{clientData.full_name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-muted-foreground bg-secondary/30 p-2 rounded-lg border w-fit">
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {clientData.dni}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{clientData.email}</span>
                  </div>
                </div>

                {/* Saldo Gigante */}
                <div className="text-left md:text-right bg-background p-4 rounded-xl border border-primary/20 shadow-inner md:min-w-[200px]">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Saldo Disponible</p>
                  <p className="text-4xl md:text-5xl font-black text-primary font-heading tracking-tight">{clientData.points_balance}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Puntos MRH</p>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Alertas de Cupones Pendientes (Adaptado para Dark Mode) */}
          {pendingCoupons.length > 0 ? (
            <div className="space-y-3 mt-6">
              <p className="font-black flex items-center gap-2 text-orange-400 text-lg">
                <Ticket className="w-6 h-6" /> ¡ATENCIÓN! Premios por recoger:
              </p>
              <div className="grid gap-3">
                {pendingCoupons.map((coupon) => (
                  <div key={coupon.id} className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-orange-500/20 transition-colors">
                    <div>
                      <span className="font-black text-orange-400 text-lg block">{coupon.products?.name}</span>
                      <p className="text-sm text-orange-400/80 mt-1">
                        Dile al cliente que muestre el código: <span className="font-mono font-bold bg-background/50 px-2 py-1 rounded text-orange-300 border border-orange-500/20">{coupon.code}</span>
                      </p>
                    </div>
                    <div className="bg-orange-500/20 px-4 py-2 rounded-lg text-xs font-black text-orange-400 border border-orange-500/30 text-center uppercase tracking-widest shrink-0">
                      Pendiente
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-secondary/30 border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground text-center mt-6">
              <div className="bg-background p-3 rounded-full shadow-inner border">
                <AlertCircle className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="font-medium">El cliente no tiene premios pendientes de entrega.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PointCheck;