import * as Joi from "@hapi/joi";

const addScholarship = Joi.object({
  student_id: Joi.string().required(),
  sanctioned_date: Joi.date().required(),
  application_no: Joi.string().required(),
 /*  sanctioned_year: Joi.string().required(),
  resource_file_path: Joi.string().required(), */
  particulars: Joi.string().required(),
  sanctioned_amount: Joi.number().required(),
  certification_file_path: Joi.string().required(),
});
const getAllScholarship = Joi.object({
  student_id: Joi.string().required(),
});

const updateScholarship = Joi.object({
  student_id: Joi.string().required(),
  scholarship: Joi.object().required(),
});

const deleteScholarship = Joi.object({
  scholarshipid: Joi.string().required(),
});
const getScholarShip = Joi.object({
  scholarshipid: Joi.string().required(),
});
export const scholarshipValidator = {
  addScholarship: addScholarship,
  getAllScholarship: getAllScholarship,
  updateScholarship: updateScholarship,
  deleteScholarship: deleteScholarship,
  getScholarShip: getScholarShip,
};
