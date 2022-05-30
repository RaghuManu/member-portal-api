import * as Joi from "@hapi/joi";

//validation check once add member api called
const userBodySchema = Joi.object({
  login_id: Joi.string().required(),
  username: Joi.string().required(),
 /*  password: Joi.string().required(), */
  designation: Joi.string().allow(null).allow("").optional(),
  branch: Joi.string().required(),
  mobile_number: Joi.string().required().length(12),
  email_id: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    /* .optional() */,
  batch: Joi.string().allow(null).allow("").optional(),
  mentor: Joi.string().allow(null).allow("").optional(),
  user_image_file_path: Joi.string().allow(null).allow("").optional(),
  role: Joi.string().required(),
  scheme: Joi.string().allow(null).allow("").optional(),
});

//validation check once upload member api called
const xlsxUserBodySchema = Joi.object({
  usn: Joi.string().required(),
  username: Joi.string().required(),
  designation: Joi.string().required(),
  branch: Joi.string().required(),
  mobile_number: Joi.string().required().length(10),
  email_id: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .optional(),
  batch: Joi.string().required(),
  mentor: Joi.string().optional(),
  user_image_file_path: Joi.string().optional(),
  role: Joi.string().optional(),
  scheme: Joi.string().required(),
});

//validation check once getuserbyusn api called
const usnSearchValidator = Joi.object({
  usn: Joi.string().required(),
});

//validation check once getuserbyname api called
const userNameSearchValidator = Joi.object({
  userName: Joi.string().required(),
});

//validation check once getuserbySearch api called
const searchValidator = Joi.object({
  searchvalue: Joi.string().required(),
});

const searchLoginIdValidator = Joi.object({
  loginid: Joi.string().required(),
});

//validation check once getuserbybatch api called
const batchSearchValidator = Joi.object({
  batch: Joi.string().required(),
});

//validation check once login api called
const loginValidator = Joi.object({
  login_id: Joi.string().required(),
  password: Joi.string().required(),
});

//validation check once updateuser api called
const updateUserValidator = Joi.object({
  login_id: Joi.string().required(),
  username: Joi.string().required(),
  designation: Joi.string().allow(null).allow("").optional(),
  branch: Joi.string().required(),
  mobile_number: Joi.string().required().length(12),
  email_id: Joi.string()
   // .email({ minDomainSegments: 4, tlds: { allow: ["com", "net","in","edu.in"] } })
   //.email()
    .optional(),
  batch: Joi.string().allow(null).allow("").optional(),
  mentor: Joi.string().allow(null).allow("").optional(),
  user_image_file_path: Joi.string().allow(null).allow("").optional(),
  role: Joi.string().optional(),
  scheme: Joi.string().allow(null).allow("").optional()
});

//validation check once deleteuser api called
const deleteUserValidator = Joi.object({
  login_id: Joi.string().required(),
});

//validation check once resetpassword api called
const resetPasswordValidator = Joi.object({
  login_id: Joi.string().required(),
  /*  current_password: Joi.string().required(), */
  new_password: Joi.string().required(),
});


//validation for upload profile photo
const updateProfilePhotoValidator = Joi.object({
  login_id: Joi.string().required(),
  user_image_file_path: Joi.string().required()
})

//validation for pagination

const paginationValidator = Joi.object({
  skip:Joi.number().required(),
  limit:Joi.number().required()
})
export const userValidators = {
  userBodySchema: userBodySchema,
  xlsxUserBodySchema: xlsxUserBodySchema,
  usnSearchValidator: usnSearchValidator,
  userNameSearchValidator: userNameSearchValidator,
  batchSearchValidator: batchSearchValidator,
  loginValidator: loginValidator,
  updateUserValidator: updateUserValidator,
  deleteUserValidator: deleteUserValidator,
  searchValidator: searchValidator,
  resetPasswordValidator: resetPasswordValidator,
  paginationValidator: paginationValidator,
  updateProfilePhotoValidator: updateProfilePhotoValidator,
  searchLoginIdValidator: searchLoginIdValidator
};
