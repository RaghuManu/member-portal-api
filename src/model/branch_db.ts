import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
const BranchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const Branch = mongoose.model("branch", BranchSchema);
