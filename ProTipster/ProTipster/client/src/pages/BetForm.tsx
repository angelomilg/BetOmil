import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator, TrendingUp } from "lucide-react";

import type { Bank, Sport, League } from "@shared/schema";
import { z } from "zod";

// Form schema that matches our form inputs (strings initially)
const betFormSchema = z.object({
  bankId: z.string().min(1, "Selecciona una banca"),
  event: z.string().min(1, "El evento es requerido"),
  market: z.string().min(1, "El mercado es requerido"),
  selection: z.string().min(1, "La selección es requerida"),
  odds: z.string().min(1, "La cuota es requerida"),
  stake: z.string().min(1, "El stake es requerido"),
  eventDate: z.string().min(1, "La fecha del evento es requerida"),
  sportId: z.string().optional(),
  leagueId: z.string().optional(),
  bookmaker: z.string().optional(),
  notes: z.string().optional(),
  confidence: z.number().min(1).max(5).optional(),
});

type BetFormData = z.infer<typeof betFormSchema>;

interface BetFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function BetForm({ onBack, onSuccess }: BetFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [selectedSport, setSelectedSport] = useState<string>("");

  const form = useForm<BetFormData>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      event: "",
      market: "",
      selection: "",
      odds: "",
      stake: "",
      bookmaker: "",
      notes: "",
      confidence: undefined,
      sportId: "",
      leagueId: "",
      bankId: "",
      eventDate: "",
    },
  });

  // Fetch user banks
  const { data: banks = [], isError: banksError } = useQuery<Bank[]>({
    queryKey: ['/api/banks'],
    enabled: !!user,
  });

  // Fetch sports
  const { data: sports = [], isError: sportsError } = useQuery<Sport[]>({
    queryKey: ['/api/sports'],
  });

  // Fetch leagues based on selected sport
  const { data: leagues = [], isError: leaguesError } = useQuery<League[]>({
    queryKey: [`/api/leagues?sportId=${selectedSport}`],
    enabled: !!selectedSport,
  });

  // Create bet mutation
  const createBetMutation = useMutation({
    mutationFn: async (data: BetFormData) => {
      if (!user?.uid) throw new Error("User not authenticated");
      
      const response = await apiRequest('POST', '/api/bets', {
        ...data,
        eventDate: new Date(data.eventDate).toISOString(),
        tags: [], // Empty tags for now
      });

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Apuesta registrada!",
        description: "Tu apuesta se ha guardado correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar la apuesta",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BetFormData) => {
    createBetMutation.mutate(data);
  };

  // Calculate potential profit
  const watchedOdds = form.watch("odds");
  const watchedStake = form.watch("stake");
  const potentialProfit = watchedOdds && watchedStake ? 
    (parseFloat(watchedOdds) * parseFloat(watchedStake) - parseFloat(watchedStake)).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" size="icon" onClick={onBack || (() => setLocation("/app/bets"))} data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
                Registrar apuesta
              </h1>
              <p className="text-muted-foreground">
                Añade una nueva apuesta a tu historial
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Detalles de la apuesta</span>
              </CardTitle>
              <CardDescription>
                Completa la información de tu apuesta para hacer seguimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Bank Selection */}
                  <FormField
                    control={form.control}
                    name="bankId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banca *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-bank">
                              <SelectValue placeholder="Selecciona una banca" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {banks.map((bank) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.name} ({bank.currency} {bank.currentBalance})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="event"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Evento *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ej. Real Madrid vs Barcelona"
                              {...field}
                              data-testid="input-event"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha del evento *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              data-testid="input-event-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Sport and League */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sportId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deporte</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedSport(value);
                              form.setValue("leagueId", ""); // Reset league
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-sport">
                                <SelectValue placeholder="Selecciona deporte" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sports.map((sport) => (
                                <SelectItem key={sport.id} value={sport.id}>
                                  {sport.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leagueId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Liga</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-league">
                                <SelectValue placeholder="Selecciona liga" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leagues.map((league) => (
                                <SelectItem key={league.id} value={league.id}>
                                  {league.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Bet Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="market"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mercado *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ej. 1X2, Over/Under 2.5"
                              {...field}
                              data-testid="input-market"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="selection"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selección *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ej. Real Madrid, Over 2.5"
                              {...field}
                              data-testid="input-selection"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Financial Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="odds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuota *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ej. 2.50"
                              {...field}
                              data-testid="input-odds"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stake"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stake *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="ej. 100.00"
                              {...field}
                              data-testid="input-stake"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-end">
                      <div className="w-full p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calculator className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Beneficio potencial:
                          </span>
                        </div>
                        <span className="text-lg font-bold text-foreground" data-testid="text-potential-profit">
                          €{potentialProfit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bookmaker"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Casa de apuestas</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ej. Bet365, William Hill"
                              {...field}
                              value={field.value || ""}
                              data-testid="input-bookmaker"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confidence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confianza (1-5)</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger data-testid="select-confidence">
                                <SelectValue placeholder="Selecciona nivel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 - Muy baja</SelectItem>
                              <SelectItem value="2">2 - Baja</SelectItem>
                              <SelectItem value="3">3 - Media</SelectItem>
                              <SelectItem value="4">4 - Alta</SelectItem>
                              <SelectItem value="5">5 - Muy alta</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Análisis, razones para la apuesta, etc."
                            className="resize-none"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      disabled={createBetMutation.isPending}
                      className="flex-1"
                      data-testid="button-submit-bet"
                    >
                      {createBetMutation.isPending ? "Guardando..." : "Registrar apuesta"}
                    </Button>
                    {onBack && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        data-testid="button-cancel"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}