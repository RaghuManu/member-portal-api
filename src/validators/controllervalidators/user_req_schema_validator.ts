import {
  ContainerTypes,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
} from "express-joi-validation";

//Request body schema used in user controller once add member api called
export interface UserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login_id: string;
    username: string;
   /*  password: string; */
    designation: string;
    branch: string;
    mobile_number: string;
    email_id: string;
    batch: string;
    mentor: string;
    user_image_file_path: string;
    role: string;
    scheme: string;
  };
}

//Request body schema used in user controller once upload member api called
export interface XlsxUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Fields]: {
    usn: string;
    username: string;
    designation: string;
    branch: string;
    mobile_number: string;
    email_id: string;
    batch: string;
    mentor: string;
    user_image_file_path: string;
    role: string;
    scheme: string;
  };
}

//Request Params schema used in user controller once getuserbyusn api called
export interface UsnSearch extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    usn: string;
  };
}

//Request Params schema used in user controller once getuserbySearch api called
export interface Search extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    searchvalue: string;
  };
}

//Request Params schema used in user controller once getUserByLoginId api called
export interface UserByLoginId extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    loginid: string;
  };
}

//Request Params schema used in user controller once getuserbybatch api called
export interface BatchSearch extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    batch: string;
  };
}

//Request Body schema used in user controller once image api called

export interface UpdateProfilePhoto extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login_id: string;
    user_image_file_path: string;
  };
}

//Request Params schema used in user controller once getuserbyname api called
export interface UserNameSearch extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    userName: string;
  };
}

//Request Body schema used in user controller once login api called

export interface Login extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login_id: string;
    password: string;
  };
}

//Request body schema used in user controller once updateuser api called
export interface UpdateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login_id: string;
    username: string;
    designation: string;
    branch: string;
    mobile_number: string;
    email_id: string;
    batch: string;
    mentor: string;
    user_image_file_path: string;
    role: string;
    scheme: string;
  };
}

//Request Body schema used in user controller once deleteuser api called

export interface DeleteUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    memberid: string;
  };
}
//Request Body schema used in user controller once resetpassword api called
export interface ResetPassword extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login_id: string;
    /*  current_password: string, */
    new_password: string;
  };
}

//pagination schema

export interface Pagination extends ValidatedRequestSchema {
  [ContainerTypes.Query]:{
    skip:number;
    limit:number
  }
}
