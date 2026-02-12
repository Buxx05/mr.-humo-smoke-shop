import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Flame, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Estados para Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para Registro
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regDni, setRegDni] = useState("");
  const [regPhone, setRegPhone] = useState("");

  // Modales
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Modal para "Cuenta ya existe"

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
      toast.error("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } else {
      toast.success("¡Bienvenido de vuelta!");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- 1. VALIDACIONES ---
    if (!/^\d{8}$/.test(regDni)) {
      toast.warning("El DNI debe tener exactamente 8 números.");
      return;
    }
    if (!/^\d{9}$/.test(regPhone)) {
      toast.warning("El celular debe tener 9 números.");
      return;
    }
    if (regPassword.length < 6) {
      toast.warning("La contraseña es muy corta (mínimo 6 caracteres).");
      return;
    }

    setLoading(true);
    
    // --- 2. INTENTO DE REGISTRO ---
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
      // Si el error dice "User already registered", mostramos el modal especial
      if (error.message.includes("already registered") || error.message.includes("unique")) {
        setShowErrorModal(true);
      } else {
        toast.error("Error: " + error.message);
      }
    } else if (data.user) {
      // --- 3. ÉXITO ---
      // Si el usuario ya existe pero NO estaba confirmado, Supabase devuelve user pero identities vacío.
      // Si es nuevo, identities tiene datos.
      if (data.user.identities?.length === 0) {
         setShowErrorModal(true); // Tratamos como "ya existe" para no confundir
      } else {
        // Limpiamos todo el formulario
        setRegEmail("");
        setRegPassword("");
        setRegFullName("");
        setRegDni("");
        setRegPhone("");
        // Mostramos modal de éxito
        setShowSuccessModal(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-2 animate-bounce-slow">
            <Flame className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">Mr. Humo Club</CardTitle>
          <CardDescription>
            La comunidad exclusiva para amantes del buen humo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Ingresar</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            {/* TAB LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" type="email" required placeholder="usuario@gmail.com"
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold h-11 text-base" disabled={loading}>
                  {loading ? "Entrando..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            {/* TAB REGISTRO */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nombre Completo</Label>
                  <Input 
                    id="reg-name" required placeholder="Ej. Juan Pérez"
                    value={regFullName} onChange={(e) => setRegFullName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-dni">DNI</Label>
                    <Input 
                      id="reg-dni" required maxLength={8} placeholder="8 dígitos"
                      value={regDni} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); 
                        if (val.length <= 8) setRegDni(val);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-phone">Celular</Label>
                    <Input 
                      id="reg-phone" required maxLength={9} placeholder="9 dígitos"
                      value={regPhone} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); 
                        if (val.length <= 9) setRegPhone(val);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Correo Electrónico</Label>
                  <Input 
                    id="reg-email" type="email" required placeholder="tucorreo@gmail.com"
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      type={showPassword ? "text" : "password"} 
                      required minLength={6} placeholder="Crea una contraseña segura"
                      value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                    />
                     <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold h-11 text-base bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear Cuenta GRATIS"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* MODAL DE ÉXITO */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-center">¡Casi listo!</DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              Te hemos enviado un correo de confirmación a <strong>{regEmail}</strong>.
              <br/><br/>
              Revisa tu bandeja de entrada (o spam) y haz clic en el enlace para activar tu cuenta y recibir tus <strong>50 puntos de regalo</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowSuccessModal(false)} className="w-full">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE ERROR (CUENTA EXISTENTE) */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto bg-yellow-100 p-3 rounded-full w-fit mb-4">
              <AlertTriangle className="w-12 h-12 text-yellow-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-center">Esta cuenta ya existe</DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              Parece que el correo <strong>{regEmail}</strong> ya está registrado en Mr. Humo.
              <br/><br/>
              Por favor, intenta iniciar sesión. Si olvidaste tu contraseña, contáctanos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowErrorModal(false)} variant="secondary" className="w-full">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;