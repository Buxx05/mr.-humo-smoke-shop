import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Gift, AlertCircle, Info, Zap, Flame, Crown, CheckCircle2, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Redeem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRedeemData();
  }, [user]);

  const fetchRedeemData = async () => {
    try {
      setLoading(true);
      // 1. Cargar Saldo (si hay usuario)
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("points_balance").eq("id", user.id).single();
        if (profile) setBalance(profile.points_balance);
      }

      // 2. Cargar Productos Canjeables
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("is_redeemable", true) 
        .eq("active", true)
        .order("points_price", { ascending: true });

      if (productsData) setProducts(productsData);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (product: any) => {
    if (!user) return toast.error("Debes iniciar sesión para canjear.");
    if (balance < product.points_price) return toast.error("Puntos insuficientes para este premio.");

    if (!window.confirm(`¿Estás seguro de canjear ${product.name} por ${product.points_price} puntos?`)) return;

    try {
      const { data, error } = await supabase.rpc('procesar_canje', {
        p_user_id: user.id,
        p_product_id: product.id,
        p_points_cost: product.points_price
      });

      if (error) throw error;
      if (data === 'INSUFICIENTE') return toast.error("Saldo insuficiente detectado por seguridad.");

      toast.success("¡Canje exitoso! Tienes un nuevo cupón en tu perfil.");
      fetchRedeemData(); 
      // Redirigimos al dashboard para que vea su nuevo ticket
      setTimeout(() => navigate('/cliente/dashboard'), 1500);

    } catch (error: any) {
      toast.error("Error al procesar el canje.");
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 md:py-12 animate-fade-in space-y-8 px-4">
      
      {/* HEADER DE PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left bg-secondary/20 p-6 md:p-8 rounded-2xl border border-border/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-black font-heading text-primary flex items-center gap-3 justify-center md:justify-start">
            <Gift className="w-8 h-8 md:w-10 md:h-10" /> Zona de Premios
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg text-sm md:text-base font-medium">
            Convierte tus compras en recompensas. Selecciona tu premio y preséntalo en tienda para reclamarlo al instante.
          </p>
        </div>
        
        {/* TARJETA DE SALDO FLOTANTE */}
        {user ? (
          <Card className="bg-card border-primary/30 shadow-[0_0_20px_rgba(153,204,51,0.15)] min-w-[240px] shrink-0">
            <CardContent className="p-5 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Tu Saldo Actual</p>
              <div className="text-5xl font-black font-heading tracking-tighter text-foreground">{balance}</div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-secondary/50 min-w-[240px] border-border shrink-0">
            <CardContent className="p-5 text-center flex flex-col gap-3">
              <p className="text-sm font-bold text-muted-foreground">¿Cuántos puntos tienes?</p>
              <Link to="/login" className="w-full">
                <Button variant="default" className="w-full shadow-lg font-bold">Iniciar Sesión</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* TABS (Inicia en Catálogo por defecto) */}
      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-secondary/50 p-1 rounded-xl h-12">
          <TabsTrigger value="catalog" className="rounded-lg font-bold">Catálogo VIP</TabsTrigger>
          <TabsTrigger value="rules" className="rounded-lg font-bold">Niveles y Reglas</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: CATÁLOGO DE PRODUCTOS --- */}
        <TabsContent value="catalog" className="space-y-6 focus-visible:outline-none">
          {!user && (
            <Alert className="bg-amber-500/10 border-amber-500/20 flex flex-col sm:flex-row items-center gap-4 py-4 animate-fade-in-up">
              <Info className="h-6 w-6 text-amber-500 shrink-0 hidden sm:block" />
              <div className="flex-1 text-center sm:text-left">
                <AlertTitle className="text-amber-500 font-black text-lg">Visita en Modo Invitado</AlertTitle>
                <AlertDescription className="text-muted-foreground font-medium mt-1">
                  Estás viendo el catálogo público. Crea una cuenta para empezar a acumular puntos con tus compras.
                </AlertDescription>
              </div>
              <Link to="/login" className="w-full sm:w-auto mt-2 sm:mt-0">
                <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg w-full">Unirme al Club</Button>
              </Link>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Skeletons de carga
              Array.from({length: 4}).map((_, i) => (
                <Card key={i} className="animate-pulse bg-card border-border">
                  <div className="aspect-square bg-secondary/50 rounded-t-xl" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                    <div className="h-10 bg-secondary rounded w-full mt-4" />
                  </CardContent>
                </Card>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold text-foreground">El catálogo se está actualizando</p>
                <p className="mt-2">Vuelve pronto para ver las nuevas recompensas.</p>
              </div>
            ) : (
              products.map((product) => {
                // Cálculo visual de si le alcanza
                const isAffordable = user && balance >= product.points_price;
                const pointsNeeded = product.points_price - balance;
                const progressPercentage = user ? Math.min(100, (balance / product.points_price) * 100) : 0;

                return (
                  <Card key={product.id} className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 flex flex-col">
                    <div className="aspect-square bg-background relative overflow-hidden p-4 border-b">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                          <Gift className="w-12 h-12 mb-2" />
                          <span className="text-xs font-bold uppercase tracking-widest">Sin Imagen</span>
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3 bg-background border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-sm font-black shadow-md flex items-center gap-1.5">
                        <Star className="w-3 h-3" /> {product.points_price}
                      </div>
                    </div>
                    
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        {product.brand || "Exclusivo"}
                      </p>
                      <h3 className="font-black text-lg leading-tight text-foreground mb-4">{product.name}</h3>
                      
                      <div className="mt-auto space-y-3">
                        {user && !isAffordable && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              <span>Progreso</span>
                              <span>Faltan {pointsNeeded} pts</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary/50 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          className={`w-full font-black text-sm h-11 ${
                            isAffordable 
                              ? "bg-primary text-primary-foreground hover:scale-[1.02] shadow-[0_0_15px_rgba(153,204,51,0.3)] transition-all" 
                              : "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                          }`}
                          onClick={() => handleRedeem(product)}
                          disabled={!user || !isAffordable}
                        >
                          {isAffordable ? "¡CANJEAR PREMIO!" : "PUNTOS INSUFICIENTES"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* --- TAB 2: REGLAS Y NIVELES --- */}
        <TabsContent value="rules" className="space-y-10 focus-visible:outline-none pt-4">
          
          {/* NIVELES DE PREMIOS */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-black font-heading text-foreground">Niveles del Club</h3>
              <p className="text-muted-foreground mt-2">Sube de rango y accede a mejores recompensas.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nivel Aficionado */}
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardHeader className="text-center pb-2">
                  <Badge variant="outline" className="mx-auto border-blue-500/30 text-blue-400 bg-blue-500/10 mb-3 gap-1">
                    <span>💨</span> RANGO AFICIONADO
                  </Badge>
                  <CardTitle className="text-3xl font-black text-foreground">300 Pts</CardTitle>
                  <CardDescription className="font-bold text-muted-foreground">Premios Pequeños</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground space-y-2 font-medium">
                  <p>• Accesorios básicos</p>
                  <p>• Pods de repuesto</p>
                  <p>• Descuentos seleccionados</p>
                </CardContent>
              </Card>

              {/* Nivel Experto */}
              <Card className="border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full blur-xl"></div>
                <CardHeader className="text-center pb-2 relative z-10">
                  <Badge variant="outline" className="mx-auto border-purple-500/30 text-purple-400 bg-purple-500/10 mb-3 gap-1">
                    <span>🔥</span> RANGO EXPERTO
                  </Badge>
                  <CardTitle className="text-3xl font-black text-foreground">600 Pts</CardTitle>
                  <CardDescription className="font-bold text-muted-foreground">Premios Medianos</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground space-y-2 relative z-10 font-medium">
                  <p>• Accesorios Premium</p>
                  <p>• Líquidos pequeños</p>
                  <p>• Descuentos especiales</p>
                </CardContent>
              </Card>

              {/* Nivel Leyenda */}
              <Card className="border-amber-500/30 bg-amber-500/10 relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl"></div>
                <CardHeader className="text-center pb-2 relative z-10">
                  <div className="flex justify-center mb-2"><Crown className="w-8 h-8 text-amber-500 animate-bounce-slow" /></div>
                  <Badge variant="default" className="mx-auto bg-amber-500 text-amber-950 font-black mb-3 gap-1 shadow-md hover:bg-amber-400">
                    RANGO LEYENDA
                  </Badge>
                  <CardTitle className="text-4xl font-black text-foreground font-heading">1000 Pts</CardTitle>
                  <CardDescription className="text-amber-500 font-bold tracking-widest uppercase text-xs mt-1">Premios Especiales</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-amber-100 space-y-2 relative z-10 font-bold">
                  <p>• Vape económico GRATIS</p>
                  <p>• Producto Exclusivo Mr. Humo</p>
                  <p>• Acceso a merch limitado</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6 font-bold uppercase tracking-widest bg-secondary/30 py-2 rounded-lg">👉 Los premios varían según stock en tienda física.</p>
          </section>

          <Separator className="bg-border/50" />

          {/* CATEGORÍAS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
             <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl border border-border/50">
                <h4 className="font-black flex items-center gap-3 text-lg text-foreground"><Zap className="w-6 h-6 text-yellow-500"/> Para Vapeadores</h4>
                <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0"/> Pods y resistencias</li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0"/> Líquidos seleccionados</li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0"/> Descuentos en equipos nuevos</li>
                </ul>
             </div>
             <div className="space-y-4 bg-secondary/10 p-6 rounded-2xl border border-border/50">
                <h4 className="font-black flex items-center gap-3 text-lg text-foreground"><Flame className="w-6 h-6 text-orange-500"/> Para Tabaquería</h4>
                <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0"/> Accesorios (Grinders, Bandejas)</li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0"/> Filtros y papeles de enrolar</li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0"/> Encendedores Clipper/Zippo</li>
                </ul>
             </div>
          </section>

          {/* CONDICIONES (ACCORDION) */}
          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-lg">
            <h3 className="font-black mb-6 flex items-center gap-3 text-xl"><AlertCircle className="w-6 h-6 text-primary"/> Términos y Condiciones</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border/50">
                <AccordionTrigger className="font-bold hover:text-primary transition-colors">¿Cómo gano puntos?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Ganas 1 punto por cada S/1.00 de compra en nuestra tienda. La compra mínima para empezar a acumular es de S/20.00. Aplica para todos nuestros productos: vapes, líquidos y accesorios.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border/50">
                <AccordionTrigger className="font-bold hover:text-primary transition-colors">¿Los puntos vencen?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Sí, tus puntos tienen una vigencia de 6 meses desde la fecha en que los obtuviste. Procura visitar nuestro catálogo regularmente y ¡úsalos antes de que expiren!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border/50 border-b-0">
                <AccordionTrigger className="font-bold hover:text-primary transition-colors">Restricciones Generales</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><span>•</span> Los puntos no son canjeables por dinero en efectivo.</li>
                    <li className="flex items-start gap-2"><span>•</span> Los premios están sujetos al catálogo vigente y al stock físico en la tienda.</li>
                    <li className="flex items-start gap-2"><span>•</span> Los productos en liquidación o con súper descuento NO acumulan puntos.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Redeem;