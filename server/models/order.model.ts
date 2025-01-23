import mongoose from "mongoose";

type deliveryDetails = {
    email : string;
    name : string;
    address : string;
    city : string;
}

type cartItems = {
    menuId : string;
    name : string;
    image : string;
    price : number;
    quantity : number;
}

export interface IOrder{
    user : mongoose.Schema.Types.ObjectId;
    restaurant : mongoose.Schema.Types.ObjectId;
    deliveryDetails : deliveryDetails;
    cartItems : cartItems;
    totalAmount : number;
    status : "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered"
}

export interface IOrderMenu extends IOrder, Document{
    createdAt : Date;
    updatedAt : Date
}

const orderSchema = new mongoose.Schema<IOrderMenu>({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    restaurant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Restaurant",
        required : true
    },
    deliveryDetails : {
        email : {
            type : String,
            required : true
        },
        name : {
            type : String,
            required : true
        },
        address : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
    },
    cartItems : [
        {
            menuId : {
                type : String,
                required : true
            },
            name : {
                type : String,
                required : true
            },
            image : {
                type : String,
                required : true
            },
            price : {
                type : Number,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            }
        }
    ],
    totalAmount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "confirmed", "preparing", "outfordelivery", "delivered"],
        required : true
    }
}, {timestamps : true})

const Order = mongoose.model("Order", orderSchema)
export default Order