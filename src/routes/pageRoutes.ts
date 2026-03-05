import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", (req, res) => res.render("home"));

router.get("/login", (req, res) => {
  const err = req.query.err;
  res.render("login", { err });
});

router.get("/profile", requireAuth, (req: AuthRequest, res: Response) => {
  res.render("profile", { user: req.user });
});

export default router;