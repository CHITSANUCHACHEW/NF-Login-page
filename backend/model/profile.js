import mongoose from "mongoose";

const userProfileSchema = mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    Phone: {
      type: String,
      required: true,
    },
    Password: {
      iv: String,
      encrpyText: String,
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("account", userProfileSchema);

export default Account;
