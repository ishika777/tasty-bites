
import axios from "axios";
import { toast } from "sonner";
import {create} from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useRestaurantStore } from "./useRestaurantStore";

axios.defaults.withCredentials = true;

const MENU_API_END_POINT = import.meta.env.VITE_BACKEND_URL + "/api/v1/menu"

type MenuState = {
    loading : boolean;
    menu : null;
    createMenu : (formData : FormData) => Promise<void>;
    editMenu : (menuId : string, formData : FormData) => Promise<void>;
}

export const useMenuStore = create<MenuState>()(persist((set) => ({
    loading : false,
    menu : null,
    createMenu : async(formData : FormData) => {
        set({loading : true});
        try {
            const response = await axios.post(`${MENU_API_END_POINT}/`,formData, {
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            });
            if(response.data.success){
                set({loading : false, menu : response.data.menu})
                toast(response.data.message)
            }
            //update restaurant to get real-time update
            useRestaurantStore.getState().addMenuToRestaurant(response.data.menu)
        } catch (error: any) {
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },
    editMenu: async(menuId:string, formData : FormData) => {
        set({loading : true});
        try {
            const response = await axios.put(`${MENU_API_END_POINT}/${menuId}`,formData, {
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            });
            if(response.data.success){
                toast(response.data.message)
                set({loading : false, menu:response.data.menu})
            }
            //update restaurant to get real-time update
            useRestaurantStore.getState().updateMenuToRestaurant(response.data.menu)
        } catch (error: any) {
            set({loading : false})
            toast.error(error.response?.data.message || error.message)
        }
    },
}),{
    name : "menu",
    storage : createJSONStorage(() => localStorage)
}))