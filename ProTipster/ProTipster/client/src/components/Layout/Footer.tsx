import { BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground">BetOmil</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Analiza y automatiza tus apuestas con transparencia y datos profesionales.
            </p>
          </div>

          {/* Producto */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Producto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#tipsters" className="hover:text-foreground transition-colors" data-testid="link-footer-tipsters">
                  Tipsters
                </a>
              </li>
              <li>
                <a href="#rankings" className="hover:text-foreground transition-colors" data-testid="link-footer-rankings">
                  Rankings
                </a>
              </li>
              <li>
                <a href="#picks" className="hover:text-foreground transition-colors" data-testid="link-footer-picks">
                  Picks públicos
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-foreground transition-colors" data-testid="link-footer-precios">
                  Precios
                </a>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Soporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/como-funciona" className="hover:text-foreground transition-colors" data-testid="link-footer-como-funciona">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="/soporte" className="hover:text-foreground transition-colors" data-testid="link-footer-soporte">
                  FAQ y contacto
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-foreground transition-colors" data-testid="link-footer-blog">
                  Blog
                </a>
              </li>
              <li>
                <a href="/status" className="hover:text-foreground transition-colors" data-testid="link-footer-status">
                  Estado del servicio
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/legal/terminos" className="hover:text-foreground transition-colors" data-testid="link-footer-terminos">
                  Términos de servicio
                </a>
              </li>
              <li>
                <a href="/legal/privacidad" className="hover:text-foreground transition-colors" data-testid="link-footer-privacidad">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="/legal/cookies" className="hover:text-foreground transition-colors" data-testid="link-footer-cookies">
                  Política de cookies
                </a>
              </li>
              <li>
                <a href="/legal/juego-responsable" className="hover:text-foreground transition-colors" data-testid="link-footer-juego-responsable">
                  Juego responsable
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 BetOmil. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
            España | Europe/Madrid
          </p>
        </div>
      </div>
    </footer>
  );
}