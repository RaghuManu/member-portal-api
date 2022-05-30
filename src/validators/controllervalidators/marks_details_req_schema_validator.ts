import {
  ContainerTypes,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
} from "express-joi-validation";

//Request body schema used in academic details controller once add academic details api called
type marksObj = {
  subject: Object;
  internals: Object;
  external: Object;
  total: Object;
};
export interface MarksDetailSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    student_id: string;
    sem: Number;
    marks: Array<marksObj>;
  };
}

export interface StudentMarksSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    student_id: string;
    sem: Number;
  };
}

export interface StudentGradeSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    student_id: string;
  };
}
