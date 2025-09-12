import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const cleanupTestOrder = async (): Promise<void> => {
    try {
        console.log('🧹 Cleaning up test orders...');

        // Test order'ları bul
        const ordersRef = collection(db, 'orders');
        const testOrderQuery = query(ordersRef, where('isTestOrder', '==', true));
        const testOrderSnapshot = await getDocs(testOrderQuery);

        if (testOrderSnapshot.empty) {
            console.log('✅ No test orders found to clean up');
            return;
        }

        // Test order'ları sil
        const deletePromises = testOrderSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        console.log(`🗑️ Deleted ${testOrderSnapshot.size} test orders`);
        console.log('✅ Test order cleanup completed');
    } catch (error) {
        console.error('❌ Error cleaning up test orders:', error);
        // Don't throw - this is cleanup, not critical
    }
};
