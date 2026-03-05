"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const router = (0, express_1.Router)();
// Register
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = await user_1.User.create({ email, passwordHash });
    res.send({ message: "registered", userId: user._id });
});
// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await user_1.User.findOne({ email });
    if (!user)
        return res.redirect("/login?err=invalid");
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.redirect("/login?err=invalid");
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email }, process.env.JWT_SECRET, { expiresIn: "2h" });
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
exports.default = router;
