import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { success, error } from '../utils/response';
import { RegisterInput, LoginInput } from '@finalstep/shared';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRED || '7d',
  } as jwt.SignOptions);
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, school, targetUniversity } = req.body as RegisterInput;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(error('Email already registered'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      school,
      targetUniversity,
      role: 'student', // Force student role on public register
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json(
      success('Registration successful', {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(error('Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(401).json(error('Invalid email or password'));
    }

    // Update last active
    user.lastActiveDate = new Date();
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json(
      success('Login successful', {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.name.slice(0, 2).toUpperCase(),
        },
        token,
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
        return res.status(401).json(error('Not authorized'));
    }
    const userData = await User.findById(user._id).select('-password');
    if (!userData) {
      return res.status(404).json(error('User not found'));
    }
    res.json(success('User profile', userData));
  } catch (err) {
    next(err);
  }
};
