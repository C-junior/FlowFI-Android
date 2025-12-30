<template>
  <div class="space-y-4">
    <!-- Saldo Atual -->
    <div class="card bg-gradient-to-r from-primary-500 to-primary-600 text-white border-none">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-medium text-white">Saldo Atual</h3>
        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <Wallet class="w-5 h-5 text-white" />
        </div>
      </div>
      <p class="text-3xl font-bold text-white">
        R$ {{ formatCurrency(balance) }}
      </p>
      <p class="text-sm text-white text-opacity-80 mt-1">
        {{ balance >= 0 ? 'Positivo' : 'Negativo' }}
      </p>
    </div>

    <!-- Resumo Financeiro -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resumo do Mês</h3>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
        <div class="flex items-center justify-center mb-1">
          <TrendingUp class="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
          <p class="text-sm text-green-600 dark:text-green-400 font-medium">Receitas</p>
          <p class="text-lg font-bold text-green-700 dark:text-green-300">
            R$ {{ formatCurrency(totalIncome) }}
          </p>
        </div>
        
        <div class="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
        <div class="flex items-center justify-center mb-1">
          <TrendingDown class="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
          <p class="text-sm text-red-600 dark:text-red-400 font-medium">Despesas</p>
          <p class="text-lg font-bold text-red-700 dark:text-red-300">
            R$ {{ formatCurrency(totalExpenses) }}
          </p>
        </div>
      </div>

      <!-- Barra de progresso -->
      <div class="mb-2">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progresso do mês</span>
          <span>{{ totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0 }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="[
              totalExpenses > totalIncome ? 'bg-red-500' : 'bg-green-500',
              totalIncome > 0 ? 'w-full' : 'w-0'
            ]"
            :style="{ width: totalIncome > 0 ? `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` : '0%' }"
          ></div>
        </div>
      </div>

      <p 
        v-if="totalExpenses > totalIncome"
        class="text-sm text-red-600 dark:text-red-400 text-center mt-2"
      >
        <span class="inline-flex items-center gap-1"><AlertTriangle class="w-4 h-4" /> Você ultrapassou seu orçamento em R$ {{ formatCurrency(totalExpenses - totalIncome) }}</span>
      </p>
    </div>

    <!-- Gastos Diários -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Gastos Diários</h3>
      <div class="h-48 w-full">
        <Bar :data="dailySpendingData" :options="barOptions" />
      </div>
    </div>

    <!-- Despesas por Categoria -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Despesas por Categoria</h3>
      
      <div class="space-y-3">
        <div v-if="categoryExpenses.length > 0" class="h-64 mb-6">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
        <div 
          v-for="category in categoryExpenses" 
          :key="category.id"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center',
                category.color
              ]"
            >
              <component :is="getCategoryIconComponent(category.name)" class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">{{ category.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ category.budget ? `Orçamento: R$ ${formatCurrency(category.budget)}` : 'Sem orçamento' }}
              </p>
            </div>
          </div>
          
          <div class="text-right">
            <p class="font-semibold text-gray-800 dark:text-white">
              R$ {{ formatCurrency(category.spent) }}
            </p>
            <p 
              v-if="category.budget"
              :class="[
                'text-xs',
                category.spent > category.budget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              ]"
            >
              {{ category.spent > category.budget ? 
                `R$ ${formatCurrency(category.spent - category.budget)} ultrapassado` :
                `R$ ${formatCurrency(category.budget - category.spent)} restante`
              }}
            </p>
            <div 
              v-if="category.budget"
              class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1 ml-auto"
            >
              <div 
                class="h-1 rounded-full transition-all duration-300"
                :class="[
                  category.spent > category.budget ? 'bg-red-500' : 'bg-green-500',
                  category.budget > 0 ? 'w-full' : 'w-0'
                ]"
                :style="{ width: category.budget > 0 ? `${Math.min((category.spent / category.budget) * 100, 100)}%` : '0%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="categoryExpenses.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
        <p>Nenhuma despesa registrada</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExpenseStore } from '@/stores/expense'
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, Home, FileText, ShoppingCart, Car, Gamepad2, HeartPulse, Plane, BadgeDollarSign, Package } from 'lucide-vue-next'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

const expenseStore = useExpenseStore()

const balance = computed(() => expenseStore.balance)
const totalExpenses = computed(() => expenseStore.totalExpenses)
const totalIncome = computed(() => expenseStore.totalIncome)

const categoryExpenses = computed(() => {
  return expenseStore.categories.map(category => {
    const spent = expenseStore.expensesByCategory[category.name] || 0
    return {
      ...category,
      spent
    }
  }).filter(cat => cat.spent > 0).sort((a, b) => b.spent - a.spent)
})

function formatCurrency(amount: number) {
  return Math.abs(amount).toFixed(2).replace('.', ',')
}

function getCategoryIconComponent(name: string) {
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
  return map[name] || Package
}

function getCategoryColor(bgClass: string) {
  const map: Record<string, string> = {
    'bg-purple-500': '#a855f7',
    'bg-pink-500': '#ec4899',
    'bg-green-500': '#22c55e',
    'bg-blue-500': '#3b82f6',
    'bg-orange-500': '#f97316',
    'bg-red-500': '#ef4444',
    'bg-cyan-500': '#06b6d4',
    'bg-green-600': '#16a34a',
    'bg-gray-500': '#6b7280'
  }
  return map[bgClass] || '#cbd5e1'
}

const doughnutData = computed(() => {
  const labels = categoryExpenses.value.map(c => c.name)
  const data = categoryExpenses.value.map(c => c.spent)
  const backgroundColors = categoryExpenses.value.map(c => getCategoryColor(c.color))

  return {
    labels,
    datasets: [{
      backgroundColor: backgroundColors,
      data,
      borderWidth: 0
    }]
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        padding: 20,
        font: {
          size: 11
        }
      }
    }
  },
  cutout: '75%'
}

const dailySpendingData = computed(() => {
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const labels = Array.from({length: daysInMonth}, (_, i) => i + 1)
  
  const data = new Array(daysInMonth).fill(0)
  
  expenseStore.expenses.forEach(e => {
    if (e.type === 'expense') {
      const d = new Date(e.date)
      if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
        data[d.getDate() - 1] += e.amount
      }
    }
  })
  
  return {
    labels,
    datasets: [{
      label: 'Gastos',
      backgroundColor: '#3b82f6',
      data,
      borderRadius: 4
    }]
  }
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false
      },
      ticks: {
        display: false
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        font: {
          size: 10
        },
        maxTicksLimit: 10
      }
    }
  }
}
</script>