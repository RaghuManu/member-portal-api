import express from "express";
import { ProjectController } from "../controllers/projects_controller";
import { auth } from "../shared/jwtAuth";
const projectRouter = express.Router();
import { createValidator } from "express-joi-validation";
const validator = createValidator();
import { projectValidator } from "../validators/routevalidators/project_route_validator";
const projectController = new ProjectController();

//@type POST
//@route    /api/project/add
//@desc     route for adding the project performed by only students
//@access   PRIVATE access (only for students)

projectRouter.post(
  "/add",
  auth,
  validator.body(projectValidator.addProject),
  projectController.addProject
);

//@type GET
//@route    /api/project/all/:student_id
//@desc     route for getting the project
//@access   PRIVATE access (students and faculties)

projectRouter.get(
  "/all/:student_id",
 // auth,
  validator.params(projectValidator.getAllProject),
  projectController.getAllProject
);

//@type PUT
//@route    /api/project/update
//@desc     route for updating the existing project
//@access   PRIVATE access (students)

projectRouter.put(
  "/update",
 // auth,
  validator.body(projectValidator.updateProject),
  projectController.updateProject
);

//@type DELETE
//@route    /api/project/:projectId/student/student_id
//@desc     route for deleting the project
//@access   PRIVATE access (students)

projectRouter.delete(
  "/:projectid/student/:student_id",
//  auth,
  validator.params(projectValidator.deleteProject),
  projectController.deleteProject
);

//@type GET
//@route    /api/project/:projectId/student/student_id
//@desc     route for getting the particular project
//@access   PRIVATE access (students and faculties)

projectRouter.get(
  "/:projectid/student/:student_id",
//  auth,
  validator.params(projectValidator.getProject),
  projectController.getProject
);

export default projectRouter;
