import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ProjectsSchema = new Schema(
  {
    student_id: {
      type: String,
      required: true,
      unique: true,
    },
    projects: [
      {
        project_photo_path: {
          type: Array,
          required: true,
        },
        project_title: {
          type: String,
          required: true,
        },
        project_guide: {
          type: String,
          required: true,
        },
        project_members: {
          type: Array,
          required: true,
        },
        project_cost: {
          type: String,
          required: true,
        },
        project_duration: {
          type: String,
          required: true,
        },
        project_semister: {
          type: String,
          required: false,
        },
        project_description: {
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

export const Project = mongoose.model("projects", ProjectsSchema);
