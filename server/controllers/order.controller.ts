import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import Order from "../models/order.model.js";
import Razorpay from "razorpay";


type checkoutSessionRequestType = {
    cartItems : {
        menuId : string;
        name : string;
        image : string;
        price : number;
        quantity : number;
    }[],
    deliveryDetails : {
        name : string;
        email : string;
        address : string;
        city :string;
    },
    restaurantId : string;
}


export const createCheckoutSession = async(req:Request, res:Response): Promise<void> => {
    try {
        const checkoutSessionRequest : checkoutSessionRequestType = req.body;
        console.log(checkoutSessionRequest)
        const totalAmount = checkoutSessionRequest.cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 100
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate("menus")
        if(!restaurant){
            res.status(404).json({
                success : false,
                message : "Restaurant not found"
            });
            return;
        }
        const order :any = new Order({
            restaurant : restaurant._id,
            user : req.id,
            deliveryDetails : checkoutSessionRequest.deliveryDetails,
            cartItems : checkoutSessionRequest.cartItems,
            totalAmount,
            status : "pending"
        })
        // const menuItems = restaurant.menus;
        // const lineItems = await createLineItems(checkoutSessionRequest, menuItems);
        // console.log(lineItems)
        
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string
        })
        const razorpayOrderRequest = {
            amount: totalAmount,
            currency: "INR",
            receipt: `receipt_order_${order._id}`,
            notes: {
                restaurantId: checkoutSessionRequest.restaurantId,
                userId: req.id,
                deliveryDetails: JSON.stringify(checkoutSessionRequest.deliveryDetails),
                cartItems: JSON.stringify(checkoutSessionRequest.cartItems)
            }
        };
        const razorpayOrder = await razorpay.orders.create(razorpayOrderRequest);

        // Save Order in Database
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        res.status(200).json({
            success: true,
            options: {
                message: "Payment initiated",
                orderId: razorpayOrder.id,
                amount: totalAmount,
                currency: "INR",
                key: process.env.RAZORPAY_KEY_ID, 
            }
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
        
    }
}

// export const createLineItems = (checkoutSessionRequest:checkoutSessionRequestType, menuItems:any) => {
//     //create line item
//     const lineItems = checkoutSessionRequest.cartItems.map((cartIem) => {
//         const menuItem = menuItems.find((item:any) => item._id.toString() === cartIem.menuId);
//         if(!menuItem){
//             throw new Error("Menu Item Id not found")
//         }
//         return {
//             price_data : {
//                 currency : "inr",
//                 product_data : {
//                     name : menuItem.name,
//                     images : [menuItem.imge],
//                 },
//                 unit_amount : menuItem.price * 100
//             },
//             quantity : cartIem.quantity
//         }
//     }) 

//     //return line items
//     return lineItems;
// }

export const getOrders = async(req:Request, res:Response): Promise<void> => {
    try {
        const orders = await Order.find({user : req.id}).populate("user").populate("restaurant");
        if(!orders){
            res.status(404).json({
                success : false,
                message : "Order not found"
            });
            return;
        }
        res.status(200).json({
            success : true,
            orders
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
        
    }
}
