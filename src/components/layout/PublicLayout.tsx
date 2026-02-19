import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const PublicLayout = () => {
  return (
    // Añadimos bg-background, text-foreground y el color de selección de texto premium
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Header />
      <main className="flex-1 w-full overflow-hidden">
        <Outlet /> {/* Aquí se renderizará la página que visite el usuario */}
      </main>
      <Footer />
    </div>
  );
};