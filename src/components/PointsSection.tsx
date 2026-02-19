import { UserPlus, ShoppingBag, Gift, ChevronRight, Info, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PointsSection = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-primary group-hover:text-primary-foreground" />,
      title: "1. Regístrate Gratis",
      desc: "Crea tu cuenta en menos de 1 minuto y recibe automáticamente 50 puntos de regalo de bienvenida."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-primary group-hover:text-primary-foreground" />,
      title: "2. Acumula Puntos",
      desc: (
        <>
          Ganas <span className="font-black text-foreground">1 Punto por cada S/ 1.00</span> de compra en nuestra tienda.
          <br/>
          <span className="text-xs text-primary mt-2 inline-block font-bold bg-primary/10 px-2 py-1 rounded">Mínimo de compra: S/ 20.00</span>
        </>
      )
    },
    {
      icon: <Gift className="w-8 h-8 text-primary group-hover:text-primary-foreground" />,
      title: "3. Canjea Premios",
      desc: "Usa tus puntos acumulados para llevarte vapes, accesorios y merch exclusivo desde solo 300 puntos."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-secondary/10 relative border-t border-border/50 overflow-hidden">
      {/* Adorno de fondo Neón */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-5">
          <Badge variant="outline" className="py-1.5 px-5 text-sm font-black border-primary/50 text-primary bg-primary/10 backdrop-blur-md uppercase tracking-widest shadow-[0_0_15px_rgba(153,204,51,0.2)] mb-2">
            <Crown className="w-4 h-4 mr-2 inline-block -mt-0.5" /> CLUB VIP MR. HUMO
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight text-foreground leading-tight">
            Tus compras ahora te dan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">Premios Gratis</span>
          </h2>
          <p className="text-muted-foreground font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Ser cliente fiel tiene sus beneficios. Únete a la comunidad de humo más exclusiva de Lima y empieza a sumar puntos hoy mismo.
          </p>
        </div>

        {/* Pasos (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="border-border bg-card hover:border-primary/50 transition-all duration-300 group relative overflow-hidden hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(153,204,51,0.1)]">
              {/* Línea superior iluminada al hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardContent className="p-8 md:p-10 flex flex-col items-center text-center space-y-5 pt-12">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 rotate-3 group-hover:rotate-0 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-foreground">{step.title}</h3>
                <div className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed">
                  {step.desc}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Final */}
        <div className="text-center max-w-md mx-auto">
          <Link to="/login" className="block outline-none">
            <Button className="w-full rounded-full h-16 text-lg font-black bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.03] transition-all shadow-[0_0_30px_rgba(153,204,51,0.3)] hover:shadow-[0_0_40px_rgba(153,204,51,0.5)] active:scale-95 group">
              ¡QUIERO MIS 50 PUNTOS! <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex items-start justify-center gap-2 mt-6 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-secondary/50 py-3 px-4 rounded-xl border border-border">
             <Info className="w-4 h-4 shrink-0 text-primary" />
             <p className="text-left">Puntos válidos para Vapes, Bongs y Accesorios. Vigencia de 6 meses desde tu compra.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PointsSection;