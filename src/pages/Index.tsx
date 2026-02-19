import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import CategoriesSection from "@/components/CategoriesSection";
import PointsSection from "@/components/PointsSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background animate-fade-in flex flex-col">
      {/* 1. IMPACTO: Portada con humo, propuesta de valor y CTA */}
      <HeroSection />

      {/* 2. CONFIANZA: Marcas destacadas (Valida tu calidad antes de que sigan bajando) */}
      <BrandsCarousel />

      {/* 3. NAVEGACIÓN: ¿Qué quieres comprar? (Catálogo visual rápido) */}
      <CategoriesSection />

      {/* 4. BENEFICIO VIP: Sistema de Puntos (El gancho final para que se registren) */}
      <PointsSection />
    </main>
  );
};

export default Index;