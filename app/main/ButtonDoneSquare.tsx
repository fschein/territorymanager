import { InputDate } from "@/components/custom/InputDate";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button, ButtonProps } from "../../components/ui/button";

type ButtonDoneSquareProps = ButtonProps & {
  action: (params: { date: Date; information?: string }) => void;
  headerTitle?: string;
  placeholder?: string;
  description?: string;
  equalText?: boolean;
  stopPropagation?: boolean;
};

const ButtonDoneSquare = ({
  children,
  action,
  variant,
  size,
  title,
  headerTitle,
  description,
  disabled,
  className,
  stopPropagation,
  style,
}: ButtonDoneSquareProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [information, setInformation] = useState<string>("");

  return (
    <AlertDialog>
      <AlertDialogTrigger type="button" asChild style={style}>
        <Button
          title={title}
          type="button"
          variant={variant}
          size={size}
          disabled={disabled}
          className={className}
          onClick={(e) => {
            if (stopPropagation) {
              e.stopPropagation();
            }
          }}
        >
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="w-fit"
        onClick={(e) => stopPropagation && e.stopPropagation()}
        onCloseAutoFocus={(e) => stopPropagation && e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="whitespace-pre">
            {headerTitle || "Digite a data para poder prosseguir"}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={description ? "mt-1 whitespace-pre text-wrap" : "hidden"}
          >
            {description}
          </AlertDialogDescription>
          <div className="flex flex-col space-y-2 pt-2">
            <Label className="text-left">Data de Conclusão</Label>
            <InputDate value={date} onChange={setDate} className="w-full" />
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            <Label className="text-left">Detalhes (opcional)</Label>
            <Textarea value={information} onChange={(e) => setInformation(e.target.value)} />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              action({ date, information });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ButtonDoneSquare;
