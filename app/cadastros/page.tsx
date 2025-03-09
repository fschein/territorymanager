import MainComponent from "@/components/custom/MainComponent";
import MapWithDraw from "../main/MapWithDraw";
import { AccordionGroups } from "./groups/AccordionGroups";
import { AccordionNeighborhoods } from "./neighborhoods/AccordionNeighborhoods";
import { AccordionUsers } from "./users/AccordionUsers";
export default function Cadastros() {
  return (
    <MainComponent rolesPermission={["admin", "elder"]} className="gap-3">
      <MapWithDraw canEdit={true} />
      <AccordionGroups />
      <AccordionNeighborhoods />
      <AccordionUsers />
    </MainComponent>
  );
}
