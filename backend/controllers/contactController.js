import Contact from '../models/contactModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Manual validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    
    // Save message to database
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });
    
    const savedContact = await contact.save();
    
    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Restaurant email
      subject: `New Contact Message: ${subject}`,
      html: `
        <h3>New message from ${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
    res.status(201).json(savedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    
    if (message) {
      // Mark as read if not already
      if (!message.read) {
        message.read = true;
        await message.save();
      }
      
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    
    if (message) {
      await message.deleteOne();
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
export const markMessageAsRead = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    
    if (message) {
      message.read = true;
      await message.save();
      res.json({ message: 'Message marked as read' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};