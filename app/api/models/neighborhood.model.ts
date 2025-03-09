import mongoose, { Document, Schema } from "mongoose";

export interface NeighborhoodDocument extends Document {
  name: string;
}

const neighborhoodSchema = new Schema<NeighborhoodDocument>({
  name: { type: String, required: true },
});

const Neighborhood =
  mongoose.models.Neighborhood ||
  mongoose.model<NeighborhoodDocument>("Neighborhood", neighborhoodSchema);

export default Neighborhood;
