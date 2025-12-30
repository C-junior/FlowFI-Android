import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    const geminiApiKey = ref(import.meta.env.VITE_GEMINI_API_KEY || '')

    function setGeminiApiKey(key: string) {
        geminiApiKey.value = key
        saveToLocalStorage()
    }

    function saveToLocalStorage() {
        localStorage.setItem('settings', JSON.stringify({
            geminiApiKey: geminiApiKey.value
        }))
    }

    function loadFromLocalStorage() {
        const stored = localStorage.getItem('settings')
        if (stored) {
            const parsed = JSON.parse(stored)
            // Preserve existing defaults if the stored value is undefined
            // If user hasn't set a custom key, keep the environment variable
            geminiApiKey.value = parsed.geminiApiKey ?? (import.meta.env.VITE_GEMINI_API_KEY || '')
        }
    }

    // Load settings immediately
    loadFromLocalStorage()

    return {
        geminiApiKey,
        setGeminiApiKey,
        loadFromLocalStorage
    }
})
