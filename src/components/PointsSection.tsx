import { Gift } from "lucide-react";

const PointsSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container text-center max-w-2xl mx-auto space-y-6">
        <Gift className="h-12 w-12 text-primary mx-auto" />
        <h2 className="font-heading text-3xl font-bold text-card-foreground">
          🎁 Acumula Puntos por cada Compra
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Por cada compra en nuestra tienda física, ganas puntos que puedes canjear por productos exclusivos.
          ¡Entre más compras, más beneficios!
        </p>
        <a
          href="/cliente/login.php"
          className="inline-flex rounded-md border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          SABER MÁS
        </a>
      </div>
    </section>
  );
};

export default PointsSection;
