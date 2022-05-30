import express from "express";
import { createValidator } from "express-joi-validation";
import { auth } from "../shared/jwtAuth";
const academicConfigRouter = express.Router();
const validator = createValidator();
import { academicConfigValidator } from "../validators/routevalidators/academic_config_req_route_validator";
import { AcademicConfigController } from "../controllers/academic_config_controller";
const academicConfigController = new AcademicConfigController();
//@type POST
//@route    /api/academicConfig/add
//@desc     route for adding academic configuration for particular batch
//@access   PRIVATE access ( faculties)
academicConfigRouter.post(
  "/add",
  auth,
  validator.body(academicConfigValidator.academicConfigSchema),
  academicConfigController.addAcademicConfig
);

//@type GET
//@route    /api/academicConfig/academic/scheme/:scheme
//@desc     route for getting  particular academic scheme details
//@access   PRIVATE access (faculties)
academicConfigRouter.get(
  "/academic/scheme/:scheme",
  auth,
  validator.params(academicConfigValidator.getAcademicConfig),
  academicConfigController.getAcademicScheme
);

//@type GET
//@route    /api/academicConfig/all
//@desc     route for getting  all academic scheme details for paticular student
//@access   PRIVATE access (faculties)
academicConfigRouter.get(
  "/all",
  auth,
  academicConfigController.getAllAcademicConfig
);

//@type PUT
//@route    /api/academicConfig/update
//@desc     route for updating the existing the scheme
//@access   PRIVATE access (faculties)
academicConfigRouter.put(
  "/update",
  auth,
  validator.body(academicConfigValidator.academicConfigSchema),
  academicConfigController.updateAcademicScheme
);

//@type Delete
//@route    /api/academicConfig/:scheme
//@desc     route for deleting the existing the scheme
//@access   PRIVATE access (faculties)
academicConfigRouter.delete(
  "/:scheme",
  auth,
  validator.params(academicConfigValidator.deleteAcademicConfig),
  academicConfigController.deleteAcademicScheme
);



//@type GET
//@route    /api/academicConfig/basicinfo
//@desc     route for getting the basic info of the academics
//@access   PRIVATE access (faculties)
academicConfigRouter.get(
  "/basicinfo",
  auth,
  academicConfigController.getbasicInfo
);
export default academicConfigRouter;
