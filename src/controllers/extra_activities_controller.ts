import { Request, Response } from "express";
import { ExtraActivitiesDAO } from "../dao/extra_activities_dao";
import { responseStatus } from "../shared/response_status";
// Use this as a replacement for express.Request
import { ValidatedRequest } from "express-joi-validation";
import {
  AddExtraActivity,
  deleteExtraActivity,
  getExtraActivity,
  updateExtraActivity,
} from "../validators/controllervalidators/extra_activity_validator";
const extraActivitiesDAO = new ExtraActivitiesDAO();

export class ExtraActivitiesController {
  public async addExtraActivities(
    req: ValidatedRequest<AddExtraActivity>,
    res: Response
  ) {
    try {
      let extraActivityObj = {
        student_id: req.body.student_id,
        extra_activities: {
          event_type: req.body.event_type,
          event_name: req.body.event_name,
          event_date: req.body.event_date,
          event_venue: req.body.event_venue,
          event_result: req.body.event_result,
          semister: req.body.semister,
          certification_file_path: req.body.certification_file_path,
        },
      };

      let daoResult = await extraActivitiesDAO.addExtraActivities(
        extraActivityObj
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

  public async getExtraActivities(
    req: ValidatedRequest<getExtraActivity>,
    res: Response
  ) {
    try {
      const student_id = req.params.student_id;
      let daoResult = await extraActivitiesDAO.getExtraActivities(student_id);
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
  public async updateExtraActivity(
    req: ValidatedRequest<updateExtraActivity>,
    res: Response
  ) {
    try {
      const student_id = req.body.student_id;
      const updatedActivity = req.body.activity;
      
      let daoResult = await extraActivitiesDAO.updateExtraActivity(
        student_id,
        updatedActivity
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

  public async deleteExtraActivity(
    req: ValidatedRequest<deleteExtraActivity>,
    res: Response
  ) {
    try {
      let activityId = req.params.activityid;
      let daoResult = await extraActivitiesDAO.deleteExtraActivity(activityId);
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
