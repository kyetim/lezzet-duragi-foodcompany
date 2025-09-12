import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
    query,
    orderBy,
    where
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Menu Item Interface for Firestore
export interface MenuItemFirestore {
    id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    subcategory?: string;
    image: string;
    isVegetarian: boolean;
    isAvailable: boolean;
    calories?: number;
    rating?: number;
    reviewCount?: number;
    tags: string[];
    preparationTime?: number; // in minutes
    ingredients?: string[];
    allergens?: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Create Menu Item Input
export interface CreateMenuItemInput {
    name: string;
    description: string;
    price: number;
    category: string;
    subcategory?: string;
    image: string;
    isVegetarian: boolean;
    isAvailable: boolean;
    calories?: number;
    tags: string[];
    preparationTime?: number;
    ingredients?: string[];
    allergens?: string[];
}

// Update Menu Item Input
export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {
    id: string;
}

class MenuFirebaseService {
    private collectionName = 'menu';

    // Get all menu items
    async getAllMenuItems(): Promise<MenuItemFirestore[]> {
        try {
            console.log('🔄 Fetching all menu items from Firestore...');

            // Firebase-only system - no more mock data

            const menuRef = collection(db, this.collectionName);
            const q = query(menuRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            const menuItems: MenuItemFirestore[] = [];
            querySnapshot.forEach((doc) => {
                menuItems.push({
                    id: doc.id,
                    ...doc.data()
                } as MenuItemFirestore);
            });

            console.log(`✅ Found ${menuItems.length} menu items`);
            return menuItems;
        } catch (error) {
            console.error('❌ Error fetching menu items:', error);
            throw new Error('Menü öğeleri alınırken hata oluştu');
        }
    }

    // Create new menu item
    async createMenuItem(menuItemData: CreateMenuItemInput): Promise<string> {
        try {
            console.log('🔄 Creating new menu item...', menuItemData);

            // Firebase-only system - create real menu item

            // Create menu item document
            const menuItem = {
                ...menuItemData,
                rating: 0,
                reviewCount: 0,
                createdAt: serverTimestamp() as Timestamp,
                updatedAt: serverTimestamp() as Timestamp,
            };

            const docRef = await addDoc(collection(db, this.collectionName), menuItem);

            console.log('✅ Menu item created with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ Error creating menu item:', error);
            throw new Error('Menü öğesi oluşturulurken hata oluştu');
        }
    }

    // Update menu item
    async updateMenuItem(updateData: UpdateMenuItemInput): Promise<void> {
        try {
            const { id, ...dataToUpdate } = updateData;
            console.log(`🔄 Updating menu item: ${id}`, dataToUpdate);

            // Firebase-only system - update real menu item

            const docRef = doc(db, this.collectionName, id);

            // Add updated timestamp
            const updatePayload = {
                ...dataToUpdate,
                updatedAt: serverTimestamp() as Timestamp,
            };

            await updateDoc(docRef, updatePayload);

            console.log('✅ Menu item updated successfully');
        } catch (error) {
            console.error('❌ Error updating menu item:', error);
            throw new Error('Menü öğesi güncellenirken hata oluştu');
        }
    }

    // Delete menu item
    async deleteMenuItem(id: string): Promise<void> {
        try {
            console.log(`🔄 Deleting menu item: ${id}`);

            // Firebase-only system - delete real menu item

            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);

            console.log('✅ Menu item deleted successfully');
        } catch (error) {
            console.error('❌ Error deleting menu item:', error);
            throw new Error('Menü öğesi silinirken hata oluştu');
        }
    }

    // Toggle menu item availability
    async toggleAvailability(id: string, isAvailable: boolean): Promise<void> {
        try {
            console.log(`🔄 Toggling availability for item: ${id} to ${isAvailable}`);

            // Firebase-only system - toggle real availability

            const docRef = doc(db, this.collectionName, id);
            await updateDoc(docRef, {
                isAvailable,
                updatedAt: serverTimestamp() as Timestamp,
            });

            console.log('✅ Menu item availability updated');
        } catch (error) {
            console.error('❌ Error toggling availability:', error);
            throw new Error('Menü öğesi durumu güncellenirken hata oluştu');
        }
    }

    // Get menu items by category
    async getMenuItemsByCategory(category: string): Promise<MenuItemFirestore[]> {
        try {
            console.log(`🔄 Fetching menu items for category: ${category}`);

            const menuRef = collection(db, this.collectionName);
            const q = query(
                menuRef,
                where('category', '==', category),
                where('isAvailable', '==', true),
                orderBy('name', 'asc')
            );
            const querySnapshot = await getDocs(q);

            const menuItems: MenuItemFirestore[] = [];
            querySnapshot.forEach((doc) => {
                menuItems.push({
                    id: doc.id,
                    ...doc.data()
                } as MenuItemFirestore);
            });

            console.log(`✅ Found ${menuItems.length} items in category ${category}`);
            return menuItems;
        } catch (error) {
            console.error('❌ Error fetching menu items by category:', error);
            throw new Error('Kategori öğeleri alınırken hata oluştu');
        }
    }

    // Get single menu item
    async getMenuItemById(id: string): Promise<MenuItemFirestore | null> {
        try {
            console.log(`🔄 Fetching menu item: ${id}`);

            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const menuItem = {
                    id: docSnap.id,
                    ...docSnap.data()
                } as MenuItemFirestore;

                console.log('✅ Menu item found:', menuItem.name);
                return menuItem;
            } else {
                console.log('❌ Menu item not found');
                return null;
            }
        } catch (error) {
            console.error('❌ Error fetching menu item:', error);
            throw new Error('Menü öğesi alınırken hata oluştu');
        }
    }

    // Get categories
    async getCategories(): Promise<string[]> {
        try {
            console.log('🔄 Fetching categories...');

            // Firebase-only system - get real categories

            const menuRef = collection(db, this.collectionName);
            const querySnapshot = await getDocs(menuRef);

            const categories = new Set<string>();
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.category) {
                    categories.add(data.category);
                }
            });

            const categoryList = Array.from(categories).sort();
            console.log('✅ Categories found:', categoryList);
            return categoryList;
        } catch (error) {
            console.error('❌ Error fetching categories:', error);
            throw new Error('Kategoriler alınırken hata oluştu');
        }
    }
}

export const menuFirebaseService = new MenuFirebaseService();
