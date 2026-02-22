import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["DM", "GROUP"], default: "DM" },
    title: { type: String, maxlength: 200 },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);