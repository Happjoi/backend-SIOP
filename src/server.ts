import dotenv from "dotenv";
import "dotenv/config";
import express, { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import app from "./app";
import Loaders from "./loaders/startDb";
import { error } from "console";
import http from 'http';
import WebSocketService from './services/websocketService';

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
  
  // Cria o servidor HTTP
  const server = http.createServer(app);
  
  // Inicializa o serviço WebSocket
  const wsService = new WebSocketService(server);
  
  // Porta de execução
  type Port = number | string;
  const port: Port = process.env.PORT || 3000;
  
  server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
  
}

startServer();

