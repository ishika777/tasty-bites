import { z } from "zod";

export const restaurantSchema = z.object({
    restaurantName : z.string().nonempty("Restaurant name is required").min(3, "Restaurant name must be atleast 3 characters long"),
    city : z.string().nonempty("City name is required").min(3, "City name must be atleast 3 characters long"),
    country : z.string().nonempty("Country name is required").min(3, "Country name must be atleast 3 characters long"),
    deliveryTime : z.number().min(0, "Delivery time must be a positive number"),
    cuisines : z.array(z.string()),
    image : z.instanceof(File).optional().refine((file) => file?.size !== 0, {message : "Image file is required"}),
})

export type restaurantState = z.infer<typeof restaurantSchema>
