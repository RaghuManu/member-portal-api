import {
  ContainerTypes,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
} from "express-joi-validation";

type internalObj = {
  max_marks: Number;
  total_exams: Number;
  exam_list: Array<examObj>;
};

type examObj = {
  name: String;
  max_marks: Number;
  total_test: Number;
};

type externalObj = {
  max_marks: Number;
};
//Request body schema used in academic details controller once add academic details api called
export interface AcademicDetailSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    scheme: Number;
    internal: internalObj;
    external: externalObj;
  };
}

export interface getAcademicSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    scheme: string;
  };
}
export interface deleteAcademicSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    scheme: string;
  };
}
