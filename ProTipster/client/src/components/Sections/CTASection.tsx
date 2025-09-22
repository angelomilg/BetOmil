import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

const freeFeatures = [
  "Registro manual de apuestas ilimitado",
  "Estadísticas básicas (ROI, Yield, WinRate)", 
  "Seguimiento de hasta 5 tipsters",
  "Exportación CSV mensual",
  "Soporte por email"
];

const premiumFeatures = [
  "Importación OCR de tickets",
  "Bot Telegram/WhatsApp", 
  "Estadísticas avanzadas y drawdowns",
  "Seguimiento ilimitado de tipsters",
  "Exportación XLSX ilimitada",
  "Alertas en tiempo real",
  "Soporte prioritario"
];

export default function CTASection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Empieza a apostar profesionalmente hoy
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comienza gratis y actualiza cuando necesites funciones avanzadas. 
            Sin permanencia, cancela cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plan Gratis */}
          <Card className="p-8 relative">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Plan Gratis
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-foreground">€0</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Para empezar y conocer la plataforma
                </p>
              </div>

              <ul className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <li 
                    key={index} 
                    className="flex items-center text-sm text-muted-foreground"
                    data-testid={`free-feature-${index}`}
                  >
                    <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                asChild
                data-testid="button-cta-free"
              >
                <a href="/register">Empezar gratis</a>
              </Button>
            </div>
          </Card>

          {/* Plan Premium */}
          <Card className="p-8 relative border-primary">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Más popular
              </span>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Plan Premium
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-foreground">€19</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Para apostadores serios que quieren automatizar
                </p>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Todo en Gratis, más:</strong>
              </div>

              <ul className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <li 
                    key={index} 
                    className="flex items-center text-sm text-muted-foreground"
                    data-testid={`premium-feature-${index}`}
                  >
                    <CheckCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                size="lg" 
                className="w-full"
                asChild
                data-testid="button-cta-premium"
              >
                <a href="/register">
                  Empezar Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            ¿Eres tipster profesional? 
            <a href="/pro" className="text-primary hover:underline ml-1" data-testid="link-cta-tipster">
              Conoce el Plan Tipster Pro
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            14 días de prueba gratis en Premium • Sin permanencia • Cancela cuando quieras
          </p>
        </div>
      </div>
    </section>
  );
}