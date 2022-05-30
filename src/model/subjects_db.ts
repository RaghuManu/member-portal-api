import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const SubjectsSchema = new Schema(
  {
    subject_code: {
      type: String,
      required: true,
      unique: true,
    },
    subject_name: {
      type: String,
      required: true,
    },
    scheme:[],
    branch:[],
    sem: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const Subject = mongoose.model("subject", SubjectsSchema);
