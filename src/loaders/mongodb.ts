import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function startDB(): Promise<void> {
  try {
    console.log("Tentando conectar ao MongoDB...");

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI não está definida no arquivo .env");
    }

    await mongoose.connect(mongoUri);
    console.log("Conectado ao MongoDB!");
  } catch (err) {
    console.error("Erro de conexão com o MongoDB:", err);
  }
}

export default startDB;
