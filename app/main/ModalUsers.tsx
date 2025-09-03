"use client";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Search } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { useStoreTerritory } from "../../stores/store";

export const ModalUsers = ({
  message,
  modalOpen,
  closeModal,
}: {
  message: string;
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const { data: users } = useUsers().getAll({ filters: { search: searchInput } });
  const { mutate: setStatus, isPending: setStatusIsPending } = useTerritories().setStatus();
  const id = useStoreTerritory().id;
  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="w-full md:max-w-[50vw] rounded-sm">
        <DialogTitle className="font-medium text-lg">Responsáveis</DialogTitle>
        <div className="flex gap-0">
          <Button variant={"secondary"} size={"sm"} className="br-0 rounded-none rounded-s-md">
            <Search size={18} />
          </Button>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="rounded-none rounded-e-md bl-0"
          />
        </div>
        <Table divClassname="border rounded-md max-h-[60vh] scroll-thin">
          <TableHeader>
            <TableRow className="uppercase text-nowrap top-0 sticky bg-secondary">
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users?.map((user) => (
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
                        const whatsappUrl = `https://wa.me/55${
                          user?.phone_number
                        }?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank");
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
