import mongoose from "mongoose";
import app from "./app.js";
import env from "./util/validateEnv.js";

const PORT = env.PORT;

mongoose
  .connect(env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("ENV is not set", err);
  });
