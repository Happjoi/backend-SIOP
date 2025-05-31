import dotenv from "dotenv";
import "dotenv/config";
import express, { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import app from "./app";
import Loaders from "./loaders/startDb";
import Groq from "groq-sdk";
import { error } from "console";

dotenv.config();

// Middleware para parse de JSON
app.use(express.json());

// Rota principal de saúde
type ServerRequest = Request;
type ServerResponse = Response;
app.get("/", (req: ServerRequest, res: ServerResponse) => {
  res.send("Servidor em funcionamento!");
});

// Inicializa o cliente Groq (certifique-se de que GROQ_API_KEY está definida)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Interface para tipar a resposta da API da Groq (corrige TS2322 anterior)
interface GroqResponse {
  choices: Array<{
    message: {
      content: string | null; // Permite content ser string ou null
    };
  }>;
}

// Função para chamar a API da Groq com tipagem explícita
async function getGroqChatCompletion(message: string): Promise<GroqResponse> {
  // Valida a mensagem
  if (typeof message !== "string" || message.trim().length === 0) {
    throw new Error("Mensagem inválida ou vazia");
  }

  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message.trim(),
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7, // Controla a criatividade
    max_tokens: 1000, // Limita o tamanho da resposta
  });
}

// Endpoint POST /api/chat com tipagem explícita (corrige TS2769, TS2304 e TS2322 atual)
const chatHandler: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { message } = req.body;

  // Validação do corpo da requisição
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "Mensagem inválida ou não fornecida" });
    return;
  }

  try {
    const responseGroq = await getGroqChatCompletion(message);

    // Verifica se há escolhas na resposta
    if (!responseGroq.choices || responseGroq.choices.length === 0) {
      res
        .status(500)
        .json({ error: "Nenhuma resposta recebida da API da Groq" });
      return;
    }

    const content = responseGroq.choices[0].message.content;
    // Verifica se content é null
    if (content === null) {
      res
        .status(500)
        .json({ error: "Resposta da API da Groq não contém conteúdo válido" });
      return;
    }

    res.status(200).json({
      response: content,
    });
  } catch (error: any) {
    console.error("Erro ao consultar a API da Groq:", error.message);
    res.status(500).json({
      error: "Erro ao consultar a API da Groq",
      details: error.message,
    });
  }
};

// Registra o endpoint
app.post("/api/chat", chatHandler);

// Função de inicialização do servidor
async function startServer(): Promise<void> {
  await Loaders.start();
  // Porta de execução
  type Port = number | string;
  const port: Port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

startServer();

// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Conectado ao MongoDB'))
//     .catch(err => console.error('Erro de conexão com o MongoDB:', err));
