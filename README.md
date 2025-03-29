# Sistema de Gerenciamento de Estoque

Um sistema completo para gerenciamento de estoque com interface web e API RESTful, desenvolvido com Node.js, Express, MongoDB Atlas e interface amigável em HTML/CSS/JavaScript.

## Funcionalidades

- Cadastro, edição e exclusão de produtos (CRUD completo)
- Interface intuitiva e responsiva
- Busca de produtos por nome, categoria ou fornecedor
- Notificações de sucesso e erro
- Validação de formulários
- Confirmação para exclusão

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, Mongoose
- **Banco de Dados**: MongoDB Atlas (NoSQL)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Ícones**: Font Awesome

## Pré-requisitos

- Node.js (versão 14 ou superior)
- Conta no MongoDB Atlas (ou MongoDB local)

## Configuração

1. Clone o repositório:
   ```
   git clone [URL_DO_REPOSITÓRIO]
   cd estoque-api
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` com suas credenciais do MongoDB Atlas:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.mongodb.net/estoque?retryWrites=true&w=majority
   ```

4. Inicie o servidor:
   ```
   npm start
   ```

5. Acesse a aplicação:
   ```
   http://localhost:3000
   ```

## Estrutura do Projeto

```
/
├── models/           # Modelos do banco de dados
│   └── Produto.js    # Modelo de produto
├── routes/           # Rotas da API
│   └── produtos.js   # Rotas para CRUD de produtos
├── public/           # Arquivos estáticos
│   ├── css/          # Estilos CSS
│   ├── js/           # Scripts JavaScript
│   └── index.html    # Página principal
├── .env              # Variáveis de ambiente
├── server.js         # Arquivo principal do servidor
└── package.json      # Dependências e scripts
```

## Acessando Remotamente

Para tornar a aplicação acessível remotamente, você pode:

1. **Hospedar em um servidor:**
   - Heroku, Vercel, Netlify, AWS, etc.

2. **Expor seu localhost usando ngrok:**
   ```
   npm install -g ngrok
   ngrok http 3000
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença ISC. 