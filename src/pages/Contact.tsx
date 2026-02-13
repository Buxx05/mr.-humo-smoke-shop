import ContactSection from "@/components/ContactSection";

const Contact = () => {
  return (
    <main className="min-h-screen pt-20 pb-10 bg-background animate-fade-in">
      {/* Reutilizamos tu componente, pero ahora vive en su propia página */}
      <ContactSection />
    </main>
  );
};

export default Contact;