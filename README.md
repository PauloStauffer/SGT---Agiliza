# Agiliza

Sistema de Gestão de Tempo desenvolvido para organizar tarefas, compromissos e áreas da vida.

## Backend e banco de dados

O backend usa Java 8, Spring Boot, JDBC e SQL Server. Para criar ou atualizar o esquema, execute [`CREATE DATABASE.txt`](./CREATE%20DATABASE.txt) no SQL Server. O script cria o banco `agiliza` se necessário e adiciona as tabelas/colunas usadas pela API; faça backup antes de aplicá-lo em um banco com dados importantes.

Crie um arquivo `.env` na raiz com as credenciais do SQL Server:

```env
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SERVER=localhost
DB_NAME=agiliza
DB_PORT=1433
PORT=3000
```

O Spring Boot não carrega `.env` automaticamente. Ao iniciar pelo PowerShell, importe as variáveis:

```powershell
Get-Content ..\.env | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)\s*=\s*(.*)\s*$') {
    [Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), 'Process')
  }
}
mvn spring-boot:run
```

Para a instância padrão `MSSQLSERVER`, use `DB_SERVER=localhost` e `DB_PORT=1433`. Se o teste em `localhost:1433` falhar, habilite `TCP/IP` no SQL Server Configuration Manager e reinicie o serviço do SQL Server.

Não versione o `.env`. A API usa sessões bearer com tokens aleatórios; somente o hash do token fica armazenado no banco e a sessão expira após 30 dias.

Inicie a API a partir da pasta `Backend` (é necessário ter Maven instalado):

```sh
cd Backend
mvn spring-boot:run
```

Para iniciar backend e frontend juntos, abra o PowerShell na raiz e execute:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start-dev.ps1
```

O script abre dois terminais separados, importa o `.env` para o backend e mostra o endereço do health check. Para parar, use `Ctrl+C` nos dois terminais.

Verifique a API e a conexão ao banco em `GET http://localhost:3000/api/health`.

### Endpoints

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `PUT /api/auth/password`, `PATCH /api/account/profile`, `DELETE /api/account`
- `GET|POST /api/tasks`, `PATCH|DELETE /api/tasks/:id`
- `GET|POST /api/appointments`, `PATCH|DELETE /api/appointments/:id`
- `GET|POST /api/areas`, `PATCH|DELETE /api/areas/:id`
- `GET|POST /api/goals`, `DELETE /api/goals/:id`
- `GET|PUT /api/preferences`

Todos os recursos pessoais exigem `Authorization: Bearer <token>` e s?o limitados ao usu?rio autenticado.

## Frontend

O servidor Vite encaminha `/api` para `http://localhost:3000`. Com o backend iniciado, abra outro terminal:

```sh
cd Frontend
npm install
npm run dev
```

Em outro ambiente, defina `VITE_API_URL` no frontend como a URL base da API, sem `/api` no final.


mvn spring-boot:run