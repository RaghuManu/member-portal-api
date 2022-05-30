import * as Joi from "@hapi/joi";


const addProject = Joi.object({
  student_id: Joi.string().required(),
  project_title: Joi.string().required(),
  project_guide: Joi.string().required(),
  project_members: Joi.array().items(Joi.string().required()).required(),
  project_cost: Joi.string().required(),
  project_duration: Joi.string().required(),
  project_semister: Joi.string().required(),
  project_description: Joi.string().required(),
  project_photo_path: Joi.array().items(Joi.string().required()).required()
});
const getAllProject = Joi.object({
  student_id: Joi.string().required()
});

const updateProject = Joi.object({
  student_id: Joi.string().required(),
  project: Joi.object().required(),
});

const deleteProject = Joi.object({
  student_id: Joi.string().required(),
  projectid: Joi.string().required(),
});
const getProject = Joi.object({
  projectid: Joi.string().required(),
  student_id: Joi.string().required(),
});
export const projectValidator = {
  addProject: addProject,
  getAllProject: getAllProject,
  updateProject: updateProject,
  deleteProject: deleteProject,
  getProject: getProject,
};
