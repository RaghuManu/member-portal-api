import {
  ContainerTypes,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
} from "express-joi-validation";

type activityObj = {
  _id: String;
  event_type: String;
  event_name: String;
  event_date: String;
  event_venue: String;
  event_result: String;
  semister: String;
  certification_file_path: String;
};

export interface AddExtraActivity extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    student_id: String;
    event_type: String;
    event_name: String;
    event_date: Date;
    event_venue: String;
    event_result: String;
    semister: String;
    certification_file_path: String;
  };
}
export interface getExtraActivity extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    student_id: string;
  };
}
export interface updateExtraActivity extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    student_id: String;
    activity: activityObj;
  };
}

export interface deleteExtraActivity extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    activityid: string;
  };
}
