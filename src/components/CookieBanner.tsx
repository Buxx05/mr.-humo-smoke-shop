import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem("mr_humo_cookies_accepted");
    if (!hasAcceptedCookies) {
      // Le damos un pequeño retraso (1.5s) para que no salga al mismo tiempo que el Age Gate
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("mr_humo_cookies_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9990] p-4 md:p-6 pointer-events-none flex justify-center animate-fade-in-up">
      <div className="pointer-events-auto w-full max-w-4xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-start md:items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full shrink-0">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm md:text-base mb-1">Tu privacidad es importante</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">
              Utilizamos cookies esenciales y almacenamiento local para mantener tu sesión activa, guardar tu carrito de compras y asegurar que tengas la mejor experiencia VIP en nuestra plataforma.
            </p>
          </div>
        </div>

        <Button 
          onClick={acceptCookies} 
          className="w-full md:w-auto shrink-0 h-11 px-8 font-bold bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-transform"
        >
          Entendido
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;