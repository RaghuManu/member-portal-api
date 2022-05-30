import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const FacultySubjectSchema = new Schema(
  {
    login_id: {
      type: String,
      required: true,
    },
    student_batch: {
      type: String,
      required: false,
    },
    semister: {
      type: String,
      required: false,
    },
    subject_code: {
      type: String,
      required: true,
    },
    subject_name: {
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
