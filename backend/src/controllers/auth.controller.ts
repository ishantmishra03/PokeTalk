import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUserDocument } from '../models/User';
import { AuthRequest } from '../middlewares/authVerify';

const JWT_EXPIRE = 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === 'production';

// Sets cookie
const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: JWT_EXPIRE,
  });
};

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser: IUserDocument | null = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: 'Email already registered' });

    const existingUsername: IUserDocument | null = await User.findOne({ username });
    if (existingUsername) return res.json({ success: false, message: 'Username not available' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: IUserDocument = new User({ name, email, username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    setAuthCookie(res, token);

    res.status(201).json({ success: true, message: 'User registered successfully', user: { id: user._id, name: user.name } });
  } catch {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!password || (!email && !username)) {
      return res.status(400).json({ success: false, message: 'Email or username and password are required' });
    }

    const user: IUserDocument | null = await User.findOne({
      $or: [
        { email: email || '' },
        { username: username || '' }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Logout
export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
  });

  res.json({success: true, message: 'Logged out successfully' });
};

// IsAuthenticated
export const isAuth = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const user: IUserDocument | null = await User.findById(userId);
    if (!user) return res.status(401).json({success: false, message: 'Something went wrong' });

     res.json({success: true, user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({success: false, message: 'Internal server error' });
  }
}