import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Expense, Subscription, Category } from '@/stores/expense';

export const firestoreService = {
    // Expenses
    async saveExpense(userId: string, expense: Expense): Promise<void> {
        const expenseRef = doc(db, 'users', userId, 'expenses', expense.id);
        // Remove undefined values as Firestore doesn't accept them
        const cleanExpense = Object.fromEntries(
            Object.entries(expense).filter(([_, v]) => v !== undefined)
        );
        await setDoc(expenseRef, {
            ...cleanExpense,
            createdAt: Timestamp.now()
        });
    },

    async getExpenses(userId: string): Promise<Expense[]> {
        const expensesRef = collection(db, 'users', userId, 'expenses');
        const q = query(expensesRef, orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Expense);
    },

    async deleteExpense(userId: string, expenseId: string): Promise<void> {
        const expenseRef = doc(db, 'users', userId, 'expenses', expenseId);
        await deleteDoc(expenseRef);
    },

    // Subscriptions
    async saveSubscription(userId: string, subscription: Subscription): Promise<void> {
        const subRef = doc(db, 'users', userId, 'subscriptions', subscription.id);
        // Remove undefined values as Firestore doesn't accept them
        const cleanSubscription = Object.fromEntries(
            Object.entries(subscription).filter(([_, v]) => v !== undefined)
        );
        await setDoc(subRef, cleanSubscription);
    },

    async getSubscriptions(userId: string): Promise<Subscription[]> {
        const subsRef = collection(db, 'users', userId, 'subscriptions');
        const snapshot = await getDocs(subsRef);
        return snapshot.docs.map(doc => doc.data() as Subscription);
    },

    async deleteSubscription(userId: string, subscriptionId: string): Promise<void> {
        const subRef = doc(db, 'users', userId, 'subscriptions', subscriptionId);
        await deleteDoc(subRef);
    },

    // User Profile
    async saveUserProfile(userId: string, profile: any): Promise<void> {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, profile, { merge: true });
    },

    async getUserProfile(userId: string): Promise<any> {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);
        return snapshot.exists() ? snapshot.data() : null;
    },

    // Categories
    async saveCategories(userId: string, categories: Category[]): Promise<void> {
        const categoriesRef = doc(db, 'users', userId, 'settings', 'categories');
        await setDoc(categoriesRef, { categories });
    },

    async getCategories(userId: string): Promise<Category[] | null> {
        const categoriesRef = doc(db, 'users', userId, 'settings', 'categories');
        const snapshot = await getDoc(categoriesRef);
        return snapshot.exists() ? snapshot.data().categories : null;
    },

    // Credit Cards
    async saveCreditCards(userId: string, cards: any[]): Promise<void> {
        const cardsRef = doc(db, 'users', userId, 'settings', 'creditCards');
        await setDoc(cardsRef, { cards });
    },

    async getCreditCards(userId: string): Promise<any[] | null> {
        const cardsRef = doc(db, 'users', userId, 'settings', 'creditCards');
        const snapshot = await getDoc(cardsRef);
        return snapshot.exists() ? snapshot.data().cards : null;
    },


};
