import { Orders } from "./orderType";

export type MneuItem = {
    _id : string;
    name : string;
    description : string;
    price : number;
    image : string;
}

export type Restaurant = {
    _id : string;
    user : string;
    restaurantName : string;
    city : string;
    country : string;
    deliveryTime : number;
    cuisines : string[];
    menus : MneuItem[];
    imageUrl : string
}

// export type searchedRestaurant = {
//     data : Restaurant[];
// }

export type RestaurantState = {
    loading: boolean;
    restaurant: Restaurant | null;
    searchedRestaurant: Restaurant[] | null;
    appliedFilter : string[];
    singleRestaurant : Restaurant | null;
    restaurantOrder: Orders[];
    createRestaurant: (formData:FormData) => Promise<void>;
    getRestaurant: () => Promise<void>;
    updateRestaurant: (formData:FormData) => Promise<void>;
    addMenuToRestaurant: (menu:MneuItem) => Promise<void>;
    updateMenuToRestaurant: (updatedMenu:MneuItem) => Promise<void>;
    searchRestaurant: (searchText:string, searchQuery:string, selectedCuisines:any) => Promise<void>;
    setAppliedFilter: (value : string) => void;
    resetAppliedFilter: () => void;
    getRestaurantDetails : (id:string) => Promise<void>;
    getRestaurantOrders: () => Promise<void>;
    updateOrderStatus: (orderId: string, status: string) => Promise<void>;

};