import { z } from "zod";

export const menuSchema = z.object({
    name : z.string().nonempty("Name is required"),
    description : z.string().nonempty("Description is required"),
    price : z.number().min(0, "Price cannot be negative"),
    image : z.instanceof(File).optional().refine((file) => file?.size !== 0, {message : "Image file is required"}),
})

export type menuState = z.infer<typeof menuSchema>
