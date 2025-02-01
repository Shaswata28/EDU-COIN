import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  try {
    const { username, password, pin, email, firstName, lastName, studentId } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      password,
      pin,
      email,
      firstName,
      lastName,
      studentId,
    });

    // Create wallet for new user
    await Wallet.create({ userId: user._id });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyCredentials = async (req, res) => {
  try {
    const { studentId, pin } = req.body;
    console.log('Verifying credentials for student ID:', studentId);
    
    // Find user by student ID
    const user = await User.findOne({ studentId });
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Verify PIN
    const isPinValid = await user.matchPin(pin);
    if (!isPinValid) {
      console.log('Invalid PIN');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate reset token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Token expires in 15 minutes
    );

    console.log('Credentials verified successfully');
    res.json({ 
      success: true,
      token,
      message: 'Credentials verified successfully'
    });
  } catch (error) {
    console.error('Verify credentials error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password using findByIdAndUpdate to avoid validation
    await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { runValidators: false }
    );

    res.json({ 
      success: true,
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Reset token has expired' });
    }
    res.status(500).json({ message: error.message });
  }
};