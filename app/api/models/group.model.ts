import mongoose, { Document, Schema } from "mongoose";

// Interface para o Mongoose
export interface GroupDocument extends Document {
  name: string;
  color: string;
}

// Definição do schema
const groupSchema = new Schema<GroupDocument>({
  name: { type: String, required: true },
  color: { type: String, required: true },
});

// Criando o modelo
const Group = mongoose.models.Group || mongoose.model<GroupDocument>("Group", groupSchema);

export default Group;
