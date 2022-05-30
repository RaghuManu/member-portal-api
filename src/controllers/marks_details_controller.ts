import { Response } from "express";
// Use this as a replacement for express.Request
import { ValidatedRequest } from "express-joi-validation";
import {
  MarksDetailSchema,
  StudentMarksSchema,
  StudentGradeSchema
} from "../validators/controllervalidators/marks_details_req_schema_validator";
import { responseStatus } from "../shared/response_status";
import { MarksDetailsDAO } from "../dao/marks_details_dao";
const marksDetailsDAO = new MarksDetailsDAO();

export class AcademicController {
  public async add(req: ValidatedRequest<MarksDetailSchema>, res: Response) {
    try {
      let studentAcademicObj = req.body;
      let daoResult = await marksDetailsDAO.addAcademicDetails(
        studentAcademicObj
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

  public async getStudentMarks(
    req: ValidatedRequest<StudentMarksSchema>,
    res: Response
  ) {
    try {
      const studentObj = {
        student_id: req.body.student_id,
        sem: req.body.sem,
      };
      let daoResult = await marksDetailsDAO.studentMarks(studentObj);
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


  public async getStudentGrades( req: ValidatedRequest<StudentGradeSchema>,res: Response){
    try {
      const student_id = req.params.student_id;
      let daoResult = await marksDetailsDAO.studentGrades(student_id);
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
    }catch (err) {
      return res.status(500).send({
        status: 500,
        message: responseStatus.error,
        err: err,
      });
    }
  }
}
