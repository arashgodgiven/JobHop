import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function toAuthTokenResponse(user, token) {
  return {
    token,
    id: String(user._id),
    email: user.email,
    displayName: user.displayName
  };
}

function signToken(user) {
  const minutes = Number(process.env.JWT_EXPIRES_MINUTES || "240");
  const expiresInSeconds = minutes * 60;

  return jwt.sign(
    { userId: String(user._id) },
    process.env.JWT_SECRET,
    { subject: user.email, expiresIn: expiresInSeconds }
  );
}

export async function register(req, res, next) {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, displayName });

    const token = signToken(user);
    return res.json(toAuthTokenResponse(user, token));
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json(toAuthTokenResponse(user, token));
  } catch (err) {
    next(err);
  }
}