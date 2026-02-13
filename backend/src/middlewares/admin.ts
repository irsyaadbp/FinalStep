import { Request, Response, NextFunction } from "express";
import { error } from "../utils/response";

export const admin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json(error("Not authorized as an admin"));
  }
};
