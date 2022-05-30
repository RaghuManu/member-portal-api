import { User } from "../model/user_db";
import * as bcrypt from "bcrypt";
import { responseStatus } from "../shared/response_status";
import jwt from "jsonwebtoken";
import { key } from "../config/key";
import { options } from "../shared/const_values";
import { Branch } from "../model/branch_db";
import { Designation } from "../model/designation_db";
import { academicConfig } from "../model/academic_config_db";
type branchtype = {
  name: String;
  id: String;
};
type designationtype = {
  name: String;
  id: String;
};
type excelMemberObj = {
  designation: String;
  branch: String;
  scheme: String;
  mobile_number: String;
  role: String;
  email_id: String;
};
export class UserDAO {
  public createUser(userObj: any, session?: any): any {
    try {
      return User.findOne({ login_id: userObj.login_id })
        .then(async (user) => {
          if (user) {
            return {
              status: 409,
              message: responseStatus.user_exist,
            };
          } else {
            let hashPassword = await bcrypt.hash(userObj.password, 10);
            userObj.password = hashPassword;
            let newUserObj = await new User(userObj);
            let newUser: any = await newUserObj.save();
            return {
              status: 200,
              //data: newUser
              data: {
                login_id: newUser.login_id,
                username: newUser.username,
                email_id: newUser.email_id,
                role: newUser.role,
              },
              message: responseStatus.success,
            };
          }
        })
        .catch(async (err) => {
          return {
            status: 500,
            message: responseStatus.error,
            err: err,
          };
        });
    } catch (err) {
      return {
        status: 500,
        message: responseStatus.error,
        err: err,
      };
    }
  }

  public async getAllUsers(skip: number, limit: number): Promise<any> {
    //if(!skip) skip=0;
    //if(!limit) limit=3;
    try {
     let users: any = await User.find(
        { role: { $not: { $regex: /admin/ } } },
        "login_id username designation branch mobile_number mentor email_id user_image_file_path role batch scheme"
      )
        .skip(skip)
        .limit(limit);
      let responseObj = [];
     for (let element of users) {
        let obj: any = {};
        //  if(element.branch){
        let branch: any = await Branch.findById(element.branch);
        /*  let branchObj: branchtype = {
           id: branch["_id"],
           name: branch["name"],
         }; */
        obj.branch = branch["name"];
        //}
        if (element.designation) {
          let designation: any = await Designation.findById(
            element.designation
          );
          /*  let designationObj: designationtype = {
             id: designation["_id"],
             name: designation["name"],
           }; */
          obj.designation = designation["name"];
        }

        if (element.mentor) {
          let mentor: any = await User.findById(element.mentor);
          obj.mentor = mentor["username"];
         /*  let mentor: any = await User.findOne({login_id: element.mentor});
          obj.mentor = mentor["username"]; */
        }

        if (element.scheme) {
          let scheme: any = await academicConfig.findById(element.scheme);
          obj.scheme = scheme["scheme"];
        }
        obj.login_id = element.login_id;
        obj.username = element.username;
        obj.mobile_number = element.mobile_number;
        // obj.mentor = element.mentor;
        obj.email_id = element.email_id;
        obj.user_image_file_path = element.user_image_file_path;
        obj.batch = element.batch;
        obj.scheme = obj.scheme;
        obj.role = element.role;

        responseObj.push(obj);
       }
       const userCount = await this.getUsersCount();
      return {users:responseObj,total_count:userCount};
    } catch (err) {
      throw err;
    }
  }

