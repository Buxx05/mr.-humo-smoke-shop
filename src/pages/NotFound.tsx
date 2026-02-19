import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Flame } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Mantengo tu excelente idea de registrar los errores de ruta para auditoría
    console.error("404 Error: Intento de acceso a ruta inexistente ->", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden animate-fade-in">
      
      {/* Brillo de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center relative z-10 max-w-md mx-auto space-y-8">
        
        {/* Ícono Temático */}
        <div className="flex justify-center">
          <div className="bg-secondary/50 p-6 rounded-full border border-border shadow-inner">
            <Flame className="w-16 h-16 text-muted-foreground/50" />
          </div>
        </div>

        {/* Texto 404 Gigante */}
        <div>
          <h1 className="text-8xl md:text-9xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-b from-primary to-green-900 drop-shadow-sm leading-none tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-4">
            ¡Te quedaste sin humo!
          </h2>
          <p className="text-muted-foreground font-medium mt-3 text-sm md:text-base px-4">
            La página que estás buscando se esfumó, cambió de nombre o nunca existió en nuestro catálogo.
          </p>
        </div>

        {/* Botón de Regreso */}
        <div className="pt-4">
          <Link to="/">
            <Button className="h-14 px-8 font-black text-base shadow-[0_0_20px_rgba(153,204,51,0.2)] hover:scale-105 transition-all w-full sm:w-auto">
              <Home className="mr-2 w-5 h-5" /> Volver al Inicio
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;