import { Project } from "../model/projects_db";
import { Sem } from "../model/sem_db";
import { responseStatus } from "../shared/response_status";
import {AddProjectType,projectObjType} from '../shared/types';
export class ProjectDAO {

    public async addProject(projectObj: AddProjectType): Promise<any> {
        try {
            const student_id = projectObj.student_id;
            const project = projectObj.projects;
            let student_project_obj: any = await Project.findOne({
              student_id: student_id,
            });
            if (student_project_obj) {
              let projectObjInDB: any[] = student_project_obj.projects;
      
              let isProjectExist = projectObjInDB.findIndex(
                (projectElement) => {
                  return (
                    projectElement.project_title === project.project_title
                  );
                }
              );
              if (isProjectExist >= 0) {
                return { error: responseStatus.project_title_exist };
              } else {
                projectObjInDB.push(project);
                const updatedProjectObjInDB = await Project.findOneAndUpdate(
                  { student_id: student_id },
                  { $set: { projects: projectObjInDB } },
                  { new: true }
                );
                return { result: updatedProjectObjInDB };
              }
            } else {
              const studentProjectObj = {
                student_id: student_id,
                projects: [project],
              };
              const newstudentProjectObj = await new Project(
                studentProjectObj
              ).save();
              return { result: newstudentProjectObj };
            }
        }
        catch (err) {
            throw err;
          }
    }

    public async updateProject( student_id: String,
      project: projectObjType): Promise<any> {
        try {
          let projectId = project._id;
          let student_project_obj: any = await Project.findOne({
            student_id: student_id,
          });
          if (student_project_obj) {
            let projectObjInDB: any[] = student_project_obj.projects;
    
            let isProjectExist = this.checkOtherSimilarProjectExist(
              project,
              projectObjInDB
            );
            if (isProjectExist > 1) {
              return { error: responseStatus.project_exist };
            } else {
              const updatedScholarship = await Project.findOneAndUpdate(
                { "projects._id": projectId },
                {
                  $set: {
                    "projects.$.project_photo_path": project.project_photo_path,
                    "projects.$.project_title": project.project_title,
                    "projects.$.project_guide": project.project_guide,
                    "projects.$.project_semister": project.project_semister,
                    "projects.$.project_description":project.project_description,
                    "projects.$.project_members": project.project_members,
                    "projects.$.project_cost":project.project_cost,
                    "projects.$.project_duration":project.project_duration,
                  },
                },
                { new: true }
              );
              return { result: updatedScholarship };
            }
          } else {
            return { error: responseStatus.student_not_exist };
          }
        }
        catch (err) {
            throw err;
          }
    }

    public async getAllProject(student_id: any): Promise<any> {
        try {
          const studentProjects : any = await Project.findOne({
            student_id: student_id,
          });
          let responseObj:any = {
            student_id: student_id,
            projects: []
          };
          if(studentProjects){
          for (const element of studentProjects['projects']) {
            let project : any={};
            let sem = {};
            if (element.project_semister) {
              let semDetails: any = await Sem.findById(element.project_semister);
              sem = semDetails && semDetails["name"] ? { id: element.project_semister, name: semDetails["name"] } : '';
              project.project_semister = sem;
             
            }
            project._id = element['_id'];
            project.project_photo_path = element['project_photo_path'];
            project.project_title = element['project_title'];
            project.project_guide = element['project_guide'];
            project.project_members = element['project_members'];
            project.project_cost = element['project_cost'];
            project.project_duration = element['project_duration'];
            project.project_description = element['project_description'];
            responseObj.projects.push(project) 
          }
          return { result: responseObj };
        }
          /* if (studentProjects) {
            return { result: responseObj };
          } */ else {
            return { result: {} };
          }
        }
        catch (err) {
            throw err;
          }
    }

    public async deleteProject(student_id:String,projectId:String): Promise<any> {
      let ObjectId = require("mongoose").Types.ObjectId;
      try {
        const deleteProject = await Project.update(
          {},
          {
            $pull: {
              projects: { _id: new ObjectId(projectId) },
            },
            student_id: student_id
          },
          {
            multi: true,
          }
        );
  
        const isDeletedDataExist = await Project.findOne({
          "projects._id": projectId,
        });
        if (isDeletedDataExist) {
          return { error: responseStatus.scholarship_delete_failure };
        } else {
          return { result: responseStatus.scholarship_delete_success };
        }
      }
        catch (err) {
            throw err;
          }
    }

    private checkOtherSimilarProjectExist(
      newProject: projectObjType,
      dbProject: any[]
    ): any {
      let count = 0;
      for (let dbproject of dbProject) {
        let isProjectTitleAdded =
          dbproject.project_title.toUpperCase() ===
          newProject.project_title.toUpperCase()
            ? true
            : false;      
        let isProjectDescriptionAdded =
        dbproject.project_description.toUpperCase() ===
        newProject.project_description.toUpperCase()
            ? true
            : false;      
        if (
          isProjectTitleAdded &&
          isProjectDescriptionAdded 
        ) {
          count++;
        }
      }
      return count;
    }

    public async getProject(student_id:String,projectId:String): Promise<any> {
      try {
        let ObjectId = require("mongoose").Types.ObjectId;
        const project: any = await Project.findOne({
          "projects._id": new ObjectId(projectId),
          student_id: student_id
        });
        if (project) {
          return { result: project.projects };
        } else {
          return { error: responseStatus.no_project };
        }
      } catch (err) {
        throw err;
      }
    }
}