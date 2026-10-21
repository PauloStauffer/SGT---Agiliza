# SGT---Agiliza
Sistema de Gestão de Tempo: Projeto da Faculdade, utilizado para aplicação dos conhecimentos de programação orientada a objeto, para desenvolvimento estudantil e profissional.

## Autenticação

O backend Express fornece `POST /api/auth/register` e `POST /api/auth/login`. Os dois fluxos consultam a tabela `dbo.usuario`; cadastro valida os dados no servidor, impede e-mails já cadastrados e grava a senha com hash scrypt. O login devolve apenas `id`, `name` e `email`, nunca o hash.

Configure as variáveis `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_NAME` e `DB_PORT` em um arquivo `.env` na raiz. Não versione esse arquivo. A tabela `dbo.usuario` deve ter as colunas `id_usuario`, `nome`, `email` e `senha`; `nome` e `email` devem aceitar até 255 caracteres e `senha` pelo menos 255 caracteres. A API expõe `id_usuario` como `id` na resposta. Recomenda-se também uma restrição única para `email`.

Inicie o backend na raiz com `npm start` (porta `3000`) e o frontend em `Frontend` com `bun run dev` ou `npm run dev`. O servidor de desenvolvimento do frontend encaminha `/api` para `http://localhost:3000`. Em outro ambiente, configure `VITE_API_URL` no frontend com a URL base da API, sem `/api` no final.
