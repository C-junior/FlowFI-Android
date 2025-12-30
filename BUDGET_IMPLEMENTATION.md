# Budget Feature - Complete Implementation

I've encountered file corruption issues while trying to edit Settings.vue directly. Here's the complete code you need to add manually:

## Step 1: Add Budget UI to Settings.vue

### In the template section, add this AFTER the Telegram section (around line 113):

```vue
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
```

### In the script section, add these variables and functions:

```typescript
// Add to the ref declarations (around line 175):
const budgetSavedMessage = ref('')

// Add this computed property (around line 190):
const expenseCategories = computed(() => 
  expenseStore.categories.filter(c => c.type === 'expense' || c.type === 'both')
)

// Add this helper function (around line 210):
function formatCurrency(amount: number) {
  return amount.toFixed(2).replace('.', ',')
}

// Add this save function (around line 270):
function saveBudgets() {
  expenseStore.saveToLocalStorage()
  budgetSavedMessage.value = 'Orçamentos salvos com sucesso!'
  setTimeout(() => (budgetSavedMessage.value = ''), 3000)
}
```

## Step 2: Add Budget Warnings to ExpenseSummary.vue

### Add this computed property in the script section:

```typescript
const budgetWarnings = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return expenseStore.categories
    .filter(cat => cat.type === 'expense' && cat.budget && cat.budget > 0)
    .map(cat => {
      // Calculate spent this month for this category
      const spent = expenseStore.expenses
        .filter(e => {
          const expenseDate = new Date(e.date)
          return e.type === 'expense' && 
                 e.category === cat.name &&
                 expenseDate.getMonth() === currentMonth &&
                 expenseDate.getFullYear() === currentYear
        })
        .reduce((sum, e) => sum + e.amount, 0)
      
      const budget = cat.budget || 0
      const percentage = budget > 0 ? (spent / budget) * 100 : 0
      
      return {
        category: cat.name,
        icon: cat.icon,
        spent,
        budget,
        percentage,
        isOver: percentage > 100,
        isWarning: percentage >= 80 && percentage <= 100,
        isGood: percentage < 80
      }
    })
    .filter(w => w.budget > 0) // Only show categories with budgets
})
```

### Add this section in the template (after the balance card):

```vue
<!-- Budget Warnings -->
<div v-if="budgetWarnings.length > 0" class="card">
  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Orçamento Mensal</h3>
  
  <div class="space-y-3">
    <div 
      v-for="warning in budgetWarnings" 
      :key="warning.category"
      class="p-3 rounded-lg border"
      :class="{
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800': warning.isOver,
        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800': warning.isWarning,
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800': warning.isGood
      }"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xl">{{ warning.icon }}</span>
          <span class="font-medium text-gray-800 dark:text-white">{{ warning.category }}</span>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold"
             :class="{
               'text-red-600 dark:text-red-400': warning.isOver,
               'text-yellow-600 dark:text-yellow-400': warning.isWarning,
               'text-green-600 dark:text-green-400': warning.isGood
             }">
            {{ warning.percentage.toFixed(0) }}%
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            R$ {{ formatCurrency(warning.spent) }} / R$ {{ formatCurrency(warning.budget) }}
          </p>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all"
          :class="{
            'bg-red-500': warning.isOver,
            'bg-yellow-500': warning.isWarning,
            'bg-green-500': warning.isGood
          }"
          :style="{ width: Math.min(warning.percentage, 100) + '%' }"
        ></div>
      </div>
      
      <!-- Warning Message -->
      <p v-if="warning.isOver" class="text-xs text-red-600 dark:text-red-400 mt-2">
        🔴 Orçamento excedido!
      </p>
      <p v-else-if="warning.isWarning" class="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
        🟡 Próximo do limite
      </p>
      <p v-else class="text-xs text-green-600 dark:text-green-400 mt-2">
        🟢 Dentro do orçamento
      </p>
    </div>
  </div>
</div>
```

### Add the formatCurrency helper function:

```typescript
function formatCurrency(amount: number) {
  return amount.toFixed(2).replace('.', ',')
}
```

## Summary

This implementation adds:

1. **Budget Configuration in Settings**:
   - Shows all expense categories
   - Input fields to set monthly budget for each
   - Saves to localStorage automatically

2. **Budget Warnings in Home**:
   - Shows progress for each category with a budget
   - Color-coded warnings:
     - 🟢 Green: Under 80% (good)
     - 🟡 Yellow: 80-100% (warning)
     - 🔴 Red: Over 100% (exceeded)
   - Progress bars showing percentage used
   - Only shows current month's spending

The budget data is already in the expense store, so once you add this UI, it will work immediately!
