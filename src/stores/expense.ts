import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCreditCardStore } from './creditCard'
import { firestoreService } from '@/services/firestoreService'
import { useUserStore } from './user'

export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  description?: string
  type: 'expense' | 'income'
  paymentMethod: 'credit-card' | 'debit-card' | 'pix' | 'cash' | 'other'
  creditCardId?: string // ID do cartão de crédito (se aplicável)
  installments?: number // Número de parcelas (para cartão de crédito)
  installmentAmount?: number // Valor da parcela
  totalInstallmentAmount?: number // Valor total com juros
  interestAmount?: number // Valor dos juros
  installmentPlan?: InstallmentPlan // Plano de parcelamento completo
  installmentGroupId?: string // ID do grupo de parcelamento
  installmentIndex?: number // Número da parcela (1..n)
  installmentCount?: number // Total de parcelas (n)
  processed?: boolean // se a parcela já foi processada (debitada)
  receiptId?: string // comprovante individual quando processada
  isSubscription?: boolean // True se esta despesa faz parte de uma assinatura
  subscriptionId?: string // ID da assinatura (vincula todas as despesas da mesma assinatura)
}

export interface InstallmentPlan {
  months: number
  monthlyPayment: number
  totalAmount: number
  interestAmount: number
  hasInterest: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  budget?: number
  type: 'expense' | 'income' | 'both' // Type of transaction this category applies to
}

export interface Subscription {
  id: string
  amount: number
  category: string
  description: string
  type: 'expense' | 'income'
  paymentMethod: 'credit-card' | 'debit-card' | 'pix' | 'cash' | 'other'
  creditCardId?: string
  startDate: string
  nextDueDate: string
  dayOfMonth: number
  isActive: boolean
  createdAt: string
}

