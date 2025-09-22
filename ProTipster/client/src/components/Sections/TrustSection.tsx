import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Shield, Award } from "lucide-react";

// Mock data for demonstration - todo: remove mock functionality
const metrics = [
  {
    icon: TrendingUp,
    value: "€847,392",
    label: "Volumen apostado (30d)",
    trend: "+23%",
    description: "Suma total de stakes registrados por usuarios activos"
  },
  {
    icon: Users,
    value: "1,892",
    label: "Usuarios activos",
    trend: "+15%", 
    description: "Apostadores y tipsters con actividad reciente"
  },
  {
    icon: Shield,
    value: "98.7%",
    label: "Precisión OCR",
    trend: "+2.1%",
    description: "Tickets procesados correctamente sin revisión manual"
  },
  {
    icon: Award,
    value: "284",
    label: "Tipsters verificados",
    trend: "+8%",
    description: "Tipsters con historial auditado y transparente"
  }
];

const testimonials = [
  {
    name: "Carlos M.",
    role: "Apostador profesional",
    content: "Finalmente una plataforma sin marketing agresivo. Datos claros, estadísticas profesionales y OCR que funciona de verdad.",
    metrics: "ROI +12.4% en 6 meses"
  },
  {
    name: "Ana R.",
    role: "Tipster verificada",
    content: "La transparencia es total. Los usuarios pueden ver mi historial completo sin manipulación. Eso genera mucha más confianza.",
    metrics: "340 suscriptores activos"
  },
  {
    name: "Miguel F.",
    role: "Gestor de banca",
    content: "Las estadísticas avanzadas me han ayudado a optimizar mi gestión. El análisis de drawdowns es especialmente útil.",
    metrics: "Yield +8.7% después de optimización"
  }
];

export default function TrustSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Datos que hablan por sí solos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Métricas reales de la plataforma, actualizadas diariamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 text-center hover-elevate"
                  data-testid={`metric-card-${index}`}
                >
                  <div className="flex items-center justify-center h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl font-bold text-foreground" data-testid={`metric-value-${index}`}>
                        {metric.value}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {metric.trend}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-foreground text-sm">
                      {metric.label}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Opiniones reales de apostadores y tipsters que usan BetOmil diariamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="p-6 hover-elevate"
                data-testid={`testimonial-${index}`}
              >
                <div className="space-y-4">
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.metrics}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}