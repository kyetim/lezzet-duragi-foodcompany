import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem } from '@/interfaces/menu-item';

interface MenuState {
    items: MenuItem[];
    categories: string[];
    isLoading: boolean;
    error: string | null;
    selectedCategory: string | null;
}

const initialState: MenuState = {
    items: [],
    categories: ['doner', 'makarna', 'salata', 'icecek'],
    isLoading: false,
    error: null,
    selectedCategory: null,
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        fetchMenuStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchMenuSuccess: (state, action: PayloadAction<MenuItem[]>) => {
            state.isLoading = false;
            state.items = action.payload;
            state.error = null;
        },
        fetchMenuFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<string | null>) => {
            state.selectedCategory = action.payload;
        },
        clearMenuError: (state) => {
            state.error = null;
        },
    },
});

export const {
    fetchMenuStart,
    fetchMenuSuccess,
    fetchMenuFailure,
    setSelectedCategory,
    clearMenuError
} = menuSlice.actions;

export default menuSlice.reducer; 