import { Orders } from "@/types/orderType"
import { MneuItem, RestaurantState } from "@/types/restaurantType"
import axios from "axios"
import { toast } from "sonner"
import {create} from "zustand"
import {createJSONStorage, persist} from "zustand/middleware"

axios.defaults.withCredentials = true;

const RESTAURANT_API_END_POINT = import.meta.env.VITE_BACKEND_URL + "/api/v1/restaurant"


export const useRestaurantStore = create<RestaurantState>()(persist((set, get) => ({
    loading : true,
    restaurant : null,
    searchedRestaurant : [],
    appliedFilter : [],
    singleRestaurant : null,
    restaurantOrder: [],
    createRestaurant : async(formData:FormData) => {
        try {
            set({loading : true})
            const response = await axios.post(`${RESTAURANT_API_END_POINT}/`, formData, {
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            })
            if(response.data.success){
                toast(response.data.message)
                set({loading : false});
            }
        } catch (error :any) {
            console.log(error);
            
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },
    getRestaurant : async() => {
        try {
            set({loading : true})
            const response = await axios.get(`${RESTAURANT_API_END_POINT}/`, {
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            if(response.data.success){
                set({loading : false, restaurant : response.data.restaurant});
            }
        } catch (error :any) {
            if(error.response.status === 404){
                set({restaurant : null})
            }
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },
    updateRestaurant : async(formData : FormData) => {
        try {
            set({loading : true})
            const response = await axios.put(`${RESTAURANT_API_END_POINT}/`, formData, {
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            })
            if(response.data.success){
                toast(response.data.message)
                set({loading : false, restaurant : response.data.restaurant});
            }
        } catch (error :any) {
            console.log(error);
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },
    addMenuToRestaurant : async(menu:MneuItem) => {
        set((state: any) => ({
            restaurant : state.restaurant ? {...state.restaurant, menus:[...state.restaurant.menus, menu]} : null,
        }))
    },
    updateMenuToRestaurant : async(updatedMenu:MneuItem) => {
        set((state: any) => {
            if(state.restaurant){
                const updatedMenuList = state.restaurant.menus.map((menu:any) => menu._id === updatedMenu._id ? updatedMenu : menu);
                return {
                    restaurant : {
                        ...state.restaurant, menus:updatedMenuList
                    }
                } 
            }
            return state
        })
    },    
    searchRestaurant : async(searchText:string, searchQuery:string, selectedCuisines:any) => {
        try {
            set({loading : true})
            const params = new URLSearchParams();
            params.set("searchQuery", searchQuery);
            params.set("selectedCuisines", selectedCuisines.join(","))
            const response = await axios.get(`${RESTAURANT_API_END_POINT}/search/${searchText}?${params.toString()}`, {
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            if(response.data.success){
                set({loading : false, searchedRestaurant : response.data.data});
            }
        } catch (error :any) {
            console.log(error);
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },
    setAppliedFilter : (value : string) => {
        set((state) => {
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
            return {appliedFilter : updatedFilter};
        })
    },
    resetAppliedFilter : () => {
        set({appliedFilter : []})
    },
    getRestaurantDetails : async(id:string) => {
        try {
            const response = await axios.get(`${RESTAURANT_API_END_POINT}/${id}`, {
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            if(response.data.success){
                toast(response.data.message)
                set({singleRestaurant : response.data.restaurant})
            }
        } catch (error :any) {
            console.log(error);

            toast.error(error.response?.data.message || error.message)
        }
    },
    getRestaurantOrders : async() => {
        try {
            set({loading : true})
            const response = await axios.get(`${RESTAURANT_API_END_POINT}/order`, {
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            if(response.data.success){
                toast(response.data.message)
                set({loading : false, restaurantOrder: response.data.orders});
            }
        } catch (error :any) {
            console.log(error);
            
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },
    updateOrderStatus : async(orderId: string, status: string) => {
        try {
            set({loading : true})
            const response = await axios.put(`${RESTAURANT_API_END_POINT}/order/${orderId}/status`, {status}, {
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            if(response.data.success){
                const updatedOrder = get().restaurantOrder.map((order: Orders) => {
                    return order._id === orderId ? {...order, status: response.data.status} : order;
                })
                toast(response.data.message)
                set({loading : false, restaurantOrder: updatedOrder});

            }
        } catch (error :any) {
            console.log(error);
            
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },


   
}), {
    name : "restaurant",
    storage : createJSONStorage(() => localStorage)
}))