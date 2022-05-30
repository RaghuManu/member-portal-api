import * as mongoose from "mongoose";
const Schema = mongoose.Schema;
const AcademicConfigSchema = new Schema(
  {
    scheme: {
      type: String,
      required: true,
      unique: true,
    },
    internal: {
      max_marks: {
        type: Number,
        required: true,
      },
      total_exams: {
        type: Number,
        required: true,
      },
      exam_list: [
        {
          name: {
            type: String,
            required: true,
          },
          max_marks: {
            type: Number,
            required: true,
          },
          total_test: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    external: {
      max_marks: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const academicConfig = mongoose.model(
  "academic_config",
  AcademicConfigSchema
);
