import { MneuItem } from "@/types/restaurantType"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { useCartStore } from "@/store/useCartStore"
import { useNavigate } from "react-router-dom"


const AvailableMenu = ({menus} : {menus:MneuItem[]}) => {

    const {addToCart} = useCartStore()
    const navigate = useNavigate();

  return (
    <div className="md:p-4">
        <h1 className="text-xl md:text-2xl font-extrabold mb-6">Avaiable Menu</h1>
        <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
            
            {
                menus?.map((menu:MneuItem) => (
                    <Card className="md:max-w-xs mx-auto shadow-lg mb-7 rounded-lg overflow-hidden border-none">
                        <img className="w-full h-70 object-cover" src={menu.image} alt="" />
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{menu.name}</h2>
                            <p className="text-sm text-gray-600 mt-2">{menu.description}</p>
                            <h3 className="text-lg font-semibold mt-4">
                                Price : <span className="text-[#D19254]">₹{menu.price}</span>
                            </h3>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Button onClick={() => {
                                addToCart(menu)
                                navigate("/cart")
                            }} className="w-full bg-orange hover:bg-hoverOrange">Add to cart</Button>
                        </CardFooter>
                    </Card>
                ))
            }

        </div>
    </div>
  )
}

export default AvailableMenu