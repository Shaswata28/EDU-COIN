import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -pin');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName },
      { 
        new: true,
        runValidators: false,
        select: '-password -pin'
      }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, pin } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !pin) {
      return res.status(400).json({ 
        message: 'Current password, new password, and PIN are required' 
      });
    }

    // Get user with password and pin
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Verify PIN
    const isPinValid = await user.matchPin(pin);
    if (!isPinValid) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update only the password field using findByIdAndUpdate
    await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { 
        runValidators: false // Disable validation
      }
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};