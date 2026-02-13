import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { error } from '../utils/response';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json(error("User not found"));
      }

      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json(error("Not authorized, token failed"));
    }
  }

  if (!token) {
    return res.status(401).json(error("Not authorized, no token"));
  }
};
