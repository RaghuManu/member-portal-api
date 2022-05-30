import express from "express";
import { createValidator } from "express-joi-validation";
import { auth } from "../shared/jwtAuth";
import { subjectValidators } from "../validators/routevalidators/subject_req_route_validator";
import { SubjectController } from "../controllers/subjects_controller";
import { upload } from "../config/multer.config";
const subjectRouter = express.Router();
const validator = createValidator();
let subjectController = new SubjectController();

//@type POST
//@route    /api/subject/add
//@desc     route for adding indiviual subject
//@access   PRIVATE access ( faculties)
subjectRouter.post(
  "/add",
  auth,
  validator.body(subjectValidators.subjectSchemaValidator),
  subjectController.addNewSubjectController
);

//@type GET
//@route    /api/subject/all
//@desc     route for getting all  subjects
//@access   PRIVATE access (faculties)
subjectRouter.get("/all", auth,  subjectController.getSubjectController);

//@type POST
//@route    /api/subject/upload
//@desc     route for uploading all subjects
//@access   PRIVATE access ( faculties)
subjectRouter.post("/upload", auth, upload, subjectController.uploadAllSubject);

//@type PUT
//@route    /api/subject/update
//@desc     route for uploading all subjects
//@access   PRIVATE access ( faculties)
subjectRouter.put(
  "/update",
  auth,
  validator.body(subjectValidators.updateSubjectValidator),
  subjectController.updateSubject
);

//@type DELETE
//@route    /api/subject/delete
//@desc     route for uploading all subjects
//@access   PRIVATE access (faculties)
subjectRouter.delete(
  "/:subjectcode",
  auth,
  validator.params(subjectValidators.deleteSubjectValidator),
  subjectController.deleteSubject
);

export default subjectRouter;
