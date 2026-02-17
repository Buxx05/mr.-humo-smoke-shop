import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Send, Store } from "lucide-react";

// --- CONFIGURACIÓN DE TUS TIENDAS ---
const STORES = [
  {
    name: "Sede Av. Revolución", // Puedes cambiar el nombre (ej. Tienda Principal)
    address: "Av. Revolucion 1824\nVilla el Salvador, Lima",
    schedule: "Lun - Dom: 9:30 - 21:00\nSábados: 9:30 - 22:00",
    // Usa el mismo mapa por ahora
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.686629853682!2d-76.9416288!3d-12.2081557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b90000000001%3A0x0!2sAv.%20Revoluci%C3%B3n%201824%2C%20Villa%20EL%20Salvador%2015834!5e0!3m2!1ses-419!2spe!4v1708620000000!5m2!1ses-419!2spe" 
  },
  {
    name: "Sede 2 (VES)", // Aquí pones el nombre de la segunda tienda
    address: "Av. Revolucion 1824\nVilla el Salvador, Lima", // Cambiar luego
    schedule: "Lun - Dom: 9:30 - 21:00\nSábados: 9:30 - 22:00",
    // Usa el mismo mapa por ahora
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.686629853682!2d-76.9416288!3d-12.2081557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b90000000001%3A0x0!2sAv.%20Revoluci%C3%B3n%201824%2C%20Villa%20EL%20Salvador%2015834!5e0!3m2!1ses-419!2spe!4v1708620000000!5m2!1ses-419!2spe"
  }
];

const WHATSAPP_NUMBER = "51986170583";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmitToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const message = `Hola Mr. Humo, tengo una consulta:\n\n*Nombre:* ${data.nombre}\n*Mensaje:* ${data.mensaje}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 500);
  };

  return (
    <section className="py-8 md:py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary">
            Nuestras Tiendas
          </h2>
          <p className="text-muted-foreground">
            Visítanos en cualquiera de nuestras sedes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* COLUMNA 1: LISTA DE TIENDAS (Dos cajas visibles) */}
          <div className="space-y-6">
            {STORES.map((store, index) => (
              <Card key={index} className="border-primary/10 shadow-sm overflow-hidden hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3 bg-secondary/20 border-b border-border/50">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" /> {store.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {/* Info */}
                    <div className="p-5 space-y-4">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Dirección</p>
                          <p className="text-xs text-muted-foreground whitespace-pre-line">{store.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Horario</p>
                          <p className="text-xs text-muted-foreground whitespace-pre-line">{store.schedule}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => window.open(store.mapSrc, '_blank')}>
                        Ver en Mapa Grande
                      </Button>
                    </div>
                    {/* Mapa Miniatura */}
                    <div className="h-48 sm:h-auto border-t sm:border-t-0 sm:border-l border-border/50">
                      <iframe 
                        src={store.mapSrc} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        title={`Mapa ${store.name}`}
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                      ></iframe>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* COLUMNA 2: FORMULARIO WHATSAPP (Fijo a la derecha) */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="border-primary/20 shadow-lg relative overflow-hidden bg-card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
              <CardContent className="p-6 md:p-8 relative z-10">
                <div className="mb-6">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <Phone className="w-5 h-5 text-green-500" /> Chat Rápido
                   </h3>
                   <p className="text-sm text-muted-foreground mt-1">
                     ¿No puedes venir? Te atendemos al instante por WhatsApp.
                   </p>
                </div>
                
                <form onSubmit={handleSubmitToWhatsApp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input name="nombre" required placeholder="Tu nombre" className="bg-background/50" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mensaje</label>
                    <Textarea 
                      name="mensaje"
                      required 
                      placeholder="Hola, quiero consultar el stock del vaper..." 
                      className="min-h-[140px] bg-background/50 resize-none"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full font-bold bg-green-600 hover:bg-green-700 text-white h-12 shadow-lg shadow-green-600/20" disabled={loading}>
                    {loading ? "Abriendo..." : <><Send className="w-4 h-4 mr-2" /> Enviar Mensaje</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;