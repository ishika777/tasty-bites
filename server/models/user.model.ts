import mongoose from "mongoose";

export interface IUser {
    fullname : string;
    email : string;
    password : string;
    contact : number;
    address : string;
    city : string;
    country : string;
    profilePicture : string;
    admin : boolean;
    lastLogin? : Date;
    isVerified? : boolean;
    resetPasswordToken? : string;
    resetPasswordTokenExpiresAt? : Date;
    verificationCode? : string;
    verificationCodeExpiresAt? : Date;
}

export interface IUserDocument extends IUser, Document{
    createdAt : Date;
    updatedAt : Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    contact : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },
    country : {
        type : String,
       default : ""
    },
    profilePicture : {
        type : String,
        default : ""
    },
    admin : {
        type : Boolean,
        default : false
    },
    // advance authentication
    lastLogin : {
        type : Date,
        default : Date.now
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String,
    },
    resetPasswordTokenExpiresAt : {
        type : Date
    },
    verificationCode : {
        type : String
    },
    verificationCodeExpiresAt : {
        type : Date
    }
}, {timestamps : true})

const User = mongoose.model("User", userSchema)
export default User