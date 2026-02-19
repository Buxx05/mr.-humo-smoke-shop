import { Lock } from "lucide-react";

const Privacy = () => {
  return (
    <main className="py-16 md:py-24 animate-fade-in px-4">
      <div className="container max-w-4xl mx-auto space-y-8 bg-card p-8 md:p-12 rounded-3xl border border-border shadow-xl">
        
        <div className="flex items-center gap-4 mb-8 border-b border-border/50 pb-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-black text-foreground">Políticas de Privacidad</h1>
            <p className="text-muted-foreground font-medium mt-1">Última actualización: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Recopilación de Datos</h2>
            <p>
              En Mr. Humo respetamos su privacidad y protegemos sus datos personales conforme a la Ley N° 29733 (Ley de Protección de Datos Personales de Perú). Al registrarse en nuestra plataforma o realizar un pedido, recopilamos los siguientes datos:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Nombres y Apellidos.</li>
              <li>Documento de Identidad (DNI/CE) para verificación de edad y entrega de premios.</li>
              <li>Número de celular (WhatsApp) para coordinar pedidos.</li>
              <li>Correo electrónico y contraseña encriptada.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Uso de la Información</h2>
            <p>
              Los datos proporcionados son utilizados exclusivamente para:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Crear y gestionar su cuenta en el "Mr. Humo Club".</li>
              <li>Asignarle puntos automáticamente al realizar compras en nuestras sucursales.</li>
              <li>Contactarlo vía WhatsApp para confirmar pedidos de la tienda online.</li>
              <li>Evitar fraudes o duplicidad de cuentas mediante el registro de su DNI.</li>
            </ul>
            <p className="mt-2">
              <strong>Mr. Humo NO vende, alquila ni comparte</strong> su información personal con terceros bajo ninguna circunstancia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Uso de Cookies</h2>
            <p>
              Utilizamos cookies y almacenamiento local (Local Storage) en su navegador web únicamente para fines técnicos y operativos: mantener su sesión iniciada de forma segura, recordar los productos que ha agregado a su carrito de compras y recordar si ya ha aceptado nuestra verificación de mayoría de edad.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Seguridad y Derechos ARCO</h2>
            <p>
              Nuestra base de datos está protegida bajo altos estándares de seguridad y encriptación. Usted tiene derecho a ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) sobre sus datos. Si desea que su cuenta y sus datos sean eliminados permanentemente de nuestro sistema, puede solicitarlo enviándonos un mensaje a través de nuestra página de Contacto o directamente a nuestro número oficial de WhatsApp.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
};

export default Privacy;