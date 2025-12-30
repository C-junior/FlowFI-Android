import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { firestoreService } from '@/services/firestoreService'
import { useUserStore } from './user'

export interface CreditCard {
  id: string
  name: string // Nome do cartão (ex: "Cartão Nubank")
  closingDate: number // Dia de fechamento da fatura (1-28)
  paymentDate: number // Dia do pagamento (1-28)
  limit: number // Limite total
  usedLimit: number // Limite utilizado
  color: string // Cor do cartão para identificação visual
  isActive: boolean
}

export interface InstallmentPlan {
  months: number
  monthlyPayment: number
  totalAmount: number
  interestAmount: number
  hasInterest: boolean
}

export const useCreditCardStore = defineStore('creditCard', () => {
  const creditCards = ref<CreditCard[]>([])

  const activeCards = computed(() => creditCards.value.filter(card => card.isActive))

  const availableLimit = computed(() => {
    return activeCards.value.reduce((total, card) => {
      return total + (card.limit - card.usedLimit)
    }, 0)
  })

  const totalLimit = computed(() => {
    return activeCards.value.reduce((total, card) => total + card.limit, 0)
  })

  const totalUsedLimit = computed(() => {
    return activeCards.value.reduce((total, card) => total + card.usedLimit, 0)
  })

  async function addCreditCard(card: Omit<CreditCard, 'id' | 'usedLimit'>) {
    const newCard: CreditCard = {
      ...card,
      id: Date.now().toString(),
      usedLimit: 0
    }
    creditCards.value.push(newCard)
    await saveData()
  }

  async function updateCreditCard(id: string, updates: Partial<CreditCard>) {
    const card = creditCards.value.find(card => card.id === id)
    if (card) {
      Object.assign(card, updates)
      await saveData()
    }
  }

  async function deleteCreditCard(id: string) {
    const index = creditCards.value.findIndex(card => card.id === id)
    if (index > -1) {
      creditCards.value.splice(index, 1)
      await saveData()
    }
  }

  async function updateUsedLimit(cardId: string, amount: number) {
    const card = creditCards.value.find(card => card.id === cardId)
    if (card) {
      card.usedLimit = Math.max(0, card.usedLimit + amount)
      await saveData()
    }
  }

  function calculateInstallments(
    totalAmount: number,
    months: number,
    interestRate: number
  ): InstallmentPlan {
    if (months <= 1) {
      return {
        months: 1,
        monthlyPayment: totalAmount,
        totalAmount: totalAmount,
        interestAmount: 0,
        hasInterest: false
      }
    }

    const monthlyRate = interestRate / 100 // Converter para decimal
    const hasInterest = monthlyRate > 0

    if (!hasInterest) {
      // Sem juros - divisão simples
      const monthlyPayment = totalAmount / months
      return {
        months,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        interestAmount: 0,
        hasInterest: false
      }
    }

    // Com juros - usar fórmula de amortização
    const monthlyPayment = totalAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)

    const totalWithInterest = monthlyPayment * months
    const interestAmount = totalWithInterest - totalAmount

    return {
      months,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalAmount: Math.round(totalWithInterest * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      hasInterest: true
    }
  }

  function getCardById(id: string): CreditCard | undefined {
    return creditCards.value.find(card => card.id === id)
  }

  async function saveData() {
    const userStore = useUserStore()
    if (userStore.userId) {
      await firestoreService.saveCreditCards(userStore.userId, creditCards.value)
    }
  }

  async function loadFromFirestore() {
    const userStore = useUserStore()
    if (userStore.userId) {
      const cards = await firestoreService.getCreditCards(userStore.userId)
      if (cards) {
        creditCards.value = cards.map((c: any) => ({
          id: c.id,
          name: c.name ?? '',
          closingDate: c.closingDate ?? 5,
          paymentDate: c.paymentDate ?? 10,
          limit: c.limit ?? 0,
          usedLimit: c.usedLimit ?? 0,
          color: c.color ?? '#7C3AED',
          isActive: c.isActive ?? true
        }))
      }
    }
  }

  return {
    creditCards,
    activeCards,
    availableLimit,
    totalLimit,
    totalUsedLimit,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    updateUsedLimit,
    calculateInstallments,
    getCardById,
    saveData,
    loadFromFirestore
  }
})