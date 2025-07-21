"use client";
import { InputWithLabel } from "@/components/custom/FormInput";
import FormSelectGroup from "@/components/custom/FormSelectGroups";
import FormSelectNeighborhood from "@/components/custom/FormSelectNeighborhoods";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { hasRole } from "@/helpers/checkAuthorization";
import { useTerritories } from "@/hooks/useTerritories";
import { TerritoryProps } from "@/types/TerritoryProps";
import { Ban, CircleCheck, Forward, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ButtonDate from "./ButtonDate";
import { ModalUsers } from "./ModalUsers";
import { useStoreTerritory } from "./store";

const url = process.env.NEXT_PUBLIC_URL;

const initialFormValues: TerritoryProps = {
  number: "",
  id_neighborhood: "",
  id_group: "",
  coordinates: [],
  status: "assigned",
};
const TerritorySideInfo = ({
  removeFeature,
  editing,
}: {
  removeFeature: () => void;
  editing: boolean;
}) => {
  const sideTerritoryInfoOpen = useStoreTerritory().sideTerritoryInfoOpen;
  const closeSideInfo = useStoreTerritory().closeSideInfo;
  const id = useStoreTerritory().id;
  const setTerritory = useStoreTerritory().setTerritory;
  const coordinates = useStoreTerritory().coordinates;
  const [modalUserOpen, setModalUserOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { data, isLoading } = useTerritories().getOne({
    id,
    enabled: !!id && sideTerritoryInfoOpen,
  });
  const [formData, setFormData] = useState<TerritoryProps>(initialFormValues);
  const {
    mutate: insertOne,
    isPending: insertOneIsPending,
    isSuccess: insertOneIsSuccess,
  } = useTerritories().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
  } = useTerritories().update();
  const { mutate: setStatus } = useTerritories().setStatus();

  async function onSubmit() {
    try {
      if (!formData.coordinates) {
        throw new Error("Coordenadas inválidas!");
      }
      if (!formData.id_group) {
        throw new Error("Selecione um grupo!");
      }
      if (!formData.id_neighborhood) {
        throw new Error("Selecione um bairro!");
      }
      if (!formData.number) {
        throw new Error("Informe o número do território!");
      }
      if (id) {
        update({ data: formData, id });
      } else {
        insertOne({
          ...formData,
          coordinates,
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleClose() {
    closeSideInfo();
    if (!id) {
      removeFeature();
    }
    setFormData(initialFormValues);
  }

  useEffect(() => {
    if (insertOneIsSuccess) handleClose();
  }, [insertOneIsPending]);

  useEffect(() => {
    if (updateIsSuccess) handleClose();
  }, [updateIsPending]);

  async function sendTerritory() {
    const number = data?.number;
    const mensagem =
      `*Território ${number} - Designação*\n\n` +
      `Olá, irmão!\n` +
      `Você foi designado(a) para trabalhar o território *${number}*.\n\n` +
      `*Link para acessar:*\n${url}/?number=${number}\n\n` +
      `*Instruções importantes:*\n` +
      `- Acesse o link para ver o mapa e detalhes\n` +
      `- Ao concluir o trabalho, marque como "concluído" no sistema\n` +
      `- Qualquer dúvida, estarei à disposição\n\n` +
      `Que Jeová abençoe seu serviço!`;

    navigator.clipboard.writeText(mensagem);
    setMessage(mensagem);
    setModalUserOpen(true);
  }
  useEffect(() => {
    if (data) {
      setTerritory(data);
      setFormData(data);
    }
  }, [data]);
  const isPending = insertOneIsPending || updateIsPending || isLoading;
  const statusMap = new Map([
    ["assigned", { value: "Designado", style: "" }],
    ["ongoing", { value: "Feito Parcialmente", style: "text-warning" }],
    ["done", { value: "Concluído", style: "text-success" }],
    ["urgent", { value: "Urgente", style: "text-destructive" }],
  ]);

  return (
    <Sheet onOpenChange={handleClose} open={sideTerritoryInfoOpen}>
      <SheetContent className="h-full flex flex-col justify-between">
        <div>
          <SheetHeader>
            <SheetTitle>{id ? "Território" : "Criar Território"}</SheetTitle>
            <SheetDescription>
              {id
                ? "Esses são todos os dados referentes a esse território"
                : "Coloque aqui todos os dados referentes ao território a ser criado"}
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <Skeleton className="w-full min-h-[40dvh] bg-secondary my-4" />
          ) : (
            <section className="flex flex-col gap-2 py-4 z-[100] w-full">
              {id && (
                <InputWithLabel
                  label="Status"
                  className={`flex-1 min-w-[15ch]`}
                  inputClass={`${statusMap.get(String(formData.status))?.style}`}
                  value={statusMap.get(String(formData.status))?.value}
                  readOnly
                  type="status"
                  step="1"
                />
              )}
              <InputWithLabel
                label="Número"
                className={"flex-1 min-w-[15ch]"}
                value={String(formData.number)}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                readOnly={!editing || isPending}
                type="number"
                step="1"
              />
              <FormSelectNeighborhood
                name="id_neighborhood"
                label="Bairro"
                value={formData.id_neighborhood}
                onChange={(id_neighborhood) =>
                  setFormData({ ...formData, id_neighborhood: id_neighborhood || "" })
                }
                readOnly={!editing || isPending}
                className="flex-1 w-full"
              />
              <FormSelectGroup
                name="id_group"
                label="Grupo de Serviço"
                value={formData.id_group}
                onChange={(id_group) => setFormData({ ...formData, id_group: id_group || "" })}
                readOnly={!editing || isPending}
                className="flex-1 w-full"
              />
            </section>
          )}
          {editing && (
            <SheetFooter className="flex gap-2">
              <SheetClose asChild>
                <Button variant={"secondary"} onClick={removeFeature} disabled={isPending}>
                  <Ban size={16} className="me-2" />
                  Fechar
                </Button>
              </SheetClose>
              <Button onClick={onSubmit} disabled={isPending}>
                <Save size={16} className="me-2" />
                Salvar
              </Button>
            </SheetFooter>
          )}
        </div>
        {id && (
          <div className="flex justify-between gap-2">
            <span>
              {hasRole(["admin", "elder"]) && (
                <>
                  <Button
                    variant={"secondary"}
                    className="bg-slate-300 dark:text-slate-600"
                    title="Designar"
                    onClick={sendTerritory}
                  >
                    <Forward size={20} />
                  </Button>
                  <ModalUsers
                    message={message}
                    modalOpen={modalUserOpen}
                    closeModal={() => setModalUserOpen(false)}
                  />
                </>
              )}
            </span>
            <span className="flex gap-2">
              <ButtonDate
                variant={"success"}
                title="Concluido"
                headerTitle="Dia que o território foi concluído"
                description="Esse território e todas as quadras dele serão marcado como concluídos"
                action={(data) => setStatus({ id, status: "done", data })}
              >
                <CircleCheck size={20} />
              </ButtonDate>
            </span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TerritorySideInfo;
