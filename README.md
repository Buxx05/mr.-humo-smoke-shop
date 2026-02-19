# 💨 Mr. Humo - E-Commerce & VIP Loyalty Club

¡Bienvenido al repositorio oficial de **Mr. Humo**! 
Esta plataforma es una solución integral "End-to-End" diseñada para un Smoke Shop moderno. Combina una tienda en línea pública orientada a la conversión por WhatsApp, con un potente sistema de fidelización (Club VIP) y un panel administrativo completo para gestión de inventario, cajeros y clientes.

## 🌟 Características Principales

### 🛒 1. Tienda Pública (E-Commerce)
* **Catálogo Dinámico:** Filtrado por categorías, vista de productos interactiva y modo oscuro elegante.
* **Combos Especiales:** Sistema de paquetes promocionales con cálculo de descuentos.
* **Carrito ➔ WhatsApp:** Carrito de compras persistente (`localStorage`) que formatea el pedido y los datos del cliente, enviándolos directamente al WhatsApp de ventas para cerrar la transacción.
* **Diseño Responsivo:** UI/UX optimizada tipo "App Nativa" para navegación fluida en dispositivos móviles.

### 💎 2. Club VIP (Fidelización de Clientes)
* **Gamificación por Niveles:** Rangos automáticos (Novato, Aficionado, Experto, Leyenda) basados en el histórico de compras.
* **Dashboard de Cliente:** Vista privada donde los usuarios pueden ver su saldo de puntos, progreso para el siguiente nivel e historial de movimientos.
* **Sistema de Canjes:** Catálogo de premios exclusivos donde los puntos se transforman en "Cupones" digitales (Tickets) que el cliente muestra en tienda.

### ⚙️ 3. Panel de Administración y Punto de Venta (POS)
* **Control de Roles (RBAC):** Accesos protegidos y diferenciados para `super_admin` (dueño), `vendedor` (cajero) y `cliente`.
* **Carga de Puntos Rápida:** Interfaz optimizada para que el cajero sume puntos al cliente con solo ingresar su DNI y el monto de compra.
* **Validador de Cupones:** Sistema para escanear/ingresar el código del premio del cliente y marcarlo como "entregado".
* **Gestión de Inventario (Excel):** Exportación e importación masiva de productos mediante archivos `.xlsx`.
* **Auditoría:** Registro inmutable de cada transacción de puntos generada.

---

## 🛠️ Tecnologías Utilizadas

**Frontend:**
* [React](https://reactjs.org/) (Framework UI)
* [TypeScript](https://www.typescriptlang.org/) (Tipado estricto)
* [Vite](https://vitejs.dev/) (Bundler ultra rápido)
* [Tailwind CSS](https://tailwindcss.com/) (Estilizado y Modo Oscuro)
* [shadcn/ui](https://ui.shadcn.com/) (Componentes accesibles y personalizables)
* [Lucide React](https://lucide.dev/) (Iconografía moderna)

**Backend as a Service (BaaS):**
* [Supabase](https://supabase.com/) (PostgreSQL Database, Authentication, RLS Policies & RPC Functions).

---

## 🚀 Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

### 1. Clonar el repositorio
```sh
git clone <YOUR_GIT_URL>
cd mr-humo-app