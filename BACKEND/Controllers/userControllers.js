import userModel from "../Models /User.js";
import validator from "validator";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const generateAndSendOTP = async (email) => {
    const receiver = await userModel.findOne({ email });

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.ADMIN_EMAIL, // your email address to send OTP from
            pass: process.env.ADMIN_APP_PASSWORD, // your email App_password
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "Your OTP Code for Form Builder",
        text: `Your OTP code is ${otp}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    await userModel.findOneAndUpdate(receiver, { otp: otp });
    return true;
};

const registerUser = async (req, res) => {
    const { name, password } = req.body.signupData
    let { email } = req.body.signupData
    email = email.toLowerCase();

    try {
        // validating email format and strong password:
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        // Checking if our password length is greater than 8 digit or not:
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter a strong password",
            });
        }

        // checking if user already exists:
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists, Please login" });
        }

        // hashing user password with bcrypt:
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // hashing password with salt using bcrypt.

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save(); // Registering user in DB.
    } catch (error) {
        res.json({ success: false, message: "Error registering user" });
    }

    // Sending OTP to user:
    try {
        if (generateAndSendOTP(email)) {
            res.json({ success: true, message: "OTP sent to your email", email });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error sending OTP" });
    }
}

const loginUser = async (req, res) => {
    const { password } = req.body.loginData
    let { email } = req.body.loginData
    email = email.toLowerCase();

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User Doesn't exists" });
        }

        // Validating Password:
        const isMatch = await bcrypt.compare(password, user.password); // To check the password we will compare the current entered password with hashed password.

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (user.isEmailVerified == false) {
            if (generateAndSendOTP(email)) {
                res.json({ success: true, message: "Email is not verified, Please check your email for OTP", email });
            }
        } else {
            // If isEmailVerified is true, create token based on user's Id.
            const token = createToken(user._id);
            res.json({ success: true, message: "User logged in", token });
        }
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

const verifyEmailOtp = async (req, res) => {
    const { otp } = req.body.data;
    let { email } = req.body
    email = email.toLowerCase()

    const user = await userModel.findOne({ email });
    const generatedOtp = user.otp;
    try {
        // Validate OTP
        if (otp !== generatedOtp) {
            return res.json({
                success: false,
                message: "Invalid OTP",
            });
        } else {
            await userModel.findOneAndUpdate(user, { isEmailVerified: true });

            // creating token based on user's Id
            const token = createToken(user._id);
            res.json({ success: true, message: "Registration Successful", token });
        }
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

// Forgot password starts here:

const forgot_password = async (req, res) => {
    let { email } = req.body.data;
    email = email.toLowerCase()

    try {
        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User with this email does not exist",
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Update user with reset token and reset link expiration time
        user.resetPasswordToken = crypto // Hashing reset token before storing it in the database
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save(); // saving resetPasswordToken and resetPasswordExpire in DB

        // Send email
        const resetUrl = `${process.env.FrontEndURL}/reset_password/${resetToken}`;
        const message = `Please click on the following link to reset your password: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request for Form Builder",
                message,
            });

            res.status(200).json({ success: true, message: "Email sent, Please check your email for reset link" });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save(); // on failure, discard changes on DB
            res
                .status(500)
                .json({ success: false, message: "Email could not be sent" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// Email for password reset link:
const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
};

// Forgot password ends here.

const reset_password = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token before finding the user in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by reset token and check if it's expired
    const user = await userModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid token or token has expired" });
    }

    // Update the password
    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful, Please login again" });
};

export { registerUser, loginUser, verifyEmailOtp, forgot_password, reset_password }