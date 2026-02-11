import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, History, Ticket } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom"

const ClientDashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // 1. Obtener el saldo de puntos
      const { data: profile } = await supabase
        .from("profiles")
        .select("points_balance")
        .eq("id", user?.id)
        .single();

      if (profile) setBalance(profile.points_balance);

      // 2. Obtener el historial de movimientos
      const { data: historyData } = await supabase
        .from("point_history")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (historyData) setHistory(historyData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando tu perfil...</div>;

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-primary">Mi Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TARJETA DE SALDO */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Puntos Acumulados</CardTitle>
            <Gift className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{balance}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Úsalos para canjear productos en tienda
            </p>
          </CardContent>
        </Card>

        {/* TARJETA DE CUPONES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Mis Cupones Activos</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">0</div>
            <Link to="/premios">
              <Button variant="outline" className="w-full text-xs h-8">
                <Gift className="mr-2 h-3 w-3" /> Ver Catálogo de Premios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* HISTORIAL DE PUNTOS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="h-5 w-5" /> Historial de Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Aún no tienes movimientos.</p>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{item.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.created_at), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                    </p>
                  </div>
                  <div className={`font-bold ${item.amount > 0 ? "text-green-500" : "text-destructive"}`}>
                    {item.amount > 0 ? "+" : ""}{item.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;