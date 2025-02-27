"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNeighborhoods } from "@/hooks/settings/useNeighborhoods";
import { Pen, Plus } from "lucide-react";
import ModalGroup from "./Modal";
import { useStoreNeighborhoods } from "./store";

export const AccordionNeighborhoods = () => {
  const openModal = useStoreNeighborhoods().openModal;
  const { data } = useNeighborhoods().getAll();

  return (
    <Accordion type="single" collapsible className="p-2 border  rounded-lg bg-secondary">
      <AccordionItem value="item-1" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline uppercase`}>Bairros</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 p-0 pt-3">
          <div className="flex justify-end">
            <Button onClick={() => openModal("")}>
              <Plus size={18} className="me-2" />
              Adicionar Bairro
            </Button>
          </div>
          <Table className="bg-background rounded-md">
            <TableHeader className="uppercase">
              <TableRow>
                <TableHead className="w-16">Ação</TableHead>
                <TableHead>Nome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((group) => (
                <TableRow className="uppercase" key={group._id}>
                  <TableCell className="w-16">
                    <Button
                      className="border-0 px-2 py-1 text-xs"
                      size={"xs"}
                      title="Editar"
                      variant={"warning"}
                      onClick={() => openModal(group._id || "")}
                    >
                      <Pen size={16} />
                    </Button>
                  </TableCell>
                  <TableCell>{group.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
      <ModalGroup />
    </Accordion>
  );
};
