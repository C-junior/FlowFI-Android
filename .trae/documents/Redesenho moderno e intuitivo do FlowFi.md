## Visão Geral

* Redesenhar o FlowFi com estética moderna, limpa e consistente, reforçando hierarquia visual, tipografia e microinterações sutis.

* Centralizar o fluxo principal em menos de 3 passos, otimizar mobile (uso com uma mão) e garantir acessibilidade WCAG AA.

* Evoluir relatórios e metas com visualizações interativas, alertas configuráveis e sincronização em tempo real.

## Design System

* Paleta e temas: definir tokens (primário, sucesso, perigo, neutro) e suportar `light/dark` com `prefers-color-scheme` e toggle manual; cores com contraste AA.

* Tipografia: escalar `font-size/line-height` por viewport e opções de acessibilidade para aumentar fonte.

* Ícones: padronizar com Lucide Vue e substituir emojis; tamanhos entre `16–24px`, cor herdada e transições `transition-opacity/transform`.

* Componentes-base: botão, input, select, card, barra de progresso, chip, tooltip; padronizar espaçamento (8px grid), estados (hover/focus/disabled) e sombras sutis.

## Fluxo Principal (Registro em 3 passos)

1. Informações básicas: tipo (despesa/receita), valor, data.
2. Classificação: categoria, forma de pagamento (com seleção de cartão se necessário).
3. Detalhes opcionais: descrição, parcelamento (se cartão), confirmação.

* Navegação por gestos: `swipe` lateral para alternar passos/abas; indicador de progresso e botões com alcance do polegar.

* Atalhos: botão flutuante “+”, atalhos no header para “Nova despesa”, “Relatórios” e “Metas”.

* Visualizações resumidas: cards de saldo, receitas/despesas do mês, barras por categoria e progresso de metas.

## Funcionalidades Essenciais

* Categorização inteligente: regras (palavras‑chave, estabelecimentos, valores) com aprendizados do histórico; permitir correção manual com sugestão.

* Alertas personalizáveis: limites por categoria/metas, vencimento de parcelas, saldo crítico; entrega via notificação (PWA) e banners in‑app.

* Relatórios interativos: gráficos de pizza/barras/linha com filtros por período, categoria e forma de pagamento; interações (hover, drilldown, zoom).

* Metas financeiras: criar metas por categoria/valor/tempo; acompanhamento com barra de progresso, previsão e alertas.

## Experiência Mobile

* Layout de uma mão: bottom nav, botão flutuante alinhado ao polegar, grandes alvos de toque.

* Dark mode automático: detectar `prefers-color-scheme` e permitir override; manter contrastes AA.

## Acessibilidade

* Contraste mínimo AA; validar com ferramentas (ex.: axe).

* Leitores de tela: `aria-label`, `role`, `aria-live` para alertas; foco gerenciado em modais e formulários.

* Tamanho de fonte: controle por usuário com persistência (localStorage) e escalonamento do layout.

* Gráficos acessíveis: descrições alternativas, tabela de dados exportável, foco navegável, tooltip legível.

## Performance

* Bateria/memória: lazy loading de rotas/relatórios, memoização de cálculos, virtualização de listas, debouncing em gestos.

* Carregamento progressivo: skeletons nos cards/listas e nos relatórios; cache local (IndexedDB) para dados.

* Dispositivos antigos: evitar sombras pesadas/blur, limitar animações de alta frequência, usar `will-change` com parcimônia.

## Integrações

* Sincronização em tempo real: canal WebSocket ou serviço de background; reconciliar conflitos local‑first.

* Widgets (visão rápida): atalhos no manifest (PWA), seção “Resumo rápido” para home com cartões compactos; futura integração com Web Push para alertas.

## Implementação Técnica

* UI: consolidar tailwind classes em utilitários; criar `ThemeProvider` e `useTheme()` para alternância de modo.

* Ícones: componente `AppIcon` para padronizar tamanho/cor/animação; substituir emojis em: `App.vue`, `ExpenseSummary.vue`, `ExpenseList.vue`, `CreditCardManager.vue`, formulários e modais.

* Fluxo 3 passos: refatorar `ExpenseForm` em steps com `Transition` e acessibilidade de teclado; compor estado com Pinia.

* Gestos: `useSwipe()` composable (pointer/touch events) para abas e steps; prevenção de scroll horizontal indesejado.

* Alertas/metas: stores dedicadas (`alertsStore`, `goalsStore`) com regras, thresholds e persistência; serviços para notificações.

* Relatórios: componente `ReportsView` com gráficos e filtros; gerar descrições acessíveis e exportar CSV.

* Parcelamento: manter agenda mensal e indicadores de pendências; mostrar “parcelas pendentes/processadas” no resumo.

* Acessibilidade: linting a11y, testes unitários de foco e aria; opcional integração de `@vue-a11y/eslint-plugin`.



## Entregas por Fase

* Fase 1: Design system, ícones e limpeza visual; fluxo em 3 passos.

* Fase 2:  relatórios interativos.

* Fase 3: Alertas/metas e acessibilidade avançada.

* Fase 4: Performance e sincronização em tempo real

Confirma seguir com este plano para iniciar a implementação por fases?
