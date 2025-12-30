import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type AuthUser } from '@/services/authService'
import { firestoreService } from '@/services/firestoreService'

export const useUserStore = defineStore('user', () => {
    const currentUser = ref<AuthUser | null>(null)
    const name = ref('')
    const avatar = ref('')
    const monthlyIncome = ref(0)
    const incomeDay = ref(5)
    const isLoading = ref(false)
    const authInitialized = ref(false)

    const isAuthenticated = computed(() => currentUser.value !== null)
    const userId = computed(() => currentUser.value?.uid || null)

    // Initialize auth state listener
    function initAuth() {
        return authService.onAuthStateChanged(async (user) => {
            currentUser.value = user
            authInitialized.value = true

            if (user) {
                // Load user profile from Firestore
                await loadUserProfile()
            } else {
                // Clear local data when logged out
                clearProfile()
            }
        })
    }

    async function register(email: string, password: string, displayName: string) {
        isLoading.value = true
        try {
            const user = await authService.register(email, password, displayName)
            currentUser.value = user
            name.value = displayName

            // Save initial profile to Firestore
            await saveUserProfile()

            return user
        } finally {
            isLoading.value = false
        }
    }

    async function login(email: string, password: string) {
        isLoading.value = true
        try {
            const user = await authService.login(email, password)
            currentUser.value = user

            // Load user profile from Firestore
            await loadUserProfile()

            return user
        } finally {
            isLoading.value = false
        }
    }

    async function loginWithGoogle() {
        isLoading.value = true
        try {
            // This will redirect to Google sign-in page
            await authService.loginWithGoogle()
            // Note: The page will redirect, so we won't reach here
            // The redirect result is handled in initAuth/handleGoogleRedirect
        } catch (error) {
            isLoading.value = false
            throw error
        }
    }

    // Handle redirect result after Google sign-in
    async function handleGoogleRedirect() {
        try {
            const user = await authService.handleGoogleRedirect()
            if (user) {
                currentUser.value = user
                await loadUserProfile()
                return user
            }
        } catch (error) {
            console.error('Google redirect error:', error)
        }
        return null
    }

    async function logout() {
        isLoading.value = true
        try {
            await authService.logout()
            currentUser.value = null
            clearProfile()
        } finally {
            isLoading.value = false
        }
    }

    async function updateProfile(newName: string, newIncome: number, newDay: number) {
        name.value = newName
        monthlyIncome.value = newIncome
        incomeDay.value = newDay

        // Save to Firestore if authenticated
        if (userId.value) {
            await saveUserProfile()
        }
    }

    async function saveUserProfile() {
        if (!userId.value) return

        const profile = {
            name: name.value,
            avatar: avatar.value,
            monthlyIncome: monthlyIncome.value,
            incomeDay: incomeDay.value,
            email: currentUser.value?.email
        }

        await firestoreService.saveUserProfile(userId.value, profile)
    }

    async function loadUserProfile() {
        if (!userId.value) return

        const profile = await firestoreService.getUserProfile(userId.value)
        if (profile) {
            name.value = profile.name || currentUser.value?.displayName || ''
            avatar.value = profile.avatar || ''
            monthlyIncome.value = profile.monthlyIncome || 0
            incomeDay.value = profile.incomeDay || 5
        } else {
            // Set default name from auth
            name.value = currentUser.value?.displayName || ''
        }
    }

    function clearProfile() {
        name.value = ''
        avatar.value = ''
        monthlyIncome.value = 0
        incomeDay.value = 5
    }

    return {
        currentUser,
        name,
        avatar,
        monthlyIncome,
        incomeDay,
        isLoading,
        authInitialized,
        isAuthenticated,
        userId,
        initAuth,
        register,
        login,
        loginWithGoogle,
        handleGoogleRedirect,
        logout,
        updateProfile,
        saveUserProfile,
        loadUserProfile
    }
})
