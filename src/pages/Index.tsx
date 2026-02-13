import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import PointsSection from "@/components/PointsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Categorías */}
      <CategoriesSection />

      {/* Productos Destacados */}
      <FeaturedProducts />

      {/* Sección de Puntos Informativa */}
      <PointsSection />

    </div>
  );
};

export default Index;