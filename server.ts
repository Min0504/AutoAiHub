/**
 * Vercel Serverless Function — wraps the Express API app.
 * Handles: /api/*
 * Static frontend (incl. sitemap.xml) is served by Vercel CDN from dist/public.
 */
import Groq from "groq-sdk";
import dotenv from "dotenv";
import express from "express";
import { registerAiRoutes } from "./src/server/aiRoutes";
import { registerLeadRoutes } from "./src/server/leadRoutes";
import { registerPartnerRoutes } from "./src/server/partnerRoutes";
import { createRateLimiter } from "./src/server/rateLimit";

// Load .env.local first (local dev), then .env as fallback
dotenv.config({ path: ".env.local" });
dotenv.config();

const groqModel = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const app = express();
app.use(express.json({ limit: "64kb" }));

// AI routes: 20 req / 15 min per IP (burst abuse protection)
const aiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyPrefix: "ai",
});
app.use("/api/chat", aiRateLimit);
app.use("/api/recommend", aiRateLimit);
app.use("/api/proposal", aiRateLimit);

// Lead routes: 30 req / 15 min per IP
const leadRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyPrefix: "leads",
});
app.use("/api/leads", leadRateLimit);

registerLeadRoutes(app);
registerPartnerRoutes(app);
registerAiRoutes(app, groq, groqModel);

// Export for Vercel serverless runtime (no app.listen)
export default app;

// Local dev: listen when not running inside Vercel
if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT ?? 3001);
  app.listen(PORT, () => {
    console.log(`[dev] API server → http://localhost:${PORT}`);
  });
}
