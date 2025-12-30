import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
    updateProfile,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult
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

    // Sign in with Google (using redirect for Capacitor/Android compatibility)
    async loginWithGoogle(): Promise<void> {
        const provider = new GoogleAuthProvider();
        // Use redirect instead of popup for native app compatibility
        await signInWithRedirect(auth, provider);
    },

    // Handle redirect result after Google sign-in
    async handleGoogleRedirect(): Promise<AuthUser | null> {
        const result = await getRedirectResult(auth);
        if (result) {
            return {
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName
            };
        }
        return null;
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
