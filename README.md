# FlowFi - Rastreador de Despesas 💰

Um aplicativo web moderno e responsivo para gerenciamento de despesas pessoais, desenvolvido com Vue.js 3, TypeScript e Tailwind CSS.

## 🚀 Tecnologias Utilizadas

- **Vue.js 3** com Composition API
- **TypeScript** para type safety
- **Tailwind CSS v3.4.17** para estilização
- **Pinia** para gerenciamento de estado
- **Vite** como build tool
- **Vitest** para testes unitários

## 📱 Funcionalidades

### ✨ Principais Recursos

- **Cadastro de Despesas e Receitas**
  - Valor em formato monetário brasileiro (BRL)
  - Categorias pré-definidas com ícones e cores
  - Data e descrição opcional
  - Validação de formulário

- **Visualização de Histórico**
  - Lista completa de transações
  - Filtros por tipo (despesa/receita), categoria e período
  - Ordenação por data
  - Edição e exclusão de transações

- **Resumo Financeiro**
  - Saldo atual
  - Total de receitas e despesas
  - Despesas por categoria com progresso visual
  - Indicadores de orçamento ultrapassado

- **Interface Responsiva**
  - Design mobile-first
  - Navegação inferior para dispositivos móveis
  - Modal para adicionar despesas no mobile
  - Layout adaptativo para desktop

- **Persistência de Dados**
  - Armazenamento local com localStorage
  - Dados mantidos entre sessões
  - Carregamento automático ao iniciar

## 🎨 Design e Interface

O design foi inspirado nas imagens fornecidas, com:
- Cores principais em roxo e tons de cinza
- Cards arredondados com sombras suaves
- Ícones representativos para cada categoria
- Feedback visual para ações do usuário
- Contraste adequado para acessibilidade

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn

### Passos para Execução

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd flowfi
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra o navegador**
   Acesse `http://localhost:5173`

### Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run test:unit` - Executa testes unitários
- `npm run preview` - Visualiza build de produção
- `npm run type-check` - Verifica tipos TypeScript

## 📊 Categorias de Despesas

O aplicativo vem com categorias pré-configuradas:

| Categoria | Ícone | Cor | Orçamento Padrão |
|-----------|-------|-----|-------------------|
| Moradia | 🏠 | Roxo | R$ 1.400,00 |
| Contas | 📄 | Rosa | R$ 190,00 |
| Alimentação | 🛒 | Verde | R$ 400,00 |
| Transporte | 🚗 | Azul | R$ 200,00 |
| Lazer | 🎮 | Laranja | R$ 150,00 |
| Saúde | 🏥 | Vermelho | R$ 100,00 |
| Viagem | ✈️ | Ciano | R$ 300,00 |
| Salário | 💰 | Verde escuro | - |
| Outros | 📦 | Cinza | - |

## 🧪 Testes

O projeto inclui testes unitários para:
- Store de despesas (Pinia)
- Componente de formulário
- Validações de dados
- Cálculos financeiros

Execute os testes com:
```bash
npm run test:unit
```

## 📱 Responsividade

O aplicativo é totalmente responsivo com:
- Layout adaptativo para telas de 320px a 1920px
- Navegação otimizada para mobile
- Touch-friendly para dispositivos táteis
- Cards empilhados em telas pequenas
- Sidebar em telas maiores

## 🔒 Segurança e Privacidade

- Todos os dados são armazenados localmente
- Sem envio de informações para servidores externos
- Validações de entrada para prevenir injeção de código
- Criptografia não implementada (dados visíveis no localStorage)

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🐛 Bugs Conhecidos

- Nenhum bug conhecido no momento

## 🚀 Roadmap

- [ ] Gráficos de tendências mensais
- [ ] Exportação de dados em CSV/PDF
- [ ] Sincronização com backend
- [ ] Notificações de limite de orçamento
- [ ] Temas claro/escuro
- [ ] Suporte a múltiplas moedas
- [ ] Períodos personalizados de análise

## 📞 Suporte

Para suporte, envie um email para [seu-email] ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ por [Seu Nome]**

*FlowFi - Controle suas finanças de forma simples e eficiente!*
