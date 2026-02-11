import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, CheckCircle, XCircle, Gift, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

const Validator = () => {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponInfo, setCouponInfo] = useState<any>(null);

  const searchCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setCouponInfo(null);

    // Formatear código automáticamente (por si el vendedor lo escribe en minúsculas)
    let formattedCode = code.toUpperCase().trim();
    if (!formattedCode.startsWith('MRH-') && formattedCode.length > 0) {
      formattedCode = `MRH-${formattedCode}`;
    }

    // Buscar el cupón trayendo datos del cliente y del producto
    const { data, error } = await supabase
      .from('coupons')
      .select(`
        *,
        profiles:user_id (full_name, dni),
        products:product_id (name, image_url)
      `)
      .eq('code', formattedCode)
      .single();

    if (error || !data) {
      toast.error("Cupón no encontrado. Verifica el código.");
      setLoading(false);
      return;
    }

    setCouponInfo(data);
    setLoading(false);
  };

  const handleValidate = async () => {
    if (!couponInfo || couponInfo.status !== 'pendiente') return;
    setLoading(true);

    const { error } = await supabase
      .from('coupons')
      .update({ 
        status: 'canjeado', 
        redeemed_at: new Date().toISOString(),
        redeemed_by: user?.id 
      })
      .eq('id', couponInfo.id);

    if (error) {
      toast.error("Error de conexión al validar el cupón");
    } else {
      toast.success("¡ÉXITO! Producto validado y listo para entregar.");
      setCouponInfo({ ...couponInfo, status: 'canjeado' }); // Actualizamos la vista
      setCode(""); // Limpiamos el input para el siguiente cliente
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-heading text-primary">Validar Cupón</h1>
        <p className="text-muted-foreground">Escribe el código que te muestra el cliente para entregar su premio.</p>
      </div>

      <Card className="shadow-sm border-primary/20">
        <CardContent className="pt-6">
          <form onSubmit={searchCoupon} className="flex gap-2">
            <Input 
              placeholder="Ejemplo: MRH-A8F3B" 
              className="text-lg uppercase font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="submit" disabled={loading} className="w-32">
              <Search className="w-4 h-4 mr-2" /> Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {couponInfo && (
        <Card className={`border-2 shadow-md transition-colors ${couponInfo.status === 'pendiente' ? 'border-primary' : 'border-destructive'}`}>
          <CardHeader className="pb-2 border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Detalles del Canje</CardTitle>
              {couponInfo.status === 'pendiente' ? (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> LISTO PARA ENTREGAR
                </span>
              ) : (
                <span className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> CUPÓN YA USADO
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-4 bg-secondary/50 p-4 rounded-lg">
              <img src={couponInfo.products?.image_url} alt="Producto" className="w-20 h-20 rounded-md object-cover border bg-background" />
              <div>
                <p className="font-bold text-xl leading-tight">{couponInfo.products?.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Gift className="w-4 h-4" /> Costo: {couponInfo.points_cost} puntos
                </p>
              </div>
            </div>

            <div className="bg-background border rounded-lg p-4 space-y-3">
              <p className="text-sm flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-muted-foreground w-16">Cliente:</span> 
                {couponInfo.profiles?.full_name}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="w-4 h-4" />
                <span className="font-semibold text-muted-foreground w-16">DNI:</span> 
                {couponInfo.profiles?.dni}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="w-4 h-4" />
                <span className="font-semibold text-muted-foreground w-16">Código:</span> 
                <span className="font-mono bg-secondary px-2 py-0.5 rounded font-bold text-primary">{couponInfo.code}</span>
              </p>
            </div>
          </CardContent>
          {couponInfo.status === 'pendiente' && (
            <CardFooter className="bg-muted/30 pt-4">
              <Button 
                className="w-full text-lg h-14 font-bold shadow-lg shadow-primary/20" 
                onClick={handleValidate}
                disabled={loading}
              >
                {loading ? "Procesando..." : "✅ VALIDAR Y ENTREGAR PRODUCTO"}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default Validator;