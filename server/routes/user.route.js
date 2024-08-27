import express from "express";
import {
  getAuthenticatedUser,
  login,
  logOut,
  signUp,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getAuthenticatedUser);

router.post("/signup", signUp);

router.post("/login", login);

router.post("/logout", logOut);

export default router;
