import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    login_id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: false,
    },
    branch: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
    mentor: {
      type: String,
      required: false,
    },
    email_id: {
      type: String,
      required: false,
      unique: true,
    },
    user_image_file_path: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: false,
    },
    scheme: {
      type: String,
      required: false,
    },
    jwt_token: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

//const userSchema = new Schema(UserSchema);

export const User = mongoose.model("user", UserSchema);
