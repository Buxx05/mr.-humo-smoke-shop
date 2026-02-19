import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Send, Store, MessageCircle } from "lucide-react";

// --- CONFIGURACIÓN DE TUS TIENDAS ---
const STORES = [
  {
    name: "Sede Av. Revolución",
    address: "Av. Revolucion 1824\nVilla el Salvador, Lima",
    schedule: "Lun - Dom: 9:30 - 21:00\nSábados: 9:30 - 22:00",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.988019623838!2d-76.938833!3d-12.213194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDEyJzQ3LjUiUyA3NsKwNTYnMTkuOCJX!5e0!3m2!1ses!2spe!4v1620000000000!5m2!1ses!2spe" // Placeholder de Google Maps
  },
  {
    name: "Sede 2 (VES)",
    address: "Av. Principal 123\nVilla el Salvador, Lima", 
    schedule: "Lun - Dom: 9:30 - 21:00\nSábados: 9:30 - 22:00",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.988019623838!2d-76.938833!3d-12.213194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDEyJzQ3LjUiUyA3NsKwNTYnMTkuOCJX!5e0!3m2!1ses!2spe!4v1620000000000!5m2!1ses!2spe"
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
    <section className="py-12 md:py-20 bg-background relative border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-black font-heading text-foreground tracking-tight">
            Nuestras <span className="text-primary">Tiendas</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-xl mx-auto">
            Visítanos en cualquiera de nuestras sedes o escríbenos directamente a WhatsApp para atención inmediata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          
          {/* COLUMNA 1: LISTA DE TIENDAS (Toma 7 columnas en PC) */}
          <div className="lg:col-span-7 space-y-6">
            {STORES.map((store, index) => (
              <Card key={index} className="border-border bg-card shadow-lg overflow-hidden hover:border-primary/50 transition-colors group">
                <CardHeader className="py-4 px-6 bg-secondary/30 border-b border-border/50">
                  <CardTitle className="text-xl font-black flex items-center gap-3 text-foreground">
                    <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                      <Store className="w-5 h-5" />
                    </div>
                    {store.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Info */}
                    <div className="flex-1 p-6 space-y-5">
                      <div className="flex gap-4 items-start">
                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-1">Dirección</p>
                          <p className="text-sm font-medium text-foreground whitespace-pre-line leading-relaxed">{store.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-1">Horario</p>
                          <p className="text-sm font-medium text-foreground whitespace-pre-line leading-relaxed">{store.schedule}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2 font-bold hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors" onClick={() => window.open(store.mapSrc, '_blank')}>
                        Cómo Llegar
                      </Button>
                    </div>
                    {/* Mapa Miniatura */}
                    <div className="h-48 sm:h-auto sm:w-2/5 border-t sm:border-t-0 sm:border-l border-border/50 overflow-hidden relative">
                      <iframe 
                        src={store.mapSrc} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        title={`Mapa ${store.name}`}
                        className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 absolute inset-0 w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* COLUMNA 2: FORMULARIO WHATSAPP (Toma 5 columnas en PC y es Sticky) */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="border-border bg-card shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#25D366]/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none group-hover:bg-[#25D366]/20 transition-colors"></div>
                <CardContent className="p-6 md:p-8 relative z-10">
                  <div className="mb-8">
                    <h3 className="text-2xl font-black font-heading flex items-center gap-3 text-foreground">
                      <div className="bg-[#25D366]/20 p-2.5 rounded-full text-[#25D366]">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      Chat Rápido
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium mt-3 leading-relaxed">
                      ¿No puedes venir? Escríbenos directamente a WhatsApp y te atenderemos al instante.
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmitToWhatsApp} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tu Nombre</label>
                      <Input 
                        name="nombre" 
                        required 
                        placeholder="Ej. Juan Pérez" 
                        className="bg-background border-border h-12 focus-visible:ring-primary" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">¿En qué te ayudamos?</label>
                      <Textarea 
                        name="mensaje"
                        required 
                        placeholder="Hola, quiero consultar el stock de..." 
                        className="min-h-[120px] bg-background border-border resize-none focus-visible:ring-primary"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full font-black text-white h-14 text-base transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)]" 
                      style={{ backgroundColor: '#25D366' }}
                      disabled={loading}
                    >
                      {loading ? "Abriendo WhatsApp..." : <><Send className="w-5 h-5 mr-2" /> Enviar a WhatsApp</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;