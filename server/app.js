import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import router from "./routes/user.route.js";
import env from "./util/validateEnv.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://basic-login-form-for-internship-client.vercel.app",
      "http://127.0.0.1:5500", // ignore this
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGODB_CONNECTION_URL,
    }),
  })
);

app.get("/", (req, res) => {
  const jsonResponse = {
    message: "Welcome to the API for basic login auth for internship",
    endpoints: {
      users: "/api/users",
    },
  };
  res.json(jsonResponse);
});

app.use("/api/users", router);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found!"));
});

app.use((error, req, res, next) => {
  console.error(error);
  let errMsg = "An unknown error occurred";
  let statusCode = 500;

  // Check if the error is a Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    errMsg = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
  } else if (isHttpError(error)) {
    // For other HTTP errors
    statusCode = error.status;
    errMsg = error.message;
  }

  res.status(statusCode).json({ error: errMsg });
});

export default app;
