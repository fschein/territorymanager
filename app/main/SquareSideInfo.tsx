"use client";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { InputWithLabel } from "@/components/custom/FormInput";
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
import { useSquares } from "@/hooks/useSquares";
import { SquareProps } from "@/types/SquareProps";
import { Ban, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStoreTerritory } from "../../stores/store";

const initialFormValues: SquareProps = {
  letter: "",
  territory_number: "",
  coordinates: [],
};
const SquareSideInfo = ({
  removeFeature,
  editing,
}: {
  removeFeature: () => void;
  editing: boolean;
}) => {
  const sideSquareInfoOpen = useStoreTerritory().sideSquareInfoOpen;

  const closeSideInfo = useStoreTerritory().closeSideInfo;
  const id = useStoreTerritory().id;
  const coordinates = useStoreTerritory().coordinates;

  const { data, isLoading } = useSquares().getOne({ id, enabled: !!id && sideSquareInfoOpen });
  const [formData, setFormData] = useState<SquareProps>(initialFormValues);
  const {
    mutate: insertOne,
    isPending: insertOneIsPending,
    isSuccess: insertOneIsSuccess,
  } = useSquares().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
  } = useSquares().update();
  const { mutate: deleteOne } = useSquares().deleteOne();

  async function onSubmit() {
    try {
      if (!formData.coordinates) {
        throw new Error("Coordenadas inválidas!");
      }
      if (!formData.territory_number) {
        throw new Error("Informe o número do território da quadra!");
      }
      if (!formData.letter) {
        throw new Error("Informe a letra identificadora da quadra!");
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

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);
  const isPending = insertOneIsPending || updateIsPending || isLoading;

  return (
    <Sheet onOpenChange={handleClose} open={sideSquareInfoOpen}>
      <SheetContent className="h-full flex flex-col justify-between">
        <div>
          <SheetHeader>
            <SheetTitle>{id ? "Quadra" : "Criar Quadra"}</SheetTitle>
            <SheetDescription>
              {id
                ? "Esses são todos os dados referentes a essa quadra"
                : "Coloque aqui todos os dados referentes a quadra a ser criada"}
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <Skeleton className="w-full min-h-[40dvh] bg-secondary my-4" />
          ) : (
            <section className="flex flex-col gap-2 py-4 z-[100] w-full">
              <InputWithLabel
                label="Número do Território"
                className={"flex-1 min-w-[15ch]"}
                value={String(formData.territory_number)}
                onChange={(e) => setFormData({ ...formData, territory_number: e.target.value })}
                readOnly={!editing || isPending}
                type="number"
                step="1"
              />
              <InputWithLabel
                label="Letra da Quadra"
                className={"flex-1 min-w-[15ch]"}
                value={String(formData.letter)}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase(); // Força maiúscula
                  if (/^[A-Z]?$/.test(value)) {
                    // Permite apenas uma letra maiúscula
                    setFormData({ ...formData, letter: value });
                  }
                }}
                readOnly={!editing || isPending}
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
          <div className="flex justify-end gap-2">
            {hasRole(["admin"]) && (
              <AlertPopUp
                title={`Deseja realmente remover essa quadra?`}
                description="Essa quadra será definitivamente removida do servidor."
                action={() => {
                  handleClose();
                  deleteOne(formData._id || "");
                }}
              >
                <Button variant={"destructive"} title="Designar">
                  <Trash size={18} className="me-2" />
                  Remover Quadra
                </Button>
              </AlertPopUp>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SquareSideInfo;
