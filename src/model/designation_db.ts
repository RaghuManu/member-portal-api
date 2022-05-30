import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
const DesignationSchema = new Schema(
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

export const Designation = mongoose.model("designation", DesignationSchema);
