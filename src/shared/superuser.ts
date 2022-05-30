import * as bcrypt from "bcrypt";
import { User } from "../model/user_db";

const initialize = async () => {
  console.log("initialize method");
  const adminexists = await User.findOne({
    login_id: "support@techteamalpha.com",
  });
  if (!adminexists) {
    let adminUser = {
      login_id: "support@techteamalpha.com",
      username: "admin",
      password: "",
      designation: "5fb916d74a97fb2660b8bbe1",
      branch: "5fb9155c8dcf263778fe0fbd",
      mobile_number: "8050492201",
      email_id: "support@techteamalpha.com",
      batch: "2020",
      role: "admin",
      scheme:"5fb917e01b180f008c6ccd32"
    };
    const hashPassword = await bcrypt.hash(adminUser.password, 10);
    adminUser.password = hashPassword;
    const adminUserObj = await new User(adminUser);
    await adminUserObj.save();
  }
};

export default initialize;
