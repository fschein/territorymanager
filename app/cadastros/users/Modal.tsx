"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputWithLabel } from "@/components/custom/FormInput";
import FormSelectRole from "@/components/custom/FormSelectRole";
import { Button } from "@/components/ui/button";
import { normalizeNumberOnly, normalizePhoneNumber } from "@/helpers/mask";
import { toast } from "@/hooks/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { UserProps } from "@/types/UserProps";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Pen, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreUsers } from "./store";

const initialProps: UserProps = {
  _id: "",
  name: "",
  email: "",
  phone_number: "",
  password: "senha123",
  role: "user",
};

const ModalUser = () => {
  const modalOpen = useStoreUsers((state) => state.modalOpen);
  const closeModal = useStoreUsers((state) => state.closeModal);
  const modalEditing = useStoreUsers((state) => state.modalEditing);
  const editModal = useStoreUsers((state) => state.editModal);
  const id = useStoreUsers((state) => state.id);

  const [formData, setFormData] = useState(initialProps);

  const { data } = useUsers().getOne(id);
  const {
    mutate: insertOne,
    isPending: insertOneIsPending,
    isSuccess: insertOneIsSuccess,
  } = useUsers().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
  } = useUsers().update();

  function handleSubmit() {
    if (!formData.name) {
      toast({ title: "Erro!", description: "Nome não informado", variant: "destructive" });
      return;
    }
    if (!formData.email) {
      toast({ title: "Erro!", description: "Email não informado", variant: "destructive" });
      return;
    }
    if (!formData.phone_number) {
      toast({
        title: "Erro!",
        description: "Número de telefone não informado",
        variant: "destructive",
      });
      return;
    }
    if (id) update({ data: formData, id: id || "" });
    if (!id) insertOne(formData);
  }

  useEffect(() => {
    setFormData(data || initialProps);
  }, [data]);

  function handleClickCancel() {
    editModal(false);
  }

  useEffect(() => {
    if (insertOneIsSuccess) {
      handleClickCancel();
      closeModal();
    }
  }, [insertOneIsPending]);

  useEffect(() => {
    if (updateIsSuccess) {
      handleClickCancel();
      closeModal();
    }
  }, [updateIsPending]);

  const isPending = insertOneIsPending || updateIsPending;
  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Responsável:` : "Novo Responsável"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 flex-wrap">
          <InputWithLabel
            label="Nome"
            placeholder="Digite o nome"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
            className="flex-1"
            disabled={!modalEditing || isPending}
          />
          <InputWithLabel
            label="Email"
            placeholder="Digite o email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
            className="flex-1"
            type="email"
            disabled={!modalEditing || isPending}
          />
          <InputWithLabel
            label="Telefone"
            placeholder="Digite o telefone"
            value={normalizePhoneNumber(formData.phone_number)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                phone_number: normalizeNumberOnly(e.target.value),
              }))
            }
            required
            className="flex-1"
            disabled={!modalEditing || isPending}
          />
          <FormSelectRole
            label="Permissão"
            value={formData.role}
            onChange={(role) => setFormData((prev) => ({ ...prev, role: role || "user" }))}
            className="w-full flex-1"
            placeholder="Selecione a permissão"
            disabled={!modalEditing || isPending}
          />
        </div>
        <DialogFooter className="flex gap-2">
          {modalEditing ? (
            <>
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={handleClickCancel}
                disabled={isPending}
              >
                <Ban size={16} className="me-2" />
                Cancelar
              </Button>
              <Button size={"sm"} onClick={handleSubmit} disabled={isPending}>
                {isPending ? (
                  <>
                    <FaSpinner size={16} className="me-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" />
                    Salvar
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button variant={"warning"} onClick={() => editModal(true)}>
              <Pen size={16} className="me-2" />
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUser;
