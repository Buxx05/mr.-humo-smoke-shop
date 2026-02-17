import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, History, Ticket, ArrowRight, Clock, CheckCircle2, Trophy, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

// Configuración de Niveles Unificada
const LEVELS = [
  { name: "Novato", min: 0, color: "text-gray-500", icon: "🌱" },
  { name: "Aficionado", min: 300, color: "text-blue-500", icon: "💨" },
  { name: "Experto", min: 600, color: "text-purple-500", icon: "🔥" },
  { name: "Leyenda", min: 1000, color: "text-amber-500", icon: "👑" },
];

const ClientDashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [lifetimePoints, setLifetimePoints] = useState<number>(0); // Puntos históricos para el nivel
  const [movements, setMovements] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchUserData();
  }, [user?.id]); // <--- El gran cambio está aquí

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // 1. Obtener perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("points_balance")
        .eq("id", user?.id)
        .single();
      if (profile) setBalance(profile.points_balance);

      // 2. Calcular Puntos Históricos (Sumamos todas las entradas positivas del historial)
      // Esto nos dice cuánto ha comprado el cliente en total, aunque ya haya gastado los puntos.
      const { data: allHistory } = await supabase
        .from("point_history")
        .select("amount")
        .eq("user_id", user?.id)
        .gt("amount", 0); // Solo sumamos lo que ganó (compras), no lo que gastó
      
      const totalEarned = allHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;
      // Sumamos el bono de bienvenida (50) si no está en el historial
      setLifetimePoints(totalEarned + 50);

      // 3. Obtener últimos movimientos
      const { data: historyData } = await supabase
        .from("point_history")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (historyData) setMovements(historyData);

      // 4. Obtener Cupones
      const { data: couponsData } = await supabase
        .from("coupons")
        .select(`*, products (name, image_url)`)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      if (couponsData) setCoupons(couponsData);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE NIVELES Y PROGRESO ---
  // Encontramos el nivel actual basado en los puntos históricos
  const currentLevelIndex = LEVELS.reduce((acc, level, index) => {
    return lifetimePoints >= level.min ? index : acc;
  }, 0);
  
  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];
  
  // Cálculo de porcentaje para la barra
  let progress = 100;
  let pointsToNext = 0;

  if (nextLevel) {
    const range = nextLevel.min - currentLevel.min;
    const currentProgress = lifetimePoints - currentLevel.min;
    progress = Math.min(100, Math.max(0, (currentProgress / range) * 100));
    pointsToNext = nextLevel.min - lifetimePoints;
  }
  // ------------------------------------

  const activeCoupons = coupons.filter(c => c.status === 'pendiente');

  if (loading) return <div className="p-10 text-center animate-pulse">Cargando tu perfil...</div>;

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8 animate-fade-in pb-20">
      
      {/* HEADER + NIVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary">Hola, Explorador</h1>
          <div className="flex items-center gap-2 mt-1">
             <Badge variant="outline" className="text-base px-3 py-1 border-primary/30">
                {currentLevel.icon} Nivel {currentLevel.name}
             </Badge>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {/* BOTÓN SOPORTE WHATSAPP */}
          <Button variant="outline" className="flex-1 md:flex-none border-green-500 text-green-600 hover:bg-green-50" 
            onClick={() => window.open("https://wa.me/51999999999?text=Hola,%20tengo%20una%20duda%20sobre%20mis%20puntos", "_blank")}>
            <MessageCircle className="mr-2 h-4 w-4" /> Ayuda
          </Button>
          <Link to="/premios" className="flex-1 md:flex-none">
            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 shadow-lg hover:shadow-primary/25">
              <Gift className="mr-2 h-4 w-4" /> Canjear
            </Button>
          </Link>
        </div>
      </div>

      {/* TARJETA DE SALDO Y PROGRESO */}
      <Card className="bg-gradient-to-br from-card to-secondary/30 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <CardContent className="pt-6 relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" /> Puntos Disponibles
              </p>
              <div className="text-5xl font-bold text-primary tracking-tight mt-1">{balance}</div>
            </div>
            <div className="text-right hidden sm:block">
               <Trophy className={`w-12 h-12 ${currentLevel.color} opacity-20`} />
            </div>
          </div>

          {/* BARRA DE PROGRESO HACIA EL SIGUIENTE NIVEL */}
          {nextLevel ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progreso a {nextLevel.name} {nextLevel.icon}</span>
                <span>Faltan {pointsToNext} pts</span>
              </div>
              {/* Si no tienes el componente Progress instalado, usa este div simple: */}
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-amber-500 font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4" /> ¡Has alcanzado el nivel máximo! Eres una Leyenda.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ACCESOS RÁPIDOS Y RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Ticket className="h-5 w-5 text-orange-500" /> Premios por Recoger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">{activeCoupons.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeCoupons.length > 0 ? "Visita la tienda para reclamarlos." : "Todo al día."}
            </p>
          </CardContent>
        </Card>

        {/* CARTA INFORMATIVA */}
        <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900">
           <CardContent className="pt-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100">¿Cómo ganar más?</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Ganas 1 punto por cada sol de compra. ¡Sube de nivel para sorpresas!</p>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* SECCIÓN TICKETS ACTIVOS */}
      {activeCoupons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" /> Tickets Pendientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-card border border-l-4 border-l-primary rounded-lg p-4 shadow-sm flex gap-4 items-center">
                <div className="h-16 w-16 bg-secondary rounded-md overflow-hidden shrink-0">
                   <img src={coupon.products?.image_url} className="h-full w-full object-cover" alt="premio"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{coupon.products?.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">CÓDIGO: <span className="text-foreground font-bold bg-secondary px-1 rounded">{coupon.code}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABS DE HISTORIAL */}
      <Tabs defaultValue="movements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="coupons">Canjes Pasados</TabsTrigger>
        </TabsList>

        <TabsContent value="movements">
          <Card>
            <CardHeader><CardTitle className="text-lg">Última Actividad</CardTitle></CardHeader>
            <CardContent>
              {movements.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Sin movimientos aún.</p>
              ) : (
                <div className="space-y-4">
                  {movements.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{item.reason}</p>
                        <p className="text-xs text-muted-foreground capitalize">{format(new Date(item.created_at), "d MMM, HH:mm", { locale: es })}</p>
                      </div>
                      <span className={`font-bold ${item.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.amount > 0 ? "+" : ""}{item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons">
          <Card>
             <CardHeader><CardTitle className="text-lg">Historial de Premios</CardTitle></CardHeader>
             <CardContent>
               {coupons.length === 0 ? (
                 <p className="text-center text-muted-foreground py-4">No has canjeado nada aún.</p>
               ) : (
                 <div className="space-y-2">
                   {coupons.map((coupon) => (
                     <div key={coupon.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                           {coupon.status === 'canjeado' ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <Clock className="w-4 h-4 text-orange-500"/>}
                           <span className="text-sm font-medium">{coupon.products?.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{format(new Date(coupon.created_at), "d/MM/yy")}</span>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;