import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { registerGeminiRoutes } from "./src/server/geminiRoutes";
import { getLeadStoragePath } from "./src/server/leadStore";
import { registerLeadRoutes } from "./src/server/leadRoutes";
import { registerSitemapRoute } from "./src/server/sitemapRoute";

dotenv.config({ path: ".env.local" });
dotenv.config();

const port = Number(process.env.PORT ?? 3000);
const geminiModel = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "autohub-ai",
        },
      },
    })
  : null;

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: "64kb" }));

  registerSitemapRoute(app);
  registerLeadRoutes(app);
  registerGeminiRoutes(app, ai, geminiModel);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`AutoHub AI server running on port ${port}`);
    console.log(`Lead storage path: ${getLeadStoragePath()}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
