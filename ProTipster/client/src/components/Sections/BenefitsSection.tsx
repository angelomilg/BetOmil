import { Card } from "@/components/ui/card";
import { BarChart3, Camera, Target, Users } from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Registro y estadísticas profesionales",
    description: "Registra apuestas manualmente o importa tickets automáticamente. Análisis detallado de ROI, yield, drawdowns y volatilidad con filtros guardables.",
    features: ["ROI y Yield detallados", "Análisis de drawdowns", "Filtros personalizables", "Exportación CSV/XLSX"]
  },
  {
    icon: Users,
    title: "Seguimiento de tipsters",
    description: "Explora rankings transparentes, compara hasta 3 tipsters y recibe alertas de nuevos picks. Datos auditables sin manipulación.",
    features: ["Rankings verificados", "Comparador avanzado", "Alertas en tiempo real", "Historial inmutable"]
  },
  {
    icon: Camera,
    title: "Importación automática OCR Premium",
    description: "Sube fotos de tickets y procésalas automáticamente. Bot de Telegram/WhatsApp para importar directamente desde el móvil.",
    features: ["OCR de alta precisión", "Bot Telegram/WhatsApp", "Revisión de dudas", "Historial de importaciones"]
  },
  {
    icon: Target,
    title: "Gestión de banca y objetivos",
    description: "Gestiona múltiples bancas, establece objetivos y recibe recordatorios. Proyecciones basadas en tu rendimiento histórico.",
    features: ["Múltiples bancas", "Objetivos personalizados", "Recordatorios inteligentes", "Proyecciones de crecimiento"]
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Todo lo que necesitas para apostar profesionalmente
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Herramientas probadas para análisis, seguimiento y automatización. 
            Sin promesas vacías, solo datos y funcionalidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index} 
                className="p-8 hover-elevate"
                data-testid={`card-benefit-${index}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex} 
                          className="flex items-center text-sm text-muted-foreground"
                          data-testid={`feature-${index}-${featureIndex}`}
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}