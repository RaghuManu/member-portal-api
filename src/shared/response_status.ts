const user_not_found = "User does not exist";
const user_exist = "User already exist";
const error = "Unable to process the request";
const success = "Request processed succefully";
const auth_error = "Not authorized to access this resource";
const invalid_credential_error = "Invalid login credentials";
const jwt_token_error = "Unable to create the jwt token";
const subject_exist = "Subject already exist";
const subject_not_found = "Subject does not exist";
const scheme_exist = "Academic Configuration already added to this batch";
const scheme_not_exist = "Academic scheme not configured";
const branch_not_exist = "Branch scheme not configured";
const designation_not_exist = "Designation scheme not configured";
const sem_not_exist = "Semister is not configured";
const student_not_exist = "Student is not added";
const event_already_exist =
  "Provided event type , event name and event venue already exist. please add new event";
const no_activity = "There were no activities, Please add the activities";
const application_no =
  "Application number for this scholarship is already exist";
const scholarship_exist =
  "Edited Scholarship details already present in other records. please add a new scholarship details";
const project_exist =
  "Edited Project details already present in other records. please add a new project details";
const no_scholarShip =
  "There were no scholarShips, Please add the scholarShips";
  const no_project =
  "There were no Projects, Please add the project";
const scholarship_delete_success = "scholarship deleted Succefully";
const scholarship_delete_failure =
  "scholarship not deleted Succefully. please try later";
const project_delete_success = "Project deleted Succefully";
const project_delete_failure =
  "Project not deleted Succefully. please try later";
const marks_not_added_student = "Marks were not added to the student";
const members_upload_success = "All members uploaded successfully";
const subject_upload_success = "All subjects uploaded successfully";
const project_title_exist = "Project title already exist";

export const responseStatus = {
  user_not_found: user_not_found,
  user_exist: user_exist,
  error: error,
  success: success,
  auth_error: auth_error,
  invalid_credential_error: invalid_credential_error,
  jwt_token_error: jwt_token_error,
  subject_exist: subject_exist,
  subject_not_found: subject_not_found,
  scheme_exist: scheme_exist,
  scheme_not_exist: scheme_not_exist,
  student_not_exist: student_not_exist,
  event_already_exist: event_already_exist,
  no_activity: no_activity,
  application_no: application_no,
  scholarship_exist: scholarship_exist,
  no_scholarShip: no_scholarShip,
  scholarship_delete_success: scholarship_delete_success,
  scholarship_delete_failure: scholarship_delete_failure,
  branch_not_exist: branch_not_exist,
  designation_not_exist: designation_not_exist,
  sem_not_exist: sem_not_exist,
  marks_not_added_student: marks_not_added_student,
  members_upload_success: members_upload_success,
  subject_upload_success: subject_upload_success,
  project_title_exist: project_title_exist,
  project_exist: project_exist,
  project_delete_success: project_delete_success,
  project_delete_failure: project_delete_failure,
  no_project: no_project
};
