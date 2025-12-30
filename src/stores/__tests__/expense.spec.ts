import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExpenseStore } from '@/stores/expense'

describe('ExpenseStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Limpar localStorage antes de cada teste
    localStorage.clear()
  })

  it('deve adicionar uma nova despesa', () => {
    const store = useExpenseStore()

    const expense = {
      type: 'expense' as const,
      amount: 100,
      category: 'Alimentação',
      date: '2024-01-01',
      description: 'Teste de despesa',
      paymentMethod: 'cash' as const
    }

    store.addExpense(expense)

    expect(store.expenses).toHaveLength(1)
    expect(store.expenses[0]?.amount).toBe(100)
    expect(store.expenses[0]?.category).toBe('Alimentação')
    expect(store.totalExpenses).toBe(100)
  })

  it('deve adicionar uma nova receita', () => {
    const store = useExpenseStore()

    const income = {
      type: 'income' as const,
      amount: 5000,
      category: 'Salário',
      date: '2024-01-01',
      description: 'Salário mensal',
      paymentMethod: 'cash' as const
    }

    store.addExpense(income)

    expect(store.expenses).toHaveLength(1)
    expect(store.expenses[0]?.amount).toBe(5000)
    expect(store.totalIncome).toBe(5000)
  })

  it('deve calcular o saldo corretamente', () => {
    const store = useExpenseStore()

    store.addExpense({
      type: 'income' as const,
      amount: 5000,
      category: 'Salário',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    store.addExpense({
      type: 'expense' as const,
      amount: 1000,
      category: 'Alimentação',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    store.addExpense({
      type: 'expense' as const,
      amount: 500,
      category: 'Transporte',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    expect(store.balance).toBe(3500) // 5000 - 1000 - 500
  })

  it('deve filtrar despesas por tipo', () => {
    const store = useExpenseStore()

    store.addExpense({
      type: 'income' as const,
      amount: 5000,
      category: 'Salário',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    store.addExpense({
      type: 'expense' as const,
      amount: 1000,
      category: 'Alimentação',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    store.setFilter('expense')
    expect(store.filteredExpenses).toHaveLength(1)
    expect(store.filteredExpenses[0]?.type).toBe('expense')

    store.setFilter('income')
    expect(store.filteredExpenses).toHaveLength(1)
    expect(store.filteredExpenses[0]?.type).toBe('income')
  })

  it('deve filtrar despesas por categoria', () => {
    const store = useExpenseStore()

    store.addExpense({
      type: 'expense' as const,
      amount: 1000,
      category: 'Alimentação',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    store.addExpense({
      type: 'expense' as const,
      amount: 500,
      category: 'Transporte',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    store.setCategoryFilter('Alimentação')
    expect(store.filteredExpenses).toHaveLength(1)
    expect(store.filteredExpenses[0]?.category).toBe('Alimentação')
  })

  it('deve deletar uma despesa', () => {
    const store = useExpenseStore()

    store.addExpense({
      type: 'expense' as const,
      amount: 1000,
      category: 'Alimentação',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    const expenseId = store.expenses[0]?.id || ''
    expect(store.expenses).toHaveLength(1)

    store.deleteExpense(expenseId)
    expect(store.expenses).toHaveLength(0)
  })

  it('deve atualizar uma despesa', () => {
    const store = useExpenseStore()

    store.addExpense({
      type: 'expense' as const,
      amount: 1000,
      category: 'Alimentação',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    const expenseId = store.expenses[0]?.id

    if (expenseId) {
      store.updateExpense(expenseId, {
        amount: 1500,
        description: 'Despesa atualizada'
      })
    }

    expect(store.expenses[0]?.amount).toBe(1500)
    expect(store.expenses[0]?.description).toBe('Despesa atualizada')
  })

  it('deve agrupar despesas por categoria', () => {
    const store = useExpenseStore()

    store.addExpense({
      type: 'expense' as const,
      amount: 1000,
      category: 'Alimentação',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    store.addExpense({
      type: 'expense' as const,
      amount: 500,
      category: 'Alimentação',
      date: '2024-01-02',
      paymentMethod: 'cash' as const
    })

    store.addExpense({
      type: 'expense' as const,
      amount: 300,
      category: 'Transporte',
      date: '2024-01-01',
      paymentMethod: 'cash' as const
    })

    expect(store.expensesByCategory['Alimentação']).toBe(1500) // 1000 + 500
    expect(store.expensesByCategory['Transporte']).toBe(300)
  })
})