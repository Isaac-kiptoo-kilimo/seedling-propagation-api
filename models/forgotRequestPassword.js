import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const forgotPasswordRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  expiryDate: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

const ForgotPasswordRequest = mongoose.model("ForgotPasswordRequest", forgotPasswordRequestSchema);

export const createRequest = async function (user) {
  let expiredAt = new Date();
  const lifetime = parseInt(process.env.FORGOT_PASSWORD_CODE_LIFETIME.slice(0, -1)); 
  expiredAt.setSeconds(expiredAt.getSeconds() + lifetime);

  const code = uuidv4();

  const request = await ForgotPasswordRequest.create({
    code,
    userId: user._id,
    expiryDate: expiredAt,
    activated: false,
  });

  return request.code;
};

export const validateRequestExpiry = (request) => {
  return request.expiryDate.getTime() > new Date().getTime();
};

export const validateInactiveRequest = (request) => {
  return !request.activated;
};

export default ForgotPasswordRequest;
