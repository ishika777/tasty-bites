import CheckoutConfirmPage from "@/components/CheckoutConfirmPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/types/cartType";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const Cart = () => {

    const [open, setOpen] = useState<boolean>(false);
    const {cart, incrementQuantity, decrementQuantity, removeFromTheCart, clearCart} = useCartStore()
    const totalAmt = cart.reduce((acc, el) => {
        return acc + el.price*el.quantity;
    }, 0)
    const formattedTotalAmt = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2, // Optional: for decimal precision
      }).format(totalAmt);

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      <div className="flex justify-end">
        <Button onClick={clearCart} variant={"link"}>Clear All</Button>
      </div>
      <Table>
        <TableCaption>A list of your cart items.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg font-semibold sm:font-normal xs:font-normal sm:text-md">Items</TableHead>
            <TableHead className="text-lg font-semibold sm:font-normal xs:font-normal sm:text-md">Title</TableHead>
            <TableHead className="text-lg font-semibold sm:font-normal xs:font-normal sm:text-md">Price</TableHead>
            <TableHead className="text-lg font-semibold sm:font-normal xs:font-normal sm:text-md">Quantity</TableHead>
            <TableHead className="text-lg font-semibold sm:font-normal xs:font-normal sm:text-md">Total</TableHead>
            <TableHead className="text-right text-lg font-semibold sm:font-normal xs:font-normal sm:text-md">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {
                cart.map((item : CartItem, idx:number) => (
                    <TableRow key={idx}>
                    <TableCell>
                        <Avatar>
                            <AvatarImage src={item.image} alt="item_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="text-lg font-semibold">{item.name}</TableCell>
                    <TableCell className="text-lg font-semibold">{item.price}</TableCell>
                    <TableCell>
                        <div className="w-fit flex items-center rounded-full border-gray-100 dark:bg-gray-800 shadow-md">
                            <Button onClick={() => decrementQuantity(item._id)} size={"icon"} variant={"outline"} className="rounded-full border-none bg-orange hover:bg-hoverOrange"><Minus /></Button>
                            <Button disabled variant={"outline"} className="font-bold border-none text-lg dark:bg-gray-800">{item.quantity}</Button>
                            <Button onClick={() => incrementQuantity(item._id)} size={"icon"} variant={"outline"} className="rounded-full border-none bg-orange hover:bg-hoverOrange"><Plus /></Button>
                        </div>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">
                        <Button onClick={() => removeFromTheCart(item._id)} size={"sm"} className="bg-orange hover:bg-hoverOrange">Remove</Button>
                    </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
        <TableFooter>
          <TableRow className="text-2xl font-bold">
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">&#8377; {formattedTotalAmt}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-end my-5">
        <Button onClick={() => setOpen(true)} className="bg-orange hover:bg-hoverOrange">Proceed to checkout</Button>
      </div>
      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
