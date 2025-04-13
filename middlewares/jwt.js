import * as jwt from 'jose';
import User from '../models/users.js';
import dotenv from "dotenv";

dotenv.config();


export const generatePlatformJWT = async ({ userObject }) => {
  const signingKey = new TextEncoder().encode(process.env.JWT_KEY);

  const token = await new jwt.SignJWT({
    sub: userObject._id.toString() 
  })
  .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
  .setExpirationTime(process.env.JWT_LIFETIME || '1h')
  .sign(signingKey);

  return token;
};

export const isJWTValid = async (req, res, next) => {
  try {
    let token = "";

    if (req.headers.authorization) {
      token = req.headers.authorization.trim().split(" ")[1];
      if (token) {
        const key = new TextEncoder().encode(process.env.JWT_KEY);
        const { payload } = await jwt.jwtVerify(token, key);

        const user = await User.findById(payload.sub).select('-password');
        if (!user) {
          return res.status(403).json({
            success: false,
            message: "User not found",
          });
        }

        req.user = user;
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Invalid token format. Use Bearer.",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Authorization header is missing.",
      });
    }
  } catch (error) {
    console.log("JWT error:", error.message);
    return res.status(403).json({
      success: false,
      message: "Token validation failed",
    });
  }
};

