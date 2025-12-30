<template>
  <div class="card">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
      {{ editingCard ? 'Editar Cartão' : 'Novo Cartão' }}
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Nome do Cartão
        </label>
        <input
          v-model="form.name"
          type="text"
          class="input-field"
          placeholder="Ex: Nubank Violeta"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Fechamento
          </label>
          <div class="relative">
            <select 
              v-model="form.closingDate" 
              class="input-field appearance-none"
              required
            >
              <option value="" disabled>Dia</option>
              <option v-for="day in 28" :key="day" :value="day">
                Dia {{ day }}
              </option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Vencimento
          </label>
          <div class="relative">
            <select 
              v-model="form.paymentDate" 
              class="input-field appearance-none"
              required
            >
              <option value="" disabled>Dia</option>
              <option v-for="day in 28" :key="day" :value="day">
                Dia {{ day }}
              </option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Limite Total (R$)
        </label>
        <input
          v-model="form.limit"
          type="number"
          step="0.01"
          min="0"
          class="input-field"
          placeholder="0,00"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Cor do Cartão
        </label>
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="color in cardColors"
            :key="color"
            type="button"
            :class="[
              'w-10 h-10 rounded-full transition-all duration-300 transform',
              getGradient(color),
              form.color === color ? 'ring-2 ring-offset-2 ring-purple-500 scale-110 shadow-lg' : 'opacity-70 hover:opacity-100 hover:scale-105'
            ]"
            @click="form.color = color"
          />
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <button
          type="button"
          @click="cancelEdit"
          class="btn-secondary flex-1"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="btn-primary flex-1"
        >
          {{ editingCard ? 'Salvar Alterações' : 'Criar Cartão' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCreditCardStore } from '@/stores/creditCard'
import type { CreditCard } from '@/stores/creditCard'

const creditCardStore = useCreditCardStore()

const props = defineProps<{
  editingCard?: CreditCard | null
}>()

const emit = defineEmits<{
  cardAdded: []
  editCancelled: []
}>()

const cardColors = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-gray-500'
]

const form = ref({
  name: '',
  closingDate: 5,
  paymentDate: 10,
  limit: '',
  color: 'bg-purple-500'
})

watch(() => props.editingCard, (card) => {
  if (card) {
    form.value = {
      name: card.name,
      closingDate: (card as any).closingDate ?? 5,
      paymentDate: card.paymentDate,
      limit: card.limit.toString(),
      color: card.color
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function getGradient(colorClass: string): string {
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
  return map[colorClass] || 'bg-gray-500'
}

function resetForm() {
  form.value = {
    name: '',
    closingDate: 5,
    paymentDate: 10,
    limit: '',
    color: 'bg-purple-500'
  }
}

function handleSubmit() {
  const limit = parseFloat(form.value.limit)

  if (isNaN(limit) || limit <= 0) {
    alert('Por favor, insira um limite válido')
    return
  }

  if (!form.value.paymentDate || form.value.paymentDate < 1 || form.value.paymentDate > 28) {
    alert('Selecione uma data de pagamento válida (1–28)')
    return
  }

  if (!form.value.closingDate || form.value.closingDate < 1 || form.value.closingDate > 28) {
    alert('Selecione uma data de fechamento válida (1–28)')
    return
  }

  const cardData = {
    name: form.value.name,
    closingDate: form.value.closingDate,
    paymentDate: form.value.paymentDate,
    limit: limit,
    color: form.value.color,
    isActive: true
  }

  if (props.editingCard) {
    creditCardStore.updateCreditCard(props.editingCard.id, cardData)
  } else {
    creditCardStore.addCreditCard(cardData)
  }

  resetForm()
  emit('cardAdded')
}

function cancelEdit() {
  resetForm()
  emit('editCancelled')
}
</script>