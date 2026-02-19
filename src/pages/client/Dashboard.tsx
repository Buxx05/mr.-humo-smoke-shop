import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Gift, Ticket, Clock, CheckCircle2, Trophy, MessageCircle, Flame, ArrowRight, Star } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

// Configuración de Niveles Unificada
const LEVELS = [
  { name: "Novato", min: 0, color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/20", icon: "🌱" },
  { name: "Aficionado", min: 300, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: "💨" },
  { name: "Experto", min: 600, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", icon: "🔥" },
  { name: "Leyenda", min: 1000, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", icon: "👑" },
];

const ClientDashboard = () => {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("Explorador");
  const [balance, setBalance] = useState<number>(0);
  const [lifetimePoints, setLifetimePoints] = useState<number>(0);
  const [movements, setMovements] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchUserData();
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // 1. Obtener perfil (Añadimos full_name para saludarlo por su nombre)
      const { data: profile } = await supabase
        .from("profiles")
        .select("points_balance, full_name")
        .eq("id", user?.id)
        .single();
        
      if (profile) {
        setBalance(profile.points_balance);
        if (profile.full_name) {
          setUserName(profile.full_name.split(' ')[0]); // Tomamos solo el primer nombre
        }
      }

      // 2. Calcular Puntos Históricos
      const { data: allHistory } = await supabase
        .from("point_history")
        .select("amount")
        .eq("user_id", user?.id)
        .gt("amount", 0); 
      
      const totalEarned = allHistory?.reduce((sum, item) => sum + item.amount, 0) || 0;
      setLifetimePoints(totalEarned + 50); // Sumamos bono inicial

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
  const currentLevelIndex = LEVELS.reduce((acc, level, index) => {
    return lifetimePoints >= level.min ? index : acc;
  }, 0);
  
  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];
  
  let progress = 100;
  let pointsToNext = 0;

  if (nextLevel) {
    const range = nextLevel.min - currentLevel.min;
    const currentProgress = lifetimePoints - currentLevel.min;
    progress = Math.min(100, Math.max(0, (currentProgress / range) * 100));
    pointsToNext = nextLevel.min - lifetimePoints;
  }

  const activeCoupons = coupons.filter(c => c.status === 'pendiente');

  // PANTALLA DE CARGA VIP
  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="bg-primary/10 p-4 rounded-full animate-pulse shadow-[0_0_30px_rgba(153,204,51,0.2)]">
        <Flame className="w-10 h-10 text-primary animate-bounce-slow" />
      </div>
      <p className="text-muted-foreground font-medium animate-pulse">Cargando tu Club...</p>
    </div>
  );

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8 animate-fade-in pb-20 px-4 md:px-8">
      
      {/* HEADER + NIVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black font-heading text-foreground tracking-tight">
            Hola, <span className="text-primary">{userName}</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
             <Badge variant="outline" className={`text-sm px-3 py-1 font-bold shadow-sm ${currentLevel.bg} ${currentLevel.border} ${currentLevel.color}`}>
                {currentLevel.icon} Nivel {currentLevel.name}
             </Badge>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500 transition-colors font-bold" 
            onClick={() => window.open("https://wa.me/51999999999?text=Hola,%20tengo%20una%20duda%20sobre%20mis%20puntos", "_blank", "noopener noreferrer")}>
            <MessageCircle className="mr-2 h-4 w-4" /> Ayuda
          </Button>
          <Link to="/premios" className="flex-1 md:flex-none">
            <Button className="w-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(153,204,51,0.3)] hover:scale-105 transition-all font-black">
              <Gift className="mr-2 h-4 w-4" /> Canjear
            </Button>
          </Link>
        </div>
      </div>

      {/* TARJETA DE SALDO Y PROGRESO (DISEÑO VIP) */}
      <Card className="bg-card border-primary/30 relative overflow-hidden shadow-2xl shadow-primary/5">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-primary" /> Puntos Disponibles
              </p>
              <div className="text-6xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
                {balance}
              </div>
            </div>
            <div className="text-right hidden sm:block bg-secondary/50 p-4 rounded-2xl border border-border">
               <Trophy className={`w-12 h-12 ${currentLevel.color}`} />
            </div>
          </div>

          {/* BARRA DE PROGRESO HACIA EL SIGUIENTE NIVEL */}
          {nextLevel ? (
            <div className="space-y-3 bg-secondary/30 p-4 rounded-xl border border-border/50">
              <div className="flex justify-between text-xs md:text-sm font-bold text-muted-foreground">
                <span className="flex items-center gap-1">Progreso a {nextLevel.name} <span className="text-base">{nextLevel.icon}</span></span>
                <span className="text-foreground">Faltan <span className="text-primary">{pointsToNext} pts</span></span>
              </div>
              <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-border/50 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-1000 ease-out rounded-full relative" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-sm"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-amber-500 font-bold flex items-center gap-2 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
              <Trophy className="w-5 h-5" /> ¡Has alcanzado el nivel máximo! Eres una Leyenda absoluta.
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECCIÓN TICKETS ACTIVOS (DISEÑO CUPÓN FÍSICO) */}
      {activeCoupons.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
            <Ticket className="w-5 h-5 text-primary" /> Premios por Recoger
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCoupons.map((coupon) => (
              <div key={coupon.id} className="relative bg-card border-2 border-dashed border-primary/50 rounded-xl p-4 shadow-lg flex gap-4 items-center overflow-hidden hover:border-primary transition-colors group">
                {/* Detalles de diseño de ticket */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-r-2 border-dashed border-primary/50 group-hover:border-primary transition-colors"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-l-2 border-dashed border-primary/50 group-hover:border-primary transition-colors"></div>
                
                <div className="h-20 w-20 bg-background border border-border rounded-lg overflow-hidden shrink-0 ml-2 shadow-sm">
                   <img src={coupon.products?.image_url} className="h-full w-full object-cover" alt="premio"/>
                </div>
                <div className="flex-1 py-1 pr-4">
                  <h3 className="font-black text-lg leading-tight text-foreground">{coupon.products?.name}</h3>
                  <div className="mt-2 bg-secondary/80 px-3 py-1.5 rounded border border-border inline-block">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Código de Canje:</p>
                    <p className="text-primary font-mono font-black text-lg leading-none tracking-widest">{coupon.code}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACCESOS RÁPIDOS Y RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Ticket className="h-4 w-4 text-orange-500" /> Tickets Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground mb-1">{activeCoupons.length}</div>
            <p className="text-sm text-muted-foreground font-medium">
              {activeCoupons.length > 0 ? "Muéstralos en caja para reclamarlos." : "No tienes premios pendientes."}
            </p>
          </CardContent>
        </Card>

        {/* CARTA INFORMATIVA */}
        <Link to="/catalogo" className="block h-full outline-none">
          <Card className="h-full bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer group">
             <CardContent className="pt-6 flex items-center gap-4">
                <div className="bg-primary/20 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg">¿Cómo ganar más?</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Ganas 1 punto por cada S/ 1.00 de compra en nuestra tienda.</p>
                </div>
             </CardContent>
          </Card>
        </Link>
      </div>

      {/* TABS DE HISTORIAL */}
      <Tabs defaultValue="movements" className="w-full pt-4">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1 rounded-xl h-12">
          <TabsTrigger value="movements" className="rounded-lg font-bold">Movimientos</TabsTrigger>
          <TabsTrigger value="coupons" className="rounded-lg font-bold">Canjes Pasados</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="focus-visible:outline-none">
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-base font-black uppercase tracking-widest text-muted-foreground">Última Actividad</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              {movements.length === 0 ? (
                <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2">
                  <Clock className="w-8 h-8 opacity-20" />
                  <p>Aún no tienes movimientos en tu cuenta.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {movements.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 hover:bg-secondary/20 transition-colors">
                      <div>
                        <p className="font-bold text-foreground text-sm">{item.reason}</p>
                        <p className="text-xs text-muted-foreground capitalize font-medium mt-0.5">{format(new Date(item.created_at), "d MMM yyyy, HH:mm", { locale: es })}</p>
                      </div>
                      <div className={`font-black text-lg ${item.amount > 0 ? "text-green-500" : "text-foreground"}`}>
                        {item.amount > 0 ? "+" : ""}{item.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons" className="focus-visible:outline-none">
          <Card className="border-border shadow-sm">
             <CardHeader className="border-b border-border/50 pb-4">
               <CardTitle className="text-base font-black uppercase tracking-widest text-muted-foreground">Historial de Premios</CardTitle>
             </CardHeader>
             <CardContent className="pt-4 p-0">
               {coupons.length === 0 ? (
                 <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2">
                    <Gift className="w-8 h-8 opacity-20" />
                    <p>No has canjeado ningún premio todavía.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-border/50">
                   {coupons.map((coupon) => (
                     <div key={coupon.id} className="flex justify-between items-center p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-full ${coupon.status === 'canjeado' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                             {coupon.status === 'canjeado' ? <CheckCircle2 className="w-4 h-4"/> : <Clock className="w-4 h-4"/>}
                           </div>
                           <div>
                             <span className="text-sm font-bold text-foreground">{coupon.products?.name}</span>
                             <p className="text-xs text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">{coupon.status}</p>
                           </div>
                        </div>
                        <span className="text-sm text-muted-foreground font-bold">
                          {format(new Date(coupon.created_at), "d MMM yy", { locale: es })}
                        </span>
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