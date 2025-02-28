"use client";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeFirstAndLastName, normalizePhoneNumber } from "@/helpers/mask";
import { useTerritories } from "@/hooks/useTerritories";
import { useUsers } from "@/hooks/useUsers";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FaWhatsapp } from "react-icons/fa6";
import { useStoreTerritory } from "./store";

export const ModalUsers = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const { data: users } = useUsers().getAll();
  const { mutate: setStatus, isPending: setStatusIsPending } = useTerritories().setStatus();
  const id = useStoreTerritory().id;

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="p-4 max-w-[90vw] w-fit">
        <DialogTitle className="font-medium text-lg">Responsáveis</DialogTitle>
        <Table divClassname="border rounded-md max-h-[40vh] scroll-thin">
          <TableHeader>
            <TableRow className="uppercase text-nowrap">
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user?._id} className="uppercase text-nowrap">
                <TableCell>{normalizeFirstAndLastName(user?.name)}</TableCell>
                <TableCell>{normalizePhoneNumber(user?.phone_number)}</TableCell>
                <TableCell>
                  <AlertPopUp
                    title={`Deseja realmente designar esse território para ${normalizeFirstAndLastName(
                      user?.name
                    )}?`}
                    description="Esse terrítório será marcado como pendente e esse irmão ficará responsável por ele."
                    action={() => {
                      setStatus({ id, status: "assigned", id_responsible: user._id });
                      window.open(`https://wa.me/55${user?.phone_number}`, "_blank");
                    }}
                  >
                    <Button size={"sm"} title="Enviar mensagem" disabled={setStatusIsPending}>
                      <FaWhatsapp size={16} />
                    </Button>
                  </AlertPopUp>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
