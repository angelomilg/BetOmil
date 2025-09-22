import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table - Firebase integrated
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Firebase UID
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  isPremium: boolean("is_premium").default(false),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Banks - Bankroll accounts
export const banks = pgTable("banks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Bet365", "Main Bankroll"
  currency: varchar("currency", { length: 3 }).notNull().default("EUR"),
  initialBalance: decimal("initial_balance", { precision: 10, scale: 2 }).notNull(),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Sports/Leagues for categorization
export const sports = pgTable("sports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // e.g., "Fútbol", "Baloncesto"
  slug: text("slug").notNull().unique(), // e.g., "football", "basketball"
});

export const leagues = pgTable("leagues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sportId: varchar("sport_id").notNull().references(() => sports.id),
  name: text("name").notNull(), // e.g., "La Liga", "Premier League"
  slug: text("slug").notNull().unique(),
  country: text("country"), // e.g., "España", "Inglaterra"
});

// Bets - Main betting records
export const bets = pgTable("bets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bankId: varchar("bank_id").notNull().references(() => banks.id, { onDelete: "cascade" }),
  
  // Bet details
  event: text("event").notNull(), // e.g., "Real Madrid vs Barcelona"
  market: text("market").notNull(), // e.g., "1X2", "Over/Under 2.5"
  selection: text("selection").notNull(), // e.g., "Real Madrid", "Over 2.5"
  odds: decimal("odds", { precision: 5, scale: 2 }).notNull(),
  stake: decimal("stake", { precision: 10, scale: 2 }).notNull(),
  
  // Categorization
  sportId: varchar("sport_id").references(() => sports.id),
  leagueId: varchar("league_id").references(() => leagues.id),
  bookmaker: text("bookmaker"), // e.g., "Bet365", "William Hill"
  
  // Results
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, won, lost, void, cashout
  profit: decimal("profit", { precision: 10, scale: 2 }).default("0"),
  settledAt: timestamp("settled_at"),
  
  // Metadata
  notes: text("notes"),
  confidence: integer("confidence"), // 1-5 rating
  tags: text("tags").array(), // e.g., ["live", "value-bet", "system"]
  
  // Timestamps
  eventDate: timestamp("event_date"),
  placedAt: timestamp("placed_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Tipster profiles
export const tipsters = pgTable("tipsters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Profile info
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarURL: text("avatar_url"),
  
  // Verification and subscription
  isVerified: boolean("is_verified").default(false),
  subscriptionPrice: decimal("subscription_price", { precision: 8, scale: 2 }), // Monthly price in EUR
  isPublic: boolean("is_public").default(true),
  
  // Stats (calculated)
  totalPicks: integer("total_picks").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0"),
  avgOdds: decimal("avg_odds", { precision: 5, scale: 2 }).default("0"),
  yieldValue: decimal("yield_value", { precision: 8, scale: 4 }).default("0"), // ROI %
  
  // Social
  followerCount: integer("follower_count").default(0),
  
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Tipster picks/predictions
export const picks = pgTable("picks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tipsterId: varchar("tipster_id").notNull().references(() => tipsters.id, { onDelete: "cascade" }),
  
  // Pick details
  event: text("event").notNull(),
  market: text("market").notNull(),
  selection: text("selection").notNull(),
  odds: decimal("odds", { precision: 5, scale: 2 }).notNull(),
  
  // Categorization
  sportId: varchar("sport_id").references(() => sports.id),
  leagueId: varchar("league_id").references(() => leagues.id),
  bookmaker: text("bookmaker"),
  
  // Analysis
  analysis: text("analysis"), // Tipster's reasoning
  confidence: integer("confidence"), // 1-5 rating
  stake: integer("stake"), // 1-10 units recommended
  
  // Results
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  result: varchar("result", { length: 10 }), // won, lost, void
  settledAt: timestamp("settled_at"),
  
  // Access control
  isPremium: boolean("is_premium").default(false),
  
  // Timestamps
  eventDate: timestamp("event_date").notNull(),
  publishedAt: timestamp("published_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Follows relationship
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tipsterId: varchar("tipster_id").notNull().references(() => tipsters.id, { onDelete: "cascade" }),
  subscriptionType: varchar("subscription_type", { length: 20 }).notNull().default("free"), // free, premium
  subscribedAt: timestamp("subscribed_at").default(sql`CURRENT_TIMESTAMP`),
  expiresAt: timestamp("expires_at"), // For premium subscriptions
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  isPremium: true,
  subscriptionEndDate: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBankSchema = createInsertSchema(banks).omit({
  id: true,
  currentBalance: true, // Derived from initialBalance
  isActive: true, // Defaults to true
  createdAt: true,
  updatedAt: true,
}).extend({
  // Custom validation for balances
  initialBalance: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0)),
});

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  status: true,
  profit: true,
  settledAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Custom validation
  odds: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(1.01)),
  stake: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0.01)),
  confidence: z.number().min(1).max(5).optional(),
});

export const insertTipsterSchema = createInsertSchema(tipsters).omit({
  id: true,
  isVerified: true,
  totalPicks: true,
  winRate: true,
  avgOdds: true,
  yield: true,
  followerCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPickSchema = createInsertSchema(picks).omit({
  id: true,
  status: true,
  result: true,
  settledAt: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  odds: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(1.01)),
  confidence: z.number().min(1).max(5),
  stake: z.number().min(1).max(10),
});

export const insertFollowSchema = createInsertSchema(follows).omit({
  id: true,
  subscribedAt: true,
}).extend({
  // Make subscriptionType optional with default
  subscriptionType: z.enum(["free", "premium"]).default("free").optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bank = typeof banks.$inferSelect;
export type InsertBank = z.infer<typeof insertBankSchema>;

export type Sport = typeof sports.$inferSelect;
export type League = typeof leagues.$inferSelect;

export type Bet = typeof bets.$inferSelect;
export type InsertBet = z.infer<typeof insertBetSchema>;

export type Tipster = typeof tipsters.$inferSelect;
export type InsertTipster = z.infer<typeof insertTipsterSchema>;

export type Pick = typeof picks.$inferSelect;
export type InsertPick = z.infer<typeof insertPickSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
