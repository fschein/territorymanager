"use client";

import { useStoreTerritory } from "@/app/main/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSquares } from "@/hooks/useSquares";

const AlertRemoveSquare = () => {
  const id_square = useStoreTerritory().id_square;
  const open = useStoreTerritory().alertRemoveSquareOpen;
  const closeAlert = useStoreTerritory().closeAlertRemoveSquare;
  const { mutate: deleteSquare } = useSquares().deleteOne();
  return (
    <AlertDialog open={open} onOpenChange={closeAlert}>
      <AlertDialogContent className="max-w-[90vw] w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja remover essa quadra?</AlertDialogTitle>
          <AlertDialogDescription>
            Ela será definitivamente removida do servidor
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex ">
          <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteSquare(id_square)}
            className="flex-1 bg-destructive hover:opacity-90 text-white"
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertRemoveSquare;
