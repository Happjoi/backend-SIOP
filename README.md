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

### 🔐 Autenticação (`/api/auth`)

| Método | Rota               | Protegido | Ação                                   |
| :----- | :----------------- | :-------: | :------------------------------------- |
| `POST` | `/login`           |     ✅     | Gera access & refresh tokens           |
| `POST` | `/refresh-token`   |     ✅     | Renova access token                    |
| `POST` | `/forgot-password` |     ✅     | Envia nova senha provisória por e-mail |



### 👤 Usuários (`/api/users`)

| Método   | Rota   | Protegido | Ação                            |
| :------- | :----- | :-------: | :------------------------------ |
| `GET`    | `/`    |     ✅     | Lista todos os usuários         |
| `GET`    | `/:id` |     ✅     | Retorna usuário específico      |
| `POST`   | `/`    |     ✅     | Cria novo usuário               |
| `PUT`    | `/:id` |     ✅     | Atualiza usuário por completo   |
| `PATCH`  | `/:id` |     ✅     | Atualiza parcialmente o usuário |
| `DELETE` | `/:id` |     ✅     | Deleta usuário                  |

### 📁 Casos (/api/cases)

| Método   | Rota             | Protegido | Ação                                |
| :------- | :--------------- | :-------: | :---------------------------------- |
| `POST`   | `/`              |     ✅     | Criar novo caso                     |
| `GET`    | `/`              |     ✅     | Lista todos os casos                |
| `GET`    | `/visiveis`      |     ✅     | Lista casos visíveis para o usuário |
| `GET`    | `/:id`           |     ✅     | Retorna detalhes de um caso         |
| `PUT`    | `/:id`           |     ✅     | Atualiza totalmente um caso         |
| `PATCH`  | `/:id`           |     ✅     | Atualiza parcialmente um caso       |
| `DELETE` | `/:id`           |     ✅     | Remove um caso                      |
| `POST`   | `/:id/photo`     |     ✅     | Upload de imagem do caso            |
| `GET`    | `/:id/evidences` |     ✅     | Lista evidências do caso            |
| `GET`    | `/:id/victims`   |     ✅     | Lista vítimas do caso               |
| `GET`    | `/:id/geo`       |     ✅     | Faz geocodificação do endereço      |


### 🧍 Vítimas (/api/victims & /api/cases/:caseId/victims)

| Método   | Rota                         | Protegido | Ação                          |
| :------- | :--------------------------- | :-------: | :---------------------------- |
| `POST`   | `/api/cases/:caseId/victims` |     ✅     | Cadastra vítima em um caso    |
| `GET`    | `/`                          |     ✅     | Lista todas as vítimas        |
| `GET`    | `/:id`                       |     ✅     | Retorna vítima específica     |
| `PUT`    | `/:id`                       |     ✅     | Atualiza totalmente a vítima  |
| `PATCH`  | `/:id`                       |     ✅     | Atualiza parcialmente         |
| `PATCH`  | `/:id/lesion`                |     ✅     | Atualiza lesões do corpo      |
| `PATCH`  | `/:id/tooth`                 |     ✅     | Atualiza dados do odontograma |
| `DELETE` | `/:id`                       |     ✅     | Remove uma vítima             |

### 🔬 Evidências (/api/evidences + /api/cases/:caseId/evidences)

| Método   | Rota                           | Protegido | Ação                                |
| :------- | :----------------------------- | :-------: | :---------------------------------- |
| `POST`   | `/api/cases/:caseId/evidences` |     ✅     | Cria evidência para um caso         |
| `GET`    | `/`                            |     ✅     | Lista todas as evidências           |
| `GET`    | `/:id`                         |     ✅     | Retorna evidência específica        |
| `PUT`    | `/:id`                         |     ✅     | Atualiza completamente              |
| `PATCH`  | `/:id`                         |     ✅     | Atualiza parcialmente               |
| `DELETE` | `/:id`                         |     ✅     | Remove evidência                    |
| `POST`   | `/:id/pdf`                     |     ✅     | Gera PDF da evidência               |
| `POST`   | `/:id/generate-laudo`          |     ✅     | Gera laudo via LLM para a evidência |

### 📊 Relatórios (/api/reports)

| Método   | Rota                                 | Protegido | Ação                              |
| :------- | :----------------------------------- | :-------: | :-------------------------------- |
| `POST`   | `/api/cases/:caseId/generate-report` |     ✅     | Gera relatório para o caso via IA |
| `GET`    | `/`                                  |     ✅     | Lista todos os relatórios         |
| `GET`    | `/:id`                               |     ✅     | Retorna relatório específico      |
| `PUT`    | `/:id`                               |     ✅     | Atualiza relatório                |
| `PATCH`  | `/:id`                               |     ✅     | Atualiza parcialmente             |
| `DELETE` | `/:id`                               |     ✅     | Remove relatório                  |

### 🧬 Comparações Odontolegal (/api/comparisons)

| Método   | Rota       | Protegido | Ação                                                     |
| :------- | :--------- | :-------: | :------------------------------------------------------- |
| `POST`   | `/victims` |     ✅     | Compara vítimas identificadas e não identificadas via IA |
| `GET`    | `/`        |     ✅     | Lista todos os resultados de comparação                  |
| `GET`    | `/:id`     |     ✅     | Detalha comparação específica                            |
| `PUT`    | `/:id`     |     ✅     | Substitui resultado de comparação                        |
| `PATCH`  | `/:id`     |     ✅     | Atualiza parcialmente resultado de comparação            |
| `DELETE` | `/:id`     |     ✅     | Remove resultado de comparação                           |

### 📊 Diagrama de Entidades  

classDiagram {
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
