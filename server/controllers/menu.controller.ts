import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload.js";
import Menu from "../models/menu.model.js";
import Restaurant from "../models/restaurant.model.js";
import mongoose from "mongoose";
import { resetpassword } from "./user.controller";

export const addMenu = async(req:Request, res:Response): Promise<void> => {
    try {
        const {name, description, price} = req.body;
        const file = req.file;
        if(!file){
            res.status(404).json({
                success : false,
                message : "Image is required"
            });
            return;
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu : any = await Menu.create({
            name,
            description,
            price,
            image : imageUrl
        })
        const restaurant = await Restaurant.findOne({user : req.id});
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id)
            await restaurant.save();
        }
        res.status(201).json({
            success : true,
            menu,
            message : "Menu added successfully"
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const editMenu = async(req:Request, res:Response): Promise<void> => {
    try {
        const {name, description, price} = req.body;
        const {id} = req.params;
        const file = req.file;
        const menu = await Menu.findById(id)
        if(!menu){
            res.status(404).json({
                success : false,
                message : "Menu not found"
            });
            return;
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;
        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File)
            menu.image = imageUrl
        }
        await menu.save()
        res.status(200).json({
            success : true,
            message : "Menu Updated Successfully",
            menu
        });
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error"})
    }
}
