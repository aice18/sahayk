import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimitStore.get(ip);

  if (!userData || now > userData.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userData.count++;
  return true;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  setInterval(() => {
    if (process.env.QUOTA_EXCEEDED === 'true') {
      console.log('Resetting quota exceeded flag after timeout');
      process.env.QUOTA_EXCEEDED = 'false';
    }
  }, 60 * 60 * 1000); // 1 hour

  // Admin endpoint to reset quota flag (for testing)
  app.post("/api/admin/reset-quota", (req, res) => {
    process.env.QUOTA_EXCEEDED = 'false';
    res.json({ message: "Quota flag reset successfully" });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

      // Check rate limit first
      if (!checkRateLimit(clientIP)) {
        return res.status(429).json({
          error: "Too many requests. Please wait a minute before trying again."
        });
      }

      const { message, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      // Check if we're in quota exceeded mode
      const quotaExceeded = process.env.QUOTA_EXCEEDED === 'true';

      if (quotaExceeded) {
        // Return a helpful message about quota limits
        const response = `I'm currently experiencing high demand and my free tier quota has been exceeded. Here are some suggestions for government schemes you might be interested in:

1. **Pradhan Mantri Jan Dhan Yojana** - Zero balance savings account with RuPay debit card
2. **Ayushman Bharat Yojana** - Health insurance coverage up to ₹5 lakh per family
3. **Pradhan Mantri Awas Yojana** - Affordable housing scheme for urban poor
4. **MGNREGA** - 100 days of guaranteed wage employment
5. **PM Kisan Samman Nidhi** - Direct income support for farmers

Please visit the official government websites or contact your local government office for detailed information and application procedures.`;
        return res.json({ text: response });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(
        `${systemInstruction}\n\n${message}`
      );

      const text = result.response.text();
      res.json({ text });
    } catch (error: any) {
      console.error("AI Error:", error);

      // If quota exceeded, set flag and return fallback response
      if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
        process.env.QUOTA_EXCEEDED = 'true';

        const fallbackResponse = `I'm currently experiencing high demand and my free tier quota has been exceeded. Here are some suggestions for government schemes you might be interested in:

1. **Pradhan Mantri Jan Dhan Yojana** - Zero balance savings account with RuPay debit card
2. **Ayushman Bharat Yojana** - Health insurance coverage up to ₹5 lakh per family
3. **Pradhan Mantri Awas Yojana** - Affordable housing scheme for urban poor
4. **MGNREGA** - 100 days of guaranteed wage employment
5. **PM Kisan Samman Nidhi** - Direct income support for farmers

Please visit the official government websites or contact your local government office for detailed information and application procedures.`;

        return res.json({ text: fallbackResponse });
      }

      res.status(500).json({ error: error.message || "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
