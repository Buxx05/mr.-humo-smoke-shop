import { CheckCircle } from "lucide-react";

const About = () => {
  return (
    <main className="py-12">
      <div className="container max-w-3xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-4xl font-bold text-foreground">Sobre MR. HUMO</h1>
          <p className="text-muted-foreground">Tu espacio de confianza en Lima</p>
        </div>

        {/* Story */}
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            MR. HUMO nació de la pasión por ofrecer la mejor experiencia en vapeo y tabaquería en Lima.
            Desde nuestros inicios, nos hemos enfocado en seleccionar los mejores productos del mercado,
            garantizando calidad y autenticidad en cada artículo que ofrecemos.
          </p>
          <p>
            Nuestra tienda física es un espacio donde los amantes del vapeo pueden encontrar todo lo que necesitan,
            desde dispositivos de última generación hasta los líquidos más exclusivos del mercado.
            Contamos con personal capacitado que te asesorará para encontrar el producto ideal.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg bg-card border border-border p-6 space-y-3">
            <h3 className="font-heading font-bold text-primary text-lg">Misión</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ofrecer productos de vapeo y tabaquería de la más alta calidad, brindando una experiencia de compra
              excepcional y asesoría personalizada a cada uno de nuestros clientes.
            </p>
          </div>
          <div className="rounded-lg bg-card border border-border p-6 space-y-3">
            <h3 className="font-heading font-bold text-primary text-lg">Visión</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ser la tabaquería y vaper shop referente en Lima, reconocida por la calidad de nuestros productos,
              la confianza de nuestros clientes y la innovación constante.
            </p>
          </div>
        </div>

        {/* Why us */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Productos 100% originales y garantizados",
              "Asesoría personalizada en tienda",
              "Precios competitivos del mercado",
              "Sistema de puntos y beneficios exclusivos",
              "Amplio catálogo de marcas internacionales",
              "Atención rápida por WhatsApp",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg bg-card border border-border p-4">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-card-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
