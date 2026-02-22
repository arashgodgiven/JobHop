import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/authRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/connections", connectionRoutes);
app.use("/conversations", conversationRoutes);

// messageRoutes defines full paths starting with /conversations/...
app.use("/", messageRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT || 8080);

await connectDb(process.env.MONGO_URI);
app.listen(port, () => console.log(`JobHop API listening on ${port}`));