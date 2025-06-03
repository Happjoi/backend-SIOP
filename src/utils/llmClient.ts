// src/utils/llmClient.ts
import { RequestHandler } from 'express';
import { v2 as  UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface GroqResponse {
  choices: Array<{
    message: { content: string | null };
  }>;
}

/**
 * Cria a chamada à API Groq para gerar texto a partir de um prompt.
 */
export async function getGroqChatCompletion(message: string): Promise<GroqResponse> {
  if (!message || message.trim().length === 0) {
    throw new Error('Prompt inválido ou vazio');
  }
  return groq.chat.completions.create({
    messages: [{ role: 'user', content: message.trim() }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2000, // ajustável
  });
}
