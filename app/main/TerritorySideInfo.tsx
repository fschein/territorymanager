"use client";
import ButtonMotivation from "@/components/custom/ButtonMotivation";
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
import { Textarea } from "@/components/ui/textarea";
import { hasRole } from "@/helpers/checkAuthorization";
import { useTerritories } from "@/hooks/useTerritories";
import { TerritoryProps } from "@/types/TerritoryProps";
import { Ban, CircleCheck, CircleDashed, Forward, Save } from "lucide-react";
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
  information: "",
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
  const sideInfoOpen = useStoreTerritory().sideInfoOpen;
  const closeSideInfo = useStoreTerritory().closeSideInfo;
  const id = useStoreTerritory().id;
  const setTerritory = useStoreTerritory().setTerritory;
  const coordinates = useStoreTerritory().coordinates;
  const [modalUserOpen, setModalUserOpen] = useState(false);

  const { data, isLoading } = useTerritories().getOne(id);
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
      `${url}/?number=${data?.number}\n\n` +
      `*Olá!* 😁\n` +
      `Você foi designado para o território *${number}*.\n` +
      `Acesse o link acima para conferir todos os detalhes.\n` +
      `Se precisar de algo, estou à disposição!\n\n` +
      `⚠️ _Ao finalizar o território, lembre-se de marcá-lo como concluído._`;

    navigator.clipboard
      .writeText(mensagem)
      .then(() => toast.info("Mensagem copiada!"))
      .catch((err) => toast.error("Erro ao copiar a mensagem:", err));
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
    <Sheet onOpenChange={handleClose} open={sideInfoOpen}>
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
              {formData.status == "ongoing" && (
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm">Informações</label>
                  <Textarea value={formData.information} readOnly />
                </div>
              )}
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
                    modalOpen={modalUserOpen}
                    closeModal={() => setModalUserOpen(false)}
                  />
                </>
              )}
            </span>
            <span className="flex gap-2">
              <ButtonMotivation
                variant={"warning"}
                title="Concluido Parcial"
                headerTitle="Digite o que foi concluido"
                placeholder="Feito apenas o lado..."
                isTextarea
                value={formData.information}
                action={(info) => setStatus({ id, status: "ongoing", information: info })}
              >
                <CircleDashed size={20} />
              </ButtonMotivation>
              <ButtonDate
                variant={"success"}
                title="Concluido"
                headerTitle="Dia que foi concluído"
                description="Esse terrítório será marcado como concluído"
                action={(data) => setStatus({ id, status: "done", data })}
              >
                <CircleCheck size={20} />
              </ButtonDate>
              {/* <AlertPopUp
                title="Deseja realmente concluir o território?"
              >
                <Button variant={"success"} title="Concluido">
                </Button>
              </AlertPopUp> */}
            </span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TerritorySideInfo;
