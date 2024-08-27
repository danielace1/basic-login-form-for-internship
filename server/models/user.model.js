import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [30, "Username must be at most 30 characters long"],
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      minLength: [8, "Password must be at least 8 characters long"],
      maxLength: [100, "Password must be at most 100 characters long"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]*$/,
        "Password must have at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long",
      ],
      select: false,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
