import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";

export const signUp = async (req, res, next) => {
  const username = req.body.username;
  const passwordRaw = req.body.password;
  try {
    if (!username || !passwordRaw) {
      throw createHttpError(404, "Invalid username or password");
    }
    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      throw createHttpError(
        409,
        "User already exists. Please login or create a new one."
      );
    }
    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      password: passwordHashed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
