"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Toption = {
  value: string;
  label: string;
};
interface IFormSelectRole {
  name?: string;
  type?: string;
  control?: Control<any>;
  label?: string;
  description?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  placeholder?: string;

  value?: string;
  showAll?: boolean;

  onChange?: (id?: string) => void;
}

export const roleOptions: Toption[] = [
  {
    value: "elder",
    label: "Ancião",
  },
  {
    value: "user",
    label: "Usuário",
  },
];
const FormSelectRole = ({
  name,
  type,

  control,
  label,
  description,
  className,
  selectClassName,
  showAll,
  disabled,
  readOnly,
  placeholder,

  value,
  onChange,
}: IFormSelectRole) => {
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={`flex-1 ${type === "hidden" && "hidden"} ${selectClassName}`}>
            {label && <FormLabel>{label}</FormLabel>}
            <Select
              disabled={disabled || readOnly}
              value={field.value}
              name={field.name}
              onValueChange={(event) => {
                field.onChange(event);
                if (typeof onChange === "function") {
                  onChange(event);
                }
              }}
            >
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder || "Selecione a Cor"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {showAll && (
                  <SelectItem key={"t"} value={"all"}>
                    Todos(as)
                  </SelectItem>
                )}
                {roleOptions &&
                  roleOptions.map((option) => {
                    return (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer"
                      >
                        {option.label}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select value={value} onValueChange={onChange} disabled={disabled || readOnly}>
        <SelectTrigger className={`w-[180px] ${className}`}>
          <SelectValue placeholder={placeholder || "Selecione a cor"} />
        </SelectTrigger>
        <SelectContent>
          {showAll && <SelectItem value="all">TODOS</SelectItem>}
          {roleOptions?.map((item: Toption) => (
            <SelectItem className="text-left" key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormSelectRole;
