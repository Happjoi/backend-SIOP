import startDB from "./mongodb";

class Loaders {
  async start(): Promise<void> {
    console.log("Iniciando Loaders...");
    await startDB();
  }
}

export default new Loaders();
