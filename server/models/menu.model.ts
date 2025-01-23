import mongoose from "mongoose";

export interface IMenu{
    name : string;
    description : string;
    price : number;
    image : string;
}

export interface IMenuDocument extends IMenu, Document{
    createdAt : Date;
    updatedAt : Date;
}

const menuSchema = new mongoose.Schema<IMenuDocument>({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    image : {
        type : String,
        required : true
    },
}, {timestamps : true})

const Menu = mongoose.model("Menu", menuSchema)
export default Menu