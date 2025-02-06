import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

axios.defaults.withCredentials = true;

const ORDER_API_END_POINT = import.meta.env.VITE_BACKEND_URL + "/api/v1/order";

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],
      createCheckoutSession: async (
        checkoutSession: CheckoutSessionRequest
      ) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${ORDER_API_END_POINT}/checkout/create-checkout-session`,
            checkoutSession,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if(response.data.success){
            //razorpay js script in index.html
            console.log(response.data)
            const { orderId, amount, currency, key } = response.data.options;

            const options = {
              key: key,
              amount: amount, // Amount in paisa
              currency: currency,
              name: "TastyBites",
              description: "Order Payment",
              order_id: orderId, // Razorpay Order ID from backend
              handler: async function (response: any) {
                console.log("Payment Successful", response);
                toast.success("Payment Successful!");
  
                // Send payment confirmation to backend
              //   await axios.post(
              //     `${ORDER_API_END_POINT}/checkout/verify-payment`,
              //     {
              //       orderId,
              //       paymentId: response.razorpay_payment_id,
              //     }
              //   );
  
                // Redirect to order success page
                window.location.href = "/order-success";
              },
              prefill: {
                name: checkoutSession.deliveryDetails.name,
                email: checkoutSession.deliveryDetails.email,
                contact: checkoutSession.deliveryDetails.contact,
              },
              theme: {
                color: "#F37254",
              },
            };
  
            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
            set({ loading: false });
          }
        } catch (error) {
          console.log(error);
          set({ loading: false });
        }
      },
      getOrderDetails: async () => {
        try {
          set({ loading: true });
          const response = await axios.post(`${ORDER_API_END_POINT}`);

          set({ loading: false, orders: response.data.orders });
        } catch (error) {
          console.log(error);
          set({ loading: false });
        }
      },
    }),
    {
      name: "order-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
