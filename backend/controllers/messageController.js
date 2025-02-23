import Message from '../models/Message.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const sender = req.user._id;

    const newMessage = await Message.create({
      sender,
      subject,
      message
    });

    await newMessage.populate('sender', 'email');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Send broadcast message (admin only)
export const sendBroadcast = async (req, res) => {
  try {
    const { subject, message } = req.body; // Destructure subject and message
    const sender = req.user._id;

    // Get all student users
    const students = await User.find({ role: 'student' });

    // Create notifications for all students
    await Promise.all(students.map(student => 
      createNotification({
        userId: student._id,
        title: subject, // Use the subject as the title
        message: message, // Use the actual message from the request body
        type: 'broadcast'
      })
    ));

    const broadcast = await Message.create({
      sender,
      subject: `[BROADCAST] ${subject}`,
      message,
      isBroadcast: true
    });

    res.status(201).json({
      success: true,
      message: 'Broadcast sent successfully',
      data: broadcast
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ message: 'Failed to send broadcast' });
  }
};

// Reply to a message
export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const sender = req.user._id;

    // Get original message
    const originalMessage = await Message.findById(id).populate('sender', 'email');
    if (!originalMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Create reply message
    const reply = await Message.create({
      sender,
      subject: `Re: ${originalMessage.subject}`,
      message,
      replyTo: id
    });

    // Create notification for original sender
    await createNotification({
      userId: originalMessage.sender._id,
      title: 'New Reply',
      message: `You have a new reply to your message: ${originalMessage.subject}`,
      type: 'message'
    });

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: reply
    });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
};

// Get all messages (admin only)
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'email')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark message as read' });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};