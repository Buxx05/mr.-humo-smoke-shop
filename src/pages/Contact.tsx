import ContactSection from "@/components/ContactSection";

const Contact = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] pt-12 md:pt-20 pb-10 bg-background relative overflow-hidden animate-fade-in">
      {/* Luz de neón de fondo (opcional, le da el toque VIP) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0 pointer-events-none"></div>
      
      {/* Contenido principal por encima del fondo */}
      <div className="relative z-10">
        <ContactSection />
      </div>
    </main>
  );
};

export default Contact;