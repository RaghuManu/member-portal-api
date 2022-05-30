import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const MarksDetailSchema = new Schema(
  {
    student_id: {
      type: String,
      required: true,
      ref: "users",
      unique: true,
    },
    academic_details: [
      {
        sem: {
          type: Number,
          required: true,
        },

        marks: [],
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const marksDetail = mongoose.model("marks_detail", MarksDetailSchema);
