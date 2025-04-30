import { WELCOME_EMAIL } from "../email.template.js";
import User from "../models/users.js";
import { sendEmail } from "../services/email.service.js";
function generateRandomNumberString(firstName) {
  // Get current timestamp
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const timestamp = new Date().getTime().toString().slice(-4);
  const randString = capitalizedFirstName + '@' + timestamp;
  return randString;
}
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const filter = { role: "customer", isActive: true };

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Retrieved all users successfully",
      users,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
  
export const createUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      role: "customer",
    });

    res.status(201).json({ success: true, message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || user.role !== "customer" || !user.isActive) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const update = await User.findOneAndUpdate(
      { _id: userId, role: "customer",isActive: true },
      req.body,
      { new: true }
    );
    if (!update) return res.status(404).json({ success: false, message: "User not found" });

    console.log("req.body,", req.body);
    console.log("update user,", update);
    
    res.status(200).json({ success: true, message: "User updated successfully", user: update });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.params.userId, role: "customer" });
    if (!result) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted permanently" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId, role: "customer",isActive: true  },
      { isActive: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User soft-deleted", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId, role: "customer",isActive: false  },
      { isActive: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User Restored Successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const filter = { role: "staff" };

    const totalStaff = await User.countDocuments(filter);

    const staff = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
      
    res.status(200).json({
      success: true,
      message: "Retrieved all staff successfully",
      staff,
      currentPage: Number(page),
      totalPages: Math.ceil(totalStaff / limit),
      totalStaff,
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { fullName, email, phoneNumber,password } = req.body;
    // const password = generateRandomNumberString(fullName);
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      role: "staff",
    });

    await sendEmail({
      to: email,
      subject:"WELCOME",
      message:WELCOME_EMAIL({
          name:user.fullName,
          email:user.email,
          link:process.env.FRONTEND_LOGIN_URL,
          ...(password && {password})
      })
  });

    res.status(201).json({ success: true, message: "Staff user created successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.staffId);
    if (!staff || staff.role !== "staff" || !staff.isActive) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }
    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const update = await User.findOneAndUpdate(
      { _id: staffId, role: "staff", isActive: true },
      req.body,
      { new: true }
    );
    if (!update) return res.status(404).json({ success: false, message: "Staff not found" });

    res.status(200).json({ success: true, message: "Staff updated successfully", staff: update });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ _id: req.params.staffId, role: "staff" });
    if (!result) return res.status(404).json({ success: false, message: "Staff not found" });

    res.status(200).json({ success: true, message: "Staff deleted permanently" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const softDeleteStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      { _id: req.params.staffId, role: "staff", isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });

    res.status(200).json({ success: true, message: "Staff soft-deleted", staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreStaff = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      { _id: req.params.staffId, role: "staff", isActive: false },
      { isActive: true },
      { new: true }
    );
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });

    res.status(200).json({ success: true, message: "Staff Restored Successfully", staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
