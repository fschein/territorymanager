"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { JSX } from "react";

interface TAlert {
  title: string;
  description?: string;
  children: JSX.Element;
  action: any;
  className?: string;
  open?: boolean;
  onOpenChange?: ((open: boolean) => void) | undefined;
  disabled?: boolean;
}

const AlertPopUp = ({
  title,
  description,
  children,
  action,
  className,
  open,
  onOpenChange,
  disabled,
}: TAlert) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger disabled={disabled} asChild className={className}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[90vw] w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex ">
          <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={action}
            disabled={disabled}
            className="flex-1 bg-destructive hover:opacity-90 text-white"
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertPopUp;
