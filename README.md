# ERP Primavera Clone - Updated Demo

Esta versão contém um sistema ERP completo com autenticação, gestão de produtos, clientes, fornecedores, funcionários, projetos, finanças, faturas, relatórios e armazéns. O frontend é responsivo e se adapta a diferentes tamanhos de tela.

## Funcionalidades

- **Autenticação**: Login seguro com JWT
- **Gestão de Produtos**: Adicionar, listar produtos
- **Gestão de Clientes**: Adicionar, listar clientes
- **Gestão de Fornecedores**: Adicionar, listar fornecedores
- **Gestão de Funcionários**: Adicionar, listar funcionários
- **Gestão de Projetos**: Adicionar, listar projetos
- **Finanças**: Transações, contas, balanço
- **Faturas**: Gestão de faturas
- **Relatórios**: Resumos e gráficos
- **Armazéns**: Gestão de armazéns
- **Interface Responsiva**: Adapta-se a dispositivos móveis e desktop

## Como usar (modo rápido)

1. Instala dependências:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
2. Define variáveis de ambiente (exemplo `.env` com `JWT_SECRET=your_secret`)
3. Executa backend em modo dev: `cd backend && npm run dev`
4. Executa frontend: `cd frontend && npm run dev`

Demo: user `admin` / password `password`.

## Tecnologias

- **Backend**: Node.js, Express, TypeScript, JWT, bcryptjs
- **Frontend**: React, Vite, Material-UI, Axios
- **Banco de dados**: In-memory (para demo)
