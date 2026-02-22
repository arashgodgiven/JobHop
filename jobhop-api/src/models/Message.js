import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  deletedAt: { type: Date }
});

messageSchema.index({ conversationId: 1, sentAt: 1 });

export const Message = mongoose.model("Message", messageSchema);