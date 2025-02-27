"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputWithLabel } from "@/components/custom/FormInput";
import FormSelectColor from "@/components/custom/FormSelectColor";
import { Button } from "@/components/ui/button";
import { useGroups } from "@/hooks/settings/useGroups";
import { toast } from "@/hooks/use-toast";
import { GroupProps } from "@/types/GroupProps";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Pen, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreGroups } from "./store";

const initialProps: GroupProps = {
  _id: "",
  name: "",
  color: "",
};

const ModalGroup = () => {
  const modalOpen = useStoreGroups((state) => state.modalOpen);
  const closeModal = useStoreGroups((state) => state.closeModal);
  const modalEditing = useStoreGroups((state) => state.modalEditing);
  const editModal = useStoreGroups((state) => state.editModal);
  const id = useStoreGroups((state) => state.id);

  const [formData, setFormData] = useState(initialProps);

  const { data } = useGroups().getOne(id);
  const {
    mutate: insertOne,
    isPending: insertOneIsPending,
    isSuccess: insertOneIsSuccess,
  } = useGroups().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
  } = useGroups().update();

  function handleSubmit() {
    if (!formData.name) {
      toast({ title: "Erro!", description: "Nome não informado", variant: "destructive" });
      return;
    }
    if (!formData.color) {
      toast({ title: "Erro!", description: "Cor não informada", variant: "destructive" });
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
    }
  }, [insertOneIsPending]);

  useEffect(() => {
    if (updateIsSuccess) {
      handleClickCancel();
    }
  }, [updateIsPending]);

  const isPending = insertOneIsPending || updateIsPending;
  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Grupo:` : "Novo Grupo"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <InputWithLabel
            label="Nome"
            placeholder="Digite o nome"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
            className="flex-1"
            disabled={!modalEditing || isPending}
          />
          <FormSelectColor
            label="Cor"
            onChange={(color) => setFormData((prev) => ({ ...prev, color: color || "" }))}
            className="flex-1"
            placeholder="Selecione a cor"
            disabled={!modalEditing || isPending}
          />
        </div>
        <DialogFooter>
          {modalEditing ? (
            <>
              <Button
                size={"sm"}
                variant={"secondary"}
                onClick={handleClickCancel}
                disabled={isPending}
              >
                <Ban size={18} className="me-2" />
                Cancelar
              </Button>
              <Button size={"sm"} onClick={handleSubmit} disabled={isPending}>
                {isPending ? (
                  <>
                    <FaSpinner size={18} className="me-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} className="me-2" />
                    Salvar
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button variant={"warning"} onClick={() => editModal(true)}>
              <Pen size={18} className="me-2" />
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalGroup;
