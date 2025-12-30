<template>
  <div class="flex flex-col h-full">
    <!-- Header com Total -->
    <div class="mb-6 text-center">
      <h2 class="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Limite Total Disponível</h2>
      <div class="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        R$ {{ formatCurrency(creditCardStore.availableLimit) }}
      </div>
    </div>

    <!-- Carrossel de Cartões -->
    <div class="relative w-full mb-8">
      <div 
        class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-4 pb-4"
        ref="carouselRef"
      >
        <!-- Card de Adicionar Novo -->
        <div 
          class="snap-center shrink-0 w-[300px] h-[190px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
          @click="showAddForm = true"
        >
          <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors mb-3">
            <Plus class="w-6 h-6 text-gray-400 group-hover:text-purple-400" />
          </div>
          <span class="text-gray-500 dark:text-gray-400 font-medium group-hover:text-purple-500 dark:group-hover:text-purple-400">Adicionar Cartão</span>
        </div>

        <!-- Cartões Existentes -->
        <div 
          v-for="card in creditCardStore.activeCards" 
          :key="card.id"
          class="snap-center shrink-0 w-[300px] h-[190px] rounded-2xl p-6 relative overflow-hidden transition-transform duration-300 transform hover:scale-[1.02] cursor-pointer shadow-xl"
          :class="[
            getGradient(card.color),
            selectedCardId === card.id ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-[#0F172A]' : 'opacity-90 scale-95'
          ]"
          @click="selectCard(card.id)"
        >
          <!-- Background Pattern -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-20 blur-2xl"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-20 -translate-x-10 blur-xl"></div>

          <div class="relative z-10 flex flex-col h-full justify-between text-white">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs font-medium opacity-80 mb-1">Nome do Cartão</p>
                <h3 class="font-bold text-lg tracking-wide">{{ card.name }}</h3>
              </div>
              <!-- Ícone da Bandeira (Simulado) -->
              <div class="flex flex-col items-end">
                 <span class="text-[10px] font-bold italic opacity-70">VISA</span>
                 <span class="text-[10px] opacity-60">Debit Card</span>
              </div>
            </div>

            <div class="flex flex-col gap-1 my-3">
               <div class="flex justify-between items-center">
                 <div class="w-10 h-7 rounded bg-yellow-200/80 flex items-center justify-center overflow-hidden relative">
                    <div class="absolute w-full h-[1px] bg-black/20 top-2"></div>
                    <div class="absolute w-full h-[1px] bg-black/20 bottom-2"></div>
                    <div class="absolute h-full w-[1px] bg-black/20 left-3"></div>
                    <div class="absolute h-full w-[1px] bg-black/20 right-3"></div>
                 </div>
               </div>
               
               <div class="mt-2">
                 <p class="text-[10px] uppercase tracking-wider opacity-80">Limite Disponível</p>
                 <p class="text-xl font-bold tracking-tight">R$ {{ formatCurrency(card.limit - card.usedLimit) }}</p>
               </div>
            </div>

            <div class="flex justify-between items-end">
              <div>
                <p class="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Fechamento</p>
                <p class="font-medium text-sm">Dia {{ card.closingDate }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Vencimento</p>
                <p class="font-medium text-sm">Dia {{ card.paymentDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detalhes do Cartão Selecionado -->
    <div v-if="selectedCard" class="bg-white dark:bg-[#1E293B] rounded-t-3xl flex-1 -mx-4 px-6 py-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] animate-slide-up transition-colors duration-300">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Transações</h3>
        <div class="flex gap-2">
           <button @click="editCard(selectedCard!)" class="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white bg-gray-100 dark:bg-gray-800/50 rounded-lg transition-colors">
              <Pencil class="w-4 h-4" />
           </button>
           <button @click="deleteCard(selectedCard!.id)" class="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-800/50 rounded-lg transition-colors">
              <Trash2 class="w-4 h-4" />
           </button>
        </div>
      </div>

      <!-- Resumo do Limite -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-800 transition-colors">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-500 dark:text-gray-400">Limite Utilizado</span>
          <span class="text-gray-900 dark:text-white font-medium">R$ {{ formatCurrency(selectedCard.usedLimit) }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :class="getProgressBarColor(selectedCard.usedLimit, selectedCard.limit)"
            :style="{ width: `${Math.min((selectedCard.usedLimit / selectedCard.limit) * 100, 100)}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500">
          <span>Disponível: R$ {{ formatCurrency(selectedCard.limit - selectedCard.usedLimit) }}</span>
          <span>Total: R$ {{ formatCurrency(selectedCard.limit) }}</span>
        </div>
      </div>

      <!-- Lista de Transações -->
      <div class="space-y-4">
        <div v-if="cardTransactions.length === 0" class="text-center py-8 text-gray-500">
          <p>Nenhuma transação neste cartão</p>
        </div>
        
        <div 
          v-for="transaction in cardTransactions" 
          :key="transaction.id"
          class="flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <!-- Linha do tempo visual -->
            <div class="relative flex flex-col items-center h-full mr-2">
               <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-purple-500 transition-colors"></div>
               <div class="w-0.5 h-10 bg-gray-200 dark:bg-gray-800 -mb-6 mt-1 group-last:hidden"></div>
            </div>
            
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ transaction.description || transaction.category }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(transaction.date) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium text-gray-900 dark:text-white">R$ {{ formatCurrency(transaction.amount) }}</p>
            <p class="text-xs text-gray-500" v-if="transaction.installments">
               {{ transaction.installmentIndex }}/{{ transaction.installmentCount }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
       <p>Selecione um cartão para ver detalhes</p>
    </div>

    <!-- Modal de Adicionar/Editar Cartão -->
    <div 
      v-if="showAddForm || editingCard"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
      @click.self="closeForm"
    >
      <div class="bg-white dark:bg-[#1E293B] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl">
        <CreditCardForm 
          :editing-card="editingCard"
          @card-added="handleCardAdded"
          @edit-cancelled="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useCreditCardStore } from '@/stores/creditCard'
import { useExpenseStore } from '@/stores/expense'
import type { CreditCard } from '@/stores/creditCard'
import CreditCardForm from '@/components/CreditCardForm.vue'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'

const creditCardStore = useCreditCardStore()
const expenseStore = useExpenseStore()

const showAddForm = ref(false)
const editingCard = ref<CreditCard | null>(null)
const selectedCardId = ref<string | null>(null)
const carouselRef = ref<HTMLElement | null>(null)

// Selecionar o primeiro cartão ao carregar
onMounted(() => {
  const firstCard = creditCardStore.activeCards[0]
  if (firstCard) {
    selectedCardId.value = firstCard.id
  }
})

const selectedCard = computed(() => 
  creditCardStore.activeCards.find(c => c.id === selectedCardId.value)
)

const cardTransactions = computed(() => {
  if (!selectedCardId.value) return []
  return expenseStore.expenses
    .filter(e => e.creditCardId === selectedCardId.value)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10) // Mostrar apenas as 10 últimas
})

function selectCard(id: string) {
  selectedCardId.value = id
}

function getGradient(colorClass: string): string {
  // Mapear cores simples para gradientes premium
  const map: Record<string, string> = {
    'bg-purple-500': 'bg-gradient-to-br from-purple-600 to-indigo-600',
    'bg-blue-500': 'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-green-500': 'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-red-500': 'bg-gradient-to-br from-rose-500 to-red-600',
    'bg-yellow-500': 'bg-gradient-to-br from-amber-400 to-orange-500',
    'bg-pink-500': 'bg-gradient-to-br from-pink-500 to-rose-500',
    'bg-indigo-500': 'bg-gradient-to-br from-indigo-600 to-blue-700',
    'bg-gray-500': 'bg-gradient-to-br from-gray-600 to-gray-800',
  }
  return map[colorClass] || 'bg-gradient-to-br from-gray-700 to-gray-900'
}

function getProgressBarColor(used: number, limit: number): string {
  const percentage = used / limit
  if (percentage > 0.9) return 'bg-red-500'
  if (percentage > 0.7) return 'bg-yellow-500'
  return 'bg-emerald-500'
}

function formatCurrency(amount: number): string {
  return amount.toFixed(2).replace('.', ',')
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function deleteCard(id: string) {
  const hasLinkedExpenses = expenseStore.expenses.some(e => e.creditCardId === id)
  if (hasLinkedExpenses) {
    alert('Este cartão está vinculado a despesas. Exclua ou edite essas despesas antes de remover o cartão.')
    return
  }
  if (confirm('Tem certeza que deseja excluir este cartão?')) {
    creditCardStore.deleteCreditCard(id)
    if (selectedCardId.value === id) {
      const firstCard = creditCardStore.activeCards[0]
      selectedCardId.value = firstCard?.id || null
    }
  }
}

function editCard(card: CreditCard) {
  editingCard.value = card
}

function handleCardAdded() {
  showAddForm.value = false
  editingCard.value = null
  // Selecionar o novo cartão (último da lista)
  const lastCard = creditCardStore.activeCards[creditCardStore.activeCards.length - 1]
  if (lastCard) {
    selectedCardId.value = lastCard.id
  }
}

function closeForm() {
  showAddForm.value = false
  editingCard.value = null
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>