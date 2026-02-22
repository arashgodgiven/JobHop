import { ConversationUser } from "../models/ConversationUser.js";
import { Message } from "../models/Message.js";

function toMessageResponse(msg) {
  return {
    id: String(msg._id),
    conversationId: String(msg.conversationId),
    senderUserId: String(msg.senderUserId),
    body: msg.body,
    sentAt: msg.sentAt,
    editedAt: msg.editedAt || null,
    deletedAt: msg.deletedAt || null
  };
}

async function ensureParticipant(conversationId, userId) {
  const exists = await ConversationUser.exists({ conversationId, userId });
  return Boolean(exists);
}

export async function sendMessage(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { body } = req.body;
    const userId = req.user.userId;

    if (!body) return res.status(400).json({ message: "body required" });

    const ok = await ensureParticipant(conversationId, userId);
    if (!ok) return res.status(403).json({ message: "Not a participant" });

    const msg = await Message.create({
      conversationId,
      senderUserId: userId,
      body
    });

    return res.json(toMessageResponse(msg));
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const ok = await ensureParticipant(conversationId, userId);
    if (!ok) return res.status(403).json({ message: "Not a participant" });

    const msgs = await Message.find({ conversationId }).sort({ sentAt: 1 });
    return res.json(msgs.map(toMessageResponse));
  } catch (err) {
    next(err);
  }
}

export async function editMessage(req, res, next) {
  try {
    const { conversationId, messageId } = req.params;
    const { body } = req.body;
    const userId = req.user.userId;

    if (!body) return res.status(400).json({ message: "body required" });

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (String(msg.conversationId) !== String(conversationId)) {
      return res.status(400).json({ message: "Message does not belong to this conversation" });
    }

    if (String(msg.senderUserId) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    msg.body = body;
    msg.editedAt = new Date();
    await msg.save();

    return res.json(toMessageResponse(msg));
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const { conversationId, messageId } = req.params;
    const userId = req.user.userId;

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    if (String(msg.conversationId) !== String(conversationId)) {
      return res.status(400).json({ message: "Message does not belong to this conversation" });
    }

    if (String(msg.senderUserId) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // soft delete to match your deletedAt field
    msg.deletedAt = new Date();
    await msg.save();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}