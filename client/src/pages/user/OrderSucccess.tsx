import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useOrderStore } from "@/store/useOrderStore"
import { CartItem } from "@/types/cartType"
import { IndianRupee } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"


const OrderSucccess = () => {

    const {orders, getOrderDetails} = useOrderStore();

    useEffect(() => {
        const fetchData = async() => {
            try {
                await getOrderDetails();
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [])

    if(orders.length === 0){
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">Order not found!</h1>
            </div>
        )
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-lg w-full p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Order Status:{" "}
                    <span className="text-[#FF5A5A]">{"confirmed".toUpperCase()}</span>   
                </h1>
            </div>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Order Summary</h2>
                {
                    orders.map((order: any, idx: number) => (
                        <div key={idx}>
                            {
                                order.cartItems.map((item: CartItem) => (
                                    <div key={item._id} className="mb-4 ">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <img src={item.image} alt="" className="w-14 h-14 rounded-md object-cover" />
                                            <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">{item.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                                <IndianRupee size={16} />
                                                <span className="text-lg font-medium">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                </div>
                                ))
                            }
                        </div>
                       
                    ))
                }
            </div>
            <Link to="/cart">
                <Button className="w-full py-3 rounded-md bg-orange hover:bg-hoverOrange">Continue Shopping</Button>
            </Link>
        </div>
    </div>
  )
}

export default OrderSucccess