export const useExpenseStore = defineStore('expense', () => {
  const creditCardStore = useCreditCardStore()
  const expenses = ref<Expense[]>([])
  const subscriptions = ref<Subscription[]>([])
  const categories = ref<Category[]>([
    // Expense categories
    { id: '1', name: 'Moradia', icon: '🏠', color: 'bg-purple-500', budget: 1400, type: 'expense' },
    { id: '2', name: 'Contas', icon: '📄', color: 'bg-pink-500', budget: 190, type: 'expense' },
    { id: '3', name: 'Alimentação', icon: '🛒', color: 'bg-green-500', budget: 400, type: 'expense' },
    { id: '4', name: 'Transporte', icon: '🚗', color: 'bg-blue-500', budget: 200, type: 'expense' },
    { id: '5', name: 'Lazer', icon: '🎮', color: 'bg-orange-500', budget: 150, type: 'expense' },
    { id: '6', name: 'Saúde', icon: '🏥', color: 'bg-red-500', budget: 100, type: 'expense' },
    { id: '7', name: 'Viagem', icon: '✈️', color: 'bg-cyan-500', budget: 300, type: 'expense' },
    { id: '9', name: 'Outros', icon: '📦', color: 'bg-gray-500', budget: 0, type: 'both' },
    // Income categories
    { id: '10', name: 'Salário', icon: '💰', color: 'bg-green-600', budget: 0, type: 'income' },
    { id: '11', name: 'Freelance', icon: '💼', color: 'bg-blue-600', budget: 0, type: 'income' },
    { id: '12', name: 'Investimentos', icon: '📈', color: 'bg-purple-600', budget: 0, type: 'income' },
    { id: '13', name: 'Bônus', icon: '🎁', color: 'bg-yellow-600', budget: 0, type: 'income' },
    { id: '14', name: 'Vendas', icon: '🛍️', color: 'bg-pink-600', budget: 0, type: 'income' }
  ])

  const currentFilter = ref<'all' | 'expense' | 'income'>('all')
  const dateFilter = ref<{ start?: string; end?: string }>({})
  const categoryFilter = ref<string>('')

  const totalExpenses = computed(() => {
    return expenses.value
      .filter(expense => expense.type === 'expense' && expense.processed)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })

  const totalIncome = computed(() => {
    return expenses.value
      .filter(expense => expense.type === 'income')
      .reduce((sum, expense) => sum + expense.amount, 0)
  })

  const balance = computed(() => totalIncome.value - totalExpenses.value)

  const filteredExpenses = computed(() => {
    let filtered = expenses.value

    if (currentFilter.value !== 'all') {
      filtered = filtered.filter(expense => expense.type === currentFilter.value)
    }

    if (categoryFilter.value) {
      filtered = filtered.filter(expense => expense.category === categoryFilter.value)
    }

    if (dateFilter.value.start && dateFilter.value.end) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date)
        const startDate = new Date(dateFilter.value.start!)
        const endDate = new Date(dateFilter.value.end!)
        return expenseDate >= startDate && expenseDate <= endDate
      })
    }

    // Sort by date (newest first), then by ID (newest first) for consistent ordering
    return filtered.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (dateCompare !== 0) return dateCompare
      // If same date, sort by ID (which is timestamp-based)
      return b.id.localeCompare(a.id)
    })
  })

  const expensesByCategory = computed(() => {
    const grouped: Record<string, number> = {}
    expenses.value
      .filter(expense => expense.type === 'expense' && expense.processed)
      .forEach(expense => {
        grouped[expense.category] = (grouped[expense.category] || 0) + expense.amount
      })
    return grouped
  })

  const pendingInstallments = computed(() => {
    return expenses.value.filter(e => e.type === 'expense' && e.paymentMethod === 'credit-card' && !e.processed).length
  })

  const remainingInstallmentsAmount = computed(() => {
    return expenses.value
      .filter(e => e.type === 'expense' && e.paymentMethod === 'credit-card' && !e.processed)
      .reduce((sum, e) => sum + e.amount, 0)
  })

  async function addExpense(expenseData: Omit<Expense, 'id'>) {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    }

    // Processar débito no cartão de crédito (consumir limite imediatamente)
    if (
      newExpense.type === 'expense' &&
      newExpense.paymentMethod === 'credit-card' &&
      newExpense.creditCardId
    ) {
      // O limite é consumido no momento da compra, independente do vencimento da fatura
      creditCardStore.updateUsedLimit(newExpense.creditCardId, newExpense.amount)

      const today = new Date()
      const expenseDate = new Date(newExpense.date)

      // Marcamos como processado se a data for hoje ou passado (para fins de fluxo de caixa/extrato)
      // Mas o limite já foi tomado.
      if (expenseDate <= today) {
        newExpense.processed = true
        newExpense.receiptId = `${newExpense.id}-rcpt`
      } else {
        newExpense.processed = false
      }
    }

    expenses.value.push(newExpense)
    await saveData()
  }

  async function deleteExpense(id: string) {
    const expense = expenses.value.find(exp => exp.id === id)
    if (expense) {
      // Se for despesa no cartão de crédito, restaurar o limite
      if (expense.type === 'expense' && expense.paymentMethod === 'credit-card' && expense.creditCardId && expense.processed) {
        creditCardStore.updateUsedLimit(expense.creditCardId, -expense.amount)
      }

      const index = expenses.value.findIndex(exp => exp.id === id)
      if (index > -1) {
        expenses.value.splice(index, 1)
        const userStore = useUserStore()
        if (userStore.userId) {
          await firestoreService.deleteExpense(userStore.userId, id)
        }
      }
    }
  }

  async function updateExpense(id: string, updates: Partial<Expense>) {
    const expense = expenses.value.find(exp => exp.id === id)
    if (expense) {
      Object.assign(expense, updates)
      await saveData()
    }
  }

  // Criar série de parcelas com agendamento mensal
  function addInstallmentSeries(base: Omit<Expense, 'id' | 'installments' | 'installmentAmount' | 'totalInstallmentAmount' | 'interestAmount' | 'installmentPlan'> & { installments: number; totalAmount: number }) {
    const groupId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const months = Math.max(1, base.installments)
    const totalCents = Math.round(base.totalAmount * 100)
    const baseCents = Math.floor(totalCents / months)
    const remainder = totalCents - baseCents * months

    const purchaseDate = new Date(base.date)
    let firstDue = new Date(purchaseDate)
    const card = base.creditCardId ? creditCardStore.getCardById(base.creditCardId) : undefined
    if (card) {
      // Definir primeiro vencimento conforme fechamento/pagamento
      const purchaseDay = purchaseDate.getDate()
      const offsetMonths = purchaseDay <= card.closingDate ? 1 : 2
      firstDue = new Date(purchaseDate)
      firstDue.setMonth(firstDue.getMonth() + offsetMonths)
      firstDue.setDate(card.paymentDate)
    } else {
      // fallback: próximo mês mesma data
      firstDue.setMonth(firstDue.getMonth() + 1)
    }

    for (let i = 0; i < months; i++) {
      const cents = baseCents + (i < remainder ? 1 : 0)
      const amount = cents / 100
      const dueDate = new Date(firstDue)
      dueDate.setMonth(dueDate.getMonth() + i)

      addExpense({
        amount,
        category: base.category,
        date: dueDate.toISOString().split('T')[0]!,
        description: `${base.description || ''} Parcela ${i + 1}/${months}`.trim(),
        type: 'expense',
        paymentMethod: 'credit-card',
        creditCardId: base.creditCardId,
        installments: 1,
        installmentAmount: amount,
        totalInstallmentAmount: amount,
        interestAmount: 0,
        installmentGroupId: groupId,
        installmentIndex: i + 1,
        installmentCount: months
      })
    }
  }

  // Processar parcelas vencidas (debitar no cartão e marcar recibo)
  async function processDueInstallments() {
    const today = new Date()
    expenses.value.forEach(exp => {
      if (
        exp.type === 'expense' &&
        exp.paymentMethod === 'credit-card' &&
        exp.creditCardId &&
        !exp.processed &&
        new Date(exp.date) <= today
      ) {
        creditCardStore.updateUsedLimit(exp.creditCardId, exp.amount)
        exp.processed = true
        exp.receiptId = `${exp.id}-rcpt`
      }
    })
    await saveData()
  }

  function setFilter(filter: 'all' | 'expense' | 'income') {
    currentFilter.value = filter
  }

  function setDateFilter(start?: string, end?: string) {
    dateFilter.value = { start, end }
  }

  function setCategoryFilter(category: string) {
    categoryFilter.value = category
  }

  function clearFilters() {
    currentFilter.value = 'all'
    dateFilter.value = {}
    categoryFilter.value = ''
  }

  async function saveData() {
    const userStore = useUserStore()
    if (userStore.userId) {
      // Save to Firestore
      for (const expense of expenses.value) {
        await firestoreService.saveExpense(userStore.userId, expense)
      }
      for (const subscription of subscriptions.value) {
        await firestoreService.saveSubscription(userStore.userId, subscription)
      }
      // Save categories (including budget values)
      await firestoreService.saveCategories(userStore.userId, categories.value)
    }
  }

  async function loadData() {
    const userStore = useUserStore()
    if (userStore.userId) {
      // Load from Firestore
      const loadedExpenses = await firestoreService.getExpenses(userStore.userId)
      expenses.value = loadedExpenses.map(e => ({
        ...e,
        processed: e.processed ?? (e.paymentMethod !== 'credit-card' ? true : e.processed ?? false)
      }))

      const loadedSubs = await firestoreService.getSubscriptions(userStore.userId)
      subscriptions.value = loadedSubs

      // Load categories (including budget values)
      const loadedCategories = await firestoreService.getCategories(userStore.userId)
      if (loadedCategories) {
        categories.value = loadedCategories
      }
    }
  }

  function getPaymentMethodIcon(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'credit-card': return '💳'
      case 'debit-card': return '💰'
      case 'pix': return '📱'
      case 'cash': return '🪙'
      default: return '💸'
    }
  }

  function getPaymentMethodName(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'credit-card': return 'Cartão de Crédito'
      case 'debit-card': return 'Cartão de Débito'
      case 'pix': return 'Pix'
      case 'cash': return 'Dinheiro'
      default: return 'Outro'
    }
  }

  // Subscription Management Functions
  async function addSubscription(data: Omit<Subscription, 'id' | 'createdAt'>) {
    const newSubscription: Subscription = {
      ...data,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString()
    }

    subscriptions.value.push(newSubscription)

    // Generate first expense immediately
    await generateSubscriptionExpense(newSubscription)

    await saveData()
  }

  async function generateSubscriptionExpense(subscription: Subscription) {
    // Check if an expense already exists for this subscription on this date
    const existingExpense = expenses.value.find(e =>
      e.subscriptionId === subscription.id &&
      e.date === subscription.nextDueDate
    )

    if (existingExpense) {
      // Already generated, just update the next due date
      const nextDate = new Date(subscription.nextDueDate)
      nextDate.setMonth(nextDate.getMonth() + 1)

      const targetDay = subscription.dayOfMonth
      nextDate.setDate(1)
      const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()
      nextDate.setDate(Math.min(targetDay, lastDayOfMonth))

      subscription.nextDueDate = nextDate.toISOString().split('T')[0]!
      return
    }

    const expenseData: Omit<Expense, 'id'> = {
      amount: subscription.amount,
      category: subscription.category,
      description: subscription.description,
      type: subscription.type,
      paymentMethod: subscription.paymentMethod,
      creditCardId: subscription.creditCardId,
      date: subscription.nextDueDate,
      isSubscription: true,
      subscriptionId: subscription.id
    }

    await addExpense(expenseData)

    // Update next due date
    const nextDate = new Date(subscription.nextDueDate)
    nextDate.setMonth(nextDate.getMonth() + 1)

    // Handle day of month (e.g., if subscription is on day 31, use last day of month)
    const targetDay = subscription.dayOfMonth
    nextDate.setDate(1) // Set to first day first
    nextDate.setMonth(nextDate.getMonth()) // Stay in the month
    const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()
    nextDate.setDate(Math.min(targetDay, lastDayOfMonth))

    subscription.nextDueDate = nextDate.toISOString().split('T')[0]!
  }

  async function processSubscriptions() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const subscription of subscriptions.value) {
      if (!subscription.isActive) continue

      let nextDue = new Date(subscription.nextDueDate)
      nextDue.setHours(0, 0, 0, 0)

      // Generate expenses for all missed months
      // Safety limit to prevent infinite loops
      let iterations = 0
      const MAX_ITERATIONS = 120 // Max 10 years of monthly subscriptions

      while (nextDue <= today && iterations < MAX_ITERATIONS) {
        await generateSubscriptionExpense(subscription)

        // Update nextDue from the subscription after it's been modified
        nextDue = new Date(subscription.nextDueDate)
        nextDue.setHours(0, 0, 0, 0)

        iterations++
      }

      if (iterations >= MAX_ITERATIONS) {
        console.warn(`Subscription ${subscription.id} hit max iterations limit`)
      }
    }

    await saveData()
  }

  async function cancelSubscription(id: string) {
    const subscription = subscriptions.value.find(s => s.id === id)
    if (subscription) {
      subscription.isActive = false
      await saveData()
    }
  }

  async function reactivateSubscription(id: string) {
    const subscription = subscriptions.value.find(s => s.id === id)
    if (subscription) {
      subscription.isActive = true
      // Generate any missing expenses since it was canceled
      await processSubscriptions()
    }
  }

  async function deleteSubscription(id: string, deleteExpenses: boolean = false) {
    const index = subscriptions.value.findIndex(s => s.id === id)
    if (index > -1) {
      if (deleteExpenses) {
        // Delete all expenses linked to this subscription
        expenses.value = expenses.value.filter(e => e.subscriptionId !== id)
      }
      subscriptions.value.splice(index, 1)
      const userStore = useUserStore()
      if (userStore.userId) {
        await firestoreService.deleteSubscription(userStore.userId, id)
      }
    }
  }

  async function upsertSubscription(subscription: Subscription) {
    const index = subscriptions.value.findIndex(s => s.id === subscription.id)
    if (index > -1) {
      // Update existing
      subscriptions.value[index] = subscription
      // Note: We might want to update future expenses here, but for now we'll keep it simple
      // and let the processSubscriptions handle new ones.
      // Ideally, we should update the amount/date of future generated expenses.
    } else {
      // Add new
      subscriptions.value.push(subscription)
      await generateSubscriptionExpense(subscription)
    }
    await saveData()
  }

  function getSubscriptionExpenses(subscriptionId: string): Expense[] {
    return expenses.value.filter(e => e.subscriptionId === subscriptionId)
  }

  return {
    expenses,
    subscriptions,
    categories,
    totalExpenses,
    totalIncome,
    balance,
    filteredExpenses,
    expensesByCategory,
    pendingInstallments,
    remainingInstallmentsAmount,
    currentFilter,
    dateFilter,
    categoryFilter,
    addExpense,
    addInstallmentSeries,
    deleteExpense,
    updateExpense,
    processDueInstallments,
    setFilter,
    setDateFilter,
    setCategoryFilter,
    clearFilters,
    saveData,
    loadData,
    getPaymentMethodIcon,
    getPaymentMethodName,
    addSubscription,
    cancelSubscription,
    reactivateSubscription,
    deleteSubscription,
    processSubscriptions,
    getSubscriptionExpenses,
    upsertSubscription
  }
})
