import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import crypto from "crypto"
import cloudinary from "../utils/cloudinary.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateToken } from "../utils/generateToken.js";
import { sendPasswordResetEmail, sendResetSuccessfulEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";


export const signup = async(req:Request, res:Response): Promise<void> => {
    try {
        const {fullname, email, password, contact, admin} = req.body;

        let user = await User.findOne({email})
        if(user){
            res.status(400).json({
                success : false,
                message : "User already exist with this email"
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode= generateVerificationCode(6)
        user = await User.create({
            fullname,
            email,
            password : hashedPassword,
            contact : Number(contact),
            admin : admin === "true" ? true : false,
            verificationCode,
            verificationCodeExpiresAt : Date.now()+24*60*60*1000 //1day
        })
        generateToken(res, user)
        await sendVerificationEmail(email, verificationCode)
        const userWithoutPassword = await User.findOne({email}).select("-password")
        res.status(201).json({
            success : true,
            message : "Account created successfully",
            user : userWithoutPassword
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}

export const login = async(req:Request, res:Response): Promise<void> => {
    try {
        const {email, password, admin} = req.body
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            });
            return;
        }
        if(!user.isVerified){
            res.status(400).json({
                success : false,
                message : "Email not verified"
            });
            return;
        }
        
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if(!isCorrectPassword){
            res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            });
            return;
        }
        if(user.admin !== (admin === "true" ? true : false)){
            res.status(400).json({
                success : false,
                message : "Incorrect email or password"
            });
            return;
        }
        generateToken(res, user)
        user.lastLogin = new Date();
        await user.save()

        const userWithoutPassword = await User.findOne({email}).select("-password")
        res.status(200).json({
            success : true,
            message : `Welocme back ${user.fullname}`,
            user : userWithoutPassword
        });
        return;

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}

export const verifyEmail = async(req:Request, res:Response): Promise<void> => {
    //verify code sent to email
    try {
        const {verificationCode} = req.body;
        const user = await User.findOne({verificationCode : verificationCode, verificationCodeExpiresAt : {$gt : Date.now()}}).select("-password")

        if(!user){
            res.status(400).json({
                success : false,
                message : "Invalid or Expired verification code"
            })
            return;
        }
        
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiresAt = undefined;
        await user.save()

        //send welcome email
        await sendWelcomeEmail(user.email, user.fullname)

        res.status(200).json({
            success : true,
            message : "Email verified successfully",
            user
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}

export const logout = async(req:Request, res:Response): Promise<void> => {
    try {
        res.clearCookie("token").status(200).json({
            success : true,
            message : "Looged out successfully"
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}

export const forgotPassword = async(req:Request, res:Response): Promise<void> => {
    //sent reset password link to email
    try {
        const {email} = req.body;
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({
                success : false,
                message : "User doesn't exist "
            });
            return;
        }
        const resetToken = crypto.randomBytes(40).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1*60*60*1000); //1hr
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save()

        //send email
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`)
        res.status(200).json({
            success : true,
            message : "Password reset link sent to your email"
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}

export const resetpassword = async(req:Request, res:Response): Promise<void> => {
    try {
        const {resetToken} = req.params;
        const {newPassword} = req.body;
        const user = await User.findOne({resetPasswordToken : resetToken, resetPasswordTokenExpiresAt : {$gt : new Date(Date.now())}})
        if(!user){
            res.status(400).json({
                success : false,
                message : "Invalid or Expired verification link"
            });
            return;
        }
        
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        //send successfully password changed email
        await sendResetSuccessfulEmail(user.email)

        res.status(200).json({
            success : true,
            message : "Password reset successfully"
        });
        return;
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}

export const checkAuth = async(req:Request, res:Response): Promise<void> => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if(!user){
            res.status(404).json({
                success : false,
                message : "User not found"
            });
            return;
        }
        res.status(200).json({
            success : true,
            user
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}

export const updateProfile = async(req:Request, res:Response): Promise<void> => {
    try {
        const userId = req.id;
        const {fullname, email, address, city, country, profilePicture} = req.body;
        //upload image on cloudinary
        let cloudResponse:any;
        cloudResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedData = {fullname, email, address, city, country, profilePicture}
        
        const user = await User.findByIdAndUpdate(userId, updatedData, {new : true}).select("-password");

        res.status(200).json({
            success : true,
            message : "Profile updated successfully",
            user
        });
        return;

    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
}