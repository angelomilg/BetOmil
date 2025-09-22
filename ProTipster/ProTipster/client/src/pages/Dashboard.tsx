import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Plus } from "lucide-react";

// Mock data for demonstration - todo: remove mock functionality
const mockStats = {
  totalBets: 47,
  winRate: 63.8,
  roi: 12.4,
  yield: 8.7,
  totalStaked: 2350,
  totalProfit: 291.4,
  currentStreak: 5,
  longestStreak: 8
};

const recentBets = [
  { id: 1, event: "Real Madrid vs Barcelona", stake: 50, odds: 2.1, result: "win", profit: 55 },
  { id: 2, event: "Manchester City vs Arsenal", stake: 75, odds: 1.8, result: "loss", profit: -75 },
  { id: 3, event: "Bayern Munich vs Dortmund", stake: 100, odds: 1.65, result: "win", profit: 65 },
  { id: 4, event: "PSG vs Marseille", stake: 60, odds: 1.9, result: "pending", profit: 0 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
                ¡Bienvenido, {user?.displayName || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground">
                Resumen de tu actividad en BetOmil
              </p>
            </div>
            <Button onClick={() => setLocation("/app/bets/new")} data-testid="button-new-bet">
              <Plus className="mr-2 h-4 w-4" />
              Nueva apuesta
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" data-testid="card-total-bets">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total apuestas</p>
                <p className="text-2xl font-bold text-foreground">{mockStats.totalBets}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-win-rate">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-foreground">{mockStats.winRate}%</p>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +5.2%
                  </Badge>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-roi">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ROI</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-foreground">+{mockStats.roi}%</p>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +2.1%
                  </Badge>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="card-profit">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beneficio total</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-foreground">€{mockStats.totalProfit}</p>
                  <Badge variant="secondary" className="text-xs">
                    Últimos 30d
                  </Badge>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bets */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Apuestas recientes</h3>
                <Button variant="outline" size="sm" onClick={() => setLocation("/app/bets")} data-testid="button-view-all-bets">
                  Ver todas
                </Button>
              </div>
              
              <div className="space-y-4">
                {recentBets.map((bet) => (
                  <div 
                    key={bet.id} 
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover-elevate"
                    data-testid={`bet-item-${bet.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{bet.event}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span>Stake: €{bet.stake}</span>
                        <span>Cuota: {bet.odds}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {bet.result === "win" && (
                        <div className="text-green-500 font-medium">+€{bet.profit}</div>
                      )}
                      {bet.result === "loss" && (
                        <div className="text-red-500 font-medium">€{bet.profit}</div>
                      )}
                      {bet.result === "pending" && (
                        <Badge variant="outline">Pendiente</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Estadísticas rápidas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Yield</span>
                  <span className="font-medium text-foreground">+{mockStats.yield}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total apostado</span>
                  <span className="font-medium text-foreground">€{mockStats.totalStaked}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Racha actual</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-medium text-foreground">{mockStats.currentStreak} victorias</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mayor racha</span>
                  <span className="font-medium text-foreground">{mockStats.longestStreak} victorias</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Acciones rápidas</h3>
              
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" onClick={() => setLocation("/app/bets/new")} data-testid="button-add-bet">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar apuesta
                </Button>
                
                <Button className="w-full justify-start" variant="outline" onClick={() => setLocation("/app/bets")} data-testid="button-view-stats">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver apuestas
                </Button>
                
                <Button className="w-full justify-start" variant="outline" data-testid="button-manage-bank">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Gestionar banca
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}