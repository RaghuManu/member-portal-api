import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export const ExtraActivitiesSchema = new Schema(
  {
    student_id: {
      type: String,
      required: true,
      ref: "users",
    },
    extra_activities: [
      {
        event_type: {
          type: String,
          required: true, //Fest
        },
        event_name: {
          type: String,
          required: true, //Ananya
        },
        event_date: {
          type: Date,
          required: true, //
        },
        event_venue: {
          type: String,
          required: true, //KSIT
        },

        event_result: {
          type: String,
          required: true,
        },
        semister: {
          type: String,
          required: true,
        },
        certification_file_path: {
          type: String,
          required: true,
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

export const ExtraActivities = mongoose.model(
  "extra_activities",
  ExtraActivitiesSchema
);
