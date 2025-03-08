"use client";
import { roleOptions } from "@/components/custom/FormSelectRole";
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
import { normalizePhoneNumber } from "@/helpers/mask";
import { useUsers } from "@/hooks/useUsers";
import { Pen, Plus } from "lucide-react";
import ModalUser from "./Modal";
import { useStoreUsers } from "./store";

export const AccordionUsers = () => {
  const openModal = useStoreUsers().openModal;
  const { data } = useUsers().getAll();

  return (
    <Accordion type="single" collapsible className="p-2 border  rounded-lg bg-secondary">
      <AccordionItem value="item-1" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline uppercase`}>
          Responsáveis
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 p-0 pt-3">
          <div className="flex justify-end">
            <Button onClick={() => openModal("")}>
              <Plus size={16} className="me-2" />
              Adicionar Responsável
            </Button>
          </div>
          <Table className="bg-background rounded-md">
            <TableHeader className="uppercase">
              <TableRow>
                <TableHead className="w-16">Ação</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Permissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user) => (
                <TableRow className="uppercase" key={user._id}>
                  <TableCell className="w-16">
                    <Button
                      className="border-0 px-2 py-1 text-xs"
                      size={"xs"}
                      title="Editar"
                      variant={"warning"}
                      onClick={() => openModal(user._id || "")}
                    >
                      <Pen size={16} />
                    </Button>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell className="normal-case">{user.email}</TableCell>
                  <TableCell>{normalizePhoneNumber(user.phone_number)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {roleOptions.filter((opt) => opt.value == user.role)[0]?.label}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>
      <ModalUser />
    </Accordion>
  );
};
