<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Configurações</h1>

    <!-- Perfil -->
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <User class="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Perfil</h2>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
          <input v-model="profileForm.name" type="text" class="input-field" placeholder="Seu nome" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Renda Mensal (R$)</label>
            <input v-model="profileForm.monthlyIncome" type="number" step="0.01" min="0" class="input-field" placeholder="0,00" />
            <p class="text-xs text-gray-500 mt-1">Valor que será adicionado automaticamente todo mês.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dia do Recebimento</label>
            <input v-model="profileForm.incomeDay" type="number" min="1" max="31" class="input-field" />
          </div>
        </div>

        <div class="pt-4">
          <p v-if="profileSavedMessage" class="mb-2 text-center text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">
            {{ profileSavedMessage }}
          </p>
          <button type="submit" class="btn-primary">Salvar Perfil</button>
        </div>
      </form>
    </div>

    <!-- Integrações (IA) -->
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Sparkles class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Integrações (IA)</h2>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gemini API Key</label>
          <input v-model="apiKey" type="password" class="input-field w-full" placeholder="Cole sua chave API aqui (opcional)" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span v-if="apiKey" class="text-green-600 dark:text-green-400">✓ API Key configurada</span>
            <span v-else>Necessário para usar o recurso de escaneamento de comprovantes.</span>
          </p>
        </div>
        <div class="pt-2">
          <p v-if="savedMessage" class="mb-2 text-center text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">
            {{ savedMessage }}
          </p>
          <button @click="saveApiKey" class="btn-primary">Salvar</button>
        </div>
      </div>
    </div>



    <!-- Orçamento por Categoria -->
    <div class="card">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
          <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Orçamento por Categoria</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">Defina limites mensais para cada categoria</p>
        </div>
      </div>

      <div class="space-y-3">
        <div 
          v-for="category in expenseCategories" 
          :key="category.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center gap-3 flex-1">
            <span class="text-2xl">{{ category.icon }}</span>
            <div class="flex-1">
              <p class="font-medium text-gray-800 dark:text-white">{{ category.name }}</p>
              <p v-if="category.budget && category.budget > 0" class="text-xs text-gray-500 dark:text-gray-400">
                Orçamento atual: R$ {{ formatCurrency(category.budget) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">R$</span>
            <input
              v-model.number="category.budget"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              class="w-28 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div class="pt-4">
        <p v-if="budgetSavedMessage" class="mb-2 text-center text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">
          {{ budgetSavedMessage }}
        </p>
        <button @click="saveBudgets" class="btn-primary">Salvar Orçamentos</button>
      </div>
    </div>
    <!-- Aparência -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Aparência</h2>
      <div class="flex items-center justify-between">
        <span class="text-gray-700 dark:text-gray-300">Modo Escuro</span>
        <button @click="toggleTheme" class="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
          <Moon v-if="isDark" class="w-5 h-5" />
          <Sun v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Dados -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Dados</h2>
      <div class="space-y-2">
        <!-- Exportar -->
        <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
              <Download class="w-5 h-5" />
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">Exportar Dados</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Baixar backup em JSON</p>
            </div>
          </div>
          <button @click="exportData" class="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Exportar</button>
        </div>
        <!-- Limpar -->
        <div class="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              <Trash2 class="w-5 h-5" />
            </div>
            <div>
              <p class="font-medium text-red-600 dark:text-red-400">Apagar Tudo</p>
              <p class="text-xs text-red-400 dark:text-red-500/70">Esta ação é irreversível</p>
            </div>
          </div>
          <button @click="clearData" class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Apagar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Moon, Sun, Download, Trash2, Sparkles, User } from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { useExpenseStore } from '@/stores/expense'
import { useThemeStore } from '@/stores/theme'
import { firestoreService } from '@/services/firestoreService'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const toggleTheme = () => themeStore.toggleTheme()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const expenseStore = useExpenseStore()
const budgetSavedMessage = ref('')
const apiKey = ref('')
const savedMessage = ref('')
const profileSavedMessage = ref('')


const profileForm = ref({
  name: '',
  monthlyIncome: 0,
  incomeDay: 5
})



const expenseCategories = computed(() => 
  expenseStore.categories.filter(c => c.type === 'expense' || c.type === 'both')
)
onMounted(async () => {
  settingsStore.loadFromLocalStorage()
  apiKey.value = settingsStore.geminiApiKey || ''


  // Load user profile from Firestore if authenticated
  if (userStore.isAuthenticated) {
    await userStore.loadUserProfile()
    

  }
  
  profileForm.value = {
    name: userStore.name,
    monthlyIncome: userStore.monthlyIncome,
    incomeDay: userStore.incomeDay
  }
})



function saveApiKey() {
  settingsStore.setGeminiApiKey(apiKey.value)
  savedMessage.value = 'Chave API salva com sucesso!'
  setTimeout(() => (savedMessage.value = ''), 3000)
}

function formatCurrency(amount: number) {
  return amount.toFixed(2).replace('.', ',')
}
function saveProfile() {
  userStore.updateProfile(profileForm.value.name, profileForm.value.monthlyIncome, profileForm.value.incomeDay)

  // Update or create salary subscription
  if (profileForm.value.monthlyIncome > 0) {
    const today = new Date()
    let nextDueDate = new Date(today.getFullYear(), today.getMonth(), profileForm.value.incomeDay)
    if (nextDueDate < today) nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    expenseStore.upsertSubscription({
      id: 'salary-main',
      amount: profileForm.value.monthlyIncome,
      category: 'Salário',
      description: 'Salário Mensal',
      type: 'income',
      paymentMethod: 'pix',
      startDate: new Date().toISOString(),
      nextDueDate: nextDueDate.toISOString().split('T')[0]!,
      dayOfMonth: profileForm.value.incomeDay,
      isActive: true,
      createdAt: new Date().toISOString()
    })
  } else {
    expenseStore.cancelSubscription('salary-main')
  }

  profileSavedMessage.value = 'Perfil salvo com sucesso!'
  setTimeout(() => (profileSavedMessage.value = ''), 3000)
}



function exportData() {
  const data = {
    expenses: localStorage.getItem('expenses'),
    settings: localStorage.getItem('settings'),
    user: localStorage.getItem('user_profile')
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flowfi-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function clearData() {
  if (confirm('Tem certeza? Isso apagará todos os seus dados permanentemente.')) {
    localStorage.clear()
    window.location.reload()
  }
}
async function saveBudgets() {
  await expenseStore.saveData()
  budgetSavedMessage.value = 'Orçamentos salvos com sucesso!'
  setTimeout(() => (budgetSavedMessage.value = ''), 3000)
}
</script>
