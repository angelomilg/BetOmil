import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, BarChart3, Target } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Registra tus apuestas",
    description: "Introduce apuestas manualmente o sube una foto del ticket. Nuestro OCR extrae automáticamente los datos principales.",
    details: ["Registro manual completo", "OCR automático de tickets", "Verificación de datos extraídos", "Categorización inteligente"]
  },
  {
    number: "02", 
    icon: BarChart3,
    title: "Analiza tu rendimiento",
    description: "Visualiza estadísticas profesionales con gráficos de equity, análisis de drawdowns y métricas avanzadas.",
    details: ["ROI y Yield en tiempo real", "Gráficos de equity curve", "Análisis de drawdowns", "Métricas por categoría"]
  },
  {
    number: "03",
    icon: Target,
    title: "Optimiza y mejora",
    description: "Establece objetivos, recibe alertas personalizadas y exporta informes detallados para análisis externos.",
    details: ["Objetivos personalizables", "Alertas inteligentes", "Exportación CSV/XLSX", "Comparativas históricas"]
  }
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Cómo funciona BetOmil
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proceso simple en 3 pasos para transformar tu forma de apostar
          </p>
        </div>

        <div className="space-y-8 lg:space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 1;
            
            return (
              <div 
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
                data-testid={`step-${index}`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl font-bold text-primary">
                      {step.number}
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li 
                        key={detailIndex}
                        className="flex items-center text-muted-foreground"
                        data-testid={`step-detail-${index}-${detailIndex}`}
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1 flex justify-center">
                  <Card className="w-full max-w-md p-8 bg-card">
                    <div className="space-y-6">
                      <div className="flex items-center justify-center h-24 w-24 mx-auto rounded-xl bg-primary/10">
                        <Icon className="h-12 w-12 text-primary" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-3 bg-muted rounded-md w-3/4" />
                        <div className="h-3 bg-muted rounded-md w-full" />
                        <div className="h-3 bg-muted rounded-md w-2/3" />
                      </div>
                      
                      <div className="flex space-x-2">
                        <div className="h-2 bg-primary rounded-full flex-1" />
                        <div className="h-2 bg-muted rounded-full flex-1" />
                        <div className="h-2 bg-muted rounded-full flex-1" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="text-base px-8"
            data-testid="button-how-it-works-cta"
          >
            Comenzar ahora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}