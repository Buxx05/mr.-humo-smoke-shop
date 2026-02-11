import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { role } = useAuth();
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-primary">Panel General</h1>
      <p className="text-muted-foreground">
        Bienvenido al sistema. Tu rol actual es: <strong className="uppercase">{role}</strong>.
      </p>
      <div className="bg-card border p-8 rounded-lg text-center mt-8 shadow-sm">
        <p className="text-muted-foreground">Selecciona una opción del menú lateral para comenzar a operar.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;