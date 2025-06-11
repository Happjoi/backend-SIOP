# Backend-SIOP (DentForensics)

API em **Node.js + TypeScript** para gerenciamento completo de perícias forenses:  
- **Casos**, **Vítimas**, **Evidências**  
- **Laudos** e **Relatórios** gerados por LLM (Groq SDK)  
- **Comparação Odontolegal**  
- **Autenticação JWT** com _access_ e _refresh tokens_  
- **Upload** de imagens e PDFs via Cloudinary  
- **Recuperação de senha** por e-mail

---

## 📌 Tecnologias

- **Node.js** + **Express.js**  
- **TypeScript**  
- **MongoDB** + **Mongoose**  
- **JWT** (_jsonwebtoken_)  
- **Refresh Tokens**  
- **bcrypt** (hash de senhas)  
- **nodemailer** (envio de e-mail)  
- **Cloudinary** (armazenamento de arquivos)  
- **Groq SDK** (chats LLM)  
- **Mermaid** (diagrama ER)  
- **dotenv**, **cors**, **helmet**, **express‐rate‐limit**

---

## ⚙️ Instalação

1. **Clone**  
   ```
   git clone https://github.com/Happjoi/backend-SIOP.git
   cd backend-SIOP
Dependências

npm install
Variáveis de ambiente (.env)

PORT=3000
MONGODB_URI=<sua_mongo_uri>

JWT_SECRET=<access_secret>
REFRESH_SECRET=<refresh_secret>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<seu_usuario_smtp>
SMTP_PASS=<sua_senha_smtp>
EMAIL_FROM="DentForensics <no-reply@seudominio.com>"

CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

GROQ_API_KEY=<groq_api_key>
Modo Desenvolvimento

bash
Copiar
Editar
npm run dev
Build & Produção

bash
Copiar
Editar
npm run build
npm start
🚩 Principais Endpoints
Autenticação /api/auth
Método	Rota	Protegido	Ação
POST	/login	❌	Gera access & refresh tokens
POST	/refresh-token	❌	Renova access token
POST	/forgot-password	❌	Envia nova senha provisória por e-mail

Usuários /api/users
CRUD completo (somente admin):

bash
Copiar
Editar
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
Casos /api/cases
Método	Rota	Roles	Ação
POST	/api/cases	perito	Criar caso
GET	/api/cases/visiveis	perito/assist	Listar casos do usuário ou afiliado
GET	/api/cases/:id	any logged	Detalhar caso
PUT	/api/cases/:id	perito	Substituir caso
PATCH	/api/cases/:id	perito	Atualização parcial
DELETE	/api/cases/:id	perito	Deletar caso
POST	/api/cases/:id/photo	perito	Upload de foto de caso
GET	/api/cases/:id/evidences	any logged	Listar evidências vinculadas
GET	/api/cases/:id/victims	any logged	Listar vítimas vinculadas
GET	/api/cases/:id/geo	any logged	Geocoding (Nominatim)

Vítimas /api/victims & /api/cases/:caseId/victims
bash
Copiar
Editar
POST   /api/cases/:caseId/victims    (perito)
GET    /api/victims                  (any logged)
GET    /api/victims/:id
PUT    /api/victims/:id
PATCH  /api/victims/:id
DELETE /api/victims/:id
PATCH  /api/victims/:id/lesion
PATCH  /api/victims/:id/tooth
Evidências /api/evidences & /api/cases/:caseId/evidences
bash
Copiar
Editar
POST   /api/cases/:caseId/evidences      (perito/assistente)
GET    /api/evidences                    (any logged)
GET    /api/evidences/:id
PUT    /api/evidences/:id
PATCH  /api/evidences/:id
DELETE /api/evidences/:id
POST   /api/evidences/:id/pdf            (gera PDF)
POST   /api/evidences/:id/generate-laudo (LLM)
Comparações /api/comparisons
bash
Copiar
Editar
POST   /api/comparisons/victims         (LLM odontolegal)
GET    /api/comparisons
GET    /api/comparisons/:id
PUT    /api/comparisons/:id
PATCH  /api/comparisons/:id
DELETE /api/comparisons/:id
Relatórios /api/reports
bash
Copiar
Editar
POST   /api/cases/:caseId/generate-report   (LLM)
GET    /api/reports
GET    /api/reports/:id
PUT    /api/reports/:id
PATCH  /api/reports/:id
DELETE /api/reports/:id
📊 Diagrama de Entidades (Mermaid)
mermaid
Copiar
Editar
classDiagram
    User <|-- Perito
    User <|-- Assistente
    User <|-- Admin

    class User {
      +String nome
      +String email
      +String senha (hash)
      +String role
      +String? peritoAfiliado
    }

    class Case {
      +String titulo
      +String descricao
      +String status
      +String localizacao
      +Date dataAbertura
      +ObjectId responsavel
      +ObjectId[] evidencias
      +ObjectId[] vitima
    }

    class Victim {
      +String nic
      +String? nome
      +String? causaMorte
      +BodyLesion[] bodyLesions
      +ToothStatus[] odontogram
    }

    class Evidence {
      +String tipo
      +Date dataColeta
      +ObjectId coletadoPor
      +String? imagemURL
      +String? conteudo
      +ObjectId caso
    }

    class ComparisonResult {
      +String resultado
      +Float precisao
      +ObjectId analisadoPor
      +Date dataAnalise
    }

    class Report {
      +String titulo
      +String conteudo
      +ObjectId peritoResponsavel
      +Date dataCriacao
    }

    Case "1" o-- "0..*" Victim
    Case "1" o-- "0..*" Evidence
    Case "1" o-- "0..*" Report

    Victim "0..*" --o "0..*" ComparisonResult
    Evidence "0..*" --o "0..*" ComparisonResult
📋 Checklist de Requisitos
 Auth JWT + Refresh

 Roles & Permissões

 CRUD Case, Victim, Evidence

 Upload (foto, PDF)

 Geocoding

 LLM (Reports, Laudos)

 Odontogram compare

 Recover password

 Swagger (em /api-docs)

🏗️ Próximos Passos
Adicionar testes automatizados (Jest + Supertest)

Harden security (rate‐limit, helmet, sanitização)

Documentação Swagger completa

Pipeline CI/CD & Docker

Otimização de performance e monitoramento

MIT © DentForensics Team
