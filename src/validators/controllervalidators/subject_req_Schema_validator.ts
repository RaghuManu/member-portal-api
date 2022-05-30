import {
  ContainerTypes,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
} from "express-joi-validation";

//Request Body schema used in user controller once login api called
export interface SubjectSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    subject_code: string;
    subject_name: string;
    scheme:string[];
    branch:string[];
    sem:string

  };
}

export interface UpdateSubjectSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    subject_code: string;
    subject_name: string;
    scheme:string[];
    branch:string[];
    sem:string
  };
}

export interface DeleteSubjectSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    subjectcode: string;
  };
}

//pagination schema

export interface Pagination extends ValidatedRequestSchema {
  [ContainerTypes.Query]:{
    skip:number;
    limit:number
  }
}
