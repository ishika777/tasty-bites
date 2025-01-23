import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { restaurantSchema, restaurantState } from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";


const Restaurant = () => {
    const { loading, restaurant, createRestaurant, updateRestaurant, getRestaurant } = useRestaurantStore();
    const [errors, setErrors] = useState<Partial<restaurantState>>({})
    const [input, setInput] = useState<restaurantState>({
        restaurantName: "",
        city: "",
        country: "",
        deliveryTime: 0,
        cuisines: [],
        image: undefined,
    })

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({
            ...input,
            [name]: type === "number" ? Number(value) : value
        })
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = restaurantSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors
            setErrors(fieldErrors as Partial<restaurantState>)
            return;
        }
        try {
            const formData = new FormData();
            formData.append("restaurantName", input.restaurantName)
    
            formData.append("city", input.city)
            formData.append("country", input.country)
            formData.append("deliveryTime", input.deliveryTime.toString())
            formData.append("cuisines", JSON.stringify(input.cuisines))
    
            if (input.image) {
                formData.append("imageFile", input.image)
            }
            if (restaurant) {
                //update
                await updateRestaurant(formData)
            } else {
                //create
                await createRestaurant(formData)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchRestaurant = async () => {
            await getRestaurant();
            setInput({
                restaurantName: restaurant?.restaurantName || "",
                city: restaurant?.city || "",
                country: restaurant?.country || "",
                deliveryTime: restaurant?.deliveryTime || 0,
                cuisines: restaurant?.cuisines ? restaurant?.cuisines.map((cuisine: string) => cuisine) : [],
                image: undefined,
            })
        }
        fetchRestaurant()
    }, [])

    return (
        <div className="max-w-7xl mx-auto my-10">
            <div>
                <div>
                    <h1 className="font-extrabold text-2xl mb-5">Add Reataurants</h1>
                    <form onSubmit={submitHandler}>
                        <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                            <div>
                                <Label>Restaurant Name</Label>
                                <Input
                                    type="text"
                                    name="restaurantName"
                                    placeholder="Enter Restaurant Name"
                                    value={input.restaurantName}
                                    onChange={changeEventHandler}
                                //   required
                                />
                                {
                                    errors && <span className="text-xs text-red-500">{errors.restaurantName}</span>
                                }
                            </div>
                            <div>
                                <Label>City</Label>
                                <Input
                                    type="text"
                                    name="city"
                                    placeholder="Enter your City name"
                                    value={input.city}
                                    onChange={changeEventHandler}
                                //   required
                                />
                                {
                                    errors && <span className="text-xs text-red-500">{errors.city}</span>
                                }
                            </div>
                            <div>
                                <Label>Country</Label>
                                <Input
                                    type="text"
                                    name="country"
                                    placeholder="Enter your Country name"
                                    value={input.country}
                                    onChange={changeEventHandler}
                                //   required
                                />
                                {
                                    errors && <span className="text-xs text-red-500">{errors.country}</span>
                                }
                            </div>
                            <div>
                                <Label>Estimated Delivery Time (minutes)</Label>
                                <Input type="number" name="deliveryTime" placeholder="0" value={input.deliveryTime} onChange={changeEventHandler} />
                                {
                                    errors && <span className="text-xs text-red-500">{errors.deliveryTime}</span>
                                }
                            </div>
                            <div>
                                <Label>Cuisines</Label>
                                <Input
                                    type="text"
                                    name="cuisines"
                                    placeholder="e.g. Chinese, Indian, etc."
                                    value={input.cuisines}
                                    onChange={(e) => setInput({ ...input, cuisines: e.target.value.split(",") })}
                                //   required
                                />
                                {
                                    errors && <span className="text-xs text-red-500">{errors.cuisines}</span>
                                }
                            </div>
                            <div>
                                <Label>Upload Image</Label>
                                <Input
                                    onChange={(e) => setInput({ ...input, image: e.target.files?.[0] })}
                                    type="file" name="image" accept="image/*" />
                                {
                                    errors && <span className="text-xs text-red-500">{errors.image?.name}</span>
                                }
                            </div>
                        </div>
                        <div className="my-5 w-fit">
                            {loading ? (
                                <Button disabled className="bg-orange hover:bg-hoverOrange">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                </Button>
                            ) : (
                                <Button className="bg-orange hover:bg-hoverOrange">
                                    {restaurant ? "Update your restaurant" : "Add your restaurant"}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;
