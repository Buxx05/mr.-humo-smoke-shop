import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Gift, Ticket, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const PointCheck = () => {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [pendingCoupons, setPendingCoupons] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;
    
    setLoading(true);
    setClientData(null);
    setPendingCoupons([]);

    // 1. Buscar Cliente
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("dni", dni.trim())
      .single();

    if (error || !profile) {
      toast.error("No se encontró ningún cliente con ese DNI.");
      setLoading(false);
      return;
    }

    setClientData(profile);

    // 2. Buscar si tiene cupones pendientes (para recordarle que los canjee)
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
      <div>
        <h1 className="text-3xl font-bold font-heading text-primary">Consulta de Puntos</h1>
        <p className="text-muted-foreground">Verifica el saldo de un cliente con su DNI.</p>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="Ingresa DNI del cliente..." 
              className="text-lg"
              maxLength={8}
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <Button type="submit" disabled={loading} className="w-32">
              {loading ? "..." : <><Search className="w-4 h-4 mr-2" /> Buscar</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {clientData && (
        <div className="space-y-4">
          {/* Tarjeta de Información Principal */}
          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{clientData.full_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> DNI: {clientData.dni}</span>
                    <span>•</span>
                    <span>{clientData.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Saldo Disponible</p>
                  <p className="text-4xl font-bold text-primary font-heading">{clientData.points_balance} pts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Cupones Pendientes */}
          {pendingCoupons.length > 0 ? (
            <div className="space-y-2">
              <p className="font-semibold flex items-center gap-2"><Ticket className="w-4 h-4 text-orange-500" /> Premios por recoger:</p>
              {pendingCoupons.map((coupon) => (
                <div key={coupon.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-orange-800">{coupon.products?.name}</span>
                    <p className="text-xs text-orange-600">Código: <span className="font-mono font-bold">{coupon.code}</span></p>
                  </div>
                  <div className="bg-white px-2 py-1 rounded text-xs font-bold text-orange-600 border border-orange-100">
                    PENDIENTE
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-2 text-muted-foreground text-sm">
              <AlertCircle className="w-4 h-4" /> El cliente no tiene premios pendientes de canje.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PointCheck;