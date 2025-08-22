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

// localStorage'dan sepet verilerini yükle
const loadCartFromStorage = (): CartItem[] => {
    try {
        // Önce guest cart'ı kontrol et
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) {
            const parsedGuestCart = JSON.parse(guestCart);
            // Guest cart'ı yükle ve temizle
            localStorage.removeItem('guest_cart');
            return parsedGuestCart;
        }
        
        // Normal cart'ı kontrol et
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
};

// Sepet verilerini localStorage'a kaydet
const saveCartToStorage = (items: CartItem[]): void => {
    try {
        localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const initialState: CartState = {
    items: loadCartFromStorage(),
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
            
            // localStorage'a kaydet
            saveCartToStorage(state.items);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.menuItem.id !== action.payload);
            // localStorage'a kaydet
            saveCartToStorage(state.items);
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
            // localStorage'a kaydet
            saveCartToStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            // localStorage'dan temizle
            localStorage.removeItem('cart');
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer; 