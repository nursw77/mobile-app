import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

job.start();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// ai state
app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
