import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    // Generate token (expires in 7 days)
    const token = jwt.sign(
      { email }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '7d' }
    );
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return res.json({ success: true, message: 'Logged in successfully' });
  }
  
  res.status(401);
  throw new Error('Invalid credentials');
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});
