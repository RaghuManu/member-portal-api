import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const ScholarshipSchema = new Schema(
  {
    student_id: {
      type: String,
      required: true,
      ref: "users",
      index: true,
      unique: true,
    },
    scholarship: [
      {
        sanctioned_date: {
          type: Date,
          required: true,
        },
        application_no: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
       /*  sanctioned_year: {
          type: String,
          required: true,
        },
        resource_file_path: {
          type: String,
          required: true,
        }, */
        particulars: {
          type: String,
          required: true,
        },
        sanctioned_amount: {
          type: String,
          required: false,
        },
        certification_file_path: {
          type: String,
          required: false,
        },
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
export const Scholarship = mongoose.model(
  "scholarship_detail",
  ScholarshipSchema
);