  public async getUser(
    searchValue: string,
    skip: number,
    limit: number,
    searchOption?: string
  ): Promise<any> {
    let users: any;
    try {
      users = await User.find(
        {
          $or: [
            { login_id: new RegExp(searchValue, "i") },
            { username: new RegExp(searchValue, "i") },
            { batch: new RegExp(searchValue, "i") },
          ],
          role: { $not: { $regex: /admin/ } },
        },
        "login_id username designation branch mobile_number mentor email_id user_image_file_path role batch scheme"
      )
        .skip(skip)
        .limit(limit);

      let responseObj = [];
      for (let element of users) {
        let obj: any = {};
        if (element.branch) {
          obj.branch = element.branch;
        }
        if (element.designation) {
          obj.designation = element.designation;
        }
        obj.login_id = element.login_id;
        obj.username = element.username;
        obj.mobile_number = element.mobile_number;
        obj.mentor = element.mentor;
        obj.email_id = element.email_id;
        obj.user_image_file_path = element.user_image_file_path;
        obj.batch = element.batch;
        obj.scheme = element.scheme;
        obj.role = element.role;

        responseObj.push(obj);
      }
      return { users: responseObj };
    } catch (err) {
      throw err;
    }
  }
  public async getUsersBySearchOption(
    searchValue: string,
    skip: number,
    limit: number,
    searchOption?: string
  ): Promise<any> {
    let users: any;
    try {
      /*   switch (searchOption) {

        case options.usnSearch: users = await User.find({ login_id: new RegExp(searchValue, 'i') });
          break;

        case options.nameSearch: users = await User.find({ username: new RegExp(searchValue, 'i') });
          break;

        case options.batchSearch: users = await User.find({ batch: new RegExp(searchValue, 'i') });
          break;
        default: break;

      } */
      users = await User.find(
        {
          $or: [
            { login_id: new RegExp(searchValue, "i") },
            { username: new RegExp(searchValue, "i") },
            { batch: new RegExp(searchValue, "i") },
          ],
          role: { $not: { $regex: /admin/ } },
        },
        "login_id username designation branch mobile_number mentor email_id user_image_file_path role batch scheme"
      )
        .skip(skip)
        .limit(limit);

      let responseObj = [];
      for (let element of users) {
        let obj: any = {};
        if (element.branch) {
          let branch: any = await Branch.findById(element.branch);
          /*  let branchObj: branchtype = {
             id: branch["_id"],
             name: branch["name"],
           }; */
          obj.branch = branch["name"];
        }
        if (element.designation) {
          let designation: any = await Designation.findById(
            element.designation
          );
          /*  let designationObj: designationtype = {
             id: designation["_id"],
             name: designation["name"],
           }; */
          obj.designation = designation["name"];
        }
        if (element.mentor) {
          let mentor: any = await User.findById(element.mentor);
          obj.mentor = mentor["username"];
        }
        if (element.scheme) {
          let scheme: any = await academicConfig.findById(element.scheme);
          obj.scheme = scheme["scheme"];
        }
        obj.login_id = element.login_id;
        obj.username = element.username;
        obj.mobile_number = element.mobile_number;
        //obj.mentor = element.mentor;
        obj.email_id = element.email_id;
        obj.user_image_file_path = element.user_image_file_path;
        obj.batch = element.batch;
        obj.scheme = obj.scheme;
        obj.role = element.role;

        responseObj.push(obj);
      }

      const userCount = await this.getUsersCount();
      console.log("---user count--------")
      console.log(userCount)
      return { users: responseObj,total_count:userCount };
    } catch (err) {
      throw err;
    }
  }

  public async getUsersByLoginId(login_id: string): Promise<any> {
    let users: any;
    try {
      users = await User.find(
        { login_id: login_id },
        "login_id username designation branch mobile_number mentor email_id user_image_file_path role batch scheme"
      );
      let responseObj = [];
      for (let element of users) {
        let obj: any = {};
        if (element.branch) {
          let branch: any = await Branch.findById(element.branch);
          obj.branch = branch["name"];
        }
        if (element.designation) {
         let designation: any = await Designation.findById(
            element.designation
          );
          obj.designation = designation["name"];
        }
        if (element.mentor) {
          let mentor: any = await User.findById(element.mentor);
          obj.mentor = mentor["username"];
        }
        if (element.scheme) {
          let scheme: any = await academicConfig.findById(element.scheme);
          obj.scheme = scheme["scheme"];
        }
        obj.login_id = element.login_id;
        obj.username = element.username;
        obj.mobile_number = element.mobile_number;
        obj.email_id = element.email_id;
        obj.user_image_file_path = element.user_image_file_path;
        obj.batch = element.batch;
        obj.scheme = obj.scheme;
        obj.role = element.role;
        
        responseObj.push(obj);
      }
      return { users: responseObj };
    } catch (err) {
      throw err;
    }
  }

  public async updateUser(userObj: any): Promise<any> {
    try {
      let userExist = await User.findOne({ login_id: userObj.login_id });
      if (userExist) {
        let userDB = await User.findOneAndUpdate(
          { login_id: userObj.login_id },
          userObj
        );

        return { result: userDB };
      } else {
        return { error: responseStatus.user_not_found };
      }
    } catch (err) {
      throw err;
    }
  }

  public async findUserUsingCredentials(
    login_id: string,
    password: string
  ): Promise<any> {
    try {
      const user: any = await User.findOne({ login_id });
      if (!user) {
        return { error: responseStatus.invalid_credential_error };
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return { error: responseStatus.invalid_credential_error };
      }
      return { result: user };
    } catch (err) {
      throw err;
    }
  }
  public async generateAuthToken(userObj: any): Promise<any> {
    // Generate an auth token for the user
    try {
      userObj.password = undefined;
      const user = userObj;

      const scheme: any = userObj['scheme']?await academicConfig.findById(userObj['scheme']):null;
      const payload = {
        id: userObj._id,
        username: userObj.username,
        login_id: userObj.login_id,
        role: userObj?.role,
        scheme: userObj?.scheme,
        scheme_year: scheme ? scheme['scheme']:null
      };
      const jwtToken = await jwt.sign(payload, key.jwtAuthSecretKey);
      const userTokens = await User.findByIdAndUpdate(
        { _id: user._id },
        { jwt_token: jwtToken },
        { new: true }
      );
      return jwtToken;
    } catch (err) {
      throw err;
    }
  }

