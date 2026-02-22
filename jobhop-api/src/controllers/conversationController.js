import mongoose from "mongoose";
import { Conversation } from "../models/Conversation.js";
import { ConversationUser } from "../models/ConversationUser.js";

function toConversationResponse(conv, participantIds) {
  return {
    id: String(conv._id),
    type: conv.type,
    title: conv.title || null,
    createdByUserId: String(conv.createdByUserId),
    participantUserIds: participantIds.map(String)
  };
}

export async function createConversation(req, res, next) {
  try {
    const { type, title, participantUserIds } = req.body;
    const creatorUserId = req.user.userId;

    if (!type || !Array.isArray(participantUserIds) || participantUserIds.length === 0) {
      return res.status(400).json({ message: "type and participantUserIds required" });
    }

    // enforce creator included
    const ids = [...new Set(participantUserIds.map(String))];
    if (!ids.includes(String(creatorUserId))) ids.push(String(creatorUserId));

    // basic DM validation
    if (type === "DM" && ids.length !== 2) {
      return res.status(400).json({ message: "DM must have exactly 2 participants" });
    }
    if (type === "GROUP" && ids.length < 3) {
      return res.status(400).json({ message: "GROUP must have 3+ participants" });
    }

    // validate ObjectIds
    for (const id of ids) {
      if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid participantUserIds" });
    }

    const conv = await Conversation.create({
      type,
      title: title || null,
      createdByUserId: creatorUserId
    });

    // add participants
    const docs = ids.map((uid) => ({
      conversationId: conv._id,
      userId: uid,
      role: String(uid) === String(creatorUserId) ? "OWNER" : "MEMBER"
    }));
    await ConversationUser.insertMany(docs);

    return res.json(toConversationResponse(conv, ids));
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req, res, next) {
  try {
    const { conversationId } = req.params;
    const conv = await Conversation.findById(conversationId);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    const participants = await ConversationUser.find({ conversationId }).select("userId");
    const ids = participants.map((p) => p.userId);

    return res.json(toConversationResponse(conv, ids));
  } catch (err) {
    next(err);
  }
}

export async function myConversations(req, res, next) {
  try {
    const userId = req.user.userId;

    const memberships = await ConversationUser.find({ userId }).select("conversationId");
    const conversationIds = memberships.map((m) => m.conversationId);

    const conversations = await Conversation.find({ _id: { $in: conversationIds } }).sort({ updatedAt: -1 });

    // build responses with participants per conversation
    const responses = [];
    for (const conv of conversations) {
      const participants = await ConversationUser.find({ conversationId: conv._id }).select("userId");
      responses.push(toConversationResponse(conv, participants.map((p) => p.userId)));
    }

    return res.json(responses);
  } catch (err) {
    next(err);
  }
}

export async function deleteConversation(req, res, next) {
  try {
    const { conversationId } = req.params;

    await Conversation.deleteOne({ _id: conversationId });
    await ConversationUser.deleteMany({ conversationId });
    // messages are under /messages route, but delete here too to keep DB clean:
    const { Message } = await import("../models/Message.js");
    await Message.deleteMany({ conversationId });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}