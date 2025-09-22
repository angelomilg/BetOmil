import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertBankSchema,
  insertBetSchema,
  type User,
  type Bank,
  type Bet,
  type Sport,
  type League,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to require authentication - returns Firebase UID
  // NOTE: This is a simplified implementation. In production, you should verify the Firebase token
  const requireAuth = (req: any): string => {
    // Development bypass when Firebase Admin is not configured
    const isDev = process.env.NODE_ENV === 'development';
    const firebaseAdminConfigured = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
    
    if (isDev && !firebaseAdminConfigured) {
      // Development fallback - use a consistent test user ID
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        if (token && token !== 'undefined' && token !== 'null') {
          return token; // Use the provided token as user ID
        }
      }
      // Fallback to a default development user
      return 'dev-user-123';
    }
    
    // If Firebase Admin is configured, should verify JWT tokens here
    // For now, reject non-dev environments without proper verification
    if (!isDev) {
      throw new Error('Authentication requires Firebase Admin SDK configuration in production');
    }
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authentication required - missing token');
    }
    
    // For development: extract user ID from a simple format
    // In production: verify Firebase JWT token and extract UID
    const token = authHeader.substring(7); // Remove "Bearer "
    if (!token || token === 'undefined' || token === 'null') {
      throw new Error('Authentication required - invalid token');
    }
    
    // For demo purposes, treat the token as the user ID
    // TODO: Replace with Firebase Admin SDK token verification
    return token;
  };

  // User management
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/me", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  // Banks management
  app.get("/api/banks", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const banks = await storage.getUserBanks(userId);
      res.json(banks);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  app.post("/api/banks", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const bankData = insertBankSchema.parse({ ...req.body, userId });
      const bank = await storage.createBank(bankData);
      res.json(bank);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/banks/:id", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const bankId = req.params.id;
      
      // Verify bank belongs to user
      const existingBank = await storage.getBank(bankId);
      if (!existingBank || existingBank.userId !== userId) {
        return res.status(404).json({ message: "Bank not found" });
      }

      // Validate the update data, omitting protected fields
      const updateData = insertBankSchema.omit({ userId: true, id: true }).partial().parse(req.body);
      
      const bank = await storage.updateBank(bankId, updateData);
      res.json(bank);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/banks/:id", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const bankId = req.params.id;
      
      // Verify bank belongs to user
      const existingBank = await storage.getBank(bankId);
      if (!existingBank || existingBank.userId !== userId) {
        return res.status(404).json({ message: "Bank not found" });
      }

      const deleted = await storage.deleteBank(bankId);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Bets management
  app.get("/api/bets", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const { bankId, limit = 50, offset = 0 } = req.query;
      
      const options = {
        bankId: bankId as string | undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };

      const bets = await storage.getUserBets(userId, options);
      res.json(bets);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  app.post("/api/bets", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const betData = insertBetSchema.parse({ ...req.body, userId });
      
      // Verify that the bank belongs to the authenticated user
      const bank = await storage.getBank(betData.bankId);
      if (!bank || bank.userId !== userId) {
        return res.status(403).json({ message: "Bank not found or access denied" });
      }
      
      const bet = await storage.createBet(betData);
      res.json(bet);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/bets/:id", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const betId = req.params.id;
      const bet = await storage.getBet(betId);
      
      if (!bet || bet.userId !== userId) {
        return res.status(404).json({ message: "Bet not found" });
      }
      
      res.json(bet);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  app.put("/api/bets/:id", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const betId = req.params.id;
      
      // Verify bet belongs to user
      const existingBet = await storage.getBet(betId);
      if (!existingBet || existingBet.userId !== userId) {
        return res.status(404).json({ message: "Bet not found" });
      }

      // Validate the update data, omitting protected fields
      const updateData = insertBetSchema.omit({ userId: true, id: true }).partial().parse(req.body);
      
      // If bankId is being changed, verify ownership
      if (updateData.bankId && updateData.bankId !== existingBet.bankId) {
        const bank = await storage.getBank(updateData.bankId);
        if (!bank || bank.userId !== userId) {
          return res.status(403).json({ message: "Bank not found or access denied" });
        }
      }
      
      const bet = await storage.updateBet(betId, updateData);
      res.json(bet);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/bets/:id", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const betId = req.params.id;
      
      // Verify bet belongs to user
      const existingBet = await storage.getBet(betId);
      if (!existingBet || existingBet.userId !== userId) {
        return res.status(404).json({ message: "Bet not found" });
      }

      const deleted = await storage.deleteBet(betId);
      res.json({ success: deleted });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = requireAuth(req);
      const stats = await storage.getUserBetStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  // Sports and leagues (public data)
  app.get("/api/sports", async (req, res) => {
    try {
      const sports = await storage.getSports();
      res.json(sports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/leagues", async (req, res) => {
    try {
      const { sportId } = req.query;
      const leagues = await storage.getLeagues(sportId as string | undefined);
      res.json(leagues);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
