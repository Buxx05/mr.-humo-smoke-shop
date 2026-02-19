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

  // Modales de UI
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Estado Dinámico para el Modal de Errores (Estilo Gmail)
  const [errorModal, setErrorModal] = useState({
    show: false,
    title: "",
    description: ""
  });

  // Función ayudante para lanzar errores limpios
  const showError = (title: string, description: string) => {
    setErrorModal({ show: true, title, description });
  };

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
      showError(
        "Credenciales Incorrectas", 
        "El correo electrónico o la contraseña no coinciden con nuestros registros. Por favor, verifica tus datos e inténtalo de nuevo."
      );
    } else {
      toast.success("¡Bienvenido de vuelta!");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- 1. VALIDACIONES LOCALES CON MODAL ---
    if (!/^\d{8,15}$/.test(regDni)) {
      showError(
        "Documento Inválido", 
        "El documento de identidad debe tener al menos 8 números. Por favor, revísalo y corrígelo."
      );
      return;
    }
    if (!/^\d{9}$/.test(regPhone)) {
      showError(
        "Celular Inválido", 
        "El número de celular debe tener exactamente 9 dígitos para ser válido. Por favor, corrígelo."
      );
      return;
    }
    if (regPassword.length < 6) {
      showError(
        "Contraseña muy corta", 
        "Por tu seguridad, la contraseña debe tener un mínimo de 6 caracteres."
      );
      return;
    }
    // NUEVA VALIDACIÓN: Verifica que tenga al menos una letra y un número
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(regPassword)) {
      showError(
        "Contraseña muy débil", 
        "Tu contraseña es demasiado sencilla. Por favor, asegúrate de incluir al menos una letra y un número para proteger tu cuenta (Ej: Humo123)."
      );
      return;
    }

    setLoading(true);

    // --- 2. VALIDACIÓN DE DNI DUPLICADO EN BASE DE DATOS ---
    const { data: dniExists } = await supabase.rpc('check_dni_exists', { p_dni: regDni });
    
    if (dniExists) {
      showError(
        "Documento Ya Registrado", 
        `El DNI o Documento ${regDni} ya está vinculado a otra cuenta en Mr. Humo. No está permitido crear múltiples cuentas con el mismo documento para evitar fraudes con los puntos.`
      );
      setLoading(false);
      return; 
    }
    
    // --- 3. INTENTO DE REGISTRO EN SUPABASE AUTH ---
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
      // Atrapamos el error de usuario duplicado
      if (error.message.includes("already registered") || error.message.includes("unique")) {
        showError(
          "Correo Ya Registrado", 
          `El correo ${regEmail} ya pertenece a un miembro del club. Por favor, utiliza la pestaña de "Iniciar Sesión" para entrar a tu cuenta.`
        );
      } 
      // Atrapamos el error de contraseña insegura desde el servidor (por si pasa la validación local)
      else if (error.message.toLowerCase().includes("password should contain")) {
        showError(
          "Contraseña muy débil", 
          "El sistema de seguridad exige que tu contraseña contenga al menos una letra y un número. Intenta combinar ambos para mayor protección."
        );
      } 
      // Cualquier otro error raro
      else {
        showError(
          "Error de Conexión", 
          `No pudimos procesar tu registro en este momento. Detalle técnico: ${error.message}`
        );
      }
    } else if (data.user) {
      // --- 4. ÉXITO ---
      if (data.user.identities?.length === 0) {
         showError(
          "Correo Ya Registrado", 
          `El correo ${regEmail} ya pertenece a un miembro del club. Por favor, utiliza la pestaña de "Iniciar Sesión" para entrar a tu cuenta.`
        );
      } else {
        
        // 👉 ¡NUEVO! Reclamar los puntos del limbo inmediatamente después de crear la cuenta
        // Enviamos el DNI que acaba de registrar y su nuevo ID de usuario
        await supabase.rpc('reclamar_puntos_limbo', { 
          p_dni: regDni, 
          p_user_id: data.user.id 
        });

        // Limpiamos el formulario y mostramos éxito
        setRegEmail("");
        setRegPassword("");
        setRegFullName("");
        setRegDni("");
        setRegPhone("");
        setShowSuccessModal(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-background p-4 animate-fade-in py-12">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-card">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(153,204,51,0.2)] animate-pulse">
            <Flame className="w-10 h-10 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black font-heading tracking-tight text-foreground">Mr. Humo Club</CardTitle>
            <CardDescription className="text-base mt-2">
              Únete a la comunidad y gana puntos por cada compra.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/50 p-1 rounded-xl h-12">
              <TabsTrigger value="login" className="rounded-lg font-bold text-sm">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg font-bold text-sm text-primary">Crear Cuenta</TabsTrigger>
            </TabsList>

            {/* TAB LOGIN */}
            <TabsContent value="login" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="font-bold">Correo Electrónico</Label>
                  <Input 
                    id="email" type="email" required placeholder="tucorreo@gmail.com"
                    className="h-12 bg-background border-border focus-visible:ring-primary focus-visible:border-primary"
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2.5 relative">
                  <Label htmlFor="password" className="font-bold">Contraseña</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      className="h-12 bg-background border-border pr-12 focus-visible:ring-primary focus-visible:border-primary"
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-4 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full font-black h-12 text-base shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={loading}>
                  {loading ? "Verificando..." : "Ingresar a mi cuenta"}
                </Button>
              </form>
            </TabsContent>

            {/* TAB REGISTRO */}
            <TabsContent value="register" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="reg-name" className="font-bold">Nombre Completo</Label>
                  <Input 
                    id="reg-name" required placeholder="Ej. Juan Pérez"
                    className="h-12 bg-background border-border focus-visible:ring-primary"
                    value={regFullName} onChange={(e) => setRegFullName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label htmlFor="reg-dni" className="font-bold">DNI / CE</Label>
                    <Input 
                      id="reg-dni" required maxLength={12} placeholder="Tu documento"
                      className="h-12 bg-background border-border focus-visible:ring-primary"
                      value={regDni} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); 
                        setRegDni(val);
                      }}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="reg-phone" className="font-bold">Celular</Label>
                    <Input 
                      id="reg-phone" required maxLength={9} placeholder="9 dígitos"
                      className="h-12 bg-background border-border focus-visible:ring-primary"
                      value={regPhone} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); 
                        if (val.length <= 9) setRegPhone(val);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="reg-email" className="font-bold">Correo Electrónico</Label>
                  <Input 
                    id="reg-email" type="email" required placeholder="tucorreo@gmail.com"
                    className="h-12 bg-background border-border focus-visible:ring-primary"
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="reg-password" className="font-bold">Contraseña Segura</Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      type={showPassword ? "text" : "password"} 
                      required minLength={6} placeholder="Debe incluir letras y números"
                      className="h-12 bg-background border-border pr-12 focus-visible:ring-primary"
                      value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-4 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full font-black h-12 text-base bg-gradient-to-r from-primary to-green-600 hover:opacity-90 transition-all hover:scale-[1.02] shadow-xl shadow-primary/20" disabled={loading}>
                  {loading ? "Verificando datos..." : "Crear Cuenta GRATIS"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* MODAL DE ÉXITO */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center border-primary/30 shadow-2xl" aria-describedby={undefined}>
          <DialogHeader className="space-y-4">
            <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-foreground tracking-tight">¡Cuenta Creada con Éxito!</DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed text-muted-foreground">
              Ya eres parte de <strong>Mr. Humo Club</strong>.<br/><br/>
              Como regalo de bienvenida, te hemos depositado <strong className="text-primary">50 puntos gratis</strong> en tu cuenta listos para usar en tu próximo canje.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => {
                setShowSuccessModal(false);
                setLoginEmail(regEmail);
                setRegEmail(""); setRegPassword(""); setRegFullName(""); setRegDni(""); setRegPhone("");
              }} 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
            >
              ¡Genial! Iniciar Sesión Ahora
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE ERRORES DINÁMICO (Estilo Gmail) */}
      <Dialog open={errorModal.show} onOpenChange={(open) => setErrorModal(prev => ({ ...prev, show: open }))}>
        <DialogContent className="sm:max-w-md text-center border-destructive/30 shadow-2xl" aria-describedby={undefined}>
          <DialogHeader className="space-y-4">
            <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit border border-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-foreground tracking-tight">
              {errorModal.title}
            </DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed text-muted-foreground">
              {errorModal.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => setErrorModal(prev => ({ ...prev, show: false }))} 
              variant="outline" 
              className="w-full h-12 font-bold hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;