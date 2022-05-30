import * as Joi from "@hapi/joi";

//validation check once add extra activities  api called
const addExtraActivity = Joi.object({
  student_id: Joi.string().required(),
  event_type: Joi.string().required(),
  event_name: Joi.string().required(),
  event_date: Joi.date().required(),
  event_venue: Joi.string().required(),
  event_result: Joi.string().required(),
  semister: Joi.string().required(),
  certification_file_path: Joi.string().required(),
});

const getExtraActivity = Joi.object({
  student_id: Joi.string().required(),
});

const updateExtraActivity = Joi.object({
  student_id: Joi.string().required(),
  activity: Joi.object().required(),
});
const deleteExtraActivity = Joi.object({
  activityid: Joi.string().required(),
});

export const extraActivityValidator = {
  addExtraActivitySchema: addExtraActivity,
  getExtraActivity: getExtraActivity,
  updateExtraActivity: updateExtraActivity,
  deleteExtraActivity: deleteExtraActivity,
};
