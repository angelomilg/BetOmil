import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex items-center justify-center h-16 w-16 mx-auto mb-6 rounded-full bg-primary/10 text-primary">
            <Lock className="h-8 w-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Acceso requerido
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Necesitas iniciar sesión para acceder a esta sección de BetOmil.
          </p>
          
          <div className="space-y-3">
            <Button 
              asChild 
              size="lg" 
              className="w-full"
              data-testid="button-login-required"
            >
              <a href="/login">Iniciar sesión</a>
            </Button>
            
            <Button 
              variant="outline" 
              asChild 
              size="lg" 
              className="w-full"
              data-testid="button-signup-required"
            >
              <a href="/register">Crear cuenta gratis</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}