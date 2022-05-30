import express from "express";
import { ExtraActivitiesController } from "../controllers/extra_activities_controller";
import { auth } from "../shared/jwtAuth";
const extraActivitiesRouter = express.Router();
import { extraActivityValidator } from "../validators/routevalidators/extra_activity_validator";
import { createValidator } from "express-joi-validation";
const validator = createValidator();
const extraActivitiesController = new ExtraActivitiesController();

//@type POST
//@route    /api/extraActivities/add
//@desc     route for adding the extra activities performed by only students
//@access   PRIVATE access (only for students)

extraActivitiesRouter.post(
  "/add",
  auth,
  validator.body(extraActivityValidator.addExtraActivitySchema),
  extraActivitiesController.addExtraActivities
);

//@type GET
//@route    /api/extraActivities/:student_id
//@desc     route for getting the extra activities
//@access   PRIVATE access (students and faculties)

extraActivitiesRouter.get(
  "/:student_id",
 // auth,
  validator.params(extraActivityValidator.getExtraActivity),
  extraActivitiesController.getExtraActivities
);

//@type PUT
//@route    /api/extraActivities/update
//@desc     route for getting the extra activities
//@access   PRIVATE access (students)

extraActivitiesRouter.put(
  "/update",
  auth,
  validator.body(extraActivityValidator.updateExtraActivity),
  extraActivitiesController.updateExtraActivity
);

//@type DELETE
//@route    /api/extraActivities/:activityId
//@desc     route for deleting the extra activities
//@access   PRIVATE access (students)

extraActivitiesRouter.delete(
  "/:activityid",
  auth,
  validator.params(extraActivityValidator.deleteExtraActivity),
  extraActivitiesController.deleteExtraActivity
);

export default extraActivitiesRouter;
