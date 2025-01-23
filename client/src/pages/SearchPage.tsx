import FilterPage from "@/components/FilterPage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Restaurant } from "@/types/restaurantType";
import { Globe, Loader2, MapPin, X } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";



const SearchPage = () => {

    const params = useParams<{ text: string }>();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [buttonLoading, setButtonLoading] = useState(false);
    const { loading, searchRestaurant, searchedRestaurant, appliedFilter, setAppliedFilter } = useRestaurantStore();

    useEffect(() => {
        searchRestaurant(params.text!, searchQuery, appliedFilter)

    }, [appliedFilter, params.text!]) //searchQuery also can include this do check

    const searchClick = async () => {
        try {
            setButtonLoading(true);
            await searchRestaurant(params.text!, searchQuery, appliedFilter)
        } catch (error) {
            console.log(error)
            setButtonLoading(false)
        } finally {
            setButtonLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto my-10">
            <div className="flex flex-col md:flex-row justify-between gap-10">
                <FilterPage />

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={searchQuery}
                            placeholder="Search by restaurant & cuisines"
                            className="focus-visible:ring-1"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setSearchQuery(e.target.value)
                            }
                        />

                        {buttonLoading ? (
                            <Button disabled className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Please Wait
                            </Button>
                        ) : (
                            <Button onClick={searchClick} className="bg-orange hover:bg-hoverOrange">Search</Button>
                        )}
                    </div>

                    <div>
                        {/* filter badges */}
                        <div className="flec flex-col gap-3 md:flex-row md:items-center md:gap-2 my-3">
                            <h1 className="font-medium text-lg mb-3">
                                ({searchedRestaurant?.length}) Search result(s) found
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                                {appliedFilter.map(
                                    (selectedFilter: string, idx: number) => (
                                        <div
                                            className="relative inline-flex items-center max-w-full"
                                            key={idx}
                                        >
                                            <Badge
                                                className="text-[#D19254] rounded-xl cursor-pointer pr-6 whitespace-nowrap"
                                                variant={"outline"}
                                            >
                                                {selectedFilter}
                                            </Badge>
                                            <X
                                                onClick={() => setAppliedFilter(selectedFilter)}
                                                size={16}
                                                className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* search results */}
                        <div className="flex flex-row flex-wrap gap-4">
        {/* <SearchPageSkeleton /> */}

                            {
                                loading ? (<SearchPageSkeleton />) : (

                                    !loading && searchedRestaurant?.length === 0 ? (<NoResultFound searchText={params.text!} />) : (
                                        searchedRestaurant?.map((restaurant: Restaurant) => (
                                            <Card key={restaurant._id} className="bg-white h-[355px] flex flex-col dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 border-none">
                                                <div className="relative bg-green-300">
                                                    <AspectRatio ratio={16/6}>
                                                        <img
                                                            src={restaurant.imageUrl}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </AspectRatio>

                                                    <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg py-1 px-3">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Featured
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col flex-1 justify-between">
                                                    <CardContent className="p-4">
                                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                            {restaurant.restaurantName}
                                                        </h1>
                                                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                                            <MapPin size={16} />
                                                            <p className="text-sm">
                                                                City : <span className="font-medium">{restaurant.city}</span>
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                                            <Globe size={16} />
                                                            <p className="text-sm">
                                                                Country : <span className="font-medium">{restaurant.country}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2 mt-4 flex-wrap overflow-hidden">
                                                            {" "}
                                                            {restaurant.cuisines.map(
                                                                (cuisine: string, idx: number) => (
                                                                    <Badge
                                                                        key={idx}
                                                                        className="font-medium px-2 py-1 rounded-full shadow-sm"
                                                                    >
                                                                        {cuisine}
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="p-4 border-t w-full border-t-gray-100 dark:border-t-gray-700 flex items-end justify-end">
                                                        <Link to={`/restaurant/${restaurant._id}`}>
                                                            <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full">
                                                                View Menu
                                                            </Button>
                                                        </Link>
                                                    </CardFooter>
                                                </div>

                                            </Card>
                                        ))
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

const SearchPageSkeleton = () => {
    return (
        <div className="flex flex-row gap-6">
            {[...Array(3)].map((_, index) => (
                <Card
                    key={index}
                    className="bg-white w-fit dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden h-[355px]"
                >
                    <div className="relative">
                        <AspectRatio ratio={16 / 6}>
                            <Skeleton />
                        </AspectRatio>
                    </div>
                    <div className="flex flex-col items-start">
                        <CardContent className="p-4 dark:bg-gray-900">
                            <Skeleton className="h-8 w-3/4 sm:w-full mb-2" />
                            <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                <Skeleton className="h-4 w-1/2 sm:w-3/4" />
                            </div>
                            <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
                                <Skeleton className="h-4 w-1/2 sm:w-3/4" />
                            </div>
                            <div className="flex gap-2 mt-4 flex-wrap">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 w-full flex justify-start dark:bg-gray-900">
                            <Skeleton className="h-10 w-24 rounded-full" />
                        </CardFooter>
                    </div>
                </Card>
            ))}
        </div>
    );
};

const NoResultFound = ({ searchText }: { searchText: string }) => {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                No results found
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                We couldn't find any results for "{searchText}". <br /> Try searching
                with a different term.
            </p>
            <Link to="/">
                <Button className="mt-4 bg-orange hover:bg-orangeHover">
                    Go Back to Home
                </Button>
            </Link>
        </div>
    );
};
