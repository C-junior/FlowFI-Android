<template>
  <!-- Show auth form if not authenticated -->
  <AuthForm v-if="!userStore.authInitialized || !userStore.isAuthenticated" @authenticated="() => {}" />
  
  <!-- Show loading screen while loading data -->
  <div v-else-if="isLoadingData" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div class="text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center animate-pulse">
        <img src="/FlowFI.png" alt="FlowFI" class="w-16 h-16">
      </div>
      <p class="text-gray-600 dark:text-gray-400">Carregando seus dados...</p>
    </div>
  </div>

  <!-- Main app -->
  <div v-else class="min-h-screen font-sans selection:bg-purple-500 selection:text-white">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-300 p-1 rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <img src="/FlowFI.png" alt="">
            </div>
          
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="currentTab = 'settings'"
              class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <SettingsIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-md mx-auto px-4 py-6 pb-24">
      <!-- Home Tab -->
      <div v-if="currentTab === 'home'" class="space-y-6 pb-24 animate-fade-in">
        <!-- Resumo Financeiro -->
        <ExpenseSummary />
        
        <!-- Últimas Transações -->
        <ExpenseList :limit="5" @edit-expense="editExpense" />
      </div>

      <!-- Transactions Tab -->
      <div v-if="currentTab === 'transactions'" class="pb-24 animate-fade-in">
        <ExpenseList :show-filters="true" @edit-expense="editExpense" />
      </div>

      <!-- Cards Tab -->
      <div v-if="currentTab === 'cards'" class="pb-24 animate-fade-in">
        <CreditCardManager />
      </div>

      <!-- Settings Tab -->
      <div v-if="currentTab === 'settings'" class="pb-24 animate-fade-in">
        <Settings />
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 lg:hidden z-50 pb-safe transition-colors duration-300">
      <div class="flex justify-around items-center py-3">
        <button 
          @click="currentTab = 'home'"
          :class="[
            'flex flex-col items-center p-2 rounded-xl transition-all duration-300',
            currentTab === 'home' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          ]"
        >
          <Home class="w-6 h-6 mb-1" :stroke-width="currentTab === 'home' ? 2.5 : 2" />
          <span class="text-[10px] font-medium">Início</span>
        </button>
        
        <button 
          @click="currentTab = 'transactions'"
          :class="[
            'flex flex-col items-center p-2 rounded-xl transition-all duration-300',
            currentTab === 'transactions' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          ]"
        >
          <BarChart3 class="w-6 h-6 mb-1" :stroke-width="currentTab === 'transactions' ? 2.5 : 2" />
          <span class="text-[10px] font-medium">Transações</span>
        </button>
        
        <div class="relative -top-6">
          <button 
            @click="showAddForm = true"
            class="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 hover:scale-105 transition-all duration-300"
          >
            <Plus class="w-7 h-7" />
          </button>
        </div>
        
        <button 
          @click="currentTab = 'cards'"
          :class="[
            'flex flex-col items-center p-2 rounded-xl transition-all duration-300',
            currentTab === 'cards' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          ]"
        >
          <CreditCard class="w-6 h-6 mb-1" :stroke-width="currentTab === 'cards' ? 2.5 : 2" />
          <span class="text-[10px] font-medium">Cartões</span>
        </button>

        <button 
          @click="currentTab = 'settings'"
          :class="[
            'flex flex-col items-center p-2 rounded-xl transition-all duration-300',
            currentTab === 'settings' ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          ]"
        >
          <SettingsIcon class="w-6 h-6 mb-1" :stroke-width="currentTab === 'settings' ? 2.5 : 2" />
          <span class="text-[10px] font-medium">Config</span>
        </button>
      </div>
    </nav>

    <!-- Modal de Adicionar Despesa -->
    <div 
      v-if="showAddForm"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[60]"
      @click.self="showAddForm = false"
    >
      <div class="bg-white dark:bg-[#1E293B] rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all animate-slide-up">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1E293B] z-10 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Nova Despesa</h2>
          <button 
            @click="showAddForm = false"
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4">
          <ExpenseForm 
            :editing-expense="editingExpense"
            @expense-added="handleExpenseAdded" 
            @edit-cancelled="handleEditCancelled"
          />
        </div>
      </div>
    </div>

    <!-- Botão flutuante de adicionar (Desktop) -->
    <button 
      v-if="currentTab === 'home'"
      class="hidden lg:flex fixed bottom-8 right-8 w-14 h-14 rounded-full bg-purple-600 text-white items-center justify-center shadow-lg hover:bg-purple-700 transition-colors z-50"
      @click="showAddForm = true"
      title="Adicionar Despesa"
    >
      <Plus class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useExpenseStore } from '@/stores/expense'
import { useCreditCardStore } from '@/stores/creditCard'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import ExpenseForm from '@/components/ExpenseForm.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import ExpenseSummary from '@/components/ExpenseSummary.vue'
import CreditCardManager from '@/components/CreditCardManager.vue'
import Settings from '@/components/Settings.vue'
import AuthForm from '@/components/AuthForm.vue'
import type { Expense } from '@/stores/expense'
import { Home, BarChart3, Plus, CreditCard, Settings as SettingsIcon, X } from 'lucide-vue-next'

const expenseStore = useExpenseStore()
const creditCardStore = useCreditCardStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const themeStore = useThemeStore() // Initialize theme store to load saved theme preference

const currentTab = ref('home')
const showAddForm = ref(false)
const editingExpense = ref<Expense | null>(null)
const isLoadingData = ref(false)

onMounted(async () => {
  // Initialize auth listener
  userStore.initAuth()
})

// Watch for authentication state changes
watch(() => userStore.isAuthenticated, async (isAuth) => {
  if (isAuth && userStore.userId) {
    // User just logged in, load their data
    isLoadingData.value = true
    try {
      await expenseStore.loadData()
      await creditCardStore.loadFromFirestore()
      await expenseStore.processDueInstallments()
      await expenseStore.processSubscriptions()

    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      isLoadingData.value = false
    }
  }
})

function handleExpenseAdded() {
  showAddForm.value = false
  editingExpense.value = null
}

function editExpense(expense: Expense) {
  editingExpense.value = expense
  showAddForm.value = true
}

function handleEditCancelled() {
  showAddForm.value = false
  editingExpense.value = null
}
</script>

<style>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
