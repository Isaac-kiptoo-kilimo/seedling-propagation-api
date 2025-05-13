import User from '../models/users.js';
import { adminUser } from '../utils/auth.js';
import dotenv from 'dotenv'

dotenv.config();

export const ok = (_, res) => {
  res.send('ok');
};

export const ready = async (_, res) => {
  try {
    await User.db;
    res.send('ok');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const dbtest = async (_, res) => {
  try {
    // Check if any admin user exists
    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      // Create the admin
      admin = await User.create({
        ...adminUser,
        password: process.env.ADMINUSERPASSWORD,
        role: 'admin'
      });
    }

    return res.json({
      success: true,
      message: "DB test successful",
      data: {
        admin: {
          name: admin.fullName,
          email: admin.email
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during DB test",
      error: error.message
    });
  }
};
