## Visão Geral
- Remover qualquer entrada/atalho na Home que leve a adicionar contas/cartões.
- Centralizar o fluxo de cartões em uma aba exclusiva “Adicionar Cartão”.
- Simplificar o formulário de cartões mantendo apenas: nome, limite, data de fechamento, data de pagamento, cor.
- Ter uma aba “Adicionar Conta” contendo o botão “+” para criação de contas (hoje não existe módulo de contas).
- Garantir validações básicas nos campos obrigatórios e uma UI limpa.

## Estado Atual (referências)
- Navegação por abas em `src/App.vue` (estado `currentTab`: 'home' | 'transactions' | 'cards' | 'settings').
- Botão “+” da Home abre o formulário de despesa (não cria contas/cartões): `src/App.vue:78-84`, modal com `<ExpenseForm>` em `src/App.vue:110-131`.
- Cartões: lista/gestão em `src/components/CreditCardManager.vue` com botão “➕ Adicionar Cartão” (`7-12`) que abre `<CreditCardForm>` via modal (`111-123`).
- Formulário atual de cartão tem campos extras: `src/components/CreditCardForm.vue` (nome, tipo, titular, últimos 4 dígitos, pagamento, limite, juros, cor) e validações em `handleSubmit()` (`227-266`).
- Store de cartões: `src/stores/creditCard.ts` (`addCreditCard`, `updateCreditCard`, persistência em localStorage).
- Não há módulo/telas de “Conta bancária”.

## Alterações de UI e Navegação
1. Adicionar nova aba `add-card` (rótulo “Adicionar Cartão”) em `src/App.vue`.
   - Conteúdo: exibir o formulário de cartão diretamente (sem modal).
   - Remover o botão “➕ Adicionar Cartão” e o modal de `src/components/CreditCardManager.vue`.
   - Manter a lista/gestão de cartões na aba `cards` apenas para visualizar/editar/excluir.
2. Adicionar nova aba `add-account` (rótulo “Adicionar Conta”) em `src/App.vue`.
   - Exibir apenas um botão “+” destacado e o formulário de conta (ver seção Implementação de Conta).
3. Home
   - Validar que não há mais nenhuma ação/atalho que crie cartões/contas a partir da Home (o “+” existente continua para despesas, pois não envolve contas/cartões).

## Simplificação do Formulário de Cartões
- Em `src/components/CreditCardForm.vue`:
  - Remover campos: tipo, titular, últimos 4 dígitos, juros de parcelamento.
  - Manter: `name`, `limit`, `closingDate` (data de fechamento da fatura), `paymentDate` (data de pagamento), `color`.
  - Adicionar input para “Data de fechamento da fatura” (preferência: dia do mês 1–28 para evitar meses curtos).
  - Atualizar `handleSubmit()` para validar somente os campos mantidos.
  - Atualizar emissão de eventos e payload para o store com o novo shape.
- Em `src/components/CreditCardManager.vue`:
  - Ajustar quaisquer exibições que dependam de campos removidos (ex.: últimos 4 dígitos).

## Atualização do Store de Cartões
- Em `src/stores/creditCard.ts`:
  - Atualizar tipos/interfaces (se houver) e o shape aceito por `addCreditCard`/`updateCreditCard` para refletir: `{ id, name, limit, closingDate, paymentDate, color, usedLimit }`.
  - Remover usos/armazenamento dos campos descartados.
  - Manter `usedLimit` e persistência local (sem alterações na lógica de despesas).

## Implementação de “Adicionar Conta”
- Criar um módulo mínimo de contas para atender a aba:
  - Componente `AccountForm.vue`: campos essenciais (ex.: nome da conta e cor; opcionalmente saldo inicial).
  - Store `src/stores/account.ts`: `addAccount`, `updateAccount`, `deleteAccount`, `load/save` em localStorage.
  - Exibir o botão “+” para abrir o formulário na aba `add-account`; manter operações de conta apenas nessa aba.
- Obs.: como o app não possui contas hoje, o mínimo viável será apenas criação com persistência local.

## Validações
- Cartões:
  - `name`: obrigatório, string não vazia.
  - `limit`: obrigatório, numérico, > 0.
  - `closingDate`: obrigatório, inteiro (1–28).
  - `paymentDate`: obrigatório, inteiro (1–28) e, opcionalmente, coerência com `closingDate` (pagamento após fechamento).
  - `color`: obrigatório.
- Contas (mínimo viável):
  - `name`: obrigatório.
  - `color`: obrigatório.
  - `initialBalance` (se incluído): numérico (pode ser 0), não negativo.

## Limpeza da Interface
- Remover todos os campos e textos relacionados aos itens excluídos do formulário de cartão.
- Simplificar rótulos e ajuda contextual para os novos dois campos de data (fechamento e pagamento).
- Garantir consistência visual com os componentes existentes (inputs, botões, cores). 

## Compatibilidade e Impactos
- `ExpenseForm.vue` permanece inalterado; apenas seleciona cartão por `id`.
- Card list/visualizações: revisar dependências de `lastFourDigits`/`type` e adaptar para exibir somente `name`, `color`, `limit` e `usedLimit`.
- Persistência: migração simples — ao carregar, se encontrar cartões antigos, ignorar campos extras sem quebrar uso.

## Testes e Verificação
- Navegação: trocar entre abas e garantir que “Adicionar Cartão” executa criação com novo shape.
- Validação: testar envio com campos vazios/valores inválidos e ver mensagens de erro.
- Store: verificar persistência no localStorage e atualização de `usedLimit` ao adicionar despesa com cartão.
- UI: confirmar que não há mais formas de adicionar cartão fora da aba “Adicionar Cartão” e que a Home não oferece ações para contas/cartões.

## Arquivos Impactados
- `src/App.vue` (abas novas, remoção de triggers de adicionar cartão)
- `src/components/CreditCardManager.vue` (remover botão e modal de adicionar)
- `src/components/CreditCardForm.vue` (simplificação de campos e validações)
- `src/stores/creditCard.ts` (novo shape)
- Novo: `src/components/AccountForm.vue`, `src/stores/account.ts` (mínimo viável)

Confirma seguir com esta implementação?