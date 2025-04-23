import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "staff", "customer"],
    default: "customer",
  },
  county: { type: String },
  streetAddress: { type: String },
  isActive: {
    type: Boolean,
    default: true,
  },
},{ timestamps: true });

// Password hash pre-save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password validation method
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Remove password from API responses
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model("User", userSchema);
