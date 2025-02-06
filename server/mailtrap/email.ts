import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlContent.js";
import {client, sender} from "./mailtrap"

export const sendVerificationEmail = async(email:string, verificationCode:string) => {
    const recipients = [
        {
          email
        }
    ];
    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            html : htmlContent.replace("{verificationToken}", verificationCode),
            category: "Email Verification",
        })
    .then(console.log, console.error);
    } catch (error) {
        console.log(error)
        throw new Error("Failed to send verification email")
    }
}

export const sendWelcomeEmail = async(email:string, name:string) => {
    const recipients = [
        {
          email
        }
    ];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Welcome to TastyBites",
            html : htmlContent,
            template_variables : {
                company_info_name : "TastyBites",
                name : name
            }
        })
    .then(console.log, console.error);
    } catch (error) {
        console.log(error)
        throw new Error("Failed to send welcome email")
    }
}

export const sendPasswordResetEmail = async(email:string, resetUrl:string) => {
    const recipients = [
        {
          email
        }
    ];
    const htmlContent = generatePasswordResetEmailHtml(resetUrl);
    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Reset Your Passwrod",
            html : htmlContent,
            category: "Reset Password",
        })
    } catch (error) {
        console.log(error)
        throw new Error("Failed to reset password")
    }
}

export const sendResetSuccessfulEmail = async(email:string) => {
    const recipients = [
        {
          email
        }
    ];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Password Reset Succesfully",
            html : htmlContent,
            category: "Password Reset",
        })
    .then(console.log, console.error);
    } catch (error) {
        console.log(error)
        throw new Error("Failed to send password reset success email")
    }
}

