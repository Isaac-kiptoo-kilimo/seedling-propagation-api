import { generatePlatformJWT } from "../middlewares/jwt.js";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import ForgotPasswordRequest, {
  createRequest,
  validateRequestExpiry,
  validateInactiveRequest,
} from "../models/forgotRequestPassword.js";
import { sendEmail } from "../services/email.service.js";
import { RESET_PASSWORD_EMAIL } from "../email.template.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const validPassword = await user.validPassword(password);
      if (validPassword) {
        const accessToken = await generatePlatformJWT({ userObject: user });

        const { password, ...userWithoutPassword } = user._doc;

        const data = {
          accessToken,
          user: userWithoutPassword,
        };

        return res.status(200).json({
          success: true,
          message: "Logged in successfully",
          data,
        });
      }
    }

    return res.status(200).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred logging in",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
        userId: user._id,
      }).sort({ createdAt: -1 });

      if (
        !forgotPasswordRequest ||
        !validateRequestExpiry(forgotPasswordRequest)
      ) {
        // Create a new request
        const token = await createRequest(user);
        // Send an email to the user
        const {
          FRONTEND_RESET_PASSWORD_URL,
        } = process.env;

        if (!FRONTEND_RESET_PASSWORD_URL) throw new Error("No reset‑password base URL configured");
        if (!token) throw new Error("Reset token is missing");

        await sendEmail({
          to: user.email,
          subject: "RESET PASSWORD LINK",
          message: RESET_PASSWORD_EMAIL({
            name: user.fullName,
            link: `${FRONTEND_RESET_PASSWORD_URL}/${token}`,
          }),
        });

        return res.status(200).json({
          success: true,
          message: "Reset password link sent to email",
          data: token,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Reset password link has already been sent to your email",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid email address",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred. Try Again!",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { code, password } = req.body;

    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ code });

    if (!forgotPasswordRequest) {
      return res.status(403).json({
        success: false,
        message: "Invalid reset password code.",
      });
    }

    if (!validateRequestExpiry(forgotPasswordRequest)) {
      return res.status(403).json({
        success: false,
        message: "Reset password code is already expired.",
      });
    }

    if (!validateInactiveRequest(forgotPasswordRequest)) {
      return res.status(403).json({
        success: false,
        message: "Reset password code has already been used.",
      });
    }

    const user = await User.findById(forgotPasswordRequest.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;

    // ✅ Direct bcrypt usage
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (isSamePassword) {
      return res.status(200).json({
        success: false,
        message: "New password is similar to the old password.",
      });
    }

    user.password = password;
    await user.save(); // password will still be hashed by pre-save hook

    forgotPasswordRequest.activated = true;
    await forgotPasswordRequest.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred resetting password. Try again!",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const loggedInUser = await User.findById(req.user.id);

    const validPassword = await loggedInUser.validPassword(currentPassword);

    if (validPassword) {
      if (currentPassword !== newPassword) {
        loggedInUser.password = newPassword;
        await loggedInUser.save();

        return res.status(200).json({
          success: true,
          message: "Password has been changed successfully.",
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "New password cannot be similar to the old password.",
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "Current Password is incorrect. Try Again.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred changing password. Try Again!",
    });
  }
};
