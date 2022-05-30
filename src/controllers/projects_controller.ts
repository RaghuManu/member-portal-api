import { Request, Response } from "express";
import { ProjectDAO } from "../dao/projects_dao";
import { responseStatus } from "../shared/response_status";
import {
  AddProject,
  deleteProject,
  getAllProject,
  getProject,
  updateProject,
} from "../validators/controllervalidators/project_validator";
import { ValidatedRequest } from "express-joi-validation";
import {AddProjectType} from '../shared/types';
const projectDAO = new ProjectDAO();
export class ProjectController {

    public async addProject(req: ValidatedRequest<AddProject>,res: Response): Promise<any> {
        try {
            const project_obj : AddProjectType = {
                student_id:req.body.student_id,
                projects:{
                    project_photo_path:req.body.project_photo_path,
                    project_title:req.body.project_title,
                    project_guide:req.body.project_guide,
                    project_members:req.body.project_members,
                    project_cost:req.body.project_cost,
                    project_duration:req.body.project_duration,
                    project_semister:req.body.project_semister,
                    project_description:req.body.project_description
                }
            };
            let daoResult = await projectDAO.addProject(project_obj);
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
        }
        catch(err) {
            return res.status(500).send({
              status: 500,
              message: responseStatus.error,
              err: err,
            });
          }
    }

    public async updateProject(req: ValidatedRequest<updateProject>,res: Response): Promise<any> {
        try {
          const student_id = req.body.student_id;
          const updatedProject = req.body.project;
    
          let daoResult = await projectDAO.updateProject(
            student_id,
            updatedProject
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

        }
        catch(err) {
            return res.status(500).send({
              status: 500,
              message: responseStatus.error,
              err: err,
            });
          }
    }

    public async getAllProject(req: ValidatedRequest<getAllProject>,res: Response): Promise<any> {
        try {
          const student_id = req.params.student_id;
          let daoResult = await projectDAO.getAllProject(student_id);
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
        }
        catch(err) {
            return res.status(500).send({
              status: 500,
              message: responseStatus.error,
              err: err,
            });
          }
    }

    public async deleteProject(req: ValidatedRequest<deleteProject>,res: Response): Promise<any> {
        try { 
          const projectId = req.params.projectid;
          const student_id = req.params.student_id;
          let daoResult = await projectDAO.deleteProject(student_id,projectId);
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
        
        }catch(err) {
            return res.status(500).send({
              status: 500,
              message: responseStatus.error,
              err: err,
            });
          }
    }

    public async getProject(
      req: ValidatedRequest<getProject>,
      res: Response
    ): Promise<any> {
      try {
        const projectId = req.params.projectid;
        const student_id = req.params.student_id;
        let daoResult = await projectDAO.getProject(student_id,projectId);
        if (daoResult.result) {
          let data: any[] = daoResult.result;
          let index = data.findIndex((element) => element._id == projectId);
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
}