import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Connection } from "../models/Connection.js";
import { Conversation } from "../models/Conversation.js";
import { ConversationUser } from "../models/ConversationUser.js";
import { Message } from "../models/Message.js";

await connectDb(process.env.MONGO_URI);

// wipe
await Message.deleteMany({});
await ConversationUser.deleteMany({});
await Conversation.deleteMany({});
await Connection.deleteMany({});
await User.deleteMany({});

// hash passwords
const passwordHashA = await bcrypt.hash("aaaaaa", 10);
const passwordHashB = await bcrypt.hash("bbbbbb", 10);
const passwordHashC = await bcrypt.hash("cccccc", 10);

// IMPORTANT: the field name must be passwordHash
const aa = await User.create({ email: "aa@a.com", passwordHash: passwordHashA, displayName: "aa" });
const bb = await User.create({ email: "bb@b.com", passwordHash: passwordHashB, displayName: "bb" });
const cc = await User.create({ email: "cc@c.com", passwordHash: passwordHashC, displayName: "cc" });

// IMPORTANT: field is contactUserId
await Connection.create({ userId: aa._id, contactUserId: bb._id, status: "ACCEPTED" });
await Connection.create({ userId: bb._id, contactUserId: aa._id, status: "ACCEPTED" });

// pending request from cc -> aa
await Connection.create({ userId: cc._id, contactUserId: aa._id, status: "PENDING" });

// IMPORTANT: field is createdByUserId
const dm = await Conversation.create({ type: "DM", createdByUserId: aa._id });

await ConversationUser.create({ conversationId: dm._id, userId: aa._id, role: "OWNER" });
await ConversationUser.create({ conversationId: dm._id, userId: bb._id, role: "MEMBER" });

await Message.create({ conversationId: dm._id, senderUserId: bb._id, body: "Hi aa" });
await Message.create({ conversationId: dm._id, senderUserId: aa._id, body: "Hi bb" });

console.log("Seed complete:");
console.log("Login with aa@a.com / aaaaaa");
console.log("Login with bb@b.com / bbbbbb");
console.log("Login with cc@c.com / cccccc");

process.exit(0);