import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Zap, Sparkles, Heart, Flame } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in overflow-hidden">
      
      {/* 1. HERO SECTION: INTRODUCCIÓN */}
      <section className="relative py-20 md:py-32">
        {/* Fondo decorativo de luces neón */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0 pointer-events-none"></div>
        
        <div className="container max-w-5xl mx-auto relative z-10 text-center px-4 md:px-8">
          <Badge variant="outline" className="mb-6 py-1.5 px-5 text-sm font-black border-primary/50 text-primary bg-primary/10 backdrop-blur-md uppercase tracking-widest shadow-[0_0_15px_rgba(153,204,51,0.2)]">
            Sobre Nosotros
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading mb-6 tracking-tight text-foreground leading-tight">
            Elevando la Cultura del <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">Buen Humo</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            En Mr. Humo no solo vendemos productos, creamos experiencias. Somos apasionados, expertos y tu mejor aliado en cada sesión.
          </p>
        </div>
      </section>

      {/* 2. HISTORIA Y MISIÓN */}
      <section className="py-16 md:py-24 bg-secondary/20 border-y border-border/50 relative">
        <div className="container max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Imagen / Visual Abstracto (Para cuando no hay foto aún) */}
             <div className="relative group w-full max-w-md mx-auto lg:max-w-none">
              <div className="absolute -inset-1 md:-inset-2 bg-gradient-to-r from-primary to-green-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-card border-2 border-border/50 rounded-2xl overflow-hidden aspect-square shadow-2xl flex items-center justify-center">
                <img
                  src="/nosotros.jpg"
                  alt="Nosotros"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Texto */}
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-black font-heading text-foreground">Nuestra Historia</h2>
              <div className="space-y-5 text-muted-foreground md:text-lg font-medium leading-relaxed">
                <p>
                  Todo empezó con una idea simple: <strong className="text-foreground">Lima merecía un Smoke Shop de nivel superior.</strong>
                </p>
                <p>
                  Cansados de la informalidad y la falta de asesoría, decidimos crear Mr. Humo. Un espacio donde no importa si eres experto o principiante; aquí encontrarás productos 100% originales, precios justos y, sobre todo, alguien que te hable con la verdad.
                </p>
                <p>
                  Hoy, gracias a ustedes, somos una comunidad que sigue creciendo. Nos movemos rápido, innovamos siempre y mantenemos la llama encendida.
                </p>
              </div>

              {/* Stats - Ajustado para no aplastarse en celulares */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-border/50">
  
  {/* Tarjeta 1 */}
  <div className="flex flex-col items-center justify-center text-center bg-background/50 p-2 sm:p-4 rounded-xl border border-border">
    <div className="text-xl sm:text-4xl font-black text-primary mb-1 whitespace-nowrap">7+</div>
    <div className="text-[9px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Años Exp.</div>
  </div>
  
  {/* Tarjeta 2 */}
  <div className="flex flex-col items-center justify-center text-center bg-background/50 p-2 sm:p-4 rounded-xl border border-border">
    <div className="text-xl sm:text-4xl font-black text-primary mb-1 whitespace-nowrap">8 de 10</div>
    <div className="text-[9px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider leading-tight">
      Clientes <br className="hidden sm:block" />Nos Prefieren
    </div>
  </div>
  
  {/* Tarjeta 3 */}
  <div className="flex flex-col items-center justify-center text-center bg-background/50 p-2 sm:p-4 rounded-xl border border-border">
    <div className="text-xl sm:text-4xl font-black text-primary mb-1 whitespace-nowrap">100%</div>
    <div className="text-[9px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Originales</div>
  </div>
  
</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUESTROS VALORES (CARDS) */}
      <section className="py-20 md:py-32 relative">
        <div className="container max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black font-heading mb-4 text-foreground">¿Por qué elegirnos?</h2>
            <p className="text-lg text-muted-foreground font-medium">No somos una tienda más. Estos son los tres pilares que sostienen todo lo que hacemos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(153,204,51,0.1)] group">
              <CardContent className="p-8 text-center space-y-5">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors duration-300 rotate-3 group-hover:rotate-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-wide">Garantía Total</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Cero clones. Trabajamos directo con distribuidores oficiales. Si no es original, no entra en nuestras vitrinas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(153,204,51,0.1)] group">
              <CardContent className="p-8 text-center space-y-5">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors duration-300 -rotate-3 group-hover:rotate-0">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-wide">Asesoría Real</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  No te vendemos por vender. Te escuchamos y recomendamos exactamente lo que necesitas para tu estilo y presupuesto.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(153,204,51,0.1)] group">
              <CardContent className="p-8 text-center space-y-5">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors duration-300 rotate-3 group-hover:rotate-0">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-wide">Rapidez Máxima</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Sabemos que no quieres esperar. Nuestra atención en tienda y despachos están optimizados para que disfrutes sin demoras.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. CIERRE INSPIRACIONAL */}
      <section className="py-20 bg-gradient-to-t from-primary/10 via-background to-background relative border-t border-border/50">
        <div className="container text-center px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-background w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg border border-border">
              <Heart className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-heading text-foreground">Gracias por ser del Club</h2>
            <p className="text-lg text-muted-foreground font-medium">
              Cada compra, cada recomendación y cada visita a nuestra tienda nos ayuda a seguir trayendo lo mejor del mundo para ti.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default About;