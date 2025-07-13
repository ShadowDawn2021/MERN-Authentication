import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

//Register new account
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //SENDING EMAIL
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome aspiring fullstack developer",
      text: "Welcome aspiring fullstack developer, with this project your are one step closer to your dreams and goals",
    };

    await transporter.sendMail(mailOption);

    return res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      message: `error part registration error code:${error.message}`,
    });
  }
};
//Login account
export const logIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const passIsMatch = await bcrypt.compare(password, user.password);

    if (!passIsMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//Logout account
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      //in env if changed to production the strict mode will be removed
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//Used to send OTP to user email
export const sendVerificationOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    console.log(user);
    if (user.isVerified) {
      return res.json({
        success: false,
        message: "Account is already verified",
      });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.verificationOTP = OTP;
    user.verificationOtpExp = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const sendOTP = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your email",
      text: `here is your verification number ${OTP}`,
    };

    await transporter.sendMail(sendOTP);
    res.json({
      success: true,
      message: " OTP Verification send to user email",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//Used to verify user email
export const verifyEmail = async (req, res) => {
  const { OTP } = req.body;
  const userId = req.userId;

  if (!userId || !OTP) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verificationOTP === "" || user.verificationOTP !== OTP) {
      return res.json({ success: false, message: " Invalid OTP" });
    }

    if (user.verificationOtpExp < Date.now()) {
      return res.json({ success: false, message: " OTP expired" });
    }

    user.isVerified = true;
    user.verificationOTP = "";
    user.verificationOtpExp = 0;
    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Checks if the user is authenitcated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Sends password rest OTP
export const sendResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!email) {
      return res.json({ success: false, message: "Email is invalid" });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = OTP;
    user.resetOtpExp = Date.now() + 15 * 60 * 1000;
    await user.save();

    const sendOTP = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset code",
      text: `Here is your password reset code ${OTP}`,
    };

    await transporter.sendMail(sendOTP);
    return res
      .status(200)
      .json({ success: true, message: `Password reset code sent to ${email}` });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Reeseting user password
export const passReset = async (req, res) => {
  const { OTP, email, newPassword } = req.body;

  if (!OTP || !email || !newPassword) {
    res.status(400).json({
      success: false,
      message: "Missing credentials",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.resetOtp === "" || user.resetOtp !== OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExp < Date.now()) {
      res.status(400).json({
        success: false,
        message: "Expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExp = 0;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset has been successful" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
