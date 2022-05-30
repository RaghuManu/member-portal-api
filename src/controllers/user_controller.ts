import { Request, Response } from "express";
import { UserDAO } from "../dao/user_dao";
import { User } from "../model/user_db";
const xlsxtojson = require("xlsx-to-json-lc");
import { upload, imageUplaod } from "../config/multer.config";
import fs from "fs";
// Use this as a replacement for express.Request
import { ValidatedRequest } from "express-joi-validation";
//import { UserSchema, XlsxUserSchema, BatchSearch, UsnSearch, UserNameSearch } from '../validators/user_validator';
import {
  UserSchema,
  XlsxUserSchema,
  BatchSearch,
  UsnSearch,
  Search,
  UserNameSearch,
  Login,
  UpdateUserSchema,
  DeleteUserSchema,
  ResetPassword,
  Pagination,
  UpdateProfilePhoto,
  UserByLoginId,
} from "../validators/controllervalidators/user_req_schema_validator";
import { responseStatus } from "../shared/response_status";
const userDAO = new UserDAO();
import mongooseConnection from "../config/mongo.config";
import * as bcrypt from "bcrypt";
import { options } from "../shared/const_values";
import { key } from "../config/key";
let CryptoJS = require("crypto-js");

export class UserController {
  public async addNewUserController(
    req: ValidatedRequest<UserSchema>,
    res: Response
  ) {
    let daoResult;
    try {
      let userObj = {
        login_id: req.body.login_id,
        username: req.body.username,
        //password: req.body.password,
        password: req.body.login_id,
        designation: req.body?.designation,
        branch: req.body.branch,
        mobile_number: req.body.mobile_number,
        mentor: req.body?.mentor,
        email_id: req.body.email_id,
        user_image_file_path: req.body?.user_image_file_path,
        role: req.body.role.toUpperCase(),
        batch: req.body?.batch,
        scheme: req.body?.scheme,
      };

      daoResult = await userDAO.createUser(userObj);
      return res.status(200).send(daoResult);
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      if (!req.query.skip) req.query.skip = 0;
      if (!req.query.limit) req.query.limit = 10;
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      let daoResult = await userDAO.getAllUsers(skip, limit);

      return res.status(200).send({
        status: 200,
        data: daoResult,
        message: responseStatus.success,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async uploadMembers(req: Request, res: Response) {
    try{
    upload(req, res, async (err) => {
      if (err) {
        res.json({ error_code: 1, err_desc: err });
        throw err;
      }
      if (req.file) {
        await xlsxtojson(
          { input: req.file.path, output: null, lowerCaseHeaders: true },
          async (err: any, result: any) => {
            if (err) {
              throw err;
            } else {
              let jsonResultofExcel: any[] = await result;
              await fs.unlinkSync(req.file.path);
              let rownum: number = 1;
              let validJsonDataArray: any[] = [];
              let xlsxErrorObj: any[] = [];
              let errorResponse: any[] = [];
              for (const excelRowData of jsonResultofExcel) {
                rownum++;
                let errResObj :any;
                let errorMsg: String =
                  "Please correct the errors in " + rownum + " row contains ";
                if (
                  excelRowData["usn"] &&
                  excelRowData["user name"] &&
                  excelRowData["designation"] &&
                  excelRowData["branch"] &&
                  excelRowData["mobile number"] &&
                  excelRowData["role"] &&
                  excelRowData["batch"] &&
                  excelRowData["scheme"]
                ) {
                  let daoResult = await userDAO.checkExcelData(excelRowData);
                  if (daoResult.error) {
                    errResObj = {};
                    errResObj.row = rownum;
                    errResObj.msg = '';
                    errResObj.msg = errResObj.msg + daoResult.error;
                    errorResponse.push(errResObj)
                    xlsxErrorObj.push(errorMsg + daoResult.error + " columns");
                  } else {
                    let userObj = {
                      login_id: excelRowData["usn"],
                      username: excelRowData["user name"],
                      password: excelRowData["usn"],
                      designation: daoResult.designation,
                      branch: daoResult.branch,
                      mobile_number: daoResult.mobile_number,
                      mentor: excelRowData["mentor"],
                      email_id: daoResult.email_id,
                      role: daoResult.role.toUpperCase(),
                      batch: excelRowData["batch"],
                      scheme: daoResult.scheme,
                    };
                    validJsonDataArray.push(userObj);
                  }
                } else {
                  if(!(excelRowData["usn"] &&
                    excelRowData["user name"] &&
                    excelRowData["designation"] &&
                    excelRowData["branch"] &&
                    excelRowData["mobile number"] &&
                    excelRowData["role"] &&
                    excelRowData["batch"] &&
                    excelRowData["scheme"] )
                  ){
                  //ignoring all empty values
                  }else{
                  errResObj = {};
                  errResObj.row = rownum;
                  errResObj.msg = errResObj.msg + '';
                  let errorObj: any[] = [];
                  if (!excelRowData["usn"]) {

                    errorObj.push("USN is empty");
                  }
                  if (!excelRowData["user name"]) {
                    errorObj.push("User Name is empty");
                  }
                  if (!excelRowData["designation"]) {
                    errorObj.push("Designation is empty");
                  }
                  if (!excelRowData["branch"]) {
                    errorObj.push("Branch is empty");
                  }
                  if (!excelRowData["mobile number"]) {
                    errorObj.push("Mobile Number is empty");
                  }
                  if (!excelRowData["role"]) {
                    errorObj.push("Role is empty");
                  }
                  if (!excelRowData["batch"]) {
                    errorObj.push("Batch is empty");
                  }
                  if (!excelRowData["scheme"]) {
                    errorObj.push("Scheme is empty");
                  }
                  errResObj.msg = errorObj.toString();
                  xlsxErrorObj.push(errorMsg + errorObj.toString());
                  errorResponse.push(errResObj)
                }
              }
              }

              if (xlsxErrorObj.length >= 1) {
                //return excel sheet with these errors
                return res.status(400).send({
                  status: 400,
                  message: errorResponse
                });
                
              } else {
                try{
                for (let member of validJsonDataArray) {
                  if(member['mentor']){
                    let mentor:any = await User.findOne({login_id: member.mentor});
                     member['mentor'] = mentor['_id']
                  }
                  let hashPassword = await bcrypt.hash(
                    member.password,
                    10
                  );
                  member.password = hashPassword;
                  let userUpdatedObj = await User.findOneAndUpdate(
                    { login_id: member.login_id },
                    member
                  );
                  if (!userUpdatedObj) {
                    let newUserObj = await new User(member);
                    let newUser = await newUserObj.save();
                  }
                }
              
                return res.status(200).send({
                  status: 200,
                  message: responseStatus.members_upload_success,
                });
              }catch(err){
                return res.status(500).send({
                  status: 500,
                  message: responseStatus.error,
                  err: err,
                });
              }
                
              }
            }
          }
        );
      }
    });

  
  }catch(err){
  
    return res.status(500).send({
      status: 500,
      message: responseStatus.error,
      err: err,
    });
  }
  }

  //method to get the users using usn,batch,name
  public async getUserBySearchValue(
    req: ValidatedRequest<Search>,
    res: Response
  ) {
    try {
      let searchValue = req.params.searchvalue;
      if (!req.query.skip) req.query.skip = 0;
      if (!req.query.limit) req.query.limit = 10;
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      let daoResult = await userDAO.getUsersBySearchOption(
        searchValue,
        skip,
        limit
      );

      return res.status(200).send({
        status: 200,
        data: daoResult.users,
        message: responseStatus.success,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  //method to get the users using LoginId
  public async getUserByLoginId(
    req: ValidatedRequest<UserByLoginId>,
    res: Response
  ) {
    try {
      let loginid = req.params.loginid;
      let daoResult = await userDAO.getUsersByLoginId(loginid);

      return res.status(200).send({
        status: 200,
        data: daoResult.users,
        message: responseStatus.success,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  //method to get the users using usn
  public async getUserByUsn(req: ValidatedRequest<UsnSearch>, res: Response) {
    try {
      let usn = req.params.usn;
      if (!req.query.skip) req.query.skip = 0;
      if (!req.query.limit) req.query.limit = 10;
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      let daoResult = await userDAO.getUser(
        usn,
        skip,
        limit,
        options.usnSearch
      );

      return res.status(200).send({
        status: 200,
        data: daoResult.users[0],
        message: responseStatus.success,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }
  //method to get the users using userName
  public async getUserByName(
    req: ValidatedRequest<UserNameSearch>,
    res: Response
  ) {
    try {
      let userName = req.params.userName;
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      let daoResult = await userDAO.getUsersBySearchOption(
        userName,
        skip,
        limit,
        options.nameSearch
      );

      return res.status(200).send({
        status: 200,
        data: daoResult,
        message: responseStatus.success,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }
  //method to get the users using batch
  public async getUserByBatch(
    req: ValidatedRequest<BatchSearch>,
    res: Response
  ) {
    try {
      let batch = req.params.batch;
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      let daoResult = await userDAO.getUsersBySearchOption(
        batch,
        skip,
        limit,
        options.batchSearch
      );

      return res.status(200).send({
        status: 200,
        data: daoResult,
        message: responseStatus.success,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async updateUser(
    req: ValidatedRequest<UpdateUserSchema>,
    res: Response
  ) {
    try {
      let userObj = {
        login_id: req.body.login_id,
        username: req.body.username,
        designation: req.body?.designation,
        branch: req.body.branch,
        mobile_number: req.body.mobile_number,
        mentor: req.body?.mentor,
        email_id: req.body.email_id,
        user_image_file_path: req.body?.user_image_file_path,
        role: req.body.role,
        batch: req.body?.batch,
        scheme: req.body?.scheme,
      };
      let daoResult = await userDAO.updateUser(userObj);
      if (daoResult.result) {
        return res.status(200).send({
          status: 200,
          message: responseStatus.success,
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: daoResult.error,
        });
      }
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async login(req: ValidatedRequest<Login>, res: Response) {
    try {
      let login_id = req.body.login_id;
      let password = req.body.password;
      let bytes = CryptoJS.AES.decrypt(password, key.cryptoKey);
      password = bytes.toString(CryptoJS.enc.Utf8);
      let jwtToken;
      let daoResult = await userDAO.findUserUsingCredentials(
        login_id,
        password
      );
      if (daoResult.result) {
        daoResult.result.password = undefined;
        if (daoResult.result.jwt_token) {
          jwtToken = daoResult.result.jwt_token;
          daoResult.result.jwt_token = undefined;
          return res.status(200).send({
            status: 200,
            data: daoResult.result,
            token: jwtToken,
            message: responseStatus.success,
          });
        }

        jwtToken = await userDAO.generateAuthToken(daoResult.result);
        if (jwtToken) {
          daoResult.result.jwt_token = undefined;
          return res.status(200).send({
            status: 200,
            data: daoResult.result,
            token: jwtToken,
            message: responseStatus.success,
          });
        } else {
          return res.status(400).send({
            status: 400,
            message: responseStatus.jwt_token_error,
          });
        }
      } else {
        return res.status(400).send({
          status: 400,
          message: daoResult.error,
        });
      }
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async logout(req: any, res: Response) {
    try {
      let id = req.user.id;
      let daoResult = await userDAO.logout(id);
      return res.status(200).send({
        status: 200,
        data: daoResult.result,
        message: responseStatus.success,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async deleteUser(
    req: ValidatedRequest<DeleteUserSchema>,
    res: Response
  ) {
    try {
      let memberid = req.params.memberid;

      let daoResult = await userDAO.deleteUser(memberid);
      if (daoResult.result) {
        return res.status(200).send({
          status: 200,
          message: responseStatus.success,
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: daoResult.error,
        });
      }
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async uploadUserProfile(
    req: ValidatedRequest<UpdateProfilePhoto>,
    res: Response
  ) {
    try {
      let userObj = {
        user_image_file_path: req.body.user_image_file_path,
        login_id: req.body.login_id,
      };
      let daoResult = await userDAO.updateUserProfilePhoto(userObj);
      if (daoResult.result) {
        return res.status(200).send({
          status: 200,
          message: responseStatus.success,
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: daoResult.error,
        });
      }
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async resetPassword(
    req: ValidatedRequest<ResetPassword>,
    res: Response
  ) {
    try {
      let login_id = req.body.login_id;
      let new_password = req.body.new_password;
      let bytes = CryptoJS.AES.decrypt(new_password, key.cryptoKey);
      new_password = bytes.toString(CryptoJS.enc.Utf8);
      let daoResult = await userDAO.updatePassword(login_id, new_password);

      if (daoResult.result) {
        return res.status(200).send({
          status: 200,
          message: responseStatus.success,
        });
      } else {
        return res.status(400).send({
          status: 400,
          message: daoResult.error,
        });
      }
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

  public async getMentors(req: Request, res: Response) {
    try {
      let daoResult = await userDAO.getMentors();
      return res.status(200).send({
        status: 200,
        message: responseStatus.success,
        data: daoResult,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

 
  public async getTeamMates(req: Request, res: Response) {
    try {
      let daoResult = await userDAO.getTeamMates();
      return res.status(200).send({
        status: 200,
        message: responseStatus.success,
        data: daoResult,
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }

}
