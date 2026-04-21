import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
import authRouter from "./modules/auth/route.js";
import adminRouter from "./modules/admin/route.js";
import bibleRouter from "./modules/bible/route.js";
import readingPlanRouter from "./modules/readingPlan/route.js";
import { formatApiResponse } from "./utils/helpers.js";
import { startEmailScheduler } from "./services/emailScheduler.js";

config();
connectDB();

const app = express();

app.options("/{*path}", cors());

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:5001",
      "https://app.exegesisproject.org",
      process.env.CLIENT_URL,
      process.env.SITEGRROUND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/bible", bibleRouter);
app.use("/reading-plans", readingPlanRouter);

app.get("/health", (req, res) => {
  res.send(
    formatApiResponse({
      status: 200,
      message: "Server is healthy",
      data: { timestamp: new Date().toISOString() },
    }),
  );
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Exegesis server running on port ${PORT}`);
  startEmailScheduler();
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

export default app;
