import mongoose, { Document, Schema, Types } from "mongoose";

export interface TerritoryDocument extends Document {
  number: string;
  id_group?: Types.ObjectId;
  id_neighborhood?: Types.ObjectId;
  coordinates: [number, number][][];
  information?: string;
  status: "assigned" | "ongoing" | "done" | "urgent";
  id_responsible?: Types.ObjectId;
}

// Definição do schema
const territorySchema = new Schema<TerritoryDocument>({
  number: { type: String, unique: true, required: true },
  id_group: { type: Schema.Types.ObjectId, ref: "Group" },
  id_neighborhood: { type: Schema.Types.ObjectId, ref: "Neighborhood" },
  information: { type: String },
  coordinates: {
    type: [[[Number]]],
    required: true,
  },
  status: {
    type: String,
    enum: ["assigned", "ongoing", "done", "urgent"],
    default: "assigned",
    required: true,
  },
  id_responsible: { type: Schema.Types.ObjectId, ref: "User" },
});

// Criando o modelo
const Territory =
  mongoose.models.Territory || mongoose.model<TerritoryDocument>("Territory", territorySchema);

export default Territory;
