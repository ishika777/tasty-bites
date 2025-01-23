import { ORDER_API_END_POINT } from "@/constants/constants";
import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set => ({
    loading: false,
    orders: [],
    createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${ORDER_API_END_POINT}/checkout/create-checkout-session`, checkoutSession, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.href = response.data.session.url;
            set({ loading: false });
        } catch (error) {
            console.log(error)
            set({ loading: false });
        }
    },
    getOrderDetails: async () => {
        try {
            set({loading:true});
            const response = await axios.post(`${ORDER_API_END_POINT}`);
          
            set({loading:false, orders:response.data.orders});
        } catch (error) {
            console.log(error)
            set({loading:false});
        }
    }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))