import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: false }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 8080;

await connectDb(process.env.MONGO_URI);
app.listen(port, () => console.log(`API running on ${port}`));