import mongoose, { Document, Schema, Types } from "mongoose";

export interface TerritoryLogDocument extends Document {
  territory: Types.ObjectId; // ID do território trabalhado
  user: Types.ObjectId; // ID do usuário que marcou como concluído
  date: Date; // Data e hora do registro
  information: String;
  status: "assigned" | "ongoing" | "done" | "urgent";
}

// Definição do schema
const territoryLogSchema = new Schema<TerritoryLogDocument>({
  territory: { type: Schema.Types.ObjectId, ref: "Territory", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  information: { type: String },
  status: {
    type: String,
    enum: ["assigned", "ongoing", "done", "urgent"],
    required: true,
  },
});

// Criando o modelo
const TerritoryLog =
  mongoose.models.TerritoryLog ||
  mongoose.model<TerritoryLogDocument>("TerritoryLog", territoryLogSchema);

export default TerritoryLog;
