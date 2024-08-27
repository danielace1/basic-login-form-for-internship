import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";

// get authenticated user
export const getAuthenticatedUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// signup
export const signUp = async (req, res, next) => {
  const username = req.body.username;
  const passwordRaw = req.body.password;

  try {
    if (!username || !passwordRaw) {
      throw createHttpError(404, "Missing Params");
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

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// login
export const login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(404, "Missing Params");
    }

    const user = await UserModel.findOne({ username: username }).select(
      "+password"
    );

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// forgot password
export const changePassword = async (req, res, next) => {
  const { username, newPassword } = req.body;

  try {
    if (!username || !newPassword) {
      throw createHttpError(404, "Missing Params");
    }

    const user = await UserModel.findOne({ username }).select("+password");

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Hash the new password
    const passwordHashed = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = passwordHashed;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// logout
export const logOut = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(200);
    }
  });
};