  public async logout(id: string): Promise<any> {
    try {
      return await User.findByIdAndUpdate(id, { jwt_token: null });
    } catch (err) {
      throw err;
    }
  }

  public async deleteUser(memberid: string): Promise<any> {
    try {
      let userExist = await User.findOne({ login_id: memberid });
      if (userExist) {
        let userDB = await User.findOneAndDelete({ login_id: memberid });

        return { result: userDB };
      } else {
        return { error: responseStatus.user_not_found };
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateUserProfilePhoto(userObj: any): Promise<any> {
    try {
      let userExist = await User.findOne({ login_id: userObj.login_id });
      if (userExist) {
        let userDB = await User.findOneAndUpdate(
          { login_id: userObj.login_id },
          { user_image_file_path: userObj.user_image_file_path }
        );

        return { result: userDB };
      } else {
        return { error: responseStatus.user_not_found };
      }
    } catch (err) {
      throw err;
    }
  }

  public async updatePassword(
    login_id: string,
    new_password: string
  ): Promise<any> {
    try {
      let userExist = await User.findOne({ login_id: login_id });
      if (userExist) {
        let hashPassword = await bcrypt.hash(new_password, 10);
        let password = hashPassword;
        let userDB = await User.findOneAndUpdate(
          { login_id: login_id },
          { password: password }
        );

        return { result: userDB };
      } else {
        return { error: responseStatus.user_not_found };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getMentors(): Promise<any> {
    try {
      let users = await User.find(
        { role: options.faculty_value },
        "login_id username role"
      );
      return users;
    } catch (err) {
      throw err;
    }
  }


public async getTeamMates(): Promise<any> {
  try {
    let users = await User.find(
      { role: options.studentRole },
      "login_id username role"
    );
    return users;
  } catch (err) {
    throw err;
  }
}

public async getUsersCount(): Promise<any> {
  try {
    let userCount = await User.find(
      { role: { $not: { $regex: /admin/ } } }).countDocuments()
    return userCount;
  } catch (err) {
    throw err;
  }
}
  public async checkExcelData(excelRowData: any): Promise<any> {
    try {
      let errorObj: any[] = [];
      let obj: excelMemberObj = {
        designation: excelRowData.designation,
        branch: excelRowData.branch,
        scheme: excelRowData.scheme,
        role: excelRowData.role,
        mobile_number: excelRowData["mobile number"],
        email_id: excelRowData["email id"],
      };
      //verify designation value
      let designation: any = await Designation.findOne({
        name: obj.designation,
      });
      if (designation) {
        obj.designation = designation["_id"];
      } else {
        // return {error: 'Designation'}
        errorObj.push("Designation value is incorrect");
      }
      //verify branch value
      let branch: any = await Branch.findOne({ name: obj.branch });
      if (branch) {
        obj.branch = branch["_id"];
      } else {
        //  return {error: 'Branch'}
        errorObj.push("Branch value is incorrect");
      }
      //verify scheme value
      let scheme: any = await academicConfig.findOne({ scheme: obj.scheme });

      if (scheme) {
        obj.scheme = scheme["_id"];
      } else {
        //   return {error: 'Scheme'}
        errorObj.push("Scheme value is incorrect");
      }

      //verify role value
      if (!(obj.role.includes("FACULTY") || obj.role.includes("STUDENT"))) {
        //   return {error: 'Role'}
        errorObj.push("Role value is incorrect");
      }

      //verify mobile_number value
      obj.mobile_number = obj.mobile_number.replace(/-/g, "");
      if (obj.mobile_number.length != 10) {
        //   return {error: 'Mobile number'}
        errorObj.push("Mobile number value is incorrect");
      } else {
        obj.mobile_number = "+91" + obj.mobile_number;
      }

      //verify email id value
      if (
        !(
          excelRowData["email id"].toUpperCase().includes("@") ||
          excelRowData["email id"].toUpperCase().includes(".COM") ||
          excelRowData["email id"].toUpperCase().includes(".IN")
        )
      ) {
        //  return {error: 'Email Id'}
        errorObj.push("Email Id value is incorrect");
      }else{
        //check duplicate email id and email id already exist error
        let email_exist:any = await User.findOne({email_id: obj.email_id})
        if(email_exist){
          errorObj.push("Email Id value is already exist");
        }
      }

      if (errorObj.length >= 1) {
        return { error: errorObj.toString() };
      }
      return obj;
    } catch (err) {
      throw err;
    }
  }
}
