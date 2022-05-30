import jwt from "jsonwebtoken";
import { User } from "../model/user_db";
import { key } from "../config/key";
import { responseStatus } from "../shared/response_status";

export const auth = async (req: any, res: any, next: any): Promise<any> => {
  try {
    let token = req.headers.authorization.replace("Bearer ", "");
    let data: any = await jwt.verify(token, key.jwtAuthSecretKey);
    const user = await User.findOne({ _id: data.id, jwt_token: token });
    if (!user) {
      throw new Error();
    }
    req.user = data;
    req.token = token;
    next();
  } catch (err) {
    return res.send({
      status: 401,
      message: responseStatus.auth_error,
      err: err,
    });
  }
};
