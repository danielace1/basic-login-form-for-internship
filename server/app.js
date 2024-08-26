import express from "express";
import cors from "cors";
import "dotenv/config";
import createHttpError, { isHttpError } from "http-errors";
import router from "./routes/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());

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

  if (isHttpError(error)) {
    statusCode = error.status;
    errMsg = error.message;
  }

  res.status(statusCode).json({ error: errMsg });
});

export default app;
