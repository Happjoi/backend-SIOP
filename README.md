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

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/Happjoi/backend-SIOP.git](https://github.com/Happjoi/backend-SIOP.git)
    cd backend-SIOP
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente (.env)**
    Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
    ```ini
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
    ```

4.  **Execute em modo de desenvolvimento**
    ```bash
    npm run dev
    ```

5.  **Build e execução em produção**
    ```bash
    npm run build
    npm start
    ```

---

## 🚩 Principais Endpoints

### Autenticação (`/api/auth`)

| Método | Rota               | | Ação                                    |
| :----- | :----------------- | | :-------------------------------------- |
| `POST` | `/login`           | | Gera access & refresh tokens            |
| `POST` | `/refresh-token`   | | Renova access token                     |
| `POST` | `/forgot-password` | | Envia nova senha provisória por e-mail  |

### Usuários (`/api/users`)

CRUD completo (somente `admin`):
```bash
GET     /api/users
GET     /api/users/:id
POST    /api/users
PUT     /api/users/:id
PATCH   /api/users/:id
DELETE  /api/users/:id
```
Casos (/api/cases)
```
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
```

Vítimas (/api/victims & /api/cases/:caseId/victims)
