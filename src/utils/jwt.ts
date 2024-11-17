import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// config dotenv
dotenv.config();

const sign = (payload: any) => {
  return jwt.sign(payload, process.env.SECRET_KEY as string);
};

const verify = (token: any) => {
  return jwt.verify(token, process.env.SECRET_KEY as string);
};

export { sign, verify };
