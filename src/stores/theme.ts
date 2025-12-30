import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Initialize from localStorage or system preference
    const isDark = ref(localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches))

    function toggleTheme() {
        isDark.value = !isDark.value
    }

    function setTheme(dark: boolean) {
        isDark.value = dark
    }

    // Watch for changes and update DOM/localStorage
    watch(isDark, (val) => {
        if (val) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, { immediate: true })

    return {
        isDark,
        toggleTheme,
        setTheme
    }
})
