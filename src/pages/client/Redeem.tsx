import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Gift, AlertCircle, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const Redeem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]); // Se vuelve a ejecutar si el usuario inicia sesión

  const fetchData = async () => {
    setLoading(true);
    // 1. Traer productos canjeables SIEMPRE (para que los vean los visitantes)
    const { data: items } = await supabase.from("products").select("*").eq("is_redeemable", true).eq("active", true);
    if (items) setProducts(items);

    // 2. Traer saldo SOLO si hay un usuario logueado
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("points_balance").eq("id", user.id).single();
      if (profile) setBalance(profile.points_balance);
    } else {
      setBalance(0); // Visitante anónimo
    }
    setLoading(false);
  };

  const handleRedeem = async (productId: number, pointsCost: number) => {
    // Doble validación por si un visitante logró hacer clic
    if (!user) {
      navigate('/login');
      return;
    }

    if (balance < pointsCost) {
      toast.error("No tienes puntos suficientes para este premio.");
      return;
    }

    setRedeemingId(productId);
    
    // Llamamos a la función segura de Supabase
    const { data: code, error } = await supabase.rpc('procesar_canje', {
      p_user_id: user.id,
      p_product_id: productId,
      p_points_cost: pointsCost
    });

    if (error || code === 'INSUFICIENTE') {
      toast.error("Ocurrió un error al procesar el canje.");
    } else {
      toast.success(`¡Canje exitoso! Tu código es ${code}`);
      navigate('/cliente/dashboard');
    }
    setRedeemingId(null);
  };

  if (loading) return <div className="p-8 text-center">Cargando catálogo de premios...</div>;

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Catálogo de Premios</h1>
          <p className="text-muted-foreground">
            {user 
              ? "Canjea tus puntos acumulados por productos exclusivos." 
              : "Regístrate y gana puntos por tus compras para llevarte estos premios GRATIS."}
          </p>
        </div>
        
        {/* Si está logueado ve sus puntos, si no, ve un botón para loguearse */}
        {user ? (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground leading-none">Tu saldo actual</p>
              <p className="text-2xl font-bold text-primary">{balance} pts</p>
            </div>
          </div>
        ) : (
          <Button onClick={() => navigate('/login')} variant="outline" className="gap-2">
            <LogIn className="h-4 w-4" /> Únete para canjear
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Próximamente nuevos premios</AlertTitle>
          <AlertDescription>Estamos preparando nuevos productos para ti. ¡Vuelve pronto!</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden hover:border-primary/50 transition-colors">
              <div className="aspect-square bg-secondary flex items-center justify-center p-4">
                <img src={product.image_url} alt={product.name} className="object-cover max-h-full rounded-md" />
              </div>
              <CardHeader className="flex-1 pb-2">
                <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
                <CardTitle className="text-lg line-clamp-2 leading-tight">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-xl font-bold text-primary flex items-center gap-1">
                  <Gift className="h-4 w-4" /> {product.points_price} pts
                </p>
              </CardContent>
              <CardFooter>
                {/* Lógica dinámica del botón */}
                {!user ? (
                  <Button className="w-full" variant="secondary" onClick={() => navigate('/login')}>
                    Inicia Sesión para Canjear
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    disabled={balance < product.points_price || redeemingId === product.id}
                    onClick={() => handleRedeem(product.id, product.points_price)}
                    variant={balance >= product.points_price ? "default" : "secondary"}
                  >
                    {redeemingId === product.id ? "Procesando..." : balance >= product.points_price ? "Canjear Premio" : "Faltan Puntos"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Redeem;