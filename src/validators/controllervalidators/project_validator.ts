import {
    ContainerTypes,
    // Extend from this to define a valid schema type/interface
    ValidatedRequestSchema,
  } from "express-joi-validation";
  
import {memberObj,ProjectType,projectObjType} from '../../shared/types'; 
 
  
  export interface AddProject extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
      student_id: String;
      project_photo_path:Array<String>
      project_title: String;
      project_guide: String;
      project_members: Array<memberObj>;
      project_cost: String;
      project_duration: String;
      project_semister: String;
      project_description:String
    };
  }
  
  export interface getAllProject extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
      student_id: string;
    };
  }
  
  export interface updateProject extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
      student_id: String;
      project: projectObjType;
    };
  }
  
  export interface getProject extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
      student_id: string;
      projectid: string;
    };
  }
  
  export interface deleteProject extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
      projectid: string;
      student_id: string;
    };
  }
  