import mongoose from "mongoose";
let isConnected = false;
export default async function connectToDB() {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) return console.error("MONGODB_URI NÃO ENCONTRADO!");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (err) {
    console.error("ERRO AO CONECTAR COM O MONGODB", err);
  }
}
