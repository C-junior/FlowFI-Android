import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ExpenseForm from '@/components/ExpenseForm.vue'

describe('ExpenseForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve renderizar o formulário corretamente', () => {
    const wrapper = mount(ExpenseForm)
    
    expect(wrapper.text()).toContain('Nova Despesa')
    expect(wrapper.find('select[required]')).toBeTruthy()
    expect(wrapper.find('input[type="number"][required]')).toBeTruthy()
    expect(wrapper.find('select[required]')).toBeTruthy()
    expect(wrapper.find('input[type="date"][required]')).toBeTruthy()
    expect(wrapper.find('button[type="submit"]')).toBeTruthy()
  })

  it('deve mostrar título de edição quando estiver editando', () => {
    const wrapper = mount(ExpenseForm, {
      props: {
        editingExpense: {
          id: '1',
          type: 'expense' as const,
          amount: 100,
          category: 'Alimentação',
          date: '2024-01-01',
          description: 'Teste',
          paymentMethod: 'cash' as const
        }
      }
    })
    
    expect(wrapper.text()).toContain('Editar Despesa')
    expect(wrapper.find('button').text()).toContain('Atualizar')
  })

  it('deve emitir evento quando despesa for adicionada', async () => {
    const wrapper = mount(ExpenseForm)
    
    // Preencher o formulário
    await wrapper.find('select').setValue('expense')
    await wrapper.find('input[type="number"]').setValue('100')
    const selects = wrapper.findAll('select')
    if (selects.length > 1 && selects[1]) {
      await selects[1].setValue('Alimentação')
    }
    await wrapper.find('input[type="date"]').setValue('2024-01-01')
    
    // Submeter o formulário
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.emitted('expenseAdded')).toBeTruthy()
  })

  it('deve validar campos obrigatórios', async () => {
    const wrapper = mount(ExpenseForm)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    // Tentar submeter formulário vazio
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(alertSpy).toHaveBeenCalledWith('Por favor, insira um valor válido')
    
    alertSpy.mockRestore()
  })

  it('deve validar valor numérico', async () => {
    const wrapper = mount(ExpenseForm)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    // Preencher com valor inválido
    await wrapper.find('input[type="number"]').setValue('-100')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(alertSpy).toHaveBeenCalledWith('Por favor, insira um valor válido')
    
    alertSpy.mockRestore()
  })

  it('deve limpar formulário após adicionar despesa', async () => {
    const wrapper = mount(ExpenseForm)
    
    // Preencher o formulário
    await wrapper.find('select').setValue('expense')
    await wrapper.find('input[type="number"]').setValue('100')
    const selects = wrapper.findAll('select')
    if (selects.length > 1 && selects[1]) {
      await selects[1].setValue('Alimentação')
    }
    await wrapper.find('input[type="date"]').setValue('2024-01-01')
    
    // Submeter o formulário
    await wrapper.find('form').trigger('submit.prevent')
    
    // Verificar se o formulário foi limpo
    // Verificar se o formulário foi limpo
    const formValue = (wrapper.vm as any).form
    expect(formValue.amount).toBe('')
    expect(formValue.category).toBe('')
  })

  it('deve mostrar botão de cancelar quando estiver editando', () => {
    const wrapper = mount(ExpenseForm, {
      props: {
        editingExpense: {
          id: '1',
          type: 'expense' as const,
          amount: 100,
          category: 'Alimentação',
          date: '2024-01-01',
          paymentMethod: 'cash' as const
        }
      }
    })
    
    expect(wrapper.text()).toContain('Cancelar')
    expect(wrapper.find('button[type="button"]').exists()).toBe(true)
  })

  it('deve emitir evento de cancelar edição', async () => {
    const wrapper = mount(ExpenseForm, {
      props: {
        editingExpense: {
          id: '1',
          type: 'expense' as const,
          amount: 100,
          category: 'Alimentação',
          date: '2024-01-01',
          paymentMethod: 'cash' as const
        }
      }
    })
    
    await wrapper.find('button[type="button"]').trigger('click')
    
    expect(wrapper.emitted('editCancelled')).toBeTruthy()
  })
})