import { MneuItem } from "./restaurantType";

export interface CartItem extends MneuItem{
    quantity : number;
}

export type CartState = {
    cart : CartItem[],
    addToCart : (item: MneuItem) => void;
    clearCart : () => void;
    removeFromTheCart : (id: string) => void;
    incrementQuantity : (id: string) => void;
    decrementQuantity : (id: string) => void;
}