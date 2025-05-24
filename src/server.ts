import dotenv from "dotenv";
import 'dotenv/config';
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import app from "./app";
import Loaders from "./loaders/startDb";

dotenv.config();

// Middleware para parse de JSON
app.use(express.json());

// Rota principal de saúde
type ServerRequest = Request;
type ServerResponse = Response;
app.get("/", (req: ServerRequest, res: ServerResponse) => {
  res.send("Servidor em funcionamento!");
});

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
