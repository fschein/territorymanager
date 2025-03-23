import { GroupProps } from "./GroupProps";
import { NeighborhoodProps } from "./NeighborhoodProps";
import { SquareProps } from "./SquareProps";
import { UserProps } from "./UserProps";

export interface TerritoryProps {
  _id?: string;
  number: string;
  id_group: string;
  group?: GroupProps;
  id_neighborhood: string;
  neighborhood?: NeighborhoodProps;
  coordinates: [number, number][][];
  status?: "assigned" | "ongoing" | "done" | "urgent";
  responsibles?: UserProps[];
  squares?: SquareProps[];
  doneSquaresList?: string[];
  qtde_squares?: number;
}

export const statusMap = new Map([
  ["assigned", { value: "Designado", style: "" }],
  ["ongoing", { value: "Feito Parcialmente", style: "text-warning" }],
  ["done", { value: "Concluído", style: "text-success" }],
  ["urgent", { value: "Urgente", style: "text-destructive" }],
]);
