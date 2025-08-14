import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
        menu: menuReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 