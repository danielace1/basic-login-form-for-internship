import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: 6,
      maxlength: 30,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 100,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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
