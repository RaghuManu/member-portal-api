import express from "express";
import { ScholarshipController } from "../controllers/scholorship_controller";
import { auth } from "../shared/jwtAuth";
const scholorshipRouter = express.Router();
import { createValidator } from "express-joi-validation";
const validator = createValidator();
import { scholarshipValidator } from "../validators/routevalidators/scholarship_validator";
const scholorshipController = new ScholarshipController();

//@type POST
//@route    /api/scholorship/add
//@desc     route for adding the scholorship performed by only students
//@access   PRIVATE access (only for students)

scholorshipRouter.post(
  "/add",
  auth,
  validator.body(scholarshipValidator.addScholarship),
  scholorshipController.addScholarship
);

//@type GET
//@route    /api/scholorship/all/:student_id
//@desc     route for getting the scholorship
//@access   PRIVATE access (students and faculties)

scholorshipRouter.get(
  "/all/:student_id",
  auth,
  validator.params(scholarshipValidator.getAllScholarship),
  scholorshipController.getAllScholarship
);

//@type PUT
//@route    /api/scholorship/update
//@desc     route for updating the existing scholorship
//@access   PRIVATE access (students)

scholorshipRouter.put(
  "/update",
  auth,
  validator.body(scholarshipValidator.updateScholarship),
  scholorshipController.updateScholarship
);

//@type DELETE
//@route    /api/scholorship/:scholorshipId
//@desc     route for deleting the extra activities
//@access   PRIVATE access (students)

scholorshipRouter.delete(
  "/:scholarshipid",
  auth,
  validator.params(scholarshipValidator.deleteScholarship),
  scholorshipController.deleteScholarship
);

//@type GET
//@route    /api/scholorship/:scholorshipId
//@desc     route for getting the particular scholarship
//@access   PRIVATE access (students and faculties)

scholorshipRouter.get(
  "/:scholarshipid",
  auth,
  validator.params(scholarshipValidator.getScholarShip),
  scholorshipController.getScholarship
);

export default scholorshipRouter;
