import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const createOrdersCollection = async (): Promise<void> => {
  try {
    console.log('🔧 Creating orders collection...');
    
    // Add a temporary document to create the collection
    const tempOrderRef = await addDoc(collection(db, 'orders'), {
      temp: true,
      createdAt: new Date(),
      note: 'Temporary document to create orders collection'
    });
    
    console.log('✅ Temporary order added:', tempOrderRef.id);
    
    // Immediately delete the temporary document
    await deleteDoc(tempOrderRef);
    
    console.log('✅ Orders collection created and temp document removed');
  } catch (error) {
    console.error('❌ Error creating orders collection:', error);
    throw error;
  }
};
