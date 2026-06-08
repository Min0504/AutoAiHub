/**
 * Vercel Serverless Function — wraps the Express API app.
 * Handles: /api/*, /sitemap.xml
 * Static frontend is served by Vercel CDN from dist/
 */
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
import { registerGeminiRoutes } from "../src/server/geminiRoutes";
import { registerLeadRoutes } from "../src/server/leadRoutes";
import { registerSitemapRoute } from "../src/server/sitemapRoute";

dotenv.config();

const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "autohub-ai" } },
    })
  : null;

const app = express();
app.use(express.json({ limit: "64kb" }));

registerSitemapRoute(app);
registerLeadRoutes(app);
registerGeminiRoutes(app, ai, geminiModel);

// Export for Vercel serverless runtime (no app.listen)
export default app;
