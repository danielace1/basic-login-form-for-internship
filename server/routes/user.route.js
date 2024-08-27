import express from "express";
import {
  changePassword,
  getAuthenticatedUser,
  login,
  logOut,
  signUp,
} from "../controllers/user.js";
import { requiresAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requiresAuth, getAuthenticatedUser);

router.post("/signup", signUp);

router.post("/login", login);

router.post("/change-password", changePassword);

router.post("/logout", logOut);

export default router;
