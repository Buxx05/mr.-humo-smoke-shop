import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const AgeVerification = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Revisamos si ya aceptó antes
    const isVerified = localStorage.getItem("mr_humo_age_verified");
    if (!isVerified) {
      // Bloqueamos el scroll del fondo mientras el modal está abierto
      document.body.style.overflow = "hidden";
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mr_humo_age_verified", "true");
    document.body.style.overflow = "unset";
    setIsOpen(false);
  };

  const handleReject = () => {
    // Si es menor de edad, lo redirigimos fuera de la página
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="max-w-md w-full bg-card border border-border/50 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
        
        {/* Brillo verde de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/10 blur-[50px] pointer-events-none"></div>

        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative z-10 border border-primary/20 shadow-[0_0_20px_rgba(153,204,51,0.2)]">
          <ShieldAlert className="w-10 h-10 text-primary" />
        </div>

        <h2 className="font-heading text-3xl font-black text-foreground mb-4 relative z-10 uppercase tracking-tight">
          Verificación de Edad
        </h2>
        
        <p className="text-muted-foreground text-sm md:text-base font-medium mb-8 leading-relaxed relative z-10">
          Los productos de esta tienda están estrictamente dirigidos a <strong>mayores de 18 años</strong>. 
          Al entrar, confirmas que tienes la edad legal para comprar artículos de consumo y para fumadores en tu país.
        </p>

        <div className="flex flex-col gap-3 relative z-10">
          <Button 
            onClick={handleAccept} 
            className="w-full h-14 text-base font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(153,204,51,0.3)] hover:scale-105 transition-all"
          >
            SÍ, SOY MAYOR DE 18 AÑOS
          </Button>
          <Button 
            onClick={handleReject} 
            variant="outline" 
            className="w-full h-12 text-sm font-bold border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
          >
            No, soy menor de edad
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;