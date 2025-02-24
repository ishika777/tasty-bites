import { z } from "zod";

export const userSignupSchema = z.object({
    fullname : z.string().min(3, "Fullname is required"),
    email : z.string().email("Invalid email address"),
    password : z.string().min(6, "Password must be atleast 6 characters"),
    contact : z.string().min(10, "Contact number must be 10 digits").max(10, "Contact number must be 10 digits"),
    admin : z.enum(["true", "false"], {message: "Please select a role",}),
})

export type SignupInputState = z.infer<typeof userSignupSchema>

export const userLoginSchema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string().min(6, "Password must be atleast 6 characters"),
    admin : z.enum(["true", "false"], {message: "Please select a role",}),
})

export type LoginInputState = z.infer<typeof userLoginSchema>