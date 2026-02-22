import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contactUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "BLOCKED"], default: "PENDING" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

connectionSchema.index({ userId: 1, contactUserId: 1 }, { unique: true });

export const Connection = mongoose.model("Connection", connectionSchema);