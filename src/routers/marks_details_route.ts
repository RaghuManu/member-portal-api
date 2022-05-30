import express from "express";
import { auth } from "../shared/jwtAuth";
import { AcademicController } from "../controllers/marks_details_controller";
import { marksValidator } from "../validators/routevalidators/marks_details_req_route_validator";
// Creates a validator that generates middlewares
import { createValidator } from "express-joi-validation";
const marksDetailsRouter = express.Router();
let academicController = new AcademicController();
const validator = createValidator();
//@type POST
//@route    /api/marksdetails/add
//@desc     router for adding or updating the marks
//@access   PRIVATE access ( faculties)
marksDetailsRouter.post(
  "/add",
  auth,
  validator.body(marksValidator.marksDetailsSchemaValidator),
  academicController.add
);

//@type POST
//@route    /api/marksdetails/marks
//@desc     router for getting the student marks
//@access   PRIVATE access (students and faculties)
marksDetailsRouter.post(
  "/marks",
 // auth,
  validator.body(marksValidator.getStudentMarksSchema),
  academicController.getStudentMarks
);

//@type GET
//@route    /api/marksdetails/:student_id
//@desc     router for getting the student grade of all the sem
//@access   PRIVATE access (students and faculties)
marksDetailsRouter.get(
  "/:student_id",
  auth,
  validator.params(marksValidator.getStudentGrades),
  academicController.getStudentGrades
);

export default marksDetailsRouter;
