import { Request, Response } from "express";
import { ScholarshipDAO } from "../dao/scholarship_dao";
import { responseStatus } from "../shared/response_status";
import {
  AddScholarship,
  deleteScholarship,
  getAllScholarship,
  getScholarship,
  updateScholarship,
} from "../validators/controllervalidators/scholarship_validator";
import { ValidatedRequest } from "express-joi-validation";
const scholarshipDAO = new ScholarshipDAO();
export class ScholarshipController {
  public async addScholarship(
    req: ValidatedRequest<AddScholarship>,
    res: Response
  ): Promise<any> {
    try {
      let scholarshipObj = {
        student_id: req.body.student_id,
        scholarship: {
          sanctioned_date: req.body.sanctioned_date,
          application_no: req.body.application_no,
         /*  sanctioned_year: req.body.sanctioned_year,
          resource_file_path: req.body.resource_file_path, */
          particulars: req.body.particulars,
          sanctioned_amount: req.body.sanctioned_amount,
          certification_file_path: req.body.certification_file_path,
        },
      };
      let daoResult = await scholarshipDAO.addScholarship(scholarshipObj);
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

  public async updateScholarship(
    req: ValidatedRequest<updateScholarship>,
    res: Response
  ): Promise<any> {
    try {
      const student_id = req.body.student_id;
      const updatedScholarship = req.body.scholarship;

      let daoResult = await scholarshipDAO.updateScholarship(
        student_id,
        updatedScholarship
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

  public async deleteScholarship(
    req: ValidatedRequest<deleteScholarship>,
    res: Response
  ): Promise<any> {
    try {
      let scholarshipId = req.params.scholarshipid;
      let daoResult = await scholarshipDAO.deleteScholarship(scholarshipId);
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

  public async getScholarship(
    req: ValidatedRequest<getScholarship>,
    res: Response
  ): Promise<any> {
    try {
      let scholarshipId = req.params.scholarshipid;
      let daoResult = await scholarshipDAO.getScholarship(scholarshipId);
      if (daoResult.result) {
        let data: any[] = daoResult.result;
        let index = data.findIndex((element) => element._id == scholarshipId);
        if (index >= 0) {
          return res.status(200).send({
            status: 200,
            data: data[index],
            message: responseStatus.success,
          });
        } else {
          return res.status(200).send({
            status: 200,
            data: data,
            message: responseStatus.success,
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

  public async getAllScholarship(
    req: ValidatedRequest<getAllScholarship>,
    res: Response
  ): Promise<any> {
    try {
      const student_id = req.params.student_id;
      let daoResult = await scholarshipDAO.getAllScholarship(student_id);
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
}
