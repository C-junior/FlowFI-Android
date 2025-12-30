<template>
  <div class="card">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">
      {{ editingExpense ? 'Editar Despesa' : 'Nova Despesa' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Tipo (Tabs) -->
      <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl mb-6">
        <button
          type="button"
          @click="form.type = 'expense'"
          class="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          :class="form.type === 'expense' 
            ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          <ArrowDownCircle class="w-4 h-4" />
          Despesa
        </button>
        <button
          type="button"
          @click="form.type = 'income'"
          class="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          :class="form.type === 'income' 
            ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          <ArrowUpCircle class="w-4 h-4" />
          Receita
        </button>
      </div>

      <!-- Receipt Scanning -->
      <div v-if="!editingExpense" class="mb-6">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          @change="handleFileUpload"
        />
        <button
          type="button"
          @click="triggerFileInput"
          :disabled="isScanning"
          class="w-full flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Loader2 v-if="isScanning" class="w-6 h-6 animate-spin" />
          <Camera v-else class="w-6 h-6" />
          <span class="font-medium">
            {{ isScanning ? 'Analisando...' : 'Escanear Comprovante' }}
          </span>
        </button>
      </div>

      <!-- Valor -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Valor
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
          <input
            v-model="form.amount"
            type="number"
            step="0.01"
            class="input-field pl-12 text-lg font-semibold"
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <!-- Categoria -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Categoria
        </label>
        <select 
          v-model="form.category" 
          class="input-field"
          required
        >
          <option value="">Selecione uma categoria</option>
          <option 
            v-for="category in categories" 
            :key="category.id" 
            :value="category.name"
          >
            {{ category.icon }} {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Data -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Data
        </label>
        <input
          v-model="form.date"
          type="date"
          class="input-field"
          required
        />
      </div>

      <!-- Forma de Pagamento -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ form.type === 'income' ? 'Forma de Recebimento' : 'Forma de Pagamento' }}
        </label>
        <select 
          v-model="form.paymentMethod" 
          class="input-field"
          required
        >
          <template v-if="form.type === 'expense'">
            <option value="cash">Dinheiro</option>
            <option value="debit-card">Cartão de Débito</option>
            <option value="credit-card">Cartão de Crédito</option>
            <option value="pix">Pix</option>
            <option value="other">Outro</option>
          </template>
          <template v-else>
            <option value="cash">Dinheiro</option>
            <option value="debit-card">Depósito/Transferência</option>
            <option value="pix">Pix</option>
            <option value="other">Outro</option>
          </template>
        </select>
      </div>

      <!-- Seleção de Cartão de Crédito (apenas para despesas) -->
      <div v-if="form.type === 'expense' && form.paymentMethod === 'credit-card' && creditCards.length > 0">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Cartão de Crédito
        </label>
        <select 
          v-model="form.creditCardId" 
          class="input-field"
          required
        >
          <option value="">Selecione um cartão</option>
          <option 
            v-for="card in creditCards" 
            :key="card.id" 
            :value="card.id"
          >
            {{ card.name }}
          </option>
        </select>
      </div>

      <!-- Parcelamento -->
      <div v-if="form.paymentMethod === 'credit-card' && form.creditCardId">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Número de Parcelas
            </label>
            <select 
              v-model="form.installments" 
              class="input-field"
            >
              <option value="1">À vista (1x)</option>
              <option v-for="i in 20" :key="i + 1" :value="i + 1">
                {{ i + 1 }}x
              </option>
            </select>
          </div>
          
          <div v-if="installmentPlan">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor da Parcela
            </label>
            <div class="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p class="text-lg font-semibold text-gray-800 dark:text-white">
                R$ {{ formatCurrency(installmentPlan.monthlyPayment) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total: R$ {{ formatCurrency(installmentPlan.totalAmount) }}
                <span v-if="installmentPlan.hasInterest" class="text-red-600 dark:text-red-400">
                  (+ R$ {{ formatCurrency(installmentPlan.interestAmount) }} juros)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Descrição -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrição (opcional)
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="input-field"
          placeholder="Descreva a despesa..."
        />
      </div>

      <!-- Despesa Recorrente -->
      <div v-if="!editingExpense" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <input 
          type="checkbox" 
          v-model="isRecurring"
          id="recurring-checkbox"
          class="w-5 h-5 text-purple-600 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-purple-500"
        />
        <label for="recurring-checkbox" class="flex-1 cursor-pointer">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🔄</span>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">Recorrente</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Gerar automaticamente todo mês
              </p>
            </div>
          </div>
        </label>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          class="btn-primary flex-1"
        >
          {{ editingExpense ? 'Atualizar' : 'Adicionar' }}
        </button>
        
        <button
          v-if="editingExpense"
          type="button"
          @click="cancelEdit"
          class="btn-secondary flex-1"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useExpenseStore } from '@/stores/expense'
import { useCreditCardStore } from '@/stores/creditCard'
import { analyzeReceipt } from '@/services/gemini'
import { Camera, Loader2, ArrowUpCircle, ArrowDownCircle } from 'lucide-vue-next'
import type { Expense } from '@/stores/expense'
import type { CreditCard } from '@/stores/creditCard'

const expenseStore = useExpenseStore()
const creditCardStore = useCreditCardStore()

const props = defineProps<{
  editingExpense?: Expense | null
}>()

const emit = defineEmits<{
  expenseAdded: []
  editCancelled: []
}>()

const isRecurring = ref(false)
const isScanning = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  type: 'expense' as 'expense' | 'income',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  paymentMethod: 'cash' as Expense['paymentMethod'],
  creditCardId: '',
  installments: 1,
  installmentAmount: 0,
  totalInstallmentAmount: 0,
  interestAmount: 0,
  installmentPlan: null as any
})

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  isScanning.value = true
  try {
    const data = await analyzeReceipt(file)
    
    if (data.amount) form.value.amount = data.amount.toString()
    if (data.date) form.value.date = data.date
    if (data.description) form.value.description = data.description
    if (data.category) {
      // Try to match category name
      const category = expenseStore.categories.find(c => c.name.toLowerCase() === data.category?.toLowerCase())
      if (category) form.value.category = category.name
    }
    if (data.paymentMethod) {
      // Simple mapping, can be improved
      const method = data.paymentMethod.toLowerCase()
      if (method.includes('credit')) form.value.paymentMethod = 'credit-card'
      else if (method.includes('debit')) form.value.paymentMethod = 'debit-card'
      else if (method.includes('pix')) form.value.paymentMethod = 'pix'
      else if (method.includes('cash')) form.value.paymentMethod = 'cash'
      else form.value.paymentMethod = 'other'
    }

  } catch (error: any) {
    alert(error.message || 'Erro ao analisar comprovante')
  } finally {
    isScanning.value = false
    // Reset input
    if (fileInput.value) fileInput.value.value = ''
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

const categories = computed(() => 
  expenseStore.categories.filter(cat => 
    cat.type === 'both' || cat.type === form.value.type
  )
)

const creditCards = computed(() => creditCardStore.activeCards)

const installmentPlan = computed(() => {
  if (form.value.paymentMethod !== 'credit-card' || !form.value.creditCardId || !form.value.amount) {
    return null
  }
  
  const card = creditCardStore.getCardById(form.value.creditCardId)
  if (!card) return null
  
  const amount = parseFloat(form.value.amount)
  if (isNaN(amount) || amount <= 0) return null
  
  return creditCardStore.calculateInstallments(amount, form.value.installments, 0)
})

watch(() => props.editingExpense, (expense) => {
  if (expense) {
    form.value = {
      type: expense.type,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      description: expense.description || '',
      paymentMethod: expense.paymentMethod || 'cash',
      creditCardId: expense.creditCardId || '',
      installments: expense.installments || 1,
      installmentAmount: expense.installmentAmount || 0,
      totalInstallmentAmount: expense.totalInstallmentAmount || 0,
      interestAmount: expense.interestAmount || 0,
      installmentPlan: expense.installmentPlan || null
    }
  } else {
    resetForm()
      isRecurring.value = false
  }
}, { immediate: true })

// Limpar campos do cartão quando mudar a forma de pagamento
watch(() => form.value.paymentMethod, (newMethod) => {
  if (newMethod !== 'credit-card') {
    form.value.creditCardId = ''
    form.value.installments = 1
    form.value.installmentAmount = 0
    form.value.totalInstallmentAmount = 0
    form.value.interestAmount = 0
    form.value.installmentPlan = null
  }
})

// Reset category when switching between expense/income
watch(() => form.value.type, () => {
  form.value.category = ''
  // Reset payment method to cash when switching to income
  if (form.value.type === 'income' && form.value.paymentMethod === 'credit-card') {
    form.value.paymentMethod = 'cash'
  }
})

function resetForm() {
  form.value = {
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'cash',
    creditCardId: '',
    installments: 1,
    installmentAmount: 0,
    totalInstallmentAmount: 0,
    interestAmount: 0,
    installmentPlan: null
  }
}

function handleSubmit() {
  const amount = parseFloat(form.value.amount)
  
  if (isNaN(amount) || amount <= 0) {
    alert('Por favor, insira um valor válido')
    return
  }

  if (!form.value.category) {
    alert('Por favor, selecione uma categoria')
    return
  }

  const expenseData = {
    type: form.value.type,
    amount: amount,
    category: form.value.category,
    date: form.value.date || new Date().toISOString().split('T')[0],
    description: form.value.description || undefined,
    paymentMethod: form.value.paymentMethod,
    creditCardId: form.value.creditCardId || undefined,
    installments: form.value.installments,
    installmentAmount: installmentPlan.value?.monthlyPayment || amount,
    totalInstallmentAmount: installmentPlan.value?.totalAmount || amount,
    interestAmount: installmentPlan.value?.interestAmount || 0,
    installmentPlan: installmentPlan.value || undefined
  } as Omit<Expense, 'id'>

  if (props.editingExpense) {
    expenseStore.updateExpense(props.editingExpense.id, expenseData)
  } else {
    // Check if it's a recurring subscription
    if (isRecurring.value) {
      // Create subscription
      const subscriptionData = {
        amount: amount,
        category: expenseData.category,
        description: expenseData.description || `${expenseData.category} - Assinatura`,
        type: expenseData.type,
        paymentMethod: expenseData.paymentMethod,
        creditCardId: expenseData.creditCardId,
        startDate: expenseData.date,
        nextDueDate: expenseData.date,
        dayOfMonth: new Date(expenseData.date).getDate(),
        isActive: true
      }
      expenseStore.addSubscription(subscriptionData)
    } else if (expenseData.paymentMethod === 'credit-card' && (expenseData.installments || 1) > 1 && expenseData.creditCardId) {
      expenseStore.addInstallmentSeries({
        amount: amount,
        category: expenseData.category,
        date: expenseData.date,
        description: expenseData.description,
        type: 'expense',
        paymentMethod: 'credit-card',
        creditCardId: expenseData.creditCardId,
        installments: expenseData.installments!,
        totalAmount: amount
      })
    } else {
      expenseStore.addExpense(expenseData)
    }
  }

  resetForm()
  emit('expenseAdded')
}

function formatCurrency(amount: number): string {
  return amount.toFixed(2).replace('.', ',')
}

function cancelEdit() {
  resetForm()
  emit('editCancelled')
}
</script>