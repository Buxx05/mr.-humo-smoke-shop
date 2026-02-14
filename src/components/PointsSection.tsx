import { UserPlus, ShoppingBag, Gift, ChevronRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PointsSection = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-primary" />,
      title: "1. Regístrate Gratis",
      desc: "Crea tu cuenta en segundos y recibe automáticamente 50 puntos de regalo."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      title: "2. Acumula Puntos",
      desc: (
        <>
          Gana <span className="font-bold text-foreground">1 Punto por cada S/1.00</span> de compra.
          <br/>
          <span className="text-xs text-primary mt-1 block font-medium">*Mínimo de compra S/20.00</span>
        </>
      )
    },
    {
      icon: <Gift className="w-8 h-8 text-primary" />,
      title: "3. Canjea Premios",
      desc: "Usa tus puntos para llevarte vapes, accesorios y merch exclusivo desde 300 puntos."
    }
  ];

  return (
    <section className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Adorno de fondo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold font-heading">
            Gana Recompensas <span className="text-primary">Gratis</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ser cliente fiel tiene sus beneficios. Únete al club Mr. Humo y empieza a sumar hoy mismo.
          </p>
        </div>

        {/* Pasos (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="border-primary/10 bg-background/50 hover:border-primary/40 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4 pt-10">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <div className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Link to="/login">
            <Button size="lg" className="rounded-full px-10 h-12 text-base font-bold bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/25 transition-all">
              QUIERO MIS 50 PUNTOS <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
             <Info className="w-3 h-3" />
             <p>Válido para Vapes y Accesorios. Puntos vigentes por 6 meses.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PointsSection;