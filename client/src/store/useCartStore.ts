import { CartItem, CartState } from "@/types/cartType";
import { MneuItem } from "@/types/restaurantType";
import axios from "axios";
import {create} from "zustand"
import {createJSONStorage, persist} from "zustand/middleware"

axios.defaults.withCredentials = true;


export const useCartStore = create<CartState>()(persist((set) => ({
    cart: [],
    addToCart: (item: MneuItem) => {
        set((state : any) => {
            const exisitingItem = state.cart.find((cartItem : CartItem) => cartItem._id === item._id);
            if (exisitingItem) {
                return {
                    cart: state?.cart.map((cartItem : CartItem) => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                    )
                };
            } else {
                return {
                    cart: [...state.cart, { ...item, quantity: 1 }]
                }
            }
        })
    },
    clearCart: () => {
        set({ cart: [] });
    },
    removeFromTheCart: (id: string) => {
        set((state : any) => ({
            cart: state.cart.filter((item : CartItem) => item._id !== id)
        }))
    },
    incrementQuantity: (id: string) => {
        set((state : any) => ({
            cart: state.cart.map((item : CartItem) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
        }))
    },
    decrementQuantity: (id: string) => {
        set((state : any) => ({
            cart: state.cart.map((item : CartItem) => item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
        }))
    }
}), {
    name : "cart",
    storage : createJSONStorage(() => localStorage)
}))