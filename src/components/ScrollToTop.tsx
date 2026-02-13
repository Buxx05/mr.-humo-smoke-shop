import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si la URL tiene un hash (ej: #contacto)
    if (hash) {
      // Buscamos el elemento por su ID
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      
      if (element) {
        // Si existe, bajamos suavemente hacia él
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // Si no lo encuentra inmediato (por carga), reintentamos en 100ms
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Si cambiamos de página normal (sin hash), vamos arriba de todo
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Se ejecuta cada vez que cambia la ruta o el hash

  return null; // Este componente no renderiza nada visual
};

export default ScrollToTop;