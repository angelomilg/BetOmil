import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart3, Menu, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground">BetOmil</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#tipsters" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-tipsters"
            >
              Tipsters
            </a>
            <a 
              href="#rankings" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-rankings"
            >
              Rankings
            </a>
            <a 
              href="#picks" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-picks"
            >
              Picks
            </a>
            <a 
              href="#precios" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-precios"
            >
              Precios
            </a>
            <a 
              href="#como-funciona" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-como-funciona"
            >
              Cómo funciona
            </a>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-medium" data-testid="text-user-name">
                          {user.displayName}
                        </p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground" data-testid="text-user-email">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/app" data-testid="link-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/app/cuenta" data-testid="link-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  data-testid="button-login"
                >
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button 
                  size="sm"
                  asChild
                  data-testid="button-signup"
                >
                  <Link href="/register">Empezar gratis</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <a 
                href="#tipsters" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-mobile-tipsters"
              >
                Tipsters
              </a>
              <a 
                href="#rankings" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-mobile-rankings"
              >
                Rankings
              </a>
              <a 
                href="#picks" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-mobile-picks"
              >
                Picks
              </a>
              <a 
                href="#precios" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-mobile-precios"
              >
                Precios
              </a>
              <a 
                href="#como-funciona" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-mobile-como-funciona"
              >
                Cómo funciona
              </a>
            </nav>
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.displayName || user.email}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                    data-testid="button-mobile-dashboard"
                  >
                    <Link href="/app">Dashboard</Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    data-testid="button-mobile-logout"
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                    data-testid="button-mobile-login"
                  >
                    <Link href="/login">Iniciar sesión</Link>
                  </Button>
                  <Button 
                    size="sm"
                    asChild
                    data-testid="button-mobile-signup"
                  >
                    <Link href="/register">Empezar gratis</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}