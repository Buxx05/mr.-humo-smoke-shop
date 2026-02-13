import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Send, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);

  // TU CORREO AQUÍ (Donde quieres recibir los mensajes)
  const EMAIL_EMPRESA = "fizaguirresonco13@gmail.com"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      // Enviamos los datos a FormSubmit
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL_EMPRESA}`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            nombre: data.nombre,
            celular: data.celular,
            correo: data.correo,
            mensaje: data.mensaje,
            _subject: "🔥 Nuevo Mensaje - Mr. Humo Web", // Asunto del correo
            _template: "table" // Formato bonito
        })
      });

      if (response.ok) {
        toast.success("¡Mensaje enviado! Te responderemos pronto.");
        (e.target as HTMLFormElement).reset(); // Limpiar formulario
      } else {
        toast.error("Hubo un error al enviar. Intenta por WhatsApp.");
      }
    } catch (error) {
      toast.error("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary">
            ¿Tienes dudas? Hablemos
          </h2>
          <p className="text-muted-foreground">
            Estamos aquí para asesorarte con los mejores productos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* COLUMNA 1: INFORMACIÓN Y MAPA */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-card/50 border-primary/10">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold">Ubicación</h3>
                  <p className="text-sm text-muted-foreground">
                    Av. Revolucion 1824<br />
                    Villa el Salvador, Lima
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-primary/10">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold">Horario</h3>
                  <p className="text-sm text-muted-foreground">
                    Lun - Dom: 9:30 - 21:00<br />
                    Sábados: 9:30 - 22:00
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* MAPA EMBEBIDO */}
            <div className="rounded-lg overflow-hidden border border-border h-64 md:h-80 shadow-md">
              {/* PEGA AQUÍ TU IFRAME CORRECTO DE GOOGLE MAPS */}
              <iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.686629853682!2d-76.9416288!3d-12.2081557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b90000000001%3A0x0!2sAv.%20Revoluci%C3%B3n%201824%2C%20Villa%20EL%20Salvador%2015834!5e0!3m2!1ses-419!2spe!4v1708620000000!5m2!1ses-419!2spe"
  width="100%" 
  height="100%" 
  style={{ border: 0 }} 
  allowFullScreen={true} 
  loading="lazy" 
  referrerPolicy="no-referrer-when-downgrade"
  title="Mapa de ubicación Mr. Humo"
></iframe>
            </div>

            {/* REDES SOCIALES */}
            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" size="icon" className="rounded-full hover:text-purple-600 hover:border-purple-600">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600 hover:border-blue-600">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
                onClick={() => window.open("https://wa.me/51986170583", "_blank")}
              >
                <Phone className="w-4 h-4" /> Escríbenos al WhatsApp
              </Button>
            </div>
          </div>

          {/* COLUMNA 2: FORMULARIO */}
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> Envíanos un mensaje
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre</label>
                    <Input name="nombre" required placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Celular</label>
                    <Input name="celular" required placeholder="999..." type="tel" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Correo</label>
                  <Input name="correo" required type="email" placeholder="cliente@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensaje</label>
                  <Textarea 
                    name="mensaje"
                    required 
                    placeholder="Hola, estoy interesado en el Vaper Spartan..." 
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full font-bold" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;