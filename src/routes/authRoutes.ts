import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ email, passwordHash });

  res.send({ message: "registered", userId: user._id });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.redirect("/login?err=invalid");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.redirect("/login?err=invalid");

  const token = jwt.sign(
    { userId: user._id.toString(), email },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.redirect("/profile");
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;