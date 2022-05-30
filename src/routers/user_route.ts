import express from "express";
import { upload, imageUplaod } from "../config/multer.config";
import { UserController } from "../controllers/user_controller";
// Creates a validator that generates middlewares
import { createValidator } from "express-joi-validation";
//import { userValidators } from '../validators/user_validator';
import { userValidators } from "../validators/routevalidators/user_req_route_validator";
import { auth } from "../shared/jwtAuth";
const validator = createValidator();

let userController = new UserController();
const memberRouter = express.Router();

//@type POST
//@route    /api/member/add
//@desc     route for adding indiviual member
//@access   PRIVATE access (faculties)
memberRouter.post(
  "/add",
  auth,
  //validator.body(userValidators.userBodySchema),
  userController.addNewUserController
);

//@type POST
//@route    /api/member/upload
//@desc     route for adding list of members through xlsx file to mongodb
//@access   PRIVATE access (faculties)
memberRouter.post("/upload", auth, upload, userController.uploadMembers);

//@type GET
//@route    /api/member/all
//@desc     route for getting all the  members
//@access   PRIVATE access (faculties)
memberRouter.get("/all", auth,  userController.getAllUsers);

//@type GET
//@route    /api/member/getuserbyusn
//@desc     route for getting student by usn
//@access   PRIVATE access (faculties)
memberRouter.get(
  "/loginid/:usn",
  auth,
  validator.params(userValidators.usnSearchValidator),
  userController.getUserByUsn
);

//@type GET
//@route    /api/member/getuserbyname
//@desc     route for getting student by Name
//@access   PRIVATE access (faculties)
memberRouter.get(
  "/getuserbyname/:userName",
  auth,
  validator.params(userValidators.userNameSearchValidator),
  userController.getUserByName
);

//@type GET
//@route    /api/member/getuserbybatch
//@desc     route for getting student by batch
//@access   PRIVATE access (faculties)
memberRouter.get(
  "/getuserbybatch/:batch",
  auth,
  validator.params(userValidators.batchSearchValidator),
  userController.getUserByBatch
);

//@type PUT
//@route    /api/member/getuserbybatch
//@desc     route for update the user
//@access   PRIVATE access (faculties)

memberRouter.put(
  "/update",
  auth,
  validator.body(userValidators.updateUserValidator),
  userController.updateUser
);

//@type POST
//@route    /api/member/login
//@desc     route for login
//@access   PUBLIC access

memberRouter.post(
  "/login",
  validator.body(userValidators.loginValidator),
  userController.login
);

//@type POST
//@route    /api/member/logout
//@desc     route for logout
//@access   PRIVATE access (students and faculties)
memberRouter.post("/logout", auth, userController.logout);

//@type DELETE
//@route    /api/member/deleteuser
//@desc     route for deleting the user
//@access   PRIVATE access (faculties)
memberRouter.delete(
  "/:memberid",
  auth,
  validator.params(userValidators.deleteUserValidator),
  userController.deleteUser
);

//@type GET
//@route    /api/member/search
//@desc     route for getting student by searchValue
//@access   PRIVATE access (faculties)
memberRouter.get(
  "/search/:searchvalue",
  auth,
  validator.params(userValidators.searchValidator),
  userController.getUserBySearchValue
);

//@type GET
//@route    /api/member/loginid
//@desc     route for getting member by loginid
//@access   PRIVATE access (faculties)
memberRouter.get(
  "/:loginid",
  auth,
  validator.params(userValidators.searchLoginIdValidator),
  userController.getUserByLoginId
);

//@type PUT
//@route    /api/member/image
//@desc     uploadung profile photo
//@access   PRIVATE access (students and faculties)
memberRouter.put(
  "/image",
  auth,
  validator.body(userValidators.updateProfilePhotoValidator),
  userController.uploadUserProfile
);

//@type POST
//@route    /api/member/resetpassword
//@desc     route for resetting the password
//@access   PRIVATE access (students and faculties)
memberRouter.post(
  "/resetpassword",
  auth,
  validator.body(userValidators.resetPasswordValidator),
  userController.resetPassword
);

//@type GET
//@route    /api/member/faculty/mentors
//@desc     route for getting the mentors
//@access   PRIVATE access ( faculties)
memberRouter.get(
  "/faculty/mentors",
  auth,
  // validator.body(userValidators.resetPasswordValidator),
  userController.getMentors
);

//@type GET
//@route    /api/member/student/teammates
//@desc     route for getting the mentors
//@access   PRIVATE access ( faculties)
memberRouter.get(
  "/student/teammates",
  //auth,
 // validator.body(userValidators.resetPasswordValidator),
  userController.getTeamMates
);


export default memberRouter;
