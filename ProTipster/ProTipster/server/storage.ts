import { 
  type User, 
  type InsertUser,
  type Bank,
  type InsertBank,
  type Bet,
  type InsertBet,
  type Sport,
  type League,
  type Tipster,
  type InsertTipster,
  type Pick,
  type InsertPick,
  type Follow,
  type InsertFollow
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Banks
  getUserBanks(userId: string): Promise<Bank[]>;
  getBank(id: string): Promise<Bank | undefined>;
  createBank(bank: InsertBank): Promise<Bank>;
  updateBank(id: string, updates: Partial<Bank>): Promise<Bank | undefined>;
  deleteBank(id: string): Promise<boolean>;

  // Sports and Leagues
  getSports(): Promise<Sport[]>;
  getLeagues(sportId?: string): Promise<League[]>;
  getSport(id: string): Promise<Sport | undefined>;
  getLeague(id: string): Promise<League | undefined>;

  // Bets
  getUserBets(userId: string, options?: { bankId?: string; limit?: number; offset?: number }): Promise<Bet[]>;
  getBet(id: string): Promise<Bet | undefined>;
  createBet(bet: InsertBet): Promise<Bet>;
  updateBet(id: string, updates: Partial<Bet>): Promise<Bet | undefined>;
  deleteBet(id: string): Promise<boolean>;
  getUserBetStats(userId: string): Promise<{
    totalBets: number;
    totalStaked: number;
    totalProfit: number;
    winRate: number;
    avgOdds: number;
    roi: number;
    yield: number;
  }>;

  // Tipsters
  getTipsters(options?: { limit?: number; offset?: number; isPublic?: boolean }): Promise<Tipster[]>;
  getTipster(id: string): Promise<Tipster | undefined>;
  getUserTipster(userId: string): Promise<Tipster | undefined>;
  createTipster(tipster: InsertTipster): Promise<Tipster>;
  updateTipster(id: string, updates: Partial<Tipster>): Promise<Tipster | undefined>;

  // Picks
  getTipsterPicks(tipsterId: string, options?: { limit?: number; offset?: number; includeSettled?: boolean }): Promise<Pick[]>;
  getPick(id: string): Promise<Pick | undefined>;
  createPick(pick: InsertPick): Promise<Pick>;
  updatePick(id: string, updates: Partial<Pick>): Promise<Pick | undefined>;
  deletePick(id: string): Promise<boolean>;

  // Follows
  getUserFollows(userId: string): Promise<Follow[]>;
  getTipsterFollowers(tipsterId: string): Promise<Follow[]>;
  getFollow(userId: string, tipsterId: string): Promise<Follow | undefined>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(userId: string, tipsterId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private banks: Map<string, Bank>;
  private sports: Map<string, Sport>;
  private leagues: Map<string, League>;
  private bets: Map<string, Bet>;
  private tipsters: Map<string, Tipster>;
  private picks: Map<string, Pick>;
  private follows: Map<string, Follow>;

  constructor() {
    this.users = new Map();
    this.banks = new Map();
    this.sports = new Map();
    this.leagues = new Map();
    this.bets = new Map();
    this.tipsters = new Map();
    this.picks = new Map();
    this.follows = new Map();

    // Initialize with some basic sports and leagues
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample sports
    const footballSport: Sport = { id: "football", name: "Fútbol", slug: "football" };
    const basketballSport: Sport = { id: "basketball", name: "Baloncesto", slug: "basketball" };
    const tennisSport: Sport = { id: "tennis", name: "Tenis", slug: "tennis" };
    
    this.sports.set("football", footballSport);
    this.sports.set("basketball", basketballSport);
    this.sports.set("tennis", tennisSport);

    // Add sample leagues
    const laLiga: League = { id: "la-liga", sportId: "football", name: "La Liga", slug: "la-liga", country: "España" };
    const premierLeague: League = { id: "premier-league", sportId: "football", name: "Premier League", slug: "premier-league", country: "Inglaterra" };
    const acb: League = { id: "acb", sportId: "basketball", name: "Liga ACB", slug: "acb", country: "España" };
    const nba: League = { id: "nba", sportId: "basketball", name: "NBA", slug: "nba", country: "Estados Unidos" };

    this.leagues.set("la-liga", laLiga);
    this.leagues.set("premier-league", premierLeague);
    this.leagues.set("acb", acb);
    this.leagues.set("nba", nba);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Use the provided Firebase UID, not a random UUID
    const user: User = { 
      ...insertUser,
      isPremium: false,
      subscriptionEndDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(insertUser.id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Banks
  async getUserBanks(userId: string): Promise<Bank[]> {
    return Array.from(this.banks.values()).filter(bank => bank.userId === userId);
  }

  async getBank(id: string): Promise<Bank | undefined> {
    return this.banks.get(id);
  }

  async createBank(insertBank: InsertBank): Promise<Bank> {
    // Validate that the user exists
    const userExists = await this.getUser(insertBank.userId);
    if (!userExists) {
      throw new Error(`User ${insertBank.userId} does not exist`);
    }

    const id = randomUUID();
    const bank: Bank = {
      ...insertBank,
      id,
      // Convert initialBalance to string for decimal field
      initialBalance: insertBank.initialBalance.toString(),
      currentBalance: insertBank.initialBalance.toString(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.banks.set(id, bank);
    return bank;
  }

  async updateBank(id: string, updates: Partial<Bank>): Promise<Bank | undefined> {
    const bank = this.banks.get(id);
    if (!bank) return undefined;
    
    const updatedBank = { ...bank, ...updates, updatedAt: new Date() };
    this.banks.set(id, updatedBank);
    return updatedBank;
  }

  async deleteBank(id: string): Promise<boolean> {
    return this.banks.delete(id);
  }

  // Sports and Leagues
  async getSports(): Promise<Sport[]> {
    return Array.from(this.sports.values());
  }

  async getLeagues(sportId?: string): Promise<League[]> {
    const leagues = Array.from(this.leagues.values());
    return sportId ? leagues.filter(league => league.sportId === sportId) : leagues;
  }

  async getSport(id: string): Promise<Sport | undefined> {
    return this.sports.get(id);
  }

  async getLeague(id: string): Promise<League | undefined> {
    return this.leagues.get(id);
  }

  // Bets
  async getUserBets(userId: string, options?: { bankId?: string; limit?: number; offset?: number }): Promise<Bet[]> {
    let bets = Array.from(this.bets.values())
      .filter(bet => bet.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (options?.bankId) {
      bets = bets.filter(bet => bet.bankId === options.bankId);
    }

    if (options?.offset) {
      bets = bets.slice(options.offset);
    }

    if (options?.limit) {
      bets = bets.slice(0, options.limit);
    }

    return bets;
  }

  async getBet(id: string): Promise<Bet | undefined> {
    return this.bets.get(id);
  }

  async createBet(insertBet: InsertBet): Promise<Bet> {
    // Validate that the user and bank exist
    const userExists = await this.getUser(insertBet.userId);
    if (!userExists) {
      throw new Error(`User ${insertBet.userId} does not exist`);
    }
    const bankExists = await this.getBank(insertBet.bankId);
    if (!bankExists) {
      throw new Error(`Bank ${insertBet.bankId} does not exist`);
    }

    const id = randomUUID();
    const bet: Bet = {
      ...insertBet,
      id,
      // Convert numbers to strings for decimal fields
      odds: insertBet.odds.toString(),
      stake: insertBet.stake.toString(),
      status: "pending",
      profit: "0",
      settledAt: null,
      placedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bets.set(id, bet);
    return bet;
  }

  async updateBet(id: string, updates: Partial<Bet>): Promise<Bet | undefined> {
    const bet = this.bets.get(id);
    if (!bet) return undefined;
    
    const updatedBet = { ...bet, ...updates, updatedAt: new Date() };
    this.bets.set(id, updatedBet);
    return updatedBet;
  }

  async deleteBet(id: string): Promise<boolean> {
    return this.bets.delete(id);
  }

  async getUserBetStats(userId: string): Promise<{
    totalBets: number;
    totalStaked: number;
    totalProfit: number;
    winRate: number;
    avgOdds: number;
    roi: number;
    yieldValue: number;
  }> {
    const userBets = await this.getUserBets(userId);
    const settledBets = userBets.filter(bet => bet.status === "won" || bet.status === "lost");
    
    const totalBets = userBets.length;
    // Only use settled bets for financial calculations
    const totalStaked = settledBets.reduce((sum, bet) => sum + parseFloat(bet.stake), 0);
    const totalProfit = settledBets.reduce((sum, bet) => sum + parseFloat(bet.profit || "0"), 0);
    const wonBets = settledBets.filter(bet => bet.status === "won").length;
    const winRate = settledBets.length > 0 ? (wonBets / settledBets.length) * 100 : 0;
    const avgOdds = settledBets.length > 0 ? settledBets.reduce((sum, bet) => sum + parseFloat(bet.odds), 0) / settledBets.length : 0;
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
    const yieldValue = roi; // For simplicity, yield = ROI in this implementation

    return {
      totalBets,
      totalStaked,
      totalProfit,
      winRate,
      avgOdds,
      roi,
      yieldValue
    };
  }

  // Tipsters
  async getTipsters(options?: { limit?: number; offset?: number; isPublic?: boolean }): Promise<Tipster[]> {
    let tipsters = Array.from(this.tipsters.values());
    
    if (options?.isPublic !== undefined) {
      tipsters = tipsters.filter(tipster => tipster.isPublic === options.isPublic);
    }

    tipsters.sort((a, b) => b.followerCount - a.followerCount);

    if (options?.offset) {
      tipsters = tipsters.slice(options.offset);
    }

    if (options?.limit) {
      tipsters = tipsters.slice(0, options.limit);
    }

    return tipsters;
  }

  async getTipster(id: string): Promise<Tipster | undefined> {
    return this.tipsters.get(id);
  }

  async getUserTipster(userId: string): Promise<Tipster | undefined> {
    return Array.from(this.tipsters.values()).find(tipster => tipster.userId === userId);
  }

  async createTipster(insertTipster: InsertTipster): Promise<Tipster> {
    // Validate that the user exists
    const userExists = await this.getUser(insertTipster.userId);
    if (!userExists) {
      throw new Error(`User ${insertTipster.userId} does not exist`);
    }

    // Check if user already has a tipster profile
    const existingTipster = await this.getUserTipster(insertTipster.userId);
    if (existingTipster) {
      throw new Error(`User ${insertTipster.userId} already has a tipster profile`);
    }

    const id = randomUUID();
    const tipster: Tipster = {
      ...insertTipster,
      id,
      isVerified: false,
      isPublic: true,
      totalPicks: 0,
      winRate: "0",
      avgOdds: "0",
      yieldValue: "0",
      followerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tipsters.set(id, tipster);
    return tipster;
  }

  async updateTipster(id: string, updates: Partial<Tipster>): Promise<Tipster | undefined> {
    const tipster = this.tipsters.get(id);
    if (!tipster) return undefined;
    
    const updatedTipster = { ...tipster, ...updates, updatedAt: new Date() };
    this.tipsters.set(id, updatedTipster);
    return updatedTipster;
  }

  // Picks
  async getTipsterPicks(tipsterId: string, options?: { limit?: number; offset?: number; includeSettled?: boolean }): Promise<Pick[]> {
    let picks = Array.from(this.picks.values())
      .filter(pick => pick.tipsterId === tipsterId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (!options?.includeSettled) {
      picks = picks.filter(pick => pick.status === "pending");
    }

    if (options?.offset) {
      picks = picks.slice(options.offset);
    }

    if (options?.limit) {
      picks = picks.slice(0, options.limit);
    }

    return picks;
  }

  async getPick(id: string): Promise<Pick | undefined> {
    return this.picks.get(id);
  }

  async createPick(insertPick: InsertPick): Promise<Pick> {
    // Validate that the tipster exists
    const tipsterExists = await this.getTipster(insertPick.tipsterId);
    if (!tipsterExists) {
      throw new Error(`Tipster ${insertPick.tipsterId} does not exist`);
    }

    const id = randomUUID();
    const pick: Pick = {
      ...insertPick,
      id,
      // Convert numbers to strings for decimal fields
      odds: insertPick.odds.toString(),
      status: "pending",
      result: null,
      settledAt: null,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.picks.set(id, pick);
    return pick;
  }

  async updatePick(id: string, updates: Partial<Pick>): Promise<Pick | undefined> {
    const pick = this.picks.get(id);
    if (!pick) return undefined;
    
    const updatedPick = { ...pick, ...updates, updatedAt: new Date() };
    this.picks.set(id, updatedPick);
    return updatedPick;
  }

  async deletePick(id: string): Promise<boolean> {
    return this.picks.delete(id);
  }

  // Follows
  async getUserFollows(userId: string): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(follow => follow.userId === userId);
  }

  async getTipsterFollowers(tipsterId: string): Promise<Follow[]> {
    return Array.from(this.follows.values()).filter(follow => follow.tipsterId === tipsterId);
  }

  async getFollow(userId: string, tipsterId: string): Promise<Follow | undefined> {
    return Array.from(this.follows.values()).find(
      follow => follow.userId === userId && follow.tipsterId === tipsterId
    );
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    // Validate that the user and tipster exist
    const userExists = await this.getUser(insertFollow.userId);
    if (!userExists) {
      throw new Error(`User ${insertFollow.userId} does not exist`);
    }
    const tipsterExists = await this.getTipster(insertFollow.tipsterId);
    if (!tipsterExists) {
      throw new Error(`Tipster ${insertFollow.tipsterId} does not exist`);
    }

    // Check for duplicate follows
    const existingFollow = await this.getFollow(insertFollow.userId, insertFollow.tipsterId);
    if (existingFollow) {
      throw new Error(`User ${insertFollow.userId} is already following tipster ${insertFollow.tipsterId}`);
    }

    const id = randomUUID();
    const follow: Follow = {
      ...insertFollow,
      id,
      subscriptionType: insertFollow.subscriptionType || "free",
      subscribedAt: new Date()
    };
    this.follows.set(id, follow);

    // Update tipster follower count
    await this.updateTipster(insertFollow.tipsterId, {
      followerCount: tipsterExists.followerCount + 1
    });

    return follow;
  }

  async deleteFollow(userId: string, tipsterId: string): Promise<boolean> {
    const follow = await this.getFollow(userId, tipsterId);
    if (!follow) return false;
    
    const deleted = this.follows.delete(follow.id);
    
    if (deleted) {
      // Update tipster follower count
      const tipster = await this.getTipster(tipsterId);
      if (tipster) {
        await this.updateTipster(tipsterId, {
          followerCount: Math.max(0, tipster.followerCount - 1)
        });
      }
    }
    
    return deleted;
  }
}

export const storage = new MemStorage();
