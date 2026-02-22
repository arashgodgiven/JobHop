import mongoose from "mongoose";

const conversationUserSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, maxlength: 30 }, // "OWNER" / "MEMBER" optional
    joinedAt: { type: Date, default: Date.now }
  }
);

conversationUserSchema.index({ conversationId: 1, userId: 1 }, { unique: true });

export const ConversationUser = mongoose.model("ConversationUser", conversationUserSchema);