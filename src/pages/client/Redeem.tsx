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
import { Gift, AlertCircle, Info, Zap, Flame, Crown, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Redeem = () => {
  const { user } = useAuth();
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
        .eq("is_redeemable", true) // Solo los marcados como "premio"
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
    if (balance < product.points_price) return toast.error("Puntos insuficientes.");

    try {
      // Llamada a la función segura de base de datos
      const { data, error } = await supabase.rpc('procesar_canje', {
        p_user_id: user.id,
        p_product_id: product.id,
        p_points_cost: product.points_price
      });

      if (error) throw error;
      if (data === 'INSUFICIENTE') return toast.error("Saldo insuficiente.");

      // Éxito
      toast.success(`¡Canje exitoso! Código: ${data}`);
      fetchRedeemData(); // Actualizar saldo

    } catch (error: any) {
      toast.error("Error al procesar el canje.");
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 animate-fade-in space-y-8">
      
      {/* HEADER DE PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h1 className="text-4xl font-bold font-heading text-primary flex items-center gap-3 justify-center md:justify-start">
            <Gift className="w-10 h-10" /> Zona de Premios
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Convierte tus compras en recompensas. Acumula puntos y desbloquea niveles exclusivos.
          </p>
        </div>
        
        {/* TARJETA DE SALDO FLOTANTE */}
        {user ? (
          <Card className="bg-primary text-primary-foreground border-none shadow-xl min-w-[200px]">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium opacity-90 mb-1">Tu Saldo Actual</p>
              <div className="text-4xl font-bold font-heading">{balance} pts</div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/50 min-w-[240px]">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">¿Tienes puntos?</p>
              <Link to="/login"><Button variant="outline" size="sm">Iniciar Sesión</Button></Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="catalog">Catálogo de Premios</TabsTrigger>
          <TabsTrigger value="rules">Reglas y Niveles</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: CATÁLOGO DE PRODUCTOS (LO QUE YA TENÍAMOS) --- */}
        <TabsContent value="catalog" className="space-y-6">
          {!user && (
            <Alert className="bg-purple-50 border-purple-200">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertTitle className="text-purple-700 font-bold">Inicia Sesión</AlertTitle>
              <AlertDescription className="text-purple-600">
                Necesitas una cuenta para ver tu saldo y canjear premios.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <Gift className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No hay premios disponibles en este momento. ¡Vuelve pronto!</p>
              </div>
            ) : (
              products.map((product) => (
                <Card key={product.id} className="group overflow-hidden hover:border-primary/50 transition-all">
                  <div className="aspect-square bg-secondary relative overflow-hidden">
                     {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">Sin Imagen</div>
                     )}
                     <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        {product.points_price} PTS
                     </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                       {product.brand ? `Marca: ${product.brand}` : "Producto exclusivo del club"}
                    </p>
                    <Button 
                      className="w-full font-bold" 
                      onClick={() => handleRedeem(product)}
                      disabled={!user || balance < product.points_price}
                      variant={(!user || balance < product.points_price) ? "secondary" : "default"}
                    >
                      {balance >= product.points_price ? "Canjear Ahora" : `Te faltan ${product.points_price - balance} pts`}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* --- TAB 2: REGLAS Y NIVELES (LA INFORMACIÓN QUE ME DISTE) --- */}
        <TabsContent value="rules" className="space-y-8">
          
          {/* NIVELES DE PREMIOS */}
          <section>
            <h3 className="text-2xl font-bold font-heading mb-6 text-center">Niveles de Canje</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nivel 1 */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="text-center pb-2">
                  <Badge variant="outline" className="mx-auto border-green-500 text-green-700 bg-green-100 mb-2">NIVEL 1</Badge>
                  <CardTitle className="text-3xl font-bold text-green-700">300 Pts</CardTitle>
                  <CardDescription>Premios Pequeños</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-green-800 space-y-2">
                  <p>• Accesorios básicos</p>
                  <p>• Pods de repuesto</p>
                  <p>• Descuentos seleccionados</p>
                </CardContent>
              </Card>

              {/* Nivel 2 */}
              <Card className="border-blue-200 bg-blue-50/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-bl-full opacity-50"></div>
                <CardHeader className="text-center pb-2 relative z-10">
                  <Badge variant="outline" className="mx-auto border-blue-500 text-blue-700 bg-blue-100 mb-2">NIVEL 2</Badge>
                  <CardTitle className="text-3xl font-bold text-blue-700">600 Pts</CardTitle>
                  <CardDescription>Premios Medianos</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-blue-800 space-y-2 relative z-10">
                  <p>• Accesorios Premium</p>
                  <p>• Líquidos pequeños</p>
                  <p>• Descuentos especiales</p>
                </CardContent>
              </Card>

              {/* Nivel 3 */}
              <Card className="border-purple-200 bg-purple-50/50 relative overflow-hidden shadow-lg border-2">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full blur-2xl opacity-50"></div>
                <CardHeader className="text-center pb-2 relative z-10">
                  <div className="flex justify-center mb-2"><Crown className="w-6 h-6 text-purple-600 animate-pulse" /></div>
                  <CardTitle className="text-4xl font-black text-purple-700 font-heading">1000 Pts</CardTitle>
                  <CardDescription className="text-purple-600 font-bold">PREMIOS ESPECIALES</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-purple-900 space-y-2 relative z-10 font-medium">
                  <p>• Vape económico GRATIS</p>
                  <p>• Producto Exclusivo Mr. Humo</p>
                  <p>• Acceso a merch limitado</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4 italic">👉 Los premios varían según stock disponible en tienda.</p>
          </section>

          <Separator />

          {/* CATEGORÍAS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-lg"><Zap className="w-5 h-5 text-yellow-500"/> Para Vapeadores</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Pods y resistencias</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Líquidos seleccionados</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Descuentos en equipos nuevos</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Dispositivos exclusivos por puntos</li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-lg"><Flame className="w-5 h-5 text-orange-500"/> Para Tabaquería</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Accesorios (Grinders, Bandejas)</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Filtros y papeles de enrolar</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Encendedores Clipper/Zippo</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0"/> Productos seleccionados</li>
                </ul>
             </div>
          </section>

          <Separator />

          {/* CONDICIONES (ACCORDION) */}
          <section className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Términos y Condiciones</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>¿Cómo gano puntos?</AccordionTrigger>
                <AccordionContent>
                  Ganas 1 punto por cada S/1.00 de compra. La compra mínima para empezar a acumular es de S/20.00. Aplica para vapes, líquidos y accesorios.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>¿Los puntos vencen?</AccordionTrigger>
                <AccordionContent>
                  Sí, tus puntos tienen una vigencia de 6 meses desde la fecha en que los obtuviste. ¡Úsalos antes de que expiren!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Restricciones Generales</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Los puntos no son canjeables por dinero en efectivo.</li>
                    <li>Los premios no son a libre elección, están sujetos al catálogo vigente y stock.</li>
                    <li>Los productos en liquidación o con descuento NO acumulan puntos.</li>
                    <li>Los descuentos por puntos requieren una compra mínima adicional.</li>
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