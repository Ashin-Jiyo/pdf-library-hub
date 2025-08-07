import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Category } from '../types';

// Collection reference
const categoriesCollection = collection(db, 'categories');

export const categoryService = {
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      console.log('Fetching categories from Firebase...');
      const q = query(categoriesCollection, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      console.log('Query snapshot size:', querySnapshot.size);
      
      const categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Category));
      
      console.log('Mapped categories:', categories);
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create new category
  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(categoriesCollection, {
        ...categoryData,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update existing category
  async updateCategory(id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const categoryDoc = doc(db, 'categories', id);
      await updateDoc(categoryDoc, categoryData);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    try {
      const categoryDoc = doc(db, 'categories', id);
      await deleteDoc(categoryDoc);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};
