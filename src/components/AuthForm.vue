<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="w-full max-w-md">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center">
          <img src="/FlowFI.png" alt="FlowFI" class="w-16 h-16">
        </div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">FlowFI</h1>
        <p class="text-gray-600 dark:text-gray-400">Gerencie suas finanças com inteligência</p>
      </div>

      <!-- Auth Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div class="flex gap-2 mb-6">
          <button
            @click="isLogin = true"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all',
              isLogin 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]"
          >
            Entrar
          </button>
          <button
            @click="isLogin = false"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all',
              !isLogin 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]"
          >
            Cadastrar
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name (only for register) -->
          <div v-if="!isLogin">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome
            </label>
            <input
              v-model="name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Seu nome"
            >
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="seu@email.com"
            >
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha
            </label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            >
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span v-if="!isLoading">{{ isLogin ? 'Entrar' : 'Criar Conta' }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Ou continue com</span>
            </div>
          </div>

          <!-- Google Sign In Button -->
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const name = ref('');
const error = ref('');
const isLoading = ref(false);

const emit = defineEmits<{
  authenticated: []
}>();

async function handleSubmit() {
  error.value = '';
  isLoading.value = true;

  try {
    if (isLogin.value) {
      await userStore.login(email.value, password.value);
    } else {
      if (!name.value.trim()) {
        error.value = 'Por favor, insira seu nome';
        return;
      }
      await userStore.register(email.value, password.value, name.value);
    }
    
    emit('authenticated');
  } catch (err: any) {
    console.error('Auth error:', err);
    
    // Handle Firebase auth errors
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'Este email já está em uso';
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Email inválido';
    } else if (err.code === 'auth/weak-password') {
      error.value = 'A senha deve ter pelo menos 6 caracteres';
    } else if (err.code === 'auth/user-not-found') {
      error.value = 'Usuário não encontrado';
    } else if (err.code === 'auth/wrong-password') {
      error.value = 'Senha incorreta';
    } else if (err.code === 'auth/invalid-credential') {
      error.value = 'Credenciais inválidas';
    } else {
      error.value = 'Erro ao autenticar. Tente novamente.';
    }
  } finally {
    isLoading.value = false;
  }
}

async function handleGoogleLogin() {
  error.value = '';
  isLoading.value = true;

  try {
    await userStore.loginWithGoogle();
    emit('authenticated');
  } catch (err: any) {
    console.error('Google auth error:', err);
    
    // Handle Firebase auth errors
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = 'Login cancelado';
    } else if (err.code === 'auth/popup-blocked') {
      error.value = 'Pop-up bloqueado. Permita pop-ups para este site.';
    } else if (err.code === 'auth/cancelled-popup-request') {
      error.value = 'Login cancelado';
    } else {
      error.value = 'Erro ao fazer login com Google. Tente novamente.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
