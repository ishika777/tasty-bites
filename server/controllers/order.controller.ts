import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import Order from "../models/order.model";
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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


// export const createCheckoutSession = async(req:Request, res:Response): Promise<void> => {
//     try {
//         const checkoutSessionRequest : checkoutSessionRequestType = req.body;
//         console.log(checkoutSessionRequest)
//         const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate("menus")
        // if(!restaurant){
        //     res.status(404).json({
        //         success : false,
        //         message : "Restaurant not found"
        //     });
        //     return;
        // }
        // const order :any = new Order({
        //     restaurant : restaurant._id,
        //     user : req.id,
        //     deliveryDetails : checkoutSessionRequest.deliveryDetails,
        //     cartItems : checkoutSessionRequest.cartItems,
        //     status : "pending"
        // })
        // const menuItems = restaurant.menus;
        // const lineItems = await createLineItems(checkoutSessionRequest, menuItems);

        // const session = await stripe.checkout.sessions.create({
        //     payment_method_types: ["card"],
        //     shipping_address_collection: {
        //         allowed_countries: ["GB", "US", "CA"]
        //     },
        //     line_items : lineItems,
        //     mode : "payment",
        //     success_url : `${process.env.FRONTEND_URL}/order/status`,
        //     cancel_url : `${process.env.FRONTEND_URL}/cart`,
        //     metadata : {
        //         orderId : order._id.toString(),
        //         images : JSON.stringify(menuItems.map((item:any) => {
        //             return item.image
        //         }))
        //     }
        // })
        
        // if(!session.url){
        //     res.status(400).json({
        //         success : false,
        //         message : "Error while creating session"
        //     });
        //     return;
        // }
        // await order.save();
        // res.status(200).json({
        //     session
        // });
    //     return;
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({message : "Internal Server Error"})
        
    // }
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
