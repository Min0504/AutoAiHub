/**
 * Vercel Serverless Function — wraps the Express API app.
 * Handles: /api/*, /sitemap.xml
 * Static frontend is served by Vercel CDN from dist/
 */
import Groq from "groq-sdk";
import dotenv from "dotenv";
import express from "express";
import { registerAiRoutes } from "./src/server/aiRoutes";
import { registerLeadRoutes } from "./src/server/leadRoutes";
import { registerSitemapRoute } from "./src/server/sitemapRoute";

// Load .env.local first (local dev), then .env as fallback
dotenv.config({ path: ".env.local" });
dotenv.config();

const groqModel = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const app = express();
app.use(express.json({ limit: "64kb" }));

registerSitemapRoute(app);
registerLeadRoutes(app);
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
