import { cn } from "@/lib/utils";
import * as React from "react";
import { Control } from "react-hook-form";
import { Button } from "../ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface IFormInput {
  name: string;
  type?: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  description?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  fnMask?: (val: string) => void;
  min?: number;
  max?: number;
  icon?: React.ElementType;
  iconLeft?: boolean;
  step?: string;
  inputClass?: string;
  iconClass?: string;
  title?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface InputWithLabelProps {
  type?: string;
  label?: string;
  value: any;
  placeholder?: string;
  description?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  icon?: React.ElementType;
  iconLeft?: boolean;
  step?: string;
  inputClass?: string;
  iconClass?: string;
  labelClass?: string;
  title?: string;
  required?: boolean;
}

const InputWithLabel = ({
  label,
  className,
  icon: Icon,
  iconLeft,
  inputClass,
  iconClass,
  labelClass,
  ...props
}: InputWithLabelProps) => {
  return (
    <div className={`flex gap-2 flex-col ${className}`}>
      <label className={`text-sm font-medium ${labelClass}`}>{label}</label>
      <span className={`flex ${iconLeft && "flex-row-reverse"}`}>
        <Input
          {...props}
          className={`${inputClass} ${
            Icon && ` rounded-none ${iconLeft ? "rounded-r-md" : "rounded-l-md"}`
          }`}
        />
        {Icon && (
          <Button
            type={"button"}
            variant={"outline"}
            disabled={true}
            className={`flex items-center justify-center rounded-none p-2 ${
              iconLeft ? "rounded-l-md" : `rounded-r-md `
            } ${iconClass}`}
          >
            <Icon size={18} />
          </Button>
        )}
      </span>
    </div>
  );
};

interface InputFileProps {
  type?: string;
  label?: string;
  value?: any;
  placeholder?: string;
  description?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  icon?: React.ElementType;
  iconLeft?: boolean;
  step?: string;
  inputClass?: string;
  iconClass?: string;
  labelClass?: string;
  title?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  fileInputRef?: React.LegacyRef<HTMLInputElement>;
}
const InputFile = ({
  label,
  className,
  icon: Icon,
  iconLeft,
  inputClass,
  iconClass,
  labelClass,
  fileInputRef,
  onChange,
  ...props
}: InputFileProps) => {
  const [files, setFiles] = React.useState<FileList | null>();
  const handleChangeImportButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
    if (onChange) {
      onChange(event); // Passa o evento para permitir acesso a `event.target.files`
    }
  };
  return (
    <div className={`flex gap-2 flex-col ${className}`}>
      {label && <label className={`text-sm font-medium ${labelClass}`}>{label}</label>}
      <span
        className={`flex cursor-pointer group`}
        onClick={() => {
          //@ts-ignore Funciona
          fileInputRef.current && fileInputRef.current.click();
        }}
      >
        <div className="flex gap-2 border w-full rounded-md">
          <Button
            className="font-medium rounded-none h-full group-hover:opacity-80 transition-all"
            variant={"secondary"}
          >
            {props.multiple && files && files?.length > 0
              ? `${files.length} Arquivos Selecionados`
              : "Selecionar Arquivo"}
          </Button>
          <span className="flex flex-col gap-1 justify-center p-1">
            {(files && [...files].map((file) => <p key={`file-${file.name}`}>{file.name}</p>)) ||
              ""}
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          multiple={props.multiple}
          onChange={handleChangeImportButton}
          accept={props.accept}
        />
      </span>
    </div>
  );
};

export { Input, InputFile, InputWithLabel };

const FormInput = ({
  name,
  type,
  control,
  label,
  placeholder,
  description,
  readOnly,
  disabled,
  className,
  onBlur,
  onChange,
  onClick,
  fnMask,
  min,
  max,
  icon: Icon,
  iconLeft,
  step,
  inputClass,
  iconClass,
  title,
}: IFormInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={`${type === "hidden" && "hidden"} ${className} flex-1`}>
            {label && <FormLabel className="text-nowrap">{label}</FormLabel>}
            <FormControl className={`flex ${iconLeft && "flex-row-reverse"}`}>
              <div>
                <Input
                  ref={field.ref}
                  type={type || "text"}
                  name={field.name}
                  value={typeof fnMask === "function" ? fnMask(field.value) : field.value || ""}
                  title={title}
                  placeholder={placeholder}
                  readOnly={readOnly}
                  disabled={typeof disabled === "undefined" ? field.disabled : disabled}
                  onBlur={typeof onBlur == "undefined" ? field.onBlur : onBlur}
                  onChange={(event) => {
                    field.onChange(event);
                    if (typeof onChange === "function") {
                      onChange(event);
                    }
                  }}
                  onClick={(e) => onClick && onClick(e)}
                  min={min}
                  max={max}
                  step={step ? step : type === "number" ? "0.01" : undefined}
                  className={`oi ${inputClass} oi ${
                    Icon && ` rounded-none ${iconLeft ? "rounded-r-md" : "rounded-l-md"}`
                  }`}
                />
                {Icon && (
                  <Button
                    type={"button"}
                    variant={"outline"}
                    disabled={true}
                    className={`flex items-center justify-center rounded-none p-2 ${
                      iconLeft ? "rounded-l-md" : `rounded-r-md `
                    } ${iconClass}`}
                  >
                    <Icon size={18} />
                  </Button>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormInput;
