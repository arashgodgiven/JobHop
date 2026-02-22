import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, maxlength: 255 },
    passwordHash: { type: String, required: true, maxlength: 255 },
    displayName: { type: String, required: true, maxlength: 120 }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const User = mongoose.model("User", userSchema);