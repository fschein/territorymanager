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
import { useState } from "react";
import { Button, ButtonProps } from "../../components/ui/button";

type ButtonDateProps = ButtonProps & {
  action: (date: Date) => void;
  headerTitle?: string;
  placeholder?: string;
  description?: string;
  equalText?: boolean;
  stopPropagation?: boolean;
};

const ButtonDate = ({
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
}: ButtonDateProps) => {
  const [date, setDate] = useState<Date>(new Date());

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
            {headerTitle || "Digite o date para poder prosseguir"}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={description ? "mt-1 whitespace-pre text-wrap" : "hidden"}
          >
            {description}
          </AlertDialogDescription>
          <InputDate value={date} onChange={setDate} className="w-full" />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              action(date);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ButtonDate;
