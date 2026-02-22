import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "BLOCKED"], default: "PENDING" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// like your uk_connections_pair(user_id, contact_id)
connectionSchema.index({ userId: 1, contactId: 1 }, { unique: true });

export const Connection = mongoose.model("Connection", connectionSchema);