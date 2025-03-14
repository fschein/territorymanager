import mongoose from "mongoose";

let isConnected = false;

export default async function connectToDB() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI NÃO ENCONTRADO!");
    return;
  }

  try {
    // Verifique se a conexão já foi estabelecida
    if (isConnected) return;

    // Conecta ao banco de dados
    await mongoose.connect(process.env.MONGODB_URI); // Sem as opções deprecated

    // Marca a conexão como estabelecida
    isConnected = true;
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    // Pode implementar uma lógica de retry ou fallback aqui, se necessário
  }
}
