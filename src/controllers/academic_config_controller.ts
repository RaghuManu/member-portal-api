import { Response } from "express";
// Use this as a replacement for express.Request
import { ValidatedRequest } from "express-joi-validation";
import { AcademicConfigDAO } from "../dao/academic_config_dao";
import { responseStatus } from "../shared/response_status";
import {
  AcademicDetailSchema,
  getAcademicSchema,
  deleteAcademicSchema,
} from "../validators/controllervalidators/academic_config_schema_validator";
import { basicInfo } from "./../shared/enums";
import { academicConfig } from "../model/academic_config_db";
const academicConfigDAO = new AcademicConfigDAO();
type exam_list_type = {
  name: String;
  max_marks: Number;
  total_test: Number;
};
type branchType = {
  id: String;
  name: String;
};

type designationType = {
  id: String;
  name: String;
};

type semType = {
  id: String;
  name: String;
};
type basicInfoType = {
  branch: branchType[];
  scheme: [];
  sem: semType[];
  designation: designationType[];
};

export class AcademicConfigController {
  public async addAcademicConfig(
    req: ValidatedRequest<AcademicDetailSchema>,
    res: Response
  ) {
    try {
      let exam_list: exam_list_type[] = [];
      for (const obj of req.body.internal.exam_list) {
        exam_list.push({
          name: obj.name.toUpperCase(),
          max_marks: obj.max_marks,
          total_test: obj.total_test,
        });
      }
      let configObj = {
        scheme: req.body.scheme,
        internal: {
          max_marks: req.body.internal.max_marks,
          total_exams: req.body.internal.total_exams,
          exam_list: exam_list,
        },
        external: {
          max_marks: req.body.external.max_marks,
        },
      };
      let daoResult = await academicConfigDAO.addAcademicConfig(configObj);
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

  public async getAcademicScheme(
    req: ValidatedRequest<getAcademicSchema>,
    res: Response
  ) {
    try {
      let studentSchemeObj = {
        scheme: req.params.scheme,
      };
      let daoResult = await academicConfigDAO.getAcademicConfig(
        studentSchemeObj
      );
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

  public async getAllAcademicConfig(req: any, res: Response) {
    try {
      if (!req.query.skip) req.query.skip = 0;
      if (!req.query.limit) req.query.limit = 10;
      const skip = Number(req.query.skip);
      const limit = Number(req.query.limit);
      let daoResult = await academicConfigDAO.getAllAcademicConfig(skip, limit);
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

  public async updateAcademicScheme(
    req: ValidatedRequest<AcademicDetailSchema>,
    res: Response
  ) {
    try {
      let exam_list: exam_list_type[] = [];
      for (const obj of req.body.internal.exam_list) {
        exam_list.push({
          name: obj.name.toUpperCase(),
          max_marks: obj.max_marks,
          total_test: obj.total_test,
        });
      }
      let configObj = {
        scheme: req.body.scheme,
        internal: {
          max_marks: req.body.internal.max_marks,
          total_exams: req.body.internal.total_exams,
          exam_list: exam_list,
        },
        external: {
          max_marks: req.body.external.max_marks,
        },
      };

      let daoResult = await academicConfigDAO.updateAcademicScheme(configObj);
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

  public async deleteAcademicScheme(
    req: ValidatedRequest<deleteAcademicSchema>,
    res: Response
  ) {
    try {
      let scheme = req.params.scheme;
      let daoResult = await academicConfigDAO.deleteAcademicScheme(scheme);
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

  public async getbasicInfo(req: any, res: any) {
    try {
      let responseObj: basicInfoType = {
        branch: [],
        designation: [],
        scheme: [],
        sem: [],
      };
      let academicDaoResult = await academicConfigDAO.getAcademicSchemes();
      let branchDaoResult = await academicConfigDAO.getBranchSchemes();
      let semDaoResult = await academicConfigDAO.getSemSchemes();
      let designationDaoResult = await academicConfigDAO.getDesignationSchemes();
      if (
        academicDaoResult.result &&
        branchDaoResult.result &&
        semDaoResult.result &&
        designationDaoResult.result
      ) {
        (responseObj.scheme = academicDaoResult.result),
          (responseObj.designation = designationDaoResult.result),
          (responseObj.branch = branchDaoResult.result),
          (responseObj.sem = semDaoResult.result);
        return res.status(200).send({
          status: 200,
          data: responseObj,
          message: responseStatus.success,
        });
      } else {
        if (academicDaoResult.error) {
          return res.status(400).send({
            status: 400,
            message: academicDaoResult.error,
          });
        } else if (branchDaoResult.error) {
          return res.status(400).send({
            status: 400,
            message: branchDaoResult.error,
          });
        } else if (semDaoResult.error) {
          return res.status(400).send({
            status: 400,
            message: semDaoResult.error,
          });
        } else {
          return res.status(400).send({
            status: 400,
            message: designationDaoResult.error,
          });
        }
      }

      /*  return res.status(200).send({
        status: 200,
        data: basicInfo,
        message: responseStatus.success,
      }); */
    } catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }
}
