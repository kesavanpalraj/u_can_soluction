import { Router } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Admin from "../models/Admin.js";
import { verifyToken } from "../middleware/auth.js";
import { Resend } from "resend";

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Too many login attempts. Try again in 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { message: "Too many requests. Try again in an hour" },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Too many OTP attempts. Try again in 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

let resendInstance = null;
const getResend = () => {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (id, expiresIn = "24h") =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(admin._id);
    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin)
      return res.status(404).json({ message: "No account found with that email" });

    const otp = generateOtp();
    admin.otp = otp;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    admin.otpAttempts = 0;
    await admin.save();

    await getResend().emails.send({
      from: "U Can Solution <noreply@ucansolution.com>",
      to: admin.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin)
      return res.status(404).json({ message: "No account found with that email" });

    if (admin.otpAttempts >= 5)
      return res.status(429).json({ message: "Too many attempts. Request a new OTP" });

    if (!admin.otp || !admin.otpExpires)
      return res.status(400).json({ message: "No OTP requested" });

    if (Date.now() > admin.otpExpires.getTime())
      return res.status(400).json({ message: "OTP expired. Request a new one" });

    if (admin.otp !== otp) {
      admin.otpAttempts += 1;
      await admin.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    admin.otp = null;
    admin.otpExpires = null;
    admin.otpAttempts = 0;
    await admin.save();

    const resetToken = generateToken(admin._id, "15m");
    res.json({ resetToken, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    if (!resetToken || !password)
      return res.status(400).json({ message: "Reset token and new password are required" });

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    admin.password = password;
    await admin.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Current and new password are required" });

    const admin = await Admin.findById(req.adminId);
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("email notificationsEnabled");
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });
    res.json({ email: admin.email, notificationsEnabled: admin.notificationsEnabled });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/notifications", verifyToken, async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== "boolean")
      return res.status(400).json({ message: "enabled must be a boolean" });

    const admin = await Admin.findByIdAndUpdate(
      req.adminId,
      { notificationsEnabled: enabled },
      { new: true }
    );
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    res.json({ notificationsEnabled: admin.notificationsEnabled });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
