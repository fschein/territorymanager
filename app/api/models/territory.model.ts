import mongoose, { Document, Schema, Types } from "mongoose";

export interface TerritoryDocument extends Document {
  number: string;
  id_group?: Types.ObjectId;
  id_neighborhood?: Types.ObjectId;
  coordinates: [number, number][][];
  status: "assigned" | "ongoing" | "done" | "urgent";
  responsibles: Types.ObjectId[];
  doneSquaresList: Types.ObjectId[];
  qtde_squares?: number;
}

// Definição do schema
const territorySchema = new Schema<TerritoryDocument>({
  number: { type: String, unique: true, required: true },
  id_group: { type: Schema.Types.ObjectId, ref: "Group" },
  id_neighborhood: { type: Schema.Types.ObjectId, ref: "Neighborhood" },
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
  responsibles: [{ type: Schema.Types.ObjectId, ref: "User" }],
  doneSquaresList: [{ type: Schema.Types.ObjectId, ref: "Square" }],
  qtde_squares: { type: Number, default: 0 },
});

// Criando o modelo
const Territory =
  mongoose.models.Territory || mongoose.model<TerritoryDocument>("Territory", territorySchema);

export default Territory;
