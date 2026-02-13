import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Trophy, Sparkles, Heart, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      
      {/* 1. HERO SECTION: INTRODUCCIÓN */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0"></div>
        
        <div className="container relative z-10 text-center px-4">
          <Badge variant="outline" className="mb-6 py-1 px-4 text-sm border-primary/50 text-primary bg-primary/5 backdrop-blur-sm">
            Sobre Nosotros
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
            Elevando la Cultura del <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Buen Humo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            En Mr. Humo no solo vendemos productos, creamos experiencias. Somos apasionados, expertos y tu mejor aliado en cada sesión.
          </p>
        </div>
      </section>

      {/* 2. HISTORIA Y MISIÓN */}
      <section className="py-12 bg-secondary/5">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Imagen / Visual */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-card border border-border rounded-xl overflow-hidden aspect-video md:aspect-square shadow-2xl flex items-center justify-center bg-zinc-900">
                {/* Placeholder para foto del equipo o tienda */}
                <Sparkles className="w-24 h-24 text-primary opacity-50" />
                <p className="absolute bottom-4 text-sm text-muted-foreground">Aquí iría una foto genial de tu equipo o local</p>
              </div>
            </div>

            {/* Texto */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-heading">Nuestra Historia</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Todo empezó con una idea simple: <strong>Lima merecía un Smoke Shop de nivel superior.</strong>
                </p>
                <p>
                  Cansados de la informalidad y la falta de asesoría, decidimos crear Mr. Humo. Un espacio donde no importa si eres experto o principiante; aquí encontrarás productos 100% originales, precios justos y, sobre todo, alguien que te hable con la verdad.
                </p>
                <p>
                  Hoy, gracias a ustedes, somos una comunidad que sigue creciendo. Nos movemos rápido, innovamos siempre y mantenemos la llama encendida. 🔥
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div>
                  <div className="text-3xl font-bold text-primary">3+</div>
                  <div className="text-xs text-muted-foreground">Años de Experiencia</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">5k+</div>
                  <div className="text-xs text-muted-foreground">Clientes Felices</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-xs text-muted-foreground">Productos Originales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NUESTROS VALORES (CARDS) */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading mb-4">¿Por qué elegirnos?</h2>
            <p className="text-muted-foreground">Tres pilares que nos hacen diferentes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Garantía Total</h3>
                <p className="text-muted-foreground text-sm">
                  Cero clones. Trabajamos directo con distribuidores oficiales. Si no es original, no entra en nuestra tienda.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Asesoría Real</h3>
                <p className="text-muted-foreground text-sm">
                  No te vendemos por vender. Te escuchamos y recomendamos lo que realmente necesitas para tu estilo.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Rapidez</h3>
                <p className="text-muted-foreground text-sm">
                  Sabemos que no quieres esperar. Nuestros envíos y atención en tienda están optimizados para volar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. CIERRE INSPIRACIONAL */}
      <section className="py-16 bg-gradient-to-b from-transparent to-primary/10">
        <div className="container text-center px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <Heart className="w-12 h-12 mx-auto text-primary animate-pulse" />
            <h2 className="text-3xl font-bold font-heading">Gracias por ser parte del Club</h2>
            <p className="text-lg text-muted-foreground">
              Cada compra, cada recomendación y cada visita nos ayuda a seguir trayendo lo mejor del mundo para ti.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default About;