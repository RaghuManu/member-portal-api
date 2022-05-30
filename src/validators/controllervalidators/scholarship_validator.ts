import {
  ContainerTypes,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
} from "express-joi-validation";

type scholarshipObj = {
  _id: String;
  sanctioned_date: Date;
  application_no: String;
 /*  sanctioned_year: Number;
  resource_file_path: String; */
  particulars: String;
  sanctioned_amount: Number;
  certification_file_path: String;
};

export interface AddScholarship extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    student_id: String;
    sanctioned_date: Date;
    application_no: String;
  /*   sanctioned_year: Number;
    resource_file_path: String; */
    particulars: String;
    sanctioned_amount: Number;
    certification_file_path: String;
  };
}

export interface getAllScholarship extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    student_id: string
  };
}

export interface updateScholarship extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    student_id: String;
    scholarship: scholarshipObj;
  };
}

export interface getScholarship extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    scholarshipid: string;
  };
}

export interface deleteScholarship extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    scholarshipid: string;
  };
}
