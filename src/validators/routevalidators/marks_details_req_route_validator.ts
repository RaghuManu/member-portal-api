import * as Joi from "@hapi/joi";

//validation check once add academic details api called
const marksDetailsSchemaValidator = Joi.object({
  student_id: Joi.string().required(),
  sem: Joi.number().required(),
  marks: Joi.array(),
});

const getStudentMarksSchema = Joi.object({
  student_id: Joi.string().required(),
  sem: Joi.number().required(),
});
const getStudentGrades = Joi.object({
  student_id: Joi.string().required()
});
export const marksValidator = {
  marksDetailsSchemaValidator: marksDetailsSchemaValidator,
  getStudentMarksSchema: getStudentMarksSchema,
  getStudentGrades: getStudentGrades
};
