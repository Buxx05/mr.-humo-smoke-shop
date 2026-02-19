import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, CheckCircle, XCircle, Gift, User as UserIcon, ScanLine } from "lucide-react";
import { toast } from "sonner";

const Validator = () => {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponInfo, setCouponInfo] = useState<any>(null);
  
  // Referencia para mantener el cursor siempre listo (Ideal para lector de código de barras)
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Al cargar la página, enfocamos el input automáticamente
    inputRef.current?.focus();
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    // Si empieza a escribir un nuevo código, ocultamos la tarjeta del cliente anterior
    if (couponInfo) setCouponInfo(null);
  };

  const searchCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setCouponInfo(null);

    // Formatear código automáticamente
    let formattedCode = code.toUpperCase().trim();
    if (!formattedCode.startsWith('MRH-') && formattedCode.length > 0) {
      formattedCode = `MRH-${formattedCode}`;
    }

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
      toast.error("Cupón no encontrado. Verifica el código con el cliente.");
      setLoading(false);
      // Re-enfocar el input para que intente de nuevo rápido
      inputRef.current?.focus();
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
      toast.success("¡ÉXITO! Producto validado y restado del sistema.");
      setCouponInfo({ ...couponInfo, status: 'canjeado' }); 
      setCode(""); // Limpiamos para el siguiente
      inputRef.current?.focus(); // Re-enfocamos el input
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 bg-secondary/30 p-4 rounded-xl border border-border">
        <div className="bg-primary/20 p-3 rounded-lg text-primary">
          <ScanLine className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-primary leading-none">Validador en Caja</h1>
          <p className="text-muted-foreground text-sm mt-1">Ingresa el código o escanea para autorizar la entrega del premio.</p>
        </div>
      </div>

      <Card className="shadow-lg border-primary/20 bg-card overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={searchCoupon} className="flex flex-col sm:flex-row gap-4">
            <Input 
              ref={inputRef}
              placeholder="Ej: MRH-A8F3B" 
              className="text-2xl md:text-3xl h-16 md:h-20 uppercase font-mono text-center tracking-[0.2em] border-2 border-primary/30 focus-visible:ring-primary focus-visible:border-primary shadow-inner bg-background"
              value={code}
              onChange={handleCodeChange}
              autoComplete="off"
            />
            <Button type="submit" disabled={loading || !code} className="h-16 md:h-20 sm:w-40 text-lg font-bold shadow-lg shadow-primary/20">
              {loading ? "Buscando..." : <><Search className="w-6 h-6 mr-2" /> Validar</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {couponInfo && (
        <div className="animate-fade-in-up">
          <Card className={`border-2 shadow-2xl overflow-hidden transition-colors ${
            couponInfo.status === 'pendiente' 
              ? 'border-primary shadow-primary/10' 
              : 'border-destructive shadow-destructive/10'
          }`}>
            
            {/* CABECERA ESTADO (Semáforo) */}
            <div className={`p-4 flex justify-between items-center ${
              couponInfo.status === 'pendiente' ? 'bg-primary/10' : 'bg-destructive/10'
            }`}>
              <CardTitle className="text-lg">Resultado de Búsqueda</CardTitle>
              {couponInfo.status === 'pendiente' ? (
                <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-black flex items-center gap-2 shadow-md">
                  <CheckCircle className="w-5 h-5" /> AUTORIZADO
                </span>
              ) : (
                <span className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-sm font-black flex items-center gap-2 shadow-md">
                  <XCircle className="w-5 h-5" /> CUPÓN USADO
                </span>
              )}
            </div>

            <CardContent className="space-y-6 p-6">
              
              {/* PRODUCTO */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-background p-4 rounded-xl border">
                <img 
                  src={couponInfo.products?.image_url} 
                  alt="Producto" 
                  className="w-32 h-32 rounded-lg object-cover border-2 shadow-sm" 
                />
                <div className="text-center sm:text-left">
                  <p className="font-black text-2xl leading-tight text-foreground">{couponInfo.products?.name}</p>
                  <div className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-md mt-2">
                    <Gift className="w-4 h-4 text-primary" /> 
                    <span className="text-sm font-bold text-muted-foreground">Costo: <span className="text-foreground">{couponInfo.points_cost} pts</span></span>
                  </div>
                </div>
              </div>

              {/* DATOS DEL CLIENTE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Cliente</p>
                  <p className="font-semibold flex items-center gap-2 text-foreground">
                    <UserIcon className="w-4 h-4 text-primary" />
                    {couponInfo.profiles?.full_name}
                  </p>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">DNI / ID</p>
                  <p className="font-mono font-semibold text-foreground">{couponInfo.profiles?.dni || 'No registrado'}</p>
                </div>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg border text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Código Verificado</p>
                <p className="font-mono text-2xl font-black text-primary tracking-widest">{couponInfo.code}</p>
              </div>

            </CardContent>

            {/* BOTÓN DE ACCIÓN FINAL */}
            {couponInfo.status === 'pendiente' && (
              <CardFooter className="bg-background border-t p-6">
                <Button 
                  className="w-full text-xl h-16 font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform" 
                  onClick={handleValidate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2 animate-pulse"><ScanLine className="w-6 h-6" /> PROCESANDO...</span>
                  ) : (
                    "✅ ENTREGAR PREMIO AL CLIENTE"
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Validator;