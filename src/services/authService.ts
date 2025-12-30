import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '@/firebase';

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}

export const authService = {
    // Register new user
    async register(email: string, password: string, displayName?: string): Promise<AuthUser> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (displayName) {
            await updateProfile(userCredential.user, { displayName });
        }

        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: displayName || userCredential.user.displayName
        };
    },

    // Sign in existing user
    async login(email: string, password: string): Promise<AuthUser> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName
        };
    },

    // Sign in with Google
    async loginWithGoogle(): Promise<AuthUser> {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName
        };
    },

    // Sign out
    async logout(): Promise<void> {
        await signOut(auth);
    },

    // Get current user
    getCurrentUser(): User | null {
        return auth.currentUser;
    },

    // Listen to auth state changes
    onAuthStateChanged(callback: (user: AuthUser | null) => void) {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                callback({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName
                });
            } else {
                callback(null);
            }
        });
    }
};
