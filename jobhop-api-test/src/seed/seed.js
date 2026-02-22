import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Connection } from "../models/Connection.js";
import { Conversation } from "../models/Conversation.js";
import { ConversationUser } from "../models/ConversationUser.js";
import { Message } from "../models/Message.js";

await connectDb(process.env.MONGO_URI);

await Message.deleteMany({});
await ConversationUser.deleteMany({});
await Conversation.deleteMany({});
await Connection.deleteMany({});
await User.deleteMany({});

const passwordHash = await bcrypt.hash("password", 10);

const arash = await User.create({ email: "arash@example.com", passwordHash, displayName: "Arash" });
const sara  = await User.create({ email: "sara@example.com",  passwordHash, displayName: "Sara" });
const ali   = await User.create({ email: "ali@example.com",   passwordHash, displayName: "Ali" });

await Connection.create({ userId: arash._id, contactId: sara._id, status: "ACCEPTED" });
await Connection.create({ userId: sara._id,  contactId: arash._id, status: "ACCEPTED" });
await Connection.create({ userId: arash._id, contactId: ali._id, status: "PENDING" });

const dm = await Conversation.create({ type: "DM", createdByUserId: arash._id });
await ConversationUser.create({ conversationId: dm._id, userId: arash._id, role: "OWNER" });
await ConversationUser.create({ conversationId: dm._id, userId: sara._id, role: "MEMBER" });

await Message.create({ conversationId: dm._id, senderUserId: arash._id, body: "Hello Sara" });
await Message.create({ conversationId: dm._id, senderUserId: sara._id, body: "Hi Arash" });

console.log("Seeded.");
process.exit(0);