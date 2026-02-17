import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel"; // <--- NUEVO
import CategoriesSection from "@/components/CategoriesSection";
import PointsSection from "@/components/PointsSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* 1. IMPACTO: Portada con humo y CTA */}
      <HeroSection />

      {/* 4. BENEFICIO: Sistema de Puntos */}
      <PointsSection />

      {/* 3. NAVEGACIÓN: ¿Qué quieres comprar? */}
      <CategoriesSection />

      {/* 2. CONFIANZA: Marcas destacadas (Reemplaza a FeaturedProducts) */}
      <BrandsCarousel />

    </main>
  );
};

export default Index;