import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle,
  MoreHorizontal,
  Calendar,
  Target
} from "lucide-react";

import type { Bet, Bank } from "@shared/schema";

interface BetListProps {
  onCreateBet?: () => void;
}

export default function BetList({ onCreateBet }: BetListProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bankFilter, setBankFilter] = useState<string>("all");

  // Fetch user bets
  const { data: bets = [], isLoading, isError: betsError } = useQuery<Bet[]>({
    queryKey: ['/api/bets'],
    enabled: !!user,
  });

  // Fetch user banks for filtering
  const { data: banks = [], isError: banksError } = useQuery<Bank[]>({
    queryKey: ['/api/banks'],
    enabled: !!user,
  });

  // Filter bets based on search and filters
  const filteredBets = bets.filter((bet) => {
    const matchesSearch = 
      bet.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.selection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.market.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || bet.status === statusFilter;
    const matchesBank = bankFilter === "all" || bet.bankId === bankFilter;

    return matchesSearch && matchesStatus && matchesBank;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "lost":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <MoreHorizontal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "won":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Ganada</Badge>;
      case "lost":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Perdida</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pendiente</Badge>;
      case "void":
        return <Badge variant="outline">Anulada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProfitDisplay = (bet: Bet) => {
    if (bet.status === "pending") {
      return <span className="text-muted-foreground">-</span>;
    }
    
    const profit = parseFloat(bet.profit || "0");
    if (profit > 0) {
      return <span className="text-green-600 font-medium">+€{profit.toFixed(2)}</span>;
    } else if (profit < 0) {
      return <span className="text-red-600 font-medium">€{profit.toFixed(2)}</span>;
    } else {
      return <span className="text-muted-foreground">€0.00</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando apuestas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (betsError || banksError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">Error al cargar los datos</h2>
            <p className="text-muted-foreground">
              {betsError && "No se pudieron cargar las apuestas. "}
              {banksError && "No se pudieron cargar las bancas. "}
              Por favor, inténtalo de nuevo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Mis apuestas
            </h1>
            <p className="text-muted-foreground">
              Historial completo de tus apuestas
            </p>
          </div>
          <Button onClick={onCreateBet || (() => setLocation("/app/bets/new"))} data-testid="button-create-bet">
            <Plus className="mr-2 h-4 w-4" />
            Nueva apuesta
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar apuestas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="won">Ganadas</SelectItem>
                  <SelectItem value="lost">Perdidas</SelectItem>
                  <SelectItem value="void">Anuladas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bankFilter} onValueChange={setBankFilter}>
                <SelectTrigger data-testid="select-bank-filter">
                  <SelectValue placeholder="Banca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las bancas</SelectItem>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-muted-foreground">
                <Filter className="mr-2 h-4 w-4" />
                <span>{filteredBets.length} apuesta{filteredBets.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bet List */}
        {filteredBets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {bets.length === 0 ? "No hay apuestas registradas" : "No se encontraron apuestas"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {bets.length === 0 
                  ? "Comienza registrando tu primera apuesta para hacer seguimiento de tus resultados."
                  : "Intenta ajustar los filtros para ver más resultados."
                }
              </p>
              {bets.length === 0 && (
                <Button onClick={onCreateBet || (() => setLocation("/app/bets/new"))} data-testid="button-create-first-bet">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar primera apuesta
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBets.map((bet) => (
              <Card key={bet.id} className="hover-elevate" data-testid={`bet-card-${bet.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Event and Status */}
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(bet.status)}
                        <h3 className="text-lg font-semibold text-foreground" data-testid={`bet-event-${bet.id}`}>
                          {bet.event}
                        </h3>
                        {getStatusBadge(bet.status)}
                      </div>

                      {/* Selection and Market */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Mercado</p>
                          <p className="font-medium">{bet.market}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Selección</p>
                          <p className="font-medium">{bet.selection}</p>
                        </div>
                      </div>

                      {/* Financial Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Cuota</p>
                          <p className="font-semibold">{parseFloat(bet.odds).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Stake</p>
                          <p className="font-semibold">€{parseFloat(bet.stake).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Beneficio</p>
                          {getProfitDisplay(bet)}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Casa</p>
                          <p className="font-medium">{bet.bookmaker || "-"}</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {bet.eventDate 
                                ? format(new Date(bet.eventDate), "d MMM yyyy", { locale: es })
                                : "Fecha no especificada"
                              }
                            </span>
                          </div>
                          {bet.confidence && (
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>Confianza: {bet.confidence}/5</span>
                            </div>
                          )}
                        </div>
                        
                        {bet.notes && (
                          <div className="text-sm text-muted-foreground max-w-md truncate">
                            {bet.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}