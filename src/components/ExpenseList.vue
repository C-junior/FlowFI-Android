<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
        Histórico de Despesas
      </h2>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ filteredExpenses.length }} transações
      </span>
    </div>

    <!-- Filtros -->
    <div v-if="showFilters" class="mb-4 space-y-3">
      <div class="flex gap-2">
        <button
          @click="setFilter('all')"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            currentFilter === 'all' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          Todas
        </button>
        <button
          @click="setFilter('expense')"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            currentFilter === 'expense' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          Despesas
        </button>
        <button
          @click="setFilter('income')"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            currentFilter === 'income' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          Receitas
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          v-model="selectedCategory"
          @change="setCategoryFilter(selectedCategory)"
          class="input-field text-sm"
        >
          <option value="">Todas as categorias</option>
          <option 
            v-for="category in categories" 
            :key="category.id" 
            :value="category.name"
          >
            {{ category.icon }} {{ category.name }}
          </option>
        </select>

        <div class="flex gap-2">
          <input
            v-model="startDate"
            type="date"
            class="input-field text-sm"
            @change="updateDateFilter"
          />
          <input
            v-model="endDate"
            type="date"
            class="input-field text-sm"
            @change="updateDateFilter"
          />
        </div>
      </div>
    </div>

    <!-- Lista de despesas -->
    <div class="space-y-2">
      <div 
        v-for="expense in filteredExpenses" 
        :key="expense.id"
        class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent dark:border-gray-700/30"
      >
        <div class="flex items-center gap-3">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center',
                getCategoryColor(expense.category)
              ]"
            >
              <component :is="getCategoryIconComponent(expense.category)" class="w-5 h-5 text-white" />
            </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-800 dark:text-white">
                {{ expense.category }}
              </h3>
              <span 
                :class="[
                  'text-xs px-2 py-1 rounded-full',
                  expense.type === 'expense' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                ]"
              >
                {{ expense.type === 'expense' ? 'Despesa' : 'Receita' }}
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(expense.date) }}
              <span v-if="expense.description" class="ml-1">
                • {{ expense.description }}
              </span>
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <component :is="getPaymentIconComponent(expense.paymentMethod)" class="w-4 h-4" />
                {{ getPaymentMethodLabel(expense.paymentMethod) }}
              </span>
              <span 
                v-if="expense.paymentMethod === 'credit-card' && getCreditCardInfo(expense)"
                class="text-xs px-2 py-1 rounded-full"
                :style="{ backgroundColor: getCreditCardInfo(expense)?.color + '20', color: getCreditCardInfo(expense)?.color }"
              >
                {{ getCreditCardInfo(expense)?.name }}
              </span>
              <span 
                v-if="expense.installments && expense.installments > 1"
                class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
              >
                {{ expense.installments }}x de R$ {{ formatCurrency(expense.installmentAmount || 0) }}
                <span v-if="expense.interestAmount && expense.interestAmount > 0" class="text-blue-600 dark:text-blue-400">
                  (+R$ {{ formatCurrency(expense.interestAmount) }} juros)
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span 
            :class="[
              'font-semibold',
              expense.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            ]"
          >
            {{ expense.type === 'expense' ? '-' : '+' }} R$ {{ formatCurrency(expense.amount) }}
          </span>
          
          <div class="flex gap-1">
            <button
              @click="editExpense(expense)"
              class="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Editar"
            >
              ✏️
            </button>
            <button
              @click="deleteExpense(expense.id)"
              class="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Excluir"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div 
        v-if="filteredExpenses.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <p>Nenhuma transação encontrada</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Home, FileText, ShoppingCart, Car, Gamepad2, HeartPulse, Plane, BadgeDollarSign, Package, CreditCard as LCreditCard, Smartphone, CircleDollarSign } from 'lucide-vue-next'
import { useExpenseStore } from '@/stores/expense'
import { useCreditCardStore } from '@/stores/creditCard'
import type { Expense } from '@/stores/expense'

const expenseStore = useExpenseStore()
const creditCardStore = useCreditCardStore()

const props = defineProps<{
  limit?: number
  showFilters?: boolean
}>()

const emit = defineEmits<{
  editExpense: [expense: Expense]
}>()

const selectedCategory = ref('')
const startDate = ref('')
const endDate = ref('')

const filteredExpenses = computed(() => {
  const expenses = expenseStore.filteredExpenses
  if (props.limit) {
    return expenses.slice(0, props.limit)
  }
  return expenses
})
const currentFilter = computed(() => expenseStore.currentFilter)
const categories = computed(() => expenseStore.categories)

function getCategoryColor(categoryName: string) {
  const category = expenseStore.categories.find(cat => cat.name === categoryName)
  return category?.color || 'bg-gray-500'
}

function getCategoryIconComponent(categoryName: string) {
  const map: Record<string, any> = {
    'Moradia': Home,
    'Contas': FileText,
    'Alimentação': ShoppingCart,
    'Transporte': Car,
    'Lazer': Gamepad2,
    'Saúde': HeartPulse,
    'Viagem': Plane,
    'Salário': BadgeDollarSign,
    'Outros': Package
  }
  return map[categoryName] || Package
}

function formatCurrency(amount: number) {
  return amount.toFixed(2).replace('.', ',')
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getPaymentMethodLabel(paymentMethod: string): string {
  const labels = {
    'credit-card': 'Cartão de Crédito',
    'debit-card': 'Cartão de Débito',
    'pix': 'Pix',
    'cash': 'Dinheiro',
    'other': 'Outro'
  }
  return labels[paymentMethod as keyof typeof labels] || 'Outro'
}

function getPaymentIconComponent(paymentMethod: string) {
  const map: Record<string, any> = {
    'credit-card': LCreditCard,
    'debit-card': LCreditCard,
    'pix': Smartphone,
    'cash': CircleDollarSign,
    'other': Package
  }
  return map[paymentMethod] || Package
}

function getCreditCardInfo(expense: Expense) {
  if (expense.paymentMethod === 'credit-card' && expense.creditCardId) {
    const card = creditCardStore.getCardById(expense.creditCardId)
    if (card) {
      return {
        name: card.name,
        color: card.color
      }
    }
  }
  return null
}

function setFilter(filter: 'all' | 'expense' | 'income') {
  expenseStore.setFilter(filter)
}

function setCategoryFilter(category: string) {
  expenseStore.setCategoryFilter(category)
}

function updateDateFilter() {
  if (startDate.value && endDate.value) {
    expenseStore.setDateFilter(startDate.value, endDate.value)
  } else {
    expenseStore.setDateFilter()
  }
}

function editExpense(expense: Expense) {
  emit('editExpense', expense)
}

function deleteExpense(id: string) {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    expenseStore.deleteExpense(id)
  }
}

// Limpar filtros quando mudar a categoria
watch(selectedCategory, (newCategory) => {
  if (!newCategory) {
    expenseStore.setCategoryFilter('')
  }
})
</script>