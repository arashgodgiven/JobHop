import mongoose from "mongoose";
import { Connection } from "../models/Connection.js";
import { User } from "../models/User.js";

function toConnectionResponse(conn) {
  return {
    id: String(conn._id),
    userId: String(conn.userId),
    contactUserId: String(conn.contactUserId),
    status: conn.status
  };
}

export async function sendRequest(req, res, next) {
  try {
    const { contactUserId } = req.body;
    const userId = req.user.userId;

    if (!contactUserId) return res.status(400).json({ message: "contactUserId required" });

    if (!mongoose.isValidObjectId(contactUserId)) {
      return res.status(400).json({ message: "Invalid contactUserId" });
    }

    if (String(contactUserId) === String(userId)) {
      return res.status(400).json({ message: "Cannot connect to yourself" });
    }

    const contactExists = await User.exists({ _id: contactUserId });
    if (!contactExists) return res.status(404).json({ message: "Contact user not found" });

    const conn = await Connection.create({
      userId,
      contactUserId,
      status: "PENDING"
    });

    return res.json(toConnectionResponse(conn));
  } catch (err) {
    // duplicate pair
    if (err?.code === 11000) return res.status(409).json({ message: "Connection already exists" });
    next(err);
  }
}

export async function accept(req, res, next) {
  try {
    const { connectionId } = req.params;
    const userId = req.user.userId;

    const conn = await Connection.findById(connectionId);
    if (!conn) return res.status(404).json({ message: "Connection not found" });

    // Only the contact can accept (mirrors typical behavior)
    if (String(conn.contactUserId) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed to accept this connection" });
    }

    conn.status = "ACCEPTED";
    await conn.save();

    // create reciprocal accepted connection if not present
    await Connection.updateOne(
      { userId: conn.contactUserId, contactUserId: conn.userId },
      { $setOnInsert: { status: "ACCEPTED" } },
      { upsert: true }
    );

    return res.json(toConnectionResponse(conn));
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const userId = req.user.userId;
    const connections = await Connection.find({ userId }).sort({ createdAt: -1 });
    return res.json(connections.map(toConnectionResponse));
  } catch (err) {
    next(err);
  }
}