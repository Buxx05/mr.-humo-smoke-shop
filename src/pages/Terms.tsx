import { ShieldCheck } from "lucide-react";

const Terms = () => {
  return (
    <main className="py-16 md:py-24 animate-fade-in px-4">
      <div className="container max-w-4xl mx-auto space-y-8 bg-card p-8 md:p-12 rounded-3xl border border-border shadow-xl">
        
        <div className="flex items-center gap-4 mb-8 border-b border-border/50 pb-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-black text-foreground">Términos y Condiciones</h1>
            <p className="text-muted-foreground font-medium mt-1">Última actualización: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Mayoría de Edad y Uso Permitido</h2>
            <p>
              El acceso a esta plataforma y la compra de nuestros productos están estrictamente restringidos a personas <strong>mayores de 18 años</strong>. Al utilizar nuestro sitio web, usted declara bajo juramento tener la edad legal requerida en el Perú para la compra de artículos para fumadores. Mr. Humo se reserva el derecho de solicitar el DNI físico al momento de la entrega o recojo en tienda para verificar la edad del comprador.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Funcionamiento del Club VIP (Puntos)</h2>
            <p>
              El programa de recompensas "Mr. Humo Club" es un beneficio gratuito para nuestros clientes registrados:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Los puntos ganados (1 punto = S/ 1.00 en compras mayores a S/ 20.00) no tienen valor monetario real y no pueden ser canjeados por dinero en efectivo.</li>
              <li>Los puntos tienen una <strong>vigencia de 6 meses</strong> desde el momento de su emisión.</li>
              <li>Los cupones generados por canjes de premios son de uso personal, intransferibles y deben ser reclamados presencialmente en nuestras tiendas mostrando el DNI registrado.</li>
              <li>Mr. Humo se reserva el derecho de anular puntos o cancelar cuentas si se detecta fraude o abuso del sistema.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Compras y Envíos</h2>
            <p>
              Los pedidos generados a través de nuestro "Carrito de Compras" son solicitudes de pedido que se confirman y coordinan mediante <strong>WhatsApp</strong>. El stock y los precios están sujetos a confirmación final por parte de nuestro equipo de ventas durante la comunicación directa. El pago y método de envío/recojo se acordarán en dicho chat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Garantías y Devoluciones</h2>
            <p>
              Al tratarse de artículos de uso personal (como vapes, pipas o boquillas), no se aceptan devoluciones por cambios de parecer una vez abierto o usado el producto, por estrictas razones de higiene y salud. Solo se aceptarán reclamos por fallas de fábrica reportadas dentro de las primeras 24 horas de recibido el producto, sujeto a evaluación técnica en tienda.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
};

export default Terms;