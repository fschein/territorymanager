import mongoose, { Document, Schema, Types } from "mongoose";

export interface SquareDocument extends Document {
  letter: string;
  id_territory?: Types.ObjectId;
  coordinates: [number, number][][];
}

// Definição do schema
const squareSchema = new Schema<SquareDocument>({
  letter: { type: String, required: true },
  id_territory: { type: Schema.Types.ObjectId, ref: "Territory" },
  coordinates: {
    type: [[[Number]]],
    required: true,
  },
});

squareSchema.index({ letter: 1, id_territory: 1 }, { unique: true });

// Criando o modelo
const Square = mongoose.models.Square || mongoose.model<SquareDocument>("Square", squareSchema);

export default Square;
