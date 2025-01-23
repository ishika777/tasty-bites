import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { Label } from "@radix-ui/react-menubar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { CheckoutSessionRequest } from "@/types/orderType";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader2 } from "lucide-react";

const CheckoutConfirmPage = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {

    const {user} = useUserStore();
    const {cart} = useCartStore();
    const {restaurant, getRestaurant} = useRestaurantStore();
    const {createCheckoutSession, loading} = useOrderStore()

    const [input, setInput] = useState({
        name : user?.fullname || "",
        email : user?.email || "",
        contact : user?.contact?.toString() || "",
        address : user?.address || "",
        city : user?.city || "",
        country : user?.country || "",
    });

    const changeEventHandler = (e : ChangeEvent<HTMLInputElement>) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name] : e.target.value,
        }));
    }

    const checkoutHandler = async(e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            await getRestaurant();
            const checkOutData : CheckoutSessionRequest = {
                cartItems: cart.map((cartItem) => ({
                    menuId: cartItem._id,
                    name: cartItem.name,
                    image: cartItem.image,
                    price: cartItem.price.toString(),
                    quantity: cartItem.quantity.toString()
                })),
                deliveryDetails: input,
                restaurantId: restaurant?._id as string
            }
            await createCheckoutSession(checkOutData);
        } catch (error) {
            console.log(error)
        }
    }

  return <div>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogTitle className="font-semibold">Review your order</DialogTitle>
            <DialogDescription className="text-xs">
                Double-check your delivery details and ensure everything is in order. When you are ready, hit "Confirm" button to place your order.
            </DialogDescription>
                <form onSubmit={checkoutHandler} className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
                    <div className="">
                        <Label className="text-sm mt-3 mb-1 font-semibold">Fullname</Label>
                        <Input 
                        type="text"
                        name="name"
                        value={input.name}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent focus:border-black"
                        />
                    </div>
                    <div className="">
                        <Label className="text-sm mt-3 mb-1 font-semibold">Email</Label>
                        <Input 
                        disabled
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent focus:border-black"
                        />
                    </div>
                    <div className="">
                        <Label className="text-sm mt-3 mb-1 font-semibold">Contact</Label>
                        <Input 
                        type="text"
                        name="contact"
                        value={input.contact}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent focus:border-black"
                        />
                    </div>
                    <div className="">
                        <Label className="text-sm mt-3 mb-1 font-semibold">Address</Label>
                        <Input 
                        type="text"
                        name="address"
                        value={input.address}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent focus:border-black"
                        />
                    </div>
                    <div className="">
                        <Label className="text-sm mt-3 mb-1 font-semibold">City</Label>
                        <Input 
                        type="text"
                        name="city"
                        value={input.city}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent focus:border-black"
                        />
                    </div>
                    <div className="">
                        <Label className="text-sm mt-3 mb-1 font-semibold">Country</Label>
                        <Input 
                        type="text"
                        name="country"
                        value={input.country}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent focus:border-black"
                        />
                    </div>
        <DialogFooter>
        {loading ? (
            <Button disabled className="bg-orange hover:bg-hoverOrange mt-5">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="bg-orange hover:bg-hoverOrange mt-5">Continue to Payment</Button>
          )}
        </DialogFooter>
                </form>
        </DialogContent>
    </Dialog>
  </div>;
};

export default CheckoutConfirmPage;
