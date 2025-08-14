import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem } from '@/interfaces/menu-item';

interface CartItem {
    menuItem: MenuItem;
    quantity: number;
    specialInstructions?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ menuItem: MenuItem; quantity?: number; specialInstructions?: string }>) => {
            const { menuItem, quantity = 1, specialInstructions } = action.payload;
            const existingItem = state.items.find(item => item.menuItem.id === menuItem.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ menuItem, quantity, specialInstructions });
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.menuItem.id !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ menuItemId: string; quantity: number }>) => {
            const { menuItemId, quantity } = action.payload;
            const item = state.items.find(item => item.menuItem.id === menuItemId);
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item.menuItem.id !== menuItemId);
                } else {
                    item.quantity = quantity;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer; 