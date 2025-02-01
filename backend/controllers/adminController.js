import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

export const getUserByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('Searching for student ID:', studentId);
    
    const user = await User.findOne({ studentId }).select('-password -pin');
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const wallet = await Wallet.findOne({ userId: user._id });
    console.log('Found wallet:', wallet);
    
    const transactions = await Transaction.find({ userId: user._id })
      .sort({ transactionDate: -1 })
      .limit(10);
    console.log('Found transactions:', transactions);

    res.json({
      user,
      balance: wallet?.balance || 0,
      transactions
    });
  } catch (error) {
    console.error('Error in getUserByStudentId:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only allowed fields using findByIdAndUpdate with specific options
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName
      },
      { 
        new: true, // Return updated document
        runValidators: false, // Disable validation
        select: '-password -pin' // Exclude sensitive fields
      }
    );

    // Return success response with updated user data
    res.json({ 
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        studentId: updatedUser.studentId
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete user's wallet
    await Wallet.deleteOne({ userId: id });
    
    // Delete user's transactions
    await Transaction.deleteMany({ userId: id });
    
    // Delete user
    await User.findByIdAndDelete(id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};