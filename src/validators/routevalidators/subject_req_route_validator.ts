import * as Joi from "@hapi/joi";
import { types } from "@hapi/joi";

//validation check once login api called
const subjectSchemaValidator = Joi.object({
  subject_code: Joi.string().required(),
  subject_name: Joi.string().required(),
  scheme:Joi.array().items(Joi.string().required()).required(),
  branch:Joi.array().items(Joi.string().required()).required(),
  sem:Joi.string().required()
});

const updateSubjectValidator = Joi.object({
  subject_code: Joi.string().required(),
  subject_name: Joi.string().required(),
  scheme:Joi.array().items(Joi.string().required()).required(),
  branch:Joi.array().items(Joi.string().required()).required(),
  sem:Joi.string().required()
});

const deleteSubjectValidator = Joi.object({
  subjectcode: Joi.string().required(),
});

//validation for pagination

const paginationValidator = Joi.object({
  skip:Joi.number().required(),
  limit:Joi.number().required()
})
export const subjectValidators = {
  subjectSchemaValidator: subjectSchemaValidator,
  updateSubjectValidator: updateSubjectValidator,
  deleteSubjectValidator: deleteSubjectValidator,
  paginationValidator:paginationValidator
};


