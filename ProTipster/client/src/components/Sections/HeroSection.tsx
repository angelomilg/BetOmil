import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, TrendingUp } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
            <Shield className="mr-2 h-4 w-4" />
            Datos transparentes • Sin humo comercial
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
            Analiza y automatiza
            <br />
            <span className="text-primary">tus apuestas sin humo</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Plataforma profesional para apostadores y tipsters. 
            Registra apuestas, analiza rendimiento, sigue tipsters y automatiza importación con OCR.
          </p>

          {/* Key Points */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-primary" />
              Estadísticas profesionales
            </div>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-primary" />
              Seguimiento de tipsters
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              Importación automática OCR
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg" 
              className="text-base px-8"
              asChild
              data-testid="button-hero-signup"
            >
              <a href="/register">
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base px-8"
              data-testid="button-hero-demo"
            >
              Ver demostración
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 border-t border-border">
            <p className="text-sm text-muted-foreground mb-6">
              Datos de la plataforma (últimos 30 días)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center" data-testid="metric-apuestas">
                <div className="text-2xl font-bold text-foreground">12,547</div>
                <div className="text-sm text-muted-foreground">Apuestas registradas</div>
              </div>
              <div className="text-center" data-testid="metric-tipsters">
                <div className="text-2xl font-bold text-foreground">284</div>
                <div className="text-sm text-muted-foreground">Tipsters activos</div>
              </div>
              <div className="text-center" data-testid="metric-usuarios">
                <div className="text-2xl font-bold text-foreground">1,892</div>
                <div className="text-sm text-muted-foreground">Usuarios registrados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}