import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Flame } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estados para Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para Registro
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regDni, setRegDni] = useState("");
  const [regPhone, setRegPhone] = useState("");

  // Si ya está logueado, lo mandamos a su panel
  useEffect(() => {
    if (role) {
      navigate(role === 'super_admin' || role === 'vendedor' ? '/admin/dashboard' : '/cliente/dashboard');
    }
  }, [role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      toast.error("Error al iniciar sesión: " + error.message);
    } else {
      toast.success("¡Bienvenido de vuelta!");
      // La redirección la maneja el useEffect del AuthContext y el if(role) de arriba
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Registrar usuario en Supabase Auth y pasarle los metadatos (DNI, Nombre, Celular)
    const { data, error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: {
          full_name: regFullName,
          dni: regDni,
          phone: regPhone,
        }
      }
    });

    if (error) {
      toast.error("Error al registrarse: " + error.message);
    } else if (data.user) {
      toast.success("¡Cuenta creada! Has recibido 50 puntos de regalo.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Flame className="w-6 h-6 text-primary" /> {/* <-- CAMBIA ESTA LÍNEA */}
          </div>
          <CardTitle className="text-2xl font-bold">Mr. Humo Club</CardTitle>
          <CardDescription>
            Inicia sesión o únete para acumular puntos y canjear premios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Ingresar</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            {/* TAB DE LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" type="email" required 
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    id="password" type="password" required 
                    value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            {/* TAB DE REGISTRO */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nombre Completo</Label>
                  <Input 
                    id="reg-name" required 
                    value={regFullName} onChange={(e) => setRegFullName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-dni">DNI</Label>
                    <Input 
                      id="reg-dni" required maxLength={8} 
                      value={regDni} onChange={(e) => setRegDni(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Celular</Label>
                    <Input 
                      id="reg-phone" required 
                      value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Correo Electrónico</Label>
                  <Input 
                    id="reg-email" type="email" required 
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input 
                    id="reg-password" type="password" required minLength={6}
                    value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;