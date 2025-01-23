import AvailableMenu from "@/components/AvailableMenu";
import { Badge } from "@/components/ui/badge";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Timer } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetails = () => {

    const params = useParams();
    const {singleRestaurant, getRestaurantDetails} = useRestaurantStore();

    useEffect(() => {
        const fetchRestaurant = async() => {
            try {
                await getRestaurantDetails(params.id!)
            } catch (error) {
                console.log(error)     
            }
        }
        fetchRestaurant();
    }, [params.id])

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">

        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            className="object-cover w-full h-full rounded-lg shadow-lg"
            src={singleRestaurant?.imageUrl}
            alt=""
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">

            <h1 className="text-xl font-medium">{singleRestaurant?.restaurantName}</h1>

            <div className="flex gap-2 my-2">
              {singleRestaurant?.cuisines.map((cuisine: string, idx: number) => (
                <Badge key={idx}>{cuisine}</Badge>
              ))}
            </div>

            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <h1 className="flex items-center gap-2 font-medium">Delivery Time : {" "}
                <span className="text-[#D19254]">{singleRestaurant?.deliveryTime}</span>
              </h1>
              </div>
            </div>
          </div>
        </div>

        <AvailableMenu menus={singleRestaurant?.menus!} />
      </div>
    </div>
  );
};

export default RestaurantDetails;
