import { Request, Response } from "express";
const xlsxtojson = require("xlsx-to-json-lc");
import { upload, imageUplaod } from "../config/multer.config";
import fs from "fs";
// Use this as a replacement for express.Request
import { ValidatedRequest } from "express-joi-validation";
import {
  SubjectSchema,
  UpdateSubjectSchema,
  DeleteSubjectSchema,
  Pagination
} from "../validators/controllervalidators/subject_req_Schema_validator";
import { responseStatus } from "../shared/response_status";
import mongooseConnection from "../config/mongo.config";
import { SubjectDAO } from "../dao/subjects_dao";
import { Subject } from "../model/subjects_db";
const subjectDAO = new SubjectDAO();
export class SubjectController {
  public async addNewSubjectController(
    req: ValidatedRequest<SubjectSchema>,
    res: Response
  ) {
    try {
      let subjectObj = {
        subject_code: req.body.subject_code,
        subject_name: req.body.subject_name,
        scheme: req.body.scheme,
        branch: req.body.branch,
        sem: req.body.sem,
      };
      let daoResult = await subjectDAO.createSubject(subjectObj);

      if (daoResult.result) {
        return res.status(200).send({
          status: 200,
          data: daoResult.result,
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

  public async getSubjectController(req: Request, res: Response) {
    try {
      if (!req.query.skip) req.query.skip = 0;
      if (!req.query.limit) req.query.limit = 10;
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      let daoResult = await subjectDAO.getSubjects(skip, limit);

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

  public async uploadAllSubject(req: Request, res: Response) {
    try {
      upload(req, res, async (err) => {
        try {
          if (err) {
            res.json({ error_code: 1, err_desc: err });
            throw err;
          }
          if (req.file) {
            await xlsxtojson(
              {
                input: req.file.path,
                output: null,
                lowerCaseHeaders: true,
              },
              async (err: any, result: any) => {
                if (err) {
                  throw err;
                } else {
                  let jsonResultOfExcel = await result;
                  await fs.unlinkSync(req.file.path);
                  let rownum: number = 1;
                  let validJsonDataArray: any[] = [];
                  let xlsxErrorObj: any[] = [];
                  let errorResponse: any[] = [];
                  for (const excelRowData of jsonResultOfExcel) {
                    rownum++;
                    let errResObj: any;
                    let errorMsg: String =
                      "Please correct the errors in " +
                      rownum +
                      " row contains ";
                    if (
                      excelRowData["subject code"] &&
                      excelRowData["subject name"] &&
                      excelRowData["scheme"] &&
                      excelRowData["branch"] &&
                      excelRowData["semister"]
                    ) {
                      let daoResult = await subjectDAO.checkExcelData(
                        excelRowData
                      );
                      if (daoResult.error) {
                        errResObj = {};
                        errResObj.row = rownum;
                        errResObj.msg = "";
                        errResObj.msg = errResObj.msg + daoResult.error;
                        errorResponse.push(errResObj);
                        xlsxErrorObj.push(
                          errorMsg + daoResult.error + " columns"
                        );
                      } else {
                        let subjectObj = {
                          subject_code: excelRowData["subject code"],
                          subject_name: excelRowData["subject name"],
                          scheme: daoResult["scheme"],
                          branch: daoResult["branch"],
                          sem: daoResult["sem"],
                        };
                        validJsonDataArray.push(subjectObj);
                      }
                    } else {
                      errResObj = {};
                      errResObj.row = rownum;
                      errResObj.msg = errResObj.msg + "";
                      let errorObj: any[] = [];
                      if (!excelRowData["subject code"]) {
                        errorObj.push("Subject Code is empty");
                      }
                      if (!excelRowData["subject name"]) {
                        errorObj.push("Subject Name is empty");
                      }
                      if (!excelRowData["scheme"]) {
                        errorObj.push("Scheme is empty");
                      }
                      if (!excelRowData["branch"]) {
                        errorObj.push("Branch is empty");
                      }
                      if (!excelRowData["semister"]) {
                        errorObj.push("Semister is empty");
                      }
                      errResObj.msg = errorObj.toString();
                      xlsxErrorObj.push(errorMsg + errorObj.toString());
                      errorResponse.push(errResObj);
                    }
                  }
                  if (xlsxErrorObj.length >= 1) {
                    //return excel sheet with these errors
                    return res.status(400).send({
                      status: 400,
                      message: errorResponse,
                    });
                  } else {
                    for (let subject of validJsonDataArray) {
                      let subjectUpdatedObj = await Subject.findOneAndUpdate(
                        { subject_code: subject.subject_code },
                        subject
                      );
                      if (!subjectUpdatedObj) {
                        let newSubjectObj = await new Subject(subject);
                        let newSubject = await newSubjectObj.save();
                      }
                    }
                    return res.status(200).send({
                      status: 200,
                      message: responseStatus.subject_upload_success,
                    });
                  }
                }
              }
            );
          }
        } catch (err) {
          return res.status(500).send({
            status: 500,
            message: responseStatus.error,
            err: err,
          });
        }
      });
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }
  public async updateSubject(
    req: ValidatedRequest<UpdateSubjectSchema>,
    res: Response
  ) {
    try {
      let subjectObj = {
        subject_code: req.body.subject_code,
        subject_name: req.body.subject_name,
        scheme: req.body.scheme,
        branch: req.body.branch,
        sem: req.body.sem,
      };
      let daoResult = await subjectDAO.updateSubject(subjectObj);
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

  public async deleteSubject(
    req: ValidatedRequest<DeleteSubjectSchema>,
    res: Response
  ) {
    try {
      let subject_code = req.params.subjectcode;

      let daoResult = await subjectDAO.deleteSubject(subject_code);
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
}
