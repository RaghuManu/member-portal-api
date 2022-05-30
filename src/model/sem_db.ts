import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
const SemSchema = new Schema(
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

export const Sem = mongoose.model("sem", SemSchema);
