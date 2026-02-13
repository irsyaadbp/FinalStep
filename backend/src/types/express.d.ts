import { IUser } from "../models/User";

export {};
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // or a stricter type if you want
    }
  }
}
