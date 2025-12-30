# 💰 Budget Configuration - Already Available!

## Good News!
Your categories **already have budget fields** built in! Check `src/stores/expense.ts` lines 64-80.

## Current Budgets (Default Values):
- 🏠 Moradia: R$ 1.400,00
- 📄 Contas: R$ 190,00
- 🛒 Alimentação: R$ 400,00
- 🚗 Transporte: R$ 200,00
- 🎮 Lazer: R$ 150,00
- 🏥 Saúde: R$ 100,00
- ✈️ Viagem: R$ 300,00
- 📦 Outros: R$ 0,00

## How to Add Budget UI in Settings:

You can add a budget configuration section in Settings.vue. Here's what you need:

### 1. In the template (after Telegram section):
```vue
<!-- Orçamento por Categoria -->
<div class="card">
  <h2 class="text-xl font-semibold mb-4">Orçamento por Categoria</h2>
  
  <div class="space-y-3">
    <div v-for="category in expenseStore.categories.filter(c => c.type === 'expense')" 
         :key="category.id"
         class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div class="flex items-center gap-3">
        <span class="text-2xl">{{ category.icon }}</span>
        <span class="font-medium">{{ category.name }}</span>
      </div>
      <input 
        v-model.number="category.budget"
        type="number"
        step="0.01"
        min="0"
        class="w-32 px-3 py-2 border rounded-lg"
        placeholder="0,00"
      />
    </div>
  </div>
  
  <button @click="saveBudgets" class="btn-primary mt-4">
    Salvar Orçamentos
  </button>
</div>
```

### 2. In the script:
```typescript
function saveBudgets() {
  expenseStore.saveToLocalStorage()
  // Show success message
  alert('Orçamentos salvos!')
}
```

## That's It!
The budget data is already in the store, you just need to add the UI to edit it. The values are already being saved to localStorage automatically.

## Future Enhancement:
You could add budget warnings in ExpenseSummary.vue to show when you're close to or over budget for each category!

Example:
```typescript
const budgetWarnings = computed(() => {
  return expenseStore.categories.map(cat => {
    const spent = expenseStore.expensesByCategory[cat.name] || 0
    const budget = cat.budget || 0
    const percentage = budget > 0 ? (spent / budget) * 100 : 0
    return {
      category: cat.name,
      spent,
      budget,
      percentage,
      isOver: percentage > 100,
      isWarning: percentage > 80
    }
  })
})
```

This would let you show visual warnings like:
- 🟢 Under 80% = Good
- 🟡 80-100% = Warning  
- 🔴 Over 100% = Over budget!
