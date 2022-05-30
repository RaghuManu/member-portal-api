import * as Joi from "@hapi/joi";

//validation check once add academic details api called
const academicConfigSchema = Joi.object({
  scheme: Joi.number().required(),
  internal: Joi.object().required(),
  external: Joi.object().required(),
});

const getAcademicConfig = Joi.object({
  scheme: Joi.number().required(),
});
const deleteAcademicConfig = Joi.object({
  scheme: Joi.number().required(),
});
export const academicConfigValidator = {
  academicConfigSchema: academicConfigSchema,
  getAcademicConfig: getAcademicConfig,
  deleteAcademicConfig: deleteAcademicConfig,
};
